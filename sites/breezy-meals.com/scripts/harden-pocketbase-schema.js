import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const AUTHENTICATED = '@request.auth.id != ""';
const OWN_USER = "id = @request.auth.id";

const publicRead = {
  listRule: "",
  viewRule: "",
  createRule: AUTHENTICATED,
  updateRule: AUTHENTICATED,
  deleteRule: AUTHENTICATED,
};

const staffOnly = {
  listRule: AUTHENTICATED,
  viewRule: AUTHENTICATED,
  createRule: AUTHENTICATED,
  updateRule: AUTHENTICATED,
  deleteRule: AUTHENTICATED,
};

export const ACCESS_RULES = {
  users: {
    listRule: AUTHENTICATED,
    viewRule: AUTHENTICATED,
    createRule: null,
    updateRule: OWN_USER,
    deleteRule: null,
  },
  checklists: staffOnly,
  clockins: staffOnly,
  comandas: {
    listRule: AUTHENTICATED,
    viewRule: AUTHENTICATED,
    createRule: "",
    updateRule: AUTHENTICATED,
    deleteRule: AUTHENTICATED,
  },
  labels: staffOnly,
  members: staffOnly,
  memberships: staffOnly,
  menu: publicRead,
  promos: publicRead,
  recipies: staffOnly,
  redemptions: staffOnly,
  store: publicRead,
};

export function hardenSchema(schema) {
  if (!Array.isArray(schema)) {
    throw new TypeError("PocketBase schema must be an array of collections.");
  }

  const changed = [];
  const unknown = [];
  const collections = schema.map((collection) => {
    const rules = ACCESS_RULES[collection?.name];
    if (!rules) {
      if (!collection?.system) unknown.push(collection?.name || "<unnamed>");
      return collection;
    }

    changed.push(collection.name);
    return { ...collection, ...rules };
  });

  return { schema: collections, changed, unknown };
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    throw new Error(
      "Usage: node scripts/harden-pocketbase-schema.js <input.json> <output.json>",
    );
  }

  const source = JSON.parse(await readFile(inputPath, "utf8"));
  const { schema, changed, unknown } = hardenSchema(source);
  await writeFile(outputPath, `${JSON.stringify(schema, null, 2)}\n`, "utf8");

  console.log(`Hardened ${changed.length} collections: ${changed.join(", ")}`);
  if (unknown.length) {
    console.warn(
      `Rules unchanged for unknown collections: ${unknown.join(", ")}`,
    );
  }
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
