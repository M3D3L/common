import assert from "node:assert/strict";
import test from "node:test";

import {
  comparableSourceRecord,
  migrationValuesEqual,
} from "../scripts/run-commerce-migration.js";

test("PocketBase and ISO date representations compare by instant", () => {
  assert.equal(
    migrationValuesEqual(
      "placed_at",
      "2026-09-06 03:29:01.540Z",
      "2026-09-06T03:29:01.540Z",
    ),
    true,
  );
});

test("non-date migration values still require exact stable equality", () => {
  assert.equal(migrationValuesEqual("item_name", "Birria", "birria"), false);
  assert.equal(
    migrationValuesEqual(
      "legacy_payload",
      { quantity: 2, name: "Birria" },
      { name: "Birria", quantity: 2 },
    ),
    true,
  );
});

test("source comparison ignores only PocketBase updated metadata", () => {
  assert.deepEqual(
    comparableSourceRecord(
      { id: "order-1", data: { number: 4 }, updated: "new" },
      ["id", "data", "updated"],
    ),
    { id: "order-1", data: { number: 4 } },
  );
});
