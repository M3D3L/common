/*
 * Tipos y helpers puros para Checklists. Espeja la forma de ~/utils/comandas:
 * las PLANTILLAS viven en el registro único `checklists` (campo JSON `data`) y
 * los RESULTADOS del día ("runs") en la colección `checklist_runs`.
 */

export type ChecklistFrequency = "daily" | "weekly" | "shift" | "adhoc";
export type ItemKind = "check" | "number" | "text";
export type RunStatus = "in_progress" | "done";

export interface ChecklistItem {
  id: string; // ESTABLE: no cambia aunque edites el label (clave del reporte).
  label: string;
  kind?: ItemKind; // default "check"
  required?: boolean;
  unit?: string; // "°C", "kg" — para kind "number"
  min?: number; // rango aceptable -> pass/fail
  max?: number;
  hint?: string;
}

export interface ChecklistSection {
  key: string; // "cocina", "comedor"
  label: string; // "Cocina"
  items: ChecklistItem[];
}

export interface ChecklistTemplate {
  id: string; // "apertura", "cierre"
  title: string;
  description?: string;
  icon?: string; // nombre de icono lucide (opcional)
  frequency: ChecklistFrequency;
  order: number; // orden de despliegue
  active: boolean; // ocultar sin borrar
  sections: ChecklistSection[];
}

export interface ChecklistsData {
  version: number;
  lists: ChecklistTemplate[];
  // Estado de "Completadas": los ticks/resultados viven en el MISMO objeto,
  // anidados por día operativo. runs[bizDate][checklistId].
  runs?: RunsByDate;
}

/** Resultado de un ítem dentro de un run. */
export interface ItemResult {
  done: boolean;
  value?: number | string; // kind number / text
  at?: number; // timestamp del check
  by?: string; // quién lo marcó
}

/** Ejecución de una checklist en un día operativo. */
export interface ChecklistRun {
  checklistId: string;
  bizDate: string; // YYYY-MM-DD (día operativo)
  startedAt: number;
  completedAt?: number;
  by?: string;
  status?: RunStatus;
  results: Record<string, ItemResult>; // itemId -> resultado
}

/** runs[bizDate][checklistId] -> run del día. */
export type RunsByDate = Record<string, Record<string, ChecklistRun>>;

/** Registro de PocketBase para las plantillas (colección `checklists`). */
export interface ChecklistsRecord {
  id: string;
  data?: ChecklistsData;
}

export const FREQ_LABEL: Record<ChecklistFrequency, string> = {
  daily: "Diario",
  weekly: "Semanal",
  shift: "Por turno",
  adhoc: "Eventual",
};

/** Aplana todos los ítems de una plantilla. */
export function allItems(t: ChecklistTemplate): ChecklistItem[] {
  return t.sections.flatMap((s) => s.items);
}

/** ¿El ítem cuenta como "hecho"? */
export function isItemDone(item: ChecklistItem, r?: ItemResult): boolean {
  if (!r) return false;
  const kind = item.kind ?? "check";
  if (kind === "check") return r.done === true;
  if (kind === "number")
    return typeof r.value === "number" && !Number.isNaN(r.value);
  return typeof r.value === "string" && r.value.trim().length > 0;
}

/**
 * Pass/fail para ítems numéricos según min/max.
 *  true  -> dentro de rango
 *  false -> fuera de rango
 *  null  -> no aplica (no numérico o sin valor)
 */
export function isItemInRange(
  item: ChecklistItem,
  r?: ItemResult,
): boolean | null {
  if ((item.kind ?? "check") !== "number") return null;
  if (typeof r?.value !== "number") return null;
  if (item.min != null && r.value < item.min) return false;
  if (item.max != null && r.value > item.max) return false;
  return true;
}

export interface Progress {
  done: number;
  total: number;
  reqTotal: number;
  reqDone: number;
  complete: boolean; // todos los ítems hechos
  requiredMet: boolean; // todos los requeridos hechos
}

export function progress(t: ChecklistTemplate, run?: ChecklistRun): Progress {
  const items = allItems(t);
  const results = run?.results ?? {};
  let done = 0;
  let reqTotal = 0;
  let reqDone = 0;
  for (const it of items) {
    const d = isItemDone(it, results[it.id]);
    if (d) done++;
    if (it.required) {
      reqTotal++;
      if (d) reqDone++;
    }
  }
  return {
    done,
    total: items.length,
    reqTotal,
    reqDone,
    complete: items.length > 0 && done === items.length,
    requiredMet: reqDone === reqTotal,
  };
}
