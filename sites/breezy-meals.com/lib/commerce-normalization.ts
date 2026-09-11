import {
  stableFingerprint,
  type LegacyRecord,
  type MigrationRow,
} from "./legacy-normalization.ts";
import { getMenuItemStorageMetadata } from "./menu-item-storage.ts";

export interface CommerceSnapshot {
  exportedAt: string;
  collections: {
    menu: LegacyRecord[];
    comandas: LegacyRecord[];
  };
}

export interface CommerceRecordUpdate {
  collection: "comandas";
  recordId: string;
  data: Record<string, unknown>;
}

export interface CommerceMigrationPlan {
  sourceHash: string;
  rows: MigrationRow[];
  updates: CommerceRecordUpdate[];
  counts: Record<string, number>;
  warnings: string[];
}

function asObject(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    try {
      return asObject(JSON.parse(value));
    } catch {
      return {};
    }
  }
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  if (typeof value === "string") {
    try {
      return asArray(JSON.parse(value));
    } catch {
      return [];
    }
  }
  return Array.isArray(value) ? value : [];
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function isoFromMilliseconds(value: unknown): string | undefined {
  const milliseconds = numberValue(value);
  if (milliseconds === undefined) return undefined;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function compact(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
}

function canonicalName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function itemName(value: unknown): string {
  if (typeof value === "string") return value;
  return stringValue(asObject(value).name);
}

function categoryKind(key: string): "main" | "side" | "drink" {
  const normalized = key.toLowerCase();
  if (normalized.includes("bebida") || normalized.includes("drink")) {
    return "drink";
  }
  if (normalized.includes("side") || normalized.includes("guarn")) {
    return "side";
  }
  return "main";
}

function categoryLabel(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function addRow(
  rows: MigrationRow[],
  counts: Record<string, number>,
  row: MigrationRow,
) {
  rows.push(row);
  counts[row.collection] = (counts[row.collection] ?? 0) + 1;
}

export function createCommerceMigrationPlan(
  snapshot: CommerceSnapshot,
): CommerceMigrationPlan {
  const rows: MigrationRow[] = [];
  const updates: CommerceRecordUpdate[] = [];
  const counts: Record<string, number> = {};
  const warnings: string[] = [];
  const globalItemRefs = new Map<
    string,
    Array<{ ref: string; category: string; surface: string }>
  >();

  for (const source of snapshot.collections.menu) {
    const dishes = asObject(source.dishes);
    const store = asObject(source.store);
    const active = asObject(source.active);
    const blocks = asArray(source.week_blocks);
    const soldOut = asArray(source.sold_out).map(stringValue).filter(Boolean);
    const categoryKeys = new Set([
      ...Object.keys(dishes),
      ...Object.keys(store),
      ...Object.keys(active),
    ]);

    for (const rawBlock of blocks) {
      const days = asObject(asObject(rawBlock).days);
      for (const rawDay of Object.values(days)) {
        Object.keys(asObject(rawDay)).forEach((key) => categoryKeys.add(key));
      }
    }

    const catalogCategoriesByName = new Map<string, Set<string>>();
    for (const catalog of [dishes, store]) {
      for (const [categoryKey, rawItems] of Object.entries(catalog)) {
        for (const rawItem of asArray(rawItems)) {
          const name = itemName(rawItem);
          if (!name) continue;
          const key = canonicalName(name);
          const categories = catalogCategoriesByName.get(key) ?? new Set();
          categories.add(categoryKey);
          catalogCategoriesByName.set(key, categories);
        }
      }
    }
    if (
      soldOut.some(
        (name) =>
          (catalogCategoriesByName.get(canonicalName(name))?.size ?? 0) !== 1,
      )
    ) {
      categoryKeys.add("legacy_unclassified");
    }

    const categoryRefs = new Map<string, string>();
    [...categoryKeys].sort().forEach((key, categoryIndex) => {
      const ref = `menu-category:${source.id}:${key}`;
      categoryRefs.set(key, ref);
      addRow(rows, counts, {
        ref,
        collection: "menu_categories",
        identity: ["source_record", "key"],
        data: {
          key,
          label:
            key === "legacy_unclassified"
              ? "Legacy unclassified"
              : categoryLabel(key),
          kind: categoryKind(key),
          sort_order: categoryIndex + 1,
          source_record: source.id,
          legacy_payload: {
            key,
            dishes: dishes[key],
            store: store[key],
          },
        },
      });
    });

    const itemRefs = new Map<
      string,
      Array<{ ref: string; category: string; surface: string }>
    >();
    for (const [surface, catalog] of [
      ["dishes", dishes],
      ["store", store],
    ] as const) {
      let sourceIndex = 0;
      for (const [categoryKey, rawItems] of Object.entries(catalog)) {
        for (const rawItem of asArray(rawItems)) {
          sourceIndex += 1;
          const item = asObject(rawItem);
          const storage = getMenuItemStorageMetadata(rawItem);
          const name = itemName(rawItem);
          const ref = `menu-item:${source.id}:${surface}:${sourceIndex}`;
          if (!name) {
            warnings.push(
              `Menu ${source.id} ${surface} item ${sourceIndex} has no name.`,
            );
          }
          addRow(rows, counts, {
            ref,
            collection: "menu_items",
            identity: ["source_record", "surface", "category", "source_index"],
            relationRefs: { category: categoryRefs.get(categoryKey)! },
            data: compact({
              surface,
              name,
              price: numberValue(item.price),
              image_url: stringValue(item.image),
              combo: item.combo,
              source_record: source.id,
              source_index: storage?.sourceIndex ?? sourceIndex,
              legacy_payload: rawItem,
            }),
          });
          const lookup = canonicalName(name);
          itemRefs.set(lookup, [
            ...(itemRefs.get(lookup) ?? []),
            { ref, category: categoryKey, surface },
          ]);
          globalItemRefs.set(lookup, [
            ...(globalItemRefs.get(lookup) ?? []),
            { ref, category: categoryKey, surface },
          ]);
        }
      }
    }

    const resolveItem = (name: string, categoryKey?: string) => {
      const candidates = (itemRefs.get(canonicalName(name)) ?? []).filter(
        (candidate) => !categoryKey || candidate.category === categoryKey,
      );
      const dishesCandidates = candidates.filter(
        (candidate) => candidate.surface === "dishes",
      );
      if (dishesCandidates.length === 1) return dishesCandidates[0];
      if (dishesCandidates.length === 0 && candidates.length === 1) {
        return candidates[0];
      }
      return undefined;
    };

    blocks.forEach((rawBlock, blockIndex) => {
      const block = asObject(rawBlock);
      const blockRef = `menu-block:${source.id}:${blockIndex + 1}`;
      addRow(rows, counts, {
        ref: blockRef,
        collection: "menu_week_blocks",
        identity: ["source_record", "source_index"],
        data: {
          legacy_id: stringValue(block.id),
          name: stringValue(block.name),
          color: stringValue(block.color),
          sort_order: blockIndex + 1,
          source_record: source.id,
          source_index: blockIndex + 1,
          legacy_payload: rawBlock,
        },
      });

      Object.entries(asObject(block.days)).forEach(
        ([weekday, rawDay], dayIndex) => {
          const dayRef = `${blockRef}:day:${weekday}`;
          addRow(rows, counts, {
            ref: dayRef,
            collection: "menu_week_days",
            identity: ["block", "weekday"],
            relationRefs: { block: blockRef },
            data: {
              weekday: Number(weekday),
              source_index: dayIndex + 1,
              legacy_payload: rawDay,
            },
          });

          for (const [categoryKey, rawNames] of Object.entries(
            asObject(rawDay),
          )) {
            asArray(rawNames).forEach((rawName, itemIndex) => {
              const name = itemName(rawName);
              const resolved = resolveItem(name, categoryKey);
              if (name && !resolved) {
                warnings.push(
                  `Menu ${source.id} block ${stringValue(block.id)} day ${weekday} cannot uniquely link ${categoryKey}/${name}.`,
                );
              }
              addRow(rows, counts, {
                ref: `${dayRef}:${categoryKey}:${itemIndex + 1}`,
                collection: "menu_day_items",
                identity: ["day", "category", "sort_order"],
                relationRefs: compact({
                  day: dayRef,
                  category: categoryRefs.get(categoryKey),
                  item: resolved?.ref,
                }) as Record<string, string>,
                data: {
                  legacy_name: name,
                  sort_order: itemIndex + 1,
                  legacy_payload: rawName,
                },
              });
            });
          }
        },
      );
    });

    const scheduleRef = `menu-schedule:${source.id}`;
    addRow(rows, counts, {
      ref: scheduleRef,
      collection: "menu_schedules",
      identity: ["source_record"],
      data: {
        menu: source.id,
        rotation_anchor: stringValue(source.rotation_anchor),
        source_record: source.id,
        legacy_payload: compact({
          rotation: source.rotation,
          rotation_anchor: source.rotation_anchor,
          overrides: source.overrides,
          active: source.active,
          active_date: source.active_date,
          sold_out: source.sold_out,
        }),
      },
    });

    const blockRefsByLegacyId = new Map<string, string[]>();
    blocks.forEach((rawBlock, blockIndex) => {
      const legacyId = stringValue(asObject(rawBlock).id);
      blockRefsByLegacyId.set(legacyId, [
        ...(blockRefsByLegacyId.get(legacyId) ?? []),
        `menu-block:${source.id}:${blockIndex + 1}`,
      ]);
    });
    const uniqueBlockRef = (legacyId: string) => {
      const refs = blockRefsByLegacyId.get(legacyId) ?? [];
      return refs.length === 1 ? refs[0] : undefined;
    };

    asArray(source.rotation).forEach((rawBlockId, slotIndex) => {
      const legacyBlockId = stringValue(rawBlockId);
      const blockRef = uniqueBlockRef(legacyBlockId);
      if (!blockRef) {
        warnings.push(
          `Menu ${source.id} rotation slot ${slotIndex + 1} cannot uniquely link block ${legacyBlockId}.`,
        );
      }
      addRow(rows, counts, {
        ref: `${scheduleRef}:rotation:${slotIndex + 1}`,
        collection: "menu_rotation_slots",
        identity: ["schedule", "sort_order"],
        relationRefs: compact({
          schedule: scheduleRef,
          block: blockRef,
        }) as Record<string, string>,
        data: {
          legacy_block_id: legacyBlockId,
          sort_order: slotIndex + 1,
          legacy_payload: rawBlockId,
        },
      });
    });

    Object.entries(asObject(source.overrides)).forEach(
      ([weekMonday, rawOverride], overrideIndex) => {
        const override = asObject(rawOverride);
        const legacyBlockId = stringValue(override.block);
        const blockRef = legacyBlockId
          ? uniqueBlockRef(legacyBlockId)
          : undefined;
        if (legacyBlockId && !blockRef) {
          warnings.push(
            `Menu ${source.id} override ${weekMonday} cannot uniquely link block ${legacyBlockId}.`,
          );
        }
        addRow(rows, counts, {
          ref: `${scheduleRef}:override:${overrideIndex + 1}`,
          collection: "menu_week_overrides",
          identity: ["schedule", "week_monday"],
          relationRefs: compact({
            schedule: scheduleRef,
            block: blockRef,
          }) as Record<string, string>,
          data: {
            week_monday: weekMonday,
            kind: override.closed === true ? "closed" : "block",
            legacy_block_id: legacyBlockId,
            legacy_payload: rawOverride,
          },
        });
      },
    );

    const activeDate = stringValue(source.active_date);
    const hasActiveItems = Object.values(active).some(
      (value) => asArray(value).length > 0,
    );
    if (activeDate || hasActiveItems || soldOut.length) {
      if (!activeDate) {
        warnings.push(
          `Menu ${source.id} has active or sold-out items without active_date; preserved in menu_schedules only.`,
        );
      } else {
        const serviceRef = `${scheduleRef}:service:${activeDate}`;
        addRow(rows, counts, {
          ref: serviceRef,
          collection: "menu_service_days",
          identity: ["schedule", "business_date"],
          relationRefs: { schedule: scheduleRef },
          data: {
            business_date: activeDate,
            source_kind: "legacy",
            closed: false,
            legacy_payload: {
              active: source.active,
              sold_out: source.sold_out,
              active_date: source.active_date,
            },
          },
        });

        const serviceNames = new Set<string>();
        for (const [categoryKey, rawNames] of Object.entries(active)) {
          asArray(rawNames).forEach((rawName, itemIndex) => {
            const name = itemName(rawName);
            serviceNames.add(canonicalName(name));
            const resolved = resolveItem(name, categoryKey);
            addRow(rows, counts, {
              ref: `${serviceRef}:${categoryKey}:${itemIndex + 1}`,
              collection: "menu_service_items",
              identity: ["service_day", "category", "sort_order"],
              relationRefs: compact({
                service_day: serviceRef,
                category: categoryRefs.get(categoryKey),
                item: resolved?.ref,
              }) as Record<string, string>,
              data: {
                legacy_name: name,
                sort_order: itemIndex + 1,
                sold_out: soldOut.some(
                  (soldOutName) =>
                    canonicalName(soldOutName) === canonicalName(name),
                ),
                legacy_payload: rawName,
              },
            });
          });
        }

        soldOut
          .filter((name) => !serviceNames.has(canonicalName(name)))
          .forEach((name, soldOutIndex) => {
            const categories = [
              ...(catalogCategoriesByName.get(canonicalName(name)) ?? []),
            ];
            const categoryKey =
              categories.length === 1 ? categories[0] : "legacy_unclassified";
            const resolved = resolveItem(name, categoryKey);
            addRow(rows, counts, {
              ref: `${serviceRef}:sold-out:${soldOutIndex + 1}`,
              collection: "menu_service_items",
              identity: ["service_day", "category", "sort_order"],
              relationRefs: compact({
                service_day: serviceRef,
                category: categoryRefs.get(categoryKey),
                item: resolved?.ref,
              }) as Record<string, string>,
              data: {
                legacy_name: name,
                sort_order: 1_000_000 + soldOutIndex + 1,
                sold_out: true,
                legacy_payload: name,
              },
            });
          });
      }
    }
  }

  for (const sourceOrder of snapshot.collections.comandas) {
    const order = asObject(sourceOrder.data);
    const customer = asObject(order.customer);
    const promo = asObject(order.promo);
    updates.push({
      collection: "comandas",
      recordId: sourceOrder.id,
      data: compact({
        order_uid: stringValue(order.id),
        order_number: numberValue(order.number),
        status: "active",
        mode: stringValue(order.mode),
        placed_at: isoFromMilliseconds(order.createdAt),
        fulfill_date: stringValue(order.fulfillDate),
        fulfill_time: stringValue(order.fulfillTime),
        customer_name: stringValue(customer.name),
        customer_phone: stringValue(customer.phone),
        customer_address: stringValue(customer.address),
        member_code: stringValue(order.memberCode),
        subtotal: numberValue(order.pricingSubtotal),
        delivery_fee: numberValue(order.deliveryFee),
        total: numberValue(order.pricingTotal),
        promo_id: stringValue(promo.id),
        promo_label: stringValue(promo.label),
        snapshot_hash: stableFingerprint(sourceOrder.data),
      }),
    });
    counts.comandas_updates = (counts.comandas_updates ?? 0) + 1;

    if (snapshot.collections.menu.length === 0) {
      warnings.push(
        `Comanda ${sourceOrder.id} lines were not expanded because no menu record was exported.`,
      );
      continue;
    }

    Object.entries(asObject(order.cart)).forEach(
      ([name, rawQuantity], lineIndex) => {
        const quantity = numberValue(rawQuantity);
        if (quantity === undefined || quantity <= 0) {
          warnings.push(
            `Comanda ${sourceOrder.id} line ${name} has invalid quantity; retained in data snapshot only.`,
          );
          return;
        }
        const candidates = globalItemRefs.get(canonicalName(name)) ?? [];
        const uniqueRefs = [...new Set(candidates.map(({ ref }) => ref))];
        const itemRef = uniqueRefs.length === 1 ? uniqueRefs[0] : undefined;
        if (uniqueRefs.length > 1) {
          warnings.push(
            `Comanda ${sourceOrder.id} line ${name} matches multiple menu items.`,
          );
        }
        addRow(rows, counts, {
          ref: `comanda-line:${sourceOrder.id}:${lineIndex + 1}`,
          collection: "comanda_lines",
          identity: ["comanda", "sort_order"],
          relationRefs: itemRef ? { menu_item: itemRef } : undefined,
          data: {
            comanda: sourceOrder.id,
            item_name: name,
            quantity,
            sort_order: lineIndex + 1,
            legacy_payload: { name, quantity: rawQuantity },
          },
        });
      },
    );
  }

  return {
    sourceHash: stableFingerprint(snapshot.collections),
    rows,
    updates,
    counts,
    warnings,
  };
}
