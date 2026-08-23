import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PocketBase from "pocketbase";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const PB_URL = "https://api.sancarlosinsider.com/";
const COLLECTION = "relocateBlog";
const OUTPUT_FILE = path.resolve(__dirname, "../routes/blogRoutes.js");

async function generateRoutes() {
  const pb = new PocketBase(PB_URL);

  try {
    console.log(`🚀 Fetching slugs from ${COLLECTION}...`);

    // getFullList bypasses pagination to ensure we get EVERY post
    const records = await pb.collection(COLLECTION).getFullList({
      fields: "slug",
      sort: "-created",
    });

    // Transform to: /blog/your-slug
    const routes = records.map((record) => `/blog${record.slug}`);

    // Create the file content
    const fileContent = `// Auto-generated at build time\nexport const blogRoutes = ${JSON.stringify(
      routes,
      null,
      2
    )};\n`;

    // Ensure directory exists and write file
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, fileContent, "utf-8");

    console.log(`✅ Success! Saved ${routes.length} routes to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Error generating routes:", error.message);
    process.exit(1);
  }
}

generateRoutes();
