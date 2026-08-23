/**
 * Shared parsing/output helpers for Cookidoo recipe scraping.
 * Used by both extract-recipes.mjs (local saved HTML files) and
 * scrape-cookidoo.mjs (live browser automation via Puppeteer).
 */
import fs from "node:fs";
import path from "node:path";

// Named entities Cookidoo uses beyond the basic set (fractions, degree sign, accents).
const NAMED_ENTITIES = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  frac14: "\u00bc",
  frac12: "\u00bd",
  frac34: "\u00be",
  frac13: "\u2153",
  frac23: "\u2154",
  deg: "\u00b0",
  eacute: "\u00e9",
  aacute: "\u00e1",
  iacute: "\u00ed",
  oacute: "\u00f3",
  uacute: "\u00fa",
  ntilde: "\u00f1",
  Ntilde: "\u00d1",
  uuml: "\u00fc",
};

function decodeEntities(str) {
  return String(str)
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(
      /&(nbsp|amp|lt|gt|quot|apos|frac14|frac12|frac34|frac13|frac23|deg|eacute|aacute|iacute|oacute|uacute|ntilde|Ntilde|uuml);/g,
      (_, name) => NAMED_ENTITIES[name],
    );
}

export function stripHtml(str) {
  return decodeEntities(String(str).replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

/** Flattens recipeInstructions, which may be flat HowToSteps or nested HowToSections. */
function flattenInstructions(list) {
  if (!list) return [];
  if (typeof list === "string") return [list];
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const item of list) {
    if (typeof item === "string") {
      out.push(item);
    } else if (item && Array.isArray(item.itemListElement)) {
      out.push(...flattenInstructions(item.itemListElement));
    } else if (item && item.text) {
      out.push(item.text);
    } else if (item && item.name) {
      out.push(item.name);
    }
  }
  return out;
}

export function parseIsoDuration(iso) {
  if (!iso) return null;
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?$/.exec(iso);
  if (!m) return iso;
  const hours = Number(m[1] || 0);
  const minutes = Number(m[2] || 0);
  const parts = [];
  if (hours) parts.push(`${hours} h`);
  if (minutes) parts.push(`${minutes} min`);
  return parts.join(" ") || null;
}

export function extractRecipeId(html) {
  const og = /property="og:url"\s+content="[^"]*\/recipe\/[^/"]+\/(r\d+)"/.exec(
    html,
  );
  if (og) return og[1];
  const canonical =
    /rel="canonical"\s+href="[^"]*\/recipe\/[^/"]+\/(r\d+)"/.exec(html);
  if (canonical) return canonical[1];
  return null;
}

/**
 * Parses schema.org Recipe JSON-LD blocks into a full detail record.
 * Some Cookidoo templates (composite dishes with a sauce/base + assembly)
 * emit multiple <script type="application/ld+json"> Recipe blocks on the
 * same page, or nest steps under HowToSection.itemListElement instead of a
 * flat list — these are all merged into one record per recipe id.
 */
export function extractDetailRecipes(html, sourceFile) {
  const id = extractRecipeId(html);
  if (!id) return [];

  const scriptRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  const blocks = [];
  let m;
  while ((m = scriptRe.exec(html))) {
    let data;
    try {
      data = JSON.parse(m[1].trim());
    } catch {
      continue;
    }
    const candidates = Array.isArray(data?.["@graph"])
      ? data["@graph"]
      : [data];
    for (const c of candidates) {
      if (c && c["@type"] === "Recipe") blocks.push(c);
    }
  }
  if (blocks.length === 0) return [];

  const record = {
    id,
    title: "",
    url: `https://cookidoo.mx/recipes/recipe/es-MX/${id}`,
    image: null,
    servings: null,
    prepTime: null,
    cookTime: null,
    totalTime: null,
    category: null,
    ingredients: [],
    steps: [],
    nutrition: null,
    hasDetail: true,
    sourceFile,
  };

  for (const data of blocks) {
    if (!record.title) record.title = stripHtml(data.name || "");
    if (!record.image) record.image = data.image || null;
    if (!record.servings) record.servings = data.recipeYield || null;
    if (!record.prepTime) record.prepTime = parseIsoDuration(data.prepTime);
    if (!record.cookTime) record.cookTime = parseIsoDuration(data.cookTime);
    if (!record.totalTime) record.totalTime = parseIsoDuration(data.totalTime);
    if (!record.category) {
      record.category = Array.isArray(data.recipeCategory)
        ? data.recipeCategory.join(", ")
        : data.recipeCategory || null;
    }
    if (!record.nutrition && data.nutrition) {
      record.nutrition = {
        calories: data.nutrition.calories || null,
        carbs: data.nutrition.carbohydrateContent || null,
        fat: data.nutrition.fatContent || null,
        protein: data.nutrition.proteinContent || null,
      };
    }
    for (const ing of Array.isArray(data.recipeIngredient)
      ? data.recipeIngredient
      : []) {
      const clean = stripHtml(ing);
      if (!record.ingredients.includes(clean)) record.ingredients.push(clean);
    }
    for (const step of flattenInstructions(data.recipeInstructions)) {
      record.steps.push(stripHtml(step));
    }
  }

  return [record];
}

/** Scans listing/feed pages for recipe card links (title + image, no ingredients). */
export function extractIndexRecipes(html, sourceFile) {
  const records = [];
  const linkRe = /href="\/recipes\/recipe\/[^"]+\/(r\d+)"/g;
  const positions = [];
  let m;
  while ((m = linkRe.exec(html))) {
    positions.push({ id: m[1], index: m.index });
  }

  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].index;
    const end = positions[i + 1] ? positions[i + 1].index : start + 3000;
    const block = html.slice(start, Math.min(end, html.length));

    const altMatch = /alt="([^"]+)"/.exec(block);
    if (!altMatch) continue; // not a card link (e.g. "Ver" button, context menu)
    const srcMatch = /src="(https:\/\/[^"]+)"/.exec(block);

    records.push({
      id: positions[i].id,
      title: stripHtml(altMatch[1]),
      url: `https://cookidoo.mx/recipes/recipe/es-MX/${positions[i].id}`,
      image: srcMatch ? srcMatch[1] : null,
      hasDetail: false,
      sourceFile,
    });
  }
  return records;
}

