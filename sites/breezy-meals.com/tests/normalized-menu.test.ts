import assert from "node:assert/strict";
import test from "node:test";

import {
  buildNormalizedMenuRecord,
  type NormalizedMenuRows,
} from "../lib/normalized-menu.ts";

const legacy = {
  id: "menu-1",
  label: "Preserved",
  dishes: { old: ["Legacy"] },
  active: { guisos: ["Legacy active"] },
  sold_out: ["Legacy sold out"],
  week_blocks: [],
  rotation: [],
  overrides: {},
};

const rows: NormalizedMenuRows = {
  categories: [
    {
      id: "cat-g",
      key: "guisos",
      source_record: "menu-1",
      sort_order: 1,
      legacy_payload: { dishes: [] },
    },
    {
      id: "cat-s",
      key: "sides",
      source_record: "menu-1",
      sort_order: 2,
      legacy_payload: { dishes: [] },
    },
  ],
  items: [
    {
      id: "item-2",
      category: "cat-g",
      surface: "dishes",
      name: "Birria",
      price: 125,
      source_record: "menu-1",
      sort_order: 2,
    },
    {
      id: "item-1",
      category: "cat-s",
      surface: "dishes",
      name: "Arroz",
      price: 0,
      source_record: "menu-1",
      sort_order: 1,
    },
  ],
  blocks: [
    {
      id: "block-1",
      legacy_id: "week-a",
      name: "Semana A",
      color: "red",
      source_record: "menu-1",
      sort_order: 1,
    },
  ],
  days: [{ id: "day-1", block: "block-1", weekday: 1, sort_order: 1 }],
  dayItems: [
    {
      id: "day-item-2",
      day: "day-1",
      category: "cat-s",
      legacy_name: "Arroz",
      sort_order: 2,
    },
    {
      id: "day-item-1",
      day: "day-1",
      category: "cat-g",
      legacy_name: "Birria",
      sort_order: 1,
    },
  ],
  schedules: [
    {
      id: "schedule-1",
      menu: "menu-1",
      source_record: "menu-1",
      rotation_anchor: "2026-09-07",
    },
  ],
  rotationSlots: [
    { id: "slot-1", schedule: "schedule-1", block: "block-1", sort_order: 1 },
  ],
  overrides: [
    {
      id: "override-1",
      schedule: "schedule-1",
      week_monday: "2026-09-14",
      kind: "block",
      block: "block-1",
    },
    {
      id: "override-2",
      schedule: "schedule-1",
      week_monday: "2026-09-21",
      kind: "closed",
    },
  ],
  serviceDays: [],
  serviceItems: [],
};

test("reconstructs migrated menu domains while preserving legacy fields", () => {
  const menu = buildNormalizedMenuRecord(legacy, rows);

  assert.equal(menu.label, "Preserved");
  assert.deepEqual(menu.dishes, {
    guisos: [{ name: "Birria", price: 125 }],
    sides: [{ name: "Arroz", price: 0 }],
  });
  assert.deepEqual(menu.week_blocks, [
    {
      id: "week-a",
      name: "Semana A",
      color: "red",
      days: { "1": { guisos: ["Birria"], sides: ["Arroz"] } },
    },
  ]);
  assert.deepEqual(menu.rotation, ["week-a"]);
  assert.deepEqual(menu.overrides, {
    "2026-09-14": { block: "week-a" },
    "2026-09-21": { closed: true },
  });
});

test("keeps legacy active state until normalized service rows exist", () => {
  const menu = buildNormalizedMenuRecord(legacy, rows);

  assert.deepEqual(menu.active, legacy.active);
  assert.deepEqual(menu.sold_out, legacy.sold_out);
});

test("uses normalized dated service state when present", () => {
  const menu = buildNormalizedMenuRecord(legacy, {
    ...rows,
    serviceDays: [
      { id: "service-1", schedule: "schedule-1", business_date: "2026-09-06" },
    ],
    serviceItems: [
      {
        id: "service-item-1",
        service_day: "service-1",
        category: "cat-g",
        legacy_name: "Birria",
        sort_order: 1,
        sold_out: true,
      },
    ],
  });

  assert.deepEqual(menu.active, { guisos: ["Birria"] });
  assert.deepEqual(menu.sold_out, ["Birria"]);
  assert.equal(menu.active_date, "2026-09-06");
});
