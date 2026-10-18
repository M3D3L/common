/** Nutrients per 100 grams: kcal, grams of macronutrients/fiber, milligrams sodium. */
export interface NutritionProfile {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sodium: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category?: string;
  base_unit: "g" | "ml" | "piece";
  /** Grams per ml or per piece; never inferred from an ingredient name. */
  grams_per_unit?: number;
  nutrition?: NutritionProfile | null;
  /** A nonblank source and explicit verification are both required for complete nutrition. */
  nutrition_source?: string;
  nutrition_verified?: boolean;
}

export interface RecipeIngredient {
  id: string;
  recipe: string;
  ingredient: string;
  quantity: number;
  unit: string;
  text: string;
  review_required?: boolean;
}

export interface PlanningRecipe {
  id: string;
  title: string;
  yield_portions: number;
  /** Measured grams of finished meat/protein alone per batch, excluding sauce and sides. */
  protein_yield_g?: number;
  protein_yield_verified?: boolean;
}

export interface MenuComponent {
  id?: string;
  menu_item: string;
  recipe: string;
  /** Recipe portions required for one plate of this menu item. */
  portions: number;
  /** Finished meat/protein grams per plate; zero or omitted retains portion-based scaling. */
  protein_target_g?: number;
}

export interface ProductionLine {
  date: string;
  menu_item: string;
  quantity: number;
}

export interface Requirement {
  ingredient: string;
  name: string;
  unit: string;
  quantity: number;
}

export interface RecipePortions {
  date: string;
  recipe: string;
  portions: number;
}

export interface RequirementsResult {
  /** Known quantities only. Warnings must be shown alongside these partial totals. */
  requirements: Requirement[];
  warnings: string[];
  recipePortions: RecipePortions[];
}

export interface RecipeNutritionResult {
  /** Known nutrition only; unknown ingredients are not verified zeroes. */
  total: NutritionProfile;
  perPortion: NutritionProfile | null;
  complete: boolean;
  warnings: string[];
}

export interface ParsedIngredientLine {
  name: string;
  quantity: number | null;
  unit: string | null;
  review_required: boolean;
}

const nutrientKeys = ["kcal", "protein", "fat", "carbs", "fiber", "sodium"] as const;
const positive = (n: number): boolean => Number.isFinite(n) && n > 0;
const nonnegative = (n: number): boolean => Number.isFinite(n) && n >= 0;
const normalize = (s: string): string =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

interface Unit {
  base: Ingredient["base_unit"];
  factor: number;
  name: string;
}

function resolveUnit(raw: string): Unit | null {
  const unit = normalize(raw).replace(/\.$/, "");
  if (["g", "gr", "grs", "gramo", "gramos"].includes(unit))
    return { base: "g", factor: 1, name: "g" };
  if (["kg", "kgs", "kilo", "kilos", "kilogramo", "kilogramos"].includes(unit))
    return { base: "g", factor: 1000, name: "kg" };
  if (["ml", "mililitro", "mililitros"].includes(unit))
    return { base: "ml", factor: 1, name: "ml" };
  if (["l", "lt", "lts", "litro", "litros"].includes(unit))
    return { base: "ml", factor: 1000, name: "l" };
  if (["piece", "pieces", "pieza", "piezas", "pza", "pzas", "unidad", "unidades"].includes(unit))
    return { base: "piece", factor: 1, name: "piece" };
  return null;
}

function canonicalQuantity(row: RecipeIngredient, ingredient: Ingredient): number | null {
  const unit = resolveUnit(row.unit);
  if (!positive(row.quantity) || !unit || unit.base !== ingredient.base_unit) return null;
  const quantity = row.quantity * unit.factor;
  return nonnegative(quantity) ? quantity : null;
}

function uniqueIndex<T extends { id: string }>(items: T[], kind: string, warnings: string[]): Map<string, T> {
  const result = new Map<string, T>();
  const duplicates = new Set<string>();
  for (const item of items) {
    if (!item.id || result.has(item.id) || duplicates.has(item.id)) {
      warnings.push(`ID de ${kind} inválido o duplicado: "${item.id}".`);
      result.delete(item.id);
      duplicates.add(item.id);
    } else {
      result.set(item.id, item);
    }
  }
  return result;
}

/**
 * Only explicit, same-dimension unit conversions are allowed for purchasing.
 * Meat/protein targets use measured finished batch yields, never inferred raw-to-cooked ratios.
 */
