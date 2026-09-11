import assert from "node:assert/strict";
import test from "node:test";

import {
  comandaCreatePayload,
  planComandaLines,
  pocketBaseDateTime,
  typedComandaFields,
} from "../lib/comanda-record.ts";

const order = {
  id: "7-1788700000000",
  number: 7,
  cart: { Birria: 2 },
  mode: "domicilio" as const,
  note: "",
  fulfillDate: "2026-09-07",
  customer: { name: "Ada", phone: "6620000000", address: "Centro" },
  createdAt: 1788700000000,
  pricingSubtotal: 250,
  deliveryFee: 30,
  pricingTotal: 280,
};

test("creates searchable order fields beside the immutable snapshot", () => {
  const payload = comandaCreatePayload(order);

  assert.equal(payload.data, order);
  assert.deepEqual(typedComandaFields(order), {
    order_uid: "7-1788700000000",
    order_number: 7,
    status: "active",
    mode: "domicilio",
    placed_at: new Date(1788700000000).toISOString(),
    fulfill_date: "2026-09-07",
    customer_name: "Ada",
    customer_phone: "6620000000",
    customer_address: "Centro",
    subtotal: 250,
    delivery_fee: 30,
    total: 280,
    snapshot_hash: payload.snapshot_hash,
  });
});

test("omits absent optional values without changing the order", () => {
  const minimal = { ...order, customer: undefined, pricingTotal: undefined };
  const payload = comandaCreatePayload(minimal, "snapshot");

  assert.equal(payload.snapshot, minimal);
  assert.equal("customer_name" in payload, false);
  assert.equal("total" in payload, false);
});

test("formats date filters for PocketBase", () => {
  assert.equal(
    pocketBaseDateTime(new Date("2026-09-10T07:00:00.000Z")),
    "2026-09-10 07:00:00.000Z",
  );
});

test("plans order-line replacements before deleting surplus rows", () => {
  const plan = planComandaLines("comanda-1", order, [
    {
      id: "line-1",
      comanda: "comanda-1",
      item_name: "Birria",
      quantity: 1,
      sort_order: 1,
    },
    {
      id: "line-2",
      comanda: "comanda-1",
      item_name: "Extra",
      quantity: 1,
      sort_order: 2,
    },
  ]);

  assert.deepEqual(plan.upserts, [
    {
      id: "line-1",
      data: {
        comanda: "comanda-1",
        item_name: "Birria",
        quantity: 2,
        sort_order: 1,
        legacy_payload: { name: "Birria", quantity: 2 },
      },
    },
  ]);
  assert.deepEqual(plan.deletes, ["line-2"]);
});
