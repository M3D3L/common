import assert from "node:assert/strict";
import test from "node:test";

import {
  createCommerceMigrationPlan,
  type CommerceSnapshot,
} from "../lib/commerce-normalization.ts";

const menuRecord = {
  id: "menu-record-1",
  dishes: {
    guisos: [{ name: "Birria", price: 125 }],
    sides: ["Arroz"],
  },
  store: {
    bebidas: [{ name: "Agua", price: 25 }],
  },
  active: { guisos: ["Birria"] },
  active_date: "2026-09-06",
  sold_out: ["Arroz", "Sin catálogo"],
  week_blocks: [
    {
      id: "week-a",
      name: "Semana A",
      color: "#ef4444",
      days: { "1": { guisos: ["Birria", "No catalogado"] } },
    },
  ],
  rotation: ["week-a"],
  rotation_anchor: "2026-09-07",
  overrides: {
    "2026-09-14": { block: "week-a" },
    "2026-09-21": { closed: true },
  },
};

const comandaRecord = {
  id: "comanda-record-1",
  data: {
    id: "42-1788700000000",
    number: 42,
    cart: { Birria: 2, "Sin catálogo": 1 },
    mode: "domicilio",
    note: "Sin cebolla",
    fulfillDate: "2026-09-06",
    fulfillTime: "14:30",
    customer: {
      name: "Ada",
      phone: "6620000000",
      address: "Centro",
    },
    memberCode: "GM4218",
    pricingSubtotal: 250,
    deliveryFee: 30,
    pricingTotal: 280,
    createdAt: 1788700000000,
    promo: { id: "promo-1", label: "Comida completa", application: 1 },
  },
};

function snapshot(
  menu = [menuRecord],
  comandas = [comandaRecord],
): CommerceSnapshot {
  return {
    exportedAt: "2026-09-06T00:00:00.000Z",
    collections: { menu, comandas },
  };
}

test("builds relational menu rows and typed comanda copies", () => {
  const plan = createCommerceMigrationPlan(snapshot());

  assert.deepEqual(plan.counts, {
    menu_categories: 4,
    menu_items: 3,
    menu_week_blocks: 1,
    menu_week_days: 1,
    menu_day_items: 2,
    menu_schedules: 1,
    menu_rotation_slots: 1,
    menu_week_overrides: 2,
    menu_service_days: 1,
    menu_service_items: 3,
    comandas_updates: 1,
    comanda_lines: 2,
  });

  assert.equal(plan.updates.length, 1);
  assert.deepEqual(plan.updates[0].data, {
    order_uid: "42-1788700000000",
    order_number: 42,
    status: "active",
    mode: "domicilio",
    placed_at: new Date(1788700000000).toISOString(),
    fulfill_date: "2026-09-06",
    fulfill_time: "14:30",
    customer_name: "Ada",
    customer_phone: "6620000000",
    customer_address: "Centro",
    member_code: "GM4218",
    subtotal: 250,
    delivery_fee: 30,
    total: 280,
    promo_id: "promo-1",
    promo_label: "Comida completa",
    snapshot_hash: plan.updates[0].data.snapshot_hash,
  });
});

test("preserves exact mutable source payloads and uses one-based ordering", () => {
  const plan = createCommerceMigrationPlan(snapshot());
  const schedule = plan.rows.find((row) => row.collection === "menu_schedules");
  const block = plan.rows.find((row) => row.collection === "menu_week_blocks");
  const lines = plan.rows.filter((row) => row.collection === "comanda_lines");

  assert.deepEqual(schedule?.data.legacy_payload, menuRecord);
  assert.deepEqual(block?.data.legacy_payload, menuRecord.week_blocks[0]);
  assert.deepEqual(
    lines.map((row) => row.data.sort_order),
    [1, 2],
  );
  assert.deepEqual(lines[0].data.legacy_payload, {
    name: "Birria",
    quantity: 2,
  });
});

test("keeps unresolved names and reports them instead of guessing", () => {
  const plan = createCommerceMigrationPlan(snapshot());
  const missingDayItem = plan.rows.find(
    (row) =>
      row.collection === "menu_day_items" &&
      row.data.legacy_name === "No catalogado",
  );
  const unknownOrderLine = plan.rows.find(
    (row) =>
      row.collection === "comanda_lines" &&
      row.data.item_name === "Sin catálogo",
  );

  assert.equal(missingDayItem?.relationRefs?.item, undefined);
  assert.equal(unknownOrderLine?.relationRefs?.menu_item, undefined);
  assert.ok(plan.warnings.some((warning) => warning.includes("No catalogado")));
});

test("multiple menu records never duplicate comanda updates or lines", () => {
  const secondMenu = {
    ...menuRecord,
    id: "menu-record-2",
    active: {},
    active_date: "",
    sold_out: [],
  };
  const plan = createCommerceMigrationPlan(
    snapshot([menuRecord, secondMenu], [comandaRecord]),
  );

  assert.equal(plan.updates.length, 1);
  assert.equal(plan.counts.comandas_updates, 1);
  assert.equal(plan.counts.comanda_lines, 2);
  assert.equal(
    plan.rows.filter(
      (row) =>
        row.collection === "menu_categories" && row.data.key === "guisos",
    ).length,
    2,
  );
});

test("fingerprint and rows are deterministic", () => {
  const first = createCommerceMigrationPlan(snapshot());
  const second = createCommerceMigrationPlan(snapshot());

  assert.equal(first.sourceHash, second.sourceHash);
  assert.deepEqual(first, second);
});
