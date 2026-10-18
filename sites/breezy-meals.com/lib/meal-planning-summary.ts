import { allocatePlates, type ProductionLine, type Requirement } from "./meal-planning.ts";
import { canonicalIngredientName, ingredientKey } from "./ingredient-identities.ts";
import { addDays, mondayOf } from "../utils/rotation.ts";

export function weekInputValue(date: string): string {
  const monday = mondayOf(date);
  const thursday = new Date(`${addDays(monday, 3)}T00:00:00Z`);
  const year = thursday.getUTCFullYear();
  const firstMonday = mondayOf(`${year}-01-04`);
  const week = Math.round((Date.parse(`${monday}T00:00:00Z`) - Date.parse(`${firstMonday}T00:00:00Z`)) / 604800000) + 1;
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function weekStartFromInput(value: string): string {
  const match = /^(\d{4})-W(\d{2})$/.exec(value);
  if (!match || Number(match[1]) < 1000 || Number(match[2]) < 1 || Number(match[2]) > 53) throw new Error("Selecciona una semana válida.");
  const monday = addDays(mondayOf(`${match[1]}-01-04`), (Number(match[2]) - 1) * 7);
  if (weekInputValue(monday) !== value) throw new Error("La semana seleccionada no existe en ese año.");
  return monday;
}

export interface MealShare {
  id: string;
  name: string;
  quantity: number;
  percentage: number;
  color: string;
}

export function summarizeMealShares(
  lines: ProductionLine[],
  menuItems: Array<{ id: string; name: string }>,
): MealShare[] {
  const quantities = new Map<string, number>();
  for (const line of lines) {
    if (!Number.isInteger(line.quantity) || line.quantity < 0) throw new Error("Las cantidades de platos deben ser enteras y no negativas.");
    if (line.menu_item) quantities.set(line.menu_item, (quantities.get(line.menu_item) ?? 0) + line.quantity);
  }
  const total = [...quantities.values()].reduce((sum, value) => sum + value, 0);
  const names = new Map(menuItems.map((item) => [item.id, item.name]));
  const colors = new Map([...quantities.keys()].map((id) => {
    const hue = [...id].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) % 360, 0);
    return [id, `hsl(${hue} 58% 44%)`];
  }));
  return [...quantities].map(([id, quantity]) => ({
    id, quantity, name: names.get(id) ?? "Platillo sin asociación",
    percentage: total ? quantity / total * 100 : 0, color: colors.get(id)!,
  })).sort((left, right) => right.quantity - left.quantity || left.name.localeCompare(right.name, "es"));
}

export function allocateMealShare(items: Array<{ id: string; quantity: number }>, id: string, percentage: number): number[] {
  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) throw new Error("Usa un porcentaje entre 0 y 100.");
  if (!items.some((item) => item.id === id)) throw new Error("El platillo no está en la distribución.");
  if (items.some((item) => !Number.isInteger(item.quantity) || item.quantity < 0)) throw new Error("Corrige las cantidades antes de repartir.");
  if (items.length === 1 && percentage !== 100) throw new Error("Agrega otro platillo antes de reducir la participación de la única comida.");
  const total = items.reduce((sum, item) => sum + item.quantity, 0);
  const otherTotal = items.filter((item) => item.id !== id).reduce((sum, item) => sum + item.quantity, 0);
  const otherCount = items.length - 1;
  const weights = items.map((item) => item.id === id ? percentage :
    (100 - percentage) * (otherTotal ? item.quantity / otherTotal : 1 / otherCount));
  return allocatePlates(total, weights);
}

export function rebalanceProductionPlan<T extends ProductionLine & { weight: number }>(
  lines: T[], targets: Record<string, number>,
): T[] {
  const result = lines.map((line) => ({ ...line }));
  for (const [date, total] of Object.entries(targets)) {
    const day = result.filter((line) => line.date === date);
    const quantities = allocatePlates(total, day.map((line) => line.weight));
    day.forEach((line, index) => { line.quantity = quantities[index]!; });
  }
  return result;
}

export function formatPurchaseQuantity(quantity: number, unit: string): string {
  if (!Number.isFinite(quantity) || quantity < 0) throw new Error("Cantidad de compra no válida.");
  let value = quantity;
  let label = unit;
  if (unit === "g" && quantity >= 1000) { value /= 1000; label = "kg"; }
  if (unit === "ml" && quantity >= 1000) { value /= 1000; label = "L"; }
  if (unit === "piece") label = quantity === 1 ? "pieza" : "piezas";
  if (["diente", "rama", "hoja", "lata", "paquete", "barra", "rebanada", "envase"].includes(unit)) label = quantity === 1 ? unit : `${unit}s`;
  return `${new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(value)} ${label}`;
}

function purchaseFamily(name: string): string {
  const value = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (!/\b(caldo|concentrado|sazonador|extracto|knorr|consome|condimento|bouillon)\b/.test(value)) {
    if (/\b(res|beef)\b/.test(value)) return "Res";
    if (/\bpollo\b/.test(value)) return "Pollo";
    if (/\b(cerdo|puerco)\b/.test(value)) return "Cerdo";
    if (/\b(pescado|camaron|camarones|marlin|atun|surimi)\b/.test(value)) return "Pescados y mariscos";
  }
  if (/\barroz\b/.test(value) && !/\b(agua|harina|leche|vinagre)\b/.test(value)) return "Arroz";
  return "Otros ingredientes";
}

