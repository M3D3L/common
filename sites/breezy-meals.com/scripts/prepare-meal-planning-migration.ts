import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { addMealPlanningSchema } from "./add-meal-planning-schema.js";
import { parseIngredientLine, parseYield } from "../lib/meal-planning.ts";
import { canonicalIngredientName, ingredientKey } from "../lib/ingredient-identities.ts";
import { MENU_RECIPE_DRAFTS } from "../lib/menu-recipe-drafts.ts";

const [, , sourcePath, profilesPath, outputPath] = process.argv;
if (!sourcePath || !profilesPath || !outputPath) throw new Error("Usage: node scripts/prepare-meal-planning-migration.ts snapshot.json profiles.json output.json");
type Row = { id: string; [key: string]: unknown };
const source: Record<string, Row[]> = JSON.parse(await readFile(sourcePath, "utf8"));
const profiles = JSON.parse(await readFile(profilesPath, "utf8")) as Array<{
  names: string[]; nutrition: Record<string, number>; nutrition_source: string;
  nutrition_description: string; nutrition_retrieved_at: string;
}>;
const stableId = (value: string) => createHash("sha256").update(value).digest("hex").slice(0, 15);
const normalizedTitle = (value: string) => ingredientKey(value).replace(/[^a-z0-9]/g, "");
const original = source.recipes;
const recipes = [...original];
const recipeCreates: Row[] = [];
const stepCreates: Row[] = [];
function descriptionFor(title: string, texts: string[]) {
  const names = [...new Set(texts.map((text) => canonicalIngredientName(parseIngredientLine(text).name)))]
    .filter((name) => !["agua", "sal", "aceite", "pimienta"].includes(ingredientKey(name))).slice(0, 4);
  return names.length ? `${title}. Preparación con ${names.join(", ")}.` : `${title}, preparado según la receta de cocina.`;
}
const recipeUpdates: Row[] = original.map((row) => ({
  id: row.id, yield_portions: parseYield(String(row.servings ?? "")) ?? 0,
  yield_verified: false, planning_draft: false,
  planning_notes: "Rendimiento importado, pendiente de validación en cocina. Se conserva el texto original.",
  description: String(row.description || descriptionFor(String(row.title), source.recipe_ingredients
    .filter((ingredient) => ingredient.recipe === row.id).map((ingredient) => String(ingredient.text)))),
}));
const allRows = [...source.recipe_ingredients];
let position = 0;
for (const draft of MENU_RECIPE_DRAFTS) {
  if (!source.menu_items.some((item) => item.surface === "dishes" && normalizedTitle(String(item.name)) === normalizedTitle(draft.menuName))) continue;
  if (recipes.some((recipe) => normalizedTitle(String(recipe.title)) === normalizedTitle(draft.menuName))) continue;
  const id = stableId(`meal-planning-draft-v1:${normalizedTitle(draft.menuName)}`);
  const row: Row = {
    id, title: draft.title, description: draft.description, legacy_id: `draft-${id}`, source_record: "meal-planning-draft-v1",
    source_index: ++position, servings: `${draft.yieldPortions} porciones`,
    yield_portions: draft.yieldPortions, yield_verified: false, planning_draft: true,
    planning_notes: `${draft.notes}${draft.purchased ? " Producto comprado: confirmar presentación y etiqueta del proveedor." : ""}`,
    equipment_methods: draft.equipmentMethods, has_detail: true,
    legacy_payload: { generated_draft: true, menu_name: draft.menuName, ingredients: draft.ingredients, steps: draft.steps },
  };
  recipeCreates.push(row);
  recipes.push(row);
  draft.ingredients.forEach((text, index) => allRows.push({
    id: stableId(`${id}:ingredient:${index}`), recipe: id, text, sort_order: index + 1,
  }));
  draft.steps.forEach((instruction, index) => stepCreates.push({
    id: stableId(`${id}:step:${index}`), recipe: id, instruction, sort_order: index + 1,
  }));
}
const ingredients = new Map<string, Row>();
const enrichedRows: Row[] = [];
for (const row of allRows) {
  const parsed = parseIngredientLine(String(row.text));
  const name = canonicalIngredientName(parsed.name);
  if (!name) throw new Error(`Empty ingredient identity: ${row.id}`);
  const key = ingredientKey(name);
  let ingredient = ingredients.get(key);
  if (!ingredient) {
    const profile = profiles.find((profile) => profile.names.some((alias) => ingredientKey(alias) === key));
    ingredient = {
      id: stableId(`ingredient-v1:${key}`), name, canonical_key: key,
      base_unit: ["ml", "l"].includes(parsed.unit ?? "") ? "ml" : "g",
      category: /res|bistec/.test(key) ? "Res" : "",
      aliases: [], nutrition: profile?.nutrition ?? null,
      nutrition_source: profile?.nutrition_source ?? "",
      nutrition_description: profile?.nutrition_description ?? "",
      nutrition_retrieved_at: profile?.nutrition_retrieved_at ?? "",
      nutrition_verified: Boolean(profile),
    };
    ingredients.set(key, ingredient);
  }
  enrichedRows.push({
    ...row, ingredient: ingredient.id, quantity: parsed.quantity ?? 0,
    unit: parsed.unit ?? "", review_required: parsed.review_required,
    parsed_text: row.text,
  });
}
const components: Row[] = [];
const menuDescriptions: Row[] = [];
const ambiguous: string[] = [];
for (const item of source.menu_items.filter((row) => row.surface === "dishes")) {
  const draft = MENU_RECIPE_DRAFTS.find((draft) => normalizedTitle(draft.menuName) === normalizedTitle(String(item.name)));
  let matches = recipes.filter((recipe) => normalizedTitle(String(recipe.title)) === normalizedTitle(String(item.name)));
  const category = source.menu_categories.find((category) => category.id === item.category)?.key;
  if (matches.length > 1 && normalizedTitle(String(item.name)) === normalizedTitle("Chicharrón en Salsa Verde")) {
    const portions = category === "guisos" ? 6 : category === "taquizas" ? 4 : null;
    if (portions) matches = matches.filter((recipe) => parseYield(String(recipe.servings)) === portions);
  }
  const originalDescription = item.legacy_payload && typeof item.legacy_payload === "object" && "description" in item.legacy_payload
    ? String(item.legacy_payload.description ?? "") : "";
  const existingRecipe = recipeUpdates.find((recipe) => recipe.id === matches[0]?.id);
  menuDescriptions.push({
    id: item.id,
    description: String(item.description || originalDescription || draft?.description || existingRecipe?.description || `${String(item.name)}. Consulta sus ingredientes y preparación en el recetario.`),
  });
  if (matches.length !== 1) { ambiguous.push(String(item.name)); continue; }
  components.push({
    id: stableId(`component-v1:${item.id}:${matches[0].id}`),
    menu_item: item.id, recipe: matches[0].id, portions: 1,
    protein_target_g: 0,
  });
}
const schema = addMealPlanningSchema(source.schema);
const changedNames = ["ingredients", "menu_item_components", "meal_plans", "recipes", "recipe_ingredients", "menu_items"];
const payload = {
  schema: schema.filter((row: Row) => changedNames.includes(String(row.name))),
  originals: { recipes: source.recipes, recipe_ingredients: source.recipe_ingredients, recipe_steps: source.recipe_steps, menu_items: source.menu_items },
  operations: [
    ...recipeCreates.map((data) => ({ collection: "recipes", mode: "create", data })),
    ...Array.from(ingredients.values()).map((data) => ({ collection: "ingredients", mode: "create", data })),
    ...recipeUpdates.map((data) => ({ collection: "recipes", mode: "update", data })),
    ...enrichedRows.map((row) => ({
      collection: "recipe_ingredients",
      mode: source.recipe_ingredients.some((original) => original.id === row.id) ? "update" : "create",
      data: source.recipe_ingredients.some((original) => original.id === row.id)
        ? { id: row.id, ingredient: row.ingredient, quantity: row.quantity, unit: row.unit, review_required: row.review_required, parsed_text: row.parsed_text }
        : row,
    })),
    ...stepCreates.map((data) => ({ collection: "recipe_steps", mode: "create", data })),
    ...components.map((data) => ({ collection: "menu_item_components", mode: "create", data })),
    ...menuDescriptions.map((data) => ({ collection: "menu_items", mode: "update", data })),
  ],
  summary: {
    originalRecipes: original.length, draftRecipes: recipeCreates.length,
    ingredients: ingredients.size, sourcedNutrition: [...ingredients.values()].filter((row) => row.nutrition_verified).length,
    originalIngredientRows: source.recipe_ingredients.length,
    ingredientRows: enrichedRows.length, reviewRows: enrichedRows.filter((row) => row.review_required).length,
    menuItems: source.menu_items.filter((row) => row.surface === "dishes").length,
    linkedItems: components.length, ambiguous,
  },
};
await writeFile(outputPath, JSON.stringify(payload), { mode: 0o600 });
console.log(JSON.stringify(payload.summary, null, 2));
