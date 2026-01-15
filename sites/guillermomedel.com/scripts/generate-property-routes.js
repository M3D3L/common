import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PocketBase from "pocketbase";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const PB_URL = "https://api.sancarlosinsider.com/";
const COLLECTION = "properties";
const OUTPUT_FILE = path.resolve(__dirname, "../routes/propertyRoutes.js");

// Map your database 'type' to the desired URL prefix
const TYPE_PREFIXES = {
  property: "properties",
  rental: "rentals",
  lot: "lots",
};

async function generatePropertyRoutes() {
  const pb = new PocketBase(PB_URL);

  try {
    console.log(`🏠 Fetching slugs and types from ${COLLECTION}...`);

    // We now fetch BOTH 'slug' and 'type'
    const records = await pb.collection(COLLECTION).getFullList({
      fields: "slug,type",
      sort: "-created",
    });

    const routes = records.map((record) => {
      // Fallback to 'properties' if type is missing or doesn't match
      const prefix = TYPE_PREFIXES[record.type] || "properties";

      // Ensures the path looks like: /rentals/my-cool-apartment
      return `/${prefix}/${record.slug}`;
    });

    const fileContent = `// Auto-generated at build time\nexport const propertyRoutes = ${JSON.stringify(
      routes,
      null,
      2
    )};\n`;

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, fileContent, "utf-8");

    console.log(
      `✅ Success! Saved ${routes.length} dynamic routes to ${OUTPUT_FILE}`
    );
  } catch (error) {
    console.error("❌ Error generating routes:", error.message);
    process.exit(1);
  }
}

generatePropertyRoutes();
