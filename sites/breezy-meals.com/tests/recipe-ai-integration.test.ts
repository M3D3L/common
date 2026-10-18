import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test, { type TestContext } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as vue from "vue";
import * as identities from "../lib/ingredient-identities.ts";
import * as interpretation from "../lib/recipe-ingredients.ts";
import * as planning from "../lib/meal-planning.ts";
import * as domain from "../lib/normalized-domain.ts";
import * as legacy from "../lib/legacy-normalization.ts";

function recipeApi(seed: Record<string, domain.NormalizedRecord[]> = {}) {
  const data: Record<string, domain.NormalizedRecord[]> = {
    ingredients: [], recipes: [], recipe_ingredients: [], recipe_steps: [], ...structuredClone(seed),
  };
  const writes: Array<{ collection: string; action: string; data?: Record<string, unknown> }> = [];
  let nextId = 0;
  let failure = "";
  const pb = {
    filter: (filter: string, params: Record<string, string>) =>
      filter.replace(/\{:(\w+)\}/g, (_match, key: string) => JSON.stringify(params[key])),
    collection: (collection: string) => ({
      getOne: async (id: string) => {
        const record = data[collection]?.find((record) => record.id === id);
        if (!record) throw new Error(`Missing record ${id}`);
        return structuredClone(record);
      },
      getFullList: async (options: { filter?: string } = {}) => {
        const match = options.filter?.match(/^(\w+) = "([^"]*)"$/);
        return structuredClone((data[collection] ?? []).filter((row) => !match || row[match[1]!] === match[2]));
      },
      create: async (payload: Record<string, unknown>) => {
        if (failure === collection) throw new Error(`Write failure: ${collection}`);
        const body: Record<string, unknown> = JSON.parse(JSON.stringify(payload));
        const record = { ...body, id: `${collection}-${++nextId}` };
        (data[collection] ??= []).push(record);
        writes.push({ collection, action: "create", data: payload });
        return structuredClone(record);
      },
      update: async (id: string, payload: Record<string, unknown>) => {
        if (failure === collection) throw new Error(`Write failure: ${collection}`);
        const record = data[collection]?.find((record) => record.id === id);
        if (!record) throw new Error(`Missing record ${id}`);
        const body: Record<string, unknown> = JSON.parse(JSON.stringify(payload));
        Object.assign(record, body);
        writes.push({ collection, action: "update", data: payload });
        return structuredClone(record);
      },
      delete: async (id: string) => {
        data[collection] = (data[collection] ?? []).filter((record) => record.id !== id);
        writes.push({ collection, action: "delete" });
      },
    }),
  };
  const imports: Record<string, unknown> = {
    "@common/composables/usePocketbase": { default: () => pb },
    "~/lib/normalized-domain": domain, "~/lib/legacy-normalization": legacy,
    "~/lib/meal-planning": planning, "~/lib/ingredient-identities": identities,
    "~/lib/recipe-ingredients": interpretation,
  };
  const source = readFileSync(new URL("../composables/useNormalizedOperations.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  runInNewContext(compiled.outputText, {
    module, exports: module.exports, require: (id: string) => {
      if (!(id in imports)) throw new Error(`Unexpected import ${id}`);
      return imports[id];
    },
  });
  const { default: useOperations } = module.exports as {
    default: () => { saveRecipe: (recipe: domain.RecipeView) => Promise<domain.RecipeView>; loadRecipes: () => Promise<domain.RecipeView[]> };
  };
  return { api: useOperations(), data, writes, fail: (collection: string) => { failure = collection; } };
}

const catalog: interpretation.RecipeIngredientCatalogEntry[] = [
  { id: "zucchini", name: "calabacita", canonical_key: "calabacita", base_unit: "g" },
  { id: "onion", name: "cebolla", canonical_key: "cebolla", aliases: ["cebollas"], base_unit: "g" },
  { id: "knorr", name: "sazonador Knorr de pollo", canonical_key: "sazonador knorr de pollo", base_unit: "piece" },
  { id: "chicken", name: "pechuga de pollo cruda", canonical_key: "pechuga de pollo cruda", base_unit: "g" },
];
const catalogRecords = catalog.map((ingredient) => ({ ...ingredient }));
const view = (ingredients: string[]): domain.RecipeView => ({
  recordId: "", id: "recipe", title: "Sopa", url: "", servings: "4 porciones",
  ingredients, steps: ["Cocinar."], hasDetail: true,
});

