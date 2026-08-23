#!/usr/bin/env node
/**
 * Extracts recipe data from locally-saved Cookidoo HTML pages (View Source / Save Page As).
 * Zero dependencies — pure Node.js, no npm install required.
 *
 * Usage:
 *   node tools/recipe-scraper/extract-recipes.mjs
 *     -> scans sites/breezy-meals.com/assets/*.html
 *
 *   node tools/recipe-scraper/extract-recipes.mjs path/to/one.html path/to/two.html
 *     -> scans only the given files
 *
 * Output (written to tools/recipe-scraper/output/):
 *   recipes.json  -> deduped structured data (by recipe id)
 *   recipes.md    -> printable Markdown, one section per recipe
 *
 * How it works:
 *   - "Detail" pages (a single opened recipe) embed a schema.org Recipe
 *     <script type="application/ld+json"> block with full ingredients/steps.
 *     These are parsed directly for the richest data.
 *   - "Listing" pages (for-you feed, search results, etc.) only have card
 *     markup (title + link + image, no ingredients). These are scanned with
 *     regex to build an index entry when no detail page is available.
 *   - Everything is merged into one map keyed by recipe id (e.g. "r57085"),
 *     so re-running against more saved pages only adds/enriches recipes.
 *
 * For live scraping (login + auto-collect all links), see scrape-cookidoo.mjs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractDetailRecipes,
  extractIndexRecipes,
  mergeRecipes,
  writeOutputs,
} from "./lib/recipe-parser.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_INPUT_DIR = path.join(
  __dirname,
  "../../sites/breezy-meals.com/assets",
);
const OUTPUT_DIR = path.join(__dirname, "output");

function findInputFiles() {
  const args = process.argv.slice(2);
  if (args.length > 0) return args.map((f) => path.resolve(f));
  return fs
    .readdirSync(DEFAULT_INPUT_DIR)
    .filter((f) => f.toLowerCase().endsWith(".html"))
    .map((f) => path.join(DEFAULT_INPUT_DIR, f));
}

function main() {
  const files = findInputFiles();
  if (files.length === 0) {
    console.error("No input HTML files found.");
    process.exit(1);
  }

  const byId = new Map();
  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const relSource = path.relative(process.cwd(), file);
    mergeRecipes(
      byId,
      extractDetailRecipes(html, relSource),
      extractIndexRecipes(html, relSource),
    );
  }

  const recipes = [...byId.values()].sort((a, b) =>
    a.title.localeCompare(b.title, "es"),
  );
  const writtenRecipes = writeOutputs(OUTPUT_DIR, recipes);
  const completeCount = writtenRecipes.filter(
    (recipe) => recipe.hasDetail && recipe.steps?.length > 0,
  ).length;
  const incompleteCount = writtenRecipes.filter(
    (recipe) => recipe.hasDetail && !recipe.steps?.length,
  ).length;

  console.log(`Scanned ${files.length} file(s).`);
  console.log(
    `Stored ${writtenRecipes.length} unique recipe(s): ${completeCount} complete, ` +
      `${incompleteCount} missing preparation steps, ` +
      `${writtenRecipes.filter((r) => !r.hasDetail).length} index-only.`,
  );
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_DIR)}/recipes.json`);
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_DIR)}/recipes.md`);
}

main();