export function aggregateRequirements(
  lines: ProductionLine[],
  components: MenuComponent[],
  recipes: PlanningRecipe[],
  recipeIngredients: RecipeIngredient[],
  ingredients: Ingredient[],
): RequirementsResult {
  const warnings: string[] = [];
  const recipeIndex = uniqueIndex(recipes, "receta", warnings);
  const ingredientIndex = uniqueIndex(ingredients, "ingrediente", warnings);
  const requirements = new Map<string, Requirement>();
  const recipePortions = new Map<string, RecipePortions>();

  for (const line of lines) {
    if (!line.date.trim() || !line.menu_item || !nonnegative(line.quantity)) {
      warnings.push(`Línea de producción inválida para "${line.menu_item}" en la fecha "${line.date}".`);
      continue;
    }
    if (line.quantity === 0) continue;
    const associated = components.filter((component) => component.menu_item === line.menu_item);
    if (!associated.length) warnings.push(`No hay recetas asociadas al platillo "${line.menu_item}".`);
    for (const component of associated) {
      if (!positive(component.portions)) {
        warnings.push(`Porciones del componente inválidas para "${line.menu_item}" / "${component.recipe}".`);
        continue;
      }
      const recipe = recipeIndex.get(component.recipe);
      if (!recipe) {
        warnings.push(`No se encontró la receta "${component.recipe}" del platillo "${line.menu_item}".`);
        continue;
      }
      const warn = (message: string): void => {
        warnings.push(`Receta "${recipe.title}" (${recipe.id}): ${message}`);
      };
      let portions = line.quantity * component.portions;
      const proteinTarget = component.protein_target_g;
      if (proteinTarget !== undefined && proteinTarget !== 0) {
        if (!positive(proteinTarget)) {
          warn(`Objetivo de carne/proteína terminada inválido para el platillo "${line.menu_item}".`);
          continue;
        }
        if (!positive(recipe.protein_yield_g ?? NaN)) {
          warn(`Falta un rendimiento medido válido de carne/proteína terminada por lote (protein_yield_g) para cubrir ${proteinTarget} g por plato; se omiten las cantidades. No se infiere el peso cocido a partir del peso crudo.`);
          continue;
        }
        if (!positive(recipe.yield_portions)) {
          warn(`Rendimiento inválido para la receta "${recipe.id}".`);
          continue;
        }
        if (recipe.protein_yield_verified !== true)
          warn(`El rendimiento de carne/proteína terminada por lote no está verificado; las cantidades para ${proteinTarget} g por plato son provisionales.`);
        portions = portions * (proteinTarget / recipe.protein_yield_g!) * recipe.yield_portions;
      }
      const key = JSON.stringify([line.date, recipe.id]);
      const previous = recipePortions.get(key)?.portions ?? 0;
      if (!positive(portions) || !nonnegative(previous + portions)) {
        warn(`Las porciones de la receta "${recipe.id}" son inválidas o exceden el límite numérico.`);
        continue;
      }
      recipePortions.set(key, { date: line.date, recipe: recipe.id, portions: previous + portions });
      if (!positive(recipe.yield_portions)) {
        warn(`Rendimiento inválido para la receta "${recipe.id}".`);
        continue;
      }
      const rows = recipeIngredients.filter((row) => row.recipe === recipe.id);
      if (!rows.length) warn(`No hay filas de ingredientes para la receta "${recipe.id}".`);
      for (const row of rows) {
        if (row.review_required) warn(`La fila de ingrediente "${row.id}" requiere revisión.`);
        const ingredient = ingredientIndex.get(row.ingredient);
        if (!ingredient) {
          warn(`No se encontró el ingrediente "${row.ingredient}" de la fila "${row.id}".`);
          continue;
        }
        const quantity = canonicalQuantity(row, ingredient);
        if (quantity === null) {
          warn(`Cantidad o conversión de unidades sin resolver en la fila "${row.id}" (${row.unit} → ${ingredient.base_unit}).`);
          continue;
        }
        const scaled = quantity * (portions / recipe.yield_portions);
        const existing = requirements.get(ingredient.id)?.quantity ?? 0;
        if (!nonnegative(scaled) || !nonnegative(existing + scaled)) {
          warn(`La cantidad requerida en la fila "${row.id}" excede el límite numérico.`);
          continue;
        }
        requirements.set(ingredient.id, {
          ingredient: ingredient.id,
          name: ingredient.name,
          unit: ingredient.base_unit,
          quantity: existing + scaled,
        });
      }
    }
  }
  return {
    requirements: [...requirements.values()],
    warnings: [...new Set(warnings)],
    recipePortions: [...recipePortions.values()],
  };
}

