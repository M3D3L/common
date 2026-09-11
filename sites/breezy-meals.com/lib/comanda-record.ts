import { stableFingerprint } from "./legacy-normalization.ts";
import type { PlacedOrder } from "~/utils/comandas";
import type { NormalizedRecord } from "./normalized-domain.ts";

export interface ComandaLinePlan {
  upserts: Array<{
    id?: string;
    data: Record<string, unknown>;
  }>;
  deletes: string[];
}

function compact(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );
}

export function pocketBaseDateTime(value: Date): string {
  return value.toISOString().replace("T", " ");
}

export function typedComandaFields(
  order: PlacedOrder,
): Record<string, unknown> {
  const placedAt = new Date(order.createdAt);
  return compact({
    order_uid: order.id,
    order_number: order.number,
    status: "active",
    mode: order.mode,
    placed_at: Number.isNaN(placedAt.getTime())
      ? undefined
      : placedAt.toISOString(),
    fulfill_date: order.fulfillDate,
    fulfill_time: order.fulfillTime,
    customer_name: order.customer?.name,
    customer_phone: order.customer?.phone,
    customer_address: order.customer?.address,
    member_code: order.memberCode,
    subtotal: order.pricingSubtotal,
    delivery_fee: order.deliveryFee,
    total: order.pricingTotal,
    promo_id: order.promo?.id,
    promo_label: order.promo?.label,
    snapshot_hash: stableFingerprint(order),
  });
}

export function comandaCreatePayload(
  order: PlacedOrder,
  snapshotField = "data",
): Record<string, unknown> {
  return {
    [snapshotField]: order,
    ...typedComandaFields(order),
  };
}

export function planComandaLines(
  comandaId: string,
  order: PlacedOrder,
  existing: NormalizedRecord[],
): ComandaLinePlan {
  const current = [...existing].sort(
    (left, right) => Number(left.sort_order) - Number(right.sort_order),
  );
  const desired = Object.entries(order.cart).filter(
    ([, quantity]) => Number(quantity) > 0,
  );
  const upserts = desired.flatMap(([name, quantity], index) => {
    const data = {
      comanda: comandaId,
      item_name: name,
      quantity: Number(quantity),
      sort_order: index + 1,
      legacy_payload: { name, quantity },
    };
    const row = current[index];
    const unchanged =
      row &&
      row.comanda === comandaId &&
      row.item_name === name &&
      Number(row.quantity) === Number(quantity) &&
      Number(row.sort_order) === index + 1;
    return unchanged ? [] : [{ id: row?.id, data }];
  });
  return {
    upserts,
    deletes: current.slice(desired.length).map((row) => row.id),
  };
}
