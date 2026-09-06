export interface RedeemableComanda {
  memberCode?: string;
  redeemMemberMeal?: boolean;
}

export interface IdentifiedComanda extends RedeemableComanda {
  number: number;
  promo?: { label?: string };
}

export function shouldRedeemOnReady(order: RedeemableComanda): boolean {
  return Boolean(order.memberCode?.trim() && order.redeemMemberMeal);
}

export function redemptionReasonForOrder(order: IdentifiedComanda): string {
  return [`Comanda #${order.number}`, order.promo?.label]
    .filter(Boolean)
    .join(" · ");
}
