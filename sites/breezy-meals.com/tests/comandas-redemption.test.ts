import assert from "node:assert/strict";
import test from "node:test";

import {
  redemptionReasonForOrder,
  shouldRedeemOnReady,
} from "../utils/comandasRedemption.ts";

test("marking a member comanda ready redeems regardless of promo metadata", () => {
  assert.equal(shouldRedeemOnReady({ memberCode: "GM4218" }), true);
  assert.equal(
    shouldRedeemOnReady({ memberCode: "GM4218", redeemMemberMeal: false }),
    true,
  );
});

test("marking a comanda without a member code ready does not redeem", () => {
  assert.equal(shouldRedeemOnReady({}), false);
  assert.equal(shouldRedeemOnReady({ memberCode: "   " }), false);
});

test("a completed comanda records its order and promotion context", () => {
  assert.equal(
    redemptionReasonForOrder({
      number: 4,
      memberCode: "GM4218",
      promo: { label: "Combo comida completa" },
    }),
    "Comanda #4 · Combo comida completa",
  );
  assert.equal(
    redemptionReasonForOrder({ number: 5, memberCode: "GM4218" }),
    "Comanda #5",
  );
});

test("redeeming a ready comanda increments credits used by one", async (t) => {
  const updates: Array<
    [collection: string, id: string, data: Record<string, unknown>]
  > = [];
  const previousCore = (
    globalThis as typeof globalThis & { usePocketBaseCore?: unknown }
  ).usePocketBaseCore;

  (
    globalThis as typeof globalThis & { usePocketBaseCore?: unknown }
  ).usePocketBaseCore = () => ({
    createItem: async () => ({ id: "redemption-1" }),
    updateItem: async (
      collection: string,
      id: string,
      data: Record<string, unknown>,
    ) => {
      updates.push([collection, id, data]);
      return data;
    },
    fetchRecord: async () => ({ total_orders: 0 }),
    fetchCollection: async () => ({ items: [], totalItems: 0 }),
  });
  t.after(() => {
    (
      globalThis as typeof globalThis & { usePocketBaseCore?: unknown }
    ).usePocketBaseCore = previousCore;
  });

  const { default: useRedemptions } =
    await import("../composables/useRedemptions.ts");
  const { remaining } = await useRedemptions().redeem(
    {
      id: "membership-1",
      member: "member-1",
      credits_total: 50,
      credits_used: 7,
    } as never,
    { staffId: "staff-1" },
  );

  assert.equal(remaining, 42);
  assert.deepEqual(
    updates.find(([collection]) => collection === "memberships"),
    ["memberships", "membership-1", { credits_used: 8, status: "active" }],
  );
});

test("administrative annul bypasses stale membership cache and returns one credit", async (t) => {
  const updates: Array<
    [collection: string, id: string, data: Record<string, unknown>]
  > = [];
  let voided = false;
  let membershipUsed = 7;
  let fetchedMembershipFresh = false;
  const previousCore = (
    globalThis as typeof globalThis & { usePocketBaseCore?: unknown }
  ).usePocketBaseCore;

  (
    globalThis as typeof globalThis & { usePocketBaseCore?: unknown }
  ).usePocketBaseCore = () => ({
    createItem: async (_collection: string, data: Record<string, unknown>) => ({
      id: "admin-redemption",
      ...data,
    }),
    updateItem: async (
      collection: string,
      id: string,
      data: Record<string, unknown>,
    ) => {
      updates.push([collection, id, data]);
      if (collection === "redemptions" && data.voided === true) voided = true;
      if (
        collection === "memberships" &&
        typeof data.credits_used === "number"
      ) {
        membershipUsed = data.credits_used;
      }
      return { id, ...data };
    },
    fetchRecord: async (
      collection: string,
      _id: string,
      ignoreCache = false,
    ) => {
      if (collection !== "memberships") return { total_orders: membershipUsed };
      fetchedMembershipFresh = ignoreCache;
      return {
        id: "membership-1",
        member: "member-1",
        credits_total: 50,
        // Reproduce the production regression: a normal cached read is one
        // redemption behind and would write the current value back unchanged.
        credits_used: ignoreCache ? membershipUsed : membershipUsed + 1,
        status: "active",
      };
    },
    fetchCollection: async () => ({
      items: [],
      // Deliberately inconsistent after annulment: the correction must return
      // exactly one credit instead of replacing the cache with this count.
      totalItems: voided ? 2 : 8,
    }),
  });
  t.after(() => {
    (
      globalThis as typeof globalThis & { usePocketBaseCore?: unknown }
    ).usePocketBaseCore = previousCore;
  });

  const { default: useRedemptions } =
    await import("../composables/useRedemptions.ts");
  const api = useRedemptions();
  const redemption = await api.createAdministrative({
    memberId: "member-1",
    membershipId: "membership-1",
    kind: "meal",
    amount: 1,
    redeemedAt: "2026-09-01T18:30:00.000Z",
    reason: "Captura atrasada",
    staffId: "staff-1",
  });

  assert.equal(redemption.redeemed_at, "2026-09-01T18:30:00.000Z");
  assert.ok(
    updates.some(
      ([collection, , data]) =>
        collection === "memberships" && data.credits_used === 8,
    ),
  );

  fetchedMembershipFresh = false;
  await api.voidAdministrative(redemption, "Registro duplicado");
  assert.equal(fetchedMembershipFresh, true);
  assert.ok(
    updates.some(
      ([collection, , data]) =>
        collection === "redemptions" &&
        data.voided === true &&
        data.void_reason === "Registro duplicado",
    ),
  );
  assert.ok(
    updates.some(
      ([collection, , data]) =>
        collection === "memberships" && data.credits_used === 7,
    ),
  );
});
