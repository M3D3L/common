import { canonicalIngredientName, ingredientKey } from "./ingredient-identities.ts";
import { normalizeIngredientQuantity, parseIngredientLine, PLANNING_UNITS, type Ingredient } from "./meal-planning.ts";
import type { NormalizedRecord } from "./normalized-domain.ts";

export interface RecipeIngredientCatalogEntry extends Ingredient {
  canonical_key: string;
  aliases?: string[];
}

export interface StructuredRecipeIngredient {
  text: string;
  name: string;
  ingredientId?: string | null;
  quantity: number | null;
  unit: string | null;
  inferred?: boolean;
  reasoning?: string;
}

export interface RecipeAiFields {
  category?: string;
  servings?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  ingredients?: string[];
  steps?: string[];
  calories?: string;
  carbs?: string;
  fat?: string;
  protein?: string;
  structuredIngredients?: StructuredRecipeIngredient[];
}

const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const stringFields = ["category", "servings", "prepTime", "cookTime", "totalTime", "calories", "carbs", "fat", "protein"] as const;

export function parseRecipeAiFields(raw: string): RecipeAiFields {
  const json = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? raw;
  const value: unknown = JSON.parse(json.trim());
  if (!object(value)) throw new Error("La IA no devolvió un objeto de receta válido.");
  const result: RecipeAiFields = {};
  for (const field of stringFields) {
    if (!(field in value)) continue;
    if (typeof value[field] !== "string") throw new Error(`La IA devolvió un valor no válido para ${field}.`);
    result[field] = value[field];
  }
  for (const field of ["ingredients", "steps"] as const) {
    const lines = value[field];
    if (lines === undefined) continue;
    if (!Array.isArray(lines) || !lines.every((line): line is string => typeof line === "string" && !!line.trim())) {
      throw new Error(`La IA devolvió una lista no válida para ${field}.`);
    }
    result[field] = lines.map((line) => line.trim());
  }
  if (value.structuredIngredients !== undefined) {
    if (!Array.isArray(value.structuredIngredients)) throw new Error("La IA no devolvió ingredientes estructurados válidos.");
    result.structuredIngredients = value.structuredIngredients.map((row: unknown) => {
      if (!object(row) || typeof row.text !== "string" || !row.text.trim()
        || typeof row.name !== "string" || !row.name.trim()
        || (row.ingredientId != null && typeof row.ingredientId !== "string")
        || (row.quantity !== null && (typeof row.quantity !== "number" || !Number.isFinite(row.quantity) || row.quantity <= 0))
        || (row.unit !== null && (typeof row.unit !== "string" || !PLANNING_UNITS.includes(row.unit)))
        || ((row.quantity === null) !== (row.unit === null))
        || (row.inferred !== undefined && typeof row.inferred !== "boolean")
        || (row.reasoning !== undefined && typeof row.reasoning !== "string")
        || (row.inferred === true && (typeof row.reasoning !== "string" || !row.reasoning.trim()))) {
        throw new Error("La IA devolvió una cantidad, unidad o ingrediente no válido.");
      }
      return {
        text: row.text.trim(), name: row.name.trim(),
        ingredientId: typeof row.ingredientId === "string" ? row.ingredientId : null,
        quantity: typeof row.quantity === "number" ? row.quantity : null,
        unit: typeof row.unit === "string" ? row.unit : null,
        inferred: row.inferred === true,
        reasoning: typeof row.reasoning === "string" ? row.reasoning.trim() : "",
      };
    });
  }
  return result;
}

function compatibleDeduction(source: string, target: string): boolean {
  const sourceKey = matchingKey(source), targetKey = matchingKey(target);
  const seasonings = /\b(knorr|sazonador|caldo|concentrado|consome|condimento|bouillon)\b/;
  const animals = /\b(pollo|res|cerdo|puerco|atun|marlin|camaron|pescado)\b/;
  if ((seasonings.test(sourceKey) && !seasonings.test(targetKey))
    || (animals.test(sourceKey) && !seasonings.test(sourceKey) && seasonings.test(targetKey))) return false;
  for (const group of [
    ["pollo", "res", "cerdo", "puerco", "atun", "marlin", "camaron", "pescado"],
    ["crudo", "cruda", "cocido", "cocida"], ["descremada", "semidescremada", "entera"],
    ["poblano", "serrano", "guajillo", "pasilla", "ancho", "jalapeno"],
  ]) {
    const original = group.filter((word) => sourceKey.split(" ").includes(word));
    const proposed = group.filter((word) => targetKey.split(" ").includes(word));
    if (original.length && proposed.length && !original.some((word) => proposed.includes(word))) return false;
  }
  for (const word of ["knorr", "molido", "molida", "descremada", "semidescremada", "sin"]) {
    if (sourceKey.split(" ").includes(word) && !targetKey.split(" ").includes(word)) return false;
  }
  return true;
}

