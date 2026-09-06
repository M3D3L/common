export interface RedeemableComanda {
  memberCode?: string;
  redeemMemberMeal?: boolean;
}

export function shouldRedeemOnReady(order: RedeemableComanda): boolean {
  return Boolean(order.memberCode?.trim());
}
