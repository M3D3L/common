import type { RecordModel } from "pocketbase";
import usePocketBase from "@common/composables/usePocketbase";
import {
  buildNormalizedMenuRecord,
  legacyMenuCleanupPayload,
  mergeChangedMenuFields,
  NORMALIZED_MENU_FIELDS,
  type NormalizedMenuField,
  type NormalizedMenuRows,
} from "~/lib/normalized-menu";
import type { NormalizedRecord } from "~/lib/normalized-domain";
import { createCommerceMigrationPlan } from "~/lib/commerce-normalization";
import { stableStringify } from "~/lib/legacy-normalization";

const recordData = (record: RecordModel) =>
  record as unknown as NormalizedRecord;

const relationId = (value: unknown) =>
  typeof value === "string"
    ? value
    : Array.isArray(value) && typeof value[0] === "string"
      ? value[0]
      : "";

const sameFields = (record: NormalizedRecord, data: Record<string, unknown>) =>
  Object.entries(data).every(
    ([field, value]) =>
      stableStringify(record[field]) === stableStringify(value),
  );

const identityKey = (fields: string[], data: Record<string, unknown>) =>
  fields.map((field) => `${field}:${stableStringify(data[field])}`).join("|");

const menuCollectionNames = [
  "menu_categories",
  "menu_items",
  "menu_week_blocks",
  "menu_week_days",
  "menu_day_items",
  "menu_schedules",
  "menu_rotation_slots",
  "menu_week_overrides",
  "menu_service_days",
  "menu_service_items",
] as const;

type MenuCollectionName = (typeof menuCollectionNames)[number];
type MenuCollections = Record<MenuCollectionName, NormalizedRecord[]>;

const menuCollectionSorts: Record<MenuCollectionName, string> = {
  menu_categories: "sort_order",
  menu_items: "source_index",
  menu_week_blocks: "sort_order",
  menu_week_days: "weekday",
  menu_day_items: "sort_order",
  menu_schedules: "created",
  menu_rotation_slots: "sort_order",
  menu_week_overrides: "week_monday",
  menu_service_days: "business_date",
  menu_service_items: "sort_order",
};

const menuRows = (collections: MenuCollections): NormalizedMenuRows => ({
  categories: collections.menu_categories,
  items: collections.menu_items,
  blocks: collections.menu_week_blocks,
  days: collections.menu_week_days,
  dayItems: collections.menu_day_items,
  schedules: collections.menu_schedules,
  rotationSlots: collections.menu_rotation_slots,
  overrides: collections.menu_week_overrides,
  serviceDays: collections.menu_service_days,
  serviceItems: collections.menu_service_items,
});

