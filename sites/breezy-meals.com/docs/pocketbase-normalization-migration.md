# PocketBase Normalization Migration

> Completed September 6, 2026. All 1,793 normalized records were verified,
> application reads and writes were cut over, and the three legacy `data`
> values were cleared. The downloaded source snapshot remains the rollback
> artifact.

## Decision

Use one PocketBase instance per business for now. Each instance owns its users,
operational data, backups, and files. This keeps authorization rules and queries
simple and prevents accidental cross-business access.

Do not add `business_id` to every collection unless the product later moves to a
shared PocketBase instance. A shared-instance SaaS requires a separate tenancy
project: tenant-scoped rules, tenant-aware indexes, invitations, billing,
provisioning, and cross-tenant isolation tests.

## Scope Of The First Migration

The first additive schema normalizes the three deterministic aggregate blobs:

- `checklists.data` into templates, sections, items, runs, and results
- `clockins.data.punches` into one `clock_entries` record per punch
- `recipies.data` into recipes, ingredients, and steps

The import adds these collections:

- `migration_runs`
- `checklist_templates`
- `checklist_sections`
- `checklist_items`
- `checklist_runs`
- `checklist_results`
- `clock_entries`
- `recipes`
- `recipe_ingredients`
- `recipe_steps`

The legacy collection fields remain in the schema but their values are now
empty. Application pages read and write only normalized collections.

## Data-Loss Controls

1. Back up the PocketBase `pb_data` directory or create a provider snapshot.
2. Export the current PocketBase schema.
3. Import the additive normalized schema.
4. Open `/migraciones` while authenticated.
5. Inspect the source. This performs no writes.
6. Download the generated JSON source snapshot. Migration is disabled until the
   download action occurs in the current browser session.
7. Run the copy. Writes are idempotent and keyed by source record plus source
   position, so duplicate legacy IDs are preserved.
8. The runner rereads every target row and compares every migrated field.
9. The runner rereads all source blobs and compares their hash with the initial
   snapshot. Concurrent source changes fail the run safely.
10. A successful run is recorded in `migration_runs` as `verified`.

Every migrated root or audit record stores its exact `legacy_payload`. This
preserves unknown and malformed historical properties while exposing normalized
fields for new code.

The migration tool contains no delete or clear operation.

## Import File

The generated additive schema is:

`C:\Users\Guill\Downloads\pb_schema (3).normalized.json`

It preserves all 17 existing collections and adds 10 collections. Regenerate it
from the secured export with:

```bash
npm run schema:normalize -- \
  "/mnt/c/Users/Guill/Downloads/pb_schema (3).secure.json" \
  "/mnt/c/Users/Guill/Downloads/pb_schema (3).normalized.json"
```

## Application Cutover

Do not change all modules at once. Use a repository adapter and a feature flag
for each domain.

### Checklists

1. Add a normalized checklist repository.
2. Dual-write each edit to the blob and normalized records.
3. Compare reconstructed normalized state with the blob after each write.
4. Switch reads to normalized records for staff testers.
5. Keep blob writes enabled during the observation period.
6. Stop blob writes only after reconciliation remains clean.

Normalized records eliminate whole-document race conditions and allow audit
queries by date, checklist, item, and staff member.

### Clock Entries

1. Replace whole-array mutation with one `clock_entries.create()` per punch.
2. During transition, continue appending the same punch to `clockins.data`.
3. Compare weekly totals from both sources.
4. Switch reports and realtime subscriptions to `clock_entries`.

This should be the first code cutover because it is append-only and easiest to
reconcile.

### Recipes

1. Add a normalized recipe repository that loads recipe rows and ordered child
   rows.
2. Dual-write create and edit operations.
3. Compare recipe counts, IDs, ingredient order, step order, and raw payloads.
4. Switch reads, then stop blob writes after the observation period.

## Second-Stage Commerce Package

The additive menu/order package was imported and migrated on September 6, 2026. `pb_schema.commerce.json` preserved all 27 existing collections, added 11
collections, and appended 17 optional typed fields to `comandas` without
changing its rules or `data` snapshot.

