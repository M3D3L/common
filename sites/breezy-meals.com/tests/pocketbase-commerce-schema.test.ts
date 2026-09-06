import assert from "node:assert/strict";
import test from "node:test";

import {
  addCommerceSchema,
  comandaTypedFields,
  commerceCollections,
} from "../scripts/add-commerce-pocketbase-schema.js";

const menu = {
  id: "eyo86eymxgiyifl",
  name: "menu",
  type: "base",
  system: false,
  schema: [{ id: "dishes000000001", name: "dishes", type: "json" }],
  indexes: [],
  listRule: "",
  viewRule: "",
  createRule: '@request.auth.id != ""',
  updateRule: '@request.auth.id != ""',
  deleteRule: '@request.auth.id != ""',
  options: {},
};

const comandas = {
  id: "7pnmvktzc496xgu",
  name: "comandas",
  type: "base",
  system: false,
  schema: [{ id: "ulvzaq92", name: "data", type: "json" }],
  indexes: [],
  listRule: '@request.auth.id != ""',
  viewRule: '@request.auth.id != ""',
  createRule: "",
  updateRule: '@request.auth.id != ""',
  deleteRule: '@request.auth.id != ""',
  options: {},
};

const source = [menu, comandas];

test("commerce schema preserves every source field and rule", () => {
  const output = addCommerceSchema(source);
  const outputMenu = output.find((collection) => collection.name === "menu");
  const outputComandas = output.find(
    (collection) => collection.name === "comandas",
  );

  assert.deepEqual(outputMenu, menu);
  assert.deepEqual(
    outputComandas?.schema?.slice(0, comandas.schema.length),
    comandas.schema,
  );
  assert.deepEqual(
    {
      listRule: outputComandas?.listRule,
      viewRule: outputComandas?.viewRule,
      createRule: outputComandas?.createRule,
      updateRule: outputComandas?.updateRule,
      deleteRule: outputComandas?.deleteRule,
    },
    {
      listRule: comandas.listRule,
      viewRule: comandas.viewRule,
      createRule: "",
      updateRule: comandas.updateRule,
      deleteRule: comandas.deleteRule,
    },
  );
  assert.equal(
    outputComandas?.schema?.length,
    comandas.schema.length + comandaTypedFields().length,
  );
  assert.equal(output.length, source.length + commerceCollections().length);
});

test("normalized menu reads are public but all writes require staff", () => {
  const auth = '@request.auth.id != ""';

  for (const collection of commerceCollections().filter((item) =>
    item.name.startsWith("menu_"),
  )) {
    assert.equal(collection.listRule, "", `${collection.name}.listRule`);
    assert.equal(collection.viewRule, "", `${collection.name}.viewRule`);
    assert.equal(collection.createRule, auth, `${collection.name}.createRule`);
    assert.equal(collection.updateRule, auth, `${collection.name}.updateRule`);
    assert.equal(collection.deleteRule, auth, `${collection.name}.deleteRule`);
  }
});

test("normalized order lines remain staff-only", () => {
  const auth = '@request.auth.id != ""';
  const collection = commerceCollections().find(
    (item) => item.name === "comanda_lines",
  );

  assert.ok(collection);
  assert.equal(collection.listRule, auth);
  assert.equal(collection.viewRule, auth);
  assert.equal(collection.createRule, auth);
  assert.equal(collection.updateRule, auth);
  assert.equal(collection.deleteRule, auth);
});

test("every commerce relation points to a source or added collection", () => {
  const additions = commerceCollections();
  const ids = new Set([
    ...source.map(({ id }) => id),
    ...additions.map(({ id }) => id),
  ]);

  for (const collection of additions) {
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

test("typed comanda fields remain optional for legacy guest clients", () => {
  for (const field of comandaTypedFields()) {
    assert.equal(field.required, false, field.name);
  }

  const output = addCommerceSchema(source);
  const outputComandas = output.find(
    (collection) => collection.name === "comandas",
  );
  assert.equal(outputComandas?.createRule, "");
});

test("commerce schema reruns fail before duplicating fields or collections", () => {
  const imported = addCommerceSchema(source);

  assert.throws(
    () => addCommerceSchema(imported),
    /Target collections already exist/,
  );
});
