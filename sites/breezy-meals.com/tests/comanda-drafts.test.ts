import assert from "node:assert/strict";
import test from "node:test";

import {
  buildComandaDrafts,
  promoRedeemsMembershipMeal,
} from "../utils/comandaDrafts.ts";
import { shouldRedeemOnReady } from "../utils/comandasRedemption.ts";

const application = {
  items: [
    { name: "Caldo", group: "caldos", qty: 1 },
    { name: "Arroz", group: "sides", qty: 2 },
    { name: "Agua", group: "bebidas", qty: 1 },
  ],
  orderUnits: [],
};

test("two eligible promo applications create two redeemable comandas", () => {
  const drafts = buildComandaDrafts({
    cart: { Caldo: 2, Arroz: 4, Agua: 2 },
    taquizaOrders: [],
    pricingLines: [
      {
        kind: "promo",
        code: "caldo-combo",
        label: "Combo caldo",
        qty: 2,
        unitPrice: 120,
        total: 240,
        redemption: { kind: "membership_meal", credits: 1 },
        promoApplications: [application, application],
      },
    ],
  });

  assert.equal(drafts.length, 2);
  assert.deepEqual(
    drafts.map((draft) => draft.promo?.application),
    [1, 2],
  );
  assert.ok(drafts.every((draft) => promoRedeemsMembershipMeal(draft.promo)));
});

test("pricing-only promos create comandas without redemption eligibility", () => {
  const [draft] = buildComandaDrafts({
    cart: { Dulce: 1, Agua: 1 },
    taquizaOrders: [],
    pricingLines: [
      {
        kind: "promo",
        code: "sweet-drink",
        label: "Dulce + bebida",
        qty: 1,
        unitPrice: 50,
        total: 50,
        promoApplications: [
          {
            items: [
              { name: "Dulce", group: "sweets", qty: 1 },
              { name: "Agua", group: "bebidas", qty: 1 },
            ],
            orderUnits: [],
          },
        ],
      },
    ],
  });

  assert.equal(draft.label, "Dulce + bebida");
  assert.equal(promoRedeemsMembershipMeal(draft.promo), false);
});

test("leftover and incomplete items create a separate non-redeeming comanda", () => {
  const drafts = buildComandaDrafts({
    cart: { Caldo: 1, Arroz: 2, Agua: 1, Dulce: 1 },
    taquizaOrders: [],
    pricingLines: [
      {
        kind: "promo",
        code: "caldo-combo",
        label: "Combo caldo",
        qty: 1,
        unitPrice: 120,
        total: 120,
        redemption: { kind: "membership_meal", credits: 1 },
        promoApplications: [application],
      },
      {
        kind: "item",
        code: "Dulce",
        label: "Dulce",
        qty: 1,
        unitPrice: 40,
        total: 40,
      },
    ],
  });

  assert.equal(drafts.length, 2);
  assert.equal(drafts[1].label, "Extras");
  assert.deepEqual(drafts[1].cart, { Dulce: 1 });
  assert.equal(promoRedeemsMembershipMeal(drafts[1].promo), false);
});

test("an eligible promo still requires a member code at completion", () => {
  assert.equal(
    shouldRedeemOnReady({ redeemMemberMeal: true, memberCode: "GM4218" }),
    true,
  );
  assert.equal(shouldRedeemOnReady({ redeemMemberMeal: true }), false);
});
