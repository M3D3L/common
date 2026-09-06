import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const USERS = "_pb_users_auth_";
const AUTHENTICATED = '@request.auth.id != ""';
const VERIFIED = "@request.auth.verified = true";

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

const relation = (id, name, collectionId, { required = false } = {}) => ({
  system: false,
  id,
  name,
  type: "relation",
  required,
  presentable: false,
  unique: false,
  options: {
    collectionId,
    cascadeDelete: false,
    minSelect: null,
    maxSelect: 1,
    displayFields: null,
  },
});

export function staffScheduleCollection() {
  return {
    id: "brzstaffshifts01",
    name: "staff_shifts",
    type: "base",
    system: false,
    schema: [
      relation("ssstaff01", "assigned_to", USERS, { required: true }),
      text("ssbizdate", "business_date", { required: true }),
      text("ssstart1", "start_time", { required: true }),
      text("ssend001", "end_time", { required: true }),
      text("sspositn", "position"),
      text("ssnotes01", "notes"),
      relation("ssassign", "assigned_by", USERS, { required: true }),
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_staff_shift_user_day` ON `staff_shifts` (`assigned_to`, `business_date`)",
      "CREATE INDEX `idx_staff_shift_business_date` ON `staff_shifts` (`business_date`)",
    ],
    listRule: AUTHENTICATED,
    viewRule: AUTHENTICATED,
    createRule: VERIFIED,
    updateRule: VERIFIED,
    deleteRule: VERIFIED,
    options: {},
  };
}

export function addStaffScheduleSchema(schema) {
  if (!Array.isArray(schema)) {
    throw new TypeError("PocketBase schema must be an array of collections.");
  }
  if (!schema.some((collection) => collection?.id === USERS)) {
    throw new Error("Required collection not found: users");
  }
  if (schema.some((collection) => collection?.name === "staff_shifts")) {
    throw new Error("Target collection already exists: staff_shifts");
  }
  return [...schema, staffScheduleCollection()];
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    throw new Error(
      "Usage: node scripts/add-staff-schedule-schema.js <input.json> <output.json>",
    );
  }

  const source = JSON.parse(await readFile(inputPath, "utf8"));
  const output = addStaffScheduleSchema(source);
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Preserved ${source.length} collections and added staff_shifts.`);
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
