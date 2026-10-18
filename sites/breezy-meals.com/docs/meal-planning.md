# Meal planning and ingredient nutrition

The staff-only `/planeacion` page combines membership demand, dated production,
recipe components, ingredient purchasing and nutrition. Only `menu_items` with
`surface = "dishes"` are included. Store and catering catalogs are excluded.
All purchasing quantities are metric (g/kg, ml/l), or individually counted pieces.
Unknown household measures remain review items rather than guessed conversions.

## Everyday planning view

The main view opens on a weekly overview, automatically loading the latest saved
version for the selected week or generating a proposal from the menu rotation.
The prominent ISO week picker and previous/next buttons switch the whole plan;
week selection never writes to the database.

The meal-share pie chart shows actual planned plate percentages. Select a day to
edit a meal's percentage: the remaining meals are redistributed while preserving
the exact integer daily plate total. Zero-share meals remain available in that
day's editor. Weekly percentages combine occurrences of the same dish.

Purchasing totals show kg for quantities of at least 1,000 g and L for at least
1,000 ml. Beef, chicken, pork, seafood and rice have family subtotals with separate
ingredient/cut breakdowns; mass, volume and pieces are never added together.
Bouillon and strawberries are not classified as meat. Subtotals only include
calculable requirements and remain visibly provisional when data is incomplete.

Recipe associations, ingredient nutrition and equipment setup are behind
**Configuración**. Demand settings, manual production, kitchen approval and
version history are collapsed below the everyday overview. Saving and exporting
the purchasing list remain primary actions.

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

Draft recipes are estimated proposals, not kitchen-tested instructions. Thermomix,
Ninja slow-cooker and rice-cooker methods require checking the actual model manual,
capacity and appropriate food-safety procedures. Conventional equipment remains
necessary for dishes requiring frying, baking or searing.

## Forecast

Available credits sum non-cancelled membership balances across all pages, clamped
at zero per bucket. Carry-forward statuses remain eligible, matching existing
membership logic. Cached `credits_used` must be reconciled against the redemption
ledger through existing administrative tools if it drifts.

Daily forecast:

```text
ceil((available credits * utilization / 100 / service days + extra daily meals)
     * (1 + production buffer / 100))
```

The default is 100% utilization over five consecutive service dates beginning
with the selected start date. This is a planning assumption, not a prediction.
Adjust consumption, daily targets and weights. Largest-remainder allocation
preserves the integer daily total. Regenerating intentionally replaces manual
lines. Unresolved rotation names and closed/unresolved days are surfaced.

Original recipe/Thermomix portion yields take precedence. Approximately 150 g of
meat/protein food excluding sauce and sides is a general reference only, not an
automatic override. Components default to `protein_target_g = 0`, meaning original
recipe portions. For an explicit weight override, enter the
measured finished meat-only yield for the whole recipe to scale a batch to that
target. Missing cooked yield blocks those purchasing totals rather than treating
raw input weight as plated weight. An unverified entered yield remains provisional.
Disable the target toggle only for a clearly labeled original-portion draft
estimate; approval remains blocked while a required target is disabled.

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

## Migration and preservation

Before live changes, create and verify a PocketBase server backup and export the
current schema and source recipe/menu collections to a private location.
Never put credentials or private exports in the repository.

```bash
npm run schema:meal-planning -- current-schema.json planning-schema.json
node scripts/extract-usda-planning-nutrition.ts usda-sr.zip profiles.json
node scripts/prepare-meal-planning-migration.ts snapshot.json profiles.json migration.json
```

The preparation script produces a preview and deterministic record IDs. It is not
a destructive executor. Review its counts and ambiguous links before applying
operations through an authenticated administrative session. Import schema with
`deleteMissing: false`. Check source timestamps before writing. Apply parent rows
before child rows; verify every written field afterward and confirm original
recipe text, ingredient order, instructions and store records were preserved.
Do not blindly replay create operations; reconcile deterministic IDs first.

Editing recipe ingredient text invalidates its previous structured interpretation.
Changed yields require re-verification; changed ingredients return the recipe to
draft. Unchanged rows retain their associations. Recipe descriptions and source
nutrition remain separately editable, and calculated nutrition is shown alongside
the original source estimate. Weekly recipe suggestions exclude draft recipes.

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
