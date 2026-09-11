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

test("incomplete order units are priced but do not activate promos", () => {
  const config: PricingConfig = {
    promos: [
      {
        id: "taquiza-tacos",
        label: "Promo 3 tacos",
        redemption: { kind: "membership_meal", credits: 1 },
        match: {
          requirements: [
            {
              targetType: "order-unit",
              target: "taquiza:tacos",
              qty: 1,
            },
          ],
        },
        pricing: { amount: 120 },
      },
    ],
  };
  const orderUnit = {
    code: "taquiza:tacos",
    label: "Orden de tacos",
    qty: 1,
    unitPrice: 120,
  };

  const incomplete = priceMenuOrder({
    items: [],
    orderUnits: [{ ...orderUnit, promoEligibleQty: 0 }],
    config,
  });
  assert.equal(incomplete.lines[0]?.kind, "order-unit");
  assert.equal(incomplete.total, 120);

  const complete = priceMenuOrder({
    items: [],
    orderUnits: [{ ...orderUnit, promoEligibleQty: 1 }],
    config,
  });
  assert.equal(complete.lines[0]?.kind, "promo");
  assert.equal(complete.lines[0]?.code, "taquiza-tacos");
});

test("charges items outside completed promos at their a la carte prices", () => {
  const combo: PricingConfig["promos"][number] = {
    id: "meal-combo",
    label: "Combo comida completa",
    match: {
      requirements: [
        { targetType: "group", target: "guisos", qty: 1 },
        { targetType: "group", target: "sides", qty: 2 },
        { targetType: "group", target: "bebidas", qty: 1 },
      ],
    },
    pricing: { amount: 120 },
  };

  const pricing = priceMenuOrder({
    items: [
      { name: "Guiso A", group: "guisos", qty: 2, unitPrice: 90 },
      { name: "Guiso extra", group: "guisos", qty: 1, unitPrice: 80 },
      { name: "Arroz", group: "sides", qty: 4, unitPrice: 25 },
      { name: "Side extra", group: "sides", qty: 1, unitPrice: 20 },
      { name: "Agua", group: "bebidas", qty: 2, unitPrice: 20 },
    ],
    config: { promos: [combo] },
  });

  assert.equal(pricing.total, 340);
  assert.equal(pricing.lines.find((line) => line.kind === "promo")?.qty, 2);
  assert.equal(
    pricing.lines.find((line) => line.code === "Guiso extra")?.total,
    80,
  );
  assert.equal(
    pricing.lines.find((line) => line.code === "Side extra")?.total,
    20,
  );
});

test("an explicitly selected promo applies even when a la carte is cheaper", () => {
  const saladPromo: PricingConfig["promos"][number] = {
    id: "ensalada-bebida",
    label: "Ensalada + bebida",
    match: {
      requirements: [
        { targetType: "group", target: "ensaladas", qty: 1 },
        { targetType: "group", target: "bebidas", qty: 1 },
      ],
    },
    pricing: { amount: 120 },
  };
  const items = [
    { name: "Ensalada", group: "ensaladas", qty: 1, unitPrice: 80 },
    { name: "Agua", group: "bebidas", qty: 1, unitPrice: 20 },
  ];

  const automatic = priceMenuOrder({
    items,
    config: { promos: [saladPromo] },
  });
  assert.equal(automatic.total, 100);
  assert.equal(
    automatic.lines.some((line) => line.kind === "promo"),
    false,
  );

  const selected = priceMenuOrder({
    items,
    config: { promos: [saladPromo] },
    preferredPromoId: saladPromo.id,
  });
  assert.equal(selected.total, 120);
  assert.equal(selected.lines[0]?.kind, "promo");
  assert.equal(selected.lines[0]?.code, saladPromo.id);
});
