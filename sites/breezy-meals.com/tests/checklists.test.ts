import assert from "node:assert/strict";
import test from "node:test";

import {
  filterTemplatesByItemIds,
  weekDates,
  weekdayOf,
  type ChecklistTemplate,
} from "../utils/checklists.ts";

test("builds a Monday through Sunday strip across month boundaries", () => {
  assert.equal(weekdayOf("2026-09-06"), 0);
  assert.deepEqual(weekDates("2026-09-06"), [
    "2026-08-31",
    "2026-09-01",
    "2026-09-02",
    "2026-09-03",
    "2026-09-04",
    "2026-09-05",
    "2026-09-06",
  ]);
});

test("employee checklist views contain only explicitly assigned tasks", () => {
  const template: ChecklistTemplate = {
    id: "opening",
    title: "Apertura",
    order: 1,
    active: true,
    sections: [
      {
        key: "kitchen",
        label: "Cocina",
        items: [
          { id: "legacy-a", recordId: "item-a", label: "Preparar arroz" },
          { id: "legacy-b", recordId: "item-b", label: "Limpiar plancha" },
        ],
      },
      {
        key: "empty",
        label: "Otra área",
        items: [{ id: "legacy-c", recordId: "item-c", label: "Inventario" }],
      },
    ],
  };

  const filtered = filterTemplatesByItemIds([template], new Set(["item-b"]));

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].sections.length, 1);
  assert.deepEqual(
    filtered[0].sections[0].items.map((item) => item.recordId),
    ["item-b"],
  );
  assert.deepEqual(filterTemplatesByItemIds([template], new Set()), []);
});
