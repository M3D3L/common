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
    splitPromoApplications: true,
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
  assert.deepEqual(
    drafts.map((draft) => draft.pricingSubtotal),
    [120, 120],
  );
  assert.ok(drafts.every((draft) => promoRedeemsMembershipMeal(draft.promo)));
});

test("taco and drink promo creates one redeemable comanda", () => {
  const [draft] = buildComandaDrafts({
    cart: { "Chicharrón en Salsa Verde": 3, Refresco: 1 },
    taquizaOrders: [
      { kind: "tacos", fills: { "Chicharrón en Salsa Verde": 3 } },
    ],
    splitPromoApplications: true,
    pricingLines: [
      {
        kind: "promo",
        code: "promo-3-tacos-bebida",
        label: "Promo 3 tacos + bebida",
        qty: 1,
        unitPrice: 135,
        total: 135,
        redemption: { kind: "membership_meal", credits: 1 },
        promoApplications: [
          {
            items: [{ name: "Refresco", group: "bebidas", qty: 1 }],
            orderUnits: [
              {
                code: "taquiza:tacos",
                label: "Orden de tacos",
                qty: 1,
              },
            ],
          },
        ],
      },
    ],
  });

  assert.deepEqual(draft.cart, {
    "Chicharrón en Salsa Verde": 3,
    Refresco: 1,
  });
  assert.deepEqual(draft.taquizaOrders, { tacos: 1, quesadillas: 0 });
  assert.equal(draft.pricingSubtotal, 135);
  assert.equal(promoRedeemsMembershipMeal(draft.promo), true);
});

test("pricing-only promos create comandas without redemption eligibility", () => {
  const [draft] = buildComandaDrafts({
    cart: { Dulce: 1, Agua: 1 },
    taquizaOrders: [],
    splitPromoApplications: true,
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

test("member promos and a la carte items create separate comandas", () => {
  const drafts = buildComandaDrafts({
    cart: { Caldo: 2, Arroz: 5, Agua: 2, Dulce: 1 },
    taquizaOrders: [],
    splitPromoApplications: true,
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
      {
        kind: "item",
        code: "Arroz",
        label: "Arroz",
        qty: 1,
        unitPrice: 20,
        total: 20,
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

  assert.equal(drafts.length, 3);
  assert.ok(
    drafts
      .slice(0, 2)
      .every((draft) => promoRedeemsMembershipMeal(draft.promo)),
  );
  assert.equal(drafts[2].label, "Extras");
  assert.deepEqual(drafts[2].cart, { Arroz: 1, Dulce: 1 });
  assert.deepEqual(
    drafts.map((draft) => draft.pricingSubtotal),
    [120, 120, 60],
  );
  assert.equal(promoRedeemsMembershipMeal(drafts[2].promo), false);
});

test("guest promos and a la carte items stay in one comanda", () => {
  const drafts = buildComandaDrafts({
    cart: { Caldo: 2, Arroz: 5, Agua: 2, Dulce: 1 },
    taquizaOrders: [],
    splitPromoApplications: false,
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

  assert.equal(drafts.length, 1);
  assert.equal(drafts[0].label, "Pedido");
  assert.deepEqual(drafts[0].cart, {
    Caldo: 2,
    Arroz: 5,
    Agua: 2,
    Dulce: 1,
  });
  assert.equal(drafts[0].pricingSubtotal, 280);
  assert.equal(drafts[0].promo, undefined);
});

test("an eligible promo still requires a member code at completion", () => {
  assert.equal(
    shouldRedeemOnReady({ redeemMemberMeal: true, memberCode: "GM4218" }),
    true,
  );
  assert.equal(shouldRedeemOnReady({ redeemMemberMeal: true }), false);
});
