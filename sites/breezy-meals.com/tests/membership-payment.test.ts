import assert from "node:assert/strict";
import test from "node:test";

import {
  applyApprovalOperations,
  buildMembershipPaymentApproval,
} from "../utils/membershipPayment.ts";

const request = {
  id: "request-1",
  name: " Ana Lopez ",
  phone: " 6221234567 ",
  address: " Centro ",
  payment_method: "transfer" as const,
  offer_code: "meal-pack-5",
  status: "submitted" as const,
  collectionId: "requests",
  collectionName: "membership_payment_requests",
  created: "2026-09-06 10:00:00.000Z",
  updated: "2026-09-06 10:00:00.000Z",
  expand: {},
};

const offer = {
  code: "meal-pack-5",
  credits: 5,
  price: 450,
  currency: "MXN",
};

test("plans atomic onboarding and snapshots the configured offer", () => {
  const operations = buildMembershipPaymentApproval({
    request,
    offer,
    staffId: "staff-1",
    memberId: "member-new",
    membershipId: "membership-new",
    redemptionId: "redemption-new",
    memberCode: "AL1234",
    now: "2026-09-06T20:00:00.000Z",
  });

  assert.deepEqual(
    operations.map(({ action, collection }) => [action, collection]),
    [
      ["create", "members"],
      ["create", "memberships"],
      ["create", "redemptions"],
      ["update", "membership_payment_requests"],
    ],
  );
  assert.equal(operations[1].data.credits_total, 5);
  assert.equal(operations[2].data.payment_request, "request-1");
  assert.equal(operations[3].data.approved_amount, 450);
  assert.equal(operations[3].data.approved_credits, 5);
});

test("tops up an existing member without creating duplicate identity", () => {
  const operations = buildMembershipPaymentApproval({
    request,
    offer,
    staffId: "staff-1",
    member: { id: "member-1" } as any,
    membership: {
      id: "membership-1",
      member: "member-1",
      credits_total: 7,
      credits_used: 2,
    } as any,
    memberId: "member-1",
    membershipId: "unused",
    redemptionId: "redemption-new",
    now: "2026-09-06T20:00:00.000Z",
  });

  assert.equal(operations.length, 3);
  assert.equal(operations[0].action, "update");
  assert.equal(operations[0].collection, "memberships");
  assert.equal(operations[0].data.credits_total, 12);
  assert.equal(operations[2].data.membership, "membership-1");
});

test("refuses replayed or mismatched requests", () => {
  assert.throws(
    () =>
      buildMembershipPaymentApproval({
        request: { ...request, status: "approved" },
        offer,
        staffId: "staff-1",
        memberId: "member-new",
        membershipId: "membership-new",
        redemptionId: "redemption-new",
        memberCode: "AL1234",
        now: "2026-09-06T20:00:00.000Z",
      }),
    /Only submitted/,
  );
  assert.throws(
    () =>
      buildMembershipPaymentApproval({
        request: { ...request, offer_code: "old-offer" },
        offer,
        staffId: "staff-1",
        memberId: "member-new",
        membershipId: "membership-new",
        redemptionId: "redemption-new",
        memberCode: "AL1234",
        now: "2026-09-06T20:00:00.000Z",
      }),
    /no longer recognized/,
  );
});

test("compatibility execution rolls back completed writes on failure", async () => {
  const records = new Map<string, Record<string, unknown>>([
    ["memberships:membership-1", { id: "membership-1", credits_total: 7 }],
    ["requests:request-1", { id: "request-1", status: "submitted" }],
  ]);
  const store = {
    create: async (collection: string, data: Record<string, unknown>) => {
      const id = String(data.id);
      records.set(`${collection}:${id}`, { ...data });
      return { id };
    },
    update: async (
      collection: string,
      id: string,
      data: Record<string, unknown>,
    ) => {
      if (collection === "requests" && data.status === "approved") {
        throw new Error("request update failed");
      }
      const key = `${collection}:${id}`;
      records.set(key, { ...records.get(key), ...data });
    },
    remove: async (collection: string, id: string) => {
      records.delete(`${collection}:${id}`);
    },
    get: async (collection: string, id: string) => ({
      ...records.get(`${collection}:${id}`),
    }),
  };

  await assert.rejects(
    applyApprovalOperations(store, [
      {
        action: "update",
        collection: "memberships",
        id: "membership-1",
        data: { credits_total: 12 },
      },
      {
        action: "create",
        collection: "redemptions",
        data: { id: "redemption-1" },
      },
      {
        action: "update",
        collection: "requests",
        id: "request-1",
        data: { status: "approved" },
      },
    ]),
    /request update failed/,
  );
  assert.equal(records.get("memberships:membership-1")?.credits_total, 7);
  assert.equal(records.has("redemptions:redemption-1"), false);
  assert.equal(records.get("requests:request-1")?.status, "submitted");
});
