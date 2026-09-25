import assert from "node:assert/strict";
import test from "node:test";

import {
  addDisplayNewsSchema,
  displayNewsField,
} from "../scripts/add-display-news-schema.js";

const sourceSchema = () => [
  { id: "users", name: "users", type: "auth", schema: [] },
  {
    id: "menu-id",
    name: "menu",
    type: "base",
    schema: [{ id: "dishes01", name: "dishes", type: "json" }],
  },
];

test("adds optional news text to menu without mutating the source", () => {
  const source = sourceSchema();
  const output = addDisplayNewsSchema(source);
  const news = output[1].schema.find((field) => field.name === "news");

  assert.equal(source[1].schema.length, 1);
  assert.equal(output.length, source.length);
  assert.deepEqual(news, displayNewsField());
  assert.equal(news?.required, false);
  assert.equal(news?.options.max, 5000);
});

test("is idempotent when the news field already exists", () => {
  const migrated = addDisplayNewsSchema(sourceSchema());
  const output = addDisplayNewsSchema(migrated);

  assert.equal(output, migrated);
  assert.equal(
    output[1].schema.filter((field) => field.name === "news").length,
    1,
  );
});

test("rejects invalid schemas and schemas without menu", () => {
  assert.throws(() => addDisplayNewsSchema(null), /array of collections/);
  assert.throws(
    () => addDisplayNewsSchema([{ id: "users", name: "users", schema: [] }]),
    /Required collection not found: menu/,
  );
});
