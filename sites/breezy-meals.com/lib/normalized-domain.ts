import type {
  ChecklistItem,
  ChecklistRun,
  ChecklistSection,
  ChecklistTemplate,
  RunsByDate,
} from "~/utils/checklists";

export interface NormalizedRecord {
  id: string;
  [key: string]: unknown;
}

export interface RecipeView {
  recordId: string;
  id: string;
  title: string;
  url: string;
  image?: string | null;
  servings?: string | null;
  prepTime?: string | null;
  cookTime?: string | null;
  totalTime?: string | null;
  category?: string | null;
  ingredients: string[];
  steps: string[];
  nutrition?: {
    calories?: string | null;
    carbs?: string | null;
    fat?: string | null;
    protein?: string | null;
  } | null;
  hasDetail: boolean;
}

export interface PunchView {
  recordId: string;
  user: string;
  name: string;
  type: "in" | "out";
  at: string;
}

export interface OrderedChildPlan {
  upserts: Array<{
    id?: string;
    value: string;
    sortOrder: number;
  }>;
  deletes: string[];
}

const text = (value: unknown) => (typeof value === "string" ? value : "");
const optionalText = (value: unknown) => text(value) || null;
const number = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;
const relationId = (value: unknown) =>
  Array.isArray(value) ? text(value[0]) : text(value);

export function planOrderedChildren(
  records: NormalizedRecord[],
  values: string[],
  valueField: string,
): OrderedChildPlan {
  const ordered = [...records].sort(
    (left, right) =>
      (number(left.sort_order) ?? 0) - (number(right.sort_order) ?? 0),
  );
  return {
    upserts: values.flatMap((value, index) => {
      const existing = ordered[index];
      const sortOrder = index + 1;
      if (
        existing &&
        text(existing[valueField]) === value &&
        number(existing.sort_order) === sortOrder
      ) {
        return [];
      }
      return [{ id: existing?.id, value, sortOrder }];
    }),
    deletes: ordered.slice(values.length).map((record) => record.id),
  };
}

export function buildRecipeViews(
  recipes: NormalizedRecord[],
  ingredients: NormalizedRecord[],
  steps: NormalizedRecord[],
): RecipeView[] {
  const children = <T>(
    records: NormalizedRecord[],
    recipeId: string,
    value: (record: NormalizedRecord) => T,
  ) =>
    records
      .filter((record) => relationId(record.recipe) === recipeId)
      .sort(
        (left, right) =>
          (number(left.sort_order) ?? 0) - (number(right.sort_order) ?? 0),
      )
      .map(value);

  return recipes.map((record) => {
    const nutrition = {
      calories: optionalText(record.calories),
      carbs: optionalText(record.carbs),
      fat: optionalText(record.fat),
      protein: optionalText(record.protein),
    };
    return {
      recordId: record.id,
      id: text(record.legacy_id),
      title: text(record.title),
      url: text(record.source_url),
      image: optionalText(record.image_url),
      servings: optionalText(record.servings),
      prepTime: optionalText(record.prep_time),
      cookTime: optionalText(record.cook_time),
      totalTime: optionalText(record.total_time),
      category: optionalText(record.category),
      ingredients: children(ingredients, record.id, (item) => text(item.text)),
      steps: children(steps, record.id, (step) => text(step.instruction)),
      nutrition: Object.values(nutrition).some(Boolean) ? nutrition : null,
      hasDetail: record.has_detail === true,
    };
  });
}

export function buildPunchViews(records: NormalizedRecord[]): PunchView[] {
  return records
    .map((record) => ({
      recordId: record.id,
      user: text(record.legacy_user_id) || relationId(record.staff_user),
      name: text(record.staff_name),
      type: record.direction === "out" ? ("out" as const) : ("in" as const),
      at: text(record.occurred_at) || text(record.legacy_occurred_at),
    }))
    .filter((record) => record.user && record.at)
    .sort((left, right) => left.at.localeCompare(right.at));
}

