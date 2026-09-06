import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const USERS = "_pb_users_auth_";
const CHECKLIST_ITEMS = "brzcheckitem001";
const MANAGER = "@request.auth.verified = true";
const ASSIGNEE_READ = `${MANAGER} || assigned_to = @request.auth.id`;
const RESULT_READ = `${MANAGER} || assignment.assigned_to = @request.auth.id`;
const RESULT_CREATE = `${MANAGER} || (assignment.assigned_to = @request.auth.id && completed_by = @request.auth.id)`;

const collectionIds = {
  assignments: "brzcheckassign1",
  results: "brzassignrslt01",
};

const text = (id, name, { required = false } = {}) => ({
  system: false,
  id,
  name,
  type: "text",
  required,
  presentable: false,
  unique: false,
  options: { min: null, max: null, pattern: "" },
});

const number = (id, name) => ({
  system: false,
  id,
  name,
  type: "number",
  required: false,
  presentable: false,
  unique: false,
  options: { min: null, max: null, noDecimal: false },
});

const bool = (id, name) => ({
  system: false,
  id,
  name,
  type: "bool",
  required: false,
  presentable: false,
  unique: false,
  options: {},
});

const date = (id, name) => ({
  system: false,
  id,
  name,
  type: "date",
  required: false,
  presentable: false,
  unique: false,
  options: { min: "", max: "" },
});

const select = (id, name, values, { required = false } = {}) => ({
  system: false,
  id,
  name,
  type: "select",
  required,
  presentable: false,
  unique: false,
  options: { maxSelect: 1, values },
});

const relation = (
  id,
  name,
  collectionId,
  { required = false, cascadeDelete = false } = {},
) => ({
  system: false,
  id,
  name,
  type: "relation",
  required,
  presentable: false,
  unique: false,
  options: {
    collectionId,
    cascadeDelete,
    minSelect: null,
    maxSelect: 1,
    displayFields: null,
  },
});

export function checklistAssignmentFields() {
  return [bool("ciactive", "active")];
}

export function checklistAssignmentCollections() {
  return [
    {
      id: collectionIds.assignments,
      name: "checklist_assignments",
      type: "base",
      system: false,
      schema: [
        relation("caitem01", "item", CHECKLIST_ITEMS, { required: true }),
        text("cabizday", "business_date", { required: true }),
        relation("caassgn1", "assigned_to", USERS, { required: true }),
        relation("caassignby", "assigned_by", USERS, { required: true }),
        text("canotes1", "notes"),
        number("casort01", "sort_order"),
      ],
      indexes: [
        "CREATE UNIQUE INDEX `idx_checklist_assignment_day_item` ON `checklist_assignments` (`business_date`, `item`)",
        "CREATE INDEX `idx_checklist_assignment_user_day` ON `checklist_assignments` (`assigned_to`, `business_date`)",
      ],
      listRule: ASSIGNEE_READ,
      viewRule: ASSIGNEE_READ,
      createRule: MANAGER,
      updateRule: MANAGER,
      deleteRule: MANAGER,
      options: {},
    },
    {
      id: collectionIds.results,
      name: "checklist_assignment_results",
      type: "base",
      system: false,
      schema: [
        relation("carassign", "assignment", collectionIds.assignments, {
          required: true,
          cascadeDelete: true,
        }),
        bool("cardone1", "done"),
        number("carnumber", "number_value"),
        text("cartext1", "text_value"),
        date("carcheck", "checked_at"),
        relation("caruser1", "completed_by", USERS, { required: true }),
        text("carname1", "completed_by_name"),
      ],
      indexes: [
        "CREATE INDEX `idx_checklist_assignment_result_time` ON `checklist_assignment_results` (`assignment`, `checked_at`)",
      ],
      listRule: RESULT_READ,
      viewRule: RESULT_READ,
      createRule: RESULT_CREATE,
      updateRule: MANAGER,
      deleteRule: MANAGER,
      options: {},
    },
  ];
}

export function addChecklistAssignmentSchema(schema) {
  if (!Array.isArray(schema)) {
    throw new TypeError("PocketBase schema must be an array of collections.");
  }

  const items = schema.find(
    (collection) =>
      collection?.id === CHECKLIST_ITEMS ||
      collection?.name === "checklist_items",
  );
  if (!items) throw new Error("Required collection not found: checklist_items");

  const additions = checklistAssignmentCollections();
  const existingNames = new Set(schema.map((collection) => collection?.name));
  const collectionConflicts = additions
    .map((collection) => collection.name)
    .filter((name) => existingNames.has(name));
  if (collectionConflicts.length) {
    throw new Error(
      `Target collections already exist: ${collectionConflicts.join(", ")}`,
    );
  }

  const fields = checklistAssignmentFields();
  const existingFields = new Set(items.schema?.map((field) => field.name));
  const fieldConflicts = fields
    .map((field) => field.name)
    .filter((name) => existingFields.has(name));
  if (fieldConflicts.length) {
    throw new Error(
      `Target checklist item fields already exist: ${fieldConflicts.join(", ")}`,
    );
  }

  const output = schema.map((collection) =>
    collection === items
      ? {
          ...collection,
          schema: [...(collection.schema ?? []), ...fields],
          createRule: MANAGER,
          updateRule: MANAGER,
          deleteRule: MANAGER,
        }
      : collection,
  );
  return [...output, ...additions];
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    throw new Error(
      "Usage: node scripts/add-checklist-assignment-schema.js <input.json> <output.json>",
    );
  }

  const source = JSON.parse(await readFile(inputPath, "utf8"));
  const output = addChecklistAssignmentSchema(source);
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(
    `Preserved ${source.length} collections, added ${checklistAssignmentCollections().length} collections, and appended ${checklistAssignmentFields().length} checklist item field.`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
