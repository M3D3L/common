import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test, { type TestContext } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as vue from "vue";
import * as planning from "../lib/meal-planning.ts";
import * as summary from "../lib/meal-planning-summary.ts";
import * as rotation from "../utils/rotation.ts";

const dates = ["2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23"];
interface SavedPayload {
  parameters: Record<string, unknown>;
  lines: Array<{ quantity: number }>;
  snapshot: { warnings: string[]; components: Array<{ protein_target_g: number }>; requirements: planning.RequirementsResult };
}
interface Planner {
  load: () => Promise<boolean>;
  savePlan: (approve: boolean) => Promise<void>;
  exportShoppingList: () => Promise<void>;
  weekStart: vue.Ref<string>;
  totalPlates: vue.ComputedRef<number>;
  dailyTargets: vue.Ref<Record<string, number>>;
  dailyForecastLabel: vue.ComputedRef<string>;
  forecastCredits: vue.Ref<number | null>;
  extraDaily: vue.Ref<number>;
  error: vue.Ref<string>;
  generate: () => void;
  lines: vue.Ref<Array<{ menu_item: string; quantity: number }>>;
}

function setupPlanner(t: TestContext, options: {
  credits?: number; autoDemand?: boolean; walkInDaily?: number; unreviewedRecipes?: boolean; allowDrafts?: boolean; proteinTarget?: number;
} = {}) {
  let balance = options.credits ?? 57;
  const downloads: Blob[] = [];
  const saves: SavedPayload[] = [];
  const savedPlan = {
    id: "old-plan", week_start: dates[0], status: "draft", snapshot: { credits: 80 },
    parameters: {
      serviceDays: 5, utilization: 100, extraDaily: 0, buffer: 0,
      dailyTargets: Object.fromEntries(dates.map((date) => [date, 16])),
      ...(options.autoDemand === undefined ? {} : { autoDemand: options.autoDemand }),
      ...(options.walkInDaily === undefined ? {} : { walkInDaily: options.walkInDaily }),
      ...(options.allowDrafts === undefined ? {} : { allowDrafts: options.allowDrafts }),
      respectProteinTargets: true,
    },
    lines: dates.flatMap((date) => [
      { date, menu_item: "a", quantity: 8, weight: 1 },
      { date, menu_item: "b", quantity: 8, weight: 1 },
    ]),
  };
  const loaded = {
    memberships: [{ credits_total: balance, credits_used: 0, status: "active" }],
    plans: [savedPlan],
    menuItems: [{ id: "a", name: "A", category: "guisos" }, { id: "b", name: "B", category: "guisos" }],
    recipes: [{ id: "recipe", title: "Receta", yield_portions: 4,
      yield_verified: !options.unreviewedRecipes, planning_draft: options.unreviewedRecipes === true }],
    ingredients: [{ id: "ingredient", name: "carne de res", base_unit: "g" }],
    rows: [{ id: "row", recipe: "recipe", ingredient: "ingredient", text: "400 g carne de res", quantity: 400, unit: "g" }],
    components: ["a", "b"].map((menu_item) => ({ menu_item, recipe: "recipe", portions: 1, protein_target_g: options.proteinTarget ?? 0 })),
  };
  const api = {
    load: async () => ({ ...structuredClone(loaded), memberships: [{ credits_total: balance, credits_used: 0, status: "active" }] }),
    savePlan: async (payload: SavedPayload) => { saves.push(payload); return { id: "new-plan", ...payload }; },
  };
  const imports: Record<string, unknown> = {
    "~/lib/meal-planning": planning,
    "~/lib/meal-planning-summary": summary,
    "~/utils/rotation": { ...rotation, resolveDay: () => ({ menu: { guisos: ["A", "B"] } }) },
    "@common/composables/usePocketbase": {
      default: () => ({ collection: () => ({ getFullList: async () => [] }) }),
    },
  };
  const source = readFileSync(new URL("../pages/planeacion.vue", import.meta.url), "utf8");
  const script = source.match(/<script setup lang="ts">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  const compiled = ts.transpileModule(`${script}\nmodule.exports = { load, savePlan, exportShoppingList, weekStart, totalPlates, dailyTargets, dailyForecastLabel, forecastCredits, extraDaily, error, generate, lines };`, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  const scope = vue.effectScope();
  t.after(() => scope.stop());
  scope.run(() => runInNewContext(compiled.outputText, {
    ...vue, module, exports: module.exports, Blob,
    useRoute: () => ({ query: {} }),
    useHead: () => {},
    definePageMeta: () => {},
    onMounted: () => {},
    useMealPlanning: () => api,
    useLatestMenuRecord: () => ({ record: vue.ref({}), loadError: vue.ref(false), load: async () => {} }),
    require: (id: string) => {
      if (!(id in imports)) throw new Error(`Unexpected import: ${id}`);
      return imports[id];
    },
    URL: { createObjectURL: (blob: Blob) => { downloads.push(blob); return "blob:shopping"; }, revokeObjectURL: () => {} },
    document: {
      body: { appendChild: () => {} },
      createElement: () => ({ href: "", download: "", click: () => {}, remove: () => {} }),
    },
    setTimeout: (callback: () => void) => callback(),
  }));
  const planner = module.exports as Planner;
  planner.weekStart.value = dates[0]!;
  return { planner, downloads, saves, savedPlan, setCredits: (value: number) => { balance = value; } };
}

test("opening an 80-plate draft uses exactly 57 credits when non-member customers are explicitly zero", async (t) => {
  const { planner, savedPlan, saves } = setupPlanner(t, { walkInDaily: 0 });
  assert.equal(await planner.load(), true);
  await vue.nextTick();
  assert.equal(planner.error.value, "");
  assert.equal(planner.totalPlates.value, 57);
  assert.deepEqual(Object.values(planner.dailyTargets.value), [12, 12, 11, 11, 11]);
  assert.equal(planner.dailyForecastLabel.value, "11–12");
  assert.equal(planner.forecastCredits.value, 57);
  assert.equal(savedPlan.lines.reduce((sum, line) => sum + line.quantity, 0), 80);
  assert.equal(saves.length, 0, "opening must not overwrite the historical version");
});

test("recipes are usable without approval even when a legacy plan excluded drafts", async (t) => {
  const { planner, saves, downloads } = setupPlanner(t, { unreviewedRecipes: true, allowDrafts: false });
  await planner.load();
  planner.generate();
  assert.equal(planner.error.value, "");
  assert.equal(planner.totalPlates.value, 132);
  assert.equal(planner.lines.value.length, 10);
  await planner.exportShoppingList();
  assert.equal(downloads.length, 1);
  assert.doesNotMatch(await downloads[0]!.text(), /pendiente de aprobación|excluido por receta borrador/);
  await planner.savePlan(false);
  await planner.savePlan(true);
  assert.equal(planner.error.value, "");
  assert.equal(saves.length, 2);
  for (const save of saves) {
    assert.ok(!("allowDrafts" in save.parameters));
    assert.deepEqual([...save.snapshot.warnings], []);
    assert.equal(save.lines.reduce((sum, line) => sum + line.quantity, 0), 132);
  }
});

test("historical protein targets cannot override recipe portions in shopping exports or saved versions", async (t) => {
  const { planner, saves, downloads } = setupPlanner(t, { proteinTarget: 150 });
  await planner.load();
  await planner.exportShoppingList();
  await planner.savePlan(true);
  assert.equal(planner.error.value, "");
  const saved = saves[0]!;
  assert.ok(!("respectProteinTargets" in saved.parameters));
  assert.ok(saved.snapshot.components.every((component) => component.protein_target_g === 0));
  assert.equal(saved.snapshot.requirements.requirements[0]?.quantity, 13200);
  assert.deepEqual([...saved.snapshot.warnings], []);
  assert.doesNotMatch(await downloads[0]!.text(), /rendimiento.*prote|peso.*medido/i);
});

test("refreshing and downloading rebases quantities to the latest credits before exporting", async (t) => {
  const { planner, downloads, saves, setCredits } = setupPlanner(t, { walkInDaily: 0 });
  await planner.load();
  setCredits(53);
  await planner.exportShoppingList();
  assert.equal(planner.totalPlates.value, 53);
  assert.equal(downloads.length, 1);
  const content = await downloads[0]!.text();
  assert.ok(content.includes("Platos planeados: 53."));
  assert.ok(content.includes("Créditos disponibles al descargar: 53."));
  assert.ok(!content.includes("El saldo cambió."));
  setCredits(51);
  await planner.savePlan(false);
  assert.equal(saves[0]?.lines.reduce((sum, line) => sum + line.quantity, 0), 51);
  assert.equal(saves[0]?.parameters.forecastCredits, 51);
});

test("saved versions persist the adjusted budget while explicit manual mode preserves custom counts", async (t) => {
  const automatic = setupPlanner(t, { walkInDaily: 0 });
  await automatic.planner.load();
  await automatic.planner.savePlan(false);
  assert.equal(automatic.saves[0]?.lines.reduce((sum, line) => sum + line.quantity, 0), 57);
  assert.equal(automatic.saves[0]?.parameters.forecastCredits, 57);
  assert.equal(automatic.saves[0]?.parameters.autoDemand, true);
  assert.equal(automatic.saves[0]?.parameters.walkInDaily, 0);
  const manual = setupPlanner(t, { autoDemand: false, walkInDaily: 0 });
  await manual.planner.load();
  assert.equal(manual.planner.totalPlates.value, 80);
  await manual.planner.savePlan(false);
  assert.equal(manual.saves[0]?.parameters.forecastCredits, 80);
  assert.equal(manual.saves[0]?.parameters.autoDemand, false);
});

test("zero available credits produces zero automatically planned plates", async (t) => {
  const { planner } = setupPlanner(t, { credits: 0, walkInDaily: 0 });
  assert.equal(await planner.load(), true);
  assert.equal(planner.totalPlates.value, 0);
  assert.ok(Object.values(planner.dailyTargets.value).every((quantity) => quantity === 0));
  assert.equal(planner.forecastCredits.value, 0);
});

test("legacy drafts default to 15 non-member customers every service day, adding 75 weekly plates", async (t) => {
  const { planner, downloads } = setupPlanner(t);
  assert.equal(await planner.load(), true);
  assert.equal(planner.extraDaily.value, 15);
  assert.equal(planner.totalPlates.value, 132);
  assert.deepEqual(Object.values(planner.dailyTargets.value), [27, 27, 26, 26, 26]);
  await planner.exportShoppingList();
  const text = await downloads[0]!.text();
  assert.ok(text.includes("Platos planeados: 132."));
  assert.ok(text.includes("15 por día × 5 días = 75 platos"));
});

test("editing daily non-member customers updates the whole plan and persists the chosen value", async (t) => {
  const { planner, saves } = setupPlanner(t);
  await planner.load();
  planner.extraDaily.value = 10;
  await vue.nextTick();
  assert.equal(planner.totalPlates.value, 107);
  await planner.savePlan(false);
  assert.equal(saves[0]?.parameters.walkInDaily, 10);
  const restored = setupPlanner(t, { walkInDaily: 10 });
  await restored.planner.load();
  assert.equal(restored.planner.extraDaily.value, 10);
  assert.equal(restored.planner.totalPlates.value, 107);
});

test("non-member demand remains when membership credits are zero", async (t) => {
  const { planner } = setupPlanner(t, { credits: 0 });
  await planner.load();
  assert.equal(planner.totalPlates.value, 75);
  assert.ok(Object.values(planner.dailyTargets.value).every((quantity) => quantity === 15));
});
