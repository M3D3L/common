# Breezy Menu Page Architecture

This document explains how [menu.vue](menu.vue) is organized after the refactor pass.

## Goals

- Keep feature behavior and UI unchanged.
- Reduce cognitive load in the page file.
- Isolate domain logic that can be tested independently.

## Current Structure

- Page and state/composable wiring: [menu.vue](menu.vue)
  (~590 lines, down from ~1600 after extracting the template into components and the
  data/accordion state into composables).
- Presentational components: [components/organisms/Menu/](../components/organisms/Menu/)
- Menu record + daily rotation resolution: [composables/useMenuData.ts](../composables/useMenuData.ts)
- Accordion/chip navigation (open state, scroll-into-view): [composables/useMenuGroupAccordion.ts](../composables/useMenuGroupAccordion.ts)
- Taquiza order-unit domain logic: [composables/useTaquizaOrders.ts](../composables/useTaquizaOrders.ts)
- Scroll-reveal (GSAP) animation lifecycle: [composables/useMenuScrollReveal.ts](../composables/useMenuScrollReveal.ts)
- Pricing + promo progress cards + runtime promo loading: [composables/useMenuPricing.ts](../composables/useMenuPricing.ts)
- Order-send workflow (note/comanda/WhatsApp/reset): [composables/useMenuCheckout.ts](../composables/useMenuCheckout.ts)

## What Is Inside `menu.vue`

- Top-level layout shell (background blobs, loading/error/no-service states) plus the
  `<main>`/cart-bar/dialog composition, wired to the components in
  `components/organisms/Menu/`.
- Cart state (`cart`, `customer`, `mode`, `note`, `memberCode`) and simple derived values
  (`cartItems`, `itemCount`, `totalQty`, `needsAddress`, `canSend`, `hint`).
- Staff "sold out" toggle (`toggleOut`).
- Wiring calls into the composables above.

## What Is Inside `components/organisms/Menu/`

Each component is presentational: `menu.vue` still owns all reactive state (`cart`,
`mode`, `openGroups`, taquiza orders, pricing, checkout) and passes it down as props /
function props, or binds it with `v-model` for simple fields. Leaf components emit
plain UI events (`@retry`, `@add`, `@toggle`, etc.); `GroupSection` (the one component
with children) receives already-bound handler functions as props instead of re-emitting.

- `LoadingState.vue` / `UnavailableState.vue` — skeleton and error/no-menu states.
- `DayPicker.vue` — prev/label/next day selector (previously duplicated markup).
- `Instructions.vue` — static "how to order" card.
- `PromoList.vue` — promo progress cards.
- `CategoryChips.vue` — sticky category chip bar.
- `GroupSection.vue` — one accordion section per menu group; renders either the
  taquiza order-unit flow (via `TaquizaOrderCard.vue`) or a plain item list (via
  `ItemCard.vue`).
- `TaquizaOrderCard.vue` / `ItemCard.vue` — single taquiza order / single dish row.
- `ModeTabs.vue` — llevar/domicilio/aquí tabs (`v-model:mode`).
- `OrderSummary.vue` — pricing line items + total.
- `CustomerForm.vue` — name/phone/address/member-code/time/note form.
- `CartBar.vue` — fixed bottom bar (promo banner, totals, clear/send buttons).
- `ThankYouDialog.vue` — order confirmation modal (`v-model:open`).

## What Is Inside `useTaquizaOrders`

- State for taquiza order units (`tacos`, `quesadillas`).
- Add/remove order actions and fill adjustments.
- Cart delta updates that preserve this invariant:
  - `cart[item] = regular servings + taquiza servings`
- Derived values used by pricing and checkout:
  - `taquizaByKind`
  - `taquizaOrderCount`
  - `taquizaSelectedByKind`
  - `hasTaquizaOrder`
  - `taquizaTotalForName`

## What Is Inside `useMenuData`

- Resolves the day's menu from staff override / today's active shift / weekly rotation
  (`active`, `menuSourceCatalog`, `menuGroups`, `hasMenu`, `catalog`, `activeItems`).
- `groupItems(key)`, `taquizaGroup`, `showGroupSection(key)`.

## What Is Inside `useMenuGroupAccordion`

- Open/closed state per group (`openGroups`, `isGroupOpen`, `toggleGroup`,
  `allGroupsOpen`, `toggleAllGroups`).
- Cart badge counts per group (`groupCartCount`) and the visible-groups list
  (`visibleMenuGroups`).
- Chip scroll-into-view (`setSectionRef`, `focusGroup`) and the "open first group on
  load" behavior.

## What Is Inside `useMenuScrollReveal`

- Lazily loads GSAP + ScrollTrigger (client-only, respects reduced-motion).
- Fades in `.js-reveal-item` / `.js-reveal-section` nodes as they scroll into view.
- Exposes a single `scheduleRevealRefresh()` the page calls after content changes
  (menu date, open/closed groups, new taquiza orders).

## What Is Inside `useMenuPricing`

- Runtime promo loading (`promos` PocketBase collection) merged with static config.
- `pricingSummary` / `orderSummaryLines`: cart pricing via `priceMenuOrder`.
- `promoProgressCards` / `promoCardsWithAppliedState` / `promoStatusBanner`:
  the "how close am I to a promo" UI state.
- `money(value)` formatter.

## What Is Inside `useMenuCheckout`

- `buildNote`, `nextComandaNumber`, `createComanda`, `sendOrder`.
- `clearCart` / `resetOrderForm`.
- `sendingOrder`, `showThankYou`, `thankYouName` state for the confirmation modal.

## Why This Refactor Helps

- Removes several large cohesive blocks from `menu.vue` without changing templates or styling.
- Makes taquiza/pricing/checkout/data/accordion behavior easier to unit test in isolation.
- Splitting the template into `components/organisms/Menu/` components makes each
  section (promo list, group section, cart bar, etc.) reviewable/testable on its own.
- Gives clear seams for future order-unit, promo, and checkout features.

## Next Suggested Refactors

1. Add lightweight unit tests for `useTaquizaOrders`, `useMenuData`,
   `useMenuGroupAccordion`, `useMenuPricing` promo matching, and `useMenuCheckout`
   note-building edge cases.
2. Consider splitting `ItemCard.vue`'s staff-only "agotado" toggle button into its own
   small component if more staff-only affordances get added to the row.
3. `isGroupLocked`/`lockReason` in `menu.vue` are still stubs (always `false`/`""`) —
   left in place as a seam for a future "lock this group" feature; wire them up or
   remove them once that feature is decided.