test("AI deductions use catalog IDs with reasoning while guarding incompatible identities and explicit measures", () => {
  const text = "500 g calabacín";
  const hint = { text, name: "calabacín", ingredientId: "zucchini", quantity: 500, unit: "g",
    inferred: true, reasoning: "Calabacín es el nombre regional de calabacita." };
  assert.equal(interpretation.resolveRecipeIngredient(text, catalog, hint).ingredient?.id, "zucchini");
  assert.throws(() => interpretation.resolveRecipeIngredient(text, catalog, { ...hint, quantity: 600 }), /cambió la cantidad/);
  assert.throws(() => interpretation.resolveRecipeIngredient("1 knorr pollo", catalog, {
    text: "1 knorr pollo", name: "knorr pollo", ingredientId: "chicken", quantity: 1, unit: "piece",
    inferred: true, reasoning: "Contains chicken.",
  }), /no corresponde/);
  assert.equal(interpretation.matchRecipeIngredient("cebolla picada", catalog)?.id, "onion");
  assert.equal(interpretation.matchRecipeIngredient("cebollla", catalog)?.id, "onion");
  assert.equal(interpretation.matchRecipeIngredient("carne de cerdo", catalog), null);
});

test("normal recipe saving links catalog ingredients, creates new identities once, and is immediately usable for purchasing", async () => {
  const { api, data } = recipeApi({ ingredients: catalogRecords });
  const input = view(["500 g calabacín", "10 g epazote", "5 g epazote"]);
  input.structuredIngredients = [
    { text: input.ingredients[0]!, name: "calabacín", ingredientId: "zucchini", quantity: 500, unit: "g",
      inferred: true, reasoning: "Nombre regional de calabacita." },
  ];
  const saved = await api.saveRecipe(input);
  assert.equal(data.ingredients?.filter((row) => row.name === "epazote").length, 1);
  assert.equal(data.recipes?.[0]?.yield_portions, 4);
  assert.deepEqual(data.recipe_ingredients?.map((row) => [row.text, row.quantity, row.unit, row.review_required]), [
    ["500 g calabacín", 500, "g", false], ["10 g epazote", 10, "g", false], ["5 g epazote", 5, "g", false],
  ]);
  const rows = (data.recipe_ingredients ?? []).map((row): planning.RecipeIngredient => ({
    id: row.id, recipe: String(row.recipe), ingredient: String(row.ingredient), quantity: Number(row.quantity),
    unit: String(row.unit), text: String(row.text), review_required: row.review_required === true,
  }));
  const ingredients = (data.ingredients ?? []).map((row): planning.Ingredient => ({
    id: row.id, name: String(row.name), base_unit: row.base_unit === "ml" ? "ml" : row.base_unit === "piece" ? "piece" : "g",
  }));
  const requirements = planning.aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 8 }],
    [{ menu_item: "plate", recipe: saved.recordId, portions: 1 }],
    [{ id: saved.recordId, title: saved.title, yield_portions: 4 }], rows, ingredients);
  assert.deepEqual(requirements.warnings, []);
  assert.deepEqual(requirements.requirements.map((row) => [row.name, row.quantity, row.unit]), [
    ["calabacita", 1000, "g"], ["epazote", 30, "g"],
  ]);
  const reloaded = (await api.loadRecipes())[0]!;
  assert.equal(reloaded.structuredIngredients?.[0]?.reasoning, "Nombre regional de calabacita.");
  const newIngredient = data.ingredients?.find((row) => row.name === "epazote");
  assert.equal(newIngredient?.nutrition_verified, false);
  assert.equal(newIngredient?.grams_per_unit, 0);
});

test("unchanged and reordered source lines retain manual measurements and stable ingredient-row IDs", async () => {
  const { api, data } = recipeApi({
    ingredients: catalogRecords,
    recipes: [{ id: "saved", legacy_id: "recipe", title: "Sopa", servings: "4 porciones", yield_portions: 4,
      legacy_payload: { measurementEstimates: [{ originalText: "sin cantidad", quantity: 650 }] } }],
    recipe_ingredients: [
      { id: "manual", recipe: "saved", text: "500 g calabacita", sort_order: 1, ingredient: "zucchini",
        quantity: 650, unit: "g", review_required: false, parsed_text: "500 g calabacita" },
      { id: "other", recipe: "saved", text: "100 g cebolla", sort_order: 2, ingredient: "onion",
        quantity: 100, unit: "g", review_required: false, parsed_text: "100 g cebolla" },
    ],
  });
  await api.saveRecipe({ ...view(["100 g cebolla", "500 g calabacita"]), recordId: "saved" });
  assert.equal(data.recipe_ingredients?.find((row) => row.id === "manual")?.quantity, 650);
  assert.equal(data.recipe_ingredients?.find((row) => row.id === "manual")?.sort_order, 2);
  assert.equal(data.recipe_ingredients?.length, 2);
  assert.match(JSON.stringify(data.recipes?.[0]?.legacy_payload), /sin cantidad/);
});

