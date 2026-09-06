import type {
  Member,
  Membership,
  MembershipPaymentRequest,
} from "~/types/membership";

export interface MembershipOffer {
  code: string;
  credits: number;
  price: number;
  currency: string;
}

export interface ApprovalOperation {
  action: "create" | "update";
  collection: string;
  id?: string;
  data: Record<string, unknown>;
}

export interface ApprovalOperationStore {
  create: (
    collection: string,
    data: Record<string, unknown>,
  ) => Promise<{ id: string }>;
  update: (
    collection: string,
    id: string,
    data: Record<string, unknown>,
  ) => Promise<unknown>;
  remove: (collection: string, id: string) => Promise<unknown>;
  get: (collection: string, id: string) => Promise<Record<string, unknown>>;
}

export async function applyApprovalOperations(
  store: ApprovalOperationStore,
  operations: ApprovalOperation[],
) {
  const rollbacks: Array<() => Promise<unknown>> = [];
  try {
    for (const operation of operations) {
      if (operation.action === "create") {
        const created = await store.create(
          operation.collection,
          operation.data,
        );
        rollbacks.push(() => store.remove(operation.collection, created.id));
        continue;
      }

      const id = operation.id!;
      const current = await store.get(operation.collection, id);
      const previous = Object.fromEntries(
        Object.keys(operation.data).map((key) => [key, current[key]]),
      );
      await store.update(operation.collection, id, operation.data);
      rollbacks.push(() => store.update(operation.collection, id, previous));
    }
  } catch (error) {
    const failures: unknown[] = [];
    for (const rollback of rollbacks.reverse()) {
      try {
        await rollback();
      } catch (rollbackError) {
        failures.push(rollbackError);
      }
    }
    if (failures.length) {
      throw new Error(
        "Approval failed and could not be fully rolled back; inspect the payment request before retrying",
        { cause: error },
      );
    }
    throw error;
  }
}

export function buildMembershipPaymentApproval(input: {
  request: MembershipPaymentRequest;
  offer: MembershipOffer;
  staffId: string;
  member?: Member;
  membership?: Membership | null;
  memberId: string;
  membershipId: string;
  redemptionId: string;
  memberCode?: string;
  now: string;
}): ApprovalOperation[] {
  const {
    request,
    offer,
    staffId,
    member,
    membership,
    memberId,
    membershipId,
    redemptionId,
    memberCode,
    now,
  } = input;

  if (request.status !== "submitted") {
    throw new Error("Only submitted payment requests can be approved");
  }
  if (request.offer_code !== offer.code) {
    throw new Error("The payment request offer is no longer recognized");
  }
  if (!staffId) throw new Error("A staff account is required");
  if (!Number.isInteger(offer.credits) || offer.credits <= 0) {
    throw new Error("Offer credits must be a positive integer");
  }
  if (!Number.isFinite(offer.price) || offer.price <= 0) {
    throw new Error("Offer price must be positive");
  }
  if (!member && !memberCode) {
    throw new Error("A member code is required for a new member");
  }
  if (membership && membership.member !== memberId) {
    throw new Error("The membership does not belong to the selected member");
  }

  const operations: ApprovalOperation[] = [];
  if (!member) {
    operations.push({
      action: "create",
      collection: "members",
      data: {
        id: memberId,
        name: request.name.trim(),
        phone: request.phone.trim(),
        address: request.address?.trim() ?? "",
        member_code: memberCode,
        status: "active",
        total_orders: 0,
        joined_date: now,
      },
    });
  }

  if (membership) {
    operations.push({
      action: "update",
      collection: "memberships",
      id: membership.id,
      data: {
        credits_total: membership.credits_total + offer.credits,
        status: "active",
      },
    });
  } else {
    operations.push({
      action: "create",
      collection: "memberships",
      data: {
        id: membershipId,
        member: memberId,
        period: now.slice(0, 7),
        credits_total: offer.credits,
        credits_used: 0,
        issued_date: now,
        expires_date: "9999-12-31T23:59:59.999Z",
        status: "active",
        issued_by: staffId,
      },
    });
  }

  const appliedMembershipId = membership?.id ?? membershipId;
  operations.push(
    {
      action: "create",
      collection: "redemptions",
      data: {
        id: redemptionId,
        membership: appliedMembershipId,
        member: memberId,
        payment_request: request.id,
        redeemed_at: now,
        redeemed_by: staffId,
        kind: "topup_note",
        amount: 0,
        reason: `${offer.credits} creditos por ${offer.price} ${offer.currency}`,
        voided: false,
      },
    },
    {
      action: "update",
      collection: "membership_payment_requests",
      id: request.id,
      data: {
        status: "approved",
        member: memberId,
        membership: appliedMembershipId,
        approved_amount: offer.price,
        approved_credits: offer.credits,
        reviewed_by: staffId,
        reviewed_at: now,
        applied_at: now,
      },
    },
  );

  return operations;
}
