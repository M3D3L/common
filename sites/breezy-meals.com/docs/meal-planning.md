# Meal planning and ingredient nutrition

The staff-only `/planeacion` page combines membership demand, dated production,
recipe components, ingredient purchasing and nutrition. Only `menu_items` with
`surface = "dishes"` are included. Store and catering catalogs are excluded.
All purchasing quantities are metric (g/kg, ml/l), or individually counted pieces.
Standard measuring tablespoons use 15 ml and teaspoons use 5 ml. Unknown household
measures such as unspecified cups remain review items rather than guessed weights.

## Everyday planning view

The main view opens on a weekly overview, automatically loading the latest saved
version for the selected week or generating a proposal from the menu rotation.
The prominent ISO week picker and previous/next buttons switch the whole plan;
week selection never writes to the database.

The meal-share pie chart shows actual planned plate percentages. Select a day to
edit a meal's percentage: the remaining meals are redistributed while preserving
the exact integer daily plate total. Zero-share meals remain available in that
day's editor. Weekly percentages combine occurrences of the same dish.

The visible **Clientes sin membresía por día** field defaults to **15 every
service day**, estimating one plate per customer. Five days add 75 plates to the
membership-based weekly demand; 57 available credits at 100% consumption plus
these customers therefore gives 132 plates before a production buffer, allocated
27, 27, 26, 26, 26. Editing the field updates automatic production quantities,
meal shares and purchasing totals. Set it to zero for membership-only planning.
The chosen value persists as `parameters.walkInDaily` (and the compatible
`extraDaily` field). Legacy plans with no explicit walk-in setting and the old
zero default use 15; a previously positive `extraDaily` value is preserved.
An explicit `walkInDaily: 0` remains zero on reload. TXT exports include the daily
customer count and its total over the exported period.

Purchasing totals show kg for quantities of at least 1,000 g and L for at least
1,000 ml. Beef, chicken, pork, seafood and rice have family subtotals with separate
ingredient/cut breakdowns; mass, volume and pieces are never added together.
Bouillon and strawberries are not classified as meat. Subtotals only include
calculable requirements and remain visibly provisional when data is incomplete.

Confirmed equivalent names share one shopping line: for example `res` / `carne de
res`, `carne molida` / `carne molida de res`, and local `calabaza` / `calabacita` /
`calabacitas`. Different cuts, mixed meats, varieties and raw/cooked states are not
merged. These local aliases also apply to newly prepared ingredient migrations.
Mass, volume and counts for the same food appear together but remain separate,
such as `ajo: 49 g + 3 dientes`; no density or whole-item weight is invented.
The ingredient's preferred base unit never prevents an explicit requirement in a
different dimension from appearing in the shopping list.

Source recipes can use cloves, sprigs, leaves, cans, packages, loaves/bars and
slices. Known whole-food counts and oranges used for juice are retained as
counts. Everyday packaged-food shorthand is interpreted as media crema containers,
yellow-cheese slices and individual Knorr products, without inventing container
size, cube weight or nutrition. These conventions are noted on the page and TXT.
Mixed seasonings remain one recipe mixture rather than guessing its proportions.
Counts may be fractional recipe requirements; round up presentations when buying.

Recipe associations and ingredient nutrition are behind
**Configuración**. Demand settings, manual production, optional fixed versions and
version history are collapsed below the everyday overview. Saving and exporting
the purchasing list remain primary actions.

Both download buttons export a UTF-8 plain-text (`.txt`) shopping list for the
selected week or day. The file contains family subtotals and separate ingredient
lines using the same rounded metric display as the page, not raw floating-point
decimals. Incomplete totals are labeled provisional at the top; review details
are kept in a separate section below the shopping list, not mixed into ingredient
rows. The download does not resolve missing recipe quantities or conversions.
Recipes appear and work by default without approval. Historical `planning_draft`
and `yield_verified` flags never exclude recipes or block production saves,
shopping exports or fixed plan versions. Recipe lists and editors show no pending
approval badges or draft toggles; production saves preserve the historical draft
flag instead of declaring an unmeasured recipe verified. Old `allowDrafts: false`
plan settings no longer exclude dishes. Optional fixed plan versions are available
under **Configuración** and require calculable quantities, not recipe approval. Genuine missing
quantities, broken associations and invalid production totals still surface in
the everyday view and exports.