/** Nutrition profiles match exact ingredient IDs, including separately catalogued cooking states. */
export function calculateRecipeNutrition(
  recipe: PlanningRecipe,
  rows: RecipeIngredient[],
  ingredients: Ingredient[],
): RecipeNutritionResult {
  const warnings: string[] = [];
  const warn = (message: string): void => {
    warnings.push(`Receta "${recipe.title}" (${recipe.id}): ${message}`);
  };
  const ingredientIndex = uniqueIndex(ingredients, "ingrediente", warnings);
  const total: NutritionProfile = { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sodium: 0 };
  const matching = rows.filter((row) => row.recipe === recipe.id);
  if (!matching.length) warn(`No hay filas de ingredientes para la receta "${recipe.id}".`);
  if (!positive(recipe.yield_portions)) warn(`Rendimiento inválido para la receta "${recipe.id}".`);
  for (const row of matching) {
    if (row.review_required) warn(`La fila de ingrediente "${row.id}" requiere revisión.`);
    const ingredient = ingredientIndex.get(row.ingredient);
    if (!ingredient) {
      warn(`No se encontró el ingrediente "${row.ingredient}" de la fila "${row.id}".`);
      continue;
    }
    const quantity = canonicalQuantity(row, ingredient);
    if (quantity === null) {
      warn(`Cantidad o conversión de unidades sin resolver en la fila "${row.id}".`);
      continue;
    }
    const grams = ingredient.base_unit === "g"
      ? quantity
      : positive(ingredient.grams_per_unit ?? NaN)
        ? quantity * ingredient.grams_per_unit!
        : null;
    const profile = ingredient.nutrition;
    const validProfile = profile && nutrientKeys.every((key) => nonnegative(profile[key]));
    if (!validProfile)
      warn(`Información nutrimental faltante o inválida para el ingrediente "${ingredient.id}".`);
    if (grams === null || !nonnegative(grams))
      warn(`Gramos por unidad (grams_per_unit) faltantes o inválidos para el ingrediente "${ingredient.id}".`);
    if (!validProfile || !profile || grams === null || !nonnegative(grams)) continue;
    if (ingredient.nutrition_verified !== true)
      warn(`La información nutrimental del ingrediente "${ingredient.id}" no está verificada.`);
    if (!ingredient.nutrition_source?.trim())
      warn(`Falta la fuente de información nutrimental del ingrediente "${ingredient.id}".`);
    const contribution = nutrientKeys.map((key) => profile[key] * (grams / 100));
    if (!contribution.every((value, index) => nonnegative(value) && nonnegative(total[nutrientKeys[index]!] + value))) {
      warn(`Los valores nutrimentales del ingrediente "${ingredient.id}" exceden el límite numérico.`);
      continue;
    }
    nutrientKeys.forEach((key, index) => { total[key] += contribution[index]!; });
  }
  let perPortion: NutritionProfile | null = null;
  if (positive(recipe.yield_portions)) {
    const values = nutrientKeys.map((key) => total[key] / recipe.yield_portions);
    if (values.every(nonnegative)) {
      perPortion = { ...total };
      nutrientKeys.forEach((key, index) => { perPortion![key] = values[index]!; });
    } else {
      warn(`Los valores nutrimentales por porción de la receta "${recipe.id}" exceden el límite numérico.`);
    }
  }
  return { total, perPortion, complete: warnings.length === 0, warnings: [...new Set(warnings)] };
}

export function availableCredits(
  memberships: Array<{ credits_total: number; credits_used: number; status: string }>,
): number {
  let total = 0;
  for (const membership of memberships) {
    if (normalize(membership.status) === "cancelled") continue;
    if (!nonnegative(membership.credits_total) || !nonnegative(membership.credits_used))
      throw new RangeError("Los créditos de la membresía deben ser números finitos mayores o iguales a cero.");
    total += Math.max(0, membership.credits_total - membership.credits_used);
    if (!Number.isFinite(total)) throw new RangeError("Los créditos disponibles exceden el límite numérico.");
  }
  return total;
}

/** Round up once, after applying utilization, extra daily meals, and the buffer. */
export function forecastDaily(
  credits: number,
  serviceDays: number,
  utilizationPercent: number,
  extraDaily: number,
  bufferPercent: number,
): number {
  if (!nonnegative(credits) || !Number.isSafeInteger(serviceDays) || serviceDays <= 0 ||
      !nonnegative(utilizationPercent) || utilizationPercent > 100 ||
      !nonnegative(extraDaily) || !nonnegative(bufferPercent))
    throw new RangeError("Los datos de la estimación diaria son inválidos.");
  const total = Math.ceil(((credits / serviceDays) * (utilizationPercent / 100) + extraDaily) * (1 + bufferPercent / 100));
  if (!Number.isSafeInteger(total)) throw new RangeError("La estimación diaria excede el rango de enteros seguros.");
  return total;
}