export function buildChecklistViews(
  templateRecords: NormalizedRecord[],
  sectionRecords: NormalizedRecord[],
  itemRecords: NormalizedRecord[],
  runRecords: NormalizedRecord[],
  resultRecords: NormalizedRecord[],
): { templates: ChecklistTemplate[]; runsByDate: RunsByDate } {
  const itemRecordById = new Map(
    itemRecords.map((record) => [record.id, record]),
  );
  const templates = templateRecords
    .map((templateRecord): ChecklistTemplate => {
      const sections = sectionRecords
        .filter((section) => relationId(section.template) === templateRecord.id)
        .sort(
          (left, right) =>
            (number(left.sort_order) ?? 0) - (number(right.sort_order) ?? 0),
        )
        .map(
          (section): ChecklistSection => ({
            key: text(section.legacy_key),
            label: text(section.label),
            items: itemRecords
              .filter((item) => relationId(item.section) === section.id)
              .sort(
                (left, right) =>
                  (number(left.sort_order) ?? 0) -
                  (number(right.sort_order) ?? 0),
              )
              .map(
                (item): ChecklistItem => ({
                  id: text(item.legacy_id),
                  label: text(item.label),
                  kind:
                    item.kind === "number" || item.kind === "text"
                      ? item.kind
                      : "check",
                  required: item.required === true,
                  unit: optionalText(item.unit) ?? undefined,
                  min: number(item.minimum),
                  max: number(item.maximum),
                  hint: optionalText(item.hint) ?? undefined,
                  days: Array.isArray(item.days)
                    ? (item.days as number[])
                    : undefined,
                }),
              ),
          }),
        );
      return {
        id: text(templateRecord.legacy_id),
        title: text(templateRecord.title),
        description: optionalText(templateRecord.description) ?? undefined,
        icon: optionalText(templateRecord.icon) ?? undefined,
        order: number(templateRecord.sort_order) ?? 0,
        active: templateRecord.active !== false,
        days: Array.isArray(templateRecord.days)
          ? (templateRecord.days as number[])
          : undefined,
        sections,
      };
    })
    .sort((left, right) => left.order - right.order);

  const runsByDate: RunsByDate = {};
  for (const runRecord of runRecords) {
    const businessDate = text(runRecord.business_date);
    const checklistId = text(runRecord.legacy_template_id);
    if (!businessDate || !checklistId) continue;
    const run: ChecklistRun = {
      checklistId,
      bizDate: businessDate,
      startedAt:
        number(runRecord.started_at_ms) ??
        new Date(text(runRecord.started_at)).getTime(),
      completedAt:
        number(runRecord.completed_at_ms) ??
        (runRecord.completed_at
          ? new Date(text(runRecord.completed_at)).getTime()
          : undefined),
      by: optionalText(runRecord.performed_by_name) ?? undefined,
      status: runRecord.status === "done" ? "done" : "in_progress",
      results: {},
    };
    for (const result of resultRecords.filter(
      (record) => relationId(record.run) === runRecord.id,
    )) {
      const item = itemRecordById.get(relationId(result.item));
      const itemId = text(result.legacy_item_id) || text(item?.legacy_id);
      if (!itemId) continue;
      const value =
        result.number_value !== "" && result.number_value != null
          ? number(result.number_value)
          : (optionalText(result.text_value) ?? undefined);
      run.results[itemId] = {
        done: result.done === true,
        value,
        at:
          number(result.checked_at_ms) ??
          (result.checked_at
            ? new Date(text(result.checked_at)).getTime()
            : undefined),
        by: optionalText(result.checked_by_name) ?? undefined,
      };
    }
    if (!runsByDate[businessDate]) runsByDate[businessDate] = {};
    runsByDate[businessDate][checklistId] = run;
  }

  return { templates, runsByDate };
}
