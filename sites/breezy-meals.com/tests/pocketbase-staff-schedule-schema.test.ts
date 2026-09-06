import assert from "node:assert/strict";
import test from "node:test";

import {
  addStaffScheduleSchema,
  staffScheduleCollection,
} from "../scripts/add-staff-schedule-schema.js";

const AUTHENTICATED = '@request.auth.id != ""';
const VERIFIED = "@request.auth.verified = true";

const sourceSchema = () => [
  { id: "_pb_users_auth_", name: "users", type: "auth", schema: [] },
  { id: "existing", name: "existing", type: "base", schema: [] },
];

test("adds one staff shift collection without changing source collections", () => {
  const source = sourceSchema();
  const output = addStaffScheduleSchema(source);

  assert.equal(output.length, source.length + 1);
  assert.deepEqual(output.slice(0, source.length), source);
  assert.equal(output.at(-1)?.name, "staff_shifts");
});

test("authenticated staff can read schedules but only verified users edit", () => {
  const collection = staffScheduleCollection();

  assert.equal(collection.listRule, AUTHENTICATED);
  assert.equal(collection.viewRule, AUTHENTICATED);
  assert.equal(collection.createRule, VERIFIED);
  assert.equal(collection.updateRule, VERIFIED);
  assert.equal(collection.deleteRule, VERIFIED);
});

test("allows one shift per employee per business date", () => {
  const collection = staffScheduleCollection();
  const fields = new Map(collection.schema.map((field) => [field.name, field]));

  assert.equal(
    fields.get("assigned_to")?.options.collectionId,
    "_pb_users_auth_",
  );
  assert.equal(fields.get("business_date")?.required, true);
  assert.equal(fields.get("start_time")?.required, true);
  assert.equal(fields.get("end_time")?.required, true);
  assert.match(collection.indexes[0], /UNIQUE INDEX/);
  assert.match(collection.indexes[0], /assigned_to.*business_date/);
});

test("rejects missing users and duplicate schedule collections", () => {
  assert.throws(() => addStaffScheduleSchema([]), /users/);
  assert.throws(
    () =>
      addStaffScheduleSchema([
        ...sourceSchema(),
        { id: "duplicate", name: "staff_shifts", type: "base", schema: [] },
      ]),
    /already exists/,
  );
});
