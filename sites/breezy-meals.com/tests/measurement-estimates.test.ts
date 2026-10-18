import assert from "node:assert/strict";
import test from "node:test";
import { prepareMeasurementEstimates } from "../scripts/prepare-measurement-estimates.ts";
import { aggregateRequirements, normalizeIngredientQuantity, parseIngredientLine } from "../lib/meal-planning.ts";
import { formatPurchaseQuantity } from "../lib/meal-planning-summary.ts";

type Snapshot = Parameters<typeof prepareMeasurementEstimates>[0];
const breastName = "pechugas de pollo, deshuesadas y sin piel";
const fixture = (): Snapshot => ({
  recipes: [{ id: "r", title: "Pechugas gratinadas de pollo en salsa de chipotle",
    servings: "8 porciones", yield_portions: 8, updated: "before", legacy_payload: { source: "original" } }],
  ingredients: [{ id: "chicken", name: breastName, canonical_key: breastName, base_unit: "g", updated: "before" }],
  recipe_ingredients: [{ id: "row", recipe: "r", ingredient: "chicken",
    text: `5 - 6 ${breastName}`, quantity: 0, unit: "", review_required: true, updated: "before" }],
});

test("pechuga stays a distinct Spanish count unit without invented mass conversions", () => {
  const parsed = parseIngredientLine(`6 ${breastName}`);
  assert.equal(parsed.unit, "pechuga");
  assert.equal(parsed.name, breastName);
  assert.equal(parsed.quantity, 6);
  assert.equal(parsed.review_required, false);
  assert.deepEqual(normalizeIngredientQuantity({ quantity: 6, unit: "pechugas" }), { quantity: 6, unit: "pechuga" });
  assert.equal(formatPurchaseQuantity(1, "pechuga"), "1 pechuga");
  assert.equal(formatPurchaseQuantity(6, "pechuga"), "6 pechugas");
});

test("approved recipe estimates replace visible text, preserve provenance, and scale directly for purchasing", () => {
  const source = fixture();
  const original = structuredClone(source);
  const result = prepareMeasurementEstimates(source);
  assert.deepEqual(source, original);
  assert.equal(result.summary.repairedSourceRows, 1);
  assert.equal(result.summary.newIngredients, 0);
  for (const operation of result.operations) {
    assert.equal(operation.expectedUpdated, "before");
    const record = source[operation.collection].find((record) => record.id === operation.id);
    assert.ok(record);
    Object.assign(record, operation.data);
  }
  assert.equal(source.recipe_ingredients[0]?.text, `6 ${breastName}`);
  assert.equal(source.recipe_ingredients[0]?.unit, "pechuga");
  assert.equal(source.recipe_ingredients[0]?.review_required, false);
  const payload = result.operations.find((operation) => operation.collection === "recipes")!.data;
  assert.match(JSON.stringify(payload.legacy_payload), /5 - 6 pechugas/);
  assert.match(JSON.stringify(payload.legacy_payload), /original/);
  assert.match(String(payload.planning_notes), /estimadas/);
  assert.ok(!("yield_verified" in payload));
  const totals = aggregateRequirements([{ date: "2026-10-19", menu_item: "menu", quantity: 24 }],
    [{ menu_item: "menu", recipe: "r", portions: 1 }], source.recipes, source.recipe_ingredients, source.ingredients);
  assert.deepEqual(totals.warnings, []);
  assert.equal(totals.requirements[0]?.quantity, 18);
  assert.equal(totals.requirements[0]?.unit, "pechuga");
  assert.deepEqual(prepareMeasurementEstimates(source).operations, []);
});

test("mass-only condiment yields receive explicit unverified serving estimates without altering measured yields", () => {
  const source: Snapshot = { ingredients: [], recipe_ingredients: [], recipes: [
    { id: "mayo", title: "Mayonesa", servings: "300 gramos", yield_portions: 0, updated: "before" },
    { id: "red", title: "Salsa roja de molcajete", servings: "1000 g", yield_portions: 12, updated: "before" },
  ] };
  const result = prepareMeasurementEstimates(source);
  assert.equal(result.summary.estimatedYields, 1);
  assert.equal(result.operations[0]?.data.yield_portions, 20);
  assert.equal(result.operations[0]?.data.servings, "20 porciones de 15 g (estimadas)");
  assert.equal(result.operations[0]?.data.yield_verified, false);
  assert.match(JSON.stringify(result.operations[0]?.data.legacy_payload), /300 gramos/);
  assert.ok(!result.operations.some((operation) => operation.id === "red"));
});

test("unrecognized missing amounts and changed source yields fail instead of receiving arbitrary defaults", () => {
  const source = fixture();
  source.recipe_ingredients[0]!.text = "otro ingrediente sin cantidad";
  assert.throws(() => prepareMeasurementEstimates(source), /Faltan estimaciones/);
  assert.throws(() => prepareMeasurementEstimates({ ingredients: [], recipe_ingredients: [], recipes: [
    { id: "r", title: "Mayonesa", servings: "500 gramos", yield_portions: 0, updated: "before" },
  ] }), /Rendimiento modificado/);
});

test("section headings and split descriptions are not counted as additional food", () => {
  const source: Snapshot = {
    recipes: [
      { id: "pork", title: "Carne de puerco con chile y nopales", servings: "20 porciones", yield_portions: 20, updated: "before" },
      { id: "azteca", title: "Pastel Azteca", servings: "8 porciones", yield_portions: 8, updated: "before" },
    ],
    ingredients: [{ id: "corn", name: "granos de elote, enlatados", canonical_key: "granos de elote, enlatados", base_unit: "g", updated: "before" }],
    recipe_ingredients: [
      { id: "header", recipe: "pork", ingredient: "unused", text: "Carne y verduras",
        quantity: 0, unit: "", review_required: true, updated: "before" },
      { id: "corn-row", recipe: "azteca", ingredient: "corn", text: "215 g de elote amarillo",
        quantity: 215, unit: "g", review_required: false, updated: "before", sort_order: 1 },
      { id: "fragment", recipe: "azteca", ingredient: "unused", text: "enlatado, drenado",
        quantity: 0, unit: "", review_required: true, updated: "before", sort_order: 2 },
    ],
  };
  const result = prepareMeasurementEstimates(source);
  assert.deepEqual(result.operations.filter((operation) => operation.mode === "delete").map((operation) => operation.id), ["header", "fragment"]);
  const corn = result.operations.find((operation) => operation.id === "corn-row")!;
  assert.equal(corn.data.quantity, 215);
  assert.equal(corn.data.ingredient, "corn");
  assert.match(String(corn.data.text), /enlatados y drenados/);
  const audit = result.operations.filter((operation) => operation.collection === "recipes");
  assert.match(JSON.stringify(audit), /Carne y verduras/);
  assert.match(JSON.stringify(audit), /enlatado, drenado/);
});
