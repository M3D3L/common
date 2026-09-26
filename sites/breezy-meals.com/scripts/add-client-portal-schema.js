import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const MEMBERS_COLLECTION = "5r730r7vsiilgv0";
const COMANDAS_COLLECTION = "7pnmvktzc496xgu";

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

const additions = {
  comandas: {
    fields: [
      date("cocompleteat1", "completed_at"),
      relation("comemberrel", "member", MEMBERS_COLLECTION),
    ],
    indexes: [
      "CREATE INDEX `idx_comandas_member_history` ON `comandas` (`member`, `status`, `placed_at`)",
    ],
  },
  redemptions: {
    fields: [relation("rdcomanda01", "comanda", COMANDAS_COLLECTION)],
    indexes: [
      "CREATE INDEX `idx_redemptions_comanda` ON `redemptions` (`comanda`)",
    ],
  },
};

export function addClientPortalSchema(schema) {
  if (!Array.isArray(schema)) {
    throw new TypeError("PocketBase schema must be an array of collections.");
  }

  for (const name of ["members", ...Object.keys(additions)]) {
    if (!schema.some((collection) => collection?.name === name)) {
      throw new Error(`Required collection not found: ${name}`);
    }
  }

  return schema.map((collection) => {
    const addition = additions[collection?.name];
    if (!addition) return collection;

    const existingFields = new Set(
      (collection.schema ?? []).map((field) => field.name),
    );
    const existingIndexes = new Set(collection.indexes ?? []);
    return {
      ...collection,
      schema: [
        ...(collection.schema ?? []),
        ...addition.fields.filter((field) => !existingFields.has(field.name)),
      ],
      indexes: [
        ...(collection.indexes ?? []),
        ...addition.indexes.filter((index) => !existingIndexes.has(index)),
      ],
    };
  });
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    throw new Error(
      "Usage: node scripts/add-client-portal-schema.js <input.json> <output.json>",
    );
  }

  const source = JSON.parse(await readFile(inputPath, "utf8"));
  const output = addClientPortalSchema(source);
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log("Added client portal relations and history fields.");
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
