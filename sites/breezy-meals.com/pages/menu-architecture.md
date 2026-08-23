# Breezy Menu Page Architecture

This document explains how [menu.vue](menu.vue) is organized after the refactor pass.

## Goals

- Keep feature behavior and UI unchanged.
- Reduce cognitive load in the page file.
- Isolate domain logic that can be tested independently.

## Current Structure

- Page and UI composition: [menu.vue](menu.vue)
  (~1600 lines, down from ~2300 before this pass — mostly template + prop/state wiring).
- Taquiza order-unit domain logic: [composables/useTaquizaOrders.ts](../composables/useTaquizaOrders.ts)
- Scroll-reveal (GSAP) animation lifecycle: [composables/useMenuScrollReveal.ts](../composables/useMenuScrollReveal.ts)
- Pricing + promo progress cards + runtime promo loading: [composables/useMenuPricing.ts](../composables/useMenuPricing.ts)
- Order-send workflow (note/comanda/WhatsApp/reset): [composables/useMenuCheckout.ts](../composables/useMenuCheckout.ts)

## What Is Inside `menu.vue`

- Template/UI composition (unchanged markup and Tailwind classes).
- Menu record loading + daily rotation resolution (`active`, `menuGroups`, `activeItems`).
- Accordion/chip navigation state (`openGroups`, `focusGroup`, section scroll-into-view).
- Cart state (`cart`, `customer`, `mode`, `note`, `memberCode`) and simple derived values
  (`cartItems`, `itemCount`, `totalQty`, `needsAddress`, `canSend`, `hint`).
- Staff "sold out" toggle (`toggleOut`).
- Wiring calls into the composables above.

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
- Makes taquiza/pricing/checkout behavior easier to unit test in isolation.
- Gives clear seams for future order-unit, promo, and checkout features.

## Next Suggested Refactors

1. Extract the accordion/chip scroll-navigation block (`openGroups`, `focusGroup`,
   `scrollGroupIntoView`, section refs) into `useMenuGroupAccordion`.
2. Extract menu record + rotation resolution (`active`, `menuGroups`, `activeItems`,
   `catalog`, `hasMenu`) into `useMenuData`.
3. Add lightweight unit tests for `useTaquizaOrders`, `useMenuPricing` promo matching,
   and `useMenuCheckout` note-building edge cases.