export function useNormalizedMenuOperations() {
  const pb = usePocketBase();

  async function fetchAll(
    collection: string,
    sort = "created",
  ): Promise<NormalizedRecord[]> {
    const records = await pb.collection(collection).getFullList({
      sort,
      requestKey: null,
    });
    return records.map(recordData);
  }

  async function fetchMenuCollections(): Promise<MenuCollections> {
    const entries = await Promise.all(
      menuCollectionNames.map(
        async (name) =>
          [name, await fetchAll(name, menuCollectionSorts[name])] as const,
      ),
    );
    return Object.fromEntries(entries) as MenuCollections;
  }

  async function loadMenu<T extends NormalizedRecord>(legacy: T): Promise<T> {
    const collections = await fetchMenuCollections();
    return buildNormalizedMenuRecord(legacy, menuRows(collections));
  }

  async function syncMenu(
    persisted: NormalizedRecord,
    changedFields: NormalizedMenuField[] = NORMALIZED_MENU_FIELDS,
  ): Promise<void> {
    const existing = await fetchMenuCollections();
    const normalized = buildNormalizedMenuRecord(persisted, menuRows(existing));
    const legacy = mergeChangedMenuFields(normalized, persisted, changedFields);
    const plan = createCommerceMigrationPlan({
      exportedAt: new Date().toISOString(),
      collections: { menu: [legacy], comandas: [] },
    });
    const ownedBlocks = new Set(
      existing.menu_week_blocks
        .filter((row) => row.source_record === legacy.id)
        .map((row) => row.id),
    );
    const ownedDays = new Set(
      existing.menu_week_days
        .filter((row) => ownedBlocks.has(relationId(row.block)))
        .map((row) => row.id),
    );
    const ownedSchedules = new Set(
      existing.menu_schedules
        .filter(
          (row) =>
            row.source_record === legacy.id ||
            relationId(row.menu) === legacy.id,
        )
        .map((row) => row.id),
    );
    const ownedServiceDays = new Set(
      existing.menu_service_days
        .filter((row) => ownedSchedules.has(relationId(row.schedule)))
        .map((row) => row.id),
    );
    const ownedIds: Record<string, Set<string>> = {
      menu_categories: new Set(
        existing.menu_categories
          .filter((row) => row.source_record === legacy.id)
          .map((row) => row.id),
      ),
      menu_items: new Set(
        existing.menu_items
          .filter((row) => row.source_record === legacy.id)
          .map((row) => row.id),
      ),
      menu_week_blocks: ownedBlocks,
      menu_week_days: ownedDays,
      menu_day_items: new Set(
        existing.menu_day_items
          .filter((row) => ownedDays.has(relationId(row.day)))
          .map((row) => row.id),
      ),
      menu_schedules: ownedSchedules,
      menu_rotation_slots: new Set(
        existing.menu_rotation_slots
          .filter((row) => ownedSchedules.has(relationId(row.schedule)))
          .map((row) => row.id),
      ),
      menu_week_overrides: new Set(
        existing.menu_week_overrides
          .filter((row) => ownedSchedules.has(relationId(row.schedule)))
          .map((row) => row.id),
      ),
      menu_service_days: ownedServiceDays,
      menu_service_items: new Set(
        existing.menu_service_items
          .filter((row) => ownedServiceDays.has(relationId(row.service_day)))
          .map((row) => row.id),
      ),
    };
    const keptIds = Object.fromEntries(
      menuCollectionNames.map((name) => [name, new Set<string>()]),
    ) as Record<MenuCollectionName, Set<string>>;
    const identityMaps = new Map<string, Map<string, NormalizedRecord>>();
    const refToId = new Map<string, string>();

    for (const row of plan.rows) {
      const collection = row.collection as MenuCollectionName;
      const data = { ...row.data };
      for (const [field, ref] of Object.entries(row.relationRefs ?? {})) {
        const id = refToId.get(ref);
        if (!id) throw new Error(`Missing normalized menu relation: ${ref}`);
        data[field] = id;
      }
      const mapKey = `${collection}:${row.identity.join(",")}`;
      let recordsByIdentity = identityMaps.get(mapKey);
      if (!recordsByIdentity) {
        recordsByIdentity = new Map(
          existing[collection].map((record) => [
            identityKey(row.identity, record),
            record,
          ]),
        );
        identityMaps.set(mapKey, recordsByIdentity);
      }
      const key = identityKey(row.identity, data);
      const current = recordsByIdentity.get(key);
      const saved = current
        ? sameFields(current, data)
          ? current
          : recordData(
              await pb.collection(collection).update(current.id, data, {
                requestKey: null,
              }),
            )
        : recordData(
            await pb.collection(collection).create(data, { requestKey: null }),
          );
      recordsByIdentity.set(key, saved);
      refToId.set(row.ref, saved.id);
      keptIds[collection].add(saved.id);
    }

    const deleteOrder = [
      "menu_service_items",
      "menu_service_days",
      "menu_week_overrides",
      "menu_rotation_slots",
      "menu_day_items",
      "menu_week_days",
      "menu_items",
      "menu_week_blocks",
      "menu_categories",
      "menu_schedules",
    ] as const;
    for (const collection of deleteOrder) {
      const surplus = [...ownedIds[collection]].filter(
        (id) => !keptIds[collection].has(id),
      );
      await Promise.all(
        surplus.map((id) =>
          pb.collection(collection).delete(id, { requestKey: null }),
        ),
      );
    }

    const hasDatedService = plan.rows.some(
      (row) => row.collection === "menu_service_days",
    );
    await pb
      .collection("menu")
      .update(legacy.id, legacyMenuCleanupPayload(hasDatedService), {
        requestKey: null,
      });
  }

  return { loadMenu, syncMenu };
}
