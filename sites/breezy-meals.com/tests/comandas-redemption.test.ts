import assert from "node:assert/strict";
import test from "node:test";

import { shouldRedeemOnReady } from "../utils/comandasRedemption.ts";

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
