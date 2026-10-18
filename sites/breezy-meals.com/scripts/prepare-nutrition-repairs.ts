import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalIngredientName, ingredientKey } from "../lib/ingredient-identities.ts";
import type { Ingredient, NutritionProfile } from "../lib/meal-planning.ts";

interface IngredientRecord extends Ingredient {
  updated: string;
  canonical_key?: string;
  aliases?: string[];
  nutrition_description?: string;
  nutrition_retrieved_at?: string;
}
export interface SourcedNutritionProfile {
  names: string[];
  fdcId: number;
  nutrition: NutritionProfile;
  nutrition_source: string;
  nutrition_description: string;
  nutrition_retrieved_at: string;
  grams_per_ml?: number;
}
const nutrients = ["kcal", "protein", "fat", "carbs", "fiber", "sodium"] as const;

export function prepareNutritionRepairs(
  source: { ingredients: IngredientRecord[] }, profiles: SourcedNutritionProfile[],
) {
  const matches = new Map<string, SourcedNutritionProfile>();
  for (const profile of profiles) {
    if (!Number.isSafeInteger(profile.fdcId) || profile.fdcId <= 0
      || profile.nutrition_source !== `https://fdc.nal.usda.gov/food-details/${profile.fdcId}/nutrients`
      || !profile.nutrition_description.trim()
      || !/^\d{4}-\d{2}-\d{2}$/.test(profile.nutrition_retrieved_at)
      || !nutrients.every((key) => Number.isFinite(profile.nutrition[key]) && profile.nutrition[key] >= 0)
      || (profile.grams_per_ml !== undefined && (!Number.isFinite(profile.grams_per_ml) || profile.grams_per_ml <= 0))) {
      throw new Error(`Invalid sourced nutrition profile: ${profile.fdcId}`);
    }
    for (const name of profile.names) {
      const key = ingredientKey(canonicalIngredientName(name));
      const previous = matches.get(key);
      if (previous && (previous.fdcId !== profile.fdcId
        || !nutrients.every((nutrient) => previous.nutrition[nutrient] === profile.nutrition[nutrient]))) {
        throw new Error(`Conflicting food profiles: ${name}`);
      }
      matches.set(key, profile);
    }
  }
  const operations: Array<{
    collection: "ingredients"; mode: "update"; id: string; expectedUpdated: string; data: Record<string, unknown>;
  }> = [];
  const unresolved: Array<{ id: string; name: string }> = [];
  for (const ingredient of source.ingredients) {
    const name = canonicalIngredientName(ingredient.name);
    const key = ingredientKey(name);
    const profile = matches.get(key);
    const data: Record<string, unknown> = {};
    if (["sazonador knorr de pollo", "sazonador knorr de tomate"].includes(key)) {
      if (ingredient.name !== name) data.name = name;
      if (ingredient.canonical_key !== key) data.canonical_key = key;
      if (ingredient.category !== "Sazonadores") data.category = "Sazonadores";
      if (ingredient.name !== name) data.aliases = [...new Set([...(ingredient.aliases ?? []), ingredient.name])];
    }
    if (profile && !ingredient.nutrition_verified) {
      Object.assign(data, {
        nutrition: profile.nutrition, nutrition_source: profile.nutrition_source,
        nutrition_description: profile.nutrition_description,
        nutrition_retrieved_at: profile.nutrition_retrieved_at, nutrition_verified: true,
      });
    } else if (!profile && !ingredient.nutrition_verified) {
      unresolved.push({ id: ingredient.id, name });
    }
    const sameProfile = profile && ingredient.nutrition_source === profile.nutrition_source
      && nutrients.every((nutrient) => ingredient.nutrition?.[nutrient] === profile.nutrition[nutrient]);
    if (profile?.grams_per_ml && ingredient.base_unit === "ml"
      && !(Number.isFinite(ingredient.grams_per_unit) && ingredient.grams_per_unit! > 0)
      && (!ingredient.nutrition_verified || sameProfile)) {
      data.grams_per_unit = profile.grams_per_ml;
    }
    if (!Object.keys(data).length) continue;
    if (!ingredient.updated) throw new Error(`Missing concurrency timestamp: ${ingredient.id}`);
    operations.push({ collection: "ingredients", mode: "update", id: ingredient.id, expectedUpdated: ingredient.updated, data });
  }
  return { operations, unresolved };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , sourcePath, profilesPath, outputPath] = process.argv;
  if (!sourcePath || !profilesPath || !outputPath) throw new Error("Usage: node scripts/prepare-nutrition-repairs.ts snapshot.json profiles.json operations.json");
  const result = prepareNutritionRepairs(
    JSON.parse(await readFile(sourcePath, "utf8")), JSON.parse(await readFile(profilesPath, "utf8")),
  );
  await writeFile(outputPath, JSON.stringify(result, null, 2), { mode: 0o600 });
  console.log(JSON.stringify({ updates: result.operations.length, unmatchedIngredients: result.unresolved.length }));
}
