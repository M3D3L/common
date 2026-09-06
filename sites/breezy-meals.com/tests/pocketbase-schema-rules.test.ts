import assert from "node:assert/strict";
import test from "node:test";

import {
  ACCESS_RULES,
  hardenSchema,
} from "../scripts/harden-pocketbase-schema.js";

const AUTHENTICATED = '@request.auth.id != ""';

function collection(name: string, rules = {}) {
  return {
    id: name,
    name,
    type: "base",
    system: false,
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    ...rules,
  };
}

test("staff collections require authentication for every operation", () => {
  const names = [
    "checklists",
    "clockins",
    "labels",
    "members",
    "memberships",
    "recipies",
    "redemptions",
  ];
  const { schema } = hardenSchema(names.map((name) => collection(name)));

  for (const item of schema) {
    assert.equal(item.listRule, AUTHENTICATED);
    assert.equal(item.viewRule, AUTHENTICATED);
    assert.equal(item.createRule, AUTHENTICATED);
    assert.equal(item.updateRule, AUTHENTICATED);
    assert.equal(item.deleteRule, AUTHENTICATED);
  }
});

test("public storefront content stays readable but requires auth to mutate", () => {
  const names = ["menu", "promos", "store"];
  const { schema } = hardenSchema(names.map((name) => collection(name)));

  for (const item of schema) {
    assert.equal(item.listRule, "");
    assert.equal(item.viewRule, "");
    assert.equal(item.createRule, AUTHENTICATED);
    assert.equal(item.updateRule, AUTHENTICATED);
    assert.equal(item.deleteRule, AUTHENTICATED);
  }
});

test("guests can submit orders but cannot inspect or change them", () => {
  const { schema } = hardenSchema([collection("comandas")]);
  const [comandas] = schema;

  assert.equal(comandas.createRule, "");
  assert.equal(comandas.listRule, AUTHENTICATED);
  assert.equal(comandas.viewRule, AUTHENTICATED);
  assert.equal(comandas.updateRule, AUTHENTICATED);
  assert.equal(comandas.deleteRule, AUTHENTICATED);
});

test("public staff-account creation is disabled", () => {
  assert.equal(ACCESS_RULES.users.createRule, null);
});

test("unknown collections are reported and left unchanged", () => {
  const original = collection("future_collection", { updateRule: null });
  const result = hardenSchema([original]);

  assert.deepEqual(result.schema[0], original);
  assert.deepEqual(result.unknown, ["future_collection"]);
});
