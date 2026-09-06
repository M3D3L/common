import assert from "node:assert/strict";
import test from "node:test";

import {
  createMigrationPlan,
  stableFingerprint,
  type LegacySnapshot,
} from "../lib/legacy-normalization.ts";

const snapshot: LegacySnapshot = {
  exportedAt: "2026-09-05T00:00:00.000Z",
  collections: {
    checklists: [
      {
        id: "check-source",
        data: {
          version: 2,
          lists: [
            {
              id: "open",
              title: "Apertura",
              active: true,
              order: 1,
              sections: [
                {
                  key: "kitchen",
                  label: "Cocina",
                  items: [
                    { id: "temperature", label: "Temperatura", kind: "number" },
                  ],
                },
              ],
            },
          ],
          runs: {
            "2026-09-05": {
              open: {
                checklistId: "open",
                bizDate: "2026-09-05",
                startedAt: 1788566400000,
                status: "done",
                results: {
                  temperature: {
                    done: true,
                    value: 4,
                    at: 1788566460000,
                    by: "Ana",
                  },
                },
              },
            },
          },
        },
      },
    ],
    clockins: [
      {
        id: "clock-source",
        data: {
          punches: [
            {
              user: "user-1",
              name: "Ana",
              type: "in",
              at: "2026-09-05T08:00:00.000Z",
            },
          ],
        },
      },
    ],
    recipies: [
      {
        id: "recipe-source",
        data: [
          {
            id: "r1",
            title: "Sopa",
            url: "https://example.com/sopa",
            ingredients: ["Agua", "Sal"],
            steps: ["Hervir"],
            nutrition: { calories: "100" },
            hasDetail: true,
          },
          { id: "r1", title: "Duplicada", ingredients: [], steps: [] },
        ],
      },
    ],
  },
};

test("builds normalized rows for every supported legacy entity", () => {
  const plan = createMigrationPlan(snapshot);

  assert.deepEqual(plan.counts, {
    checklist_templates: 1,
    checklist_sections: 1,
    checklist_items: 1,
    checklist_runs: 1,
    checklist_results: 1,
    clock_entries: 1,
    recipes: 2,
    recipe_ingredients: 2,
    recipe_steps: 1,
  });
  assert.equal(plan.rows.length, 11);
  assert.deepEqual(plan.warnings, []);
});

test("preserves raw payloads and duplicate legacy recipe IDs", () => {
  const plan = createMigrationPlan(snapshot);
  const recipes = plan.rows.filter(
    ({ collection }) => collection === "recipes",
  );

  assert.equal(recipes.length, 2);
  assert.equal(recipes[0].data.legacy_id, "r1");
  assert.equal(recipes[1].data.legacy_id, "r1");
  assert.equal(recipes[0].data.source_index, 1);
  assert.equal(recipes[1].data.source_index, 2);
  assert.deepEqual(
    recipes[0].data.legacy_payload,
    snapshot.collections.recipies[0].data[0],
  );
});

test("reports ambiguous checklist IDs without discarding runs or results", () => {
  const duplicate = structuredClone(snapshot);
  const list = duplicate.collections.checklists[0].data.lists[0];
  duplicate.collections.checklists[0].data.lists.push(structuredClone(list));

  const plan = createMigrationPlan(duplicate);
  const run = plan.rows.find(
    ({ collection }) => collection === "checklist_runs",
  );

  assert.ok(
    plan.warnings.some((warning) => warning.includes("matched 2 templates")),
  );
  assert.equal(run?.relationRefs, undefined);
  assert.ok(run?.data.legacy_payload);
});

test("fingerprints are stable across object key order", () => {
  assert.equal(
    stableFingerprint({ first: 1, second: { a: true, b: false } }),
    stableFingerprint({ second: { b: false, a: true }, first: 1 }),
  );
});
