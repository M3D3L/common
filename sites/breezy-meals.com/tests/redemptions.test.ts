import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";

interface CoreOverrides {
  createItem?: (
    collection: string,
    data: Record<string, unknown>,
  ) => Promise<Record<string, unknown>>;
  updateItem?: (
    collection: string,
    id: string,
    data: Record<string, unknown>,
  ) => Promise<Record<string, unknown>>;
  fetchRecord?: (
    collection: string,
    id: string,
    ignoreCache?: boolean,
  ) => Promise<Record<string, unknown>>;
  fetchCollection?: (...args: unknown[]) => Promise<Record<string, unknown>>;
}

function installCore(t: TestContext, overrides: CoreOverrides = {}) {
  const creates: Array<[string, Record<string, unknown>]> = [];
  const updates: Array<[string, string, Record<string, unknown>]> = [];
  const fetches: Array<[string, string, boolean | undefined]> = [];
  const lists: unknown[][] = [];
  const previousCore = (
    globalThis as typeof globalThis & { usePocketBaseCore?: unknown }
  ).usePocketBaseCore;

  (
    globalThis as typeof globalThis & { usePocketBaseCore?: unknown }
  ).usePocketBaseCore = () => ({
    createItem: async (collection: string, data: Record<string, unknown>) => {
      creates.push([collection, data]);
      return overrides.createItem
        ? overrides.createItem(collection, data)
        : { id: "created-record", ...data };
    },
    updateItem: async (
      collection: string,
      id: string,
      data: Record<string, unknown>,
    ) => {
      updates.push([collection, id, data]);
      return overrides.updateItem
        ? overrides.updateItem(collection, id, data)
        : { id, ...data };
    },
    fetchRecord: async (
      collection: string,
      id: string,
      ignoreCache?: boolean,
    ) => {
      fetches.push([collection, id, ignoreCache]);
      return overrides.fetchRecord
        ? overrides.fetchRecord(collection, id, ignoreCache)
        : collection === "memberships"
          ? {
              id,
              member: "member-1",
              credits_total: 10,
              credits_used: 4,
              status: "active",
            }
          : { id, total_orders: 3 };
    },
    fetchCollection: async (...args: unknown[]) => {
      lists.push(args);
      return overrides.fetchCollection
        ? overrides.fetchCollection(...args)
        : { items: [], totalItems: 0 };
    },
  });

  t.after(() => {
    (
      globalThis as typeof globalThis & { usePocketBaseCore?: unknown }
    ).usePocketBaseCore = previousCore;
  });

  return { creates, updates, fetches, lists };
}

async function getApi() {
  const { default: useRedemptions } =
    await import("../composables/useRedemptions.ts");
  return useRedemptions();
}

const membership = (overrides: Record<string, unknown> = {}) =>
  ({
    id: "membership-1",
    member: "member-1",
    credits_total: 10,
    credits_used: 4,
    status: "active",
    ...overrides,
  }) as never;

const redemption = (overrides: Record<string, unknown> = {}) =>
  ({
    id: "redemption-1",
    membership: "membership-1",
    member: "member-1",
    redeemed_at: "2026-09-05T18:00:00.000Z",
    kind: "meal",
    amount: 1,
    voided: false,
    ...overrides,
  }) as never;

test("an exhausted membership cannot redeem another meal", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  await assert.rejects(
    api.redeem(membership({ credits_total: 10, credits_used: 10 })),
    /No credits remaining/,
  );
  assert.equal(calls.creates.length, 0);
  assert.equal(calls.updates.length, 0);
});

test("redeeming the final credit exhausts the membership", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  const result = await api.redeem(
    membership({ credits_total: 5, credits_used: 4 }),
    { staffId: "staff-1", reason: "  Comanda #9  " },
  );

  assert.equal(result.remaining, 0);
  assert.equal(calls.creates[0]?.[0], "redemptions");
  assert.deepEqual(
    {
      membership: calls.creates[0]?.[1].membership,
      member: calls.creates[0]?.[1].member,
      kind: calls.creates[0]?.[1].kind,
      amount: calls.creates[0]?.[1].amount,
      redeemed_by: calls.creates[0]?.[1].redeemed_by,
      reason: calls.creates[0]?.[1].reason,
      voided: calls.creates[0]?.[1].voided,
    },
    {
      membership: "membership-1",
      member: "member-1",
      kind: "meal",
      amount: 1,
      redeemed_by: "staff-1",
      reason: "Comanda #9",
      voided: false,
    },
  );
  assert.ok(
    calls.updates.some(
      ([collection, , data]) =>
        collection === "memberships" &&
        data.credits_used === 5 &&
        data.status === "exhausted",
    ),
  );
});