Planner data requests explicitly use `cache: "no-store"`; menu rotation reads also
bypass the shared application cache. The page is not kept alive between route
visits. Opening the planner, switching weeks, recalculating or downloading fetches
current data from PocketBase. By default, loading a saved plan or refreshing
inputs automatically redistributes plate quantities to today's weekly demand,
retaining dish choices and their allocation weights. If refreshing fails,
the page shows the error and does not export or regenerate with stale data.
Saved plan versions remain intentional records, not a data cache; their ingredient
requirements are recalculated against current recipe and ingredient data.
The summary distinguishes **Platos planeados** (the saved/edited quantities),
**Previsión actual por día** (the live forecast) and **Créditos disponibles ahora**
(the live balance). Plans record the credit balance used when generated in
`parameters.forecastCredits`; older plans use `snapshot.credits` where present.
Automatic demand adjustment (`parameters.autoDemand`, default true, including
older drafts) applies when opening, refreshing, saving or downloading the plan,
and when forecast parameters change. Stored historical versions are not
overwritten; saving creates a new version. Disable automatic adjustment explicitly
for manual plate quantities. In manual mode, a visible explanation distinguishes
the saved plan from current demand and offers **Recalcular con saldo actual**.
Saving a manual plan does not relabel it as generated from today's balance.
TXT exports include the same plan/current-balance distinction.

## Data model

- `ingredients`: stable canonical identity, purchasing unit, optional explicit
  grams per ml/piece, and nutrition per 100 g with source and verification.
- `recipe_ingredients`: original `text` remains intact; `ingredient`, `quantity`,
  `unit`, `review_required` and `parsed_text` describe its structured interpretation.
- `recipes`: numeric `yield_portions`, kitchen verification, draft status,
  description, production notes and equipment methods.
- `menu_item_components`: recipe portions per sold menu item. Add each included
  side/sauce explicitly; do not count every offered side as included.
- `meal_plans`: parameters, dated menu quantities and a calculation snapshot.
  Approved plans cannot be updated through the collection's staff API rules.

`scripts/prepare-ingredient-repairs.ts snapshot.json operations.json` prepares
repeatable, non-destructive identity and imported-measure repairs. It remaps
ingredient references to canonical records, retains old IDs and source recipe
text, preserves manually changed quantities, and never changes recipe yields or
approval flags. Existing sourced nutrition may be copied between exact aliases
of the same food and preferred unit; conflicting verified profiles prevent that
association from being changed. New food/package identities have no invented
nutrition. Back up PocketBase and check concurrent record updates before applying
the generated operations.

`scripts/extract-usda-planning-nutrition.ts usda-sr.zip profiles.json` reads the
official USDA SR Legacy archive, requiring all six nutrients rather than filling
missing values with zero. Alongside exact food matches, the explicit mappings in
`lib/nutrition-standard-foods.ts` provide standard-food estimates approved for
generic ingredients. Their descriptions record assumptions such as whole milk,
regular mayonnaise, skinless boneless raw chicken breast, or 85/15 ground beef.
These estimates do not rename different foods or collapse raw/cooked identities.
Branded products and unspecified mixtures are not assigned generic meat profiles.
Source verification means the nutrient reference was checked, not that a
particular brand, finished recipe or kitchen yield was measured.

`scripts/prepare-nutrition-repairs.ts snapshot.json profiles.json operations.json`
prepares ingredient-only updates, retaining verified profiles and measured
conversions. It never changes recipe text, quantities, yields, menu items or saved
plans. A generated operation includes the original `updated` timestamp; the
operator must refuse concurrent changes before applying it. Milliliter
conversions are included only where an explicit USDA volume/weight portion is
available: milk uses 30.5 g per US fluid ounce (29.5735295625 ml), and drinking
water uses 1000 g per liter. These are standard estimates, not package weights;
they are never written as a grams-per-piece conversion.

