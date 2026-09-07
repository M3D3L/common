import assert from "node:assert/strict";
import test from "node:test";

import {
  addNormalizedSchema,
  normalizedCollections,
} from "../scripts/add-normalized-pocketbase-schema.js";

const legacy = [
  {
    id: "legacy000000001",
    name: "checklists",
    type: "base",
    system: false,
    schema: [{ id: "legacydt", name: "data", type: "json" }],
    indexes: [],
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    options: {},
  },
];

test("the normalized schema is strictly additive", () => {
  const snapshot = JSON.stringify(legacy);
  const output = addNormalizedSchema(legacy);

  assert.equal(JSON.stringify(output.slice(0, legacy.length)), snapshot);
  assert.equal(output.length, legacy.length + 10);
});

test("all normalized collections require authentication", () => {
  const auth = '@request.auth.id != ""';

  for (const collection of normalizedCollections()) {
    assert.equal(collection.listRule, auth, `${collection.name}.listRule`);
    assert.equal(collection.viewRule, auth, `${collection.name}.viewRule`);
    if (collection.name === "clock_entries") {
      assert.equal(
        collection.createRule,
        "@request.auth.verified = true || @request.body.staff_user = @request.auth.id",
      );
    } else {
      assert.equal(
        collection.createRule,
        auth,
        `${collection.name}.createRule`,
      );
    }
    assert.equal(collection.updateRule, auth, `${collection.name}.updateRule`);
    assert.equal(collection.deleteRule, auth, `${collection.name}.deleteRule`);
  }
});

test("every normalized relation points to a known collection", () => {
  const collections = normalizedCollections();
  const ids = new Set(["_pb_users_auth_", ...collections.map(({ id }) => id)]);

  for (const collection of collections) {
    for (const field of collection.schema) {
      if (field.type === "relation") {
        assert.ok(
          ids.has(field.options.collectionId),
          `${collection.name}.${field.name} has an unknown relation target`,
        );
      }
    }
  }
});

test("rerunning against an imported target schema fails safely", () => {
  const imported = [...legacy, ...normalizedCollections()];

  assert.throws(
    () => addNormalizedSchema(imported),
    /Target collections already exist/,
  );
});
