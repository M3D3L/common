import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareIngredientRepairs } from "./prepare-ingredient-repairs.ts";
import { prepareNutritionRepairs, type SourcedNutritionProfile } from "./prepare-nutrition-repairs.ts";
import { parseYield, type Ingredient, type PlanningRecipe, type RecipeIngredient } from "../lib/meal-planning.ts";

interface Snapshot {
  ingredients: Array<Ingredient & { canonical_key: string; updated: string }>;
  recipe_ingredients: Array<RecipeIngredient & { parsed_text?: string; updated: string }>;
  recipes: Array<PlanningRecipe & { servings: string; updated: string }>;
}
interface Operation {
  collection: "ingredients" | "recipe_ingredients" | "recipes";
  mode: "create" | "update";
  id: string;
  expectedUpdated?: string;
  data: Record<string, unknown>;
}

export function prepareCatalogUnitRepairs(source: Snapshot, profiles: SourcedNutritionProfile[]) {
  const working = structuredClone(source);
  const combined = new Map<string, Operation>();
  function append(operation: Omit<Operation, "expectedUpdated">) {
    const key = `${operation.collection}/${operation.id}`;
    const prior = combined.get(key);
    const original = source[operation.collection].find((row) => row.id === operation.id);
    if (!prior && operation.mode === "update" && !original?.updated) throw new Error(`Missing update timestamp: ${key}`);
    combined.set(key, {
      ...operation, mode: prior?.mode ?? operation.mode,
      ...(original ? { expectedUpdated: original.updated } : {}),
      data: { ...prior?.data, ...operation.data },
    });
    const existing = working[operation.collection].find((row) => row.id === operation.id);
    if (existing) Object.assign(existing, operation.data);
    else {
      const data = operation.data;
      if (operation.collection !== "ingredients" || typeof data.name !== "string" || typeof data.canonical_key !== "string"
        || !["g", "ml", "piece"].includes(String(data.base_unit))) throw new Error(`Invalid ingredient creation: ${key}`);
      working.ingredients.push({
        ...data, id: operation.id, name: data.name, canonical_key: data.canonical_key,
        base_unit: data.base_unit === "ml" ? "ml" : data.base_unit === "g" ? "g" : "piece",
        nutrition: null, nutrition_verified: false, updated: "pending-create",
      });
    }
  }
  const identity = prepareIngredientRepairs(working);
  identity.operations.forEach(append);
  for (const recipe of working.recipes) {
    const portions = parseYield(recipe.servings);
    if (!(recipe.yield_portions > 0) && portions !== null) {
      append({ collection: "recipes", mode: "update", id: recipe.id,
        data: { yield_portions: portions, yield_verified: false } });
    }
  }
  const nutrition = prepareNutritionRepairs(working, profiles);
  nutrition.operations.forEach(append);
  return {
    operations: [...combined.values()], conflicts: identity.conflicts,
    summary: {
      records: combined.size, measureRepairs: identity.summary.parsedCounts,
      addedIngredients: identity.summary.createdIngredients,
      sourcedWeights: nutrition.operations.filter((operation) => operation.data.unit_weights).length,
      yields: [...combined.values()].filter((operation) => operation.collection === "recipes").length,
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , sourcePath, profilesPath, outputPath] = process.argv;
  if (!sourcePath || !profilesPath || !outputPath) throw new Error("Usage: node scripts/prepare-catalog-unit-repairs.ts snapshot.json profiles.json operations.json");
  const result = prepareCatalogUnitRepairs(
    JSON.parse(await readFile(sourcePath, "utf8")), JSON.parse(await readFile(profilesPath, "utf8")),
  );
  await writeFile(outputPath, JSON.stringify(result, null, 2), { mode: 0o600 });
  console.log(JSON.stringify(result.summary));
}
