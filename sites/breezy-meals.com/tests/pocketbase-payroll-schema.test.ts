import assert from "node:assert/strict";
import test from "node:test";

import {
  addPayrollSchema,
  payrollCollection,
} from "../scripts/add-payroll-schema.js";

const VERIFIED = "@request.auth.verified = true";

const sourceSchema = () => [
  { id: "_pb_users_auth_", name: "users", type: "auth", schema: [] },
  { id: "existing", name: "existing", type: "base", schema: [] },
];

test("adds payroll without changing existing collections", () => {
  const source = sourceSchema();
  const output = addPayrollSchema(source);

  assert.equal(output.length, source.length + 1);
  assert.deepEqual(output.slice(0, source.length), source);
  assert.equal(output.at(-1)?.name, "payroll_entries");
});

test("only verified users can read or edit payroll", () => {
  const collection = payrollCollection();

  assert.equal(collection.listRule, VERIFIED);
  assert.equal(collection.viewRule, VERIFIED);
  assert.equal(collection.createRule, VERIFIED);
  assert.equal(collection.updateRule, VERIFIED);
  assert.equal(collection.deleteRule, VERIFIED);
});

test("stores payroll totals, acknowledgment, and protected signature", () => {
  const collection = payrollCollection();
  const fields = new Map(collection.schema.map((field) => [field.name, field]));

  assert.equal(fields.get("employee")?.options.collectionId, "_pb_users_auth_");
  assert.equal(fields.get("acknowledgement")?.required, true);
  assert.equal(fields.get("employee_signature")?.type, "file");
  assert.equal(fields.get("employee_signature")?.required, true);
  assert.equal(fields.get("employee_signature")?.options.protected, true);
  assert.equal(fields.get("net_pay")?.required, true);
  assert.match(collection.indexes[0], /UNIQUE INDEX/);
  assert.match(collection.indexes[0], /employee.*period_start.*period_end/);
});

test("rejects missing users and duplicate payroll collections", () => {
  assert.throws(() => addPayrollSchema([]), /users/);
  assert.throws(
    () =>
      addPayrollSchema([
        ...sourceSchema(),
        { id: "duplicate", name: "payroll_entries", type: "base", schema: [] },
      ]),
    /already exists/,
  );
});