export function summarizePurchases(requirements: Requirement[]) {
  type Total = { unit: string; quantity: number };
  type Item = { ingredient: string; name: string; totals: Total[] };
  const groups = new Map<string, { name: string; items: Item[]; totals: Total[] }>();
  for (const row of requirements) {
    if (!Number.isFinite(row.quantity) || row.quantity < 0) throw new Error("Cantidad de compra no válida.");
    const ingredientName = canonicalIngredientName(row.name);
    const name = purchaseFamily(ingredientName);
    const group = groups.get(name) ?? { name, items: [], totals: [] };
    const item = group.items.find((item) => ingredientKey(item.name) === ingredientKey(ingredientName))
      ?? { ingredient: row.ingredient, name: ingredientName, totals: [] };
    const itemTotal = item.totals.find((total) => total.unit === row.unit);
    if (itemTotal) itemTotal.quantity += row.quantity;
    else item.totals.push({ unit: row.unit, quantity: row.quantity });
    if (!group.items.includes(item)) group.items.push(item);
    // These are family subtotals only; distinct cuts and ingredient IDs stay separate below.
    const total = group.totals.find((total) => total.unit === row.unit);
    if (total) total.quantity += row.quantity;
    else group.totals.push({ unit: row.unit, quantity: row.quantity });
    groups.set(name, group);
  }
  const order = ["Res", "Pollo", "Cerdo", "Pescados y mariscos", "Arroz", "Otros ingredientes"];
  return [...groups.values()].map((group) => ({
    ...group, items: [...group.items].sort((left, right) => left.name.localeCompare(right.name, "es")),
  })).sort((left, right) => order.indexOf(left.name) - order.indexOf(right.name));
}

export interface ShoppingPlanContext {
  plannedPlates: number;
  availableCredits: number;
  forecastCredits: number | null;
  walkIns?: { daily: number; days: number };
}

export function buildShoppingText(requirements: Requirement[], period: string, warnings: string[], context?: ShoppingPlanContext): string {
  const groups = summarizePurchases(requirements);
  const reviewItems = [...new Set(warnings)];
  const lines = [
    "BREEZY MEALS - LISTA DE COMPRAS",
    period,
    "Estimación según las recetas y porciones del plan.",
    "Cantidades brutas, antes de descontar inventario.",
  ];
  if (context) {
    const values = [context.plannedPlates, context.availableCredits, ...(context.forecastCredits === null ? [] : [context.forecastCredits])];
    if (values.some((value) => !Number.isFinite(value) || value < 0)) throw new Error("Base de planeación no válida.");
    if (context.walkIns && (!Number.isSafeInteger(context.walkIns.daily) || context.walkIns.daily < 0
      || !Number.isSafeInteger(context.walkIns.days) || context.walkIns.days < 1)) throw new Error("Previsión de clientes sin membresía no válida.");
    lines.push(
      `Platos planeados: ${context.plannedPlates}.`,
      `Créditos disponibles al descargar: ${context.availableCredits}.`,
      context.forecastCredits === null ? "Base de créditos del plan no registrada."
        : `Base de la previsión guardada: ${context.forecastCredits} créditos.`,
    );
    if (context.walkIns) {
      const { daily, days } = context.walkIns;
      lines.push(`Clientes sin membresía: ${daily} por día × ${days} días = ${daily * days} platos, antes del margen de producción.`);
    }
    if (context.forecastCredits !== null && context.forecastCredits !== context.availableCredits) {
      lines.push("El saldo cambió. Las compras corresponden a los platos planeados, no al saldo actual.");
    }
  }
  if (reviewItems.length) {
    lines.push(
      "",
      `TOTALES PROVISIONALES - ${reviewItems.length} datos por revisar.`,
      "Solo incluye cantidades calculables; revisa los pendientes antes de comprar.",
    );
  }
  lines.push("", "RESUMEN", "-------");
  for (const group of groups.filter((group) => group.name !== "Otros ingredientes")) {
    lines.push(`${group.name}: ${group.totals.map((total) => formatPurchaseQuantity(total.quantity, total.unit)).join(" + ")}`);
  }
  lines.push("", "INGREDIENTES", "------------");
  for (const group of groups) {
    lines.push("", group.name);
    for (const row of group.items) lines.push(`- ${row.name}: ${row.totals.map((total) => formatPurchaseQuantity(total.quantity, total.unit)).join(" + ")}`);
  }
  lines.push("", "Los cortes se compran por separado; no se sustituyen entre sí.");
  lines.push("Cucharada = 15 ml; cucharadita = 5 ml. No se convierten piezas o envases a gramos.");
  lines.push("Media crema por envase; queso amarillo por rebanada; Knorr por pieza.");
  lines.push("Se respeta la presentación de cada receta; redondea piezas y envases al comprar.");
  if (reviewItems.length) {
    lines.push("", "DATOS POR REVISAR (NO SON INGREDIENTES)", "-------------------------------------");
    for (const warning of reviewItems) lines.push(`- ${warning}`);
  }
  return `${lines.join("\r\n")}\r\n`;
}