test("voiding an already voided meal is idempotent", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  await api.voidRedemption(
    redemption({ voided: true }),
    membership(),
    "Duplicate",
  );

  assert.equal(calls.updates.length, 0);
});

test("voiding a meal never makes credits_used negative", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  await api.voidRedemption(
    redemption(),
    membership({ credits_used: 0, status: "exhausted" }),
    "Correction",
  );

  assert.ok(
    calls.updates.some(
      ([collection, , data]) =>
        collection === "memberships" &&
        data.credits_used === 0 &&
        data.status === "active",
    ),
  );
});

test("administrative annulment requires a reason", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  await assert.rejects(
    api.voidAdministrative(redemption(), "   "),
    /reason is required/i,
  );
  assert.equal(calls.updates.length, 0);
});

test("restoring an active redemption is idempotent", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  await api.restoreAdministrative(redemption({ voided: false }));

  assert.equal(calls.updates.length, 0);
  assert.equal(calls.lists.length, 0);
});

test("restoring a meal reapplies the ledger count and member activity", async (t) => {
  const calls = installCore(t, {
    fetchCollection: async () => ({ items: [], totalItems: 5 }),
  });
  const api = await getApi();

  await api.restoreAdministrative(
    redemption({ voided: true, void_reason: "Duplicate" }),
  );

  assert.ok(
    calls.updates.some(
      ([collection, id, data]) =>
        collection === "redemptions" &&
        id === "redemption-1" &&
        data.voided === false &&
        data.void_reason === "",
    ),
  );
  assert.ok(
    calls.updates.some(
      ([collection, , data]) =>
        collection === "memberships" &&
        data.credits_used === 5 &&
        data.status === "active",
    ),
  );
  assert.ok(
    calls.updates.some(
      ([collection, , data]) =>
        collection === "members" && data.total_orders === 4,
    ),
  );
});

test("credit adjustments require a nonzero amount and reason", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  await assert.rejects(
    api.adjustCredits(membership(), 0, "Gift"),
    /non-zero number/i,
  );
  await assert.rejects(
    api.adjustCredits(membership(), 1, "  "),
    /reason is required/i,
  );
  assert.equal(calls.creates.length, 0);
  assert.equal(calls.updates.length, 0);
});

test("positive adjustment adds credits and records its reason", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  const result = await api.adjustCredits(
    membership(),
    3,
    "  Loyalty gift  ",
    "staff-1",
  );

  assert.equal(result.credits_total, 13);
  assert.equal(calls.creates[0]?.[0], "redemptions");
  assert.deepEqual(
    {
      kind: calls.creates[0]?.[1].kind,
      amount: calls.creates[0]?.[1].amount,
      reason: calls.creates[0]?.[1].reason,
      redeemed_by: calls.creates[0]?.[1].redeemed_by,
    },
    {
      kind: "adjustment",
      amount: 3,
      reason: "Loyalty gift",
      redeemed_by: "staff-1",
    },
  );
  assert.ok(
    calls.updates.some(
      ([collection, , data]) =>
        collection === "memberships" &&
        data.credits_total === 13 &&
        data.status === "active",
    ),
  );
});

test("negative adjustment cannot reduce total below used credits", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  const result = await api.adjustCredits(
    membership({ credits_total: 10, credits_used: 8 }),
    -5,
    "Correction",
  );

  assert.equal(result.credits_total, 8);
  assert.equal(calls.creates[0]?.[1].amount, -2);
  assert.ok(
    calls.updates.some(
      ([collection, , data]) =>
        collection === "memberships" &&
        data.credits_total === 8 &&
        data.status === "exhausted",
    ),
  );
});

test("voiding an adjustment reverses its credit total", async (t) => {
  const calls = installCore(t, {
    fetchRecord: async (collection, id) =>
      collection === "memberships"
        ? {
            id,
            member: "member-1",
            credits_total: 13,
            credits_used: 4,
            status: "active",
          }
        : { id, total_orders: 3 },
  });
  const api = await getApi();

  await api.voidAdministrative(
    redemption({ kind: "adjustment", amount: 3 }),
    "Gift entered twice",
  );

  assert.ok(
    calls.updates.some(
      ([collection, , data]) =>
        collection === "memberships" && data.credits_total === 10,
    ),
  );
});

test("restoring an adjustment reapplies its credit total", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  await api.restoreAdministrative(
    redemption({ kind: "adjustment", amount: 3, voided: true }),
  );

  assert.ok(
    calls.updates.some(
      ([collection, , data]) =>
        collection === "memberships" && data.credits_total === 13,
    ),
  );
});