/** Merges detail + index records into a deduped, sorted array (detail always wins). */
export function mergeRecipes(byId, detailRecords, indexRecords) {
  for (const rec of detailRecords) {
    byId.set(rec.id, mergeRecipeRecords(byId.get(rec.id), rec));
  }
  for (const rec of indexRecords) {
    byId.set(rec.id, mergeRecipeRecords(byId.get(rec.id), rec));
  }
  return [...byId.values()].sort((a, b) =>
    a.title.localeCompare(b.title, "es"),
  );
}

function mergeRecipeRecords(existing, incoming) {
  if (!existing) return incoming;
  if (!incoming) return existing;

  const richer = incoming.hasDetail ? incoming : existing;
  const fallback = richer === incoming ? existing : incoming;
  return {
    ...fallback,
    ...richer,
    ingredients: [
      ...new Set([
        ...(existing.ingredients || []),
        ...(incoming.ingredients || []),
      ]),
    ],
    steps: [...new Set([...(existing.steps || []), ...(incoming.steps || [])])],
    hasDetail: Boolean(existing.hasDetail || incoming.hasDetail),
  };
}

export function toMarkdown(recipes) {
  const completeCount = recipes.filter(
    (recipe) => recipe.hasDetail && recipe.steps?.length > 0,
  ).length;
  const incompleteCount = recipes.filter(
    (recipe) => recipe.hasDetail && !recipe.steps?.length,
  ).length;
  const lines = [
    "# Recetas guardadas de Cookidoo",
    "",
    `_Generado: ${new Date().toISOString().slice(0, 10)} — ${recipes.length} recetas únicas` +
      ` (${completeCount} completas, ${incompleteCount} sin preparación, ${
        recipes.filter((r) => !r.hasDetail).length
      } solo índice)_`,
    "",
  ];

  for (const r of recipes) {
    lines.push(`## ${r.title}`);
    if (!r.hasDetail) {
      lines.push(
        "_Solo se encontró en un listado; abre la receta y guarda el HTML para extraer ingredientes/pasos._",
      );
      lines.push(`[Ver receta original](${r.url})`, "", "---", "");
      continue;
    }
    if (!r.steps?.length) {
      lines.push(
        "_Datos incompletos: se encontraron ingredientes, pero no los pasos de preparación._",
        "",
      );
    }

    const meta = [
      r.servings && `**Porciones:** ${r.servings}`,
      r.prepTime && `**Prep:** ${r.prepTime}`,
      r.totalTime && `**Total:** ${r.totalTime}`,
      r.category && `**Categoría:** ${r.category}`,
    ].filter(Boolean);
    if (meta.length) lines.push(meta.join(" · "), "");

    if (r.ingredients.length) {
      lines.push("**Ingredientes**");
      for (const ing of r.ingredients) lines.push(`- ${ing}`);
      lines.push("");
    }

    if (r.steps.length) {
      lines.push("**Preparación**");
      r.steps.forEach((step, i) => lines.push(`${i + 1}. ${step}`));
      lines.push("");
    }

    lines.push(`[Ver receta original](${r.url})`, "", "---", "");
  }

  return lines.join("\n");
}

export function writeOutputs(outputDir, recipes) {
  fs.mkdirSync(outputDir, { recursive: true });
  const jsonFile = path.join(outputDir, "recipes.json");
  const markdownFile = path.join(outputDir, "recipes.md");
  const byId = new Map();

  if (fs.existsSync(jsonFile)) {
    try {
      const existing = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
      for (const recipe of existing) byId.set(recipe.id, recipe);
    } catch {
      // A malformed prior output must not block a fresh write.
    }
  }
  for (const recipe of recipes) {
    byId.set(recipe.id, mergeRecipeRecords(byId.get(recipe.id), recipe));
  }

  const uniqueRecipes = [...byId.values()].sort((a, b) =>
    a.title.localeCompare(b.title, "es"),
  );
  const jsonTemp = `${jsonFile}.tmp`;
  const markdownTemp = `${markdownFile}.tmp`;
  if (fs.existsSync(jsonFile)) fs.copyFileSync(jsonFile, `${jsonFile}.bak`);
  fs.writeFileSync(jsonTemp, JSON.stringify(uniqueRecipes, null, 2));
  fs.writeFileSync(markdownTemp, toMarkdown(uniqueRecipes));
  fs.renameSync(jsonTemp, jsonFile);
  fs.renameSync(markdownTemp, markdownFile);

  return uniqueRecipes;
}