**Knorr pollo and Knorr tomate are seasonings, not meat.** Their canonical names
identify them as Knorr seasonings, and shopping summaries exclude Knorr, bouillon,
consomme and other named seasonings from meat totals. Original recipe wording and
product counts stay intact. Brand-specific nutrition and grams per product still
require the actual label/presentation; a chicken-meat profile is never substituted.

The subsequent nutrition repair, backed up as
`nutrition-data-repair-before-2026-10-18.zip`, updated 269 existing ingredient
records: 267 gained sourced profiles, 15 gained explicit ml-to-gram conversions,
and both Knorr identities gained seasoning names/categories. All 1,358 written
fields were independently verified; recipe rows, yields, menu records and the
saved plan were unchanged. Re-running the generator produces no additional
updates. The eight reported chicken-sandwich recipe warnings now resolve to a
complete sourced estimate. This is not a claim of complete catalog nutrition:
130 identities still lack a suitable profile, and other recipes still contain
unresolved measures, product sizes or mixtures. Those diagnostics remain visible
until their underlying data is known; they are not suppressed or marked verified.

The October 18, 2026 repair applied 276 writes after the verified
`ingredient-repair-before-2026-10-18.zip` backup: 90 ingredient associations and
89 count rows were repaired in the first pass, then 94 additional common-measure
rows. Across both passes, 183 imported rows gained usable measures, 20 ingredient
identities were added and 93 row associations were canonicalized. All 1,265
original ingredient texts were retained; recipe yields, dish/store records and
saved production quantities were not changed. Other recipes still contain 112
source rows needing interpretation; this does not prevent recipes with known
quantities from being planned.

Draft recipes are estimated proposals, not kitchen-tested instructions. The recipe
and planning interfaces do not show or edit the generated Thermomix, Ninja /
slow-cooker or rice-cooker guidance. Production saves omit `equipment_methods`,
leaving existing database values untouched for historical compatibility. Original
recipe preparation steps and source information remain unchanged.

## Forecast

Available credits sum non-cancelled membership balances across all pages, clamped
at zero per bucket. Carry-forward statuses remain eligible, matching existing
membership logic. Cached `credits_used` must be reconciled against the redemption
ledger through existing administrative tools if it drifts.

Weekly forecast:

```text
ceil((available credits * utilization / 100 + extra daily meals * service days)
     * (1 + production buffer / 100))
```

The default is 100% utilization over five consecutive service dates beginning
with the selected start date. This is a planning assumption, not a prediction.
Adjust consumption and meal weights, or explicitly switch to manual daily targets.
Largest-remainder allocation distributes the weekly budget across service days
and then dishes, preserving the exact weekly total. For 57 available credits,
five days, 100% utilization and no extras/buffer, the result is 57 plates split
12, 12, 11, 11, 11, not five independently rounded 12-plate days.
Regenerating intentionally replaces manual
lines. Unresolved rotation names and closed/unresolved days are surfaced.

Production scales only from **Porciones por receta** and each component's
recipe portions per plate. The planner ignores historical protein-weight targets
for shopping, exports and new snapshots. Removed weight/equipment fields are not
cleared from old records. A yield expressed only in grams cannot establish a
serving count; enter actual portions rather than treating grams as portions.

Purchasing totals are gross requirements; inventory, package rounding, cooking
loss and procurement lead times are not automatically deducted. The date filter
changes the shopping view only; saved plans always snapshot the whole period.

## Nutrition

Food-composition values are sourced from USDA FoodData Central, SR Legacy:
<https://fdc.nal.usda.gov/download-datasets>

Official archive:
<https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip>

The extractor stores each exact food description, FDC link and retrieval date.
Matching is deliberately conservative; beef cuts/fat percentages, brands, cooked
states, generic oils and ambiguous citrus are not guessed. Nutrients are kcal,
protein/fat/carbohydrate/fiber in g and sodium in mg, per 100 g edible ingredient.
These are recipe-input estimates, not a regulatory nutrition label or laboratory
analysis; cooking retention and edible-yield losses are not modeled.

Missing sources, unverified profiles, unresolved amounts and missing weight
conversions produce explicit partial-calculation warnings. Unknown values are
never presented as verified zeroes.

