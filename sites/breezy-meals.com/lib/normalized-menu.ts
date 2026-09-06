import type { NormalizedRecord } from "./normalized-domain.ts";
import type { MenuCatalog, MenuItem } from "~/utils/comandas";
import type { WeekBlock, WeekOverride } from "~/utils/rotation";

export interface NormalizedMenuRows {
  categories: NormalizedRecord[];
  items: NormalizedRecord[];
  blocks: NormalizedRecord[];
  days: NormalizedRecord[];
  dayItems: NormalizedRecord[];
  schedules: NormalizedRecord[];
  rotationSlots: NormalizedRecord[];
  overrides: NormalizedRecord[];
  serviceDays: NormalizedRecord[];
  serviceItems: NormalizedRecord[];
}

export type NormalizedMenuField =
  | "dishes"
  | "store"
  | "week_blocks"
  | "rotation"
  | "rotation_anchor"
  | "overrides"
  | "active"
  | "active_date"
  | "sold_out";

export const NORMALIZED_MENU_FIELDS: NormalizedMenuField[] = [
  "dishes",
  "store",
  "week_blocks",
  "rotation",
  "rotation_anchor",
  "overrides",
  "active",
  "active_date",
  "sold_out",
];

export function mergeChangedMenuFields<T extends NormalizedRecord>(
  normalized: T,
  persisted: T,
  changedFields: NormalizedMenuField[],
): T {
  const merged = { ...normalized };
  for (const field of changedFields) merged[field] = persisted[field];
  return merged;
}

export function legacyMenuCleanupPayload(hasDatedService: boolean) {
  return {
    dishes: null,
    store: null,
    week_blocks: null,
    rotation: null,
    rotation_anchor: "",
    overrides: null,
    ...(hasDatedService
      ? { active: null, active_date: "", sold_out: null }
      : {}),
  };
}

