import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (relativePath: string) =>
  readFileSync(new URL(relativePath, import.meta.url), "utf8").replace(
    /\s+/g,
    " ",
  );

test("shows orderable menu content before guidance and membership promotion", () => {
  const menuPage = readSource("../pages/menu.vue");
  const orderableContent = menuPage.indexOf("<OrganismsMenuPromoList");
  const instructions = menuPage.indexOf("<OrganismsMenuInstructions");
  const membershipPromotion = menuPage.indexOf(
    'aria-labelledby="membership-promo-title"',
  );

  assert.notEqual(orderableContent, -1);
  assert.notEqual(instructions, -1);
  assert.notEqual(membershipPromotion, -1);
  assert.ok(orderableContent < instructions);
  assert.ok(orderableContent < membershipPromotion);
});

test("shows existing service information without inventing a pickup address or delivery time", () => {
  const source = readSource("../components/organisms/Menu/Instructions.vue");
  assert.match(source, /Servicio y entregas/);
  assert.match(source, /broadcast\.businessHours/);
  assert.match(source, /broadcast\.cutoff/);
  assert.match(source, /desde \$60 MXN/);
  assert.match(source, /Confirma la ubicación y el tiempo de preparación/);
  assert.match(source, /<details>/);
});

test("discloses membership data usage and current credit validity before submission", () => {
  const source = readSource("../pages/membresia.vue");
  const notice = source.indexOf('aria-label="Aviso de privacidad"');
  assert.ok(notice > 0);
  assert.ok(notice < source.indexOf('type="submit"'));
  assert.match(source, /no tienen una fecha fija de vencimiento/);
  assert.match(source, /comprobante\s+de pago/);
  assert.match(source, /acceso, corrección o eliminación/);
  assert.match(source, /se comparte tu nombre, teléfono, forma de pago/);
});

test("public ordering labels and validation messages are Spanish-only", () => {
  const paths = [
    "../pages/menu.vue",
    "../components/organisms/Menu/Instructions.vue",
    "../components/organisms/Menu/CustomerForm.vue",
    "../components/organisms/Menu/ModeTabs.vue",
    "../components/organisms/Menu/CartBar.vue",
    "../components/organisms/Menu/OrderSummary.vue",
    "../components/organisms/Menu/CategoryChips.vue",
    "../components/organisms/Menu/ThankYouDialog.vue",
    "../composables/useMenuPricing.ts",
  ];
  for (const path of paths) {
    assert.doesNotMatch(
      readSource(path),
      /Your Info|Your name|Your order|How to order|How do you want|Thank you|Got it|Required for delivery|Please enter|optional\)|Pricing totals|Applied promos|You're on track|No onions/,
    );
  }
  const pricing = readSource("../composables/useMenuPricing.ts");
  assert.match(pricing, /summary: summaryEs/);
  assert.doesNotMatch(pricing, /\$\{summaryEs\} \/ \$\{summaryEn\}/);
  assert.match(pricing, /if \(mapped\) return mapped.es/);
});

test("analytics initializes manually and requires consent and a configured GA4 ID", () => {
  const config = readSource("../nuxt.config.ts");
  const consent = readSource("../components/organisms/AnalyticsConsent.vue");
  const tracker = readSource("../composables/useBreezyAnalytics.ts");
  assert.match(config, /initMode: "manual"/);
  assert.match(config, /send_page_view: false/);
  assert.match(config, /ad_storage: "denied"/);
  assert.match(
    config,
    /NUXT_PUBLIC_BREEZY_ANALYTICS_ID \|\| \(process.env.NODE_ENV === "production" \? "G-6Y0PKGKKMS" : ""\)/,
  );
  assert.match(config, /gtag: \{ id: "", initMode: "manual"/);
  assert.match(tracker, /consent.value === "accepted"/);
  assert.match(
    tracker,
    /validMeasurementId\(config.public.breezyAnalyticsId\)/,
  );
  assert.match(tracker, /!pb.authStore.isValid/);
  assert.ok(
    consent.indexOf('consent.value !== "accepted"') <
      consent.indexOf("initialize(id)"),
  );
  assert.match(consent, /Rechazar/);
  assert.match(consent, /Preferencias de privacidad/);
});

test("membership tracking follows a successful save and never replaces WhatsApp navigation", () => {
  const membership = readSource("../pages/membresia.vue");
  const save = membership.indexOf("await requests.submit(");
  const event = membership.indexOf('trackPublicEvent("membership_submit"');
  assert.ok(save > 0 && event > save);
  assert.ok(
    event < membership.indexOf("whatsappTab.location.href = whatsappUrl"),
  );
  assert.ok(membership.indexOf('window.open("", "_blank")') < save);
});

test("checkout tracks valid attempts and handoffs without changing the order transport", () => {
  const checkout = readSource("../composables/useMenuCheckout.ts");
  const validation = checkout.indexOf(
    "if (!record.value || !canSend.value || sendingOrder.value) return;",
  );
  const begin = checkout.indexOf('trackPublicEvent("begin_checkout"');
  const handoff = checkout.indexOf('trackPublicEvent("whatsapp_handoff"');
  const navigation = checkout.indexOf(
    "window.location.href = whatsappAppLink(text, restaurantWhatsapp)",
  );
  assert.ok(validation > 0 && begin > validation);
  assert.ok(handoff > checkout.indexOf("await createComanda("));
  assert.ok(handoff < navigation);
  assert.equal(
    (checkout.match(/window.location.href = whatsappAppLink/g) || []).length,
    1,
  );
  assert.match(checkout, /items: analyticsItems\?\.value/);
  assert.match(checkout, /value: pricingSubtotal.value/);
  assert.match(checkout, /shipping: appliedDeliveryFee.value/);
  const menu = readSource("../pages/menu.vue");
  assert.match(
    menu,
    /selectedAnalyticsItems\(\s*analyticsCatalog.value,\s*next,\s*previous,?\s*\)/,
  );
  assert.match(
    menu,
    /checkoutAnalyticsItems\(\s*analyticsCatalog.value,\s*orderSummaryLines.value,?\s*\)/,
  );
  assert.match(menu, /pricingLines: orderSummaryLines, analyticsItems,/);
});