function matchingKey(name: string): string {
  return ingredientKey(canonicalIngredientName(name))
    .replace(/\b(?:finamente|picad[oa]s?|rallad[oa]s?|trocead[oa]s?|pelad[oa]s?|limpi[oa]s?|fresc[oa]s?)\b/g, " ")
    .replace(/\bal gusto\b/g, " ")
    .replace(/[,()]/g, " ")
    .replace(/\s+/g, " ").trim()
    .split(" ").map((word) => word.length > 4 ? word.replace(/s$/, "") : word).join(" ");
}

const protectedWords = new Set([
  "res", "cerdo", "puerco", "pollo", "pescado", "atun", "marlin", "camaron",
  "crudo", "cruda", "cocido", "cocida", "seco", "seca", "molido", "molida",
  "entera", "descremada", "semidescremada", "polvo", "caldo", "concentrado",
  "sazonador", "knorr", "sal", "azucar", "sin", "con",
]);

function oneTypo(left: string, right: string): boolean {
  if (left === right) return true;
  if (Math.min(left.length, right.length) < 5 || Math.abs(left.length - right.length) > 1
    || protectedWords.has(left) || protectedWords.has(right)) return false;
  let i = 0, j = 0, differences = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) { i++; j++; continue; }
    if (++differences > 1) return false;
    if (left.length >= right.length) i++;
    if (right.length >= left.length) j++;
  }
  return differences + Number(i < left.length || j < right.length) <= 1;
}

export function matchRecipeIngredient(name: string, catalog: RecipeIngredientCatalogEntry[]): RecipeIngredientCatalogEntry | null {
  const key = matchingKey(name);
  if (!key) return null;
  const names = (ingredient: RecipeIngredientCatalogEntry) =>
    [ingredient.name, ...(ingredient.aliases ?? []), ingredient.canonical_key].map(matchingKey);
  const exact = catalog.filter((ingredient) => names(ingredient).includes(key));
  if (exact.length) return [...exact].sort((a, b) =>
    Number(b.canonical_key === ingredientKey(canonicalIngredientName(name))) - Number(a.canonical_key === ingredientKey(canonicalIngredientName(name)))
    || Number(b.nutrition_verified === true) - Number(a.nutrition_verified === true)
    || a.id.localeCompare(b.id))[0]!;
  const words = key.split(" ");
  const similar = catalog.filter((ingredient) => names(ingredient).some((candidate) => {
    const other = candidate.split(" ");
    return other.length === words.length
      && words.filter((word, index) => word !== other[index]).length === 1
      && words.every((word, index) => oneTypo(word, other[index]!));
  }));
  return similar.length === 1 ? similar[0]! : null;
}

export function resolveRecipeIngredient(
  text: string, catalog: RecipeIngredientCatalogEntry[], hint?: StructuredRecipeIngredient,
) {
  const parsed = parseIngredientLine(text);
  if (hint && hint.text !== text) throw new Error("La interpretación de IA no corresponde al texto del ingrediente.");
  if (hint?.ingredientId && !catalog.some((ingredient) => ingredient.id === hint.ingredientId)) {
    throw new Error(`La IA seleccionó un ingrediente que no existe: ${hint.name}.`);
  }
  if (hint?.quantity != null && hint.unit && parsed.quantity !== null && parsed.unit && !parsed.review_required) {
    const original = normalizeIngredientQuantity({ quantity: parsed.quantity, unit: parsed.unit });
    const proposed = normalizeIngredientQuantity({ quantity: hint.quantity, unit: hint.unit });
    if (!original || !proposed || original.unit !== proposed.unit || Math.abs(original.quantity - proposed.quantity) > Math.max(1, original.quantity) * 1e-9) {
      throw new Error(`La IA cambió la cantidad o unidad original de "${text}".`);
    }
  }
  const name = canonicalIngredientName(parsed.review_required && hint ? hint.name : parsed.name);
  const safeName = name && !/^\d|^[½¼¾⅓⅔⅛⅜⅝⅞]/.test(name) ? name : "";
  if (hint && !compatibleDeduction(parsed.name, safeName)) {
    throw new Error(`La interpretación de IA para "${text}" cambia la identidad del alimento.`);
  }
  let ingredient = safeName ? matchRecipeIngredient(safeName, catalog) : null;
  if (hint?.ingredientId) {
    const suggested = catalog.find((item) => item.id === hint.ingredientId)!;
    if (matchRecipeIngredient(safeName, [suggested]) === null
      && (!hint.inferred || !hint.reasoning?.trim() || !compatibleDeduction(safeName, suggested.name))) {
      throw new Error(`La asociación de IA para "${text}" no corresponde al ingrediente del catálogo.`);
    }
    ingredient = suggested;
  }
  const quantity = !parsed.review_required ? parsed.quantity : hint?.quantity ?? parsed.quantity;
  const unit = !parsed.review_required ? parsed.unit : hint?.unit ?? parsed.unit;
  // An unquantified source stays unquantified; an AI estimate must not become a measured amount.
  const hasSourceAmount = /\d|[½¼¾⅓⅔⅛⅜⅝⅞]/.test(text)
    && !/\d\s*(?:[-–—]|\ba\b)\s*\d/.test(text)
    && (!parsed.unit || PLANNING_UNITS.includes(parsed.unit));
  if (parsed.review_required && parsed.quantity !== null && hint?.quantity != null && hint.quantity !== parsed.quantity) {
    throw new Error(`La IA cambió la cantidad original de "${text}".`);
  }
  const resolved = !!safeName && quantity !== null && quantity > 0 && !!unit
    && PLANNING_UNITS.includes(unit) && (hasSourceAmount || !parsed.review_required);
  const base_unit: Ingredient["base_unit"] = unit === "ml" || unit === "l" || unit === "cucharada" || unit === "cucharadita" ? "ml"
    : unit === "g" || unit === "kg" ? "g" : "piece";
  return {
    name: safeName, ingredient, quantity: resolved ? quantity : 0, unit: resolved ? unit! : "",
    review_required: !resolved, parsed_text: text,
    base_unit,
  };
}

