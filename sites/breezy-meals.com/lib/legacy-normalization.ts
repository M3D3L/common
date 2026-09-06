export interface LegacyRecord {
  id: string;
  [key: string]: unknown;
}

export interface LegacySnapshot {
  exportedAt: string;
  collections: {
    checklists: LegacyRecord[];
    clockins: LegacyRecord[];
    recipies: LegacyRecord[];
  };
}

export interface MigrationRow {
  ref: string;
  collection: string;
  identity: string[];
  data: Record<string, unknown>;
  relationRefs?: Record<string, string>;
}

export interface MigrationPlan {
  sourceHash: string;
  rows: MigrationRow[];
  counts: Record<string, number>;
  warnings: string[];
}

function parseJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function asObject(value: unknown): Record<string, unknown> {
  const parsed = parseJson(value);
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? (parsed as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  const parsed = parseJson(value);
  return Array.isArray(parsed) ? parsed : [];
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function dateFromMilliseconds(value: unknown): string | undefined {
  const milliseconds = numberValue(value);
  if (milliseconds === undefined) return undefined;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function dateFromString(value: unknown): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function legacyPayload(value: unknown): unknown {
  if (value && typeof value === "object") return value;
  return { value };
}

function sortedValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortedValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, child]) => child !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, sortedValue(child)]),
    );
  }
  return value;
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(sortedValue(value));
}

