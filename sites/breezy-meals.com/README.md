# breezy-meals.com

Nuxt app for the Breezy Meals product site and operations workflows.

This site is hosted from this directory and extends shared config from the common repository root.

## Scope

This app owns Breezy-specific flows, including:

- public menu pages
- promos and store pages
- staff/admin operational pages
- menu and order-related tooling

Do not move these features into other site folders.

## Tech Notes

- Nuxt 3 (SSG-friendly setup)
- `ssr: false`
- site URL: `https://breezy-meals.com`
- sitemap and robots configured in `nuxt.config.ts`
- dynamic route generation via `scripts/generate-routes.js`

## Requirements

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Default local URL: `http://localhost:3000`

## Build and Preview

```bash
npm run build
npm run generate
npm run preview
```

Production-like preview with base path:

```bash
npm run preview:prod
```

## Scripts

- `dev`: start local Nuxt dev server
- `build`: build app
- `generate`: generate static output
- `preview`: generate + preview static output
- `preview:prod`: production-mode preview with explicit base path
- `schema:harden`: protect staff collections in a PocketBase schema export
- `schema:normalize`: add normalized migration collections without removing legacy fields
- `schema:commerce`: add normalized menu collections and optional typed order fields
- `schema:payroll`: add the verified-only payroll collection
- `postinstall`: `nuxt prepare`

## PocketBase Access Rules

### Staff schedule

The `/horarios` page reads weekly assignments from `staff_shifts`. All signed-in
users can view the team schedule; PocketBase permits create, update, and delete
only when `@request.auth.verified = true`.

The import-ready schema generated from the latest export is
`pb_schema.staff-schedule.json`. Back up PocketBase, then import that file from
**Settings → Import collections**. PocketBase will preserve the existing
collections and add `staff_shifts`.

To regenerate it from a newer export:

```bash
npm run schema:staff-schedule -- input-schema.json pb_schema.staff-schedule.json
```

### Payroll

The `/nomina` page is visible and accessible only to verified users. PocketBase
must also enforce this restriction; see
[docs/pocketbase-payroll.md](docs/pocketbase-payroll.md) for the complete field
list, API rules, and import command.

Export the current schema from PocketBase, then generate a hardened copy:

```bash
npm run schema:harden -- pb_schema.json pb_schema.secure.json
```

Review and import `pb_schema.secure.json` through PocketBase after taking a
database backup. The transformer keeps menu, store, and promo reads public and
keeps guest order creation working. Staff data and content mutations require an
authenticated account; guests cannot inspect or modify submitted orders.

Generate the additive normalized schema after hardening:

```bash
npm run schema:normalize -- pb_schema.secure.json pb_schema.normalized.json
```

The normalized schema is now the application runtime source for checklists,
clock entries, and recipes. The legacy JSON values were cleared only after the
copy and UI cutover were verified; keep the downloaded source snapshot outside
PocketBase for disaster recovery. See
[docs/pocketbase-normalization-migration.md](docs/pocketbase-normalization-migration.md)
for the migration record and cleanup gates.

The second-stage commerce schema is generated separately:

```bash
npm run schema:commerce -- pb_schema.normalized.json pb_schema.commerce.json
```

It preserves the existing schema, adds normalized menu planning and order-line
collections, and appends optional typed fields to `comandas`. The live additive
copy is verified under source hash `d26cec88`; the authenticated backup and all
legacy menu/order blobs remain retained for rollback.

Copy `pb_hooks/protect_menu_catering.pb.js` into the PocketBase instance's
`pb_hooks` directory. It preserves the last non-null `menu.catering` value when
an outdated or unrelated update attempts to clear the field; valid array updates
from the catering editor remain allowed.

The public member balance and history module uses an additive schema update:

```bash
npm run schema:client-portal -- pb_schema.payroll.json pb_schema.client-portal.json
```

Import the generated schema after taking a PocketBase backup, then copy
`pb_hooks/client_portal.pb.js` into the instance's `pb_hooks` directory. Keep
`members`, `memberships`, `redemptions`, `comandas`, and `comanda_lines`
staff-only; the hook is the only public read surface. Enable PocketBase's global
rate limiter in addition to the route's five-attempt-per-minute guard.

## Environment Variables

### Free Analytics (Optional)

Google Analytics 4's standard service is free. No analytics is sent and no Google
script is loaded without a valid measurement ID and the visitor's explicit
acceptance. Rejection is saved locally; the public footer provides a privacy
preferences control to change the choice later. Signed-in staff are excluded.

1. Production builds use the configured GA4 measurement ID `G-6Y0PKGKKMS` for
   `https://breezy-meals.com`. Local development is untracked by default.
2. In that stream, disable **Enhanced measurement**, including automatic page
   views, form interactions, outbound clicks and site search. This app sends
   explicit, sanitized events instead. Leave Google signals, user-provided data
   collection and advertising personalization disabled. Do not add separate
   Google Tag Manager or automatic tracking tags to this app.
3. Regenerate and deploy the static site to activate this configuration. No
   additional environment variable is required. To override the ID, set
   `NUXT_PUBLIC_BREEZY_ANALYTICS_ID=G-YOURID` in the build environment. Static
   deployments require a rebuild for environment changes to take effect.
4. Accept statistics in the public footer and inspect GA4 Realtime. Declining
   must produce no events. Ad blockers and declined consent will reduce counts.

Events are `page_view`, `select_promotion`, `add_to_cart`, `begin_checkout`,
`whatsapp_handoff`, and `membership_submit`. Only public paths without query
strings, aggregate numeric totals/counts, order mode and payment method are
allowlisted. Names, phones, addresses, notes, member codes, receipts and request
references are not sent. These are aggregate custom funnel events, not a complete
GA4 ecommerce item feed. A WhatsApp handoff is not a confirmed sale;
`membership_submit` means the request was saved, not that payment was approved.

The existing bank/payment verification and credit redemption logic is unchanged.
The membership page describes the current absence of a fixed credit expiry;
it does not introduce a new expiry or retention policy. The inline privacy
disclosure describes the form's operational data use and WhatsApp handoff. It is
not a substitute for a full business privacy policy reviewed for applicable law.

These are read by `nuxt.config.ts` runtime config:

- `BREEZY_MEALS_POCKETBASE_URL`
- `WHATSAPP_NUMBER`
- `NODE_ENV`
- `NUXT_PUBLIC_BREEZY_ANALYTICS_ID` (optional GA4 measurement ID)
- `BUSINESS_BRAND_NAME`
- `BUSINESS_NAME`
- `BUSINESS_LOGO_URL`
- `BUSINESS_WHATSAPP_NUMBER`
- `BUSINESS_MENU_URL`
- `BUSINESS_HEADER_EYEBROW`
- `BUSINESS_HEADER_SUBTITLE`
- `BUSINESS_HEADER_MENU_TITLE`
- `BUSINESS_MENU_BROADCAST_GREETING`
- `BUSINESS_MENU_BROADCAST_PRICE_ONE`
- `BUSINESS_MENU_BROADCAST_PRICE_TWO`
- `BUSINESS_MENU_BROADCAST_CTA`
- `BUSINESS_MENU_BROADCAST_CUTOFF`
- `BUSINESS_MENU_BROADCAST_FOOTER`

## Structure

- `pages/`: route pages for public and staff areas
- `components/`: reusable UI and feature components
- `composables/`: feature hooks and data/business logic
- `assets/`: styles and content config
- `routes/`: generated route lists for prerender/sitemap

## Deployment

Build and deploy from this directory (not from repository root):

```bash
npm run generate
```

Then publish `.output/public` with your hosting workflow.