/** Largest remainder allocation; equal remainders favor the earlier dish. */
export function allocatePlates(total: number, weights: number[]): number[] {
  if (!Number.isSafeInteger(total) || total < 0 || !weights.every(nonnegative))
    throw new RangeError("El total debe ser un entero seguro mayor o igual a cero; los pesos de distribución deben ser finitos y mayores o iguales a cero.");
  if (!weights.length) {
    if (total === 0) return [];
    throw new RangeError("Un total mayor que cero requiere al menos un platillo.");
  }
  const maximum = weights.reduce((max, weight) => Math.max(max, weight), 0);
  if (maximum === 0) {
    if (total === 0) return weights.map(() => 0);
    throw new RangeError("Un total mayor que cero requiere al menos un peso de distribución mayor que cero.");
  }
  const scaled = weights.map((weight) => weight / maximum);
  const sum = scaled.reduce((value, weight) => value + weight, 0);
  const quotas = scaled.map((weight) => (weight / sum) * total);
  const allocation = quotas.map(Math.floor);
  let remaining = total - allocation.reduce((value, count) => value + count, 0);
  const order = quotas.map((quota, index) => ({ index, remainder: quota - allocation[index]! }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index);
  if (remaining < 0 || remaining > order.length)
    throw new RangeError("La distribución excede la precisión numérica disponible.");
  for (const { index } of order) {
    if (remaining-- <= 0) break;
    allocation[index]!++;
  }
  return allocation;
}

export function parseIngredientLine(text: string): ParsedIngredientLine {
  const original = text.trim().replace(/\s+/g, " ");
  const unresolved = (): ParsedIngredientLine => ({
    name: original, quantity: null, unit: null, review_required: true,
  });
  const expanded = original.replace(/(\d)([½¼¾⅓⅔⅛⅜⅝⅞])/g, "$1 $2")
    .replace(/[½¼¾⅓⅔⅛⅜⅝⅞]/g, (fraction) =>
      ({ "½": "1/2", "¼": "1/4", "¾": "3/4", "⅓": "1/3", "⅔": "2/3", "⅛": "1/8", "⅜": "3/8", "⅝": "5/8", "⅞": "7/8" })[fraction]!);
  const match = expanded.match(/^(\d+\s+\d+\s*\/\s*\d+|\d+\s*\/\s*\d+|\d+(?:[.,]\d+)?)(?:\s*([a-záéíóúüñ]+)\.?)?\s*(.*)$/i);
  if (!match) return unresolved();
  const numeric = match[1]!;
  let quantity: number;
  if (numeric.includes("/")) {
    const parts = numeric.match(/^(?:(\d+)\s+)?(\d+)\s*\/\s*(\d+)$/)!;
    const denominator = Number(parts[3]);
    if (!positive(denominator)) return unresolved();
    quantity = Number(parts[1] ?? 0) + Number(parts[2]) / denominator;
  } else {
    quantity = Number(numeric.replace(",", "."));
  }
  if (!positive(quantity)) return unresolved();
  const rawUnit = match[2] ?? "";
  const known = resolveUnit(rawUnit);
  const ambiguousUnits = ["taza", "tazas", "cucharada", "cucharadas", "cucharadita", "cucharaditas", "cda", "cdas", "cdta", "cdtas", "cdita", "cditas"];
  const ambiguous = ambiguousUnits.includes(normalize(rawUnit));
  const unit = known?.name ?? (ambiguous ? normalize(rawUnit) : null);
  const remainder = (unit ? match[3]! : `${rawUnit} ${match[3]!}`).trim();
  // Ranges and compound quantities must not turn into a plausible single amount.
  if (/^(?:[-–—/+.,]|\d|a\s+\d|y\s+\d)/i.test(remainder)) return unresolved();
  const name = remainder.replace(/^de(?:l)?\s+/i, "").trim();
  return { name, quantity, unit, review_required: !known || !name };
}

/** Accept one explicit portions/persons marker (or a bare positive number), never ranges. */
export function parseYield(text: string): number | null {
  const normalized = normalize(text);
  const match = normalized.match(/^(\d+(?:[.,]\d+)?)$/) ??
    normalized.match(/^(?:(?:rinde|rendimiento)\s*:?\s+)?(\d+(?:[.,]\d+)?)\s+(?:porciones?|personas?|raciones?)$/);
  if (!match) return null;
  const value = Number(match[1]!.replace(",", "."));
  return positive(value) ? value : null;
}
