/*
 * Pure types + helpers for Checklists.
 *
 * TEMPLATES and RESULTS live in ONE PocketBase record (`checklists`), in the
 * JSON `data` field:
 *   data = { version, lists:[...], runs: { [YYYY-MM-DD]: { [checklistId]: run } } }
 *
 * Scheduling is per weekday: each list (and optionally each item) declares the
 * weekdays it applies to. Sunday (0) is the closed day, so nothing schedules
 * there by default. Weekday numbering follows JS Date.getDay(): 0=Sun .. 6=Sat.
 */

export type ItemKind = "check" | "number" | "text";
export type RunStatus = "in_progress" | "done";

// Days the business is open (Mon–Sat). Sunday (0) is closed.
export const OPEN_DAYS = [1, 2, 3, 4, 5, 6];

// Short labels indexed by getDay() (0=Sun .. 6=Sat).
export const WEEKDAY_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export interface ChecklistItem {
  id: string; // STABLE: doesn't change when you edit the label (report key).
  label: string;
  kind?: ItemKind; // default "check"
  required?: boolean;
  unit?: string; // "°C", "kg" — for kind "number"
  min?: number; // acceptable range -> pass/fail
  max?: number;
  hint?: string;
  // Weekdays this item runs on. Falls back to the list's `days`, then OPEN_DAYS.
  days?: number[];
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
  icon?: string; // lucide icon name (optional)
  order: number; // display order
  active: boolean; // hide without deleting
  // Default weekdays for every item in this list (item-level `days` overrides).
  days?: number[];
  sections: ChecklistSection[];
}

export interface ChecklistsData {
  version: number;
  lists: ChecklistTemplate[];
  // Ticks/results, nested by business day. runs[YYYY-MM-DD][checklistId].
  runs?: RunsByDate;
}

/** Result of a single item within a run. */
export interface ItemResult {
  done: boolean;
  value?: number | string; // kind number / text
  at?: number; // check timestamp
  by?: string; // who marked it
}

/** A checklist run for one specific date. */
export interface ChecklistRun {
  checklistId: string;
  bizDate: string; // YYYY-MM-DD
  startedAt: number;
  completedAt?: number;
  by?: string;
  status?: RunStatus;
  results: Record<string, ItemResult>; // itemId -> result
}

/** runs[YYYY-MM-DD][checklistId] -> that date's run. */
export type RunsByDate = Record<string, Record<string, ChecklistRun>>;

/** PocketBase record for the whole thing (collection `checklists`). */
export interface ChecklistsRecord {
  id: string;
  data?: ChecklistsData;
}

/* ===== Scheduling ===== */

/** Weekdays an item runs on: item.days -> list.days -> OPEN_DAYS. */
export function resolveDays(
  t: ChecklistTemplate,
  item: ChecklistItem,
): number[] {
  return item.days ?? t.days ?? OPEN_DAYS;
}

export function itemOnDay(
  t: ChecklistTemplate,
  item: ChecklistItem,
  weekday: number,
): boolean {
  return resolveDays(t, item).includes(weekday);
}

/** A view of the template holding only the items scheduled for `weekday`. */
export function templateForDay(
  t: ChecklistTemplate,
  weekday: number,
): ChecklistTemplate {
  const sections = t.sections
    .map((s) => ({
      ...s,
      items: s.items.filter((it) => itemOnDay(t, it, weekday)),
    }))
    .filter((s) => s.items.length > 0);
  return { ...t, sections };
}

/** Does this list have any item scheduled for `weekday`? */
export function listOnDay(t: ChecklistTemplate, weekday: number): boolean {
  return t.sections.some((s) =>
    s.items.some((it) => itemOnDay(t, it, weekday)),
  );
}

/* ===== Dates (local, date-only — no timezone drift) ===== */

export function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function dateToISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
/** Local calendar date (NOT UTC), so the day is correct in any timezone. */
export function todayISO(): string {
  return dateToISO(new Date());
}
export function addDaysISO(iso: string, n: number): string {
  const d = isoToDate(iso);
  d.setDate(d.getDate() + n);
  return dateToISO(d);
}
export function weekdayOf(iso: string): number {
  return isoToDate(iso).getDay();
}
export function isClosedDay(iso: string): boolean {
  return weekdayOf(iso) === 0; // Sunday
}
/** Monday of the week containing `iso`. */
export function mondayOfWeek(iso: string): string {
  const wd = weekdayOf(iso); // 0..6
  const diff = wd === 0 ? -6 : 1 - wd; // shift back to Monday
  return addDaysISO(iso, diff);
}
/** The 7 dates (Mon..Sun) of the week containing `iso`. */
export function weekDates(iso: string): string[] {
  const mon = mondayOfWeek(iso);
  return Array.from({ length: 7 }, (_, i) => addDaysISO(mon, i));
}
export function dayNumber(iso: string): string {
  return String(isoToDate(iso).getDate());
}
export function prettyDate(iso: string): string {
  const s = isoToDate(iso).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ===== Item evaluation ===== */

export function isItemDone(item: ChecklistItem, r?: ItemResult): boolean {
  if (!r) return false;
  const kind = item.kind ?? "check";
  if (kind === "check") return r.done === true;
  if (kind === "number")
    return typeof r.value === "number" && !Number.isNaN(r.value);
  return typeof r.value === "string" && r.value.trim().length > 0;
}

/**
 * Pass/fail for numeric items against min/max.
 *  true -> within range, false -> out of range, null -> n/a.
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
  complete: boolean;
  requiredMet: boolean;
}

/** Progress over the items of `t` (pass a day-filtered template for a day view). */
export function progress(t: ChecklistTemplate, run?: ChecklistRun): Progress {
  const items = t.sections.flatMap((s) => s.items);
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