test("recalculation rebuilds credits_used from active meal rows", async (t) => {
  const calls = installCore(t, {
    fetchCollection: async () => ({ items: [], totalItems: 10 }),
  });
  const api = await getApi();

  const used = await api.recalculate(
    membership({ credits_total: 10, credits_used: 2 }),
  );

  assert.equal(used, 10);
  assert.equal(calls.lists[0]?.[7], true);
  assert.ok(
    calls.updates.some(
      ([collection, , data]) =>
        collection === "memberships" &&
        data.credits_used === 10 &&
        data.status === "exhausted",
    ),
  );
});

test("administrative records normalize amounts and preserve backdated time", async (t) => {
  const calls = installCore(t, {
    fetchCollection: async () => ({ items: [], totalItems: 5 }),
  });
  const api = await getApi();

  await api.createAdministrative({
    memberId: "member-1",
    membershipId: "membership-1",
    kind: "meal",
    amount: 99,
    redeemedAt: "2026-08-15T18:30:00.000Z",
    reason: " Backdated meal ",
  });
  await api.createAdministrative({
    memberId: "member-1",
    membershipId: "membership-1",
    kind: "topup_note",
    amount: 99,
    redeemedAt: "2026-08-16T18:30:00.000Z",
  });

  assert.deepEqual(
    calls.creates.map(([, data]) => ({
      kind: data.kind,
      amount: data.amount,
      redeemed_at: data.redeemed_at,
      reason: data.reason,
    })),
    [
      {
        kind: "meal",
        amount: 1,
        redeemed_at: "2026-08-15T18:30:00.000Z",
        reason: "Backdated meal",
      },
      {
        kind: "topup_note",
        amount: 0,
        redeemed_at: "2026-08-16T18:30:00.000Z",
        reason: "",
      },
    ],
  );
});

test("editing meal metadata does not change its membership balance", async (t) => {
  const calls = installCore(t, {
    fetchCollection: async () => ({ items: [], totalItems: 4 }),
  });
  const api = await getApi();

  await api.updateAdministrative(redemption(), {
    memberId: "member-1",
    membershipId: "membership-1",
    kind: "meal",
    amount: 1,
    redeemedAt: "2026-09-04T18:00:00.000Z",
    reason: "Corrected description",
  });

  const membershipUpdates = calls.updates.filter(
    ([collection]) => collection === "memberships",
  );
  assert.deepEqual(membershipUpdates, [
    ["memberships", "membership-1", { credits_used: 4, status: "active" }],
  ]);
  assert.equal(
    calls.updates.some(([collection]) => collection === "members"),
    false,
  );
});

test("reassigning a meal reconciles both memberships and member activity", async (t) => {
  const calls = installCore(t, {
    fetchRecord: async (collection, id) => {
      if (collection === "memberships") {
        return {
          id,
          member: id === "membership-old" ? "member-old" : "member-new",
          credits_total: 10,
          credits_used: 4,
          status: "active",
        };
      }
      return { id, total_orders: 10 };
    },
    fetchCollection: async (...args) => {
      const filter = String(args[3]);
      return {
        items: [],
        totalItems: filter.includes("membership-old") ? 3 : 5,
      };
    },
  });
  const api = await getApi();

  await api.updateAdministrative(
    redemption({ membership: "membership-old", member: "member-old" }),
    {
      memberId: "member-new",
      membershipId: "membership-new",
      kind: "meal",
      amount: 1,
      redeemedAt: "2026-09-05T18:00:00.000Z",
      reason: "Moved to correct member",
    },
  );

  assert.ok(
    calls.updates.some(
      ([collection, id, data]) =>
        collection === "memberships" &&
        id === "membership-old" &&
        data.credits_used === 3,
    ),
  );
  assert.ok(
    calls.updates.some(
      ([collection, id, data]) =>
        collection === "memberships" &&
        id === "membership-new" &&
        data.credits_used === 5,
    ),
  );
  assert.ok(
    calls.updates.some(
      ([collection, id, data]) =>
        collection === "members" &&
        id === "member-old" &&
        data.total_orders === 9,
    ),
  );
  assert.ok(
    calls.updates.some(
      ([collection, id, data]) =>
        collection === "members" &&
        id === "member-new" &&
        data.total_orders === 11,
    ),
  );
});

test("top-up notes create an audit row without changing membership credits", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  await api.createAdministrative({
    memberId: "member-1",
    membershipId: "membership-1",
    kind: "topup_note",
    amount: 5,
    redeemedAt: "2026-09-05T18:00:00.000Z",
    reason: "Second payment",
  });

  assert.equal(calls.creates[0]?.[1].amount, 0);
  assert.equal(
    calls.updates.some(([collection]) => collection === "memberships"),
    false,
  );
});

test("administrative listing always bypasses cached ledger data", async (t) => {
  const calls = installCore(t);
  const api = await getApi();

  await api.listAdministrative();

  assert.equal(calls.lists[0]?.[7], true);
});
