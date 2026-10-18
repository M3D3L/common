import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const STAFF = '@request.auth.id != "" && @request.auth.verified = true';
const field = (id, name, type, options = {}) => ({
  system: false, id, name, type, required: false, presentable: false,
  unique: false, options,
});
const text = (id, name) => field(id, name, "text", { min: null, max: null, pattern: "" });
const number = (id, name) => field(id, name, "number", { min: 0, max: null, noDecimal: false });
const bool = (id, name) => field(id, name, "bool", {});
const json = (id, name) => field(id, name, "json", { maxSize: 5000000 });
const relation = (id, name, collectionId) => field(id, name, "relation", {
  collectionId, cascadeDelete: false, minSelect: null, maxSelect: 1, displayFields: null,
});
const collection = (id, name, schema, indexes = []) => ({
  id, name, type: "base", system: false, schema, indexes, options: {},
  listRule: STAFF, viewRule: STAFF, createRule: STAFF, updateRule: STAFF, deleteRule: null,
});

export function addMealPlanningSchema(source) {
  if (!Array.isArray(source)) throw new TypeError("Expected a collection array.");
  for (const name of ["recipes", "recipe_ingredients", "menu_items"]) {
    if (!source.some((row) => row.name === name)) throw new Error(`Missing collection: ${name}`);
  }
  const id = (name) => source.find((row) => row.name === name).id;
  const additions = {
    recipes: [
      text("mpdesc0002", "description"),
      number("mpyield001", "yield_portions"), bool("mpyverify1", "yield_verified"),
      bool("mpdraft001", "planning_draft"), text("mpnotes001", "planning_notes"),
      json("mpmethods1", "equipment_methods"),
      number("mpprotyld1", "protein_yield_g"), bool("mpprotver1", "protein_yield_verified"),
    ],
    menu_items: [text("mpmenudesc", "description")],
    recipe_ingredients: [
      relation("mpingrel01", "ingredient", "brzingredients1"),
      number("mpquant001", "quantity"), text("mpunit0001", "unit"),
      bool("mpreview01", "review_required"), text("mporiginal", "parsed_text"),
    ],
  };
  const result = source.map((row) => additions[row.name] ? {
    ...row, schema: [...row.schema, ...additions[row.name].filter(
      (candidate) => !row.schema.some((existing) => existing.name === candidate.name),
    )],
  } : row);
  const ingredients = collection("brzingredients1", "ingredients", [
    text("mpname0001", "name"), text("mpkey00001", "canonical_key"),
    text("mpcat00001", "category"), text("mpbase0001", "base_unit"),
    number("mpgrams001", "grams_per_unit"), json("mpunitwts1", "unit_weights"), json("mpaliases1", "aliases"),
    json("mpnutri001", "nutrition"), text("mpsource01", "nutrition_source"),
    text("mpdesc0001", "nutrition_description"), bool("mpnutver01", "nutrition_verified"),
    text("mpdate0001", "nutrition_retrieved_at"),
  ], ["CREATE UNIQUE INDEX `idx_ingredient_canonical` ON `ingredients` (`canonical_key`)"]);
  const components = collection("brzmenucomp001", "menu_item_components", [
    relation("mpmenu0001", "menu_item", id("menu_items")),
    relation("mprecipe01", "recipe", id("recipes")),
    number("mpport001", "portions"),
    number("mpprottgt1", "protein_target_g"),
  ], ["CREATE UNIQUE INDEX `idx_menu_recipe_component` ON `menu_item_components` (`menu_item`, `recipe`)"]);
  components.deleteRule = STAFF;
  const plans = collection("brzmealplans01", "meal_plans", [
    text("mpstart001", "week_start"), text("mpstatus01", "status"),
    json("mpparams01", "parameters"), json("mplines001", "lines"),
    json("mpsnap0001", "snapshot"),
  ]);
  plans.updateRule = `${STAFF} && status != "approved"`;
  for (const row of [ingredients, components, plans]) {
    const index = result.findIndex((existing) => existing.name === row.name);
    if (index < 0) result.push(row);
    else result[index] = {
      ...result[index],
      schema: [...result[index].schema, ...row.schema.filter(
        (candidate) => !result[index].schema.some((existing) => existing.name === candidate.name),
      )],
    };
  }
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [, , input, output] = process.argv;
  if (!input || !output) throw new Error("Usage: node scripts/add-meal-planning-schema.js input.json output.json");
  const schema = JSON.parse(await readFile(input, "utf8"));
  await writeFile(output, JSON.stringify(addMealPlanningSchema(schema), null, 2));
}
