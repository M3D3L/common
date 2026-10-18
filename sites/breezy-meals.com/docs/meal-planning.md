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

Recipe associations, ingredient nutrition and equipment setup are behind
**Configuración**. Demand settings, manual production, kitchen approval and
version history are collapsed below the everyday overview. Saving and exporting
the purchasing list remain primary actions.

Both download buttons export a UTF-8 plain-text (`.txt`) shopping list for the
selected week or day. The file contains family subtotals and separate ingredient
lines using the same rounded metric display as the page, not raw floating-point
decimals. Incomplete totals are labeled provisional at the top; review details
are kept in a separate section below the shopping list, not mixed into ingredient
rows. The download does not resolve missing recipe quantities or conversions.
Kitchen-approval flags are not shopping errors: normal planning, saving and
exporting work without approving each recipe. Optional kitchen review and its
approval-only notices are visible under **Configuración** only. Genuine missing
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

The October 18, 2026 repair applied 276 writes after the verified
`ingredient-repair-before-2026-10-18.zip` backup: 90 ingredient associations and
89 count rows were repaired in the first pass, then 94 additional common-measure
rows. Across both passes, 183 imported rows gained usable measures, 20 ingredient
identities were added and 93 row associations were canonicalized. All 1,265
original ingredient texts were retained; recipe yields, dish/store records and
saved production quantities were not changed. Other recipes still contain 112
source rows needing interpretation; this does not prevent recipes with known
quantities from being planned.

Draft recipes are estimated proposals, not kitchen-tested instructions. Thermomix,
Ninja slow-cooker and rice-cooker methods require checking the actual model manual,
capacity and appropriate food-safety procedures. Conventional equipment remains
necessary for dishes requiring frying, baking or searing.

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