export function validateRecipeAiIngredients(
  texts: string[], hints: StructuredRecipeIngredient[] | undefined, catalog: RecipeIngredientCatalogEntry[],
): StructuredRecipeIngredient[] {
  if (!hints || hints.length !== texts.length || hints.some((hint, index) => hint.text !== texts[index])) {
    throw new Error("La IA debe interpretar cada ingrediente una vez y conservar su texto y orden.");
  }
  hints.forEach((hint) => resolveRecipeIngredient(hint.text, catalog, hint));
  return hints;
}

export function planRecipeIngredientRows(
  previous: NormalizedRecord[], texts: string[], catalog: RecipeIngredientCatalogEntry[],
  hints: StructuredRecipeIngredient[] = [],
) {
  const unused = new Set(previous);
  const rows = texts.map((text, index) => {
    const old = previous.find((row) => unused.has(row) && row.text === text);
    if (old) unused.delete(old);
    const hint = hints[index]?.text === text ? hints[index] : hints.find((row) => row.text === text);
    const parsed = resolveRecipeIngredient(text, catalog, hint);
    const knownIngredient = old && catalog.find((ingredient) => ingredient.id === old.ingredient);
    let interpretation = parsed;
    if (old && old.parsed_text === text && knownIngredient
      && typeof old.quantity === "number" && Number.isFinite(old.quantity) && old.quantity > 0
      && typeof old.unit === "string" && PLANNING_UNITS.includes(old.unit)) {
      interpretation = { ...parsed, ingredient: knownIngredient, quantity: old.quantity, unit: old.unit,
        review_required: old.review_required === true };
    }
    return {
      previous: old, text, sortOrder: index + 1,
      interpretation,
    };
  });
  return { rows, deletes: [...unused].map((row) => row.id) };
}

export function isIngredientKeyConflict(error: unknown): boolean {
  if (!object(error) || error.status !== 400 || !object(error.response) || !object(error.response.data)) return false;
  const field = error.response.data.canonical_key;
  return object(field) && field.code === "validation_not_unique";
}

export const RECIPE_AI_COMMAND = `Completa solo los campos culinarios vacíos de la receta, sin modificar ni contradecir datos existentes. Respeta el rendimiento original; usa 10 porciones únicamente si no hay rendimiento. Devuelve exclusivamente un objeto JSON con las claves de missingFields. ingredients y steps son arrays de strings; los tiempos incluyen unidades y la nutrición es una estimación por porción con unidades, nunca un perfil verificado de ingrediente.
Devuelve siempre structuredIngredients: un objeto por cada línea final de ingredients, en el mismo orden, con {text, name, ingredientId, quantity, unit, inferred, reasoning}. Conserva los nombres de ingredientes en español, también para ingredientes nuevos; no traduzcas el catálogo al inglés. text debe ser exactamente la línea original (o la nueva línea que generaste si ingredients estaba vacío). name es solo el alimento, sin cantidad ni unidad. Usa el contexto de la receta para deducir sinónimos, abreviaturas, nombres regionales, preparaciones y conteos implícitos, no solo coincidencias literales. Busca primero un alimento equivalente en ingredientCatalog y usa su id. Marca inferred=true y explica brevemente reasoning cuando deduzcas una asociación o medida que no es explícita. No confundas cortes, variedades, estados crudo/cocido, marcas, mezclas ni condimentos con carne: Knorr pollo es sazonador, no pollo. Conserva pechuga como unidad de conteo cuando la receta indique pechugas; no inventes su peso. Si no hay equivalente, ingredientId es null y name describe el nuevo alimento.
Usa solo supportedUnits. Conserva cantidades y dimensiones originales: kg/g, l/ml, cucharadas de 15 ml, cucharaditas de 5 ml y conteos sin inventar pesos de piezas o envases. No conviertas volumen a masa sin una conversión explícita. No inventes cantidades para "al gusto", rangos, presentaciones sin tamaño o mezclas sin proporciones: quantity y unit serán null si no se pueden resolver con certeza. No inventes fuentes, URLs ni información verificada.`;
