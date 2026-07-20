import type { DayDishes } from "~/utils/comandas";

/* ===== Modelo ===== */

export type WeekdayKey = "1" | "2" | "3" | "4" | "5"; // Lun..Vie

/** Un "bloque de semana" reutilizable: menú de Lun–Vie del catálogo. */
export interface WeekBlock {
  id: string;
  name: string;
  color: string;
  days: Partial<Record<WeekdayKey, DayDishes>>;
}

/** Ajuste sobre una semana concreta (clave = lunes ISO de esa semana). */
export type WeekOverride = { block: string } | { closed: true };

export interface RotationConfig {
  blocks: WeekBlock[];
  rotation: string[]; // ids de bloque en orden; se ciclan
  anchor: string; // fecha ISO de un lunes: semana 0 del ciclo
  overrides: Record<string, WeekOverride>; // clave = lunes ISO
}

/* ===== Helpers de fecha =====
 * Operan sobre etiquetas YYYY-MM-DD usando UTC, así el cálculo de días/semanas
 * es exacto y no se corre por zona horaria (solo se manipulan etiquetas).
 */

const MS_DAY = 86_400_000;

function toUTC(iso: string): Date {
  return new Date(iso + "T00:00:00Z");
}
function labelOf(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number): string {
  const d = toUTC(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return labelOf(d);
}

/** 1 = Lunes … 7 = Domingo */
export function weekday(iso: string): number {
  const dow = toUTC(iso).getUTCDay();
  return dow === 0 ? 7 : dow;
}

/** Lunes (fecha ISO) de la semana que contiene `iso`. */
export function mondayOf(iso: string): string {
  return addDays(iso, -(weekday(iso) - 1));
}

/** Semanas completas del lunes ancla al lunes objetivo (puede ser negativo). */
export function weeksSince(anchorMon: string, targetMon: string): number {
  return Math.round(
    (toUTC(targetMon).getTime() - toUTC(anchorMon).getTime()) / (7 * MS_DAY),
  );
}

/* ===== Resolver ===== */

export interface WeekResolution {
  monday: string;
  closed: boolean;
  block: WeekBlock | null;
}

/** Qué bloque (si alguno) aplica a la semana que empieza en `mondayISO`. */
export function resolveWeek(
  mondayISO: string,
  cfg: RotationConfig,
): WeekResolution {
  const ov = cfg.overrides?.[mondayISO];
  if (ov && "closed" in ov && ov.closed) {
    return { monday: mondayISO, closed: true, block: null };
  }
  let blockId: string | null = null;
  if (ov && "block" in ov) {
    blockId = ov.block; // semana fijada manualmente
  } else if (cfg.rotation.length && cfg.anchor) {
    const n = cfg.rotation.length;
    const i = ((weeksSince(cfg.anchor, mondayISO) % n) + n) % n; // módulo positivo
    blockId = cfg.rotation[i];
  }
  const block = cfg.blocks.find((b) => b.id === blockId) ?? null;
  return { monday: mondayISO, closed: false, block };
}

/** Platillos disponibles para una fecha, o null si cerrado / fin de semana / vacío. */
export function resolveDay(
  dateISO: string,
  cfg: RotationConfig,
): { block: WeekBlock; menu: DayDishes } | null {
  const wd = weekday(dateISO);
  if (wd > 5) return null; // sábado / domingo
  const { closed, block } = resolveWeek(mondayOf(dateISO), cfg);
  if (closed || !block) return null;
  const menu = block.days[String(wd) as WeekdayKey];
  if (!menu) return null;
  const empty =
    !menu.guisos?.length && !menu.sides?.length && !menu.bebidas?.length;
  if (empty) return null;
  return { block, menu };
}
