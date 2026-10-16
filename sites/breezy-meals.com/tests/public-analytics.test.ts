import assert from "node:assert/strict";
import test from "node:test";
import {
  createPublicAnalytics,
  checkoutAnalyticsItems,
  selectedAnalyticsItems,
  publicAnalyticsPath,
  validMeasurementId,
} from "../utils/publicAnalytics.ts";

test("analytics only permits public routes and valid GA4 measurement IDs", () => {
  assert.equal(publicAnalyticsPath("/menu/?code=PRIVATE#name"), "/menu");
  for (const path of [
    "/comandas",
    "/orders",
    "/pagos",
    "/inicio",
    "/login",
    "/menu-items",
  ]) {
    assert.equal(publicAnalyticsPath(path), null);
  }
  assert.equal(validMeasurementId("G-ABC123"), true);
  for (const id of ["", undefined, "UA-123", "G-ABC<script>"])
    assert.equal(validMeasurementId(id), false);
});

test("analytics discards private and unknown fields rather than forwarding form data", () => {
  const events: unknown[] = [];
  const track = createPublicAnalytics({
    enabled: () => true,
    path: () => "/menu?code=SECRET",
    send: (...args) => events.push(args),
  });
  assert.equal(
    track("begin_checkout", {
      value: 199,
      item_count: 2,
      order_mode: "domicilio",
      name: "PRIVATE",
      phone: "PRIVATE",
      address: "PRIVATE",
      note: "PRIVATE",
      member_code: "PRIVATE",
      payment_proof: "PRIVATE",
      reference: "PRIVATE",
      page_location: "PRIVATE",
      items: [{ item_name: "PRIVATE" }],
    }),
    true,
  );
  assert.deepEqual(events, [
    [
      "begin_checkout",
      {
        page_path: "/menu",
        page_location: "https://breezy-meals.com/menu",
        page_referrer: "",
        page_title: "Breezy Meals",
        value: 199,
        currency: "MXN",
        item_count: 2,
        order_mode: "domicilio",
      },
    ],
  ]);
});

test("declined consent, missing configuration and staff pages never emit events", () => {
  let calls = 0;
  for (const [enabled, path] of [
    [false, "/menu"],
    [true, "/comandas"],
  ] as const) {
    const track = createPublicAnalytics({
      enabled: () => enabled,
      path: () => path,
      send: () => {
        calls += 1;
      },
    });
    assert.equal(track("add_to_cart"), false);
  }
  assert.equal(calls, 0);
});

test("ecommerce items allow catalog fields only and reject malformed products", () => {
  const events: any[] = [];
  const track = createPublicAnalytics({
    enabled: () => true,
    path: () => "/tienda",
    send: (...args) => events.push(args),
  });
  const product = {
    item_id: "store:coca-zero",
    item_name: "Coca Zero",
    item_category: "Bebidas",
    price: 28,
    quantity: 2,
  };
  for (const event of [
    "add_to_cart",
    "begin_checkout",
    "whatsapp_handoff",
  ] as const) {
    track(event, {
      items: [
        {
          ...product,
          phone: "PRIVATE",
          note: "PRIVATE",
          payment_proof: "PRIVATE",
        },
        { ...product, quantity: -1 },
        { ...product, quantity: 1.5 },
        { ...product, price: Infinity },
        { ...product, item_id: "" },
        null,
      ],
    });
    assert.deepEqual(events.at(-1)[1].items, [product]);
    assert.equal(JSON.stringify(events.at(-1)).includes("PRIVATE"), false);
  }
  track("page_view", { items: [product] });
  assert.equal(events.at(-1)[1].items, undefined);
  track("add_to_cart", { items: Array.from({ length: 210 }, () => product) });
  assert.equal(events.at(-1)[1].items.length, 200);
});

test("invalid metrics are dropped and analytics failure never escapes into checkout", () => {
  const events: unknown[] = [];
  const track = createPublicAnalytics({
    enabled: () => true,
    path: () => "/membresia",
    send: (...args) => events.push(args),
  });
  track("membership_submit", {
    value: NaN,
    quantity: -1,
    credits: 5,
    payment_method: "transfer",
    order_mode: "PRIVATE",
  });
  assert.deepEqual(events, [
    [
      "membership_submit",
      {
        page_path: "/membresia",
        page_location: "https://breezy-meals.com/membresia",
        page_referrer: "",
        page_title: "Breezy Meals",
        credits: 5,
        payment_method: "transfer",
      },
    ],
  ]);
  const broken = createPublicAnalytics({
    enabled: () => true,
    path: () => "/menu",
    send: () => {
      throw new Error("blocked");
    },
  });
  assert.equal(broken("whatsapp_handoff"), false);
});

test("catalog selection tracks only added known products with stable surface identities", () => {
  const catalog = [
    {
      surface: "store",
      group: "bebidas",
      category: "Bebidas",
      name: "Agua",
      price: 20,
    },
    { surface: "store", group: "pan", category: "Pan", name: "Pan", price: 30 },
  ];
  assert.deepEqual(
    selectedAnalyticsItems(
      catalog,
      { Agua: 3, Pan: 0, PRIVATE: 4 },
      { Agua: 1, Pan: 2 },
    ),
    [
      {
        item_id: "store:bebidas:Agua",
        item_name: "Agua",
        item_category: "Bebidas",
        price: 20,
        quantity: 2,
      },
    ],
  );
  assert.deepEqual(selectedAnalyticsItems(catalog, {}), []);
});

test("checkout expands combo products without double-counting their catalog prices", () => {
  const catalog = [
    {
      surface: "dishes",
      group: "guisos",
      category: "Guisos",
      name: "Pollo",
      price: 100,
    },
    {
      surface: "dishes",
      group: "bebidas",
      category: "Bebidas",
      name: "Agua",
      price: 20,
    },
  ];
  const items = checkoutAnalyticsItems(catalog, [
    {
      kind: "promo",
      code: "combo",
      label: "Combo",
      qty: 2,
      unitPrice: 110,
      total: 220,
      promoApplications: Array.from({ length: 2 }, () => ({
        items: [
          { name: "Pollo", group: "guisos", qty: 1 },
          { name: "Agua", group: "bebidas", qty: 1 },
        ],
        orderUnits: [],
      })),
    },
    {
      kind: "item",
      code: "Agua",
      label: "Agua",
      qty: 1,
      unitPrice: 20,
      total: 20,
    },
    {
      kind: "order-unit",
      code: "taquiza:tacos",
      label: "Tacos",
      qty: 1,
      unitPrice: 60,
      total: 60,
    },
  ]);
  assert.equal(items.filter((item) => item.item_name === "Pollo").length, 2);
  assert.equal(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    300,
  );
  assert.equal(
    items.reduce((sum, item) => sum + item.quantity, 0),
    6,
  );
  assert.equal(items[0].item_category, "Guisos");
  assert.deepEqual(checkoutAnalyticsItems(catalog, []), []);
});
