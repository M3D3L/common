# guillermomedel.com

Nuxt app for the Guillermo Medel portfolio and blog.

This site is hosted from this directory and extends shared config from the common repository root.

## Scope

This app owns:

- portfolio landing page(s)
- blog pages and related routes
- personal branding/SEO for guillermomedel.com

This app does not own Breezy Meals operational pages.

## Separation Note

The Breezy Meals app was separated from this site.

- do not add Breezy menu/staff/order routes here
- keep Breezy business logic in `sites/breezy-meals.com`

## Tech Notes

- Nuxt 3 (SSG-friendly setup)
- `ssr: false`
- site URL: `https://guillermomedel.com`
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
- `prepare`: generate blog routes (`scripts/generate-routes.js`)
- `postinstall`: `nuxt prepare`

## Environment Variables

These are read by `nuxt.config.ts` runtime config:

- `POCKETBASE_URL`
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

- `pages/`: portfolio/blog route pages
- `components/`: reusable UI components
- `composables/`: app-specific composition logic
- `assets/`: styles and content config
- `routes/`: generated route lists for prerender/sitemap

## Deployment

Build and deploy from this directory (not from repository root):

```bash
npm run generate
```

Then publish `.output/public` with your hosting workflow.
