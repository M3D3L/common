import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalIngredientName, ingredientKey } from "../lib/ingredient-identities.ts";
import { parseIngredientLine, type Ingredient, type RecipeIngredient } from "../lib/meal-planning.ts";
import { matchRecipeIngredient } from "../lib/recipe-ingredients.ts";

interface IngredientRecord extends Ingredient {
  canonical_key: string;
  aliases?: string[];
  nutrition_description?: string;
  nutrition_retrieved_at?: string;
}
interface Snapshot {
  ingredients: IngredientRecord[];
  recipe_ingredients: Array<RecipeIngredient & { parsed_text?: string }>;
}
interface Operation {
  collection: "ingredients" | "recipe_ingredients";
  mode: "create" | "update";
  id: string;
  data: Record<string, unknown>;
}

function sameNutrition(left: IngredientRecord, right: IngredientRecord): boolean {
  return left.nutrition_source === right.nutrition_source
    && (["kcal", "protein", "fat", "carbs", "fiber", "sodium"] as const)
      .every((key) => left.nutrition?.[key] === right.nutrition?.[key]);
}

export function prepareIngredientRepairs(source: Snapshot) {
  const operations: Operation[] = [];
  const conflicts: string[] = [];
  const groups = new Map<string, IngredientRecord[]>();
  for (const ingredient of source.ingredients) {
    const key = ingredientKey(canonicalIngredientName(ingredient.name));
    groups.set(key, [...(groups.get(key) ?? []), ingredient]);
  }
  const targets = new Map<string, IngredientRecord>();
  for (const [key, group] of groups) {
    const candidates = [...group].sort((a, b) =>
      Number(b.canonical_key === key) - Number(a.canonical_key === key)
      || Number(b.nutrition_verified === true) - Number(a.nutrition_verified === true)
      || Number(ingredientKey(b.name) === key) - Number(ingredientKey(a.name) === key)
      || a.id.localeCompare(b.id));
    const target = { ...candidates[0]! };
    targets.set(key, target);
    const name = canonicalIngredientName(target.name);
    const aliases = [...new Set([...(target.aliases ?? []), ...group.map((item) => item.name)])].filter((alias) => alias !== name).sort();
    const data: Record<string, unknown> = {};
    const verified = group.filter((ingredient) => ingredient.nutrition_verified);
    const profile = verified[0];
    if (!target.nutrition_verified && profile && verified.every((ingredient) => sameNutrition(ingredient, profile))
      && profile.base_unit === target.base_unit) {
      const nutrition = {
        nutrition: profile.nutrition, nutrition_source: profile.nutrition_source,
        nutrition_verified: true, nutrition_description: profile.nutrition_description ?? "",
        nutrition_retrieved_at: profile.nutrition_retrieved_at ?? "",
      };
      Object.assign(data, nutrition);
      Object.assign(target, nutrition);
    }
    if (target.name !== name) data.name = name;
    if (target.canonical_key !== key) data.canonical_key = key;
    if (JSON.stringify(target.aliases ?? []) !== JSON.stringify(aliases)) data.aliases = aliases;
    if (Object.keys(data).length) operations.push({ collection: "ingredients", mode: "update", id: target.id, data });
  }
  let parsedCounts = 0;
  let remappedRows = 0;
  for (const row of source.recipe_ingredients) {
    const current = source.ingredients.find((ingredient) => ingredient.id === row.ingredient);
    if (!current) throw new Error(`Missing ingredient ${row.ingredient} in row ${row.id}`);
    const parsed = parseIngredientLine(row.text);
    const importedUnit = !row.unit || /^(?:tazas?|cucharadas?|cucharaditas?|cdas?|cdtas?|cditas?)$/.test(row.unit);
    const canRepairCount = row.review_required && importedUnit && row.parsed_text === row.text
      && !parsed.review_required && parsed.quantity !== null && parsed.unit !== null
      && (row.quantity === parsed.quantity || row.quantity === 0);
    const name = canonicalIngredientName(canRepairCount ? parsed.name : current.name);
    const key = ingredientKey(name);
    let target = targets.get(key) ?? matchRecipeIngredient(name, [...targets.values()]) ?? undefined;
    if (!target && current.nutrition_verified) {
      conflicts.push(`${row.id}: sourced ingredient identity preserved while repairing its measurement.`);
      target = current;
    }
    if (!target) {
      const id = createHash("sha256").update(`ingredient-repair-v1:${key}`).digest("hex").slice(0, 15);
      if (source.ingredients.some((ingredient) => ingredient.id === id)) throw new Error(`Ingredient ID collision: ${id}`);
      target = {
        id, name, canonical_key: key, aliases: [],
        base_unit: parsed.unit === "g" || parsed.unit === "kg" ? "g"
          : parsed.unit === "ml" || parsed.unit === "l" ? "ml" : "piece",
        nutrition: null, nutrition_verified: false,
      };
      targets.set(key, target);
      operations.push({ collection: "ingredients", mode: "create", id, data: { ...target } });
    }
    if (current.nutrition_verified && current.id !== target.id && !sameNutrition(current, target)) {
      conflicts.push(`${row.id}: verified nutrition differs between ${current.id} and ${target.id}; association preserved.`);
      target = current;
    }
    const data: Record<string, unknown> = {};
    if (row.ingredient !== target.id) {
      data.ingredient = target.id;
      remappedRows++;
    }
    if (canRepairCount) {
      data.quantity = parsed.quantity;
      data.unit = parsed.unit;
      data.review_required = false;
      parsedCounts++;
    }
    if (Object.keys(data).length) operations.push({ collection: "recipe_ingredients", mode: "update", id: row.id, data });
  }
  return {
    operations, conflicts,
    summary: {
      createdIngredients: operations.filter((operation) => operation.mode === "create").length,
      updatedIngredients: operations.filter((operation) => operation.collection === "ingredients" && operation.mode === "update").length,
      remappedRows, parsedCounts, conflicts: conflicts.length,
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , sourcePath, outputPath] = process.argv;
  if (!sourcePath || !outputPath) throw new Error("Usage: node scripts/prepare-ingredient-repairs.ts snapshot.json operations.json");
  const result = prepareIngredientRepairs(JSON.parse(await readFile(sourcePath, "utf8")));
  await writeFile(outputPath, JSON.stringify(result, null, 2), { mode: 0o600 });
  console.log(JSON.stringify(result.summary));
}
