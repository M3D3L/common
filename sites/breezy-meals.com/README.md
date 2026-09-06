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
- `postinstall`: `nuxt prepare`

## PocketBase Access Rules

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

## Environment Variables

These are read by `nuxt.config.ts` runtime config:

- `BREEZY_MEALS_POCKETBASE_URL`
- `WHATSAPP_NUMBER`
- `NODE_ENV`
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