The added collections cover:

- menu categories and stable catalog items
- weekly blocks, block days, and item assignments
- rotation positions and date overrides
- dated service availability and sold-out state
- typed order lines linked to the immutable `comandas.data` snapshot

Generate the artifact with:

```bash
npm run schema:commerce -- pb_schema.normalized.json pb_schema.commerce.json
```

`lib/commerce-normalization.ts` creates deterministic rows, typed comanda
updates, source hashes, exact legacy payloads, and warnings for ambiguous name
links. It never deletes or clears source data. Normalized menu reads are public,
but all menu writes and order-line access remain staff-only.

The authenticated backup captured on September 6, 2026 is stored outside the
repository and PocketBase at:

`/home/medel/breezy-backups/breezy-commerce-backup-2026-09-06.json`

It has file mode `0600`, source hash `d26cec88`, one menu record, and one active
comanda. Reopening the saved file produced this deterministic plan:

- 23 menu categories and 247 catalog items
- 4 week blocks, 23 block days, and 548 day-item assignments
- 1 schedule, 4 rotation slots, and 5 week overrides
- 1 typed comanda update and 1 order line

Two non-destructive warnings remain: one block-day item name has no unique
catalog match, and the current active/sold-out payload has no `active_date`.
Both values remain intact in required legacy payloads rather than being guessed
or discarded.

The live copy completed with migration status `verified` and source hash
`d26cec88`. Independent API reconciliation confirmed 23 categories, 247 items,
4 blocks, 23 block days, 548 day assignments, 1 schedule, 4 rotation slots, 5
overrides, 1 comanda line, and 1 typed comanda update. The original `dishes`,
`store`, `week_blocks`, `rotation`, `overrides`, `sold_out`, and `comandas.data`
values remain present and unchanged.

The application code now reconstructs menu records from normalized collections
with automatic legacy fallback. Staff menu changes write the legacy record
first, then update or create normalized rows before deleting only surplus
normalized rows. New comandas store typed searchable fields beside the unchanged
`data` snapshot; staff sessions materialize order lines idempotently.

Local production-browser validation confirmed normalized requests from the
public menu and monthly calendar, correct menu rendering, the active kitchen
order, and retained source fields. Deploy this build before beginning the
observation period.

Before any future blob cleanup:

1. Restore the commerce backup into a test instance.
2. Deploy the normalized-first read and dual-write build.
3. Reconcile normalized and legacy views through an observation period.
4. Require explicit approval before clearing any menu field or `comandas.data`.

Dish names remain compatibility keys for historical snapshots and unresolved
relations. Historical order names and prices must remain immutable.

### Promotions And Labels

- Replace promo `match`, `pricing`, and `display` blobs with typed promo fields
  and promo requirements tied to stable menu item/category IDs.
- Keep label nutrition columns. Normalize only repeated structures that need
  querying; retain a raw import payload for NOM-051 traceability.

## Staff Product Model

With one instance per business, every auth user belongs to that business. Public
registration stays disabled and owners create or invite staff accounts.

Before offering this as a reusable product, add:

- active/disabled staff state
- roles such as owner, manager, kitchen, and counter
- role-aware PocketBase API rules, not only route guards
- password reset and staff offboarding
- audit records for sensitive mutations
- automated instance provisioning, backups, upgrades, and restore drills

The existing `users.role` relation points to `categories`; treat it as legacy and
do not use it for authorization. Add and populate a dedicated staff role field
before enforcing role-specific rules.

## Cleanup Gate

Legacy fields may be removed only after all of these are true:

- a full PocketBase backup has been restored successfully in a test instance
- the migration run is `verified`
- source and normalized counts reconcile
- checklist completion and clock-hour reports match
- recipe content and ordering match
- production reads use normalized collections
- dual-write monitoring shows no drift for the agreed observation period
- a final pre-cleanup snapshot is stored outside the PocketBase instance
- cleanup receives explicit manual approval

Cleanup should be a new migration with its own rollback plan. It must not be
added to the copy tool.
