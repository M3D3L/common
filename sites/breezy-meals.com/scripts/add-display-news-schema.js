import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export function displayNewsField() {
  return {
    system: false,
    id: "menunews1",
    name: "news",
    type: "text",
    required: false,
    presentable: false,
    unique: false,
    options: { min: null, max: 5000, pattern: "" },
  };
}

export function addDisplayNewsSchema(schema) {
  if (!Array.isArray(schema)) {
    throw new TypeError("PocketBase schema must be an array of collections.");
  }

  const menu = schema.find((collection) => collection?.name === "menu");
  if (!menu) throw new Error("Required collection not found: menu");

  if (menu.schema?.some((field) => field.name === "news")) return schema;

  return schema.map((collection) =>
    collection === menu
      ? {
          ...collection,
          schema: [...(collection.schema ?? []), displayNewsField()],
        }
      : collection,
  );
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    throw new Error(
      "Usage: node scripts/add-display-news-schema.js <input.json> <output.json>",
    );
  }

  const source = JSON.parse(await readFile(inputPath, "utf8"));
  const output = addDisplayNewsSchema(source);
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(
    "Added optional menu.news text field for pantalla announcements.",
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
