import test from "node:test";
import assert from "node:assert/strict";
import { addMealPlanningSchema } from "../scripts/add-meal-planning-schema.js";

test("planning schema is additive, repeatable and retains existing rules", () => {
  const source = ["recipes", "recipe_ingredients", "menu_items"].map((name) => ({
    id: name, name, schema: [{ name: "original" }], listRule: "original-rule",
  }));
  const result = addMealPlanningSchema(source);
  assert.equal(result.length, 6);
  assert.equal(result[0].listRule, "original-rule");
  assert.equal(source[0].schema.length, 1);
  assert.deepEqual(addMealPlanningSchema(result), result);
  assert.ok(result.find((row) => row.name === "ingredients")?.listRule.includes("verified"));
  assert.ok(result.find((row) => row.name === "meal_plans")?.updateRule.includes('status != "approved"'));
  assert.equal(result.find((row) => row.name === "ingredients")?.deleteRule, null);
});

test("planning schema requires its related collections", () => {
  assert.throws(() => addMealPlanningSchema([]), /Missing collection/);
});
