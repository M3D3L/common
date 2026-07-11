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

/** Platillos agrupados, misma forma que el estado `today` del staff. */
export type DayDishes = Record<GroupKey, string[]>;

/** Registro único de la colección `menu` en PocketBase. */
export interface MenuRecord {
  id: string;
  dishes: DayDishes; // catálogo completo
  active: DayDishes; // selección disponible (lo que ve el cliente)
  sold_out: string[]; // agotados
  whatsapp?: string; // número del negocio (solo dígitos), si existe el campo
  label?: string; // etiqueta opcional
  published?: boolean; // opcional
  day?: string; // opcional
  created: string;
  updated: string;
}

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

export function hasGroupItems(
  o: PlacedOrder,
  groupKey: GroupKey,
  catalog: DayDishes,
) {
  return (catalog[groupKey] ?? []).some((n) => o.cart && o.cart[n] > 0);
}

export function getGroupLines(
  o: PlacedOrder,
  groupKey: GroupKey,
  catalog: DayDishes,
) {
  return (catalog[groupKey] ?? [])
    .filter((n) => o.cart && o.cart[n] > 0)
    .map((n) => ({ name: n, qty: o.cart[n] }));
}
