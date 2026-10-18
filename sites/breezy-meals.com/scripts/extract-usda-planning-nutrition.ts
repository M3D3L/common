import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import Papa from "papaparse";
import { USDA_INGREDIENT_MATCHES } from "../lib/ingredient-identities.ts";

const [, , archive, output] = process.argv;
if (!archive || !output) throw new Error("Usage: node scripts/extract-usda-planning-nutrition.ts usda-sr.zip output.json");
const directory = "FoodData_Central_sr_legacy_food_csv_2018-04/";
function csv(name: string) {
  const content = execFileSync("unzip", ["-p", archive, directory + name], { maxBuffer: 100 * 1024 * 1024 }).toString();
  const result = Papa.parse<Record<string, string>>(content, { header: true, skipEmptyLines: true });
  if (result.errors.length) throw new Error(`Invalid USDA CSV ${name}: ${result.errors[0].message}`);
  return result.data;
}
const foods = new Map(csv("food.csv").map((row) => [Number(row.fdc_id), row]));
const profiles = new Map<number, Record<string, number>>();
const nutrients: Record<string, string> = { "1008": "kcal", "1003": "protein", "1004": "fat", "1005": "carbs", "1079": "fiber", "1093": "sodium" };
for (const row of csv("food_nutrient.csv")) {
  const id = Number(row.fdc_id);
  const key = nutrients[row.nutrient_id];
  if (!key || !USDA_INGREDIENT_MATCHES.some((match) => match.fdcId === id)) continue;
  if (!profiles.has(id)) profiles.set(id, {});
  profiles.get(id)![key] = Number(row.amount);
}
const result = USDA_INGREDIENT_MATCHES.map(({ names, fdcId }) => {
  const food = foods.get(fdcId);
  const nutrition = profiles.get(fdcId);
  if (!food || !nutrition || Object.keys(nutrition).length !== 6 || Object.values(nutrition).some((value) => !Number.isFinite(value) || value < 0)) {
    throw new Error(`Missing USDA food/nutrients: ${fdcId}`);
  }
  return {
    names, fdcId, nutrition, nutrition_description: food.description,
    nutrition_source: `https://fdc.nal.usda.gov/food-details/${fdcId}/nutrients`,
    nutrition_retrieved_at: new Date().toISOString().slice(0, 10),
  };
});
await writeFile(output, JSON.stringify(result, null, 2), { mode: 0o600 });
console.log(`Extracted ${result.length} exact food profiles from official USDA SR Legacy, per 100 g.`);
