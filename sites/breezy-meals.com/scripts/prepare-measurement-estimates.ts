import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalIngredientName, ingredientKey } from "../lib/ingredient-identities.ts";
import { parseIngredientLine, type RecipeIngredient } from "../lib/meal-planning.ts";
import { matchRecipeIngredient, resolveRecipeIngredient, type RecipeIngredientCatalogEntry } from "../lib/recipe-ingredients.ts";

interface Recipe {
  id: string; title: string; servings: string; yield_portions: number;
  updated: string; planning_notes?: string; legacy_payload?: unknown;
}
interface Snapshot {
  ingredients: Array<RecipeIngredientCatalogEntry & { updated: string }>;
  recipes: Recipe[];
  recipe_ingredients: Array<RecipeIngredient & { updated: string; parsed_text?: string; sort_order?: number }>;
}
interface Operation {
  collection: "ingredients" | "recipes" | "recipe_ingredients";
  mode: "create" | "update" | "delete";
  id: string; expectedUpdated?: string; data: Record<string, unknown>;
}

// Recipe-sized estimates approved by the user, not measured kitchen quantities.
const replacements: Array<[recipe: string, original: string, replacement: string]> = [
  ["Arroz con leche", "100 - 150 g de azúcar", "150 g de azúcar"],
  ["Bagels", "semillas de sésamo", "30 g de semillas de sésamo"],
  ["Batido delicioso", "fresa", "2 piezas de fresa"],
  ["Bistec de res en salsa de chipotle", "cilantro", "8 g de cilantro"],
  ["Bistec de res en salsa de chipotle", "tortillas de maíz", "12 piezas de tortillas de maíz"],
  ["Bowl de pollo Shawarma", "la ralladura de 1 limón", "5 g de ralladura de limón"],
  ["Bowl de pollo Shawarma", "aceitunas verdes deshuesadas", "60 g de aceitunas verdes deshuesadas"],
  ["Caldo tlalpeño", "sal", "3 g de sal"],
  ["Caldo tlalpeño", "pimienta negra molida", "0.5 g de pimienta negra molida"],
  ["Caldo tlalpeño", "aguacate", "180 g de aguacate"],
  ["Chicharrón en salsa verde", "tortillas de maíz", "12 piezas de tortillas de maíz"],
  ["Chicharrón en salsa verde", "cilantro", "8 g de cilantro"],
  ["Crema de chile poblano", "sal", "2 g de sal"],
  ["Enchiladas poblanas", "8 - 12 tortillas de maíz", "12 piezas de tortillas de maíz"],
  ["Ensalada de pollo", "tostadas de maíz", "12 piezas de tostadas de maíz"],
  ["Espagueti a la boloñesa", "pimienta negra molida", "1 g de pimienta negra molida"],
  ["Espagueti a la boloñesa", "aceite de oliva", "10 ml de aceite de oliva"],
  ["Espagueti a la boloñesa", "queso parmesano, rallado", "40 g de queso parmesano rallado"],
  ["Galletas glaseadas", "jugo de limón", "10 ml de jugo de limón"],
  ["Galletas glaseadas", "colorantes", "1 ml de colorante alimentario"],
  ["Gazpacho de pimientos", "300 - 400 g de cubitos de hielo", "400 g de hielo"],
  ["Gazpacho de pimientos", "8 - 10 hojas de albahaca fresca", "10 hojas de albahaca fresca"],
  ["Jugo para fortalecer tus defensas (Postparto)", "2 - 3 centimetro de jengibre", "10 g de jengibre"],
  ["Jugo para fortalecer tus defensas (Postparto)", "1 - 2 cdita de cúrcuma en polvo", "2 cucharaditas de cúrcuma en polvo"],
  ["Pan de plátano", "40 - 50 g de nueces peladas", "50 g de nueces peladas"],
  ["Pasta al poblano", "queso parmesano, rallado", "40 g de queso parmesano rallado"],
  ["Pechugas rellenas de espinaca en salsa de poblano", "¼ de pimienta negra molida", "0.25 cucharadita de pimienta negra molida"],
  ["Pechugas gratinadas de pollo en salsa de chipotle", "5 - 6 pechugas de pollo, deshuesadas y sin piel", "6 pechugas de pollo, deshuesadas y sin piel"],
  ["Pizza", "hojas de albahaca frescas", "12 hojas de albahaca fresca"],
  ["Ratatouille - Francia", "4 - 5 ramitas de perejil fresco", "5 ramas de perejil fresco"],
  ["Ratatouille - Francia", "1 - 2 pellizcos de sal", "2 pizcas de sal"],
  ["Ratatouille - Francia", "2 - 3 ramitas de tomillo fresco", "3 ramas de tomillo fresco"],
  ["Salpicón de res", "de aguacate", "180 g de aguacate"],
  ["Salpicón de res", "tostadas", "18 piezas de tostadas de maíz"],
  ["Sopa de verduras", "especias variadas", "2 g de especias variadas"],
  ["Tacos de pollo", "crema ácida", "120 g de crema ácida"],
  ["Tepanyaki de pollo y verduras con arroz salvaje", "salsa de soya", "30 ml de salsa de soya"],
  ["Tepanyaki de pollo y verduras con arroz salvaje", "cebolla cambray", "60 g de cebolla cambray"],
  ["Tepanyaki de pollo y verduras con arroz salvaje", "ajonjolí", "10 g de ajonjolí"],
  ["Tortillas de harina caseras", "450 - 480 g de harina de trigo", "480 g de harina de trigo"],
  ["Carne de puerco con chile y nopales", "- Orégano", "4 g de orégano seco"],
  ["Carne de puerco con chile y nopales", "- Sal", "16 g de sal"],
  ["Carne de puerco con chile y nopales", "- Pimienta", "2 g de pimienta negra molida"],
  ["Carne de puerco con chile y nopales", "- Aceite para guisar", "40 ml de aceite vegetal"],
  ["Pastel Sushi", "2 Algo Nori", "2 hojas de alga nori"],
  ["Pastel Sushi", "1 salsa aderezo chipotle mcormick", "1 envase de salsa aderezo chipotle McCormick"],
];
const portionEstimates = [
  { title: "Mayonesa", original: "300 gramos", portions: 20, grams: 15 },
  { title: "Salsa martajada", original: "350 g", portions: 35, grams: 10 },
  { title: "Salsa roja de molcajete", original: "1000 g", portions: 40, grams: 25 },
  { title: "Salsa verde cruda", original: "1000 g", portions: 40, grams: 25 },
];
const object = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export function prepareMeasurementEstimates(source: Snapshot) {
  const catalog = structuredClone(source.ingredients);
  const operations: Operation[] = [];
  const changes = new Map<string, Array<Record<string, unknown>>>();
  const recipeChanges = new Map<string, Record<string, unknown>>();
  const handled = new Set<string>();
  function updateRow(row: Snapshot["recipe_ingredients"][number], text: string, reason: string, ingredientName?: string) {
    const parsed = resolveRecipeIngredient(text, catalog);
    if (parsed.review_required) throw new Error(`La medida estimada no es válida: ${text}`);
    let ingredient = ingredientName ? matchRecipeIngredient(ingredientName, catalog)
      : parsed.ingredient;
    if (!ingredient) {
      const name = canonicalIngredientName(ingredientName ?? parsed.name);
      const canonical_key = ingredientKey(name);
      const id = createHash("sha256").update(`measurement-estimate-v1:${canonical_key}`).digest("hex").slice(0, 15);
      if (catalog.some((entry) => entry.id === id)) throw new Error(`Colisión de ingrediente: ${id}`);
      const data = {
        id, name, canonical_key, aliases: [], base_unit: parsed.base_unit,
        nutrition: null, nutrition_verified: false, nutrition_source: "", grams_per_unit: 0,
      };
      operations.push({ collection: "ingredients", mode: "create", id, data });
      const created = { ...data, updated: "pending-create" };
      catalog.push(created);
      ingredient = created;
    }
    operations.push({
      collection: "recipe_ingredients", mode: "update", id: row.id, expectedUpdated: row.updated,
      data: { text, parsed_text: text, ingredient: ingredient.id, quantity: parsed.quantity, unit: parsed.unit, review_required: false },
    });
    handled.add(row.id);
    changes.set(row.recipe, [...(changes.get(row.recipe) ?? []), {
      rowId: row.id, originalText: row.text, originalIngredient: row.ingredient,
      text, quantity: parsed.quantity, unit: parsed.unit, reason,
    }]);
  }
  function removeNonIngredient(row: Snapshot["recipe_ingredients"][number], reason: string) {
    operations.push({ collection: "recipe_ingredients", mode: "delete", id: row.id, expectedUpdated: row.updated, data: {} });
    handled.add(row.id);
    changes.set(row.recipe, [...(changes.get(row.recipe) ?? []), { originalRow: row, reason }]);
  }
  for (const [title, original, replacement] of replacements) {
    const recipes = source.recipes.filter((recipe) => recipe.title === title
      && source.recipe_ingredients.some((row) => row.recipe === recipe.id && row.text === original && row.review_required));
    if (recipes.length > 1) throw new Error(`Receta duplicada: ${title}`);
    const recipe = recipes[0];
    if (!recipe) continue;
    const rows = source.recipe_ingredients.filter((row) => row.recipe === recipe.id && row.text === original && row.review_required);
    if (rows.length > 1) throw new Error(`Fila duplicada: ${title}: ${original}`);
    if (rows[0]) updateRow(rows[0], replacement,
      "Cantidad estimada según el rendimiento y la preparación; los rangos usan su extremo superior. No verificada en cocina.");
  }
  for (const row of source.recipe_ingredients) {
    const recipe = source.recipes.find((recipe) => recipe.id === row.recipe);
    if (!recipe) throw new Error(`Receta inexistente: ${row.recipe}`);
    if (row.review_required && recipe.title === "Carne de puerco con chile y nopales" && row.text === "Carne y verduras") {
      removeNonIngredient(row, "Encabezado de sección, no ingrediente; se conserva aquí el registro original.");
    } else if (row.review_required && recipe.title === "Pastel Azteca" && row.text === "enlatado, drenado") {
      const preceding = source.recipe_ingredients.filter((candidate) => candidate.recipe === row.recipe)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      const corn = preceding[preceding.indexOf(row) - 1];
      if (!corn || corn.text !== "215 g de elote amarillo") throw new Error("El fragmento no sigue al elote esperado.");
      updateRow(corn, "215 g de granos de elote, enlatados y drenados",
        "La línea siguiente es una descripción del elote, no un ingrediente adicional.", "granos de elote, enlatados");
      removeNonIngredient(row, "Descripción integrada en la fila de elote anterior, sin duplicar su cantidad.");
    } else if (!handled.has(row.id) && !row.review_required && row.unit === "piece"
      && parseIngredientLine(row.text).unit === "pechuga") {
      operations.push({ collection: "recipe_ingredients", mode: "update", id: row.id, expectedUpdated: row.updated,
        data: { unit: "pechuga" } });
      changes.set(row.recipe, [...(changes.get(row.recipe) ?? []), {
        rowId: row.id, originalText: row.text, originalUnit: row.unit, unit: "pechuga",
        reason: "Se conserva pechuga como unidad de conteo, sin cambiar su cantidad ni convertirla a gramos.",
      }]);
    }
  }
  for (const estimate of portionEstimates) {
    const recipe = source.recipes.find((recipe) => recipe.title === estimate.title);
    if (!recipe || recipe.yield_portions > 0) continue;
    if (recipe.servings !== estimate.original) throw new Error(`Rendimiento modificado: ${recipe.title}`);
    const servings = `${estimate.portions} porciones de ${estimate.grams} g (estimadas)`;
    recipeChanges.set(recipe.id, { yield_portions: estimate.portions, yield_verified: false, servings });
    changes.set(recipe.id, [...(changes.get(recipe.id) ?? []), {
      originalServings: recipe.servings, servings,
      reason: "Porción de condimento estimada para planeación; no es una medición de cocina.",
    }]);
  }
  for (const [id, entries] of changes) {
    const recipe = source.recipes.find((recipe) => recipe.id === id)!;
    const legacy = object(recipe.legacy_payload) ? recipe.legacy_payload : {};
    const history = Array.isArray(legacy.measurementEstimates) ? legacy.measurementEstimates : [];
    const note = "Medidas estimadas para planeación; no verificadas en cocina. Se conserva el texto original en el historial de la receta.";
    const notes = recipe.planning_notes?.includes(note) ? recipe.planning_notes
      : [recipe.planning_notes, note].filter(Boolean).join("\n");
    operations.push({ collection: "recipes", mode: "update", id, expectedUpdated: recipe.updated,
      data: { ...recipeChanges.get(id), planning_notes: notes,
        legacy_payload: { ...legacy, measurementEstimates: [...history, { changes: entries }] } } });
  }
  const uncovered = source.recipe_ingredients.filter((row) => row.review_required && !handled.has(row.id));
  if (uncovered.length) throw new Error(`Faltan estimaciones explícitas para: ${uncovered.map((row) => row.id).join(", ")}`);
  for (const operation of operations) {
    if (operation.mode !== "create" && !operation.expectedUpdated) throw new Error(`Falta fecha de concurrencia: ${operation.id}`);
  }
  return { operations, summary: {
    repairedSourceRows: source.recipe_ingredients.filter((row) => row.review_required && handled.has(row.id)).length,
    countUnits: operations.filter((operation) => operation.data.unit === "pechuga").length,
    removedNonIngredients: operations.filter((operation) => operation.mode === "delete").length,
    recipes: changes.size, newIngredients: operations.filter((operation) => operation.mode === "create").length,
    estimatedYields: recipeChanges.size,
  } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , input, output] = process.argv;
  if (!input || !output) throw new Error("Usage: node scripts/prepare-measurement-estimates.ts snapshot.json operations.json");
  const result = prepareMeasurementEstimates(JSON.parse(await readFile(input, "utf8")));
  await writeFile(output, JSON.stringify(result, null, 2), { mode: 0o600 });
  console.log(JSON.stringify(result.summary));
}
