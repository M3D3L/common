import { allocatePlates, type ProductionLine, type Requirement } from "./meal-planning.ts";
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

export function formatPurchaseQuantity(quantity: number, unit: string): string {
  if (!Number.isFinite(quantity) || quantity < 0) throw new Error("Cantidad de compra no válida.");
  let value = quantity;
  let label = unit;
  if (unit === "g" && quantity >= 1000) { value /= 1000; label = "kg"; }
  if (unit === "ml" && quantity >= 1000) { value /= 1000; label = "L"; }
  if (unit === "piece") label = quantity === 1 ? "pieza" : "piezas";
  return `${new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(value)} ${label}`;
}

function purchaseFamily(name: string): string {
  const value = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (!/\b(caldo|concentrado|sazonador|extracto)\b/.test(value)) {
    if (/\b(res|beef)\b/.test(value)) return "Res";
    if (/\bpollo\b/.test(value)) return "Pollo";
    if (/\b(cerdo|puerco)\b/.test(value)) return "Cerdo";
    if (/\b(pescado|camaron|camarones|marlin|atun)\b/.test(value)) return "Pescados y mariscos";
  }
  if (/\barroz\b/.test(value) && !/\b(harina|leche|vinagre)\b/.test(value)) return "Arroz";
  return "Otros ingredientes";
}

export function summarizePurchases(requirements: Requirement[]) {
  const groups = new Map<string, { name: string; items: Requirement[]; totals: Array<{ unit: string; quantity: number }> }>();
  for (const row of requirements) {
    if (!Number.isFinite(row.quantity) || row.quantity < 0) throw new Error("Cantidad de compra no válida.");
    const name = purchaseFamily(row.name);
    const group = groups.get(name) ?? { name, items: [], totals: [] };
    group.items.push(row);
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
