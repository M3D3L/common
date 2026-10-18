import assert from "node:assert/strict";
import test from "node:test";
import { prepareNutritionRepairs, type SourcedNutritionProfile } from "../scripts/prepare-nutrition-repairs.ts";
import { USDA_STANDARD_FOOD_ESTIMATES } from "../lib/nutrition-standard-foods.ts";
import { canonicalIngredientName } from "../lib/ingredient-identities.ts";
import { calculateRecipeNutrition, parseIngredientLine } from "../lib/meal-planning.ts";
import type { Ingredient, NutritionProfile } from "../lib/meal-planning.ts";
import { MENU_RECIPE_DRAFTS } from "../lib/menu-recipe-drafts.ts";

const profile: SourcedNutritionProfile = {
  names: ["leche pasteurizada"], fdcId: 171265,
  nutrition: { kcal: 61, protein: 3.15, fat: 3.25, carbs: 4.8, fiber: 0, sodium: 43 },
  nutrition_source: "https://fdc.nal.usda.gov/food-details/171265/nutrients",
  nutrition_description: "Milk, whole | Estimación estándar: leche entera.",
  nutrition_retrieved_at: "2026-10-18", grams_per_ml: 30.5 / 29.5735295625,
};
const milk = { id: "milk", updated: "before", name: "leche pasteurizada", base_unit: "ml" as const, nutrition_verified: false, grams_per_unit: 0 };

test("sourced repairs fill missing nutrition and explicit ml density without editing the input", () => {
  const source = { ingredients: [milk] };
  const before = structuredClone(source);
  const result = prepareNutritionRepairs(source, [profile]);
  assert.deepEqual(source, before);
  assert.equal(result.operations.length, 1);
  assert.equal(result.operations[0]?.expectedUpdated, "before");
  const data = result.operations[0]!.data;
  assert.equal(data.grams_per_unit, profile.grams_per_ml);
  assert.equal(data.nutrition_verified, true);
  assert.ok(!("base_unit" in data) && !("name" in data));
  const repaired = { ...milk, ...data, nutrition: profile.nutrition, nutrition_source: profile.nutrition_source,
    nutrition_verified: true, grams_per_unit: profile.grams_per_ml };
  assert.deepEqual(prepareNutritionRepairs({ ingredients: [repaired] }, [profile]).operations, []);
  const nutrition = calculateRecipeNutrition({ id: "r", title: "Milk", yield_portions: 1 }, [
    { id: "row", recipe: "r", ingredient: "milk", quantity: 150, unit: "ml", text: "150 ml leche pasteurizada" },
  ], [repaired]);
  assert.equal(nutrition.complete, true);
  assert.deepEqual(nutrition.warnings, []);
  assert.equal(nutrition.total.kcal, 61 * (150 * profile.grams_per_ml! / 100));
});

test("verified profiles, measured densities and non-ml unit weights are preserved", () => {
  const custom = { ...milk, nutrition_verified: true, nutrition: profile.nutrition, nutrition_source: "label", grams_per_unit: 1.04 };
  assert.deepEqual(prepareNutritionRepairs({ ingredients: [custom] }, [profile]).operations, []);
  const differentSource = { ...custom, grams_per_unit: 0 };
  assert.deepEqual(prepareNutritionRepairs({ ingredients: [differentSource] }, [profile]).operations, []);
  const sameSource = { ...differentSource, nutrition_source: profile.nutrition_source };
  assert.deepEqual(prepareNutritionRepairs({ ingredients: [sameSource] }, [profile]).operations[0]?.data,
    { grams_per_unit: profile.grams_per_ml });
  for (const base_unit of ["g", "piece"] as const) {
    const data = prepareNutritionRepairs({ ingredients: [{ ...milk, base_unit }] }, [profile]).operations[0]?.data;
    assert.ok(data && !("grams_per_unit" in data));
  }
  const measured = prepareNutritionRepairs({ ingredients: [{ ...milk, grams_per_unit: 1.04 }] }, [profile]);
  assert.ok(!("grams_per_unit" in measured.operations[0]!.data));
});

test("Knorr is retained as branded seasoning, never filled with chicken meat nutrition or package guesses", () => {
  const source = { ingredients: [{ ...milk, id: "knorr", name: "knorr pollo", base_unit: "piece" as const, aliases: ["Knorr pollo"] }] };
  const result = prepareNutritionRepairs(source, [profile]);
  assert.equal(result.operations[0]?.data.name, "sazonador Knorr de pollo");
  assert.equal(result.operations[0]?.data.category, "Sazonadores");
  assert.ok(!("nutrition" in result.operations[0]!.data));
  assert.ok(!("grams_per_unit" in result.operations[0]!.data));
  assert.deepEqual(result.unresolved, [{ id: "knorr", name: "sazonador Knorr de pollo" }]);
  assert.equal(parseIngredientLine("1 knorr pollo").unit, "piece");
  for (const name of ["knorr pollo", "knorr tomate"]) assert.match(canonicalIngredientName(name), /^sazonador Knorr/);
  for (const name of ["Knorr pollo", "Pan Bimbo", "Philadelphia", "verduras herdez (en lata)", "sal, pimienta y ajo en polvo"]) {
    assert.ok(!USDA_STANDARD_FOOD_ESTIMATES.some((food) => food.names.some((alias) => alias.toLowerCase() === name.toLowerCase())));
  }
});

