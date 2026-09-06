import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const USERS = "_pb_users_auth_";
const MEMBERS = "5r730r7vsiilgv0";
const MEMBERSHIPS = "10yv9mmef5frnko";
const REDEMPTIONS = "mdhlk8k1bjda3xg";
const REQUESTS = "brzmemberpay01";

const STAFF = '@request.auth.id != ""';
const MEGA_STAFF = "@request.auth.verified = true";
const PUBLIC_SUBMISSION =
  'offer_code = "meal-pack-5" && status = "submitted" && reviewed_by = "" && reviewed_at = "" && member = "" && membership = "" && approved_amount = 0 && approved_credits = 0 && applied_at = "" && review_note = "" && ((payment_method = "transfer" && payment_proof != "") || payment_method = "in_store")';

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

const number = (id, name, { integer = false } = {}) => ({
  system: false,
  id,
  name,
  type: "number",
  required: false,
  presentable: false,
  unique: false,
  options: { min: null, max: null, noDecimal: integer },
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

const relation = (id, name, collectionId) => ({
  system: false,
  id,
  name,
  type: "relation",
  required: false,
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

const protectedImage = (id, name) => ({
  system: false,
  id,
  name,
  type: "file",
  required: false,
  presentable: false,
  unique: false,
  options: {
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    thumbs: ["320x320"],
    maxSelect: 1,
    maxSize: 5 * 1024 * 1024,
    protected: true,
  },
});

export function membershipPaymentCollection() {
  return {
    id: REQUESTS,
    name: "membership_payment_requests",
    type: "base",
    system: false,
    schema: [
      text("mprname1", "name", { required: true }),
      text("mprphone", "phone", { required: true }),
      text("mpraddr1", "address"),
      text("mprmembercode", "existing_member_code"),
      select("mprmethod", "payment_method", ["transfer", "in_store"], {
        required: true,
      }),
      protectedImage("mprproof", "payment_proof"),
      text("mproffer", "offer_code", { required: true }),
      select(
        "mprstatus",
        "status",
        ["submitted", "approved", "rejected", "cancelled"],
        { required: true },
      ),
      relation("mprmember", "member", MEMBERS),
      relation("mprmembership", "membership", MEMBERSHIPS),
      number("mpramount", "approved_amount"),
      number("mprcredits", "approved_credits", { integer: true }),
      relation("mprreviewer", "reviewed_by", USERS),
      date("mprreviewed", "reviewed_at"),
      text("mprnote1", "review_note"),
      date("mprapplied", "applied_at"),
    ],
    indexes: [
      "CREATE INDEX `idx_membership_payment_status` ON `membership_payment_requests` (`status`, `created`)",
      "CREATE INDEX `idx_membership_payment_phone` ON `membership_payment_requests` (`phone`)",
    ],
    listRule: STAFF,
    viewRule: STAFF,
    createRule: PUBLIC_SUBMISSION,
    updateRule: STAFF,
    deleteRule: MEGA_STAFF,
    options: {},
  };
}

export function membershipPaymentRedemptionField() {
  return relation("rdpayreq1", "payment_request", REQUESTS);
}

export function addMembershipPaymentSchema(schema) {
  if (!Array.isArray(schema)) {
    throw new TypeError("PocketBase schema must be an array of collections.");
  }

  const required = new Map([
    [USERS, "users"],
    [MEMBERS, "members"],
    [MEMBERSHIPS, "memberships"],
    [REDEMPTIONS, "redemptions"],
  ]);
  for (const [id, name] of required) {
    if (!schema.some((collection) => collection?.id === id)) {
      throw new Error(`Required collection not found: ${name}`);
    }
  }
  if (
    schema.some(
      (collection) => collection?.name === "membership_payment_requests",
    )
  ) {
    throw new Error(
      "Target collections already exist: membership_payment_requests",
    );
  }

  const redemption = schema.find(
    (collection) => collection?.id === REDEMPTIONS,
  );
  if (redemption.schema?.some((field) => field.name === "payment_request")) {
    throw new Error("Target redemption fields already exist: payment_request");
  }

  const paymentRequestField = membershipPaymentRedemptionField();
  const paymentRequestIndex =
    "CREATE UNIQUE INDEX `idx_redemption_payment_request` ON `redemptions` (`payment_request`) WHERE `payment_request` != ''";
  const output = schema.map((collection) =>
    collection === redemption
      ? {
          ...collection,
          schema: [...(collection.schema ?? []), paymentRequestField],
          indexes: [...(collection.indexes ?? []), paymentRequestIndex],
        }
      : collection,
  );
  return [...output, membershipPaymentCollection()];
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    throw new Error(
      "Usage: node scripts/add-membership-payment-schema.js <input.json> <output.json>",
    );
  }

  const source = JSON.parse(await readFile(inputPath, "utf8"));
  const output = addMembershipPaymentSchema(source);
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(
    `Preserved ${source.length} collections, added membership_payment_requests, and linked redemptions for idempotent approval.`,
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
