# Common Monorepo

This repository contains a shared Nuxt codebase plus multiple domain-specific site apps.
Each site lives in its own folder under `sites/` and extends the common base configuration.

## What This Repo Contains

- Shared Nuxt foundation at repo root (`nuxt.config.ts`, shared components/composables/assets).
- Domain-specific sites in `sites/`:
  - `breezy-meals.com`
  - `guillermomedel.com`
  - `relocatetosancarlos.com`
  - `sancarlosinsider.com`
  - `vivirensancarlos.com`
- Cloudflare Worker proxy in `chatgpt-proxy/`.

## Architecture

Each site is a standalone Nuxt app with its own:

- `nuxt.config.ts`
- `package.json`
- `pages/`, `layouts/`, `assets/`, etc.

Most sites extend common root config through Nuxt `extends` so shared behavior stays centralized.

## Requirements

- Node.js 24.15+ LTS recommended (`nvm use` from the repository root).
  Supported Node ranges: `^22.22.3 || ^24.15.0 || >=26.0.0`, matching Nuxt 4.
- npm 10+

## Nuxt 4

Common and the four actively maintained sites use Nuxt 4. Their existing
top-level app folders are retained with `srcDir: "."`; moving code into `app/`
is not required. Tailwind CSS remains on v3 to preserve the existing styling.
`sancarlosinsider.com` is excluded from this upgrade.
TypeScript uses Nuxt 4's separate app, server, shared, and Node project references.

Sites extend the local common layer (and Vivir also extends Relocate), not a
downloaded GitHub starter package. Install root dependencies before site
dependencies, including when building a single site.

The root is a shared layer, not a standalone deployable site: shared pages expect
site-specific configuration such as `assets/configs/layout.js`. Validate it by
building the consuming sites. CI uses Node.js 24.15.0 and generates each site
from its own directory with the `github-pages` Nitro preset. Generated files are
written to each site's `.output/public/` directory.

## Install Dependencies

Install dependencies where you are going to run commands.

Root:

```bash
npm ci
```

Per-site (example):

```bash
cd sites/breezy-meals.com
npm ci
```

Proxy worker:

```bash
cd chatgpt-proxy
npm install
```

## Local Development

Run Nuxt from the specific site directory.

Example (Breezy):

```bash
cd sites/breezy-meals.com
npm run dev
```

Example (Guillermo):

```bash
cd sites/guillermomedel.com
npm run dev
```

Nuxt default local URL is usually:

- `http://localhost:3000`

## Build and Preview

From a site folder:

```bash
npm run build
npm run generate
npm run preview
```

Some site folders also include `preview:prod` for production-like base-path preview.

## ChatGPT Proxy (Cloudflare Worker)

From `chatgpt-proxy/`:

```bash
npm run dev
npm run test
npm run deploy
```

## Common Commands by Area

Root app:

- `npm run dev`
- `npm run build`
- `npm run generate`

Site apps (`sites/<domain>/`):

- `npm run dev`
- `npm run build`
- `npm run generate`
- `npm run preview`
- `npm run prepare` (generates dynamic routes where configured)

## Directory Guide

- `assets/`, `components/`, `composables/`, `layouts/`, `pages/`, `plugins/`, `store/`
  - Shared/common app-level resources.
- `sites/`
  - Domain-specific Nuxt apps.
- `chatgpt-proxy/`
  - Cloudflare worker and tests.
- `server/`
  - Server-side and runtime server pieces for Nuxt where applicable.
- `reports/`
  - Project notes and implementation reports.

## Workflow Notes

- Treat each site under `sites/` as its own deployable app.
- Keep shared logic in root/common when useful.
- Keep domain-specific pages and business logic inside the correct site folder only.

## Deployment Notes

- Build/deploy each site from its own directory.
- If old pages appear after route cleanup, redeploy and clear CDN/browser cache.