test("repairs reject invalid provenance, nutrient values, conflicts and missing concurrency timestamps", () => {
  for (const invalid of [
    { ...profile, nutrition_source: "" }, { ...profile, grams_per_ml: NaN },
    { ...profile, nutrition: { ...profile.nutrition, sodium: -1 } },
  ]) assert.throws(() => prepareNutritionRepairs({ ingredients: [milk] }, [invalid]), /Invalid sourced/);
  assert.throws(() => prepareNutritionRepairs({ ingredients: [milk] }, [profile, {
    ...profile, fdcId: 123, nutrition_source: "https://fdc.nal.usda.gov/food-details/123/nutrients",
  }]), /Conflicting food/);
  assert.throws(() => prepareNutritionRepairs({ ingredients: [{ ...milk, updated: "" }] }, [profile]), /timestamp/);
});

test("the chicken sandwich recipe's eight nutrition warnings are repaired with sourced data, not hidden", () => {
  const foods: Array<{ name: string; fdcId: number; nutrition: NutritionProfile; grams_per_ml?: number }> = [
    { name: "pan de caja sin corteza", fdcId: 174924, nutrition: { kcal: 266, protein: 8.85, fat: 3.33, carbs: 49.42, fiber: 2.7, sodium: 490 } },
    { name: "pechuga de pollo cruda", fdcId: 171077, nutrition: { kcal: 120, protein: 22.5, fat: 2.62, carbs: 0, fiber: 0, sodium: 45 } },
    { name: "zanahoria", fdcId: 170393, nutrition: { kcal: 41, protein: 0.93, fat: 0.24, carbs: 9.58, fiber: 2.8, sodium: 69 } },
    { name: "chícharos", fdcId: 170419, nutrition: { kcal: 81, protein: 5.42, fat: 0.4, carbs: 14.45, fiber: 5.7, sodium: 5 } },
    { name: "mayonesa comercial pasteurizada", fdcId: 171009, nutrition: { kcal: 680, protein: 0.96, fat: 74.85, carbs: 0.57, fiber: 0, sodium: 635 } },
    { name: "queso crema pasteurizado", fdcId: 173418, nutrition: { kcal: 350, protein: 6.15, fat: 34.44, carbs: 5.52, fiber: 0, sodium: 314 } },
    { name: "leche pasteurizada", fdcId: 171265, nutrition: profile.nutrition, grams_per_ml: profile.grams_per_ml },
    { name: "agua potable para cocer", fdcId: 173647, nutrition: { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sodium: 4 }, grams_per_ml: 1 },
    { name: "sal", fdcId: 173468, nutrition: { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sodium: 38758 } },
  ];
  const references = foods.map((food): SourcedNutritionProfile => ({
    ...food, names: [food.name], nutrition_description: `USDA SR Legacy ${food.fdcId}`,
    nutrition_source: `https://fdc.nal.usda.gov/food-details/${food.fdcId}/nutrients`, nutrition_retrieved_at: "2026-10-18",
  }));
  const draft = MENU_RECIPE_DRAFTS.find((recipe) => recipe.menuName === "Sandwichon de Ensalada de Pollo");
  assert.ok(draft);
  const ingredients: Array<Ingredient & { updated: string }> = foods.map((food) => {
    const verified = ["zanahoria", "chícharos", "sal"].includes(food.name);
    return { id: food.name, name: food.name, base_unit: food.grams_per_ml ? "ml" : "g", updated: "before",
      nutrition: verified ? food.nutrition : null, nutrition_verified: verified,
      nutrition_source: verified ? `https://fdc.nal.usda.gov/food-details/${food.fdcId}/nutrients` : "", grams_per_unit: 0 };
  });
  const recipe = { id: "sandwich", title: draft.title, yield_portions: draft.yieldPortions };
  const rows = draft.ingredients.map((text, index) => {
    const parsed = parseIngredientLine(text);
    assert.ok(parsed.quantity !== null && parsed.unit !== null);
    const ingredient = ingredients.find((ingredient) => ingredient.name === parsed.name);
    assert.ok(ingredient, parsed.name);
    return { id: `row-${index}`, recipe: recipe.id, ingredient: ingredient.id,
      quantity: parsed.quantity, unit: parsed.unit, text, review_required: parsed.review_required };
  });
  assert.equal(calculateRecipeNutrition(recipe, rows, ingredients).warnings.length, 8);
  const repair = prepareNutritionRepairs({ ingredients }, references);
  assert.equal(repair.operations.length, 6);
  const repaired = ingredients.map((ingredient) => ({
    ...ingredient, ...repair.operations.find((operation) => operation.id === ingredient.id)?.data,
  }));
  const nutrition = calculateRecipeNutrition(recipe, rows, repaired);
  assert.deepEqual(nutrition.warnings, []);
  assert.equal(nutrition.complete, true);
  assert.ok(Math.abs(nutrition.perPortion!.kcal - 738.4866483855169) < 1e-8);
  assert.deepEqual(rows.map((row) => row.text), draft.ingredients);
});
