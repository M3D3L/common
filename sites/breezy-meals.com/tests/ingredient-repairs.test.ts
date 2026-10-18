import assert from "node:assert/strict";
import test from "node:test";
import { prepareIngredientRepairs } from "../scripts/prepare-ingredient-repairs.ts";
import { canonicalIngredientName } from "../lib/ingredient-identities.ts";

test("confirmed aliases and preparation notes normalize without erasing food identity", () => {
  for (const [name, expected] of [
    ["res", "carne de res"], ["carne molida", "carne molida de res"],
    ["calabaza", "calabacita"], ["calabacitas", "calabacita"],
    ["pechuga de pollo cruda (proteína provisional)", "pechuga de pollo cruda"],
    ["jitomate (base roja provisional)", "jitomate"],
    ["pulpa de aguacate", "aguacate"],
    ["lechuga bola picada finamente", "lechuga bola"],
    ["Elotes (en lata)", "elote (en lata)"],
  ]) assert.equal(canonicalIngredientName(name!), expected);
  for (const name of ["calabaza de castilla", "carne molida de cerdo", "carne molida mixta", "bistec de res",
    "res cocida", "pollo cocido", "leche descremada", "aceite de oliva", "aguacate con cáscara"]) {
    assert.equal(canonicalIngredientName(name), name);
  }
});

test("repair operations remap duplicates and recover explicit counts without changing source text or manual quantities", () => {
  const source = {
    ingredients: [
      { id: "beef", name: "carne de res", canonical_key: "carne de res", base_unit: "g" as const },
      { id: "alias", name: "res", canonical_key: "res", base_unit: "g" as const },
      { id: "garlic", name: "ajo", canonical_key: "ajo", base_unit: "g" as const },
      { id: "can", name: "latas atun", canonical_key: "latas atun", base_unit: "g" as const },
    ],
    recipe_ingredients: [
      { id: "r1", recipe: "dish", ingredient: "alias", quantity: 600, unit: "g", text: "600 g res", parsed_text: "600 g res", review_required: false },
      { id: "r2", recipe: "dish", ingredient: "garlic", quantity: 2, unit: "", text: "2 dientes de ajo", parsed_text: "2 dientes de ajo", review_required: true },
      { id: "r3", recipe: "dish", ingredient: "garlic", quantity: 9, unit: "", text: "2 dientes de ajo", parsed_text: "2 dientes de ajo", review_required: true },
      { id: "r4", recipe: "dish", ingredient: "can", quantity: 4, unit: "", text: "4 latas atun", parsed_text: "4 latas atun", review_required: true },
    ],
  };
  const original = structuredClone(source);
  const repair = prepareIngredientRepairs(source);
  assert.deepEqual(source, original);
  assert.equal(repair.summary.parsedCounts, 2);
  assert.equal(repair.summary.createdIngredients, 1);
  assert.deepEqual(repair.operations.find((operation) => operation.id === "r1")?.data, { ingredient: "beef" });
  assert.deepEqual(repair.operations.find((operation) => operation.id === "r2")?.data, { quantity: 2, unit: "diente", review_required: false });
  assert.ok(!repair.operations.some((operation) => operation.id === "r3"));
  assert.ok(repair.operations.every((operation) => !("text" in operation.data) && !("parsed_text" in operation.data)));
  const created = repair.operations.find((operation) => operation.mode === "create");
  assert.equal(created?.data.name, "atun (en lata)");
  assert.equal(created?.data.nutrition_verified, false);
  assert.ok(repair.operations.every((operation) => ["ingredients", "recipe_ingredients"].includes(operation.collection)));
});

test("verified nutrition is copied only from the same exact food alias and conflicts are preserved", () => {
  const nutrition = { kcal: 20, protein: 1, fat: 0, carbs: 4, fiber: 1, sodium: 0 };
  const source = {
    ingredients: [
      { id: "green", name: "tomate verde", canonical_key: "tomate verde", base_unit: "g" as const, nutrition_verified: false },
      { id: "tomatillo", name: "tomatillo", canonical_key: "tomatillo", base_unit: "g" as const,
        nutrition, nutrition_verified: true, nutrition_source: "https://fdc.nal.usda.gov/food-details/168566/nutrients" },
    ],
    recipe_ingredients: [
      { id: "r1", recipe: "dish", ingredient: "tomatillo", quantity: 100, unit: "g", text: "100 g tomatillo", review_required: false },
    ],
  };
  const repair = prepareIngredientRepairs(source);
  assert.deepEqual(repair.conflicts, []);
  const target = repair.operations.find((operation) => operation.id === "green");
  assert.deepEqual(target?.data.nutrition, nutrition);
  assert.equal(target?.data.nutrition_source, source.ingredients[1]?.nutrition_source);
  assert.equal(repair.operations.find((operation) => operation.id === "r1")?.data.ingredient, "green");
  const conflicting = prepareIngredientRepairs({
    ...source, ingredients: source.ingredients.map((ingredient) => ingredient.id === "green"
      ? { ...ingredient, nutrition: { ...nutrition, kcal: 50 }, nutrition_verified: true, nutrition_source: "https://different-source.test" }
      : ingredient),
  });
  assert.equal(conflicting.conflicts.length, 1);
  assert.ok(!conflicting.operations.some((operation) => operation.id === "r1"));
});
