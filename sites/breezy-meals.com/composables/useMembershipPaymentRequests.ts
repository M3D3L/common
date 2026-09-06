import type { RecordModel } from "pocketbase";

import usePocketBase from "@common/composables/usePocketbase";
import useMembers from "~/composables/useMembers";
import useMemberships from "~/composables/useMemberships";
import type {
  Member,
  MembershipPaymentMethod,
  MembershipPaymentRequest,
} from "~/types/membership";
import {
  applyApprovalOperations,
  buildMembershipPaymentApproval,
  type MembershipOffer,
} from "~/utils/membershipPayment";

interface PublicMembershipOffer extends MembershipOffer {
  label: string;
  bank: {
    bankName: string;
    accountHolder: string;
    clabe: string;
    reference: string;
  };
}

const COLLECTION = "membership_payment_requests";

export default function useMembershipPaymentRequests() {
  const pb = usePocketBase();
  const core = usePocketBaseCore();
  const members = useMembers();
  const memberships = useMemberships();
  const runtimeConfig = useRuntimeConfig();
  const offer = runtimeConfig.public.membershipOffer as PublicMembershipOffer;

  const submit = async (data: {
    name: string;
    phone: string;
    address?: string;
    existingMemberCode?: string;
    paymentMethod: MembershipPaymentMethod;
    paymentProof?: File;
  }): Promise<MembershipPaymentRequest> => {
    if (!data.name.trim() || !data.phone.trim()) {
      throw new Error("Nombre y telefono son obligatorios");
    }
    if (data.paymentMethod === "transfer" && !data.paymentProof) {
      throw new Error("Adjunta el comprobante de transferencia");
    }

    const form = new FormData();
    form.set("name", data.name.trim());
    form.set("phone", data.phone.trim());
    form.set("address", data.address?.trim() ?? "");
    form.set(
      "existing_member_code",
      data.existingMemberCode?.trim().toUpperCase() ?? "",
    );
    form.set("payment_method", data.paymentMethod);
    form.set("offer_code", offer.code);
    form.set("status", "submitted");
    if (data.paymentProof) form.set("payment_proof", data.paymentProof);

    return (await pb
      .collection(COLLECTION)
      .create(form)) as MembershipPaymentRequest;
  };

  const list = async () => {
    const first = await core.fetchCollection(
      COLLECTION,
      1,
      100,
      "",
      "-created",
      "member,membership,reviewed_by",
      null,
      true,
    );
    const rest = await Promise.all(
      Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, index) =>
        core.fetchCollection(
          COLLECTION,
          index + 2,
          100,
          "",
          "-created",
          "member,membership,reviewed_by",
          null,
          true,
        ),
      ),
    );
    return [
      ...(first.items as MembershipPaymentRequest[]),
      ...rest.flatMap((page) => page.items as MembershipPaymentRequest[]),
    ];
  };

  const randomId = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
    const bytes = crypto.getRandomValues(new Uint8Array(15));
    return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join(
      "",
    );
  };

  const approve = async (
    request: MembershipPaymentRequest,
    selectedMember?: Member,
  ) => {
    const staffId = pb.authStore.record?.id ?? "";
    if (!staffId) throw new Error("Inicia sesion para aprobar pagos");

    const member = selectedMember;
    const memberId = member?.id ?? randomId();
    const memberCode = member
      ? undefined
      : await members.generateCode(request.name);
    const membership = member
      ? await memberships.getActiveMembership(member.id)
      : null;

    const operations = buildMembershipPaymentApproval({
      request,
      offer,
      staffId,
      member,
      membership,
      memberId,
      membershipId: randomId(),
      redemptionId: randomId(),
      memberCode,
      now: new Date().toISOString(),
    });

    const batch = pb.createBatch();
    for (const operation of operations) {
      const collection = batch.collection(operation.collection);
      if (operation.action === "create") {
        collection.create(operation.data);
      } else {
        collection.update(operation.id!, operation.data);
      }
    }
    try {
      await batch.send();
    } catch (error: any) {
      if (error?.status !== 404) throw error;
      await applyApprovalOperations(
        {
          create: (collection, data) =>
            pb.collection(collection).create(data) as Promise<{ id: string }>,
          update: (collection, id, data) =>
            pb.collection(collection).update(id, data),
          remove: (collection, id) => pb.collection(collection).delete(id),
          get: (collection, id) =>
            pb.collection(collection).getOne(id) as Promise<
              Record<string, unknown>
            >,
        },
        operations,
      );
    }
    for (const collection of [
      COLLECTION,
      "members",
      "memberships",
      "redemptions",
    ]) {
      core.invalidateCollectionCache(collection);
    }
  };

  const reject = async (
    request: MembershipPaymentRequest,
    reviewNote: string,
  ) => {
    if (request.status !== "submitted") {
      throw new Error("Esta solicitud ya fue revisada");
    }
    const staffId = pb.authStore.record?.id ?? "";
    if (!staffId) throw new Error("Inicia sesion para rechazar pagos");
    await core.updateItem(COLLECTION, request.id, {
      status: "rejected",
      reviewed_by: staffId,
      reviewed_at: new Date().toISOString(),
      review_note: reviewNote.trim(),
    });
  };

  const remove = (request: MembershipPaymentRequest) =>
    core.deleteItem(COLLECTION, request.id);

  const getReceiptUrl = async (request: MembershipPaymentRequest) => {
    if (!request.payment_proof) return "";
    const token = await pb.files.getToken();
    return pb.files.getURL(request as RecordModel, request.payment_proof, {
      token,
    });
  };

  return {
    offer,
    submit,
    list,
    approve,
    reject,
    remove,
    getReceiptUrl,
  };
}
