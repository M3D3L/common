import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const USERS = "_pb_users_auth_";
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

const number = (id, name, { required = false } = {}) => ({
  system: false,
  id,
  name,
  type: "number",
  required,
  presentable: false,
  unique: false,
  options: { min: 0, max: null, noDecimal: false },
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

const signature = (id, name) => ({
  system: false,
  id,
  name,
  type: "file",
  required: true,
  presentable: false,
  unique: false,
  options: {
    mimeTypes: ["image/png"],
    thumbs: ["600x200"],
    maxSelect: 1,
    maxSize: 2 * 1024 * 1024,
    protected: true,
  },
});

export function payrollCollection() {
  return {
    id: "brzpayrollentry",
    name: "payroll_entries",
    type: "base",
    system: false,
    schema: [
      relation("premployee", "employee", USERS, { required: true }),
      text("prperiodstart", "period_start", { required: true }),
      text("prperiodend", "period_end", { required: true }),
      text("prpaydate", "pay_date", { required: true }),
      number("prregularhrs", "regular_hours", { required: true }),
      number("provertimehrs", "overtime_hours"),
      number("prhourlyrate", "hourly_rate", { required: true }),
      number("prgrosspay", "gross_pay", { required: true }),
      number("prdeductions", "deductions"),
      number("prnetpay", "net_pay", { required: true }),
      select(
        "prpaymethod",
        "payment_method",
        ["cash", "transfer", "check", "other"],
        { required: true },
      ),
      select("prstatus", "status", ["signed", "paid"], { required: true }),
      text("prnotes", "notes"),
      text("pracknowledge", "acknowledgement", { required: true }),
      signature("prsignature", "employee_signature"),
      relation("prcreatedby", "created_by", USERS, { required: true }),
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_payroll_employee_period` ON `payroll_entries` (`employee`, `period_start`, `period_end`)",
      "CREATE INDEX `idx_payroll_pay_date` ON `payroll_entries` (`pay_date`)",
    ],
    listRule: VERIFIED,
    viewRule: VERIFIED,
    createRule: VERIFIED,
    updateRule: VERIFIED,
    deleteRule: VERIFIED,
    options: {},
  };
}

export function addPayrollSchema(schema) {
  if (!Array.isArray(schema)) {
    throw new TypeError("PocketBase schema must be an array of collections.");
  }
  if (!schema.some((collection) => collection?.id === USERS)) {
    throw new Error("Required collection not found: users");
  }
  if (schema.some((collection) => collection?.name === "payroll_entries")) {
    throw new Error("Target collection already exists: payroll_entries");
  }
  return [...schema, payrollCollection()];
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    throw new Error(
      "Usage: node scripts/add-payroll-schema.js <input.json> <output.json>",
    );
  }

  let source;
  try {
    source = JSON.parse(await readFile(inputPath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(
        `Schema input not found: ${inputPath}. Export the current PocketBase schema or use pb_schema.staff-schedule.json.`,
      );
    }
    throw error;
  }
  const output = addPayrollSchema(source);
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(
    `Preserved ${source.length} collections and added payroll_entries.`,
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