Explicit counts, including individual drinks, are valid purchasing quantities
without an assumed container volume or weight. Cups remain cups. Nutrition uses
sourced `unit_weights` (grams per exact unit) independently of the preferred
purchasing unit. Household weights are standard-food estimates, not measured
package weights; existing measured conversions are preserved. Branded products
without a label remain nutritionally incomplete, not zero-calorie.

Chicken breasts remain countable as `pechuga` / `pechugas`, separate from grams
and generic pieces, in recipe editing, AI completion, shopping totals and exports.
No purchasing conversion assumes a standard breast weight.

User-approved recipe measurement estimates use recipe-specific amounts and the
upper end of explicit ranges. Ingredient names and replacement text remain in
Spanish. Estimates are recorded in production notes and
`legacy_payload.measurementEstimates`, retaining original text and removed
non-ingredient fragments. Kitchen verification is not asserted. Mass-only sauce
yields can receive explicit estimated condiment portions rather than grams being
silently treated as portions. Ordinary recipe saves preserve this history.

## Catalog-aware recipe completion

**Completar con IA** receives the current ingredient catalog, aliases and
supported units. It can deduce regional synonyms and context, with reasoning,
but cannot replace explicit quantities, guess package sizes, conflate seasonings
with meat, or invent exact amounts for ranges and “al gusto.”

On Save, equivalent ingredients reuse their catalog IDs; missing identities are
created without invented nutrition. Recipe rows store the original text alongside
the shared ingredient relation, quantity and unit consumed by both recipes and
planning. Existing manually entered measurements survive unchanged/reordered
lines. AI interpretations and reasoning persist in the recipe's existing
`legacy_payload.ingredientInterpretations`. Completing a form without saving does
not create unused catalog entries.

## Migration and preservation

Before live changes, create and verify a PocketBase server backup and export the
current schema and source recipe/menu collections to a private location.
Never put credentials or private exports in the repository.

```bash
npm run schema:meal-planning -- current-schema.json planning-schema.json
node scripts/extract-usda-planning-nutrition.ts usda-sr.zip profiles.json
node scripts/prepare-meal-planning-migration.ts snapshot.json profiles.json migration.json
node scripts/prepare-catalog-unit-repairs.ts snapshot.json profiles.json unit-repairs.json
node scripts/prepare-measurement-estimates.ts snapshot.json measurement-estimates.json
```

The preparation script produces a preview and deterministic record IDs. It is not
a destructive executor. Review its counts and ambiguous links before applying
operations through an authenticated administrative session. Import schema with
`deleteMissing: false`. Check source timestamps before writing. Apply parent rows
before child rows; verify every written field afterward and confirm original
recipe text, ingredient order, instructions and store records were preserved.
Do not blindly replay create operations; reconcile deterministic IDs first.

Editing recipe ingredient text invalidates its previous structured interpretation.
Changed yields invalidate prior verification; changed ingredients retain an
internal draft marker for provenance without hiding or disabling the recipe.
Unchanged rows retain their associations. Recipe descriptions and source
nutrition remain separately editable, and calculated nutrition is shown alongside
the original source estimate. Weekly recipe suggestions include all recipes with
details and ingredient lists, regardless of historical draft or approval flags.

## Initial live rollout (2026-10-18 UTC)

- Verified server backup: `meal-planning-before-2026-10-18.zip`.
- Preserved 72 existing recipes, 673 original ingredient lines and 327 original
  steps. Added 79 clearly marked draft recipes.
- Linked all 90 dish-catalog records. The two chicharrón variants remain distinct:
  the six-portion recipe for guisos and the four-portion recipe with tortillas
  for taquizas. Both retain their original yields and need kitchen verification.
- Added 422 ingredient records and 44 exactly matched, sourced nutrition profiles.
  There are 295 ingredient lines requiring quantity/unit review. Other nutrition
  identities still need actual product/cut/state confirmation.
- Added descriptions to all 151 recipes and all 90 dish records; preserved all
  169 store records' existing fields and timestamps.
- Reconciled 2,236 expected record operations with zero field mismatches.
- Browser validation saved a draft for 2026-10-19 with 80 planned plates across
  five days. This is a proposal, not an approved kitchen instruction.

Live data migration and application deployment are separate. The rollout above
does not imply that the new frontend has been deployed to the production domain.
