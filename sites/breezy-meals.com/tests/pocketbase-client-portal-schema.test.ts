import assert from "node:assert/strict";
import test from "node:test";

import { addClientPortalSchema } from "../scripts/add-client-portal-schema.js";

const auth = '@request.auth.id != ""';
const source = [
  {
    id: "5r730r7vsiilgv0",
    name: "members",
    schema: [],
    indexes: [],
    listRule: auth,
    viewRule: auth,
  },
  {
    id: "7pnmvktzc496xgu",
    name: "comandas",
    schema: [{ id: "costatus01", name: "status", type: "select" }],
    indexes: [],
    listRule: auth,
    viewRule: auth,
    createRule: "",
  },
  {
    id: "mdhlk8k1bjda3xg",
    name: "redemptions",
    schema: [{ id: "rdmember01", name: "member", type: "relation" }],
    indexes: [],
    listRule: auth,
    viewRule: auth,
  },
];

test("adds portal linkage without changing collection rules", () => {
  const output = addClientPortalSchema(source);
  const comandas = output.find((collection) => collection.name === "comandas");
  const redemptions = output.find(
    (collection) => collection.name === "redemptions",
  );

  assert.deepEqual(
    {
      listRule: comandas?.listRule,
      viewRule: comandas?.viewRule,
      createRule: comandas?.createRule,
    },
    { listRule: auth, viewRule: auth, createRule: "" },
  );
  assert.equal(
    comandas?.schema.some((field) => field.name === "completed_at"),
    true,
  );
  assert.equal(
    comandas?.schema.some((field) => field.name === "member"),
    true,
  );
  assert.equal(
    redemptions?.schema.some((field) => field.name === "comanda"),
    true,
  );
});

test("is idempotent", () => {
  const once = addClientPortalSchema(source);
  const twice = addClientPortalSchema(once);

  assert.deepEqual(twice, once);
});

test("requires every collection used by the portal", () => {
  assert.throws(
    () =>
      addClientPortalSchema(source.filter((item) => item.name !== "members")),
    /members/,
  );
});