function relationId(value: unknown): string {
  if (typeof value === "string") return value;
  return Array.isArray(value) && typeof value[0] === "string" ? value[0] : "";
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numeric(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sorted(records: NormalizedRecord[]): NormalizedRecord[] {
  return [...records].sort(
    (left, right) => numeric(left.sort_order) - numeric(right.sort_order),
  );
}

function hasOwn(value: unknown, key: string): boolean {
  return Boolean(
    value &&
    typeof value === "object" &&
    Object.prototype.hasOwnProperty.call(value, key),
  );
}

function buildCatalog(
  sourceRecord: string,
  surface: "dishes" | "store",
  categories: NormalizedRecord[],
  items: NormalizedRecord[],
): MenuCatalog | null {
  const sourceCategories = sorted(
    categories.filter((category) => category.source_record === sourceRecord),
  );
  const categoryById = new Map(
    sourceCategories.map((category) => [category.id, text(category.key)]),
  );
  const catalog: MenuCatalog = {};

  sourceCategories.forEach((category) => {
    if (hasOwn(category.legacy_payload, surface)) {
      catalog[text(category.key)] = [];
    }
  });

  sorted(
    items.filter(
      (item) => item.source_record === sourceRecord && item.surface === surface,
    ),
  ).forEach((item) => {
    const category = categoryById.get(relationId(item.category));
    if (!category) return;
    const value = item.legacy_payload
      ? (item.legacy_payload as MenuItem)
      : (() => {
          const fallback: MenuItem = {
            name: text(item.name),
            price: numeric(item.price),
          };
          if (text(item.image_url)) fallback.image = text(item.image_url);
          if (item.combo && typeof item.combo === "object") {
            fallback.combo = item.combo as MenuItem["combo"];
          }
          return fallback;
        })();
    (catalog[category] ??= []).push(value);
  });

  return Object.keys(catalog).length ? catalog : null;
}

function buildBlocks(
  sourceRecord: string,
  rows: NormalizedMenuRows,
): WeekBlock[] | null {
  const categories = new Map(
    rows.categories
      .filter((category) => category.source_record === sourceRecord)
      .map((category) => [category.id, text(category.key)]),
  );
  const blocks = sorted(
    rows.blocks.filter((block) => block.source_record === sourceRecord),
  );
  if (!blocks.length) return null;

  return blocks.map((block) => {
    const days: WeekBlock["days"] = {};
    sorted(
      rows.days.filter((day) => relationId(day.block) === block.id),
    ).forEach((day) => {
      if (
        day.legacy_payload &&
        typeof day.legacy_payload === "object" &&
        !Array.isArray(day.legacy_payload)
      ) {
        days[String(numeric(day.weekday)) as keyof WeekBlock["days"]] =
          day.legacy_payload as WeekBlock["days"][keyof WeekBlock["days"]];
        return;
      }
      const menu: Record<string, string[]> = {};
      sorted(
        rows.dayItems.filter((item) => relationId(item.day) === day.id),
      ).forEach((item) => {
        const category = categories.get(relationId(item.category));
        if (!category) return;
        (menu[category] ??= []).push(text(item.legacy_name));
      });
      days[String(numeric(day.weekday)) as keyof WeekBlock["days"]] = menu;
    });
    return {
      id: text(block.legacy_id),
      name: text(block.name),
      color: text(block.color),
      days,
    };
  });
}

function buildServiceState(
  scheduleId: string,
  rows: NormalizedMenuRows,
): {
  active: Record<string, string[]>;
  sold_out: string[];
  active_date: string;
} | null {
  const serviceDay = [...rows.serviceDays]
    .filter((day) => relationId(day.schedule) === scheduleId)
    .sort((left, right) =>
      text(right.business_date).localeCompare(text(left.business_date)),
    )[0];
  if (!serviceDay) return null;

  const categoryById = new Map(
    rows.categories.map((category) => [category.id, text(category.key)]),
  );
  const active: Record<string, string[]> = {};
  const soldOut: string[] = [];
  sorted(
    rows.serviceItems.filter(
      (item) => relationId(item.service_day) === serviceDay.id,
    ),
  ).forEach((item) => {
    const name = text(item.legacy_name);
    const category = categoryById.get(relationId(item.category));
    if (category) (active[category] ??= []).push(name);
    if (item.sold_out === true) soldOut.push(name);
  });
  return {
    active,
    sold_out: [...new Set(soldOut)],
    active_date: text(serviceDay.business_date),
  };
}

export function buildNormalizedMenuRecord<T extends NormalizedRecord>(
  legacy: T,
  rows: NormalizedMenuRows,
): T {
  const sourceRecord = legacy.id;
  const dishes = buildCatalog(
    sourceRecord,
    "dishes",
    rows.categories,
    rows.items,
  );
  const store = buildCatalog(
    sourceRecord,
    "store",
    rows.categories,
    rows.items,
  );
  const blocks = buildBlocks(sourceRecord, rows);
  const schedule = rows.schedules.find(
    (item) =>
      item.source_record === sourceRecord ||
      relationId(item.menu) === sourceRecord,
  );
  const blockLegacyId = new Map(
    rows.blocks.map((block) => [block.id, text(block.legacy_id)]),
  );
  const rotation = schedule
    ? sorted(
        rows.rotationSlots.filter(
          (slot) => relationId(slot.schedule) === schedule.id,
        ),
      ).map(
        (slot) =>
          blockLegacyId.get(relationId(slot.block)) ||
          text(slot.legacy_block_id),
      )
    : null;
  const overrides = schedule
    ? Object.fromEntries(
        rows.overrides
          .filter((item) => relationId(item.schedule) === schedule.id)
          .map((item) => {
            const value: WeekOverride =
              item.kind === "closed"
                ? { closed: true }
                : {
                    block:
                      blockLegacyId.get(relationId(item.block)) ||
                      text(item.legacy_block_id),
                  };
            return [text(item.week_monday), value];
          }),
      )
    : null;
  const service = schedule ? buildServiceState(schedule.id, rows) : null;

  return {
    ...legacy,
    ...(dishes ? { dishes } : {}),
    ...(store ? { store } : {}),
    ...(blocks ? { week_blocks: blocks } : {}),
    ...(schedule ? { rotation_anchor: text(schedule.rotation_anchor) } : {}),
    ...(rotation ? { rotation } : {}),
    ...(overrides ? { overrides } : {}),
    ...(service ?? {}),
  };
}
