export interface RedeemableComanda {
  memberCode?: string;
  redeemMemberMeal?: boolean;
}

export interface IdentifiedComanda extends RedeemableComanda {
  number: number;
  promo?: { label?: string };
}

export type ReadyAction = "redeem" | "payment-required" | "complete-paid";

export function lowBalanceNotice(remaining?: number): string {
  if (remaining === undefined || remaining < 0 || remaining > 3) return "";

  const meals = remaining === 1 ? "comida" : "comidas";
  return `⚠️ Te quedan ${remaining} ${meals} en tu membresía. Escríbenos para renovar.`;
}

export function shouldRedeemOnReady(order: RedeemableComanda): boolean {
  return Boolean(order.memberCode?.trim() && order.redeemMemberMeal);
}

export function requiresPaymentOnReady(order: RedeemableComanda): boolean {
  return !shouldRedeemOnReady(order);
}

export function readyAction(
  order: RedeemableComanda,
  paymentConfirmed = false,
): ReadyAction {
  if (shouldRedeemOnReady(order)) return "redeem";
  return paymentConfirmed ? "complete-paid" : "payment-required";
}

export function redemptionReasonForOrder(order: IdentifiedComanda): string {
  return [`Comanda #${order.number}`, order.promo?.label]
    .filter(Boolean)
    .join(" · ");
}
