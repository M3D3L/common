import { computed, type Ref } from "vue";
import {
  comboForItem,
  emptyDayDishes,
  findMenuItemByName,
  groups as baseGroups,
  groupsFromData,
  normalizeDishNames,
  normalizeMenuCatalog,
  type DayDishes,
  type GroupKey,
  type MenuCatalog,
  type MenuItem,
  type MenuRecord,
} from "~/utils/comandas";
import {
  resolveDay,
  type RotationConfig,
  type WeekBlock,
  type WeekOverride,
} from "~/utils/rotation";

// The `menu` record with the rotation fields.
export type MenuRecordFull = MenuRecord & {
  store?: MenuCatalog | DayDishes;
  week_blocks?: WeekBlock[];
  rotation?: string[];
  rotation_anchor?: string;
  overrides?: Record<string, WeekOverride>;
  active_date?: string;
  [key: string]: unknown;
};

export type ActiveMenuItem = MenuItem & { group: GroupKey };

const EMPTY_DISHES: DayDishes = emptyDayDishes();

/**
 * Resolves the day's menu (staff override / today's active shift / weekly
 * rotation) into groups and priced items. See useTaquizaOrders.ts and
 * useMenuPricing.ts for how the cart interacts with this data.
 */
export function useMenuData(params: {
  record: Ref<MenuRecordFull | null | undefined>;
  selectedDate: Ref<string>;
  dishesField: () => "dishes" | "store";
  staffMode: () => boolean;
  useDailyMenu: () => boolean;
}) {
  const { record, selectedDate, dishesField, staffMode, useDailyMenu } = params;

  /**
   * Today's menu: same criteria as the comandas (kitchen board) app.
   *  1) If there's an `active` menu set for TODAY (shift started or manual
   *     override), that wins.
   *  2) Otherwise, resolve today's date against the weekly rotation (blocks).
   */
  const active = computed<DayDishes>(() => {
    const rec = record.value;
    if (!rec) return EMPTY_DISHES;

    const selectedDishes = rec[dishesField()];
    if (staffMode()) {
      return normalizeDishNames(
        rec.active as Partial<Record<GroupKey, unknown>>,
      );
    }
    if (!useDailyMenu() || dishesField() !== "dishes") {
      return normalizeDishNames(
        selectedDishes as Partial<Record<GroupKey, unknown>>,
      );
    }

    const a = normalizeDishNames(
      rec.active as Partial<Record<GroupKey, unknown>>,
    );
    const activeFresh =
      rec.active_date === selectedDate.value &&
      groupsFromData(a as Record<string, unknown>).some(
        (g) => (a[g.key] ?? []).length > 0,
      );
    if (activeFresh) return a;

    const cfg: RotationConfig = {
      blocks: rec.week_blocks ?? [],
      rotation: rec.rotation ?? [],
      anchor: rec.rotation_anchor ?? "",
      overrides: rec.overrides ?? {},
    };
    const resolved = resolveDay(selectedDate.value, cfg);
    return resolved
      ? normalizeDishNames(resolved.menu as Partial<Record<GroupKey, unknown>>)
      : EMPTY_DISHES;
  });

  const menuSourceCatalog = computed<Partial<Record<GroupKey, unknown>>>(
    () =>
      (record.value?.[dishesField()] ?? {}) as Partial<
        Record<GroupKey, unknown>
      >,
  );

  const menuGroups = computed(() => {
    const fromMenu = groupsFromData({
      ...(menuSourceCatalog.value as Record<string, unknown>),
      ...(active.value as Record<string, unknown>),
    });
    const knownKeys = new Set<string>(baseGroups.map((group) => group.key));
    const extraGroups = fromMenu.filter((group) => !knownKeys.has(group.key));

    return [...baseGroups, ...extraGroups];
  });

  const hasMenu = computed(() =>
    menuGroups.value.some((g) => active.value[g.key]?.length),
  );

  const catalog = computed<MenuCatalog>(() =>
    normalizeMenuCatalog(menuSourceCatalog.value),
  );

  const activeItems = computed<Record<GroupKey, ActiveMenuItem[]>>(() => {
    const out = {} as Record<GroupKey, ActiveMenuItem[]>;

    menuGroups.value.forEach((g) => {
      const names = active.value[g.key] ?? [];

      out[g.key] = names.map((name) => {
        const found = findMenuItemByName(catalog.value, name, g.key);
        if (found?.item) {
          return { ...found.item, group: g.key };
        }
        return {
          name,
          price: 0,
          combo: comboForItem(null, g.key),
          group: g.key,
        };
      });
    });
    return out;
  });

  const groupItems = (k: GroupKey) => activeItems.value[k] ?? [];

  const taquizaGroup = baseGroups.find((g) => "pieceOptions" in g) as
    | ((typeof baseGroups)[number] & {
        pieceOptions: { tacos: number; quesadillas: number };
      })
    | undefined;

  function showGroupSection(key: GroupKey) {
    return groupItems(key).length > 0;
  }

  return {
    active,
    menuSourceCatalog,
    menuGroups,
    hasMenu,
    catalog,
    activeItems,
    groupItems,
    taquizaGroup,
    showGroupSection,
  };
}
