/**
 * Constantes, tipos y helpers SIN estado para el módulo de Comandas.
 * Todo lo que viva aquí es puro: no depende de refs ni del store.
 */

import type { OrderMode, Customer } from "~/composables/useWhatsappOrder";

export type GroupKey = "guisos" | "sides" | "bebidas";
export type FilterType = "all" | OrderMode;

export interface PlacedOrder {
  id: string;
  number: number;
  cart: Record<string, number>;
  mode: OrderMode;
  note: string;
  fulfillDate?: string;
  customer?: Customer;
  createdAt: number;
}

export const MENU: Record<GroupKey, string[]> = {
  guisos: [
    "Birria",
    "Cochinita",
    "Chicharron en Salsa Verde",
    "Machaca Ranchera",
    "Pollo en Crema Chipotle",
    "Pollo en Crema de Rajas",
    "Pollo en Crema de Champinon y Tocino",
    "Carne Molida a la Bolonesa",
    "Caldo de Albondigas",
    "Albondigas de Chipotle Rellenas de queso",
    "Lasana de Calabaza",
    "Torta de Cochinita",
    "Quesabirria",
    "Croissants de Jamon y Queso",
    "Burritos de Machaca",
    "Burritos de huevo con tocino",
    "Bistec Ranchero",
    "Teriyaki de Res",
    "Teriyaki de Pollo",
    "Marlin para Quesadillas",
  ],
  sides: [
    "Spaghetti Rojo",
    "Fettucini Alfredo",
    "Arroz Naranja",
    "Arroz Blanco con elotitos",
    "Ensalada Fresca",
    "Frijoles Rancheros",
  ],
  bebidas: [
    "Agua de Melon",
    "Agua de Pina",
    "Limonada de limon amarillo",
    "Limonada de fresa",
  ],
};

export const groups: { key: GroupKey; label: string }[] = [
  { key: "guisos", label: "Guisos" },
  { key: "sides", label: "Guarniciones" },
  { key: "bebidas", label: "Bebidas" },
];

export const MODES = ["llevar", "aqui", "domicilio"] as const;

export const MODE_SHORT: Record<OrderMode, string> = {
  llevar: "Llevar",
  aqui: "Aquí",
  domicilio: "Domicilio",
};

export const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "Todas", value: "all" },
  { label: "Aquí", value: "aqui" },
  { label: "Llevar", value: "llevar" },
  { label: "Domicilio", value: "domicilio" },
];

/* ===== Fecha ===== */
export const todayISO = () => new Date().toISOString().slice(0, 10);

/* ===== Helpers presentacionales (sin estado) ===== */
export function orderTime(o: PlacedOrder) {
  return new Date(o.createdAt).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function modeBorderClass(m: OrderMode) {
  if (m === "aqui") return "border-t-blue-500";
  if (m === "domicilio") return "border-t-purple-500";
  return "border-t-orange-500";
}

export function modeBadgeClass(m: OrderMode) {
  if (m === "aqui")
    return "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200/40";
  if (m === "domicilio")
    return "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200/40";
  return "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 border-orange-200/40";
}

export function hasGroupItems(o: PlacedOrder, groupKey: GroupKey) {
  return MENU[groupKey].some((itemName) => o.cart && o.cart[itemName] > 0);
}

export function getGroupLines(o: PlacedOrder, groupKey: GroupKey) {
  return MENU[groupKey]
    .filter((itemName) => o.cart && o.cart[itemName] > 0)
    .map((itemName) => ({ name: itemName, qty: o.cart[itemName] }));
}
