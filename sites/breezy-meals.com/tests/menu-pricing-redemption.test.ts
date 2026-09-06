import assert from "node:assert/strict";
import test from "node:test";

import { priceMenuOrder, type PricingConfig } from "../utils/menuPricing.ts";

const item = {
  name: "Dulce",
  group: "sweets",
  qty: 1,
  unitPrice: 40,
};

test("promo lines only carry explicitly configured redemption eligibility", () => {
  const basePromo = {
    id: "sweet-special",
    label: "Dulce especial",
    match: {
      requirements: [
        { targetType: "group" as const, target: "sweets", qty: 1 },
      ],
    },
    pricing: { amount: 30 },
  };

  const pricingOnly = priceMenuOrder({
    items: [item],
    config: { promos: [basePromo] },
  });
  assert.equal(pricingOnly.lines[0]?.redemption, undefined);

  const membershipConfig: PricingConfig = {
    promos: [
      {
        ...basePromo,
        redemption: { kind: "membership_meal", credits: 1 },
      },
    ],
  };
  const membership = priceMenuOrder({
    items: [item],
    config: membershipConfig,
  });
  assert.deepEqual(membership.lines[0]?.redemption, {
    kind: "membership_meal",
    credits: 1,
  });
});
