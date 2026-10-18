import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

function loadComposable<T>(name: string, globals: Record<string, unknown>, imports: Record<string, unknown> = {}): T {
  const source = readFileSync(new URL(`../composables/${name}.ts`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  runInNewContext(compiled.outputText, {
    module, exports: module.exports, ...globals,
    require: (id: string) => {
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
