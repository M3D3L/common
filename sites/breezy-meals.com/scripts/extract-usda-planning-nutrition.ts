import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import Papa from "papaparse";
import { USDA_INGREDIENT_MATCHES } from "../lib/ingredient-identities.ts";
import { USDA_STANDARD_FOOD_ESTIMATES, type StandardFoodMatch } from "../lib/nutrition-standard-foods.ts";

const [, , archive, output] = process.argv;
if (!archive || !output) throw new Error("Usage: node scripts/extract-usda-planning-nutrition.ts usda-sr.zip output.json");
const directory = "FoodData_Central_sr_legacy_food_csv_2018-04/";
function csv(name: string, archivePath: string): Record<string, string>[] {
  const content = execFileSync("unzip", ["-p", archivePath, directory + name], { maxBuffer: 100 * 1024 * 1024 }).toString();
  const result = Papa.parse<Record<string, string>>(content, { header: true, skipEmptyLines: true });
  if (result.errors.length) throw new Error(`Invalid USDA CSV ${name}: ${result.errors[0]!.message}`);
  return result.data;
}
const foods = new Map(csv("food.csv", archive).map((row) => [Number(row.fdc_id), row]));
const portions = csv("food_portion.csv", archive);
const matches: StandardFoodMatch[] = [...USDA_INGREDIENT_MATCHES, ...USDA_STANDARD_FOOD_ESTIMATES];
const selectedIds = new Set(matches.map((match) => match.fdcId));
const profiles = new Map<number, Record<string, number>>();
const nutrients: Record<string, string> = { "1008": "kcal", "1003": "protein", "1004": "fat", "1005": "carbs", "1079": "fiber", "1093": "sodium" };
for (const row of csv("food_nutrient.csv", archive)) {
  const id = Number(row.fdc_id);
  const key = row.nutrient_id ? nutrients[row.nutrient_id] : undefined;
  if (!key || !selectedIds.has(id)) continue;
  if (!profiles.has(id)) profiles.set(id, {});
  profiles.get(id)![key] = Number(row.amount);
}
const result = matches.map(({ names, fdcId, assumption, volumePortion }) => {
  const food = foods.get(fdcId);
  const nutrition = profiles.get(fdcId);
  if (!food || !nutrition || Object.keys(nutrition).length !== 6 || Object.values(nutrition).some((value) => !Number.isFinite(value) || value < 0)) {
    throw new Error(`Missing USDA food/nutrients: ${fdcId}`);
  }
  let gramsPerMl: number | undefined;
  const foodPortions = portions.filter((row) => Number(row.fdc_id) === fdcId);
  const unitWeights: Record<string, number> = {};
  const portionWeight = (pattern: RegExp): number | undefined => {
    const portion = foodPortions.find((row) => pattern.test(row.modifier ?? "")
      && Number(row.amount) > 0 && Number(row.gram_weight) > 0);
    return portion ? Number(portion.gram_weight) / Number(portion.amount) : undefined;
  };
  const volume = portionWeight(/^liter$/i);
  const cup = portionWeight(/^cup$/i);
  const tablespoon = portionWeight(/^tbsp$/i);
  if (volume) unitWeights.ml = volume / 1000;
  else if (cup) unitWeights.ml = cup / 236.5882365;
  else if (tablespoon) unitWeights.ml = tablespoon / 14.78676478125;
  if (cup) unitWeights.taza = cup;
  for (const [unit, pattern] of [
    ["diente", /^clove$/i], ["hoja", /^leaf$/i], ["rama", /^sprigs?$/i], ["pechuga", /^breast(?:$|[ ,(])/i],
    ["piece", /^medium(?:$|[ ,(])/i], ["cabeza", /^head$/i], ["cubo", /^cube$/i],
  ] as const) {
    const weight = portionWeight(pattern);
    if (weight) unitWeights[unit] = weight;
  }
  if (!unitWeights.piece) {
    const typicalPiece = portionWeight(/^(?:breast|fillet|tortilla|pepper|fruit|ear)(?:$|[ ,(])/i);
    if (typicalPiece) unitWeights.piece = typicalPiece;
  }
  if (volumePortion) {
    const portion = portions.find((row) => Number(row.fdc_id) === fdcId
      && row.modifier === volumePortion.modifier && Number(row.amount) === 1);
    gramsPerMl = Number(portion?.gram_weight) / volumePortion.milliliters;
    if (!Number.isFinite(gramsPerMl) || gramsPerMl <= 0) throw new Error(`Missing USDA volume weight: ${fdcId}`);
    unitWeights.ml = gramsPerMl;
  }
  return {
    names, fdcId, nutrition, nutrition_description: `${food.description}${assumption ? ` | Estimación estándar: ${assumption}` : ""}`,
    ...(gramsPerMl === undefined ? {} : { grams_per_ml: gramsPerMl }),
    unit_weights: unitWeights,
    nutrition_source: `https://fdc.nal.usda.gov/food-details/${fdcId}/nutrients`,
    nutrition_retrieved_at: new Date().toISOString().slice(0, 10),
  };
});
await writeFile(output, JSON.stringify(result, null, 2), { mode: 0o600 });
console.log(`Extracted ${result.length} sourced food profiles and explicit standard estimates from official USDA SR Legacy, per 100 g.`);
