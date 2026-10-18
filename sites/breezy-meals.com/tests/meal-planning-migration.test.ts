import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { canonicalIngredientName } from "../lib/ingredient-identities.ts";

test("canonical identities merge explicit aliases without merging raw/cooked or beef cuts", () => {
  assert.equal(canonicalIngredientName("carne de res molida"), "carne molida de res");
  assert.equal(canonicalIngredientName("cebolla picada"), "cebolla");
  assert.notEqual(canonicalIngredientName("bistec de res"), canonicalIngredientName("carne molida de res"));
  assert.notEqual(canonicalIngredientName("pollo cocido"), canonicalIngredientName("pollo crudo"));
});

test("migration creates drafts only for actual dishes, preserves text and never touches store rows", async () => {
  const dir = await mkdtemp(join(tmpdir(), "breezy-planning-test-"));
  try {
    const source = {
      schema: ["recipes", "recipe_ingredients", "menu_items"].map((name) => ({ id: name, name, schema: [] })),
      recipes: [{ id: "originalrecipe1", title: "Sopa", servings: "4 porciones" }],
      recipe_ingredients: [{ id: "originalrow0001", recipe: "originalrecipe1", text: "200 g de cebolla", sort_order: 1 }],
      recipe_steps: [{ id: "originalstep01", recipe: "originalrecipe1", instruction: "Preparar.", sort_order: 1 }],
      menu_items: [
        { id: "dish00000000001", surface: "dishes", name: "Agua de Melón", category: "category0000001" },
        { id: "store0000000001", surface: "store", name: "Birria", category: "category0000001" },
      ],
      menu_categories: [{ id: "category0000001", key: "bebidas" }],
    };
    await writeFile(join(dir, "source.json"), JSON.stringify(source));
    await writeFile(join(dir, "profiles.json"), "[]");
    const run = spawnSync(process.execPath, [
      fileURLToPath(new URL("../scripts/prepare-meal-planning-migration.ts", import.meta.url)),
      join(dir, "source.json"), join(dir, "profiles.json"), join(dir, "result.json"),
    ], { encoding: "utf8" });
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(await readFile(join(dir, "result.json"), "utf8"));
    assert.equal(result.summary.draftRecipes, 1);
    assert.equal(result.summary.menuItems, 1);
    assert.equal(result.summary.linkedItems, 1);
    assert.deepEqual(result.originals.recipe_ingredients, source.recipe_ingredients);
    const changes = result.operations as Array<{ collection: string; mode: string; data: Record<string, unknown> }>;
    assert.ok(changes.every((change) => change.mode !== "delete"));
    assert.ok(changes.every((change) => change.data.id !== "store0000000001"));
    const ingredientChange = changes.find((change) => change.collection === "recipe_ingredients" && change.mode === "update");
    assert.ok(ingredientChange);
    assert.equal(ingredientChange.data.text, undefined);
    assert.equal(ingredientChange.data.parsed_text, "200 g de cebolla");
    const descriptions = changes.filter((change) => ["recipes", "menu_items"].includes(change.collection));
    assert.ok(descriptions.every((change) => typeof change.data.description === "string" && change.data.description.length > 0));
  } finally {
    await rm(dir, { recursive: true });
  }
});