test("catalog write failures propagate before recipe writes and malformed AI output cannot overwrite source data", async () => {
  const { api, writes, fail } = recipeApi();
  fail("ingredients");
  await assert.rejects(api.saveRecipe(view(["100 g epazote"])), /Write failure: ingredients/);
  assert.equal(writes.length, 0);
  assert.throws(() => interpretation.parseRecipeAiFields('{"structuredIngredients":[{"text":"sal","name":"sal","quantity":2,"unit":"bucket"}]}'), /no válido/);
  const unknown = interpretation.resolveRecipeIngredient("sal al gusto", [], {
    text: "sal al gusto", name: "sal", quantity: 10, unit: "g", inferred: true, reasoning: "guess",
  });
  assert.equal(unknown.review_required, true);
  assert.equal(unknown.quantity, 0);
  assert.throws(() => interpretation.resolveRecipeIngredient("1 cucharón de knorr pollo", catalog, {
    text: "1 cucharón de knorr pollo", name: "pollo", ingredientId: "chicken",
    quantity: null, unit: null, inferred: true, reasoning: "guess",
  }), /cambia la identidad/);
});

test("actual recipe AI action sends fresh catalog and units, preserves portions, and persists deductions on save", async (t: TestContext) => {
  const memory = recipeApi({ ingredients: catalogRecords });
  let request: { command: string; data: Record<string, unknown> } | undefined;
  const recipeSource = readFileSync(new URL("../pages/recetas.vue", import.meta.url), "utf8");
  const script = recipeSource.match(/<script setup lang="ts">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  const compiled = ts.transpileModule(`${script}\nmodule.exports={form,completeWithAi,saveRecipe,openCreateForm,formError};`,
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  const scope = vue.effectScope();
  t.after(() => scope.stop());
  scope.run(() => runInNewContext(compiled.outputText, {
    ...vue, module, exports: module.exports, onMounted: () => {}, useHead: () => {}, useSeoMeta: () => {}, definePageMeta: () => {},
    useNormalizedOperations: () => memory.api,
    useMealPlanning: () => ({ loadIngredientCatalog: async () => catalog }),
    useChatGPT: () => ({ loading: vue.ref(false), run: async (command: string, data: Record<string, unknown>) => {
      request = { command, data };
      return JSON.stringify({ structuredIngredients: [
        { text: "500 g calabacín", name: "calabacín", ingredientId: "zucchini", quantity: 500, unit: "g",
          inferred: true, reasoning: "Nombre regional de calabacita." },
        { text: "10 g epazote", name: "epazote", ingredientId: null, quantity: 10, unit: "g", inferred: false },
      ] });
    } }),
    require: (id: string) => {
      if (id === "~/lib/meal-planning") return planning;
      if (id === "~/lib/recipe-ingredients") return interpretation;
      if (id === "@vueuse/core") return { useIntersectionObserver: () => {} };
      if (id.startsWith("@common/components/") || id === "lucide-vue-next" || id.endsWith(".vue")) return {};
      throw new Error(`Unexpected page import ${id}`);
    },
  }));
  const page = module.exports as {
    form: Record<string, string>; openCreateForm: () => void; completeWithAi: () => Promise<void>;
    saveRecipe: () => Promise<void>; formError: vue.Ref<string>;
  };
  page.openCreateForm();
  Object.assign(page.form, { title: "Sopa", description: "Recipe context", servings: "4 porciones",
    ingredientsText: "500 g calabacín\n10 g epazote", stepsText: "Cocinar.",
    category: "Sopas", prepTime: "10 minutos", cookTime: "20 minutos", totalTime: "30 minutos",
    calories: "100 kcal", carbs: "10 g", fat: "5 g", protein: "4 g" });
  await page.completeWithAi();
  assert.equal(page.formError.value, "");
  assert.equal(page.form.servings, "4 porciones");
  assert.equal(page.form.ingredientsText, "500 g calabacín\n10 g epazote");
  assert.equal(memory.data.ingredients?.length, catalog.length, "completion must not create unused ingredients before saving");
  assert.ok(request);
  assert.ok(Array.isArray(request.data.missingFields));
  assert.deepEqual([...request.data.missingFields], ["structuredIngredients"]);
  assert.deepEqual(request.data.supportedUnits, planning.PLANNING_UNITS);
  assert.ok(Array.isArray(request.data.ingredientCatalog));
  assert.equal(request.data.ingredientCatalog.length, catalog.length);
  assert.match(request.command, /deducir sinónimos/);
  await page.saveRecipe();
  assert.equal(page.formError.value, "");
  assert.equal(memory.data.recipes?.[0]?.yield_portions, 4);
  assert.equal(memory.data.recipes?.[0]?.description, "Recipe context");
  assert.equal(memory.data.recipe_ingredients?.[0]?.ingredient, "zucchini");
  assert.equal(memory.data.ingredients?.filter((row) => row.name === "epazote").length, 1);
});
