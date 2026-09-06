import assert from "node:assert/strict";
import test from "node:test";

import {
  buildChecklistViews,
  buildPunchViews,
  buildRecipeViews,
  planOrderedChildren,
} from "../lib/normalized-domain.ts";

test("plans recipe child upserts before surplus deletes", () => {
  const plan = planOrderedChildren(
    [
      { id: "second", text: "Sal", sort_order: 2 },
      { id: "first", text: "Agua", sort_order: 1 },
      { id: "third", text: "Pimienta", sort_order: 3 },
    ],
    ["Caldo", "Sal"],
    "text",
  );

  assert.deepEqual(plan.upserts, [
    { id: "first", value: "Caldo", sortOrder: 1 },
  ]);
  assert.deepEqual(plan.deletes, ["third"]);
});

test("reconstructs recipes and ordered children", () => {
  const recipes = buildRecipeViews(
    [{ id: "recipe-1", legacy_id: "r1", title: "Sopa", has_detail: true }],
    [
      { id: "i2", recipe: "recipe-1", text: "Sal", sort_order: 2 },
      { id: "i1", recipe: "recipe-1", text: "Agua", sort_order: 1 },
    ],
    [{ id: "s1", recipe: "recipe-1", instruction: "Hervir", sort_order: 1 }],
  );

  assert.equal(recipes[0].recordId, "recipe-1");
  assert.deepEqual(recipes[0].ingredients, ["Agua", "Sal"]);
  assert.deepEqual(recipes[0].steps, ["Hervir"]);
});

test("reconstructs sorted clock entries", () => {
  const punches = buildPunchViews([
    {
      id: "out",
      legacy_user_id: "u1",
      staff_name: "Ana",
      direction: "out",
      occurred_at: "2026-09-05T17:00:00Z",
    },
    {
      id: "in",
      legacy_user_id: "u1",
      staff_name: "Ana",
      direction: "in",
      occurred_at: "2026-09-05T08:00:00Z",
    },
  ]);

  assert.deepEqual(
    punches.map(({ type }) => type),
    ["in", "out"],
  );
});

test("reconstructs checklist relations and values", () => {
  const result = buildChecklistViews(
    [{ id: "template", legacy_id: "open", title: "Apertura", active: true }],
    [{ id: "section", template: "template", legacy_key: "k", label: "Cocina" }],
    [
      {
        id: "item",
        section: "section",
        legacy_id: "temp",
        label: "Temperatura",
        kind: "number",
      },
    ],
    [
      {
        id: "run",
        legacy_template_id: "open",
        business_date: "2026-09-05",
        started_at_ms: 1000,
        status: "done",
      },
    ],
    [
      {
        id: "result",
        run: "run",
        item: "item",
        legacy_item_id: "temp",
        done: true,
        number_value: 4,
        checked_at_ms: 2000,
      },
    ],
  );

  assert.equal(result.templates[0].sections[0].items[0].id, "temp");
  assert.equal(result.runsByDate["2026-09-05"].open.results.temp.value, 4);
});
