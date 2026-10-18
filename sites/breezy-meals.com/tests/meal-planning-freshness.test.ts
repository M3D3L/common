import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { compileTemplate, parse } from "@vue/compiler-sfc";
import type { PlanningRecipeRecord } from "../composables/useMealPlanning.ts";
import type { RecipeIngredient } from "../lib/meal-planning.ts";
import * as identities from "../lib/ingredient-identities.ts";

function loadComposable<T>(name: string, globals: Record<string, unknown>, imports: Record<string, unknown> = {}): T {
  const source = readFileSync(new URL(`../composables/${name}.ts`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  runInNewContext(compiled.outputText, {
    module, exports: module.exports, ...globals,
    require: (id: string) => {
      if (id === "~/lib/ingredient-identities") return identities;
      if (!(id in imports)) throw new Error(`Unexpected import: ${id}`);
      return imports[id];
    },
  });
  return module.exports as T;
}

test("planner reads every collection and recipe with no-store on every load", async () => {
  const calls: Array<{ name: string; options: RequestInit }> = [];
  let revision = 1;
  const pb = {
    collection: (name: string) => ({
      getFullList: async (options: RequestInit) => {
        calls.push({ name, options });
        return [{ id: name, revision }];
      },
      getOne: async (id: string, options: RequestInit) => {
        calls.push({ name, options });
        return { id, revision };
      },
    }),
    filter: () => "recipe = 'recipe-id'",
  };
  const { default: useMealPlanning } = loadComposable<{
    default: () => {
      load: () => Promise<{ ingredients: Array<{ revision: number }> }>;
      loadRecipe: (id: string) => Promise<unknown>;
    };
  }>("useMealPlanning", {}, { "@common/composables/usePocketbase": { default: () => pb } });
  const api = useMealPlanning();
  const first = await api.load();
  revision = 2;
  const second = await api.load();
  await api.loadRecipe("recipe-id");
  assert.equal(first.ingredients[0]?.revision, 1);
  assert.equal(second.ingredients[0]?.revision, 2);
  assert.equal(calls.length, 17);
  assert.ok(calls.every((call) => call.options.cache === "no-store"));
  assert.ok(calls.some((call) => call.name === "memberships"));
  assert.ok(calls.some((call) => call.name === "meal_plans"));
});

test("the shared recipe editor removes only generated equipment guidance", () => {
  const source = readFileSync(new URL("../components/recipes/RecipePlanningEditor.vue", import.meta.url), "utf8");
  const { descriptor, errors } = parse(source);
  assert.deepEqual(errors, []);
  assert.ok(descriptor.template);
  assert.doesNotMatch(descriptor.template.content, /Thermomix|Ninja|slow cooker|Arrocera|riceCooker/i);
  assert.doesNotMatch(descriptor.scriptSetup?.content ?? "", /equipment_methods|thermomix|ninja|riceCooker/);
  assert.doesNotMatch(descriptor.template.content, /planning_draft|pendiente de aprobación|Borrador/);
  assert.doesNotMatch(descriptor.template.content, /Peso final medido|protein_yield_g|protein_yield_verified/);
  assert.match(descriptor.template.content, /Notas de producción y variantes/);
  assert.match(descriptor.template.content, /Porciones por receta/);
  assert.deepEqual(compileTemplate({
    source: descriptor.template.content, filename: "RecipePlanningEditor.vue", id: "recipe-planning-editor",
  }).errors, []);
});

test("saving recipe production data does not write or clear historical equipment guidance", async () => {
  const equipment = { thermomix: ["Old guidance"], ninja: ["Old guidance"], riceCooker: ["Old guidance"] };
  const stored = { equipment_methods: equipment, yield_portions: 5, planning_draft: true,
    protein_yield_g: 1200, protein_yield_verified: true };
  const calls: Array<{ collection: string; id: string; data: Record<string, unknown> }> = [];
  const pb = {
    collection: (collection: string) => ({
      update: async (id: string, data: Record<string, unknown>) => {
        calls.push({ collection, id, data });
        if (collection === "recipes") Object.assign(stored, data);
      },
    }),
  };
  const { default: useMealPlanning } = loadComposable<{
    default: () => { saveRecipeDetails: (recipe: PlanningRecipeRecord, rows: RecipeIngredient[]) => Promise<void> };
  }>("useMealPlanning", {}, { "@common/composables/usePocketbase": { default: () => pb } });
  const api = useMealPlanning();
  const recipe = {
    id: "recipe", title: "Recipe", yield_portions: 10, yield_verified: false,
    planning_draft: false, planning_notes: "Production notes",
  };
  await api.saveRecipeDetails(recipe, [
    { id: "row", recipe: "recipe", ingredient: "ingredient", quantity: 100, unit: "g", text: "100 g ingredient" },
  ]);
  assert.deepEqual(calls.map((call) => call.collection), ["recipe_ingredients", "recipes"]);
  assert.ok(calls.every((call) => !("equipment_methods" in call.data)));
  assert.ok(calls.every((call) => !("planning_draft" in call.data)));
  assert.ok(calls.every((call) => !("protein_yield_g" in call.data) && !("protein_yield_verified" in call.data)));
  assert.equal(stored.protein_yield_g, 1200);
  assert.equal(stored.protein_yield_verified, true);
  assert.equal(stored.equipment_methods, equipment);
  assert.equal(stored.planning_draft, true);
  assert.equal(stored.yield_portions, 10);
  assert.equal(calls[0]?.data.quantity, 100);
  assert.equal(calls[1]?.data.planning_notes, "Production notes");
  await assert.rejects(api.saveRecipeDetails(recipe, [
    { id: "invalid-row", recipe: "recipe", ingredient: "", quantity: 100, unit: "g", text: "100 g ingredient" },
  ]), /Faltan datos de ingrediente/);
  assert.equal(calls.length, 2);
});

test("recipe lists and planner templates have no recipe approval badges or exclusion control", () => {
  for (const name of ["recetas", "planeacion", "semana/menu"]) {
    const source = readFileSync(new URL(`../pages/${name}.vue`, import.meta.url), "utf8");
    const { descriptor } = parse(source);
    assert.ok(descriptor.template);
    assert.doesNotMatch(descriptor.template.content, /planningDraft|planning_draft|allowDrafts|pendiente de aprobación|Borrador/);
    assert.doesNotMatch(descriptor.scriptSetup?.content ?? "", /!recipe\.planningDraft/);
  }
});

test("planner menu loading bypasses application cache and propagates no-store to normalized reads", async () => {
  const calls: unknown[][] = [];
  let normalizedOptions: { cache?: RequestCache } | undefined;
  let fail = false;
  const { useLatestMenuRecord } = loadComposable<{
    useLatestMenuRecord: () => {
      record: { value: unknown };
      loadError: { value: boolean };
      load: (options: { cache: RequestCache; strict: boolean }) => Promise<void>;
    };
  }>("useLatestMenuRecord", {
    ref: (value: unknown) => ({ value }),
    usePocketBaseCore: () => ({
      fetchCollection: async (...args: unknown[]) => {
        calls.push(args);
        return { items: [{ id: "menu-id" }] };
      },
    }),
    useNormalizedMenuOperations: () => ({
      loadMenu: async (_legacy: unknown, options: { cache?: RequestCache }) => {
        normalizedOptions = options;
        if (fail) throw new Error("Unable to refresh rotation");
        return { id: "fresh-menu" };
      },
    }),
  });
  const menu = useLatestMenuRecord();
  await menu.load({ cache: "no-store", strict: true });
  assert.equal(calls[0]?.[7], true);
  assert.equal((calls[0]?.[8] as RequestInit).cache, "no-store");
  assert.equal(normalizedOptions?.cache, "no-store");
  fail = true;
  await assert.rejects(menu.load({ cache: "no-store", strict: true }), /Unable to refresh/);
  assert.equal(menu.record.value, null);
  assert.equal(menu.loadError.value, true);
});

test("normalized menu forwards no-store to every underlying collection request", async () => {
  const calls: RequestInit[] = [];
  const { useNormalizedMenuOperations } = loadComposable<{
    useNormalizedMenuOperations: () => {
      loadMenu: (legacy: { id: string }, options: { cache: RequestCache }) => Promise<unknown>;
    };
  }>("useNormalizedMenuOperations", {}, {
    "@common/composables/usePocketbase": {
      default: () => ({
        collection: () => ({
          getFullList: async (options: RequestInit) => { calls.push(options); return []; },
        }),
      }),
    },
    "~/lib/normalized-menu": { buildNormalizedMenuRecord: (legacy: unknown) => legacy },
    "~/lib/commerce-normalization": {},
    "~/lib/legacy-normalization": {},
  });
  await useNormalizedMenuOperations().loadMenu({ id: "menu-id" }, { cache: "no-store" });
  assert.equal(calls.length, 10);
  assert.ok(calls.every((options) => options.cache === "no-store"));
});