export function stableFingerprint(value: unknown): string {
  const input = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function addRow(
  rows: MigrationRow[],
  counts: Record<string, number>,
  row: MigrationRow,
) {
  rows.push(row);
  counts[row.collection] = (counts[row.collection] ?? 0) + 1;
}

export function createMigrationPlan(snapshot: LegacySnapshot): MigrationPlan {
  const rows: MigrationRow[] = [];
  const counts: Record<string, number> = {};
  const warnings: string[] = [];
  const templateRefs = new Map<string, string[]>();
  const itemRefs = new Map<string, string[]>();

  for (const source of snapshot.collections.checklists) {
    const data = asObject(source.data);
    const templates = asArray(data.lists);

    templates.forEach((rawTemplate, templateIndex) => {
      const template = asObject(rawTemplate);
      const legacyId = stringValue(template.id);
      const templateRef = `checklist-template:${source.id}:${templateIndex}`;
      const templateLookup = `${source.id}:${legacyId}`;
      templateRefs.set(templateLookup, [
        ...(templateRefs.get(templateLookup) ?? []),
        templateRef,
      ]);

      addRow(rows, counts, {
        ref: templateRef,
        collection: "checklist_templates",
        identity: ["source_record", "source_index"],
        data: {
          legacy_id: legacyId,
          title: stringValue(template.title),
          description: stringValue(template.description),
          icon: stringValue(template.icon),
          sort_order: numberValue(template.order),
          active: template.active !== false,
          days: Array.isArray(template.days) ? template.days : null,
          source_record: source.id,
          source_index: templateIndex + 1,
          legacy_payload: legacyPayload(rawTemplate),
        },
      });

      asArray(template.sections).forEach((rawSection, sectionIndex) => {
        const section = asObject(rawSection);
        const sectionRef = `${templateRef}:section:${sectionIndex}`;
        addRow(rows, counts, {
          ref: sectionRef,
          collection: "checklist_sections",
          identity: ["template", "source_index"],
          relationRefs: { template: templateRef },
          data: {
            legacy_key: stringValue(section.key),
            label: stringValue(section.label),
            sort_order: sectionIndex,
            source_index: sectionIndex + 1,
            legacy_payload: legacyPayload(rawSection),
          },
        });

        asArray(section.items).forEach((rawItem, itemIndex) => {
          const item = asObject(rawItem);
          const legacyItemId = stringValue(item.id);
          const itemRef = `${sectionRef}:item:${itemIndex}`;
          const itemLookup = `${source.id}:${legacyId}:${legacyItemId}`;
          itemRefs.set(itemLookup, [
            ...(itemRefs.get(itemLookup) ?? []),
            itemRef,
          ]);
          const kind = ["check", "number", "text"].includes(
            stringValue(item.kind),
          )
            ? stringValue(item.kind)
            : "check";

          addRow(rows, counts, {
            ref: itemRef,
            collection: "checklist_items",
            identity: ["section", "source_index"],
            relationRefs: { section: sectionRef },
            data: {
              legacy_id: legacyItemId,
              label: stringValue(item.label),
              kind,
              required: item.required === true,
              unit: stringValue(item.unit),
              minimum: numberValue(item.min),
              maximum: numberValue(item.max),
              hint: stringValue(item.hint),
              days: Array.isArray(item.days) ? item.days : null,
              sort_order: itemIndex,
              source_index: itemIndex + 1,
              legacy_payload: legacyPayload(rawItem),
            },
          });
        });
      });
    });

    const runsByDate = asObject(data.runs);
    Object.entries(runsByDate).forEach(([businessDate, rawDay]) => {
      Object.entries(asObject(rawDay)).forEach(([legacyTemplateId, rawRun]) => {
        const run = asObject(rawRun);
        const runRef = `checklist-run:${source.id}:${businessDate}:${legacyTemplateId}`;
        const matchingTemplates =
          templateRefs.get(`${source.id}:${legacyTemplateId}`) ?? [];
        if (matchingTemplates.length !== 1) {
          warnings.push(
            `Checklist run ${runRef} matched ${matchingTemplates.length} templates.`,
          );
        }

        addRow(rows, counts, {
          ref: runRef,
          collection: "checklist_runs",
          identity: ["source_record", "legacy_template_id", "business_date"],
          relationRefs:
            matchingTemplates.length === 1
              ? { template: matchingTemplates[0] }
              : undefined,
          data: {
            legacy_template_id: legacyTemplateId,
            business_date: businessDate,
            started_at: dateFromMilliseconds(run.startedAt),
            completed_at: dateFromMilliseconds(run.completedAt),
            started_at_ms: numberValue(run.startedAt),
            completed_at_ms: numberValue(run.completedAt),
            performed_by_name: stringValue(run.by),
            status: ["in_progress", "done"].includes(stringValue(run.status))
              ? stringValue(run.status)
              : "in_progress",
            source_record: source.id,
            legacy_payload: legacyPayload(rawRun),
          },
        });

        Object.entries(asObject(run.results)).forEach(
          ([legacyItemId, rawResult]) => {
            const result = asObject(rawResult);
            const matchingItems =
              itemRefs.get(
                `${source.id}:${legacyTemplateId}:${legacyItemId}`,
              ) ?? [];
            if (matchingItems.length !== 1) {
              warnings.push(
                `Checklist result ${runRef}:${legacyItemId} matched ${matchingItems.length} items.`,
              );
            }

            const value = result.value;
            addRow(rows, counts, {
              ref: `${runRef}:result:${legacyItemId}`,
              collection: "checklist_results",
              identity: ["run", "legacy_item_id"],
              relationRefs: {
                run: runRef,
                ...(matchingItems.length === 1
                  ? { item: matchingItems[0] }
                  : {}),
              },
              data: {
                legacy_item_id: legacyItemId,
                done: result.done === true,
                number_value: numberValue(value),
                text_value: typeof value === "string" ? value : "",
                checked_at: dateFromMilliseconds(result.at),
                checked_at_ms: numberValue(result.at),
                checked_by_name: stringValue(result.by),
                legacy_payload: legacyPayload(rawResult),
              },
            });
          },
        );
      });
    });
  }

  for (const source of snapshot.collections.clockins) {
    const punches = asArray(asObject(source.data).punches);
    punches.forEach((rawPunch, sourceIndex) => {
      const punch = asObject(rawPunch);
      const rawOccurredAt = stringValue(punch.at);
      const direction = ["in", "out"].includes(stringValue(punch.type))
        ? stringValue(punch.type)
        : "";
      addRow(rows, counts, {
        ref: `clock-entry:${source.id}:${sourceIndex}`,
        collection: "clock_entries",
        identity: ["source_record", "source_index"],
        data: {
          legacy_user_id: stringValue(punch.user),
          staff_name: stringValue(punch.name),
          direction,
          occurred_at: dateFromString(rawOccurredAt),
          legacy_occurred_at: rawOccurredAt,
          source_record: source.id,
          source_index: sourceIndex + 1,
          source_hash: stableFingerprint(rawPunch),
          legacy_payload: legacyPayload(rawPunch),
        },
      });
    });
  }

  for (const source of snapshot.collections.recipies) {
    const recipes = asArray(source.data);
    recipes.forEach((rawRecipe, sourceIndex) => {
      const recipe = asObject(rawRecipe);
      const recipeRef = `recipe:${source.id}:${sourceIndex}`;
      const nutrition = asObject(recipe.nutrition);
      addRow(rows, counts, {
        ref: recipeRef,
        collection: "recipes",
        identity: ["source_record", "source_index"],
        data: {
          legacy_id: stringValue(recipe.id),
          title: stringValue(recipe.title),
          source_url: stringValue(recipe.url),
          image_url: stringValue(recipe.image),
          servings: stringValue(recipe.servings),
          prep_time: stringValue(recipe.prepTime),
          cook_time: stringValue(recipe.cookTime),
          total_time: stringValue(recipe.totalTime),
          category: stringValue(recipe.category),
          calories: stringValue(nutrition.calories),
          carbs: stringValue(nutrition.carbs),
          fat: stringValue(nutrition.fat),
          protein: stringValue(nutrition.protein),
          has_detail: recipe.hasDetail === true,
          source_record: source.id,
          source_index: sourceIndex + 1,
          legacy_payload: legacyPayload(rawRecipe),
        },
      });

      asArray(recipe.ingredients).forEach((ingredient, ingredientIndex) => {
        addRow(rows, counts, {
          ref: `${recipeRef}:ingredient:${ingredientIndex}`,
          collection: "recipe_ingredients",
          identity: ["recipe", "sort_order"],
          relationRefs: { recipe: recipeRef },
          data: {
            text:
              typeof ingredient === "string"
                ? ingredient
                : stableStringify(ingredient),
            sort_order: ingredientIndex + 1,
          },
        });
      });

      asArray(recipe.steps).forEach((step, stepIndex) => {
        addRow(rows, counts, {
          ref: `${recipeRef}:step:${stepIndex}`,
          collection: "recipe_steps",
          identity: ["recipe", "sort_order"],
          relationRefs: { recipe: recipeRef },
          data: {
            instruction:
              typeof step === "string" ? step : stableStringify(step),
            sort_order: stepIndex + 1,
          },
        });
      });
    });
  }

  return {
    sourceHash: stableFingerprint(snapshot.collections),
    rows,
    counts,
    warnings,
  };
}
