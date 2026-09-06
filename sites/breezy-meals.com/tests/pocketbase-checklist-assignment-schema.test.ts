import assert from "node:assert/strict";
import test from "node:test";

import {
  addChecklistAssignmentSchema,
  checklistAssignmentCollections,
  checklistAssignmentFields,
} from "../scripts/add-checklist-assignment-schema.js";

const MANAGER = "@request.auth.verified = true";

function sourceSchema() {
  return [
    {
      id: "_pb_users_auth_",
      name: "users",
      type: "auth",
      schema: [],
    },
    {
      id: "brzcheckitem001",
      name: "checklist_items",
      type: "base",
      schema: [{ id: "cilabel1", name: "label", type: "text" }],
    },
  ];
}

test("adds private checklist assignment collections without replacing source data", () => {
  const source = sourceSchema();
  const output = addChecklistAssignmentSchema(source);

  assert.equal(output.length, source.length + 2);
  assert.equal(source[1].schema.length, 1);
  const items = output.find(
    (collection) => collection.name === "checklist_items",
  );
  assert.equal(items?.schema.at(-1)?.name, "active");
  assert.equal(
    items?.schema.some((field) => field.name === "default_shift"),
    false,
  );
  assert.equal(items?.createRule, MANAGER);
  assert.equal(items?.updateRule, MANAGER);
  assert.equal(items?.deleteRule, MANAGER);
});

test("only managers mutate assignments and assignees can read their own", () => {
  const assignment = checklistAssignmentCollections().find(
    (collection) => collection.name === "checklist_assignments",
  );

  assert.equal(
    assignment?.schema.some((field) => field.name === "shift"),
    false,
  );
  assert.equal(assignment?.createRule, MANAGER);
  assert.equal(assignment?.updateRule, MANAGER);
  assert.equal(assignment?.deleteRule, MANAGER);
  assert.match(assignment?.listRule ?? "", /assigned_to = @request\.auth\.id/);
  assert.match(assignment?.viewRule ?? "", /@request\.auth\.verified = true/);
  assert.doesNotMatch(assignment?.viewRule ?? "", /@request\.auth\.email/);
});

test("assignees create append-only results attributed to themselves", () => {
  const results = checklistAssignmentCollections().find(
    (collection) => collection.name === "checklist_assignment_results",
  );

  assert.match(
    results?.createRule ?? "",
    /assignment\.assigned_to = @request\.auth\.id/,
  );
  assert.match(results?.createRule ?? "", /completed_by = @request\.auth\.id/);
  assert.equal(results?.updateRule, MANAGER);
  assert.equal(results?.deleteRule, MANAGER);
  assert.doesNotMatch(results?.createRule ?? "", /@request\.body/);
});

test("rejects duplicate assignment schema additions", () => {
  const source = [
    ...sourceSchema(),
    {
      id: "existing",
      name: "checklist_assignments",
      type: "base",
      schema: [],
    },
  ];

  assert.throws(
    () => addChecklistAssignmentSchema(source),
    /Target collections already exist/,
  );
  assert.equal(checklistAssignmentFields()[0].required, false);
});
