import assert from "node:assert/strict";
import test from "node:test";
import {
  createPublicAnalytics,
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
