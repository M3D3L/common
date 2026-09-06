import type { RecordModel } from "pocketbase";
import usePocketBase from "@common/composables/usePocketbase";
import {
  buildChecklistViews,
  buildPunchViews,
  buildRecipeViews,
  planOrderedChildren,
  type NormalizedRecord,
  type PunchView,
  type RecipeView,
} from "~/lib/normalized-domain";
import { stableFingerprint } from "~/lib/legacy-normalization";
import type { ChecklistRun } from "~/utils/checklists";

let sourceSequence = 0;
const nextSourceIndex = () => Date.now() * 1000 + (sourceSequence++ % 1000);

const recordData = (record: RecordModel) =>
  record as unknown as NormalizedRecord;

export default function useNormalizedOperations() {
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

  async function findFirst(
    collection: string,
    filter: string,
  ): Promise<NormalizedRecord | null> {
    try {
      const record = await pb.collection(collection).getFirstListItem(filter, {
        requestKey: null,
      });
      return recordData(record);
    } catch (error) {
      if ((error as { status?: number }).status === 404) return null;
      throw error;
    }
  }

  async function loadRecipes(): Promise<RecipeView[]> {
    const [recipes, ingredients, steps] = await Promise.all([
      fetchAll("recipes", "source_index"),
      fetchAll("recipe_ingredients", "sort_order"),
      fetchAll("recipe_steps", "sort_order"),
    ]);
    return buildRecipeViews(recipes, ingredients, steps);
  }

  async function saveRecipe(recipe: RecipeView): Promise<RecipeView> {
    const legacyPayload = {
      id: recipe.id,
      title: recipe.title,
      url: recipe.url,
      image: recipe.image,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.totalTime,
      category: recipe.category,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      nutrition: recipe.nutrition,
      hasDetail: recipe.hasDetail,
    };
    const payload = {
      legacy_id: recipe.id,
      title: recipe.title,
      source_url: recipe.url,
      image_url: recipe.image ?? "",
      servings: recipe.servings ?? "",
      prep_time: recipe.prepTime ?? "",
      cook_time: recipe.cookTime ?? "",
      total_time: recipe.totalTime ?? "",
      category: recipe.category ?? "",
      calories: recipe.nutrition?.calories ?? "",
      carbs: recipe.nutrition?.carbs ?? "",
      fat: recipe.nutrition?.fat ?? "",
      protein: recipe.nutrition?.protein ?? "",
      has_detail: recipe.hasDetail,
      legacy_payload: legacyPayload,
    };
    const record = recipe.recordId
      ? await pb
          .collection("recipes")
          .update(recipe.recordId, payload, { requestKey: null })
      : await pb.collection("recipes").create(
          {
            ...payload,
            source_record: "app",
            source_index: nextSourceIndex(),
          },
          { requestKey: null },
        );

    const [oldIngredients, oldSteps] = await Promise.all([
      pb.collection("recipe_ingredients").getFullList({
        filter: `recipe = "${record.id}"`,
        requestKey: null,
      }),
      pb.collection("recipe_steps").getFullList({
        filter: `recipe = "${record.id}"`,
        requestKey: null,
      }),
    ]);
    const ingredientPlan = planOrderedChildren(
      oldIngredients.map(recordData),
      recipe.ingredients,
      "text",
    );
    const stepPlan = planOrderedChildren(
      oldSteps.map(recordData),
      recipe.steps,
      "instruction",
    );
    const upsertChildren = async (
      collection: "recipe_ingredients" | "recipe_steps",
      field: "text" | "instruction",
      entries: typeof ingredientPlan.upserts,
    ) =>
      Promise.all(
        entries.map(({ id, value, sortOrder }) => {
          const childPayload = {
            recipe: record.id,
            [field]: value,
            sort_order: sortOrder,
          };
          return id
            ? pb
                .collection(collection)
                .update(id, childPayload, { requestKey: null })
            : pb
                .collection(collection)
                .create(childPayload, { requestKey: null });
        }),
      );

    await Promise.all([
      upsertChildren("recipe_ingredients", "text", ingredientPlan.upserts),
      upsertChildren("recipe_steps", "instruction", stepPlan.upserts),
    ]);
    await Promise.all([
      ...ingredientPlan.deletes.map((id) =>
        pb.collection("recipe_ingredients").delete(id, { requestKey: null }),
      ),
      ...stepPlan.deletes.map((id) =>
        pb.collection("recipe_steps").delete(id, { requestKey: null }),
      ),
    ]);
    return { ...recipe, recordId: record.id };
  }

  async function deleteRecipe(recordId: string): Promise<void> {
    await pb.collection("recipes").delete(recordId, { requestKey: null });
  }

  async function loadPunches(): Promise<PunchView[]> {
    return buildPunchViews(await fetchAll("clock_entries", "occurred_at"));
  }

  async function createPunch(
    punch: Omit<PunchView, "recordId">,
  ): Promise<PunchView> {
    const record = await pb.collection("clock_entries").create(
      {
        staff_user: punch.user,
        legacy_user_id: punch.user,
        staff_name: punch.name,
        direction: punch.type,
        occurred_at: punch.at,
        legacy_occurred_at: punch.at,
        source_record: "app",
        source_index: nextSourceIndex(),
        source_hash: stableFingerprint(punch),
        legacy_payload: punch,
      },
      { requestKey: null },
    );
    return buildPunchViews([recordData(record)])[0];
  }

  async function loadChecklists() {
    const [templates, sections, items, runs, results] = await Promise.all([
      fetchAll("checklist_templates", "sort_order"),
      fetchAll("checklist_sections", "sort_order"),
      fetchAll("checklist_items", "sort_order"),
      fetchAll("checklist_runs", "business_date"),
      fetchAll("checklist_results", "created"),
    ]);
    return {
      ...buildChecklistViews(templates, sections, items, runs, results),
      records: { templates, sections, items, runs, results },
    };
  }

  async function saveChecklistRun(
    businessDate: string,
    checklistId: string,
    run: ChecklistRun,
  ): Promise<void> {
    const template = await findFirst(
      "checklist_templates",
      pb.filter("legacy_id = {:checklistId}", { checklistId }),
    );
    if (!template) throw new Error(`Missing checklist template ${checklistId}`);

    const sections = await pb.collection("checklist_sections").getFullList({
      filter: pb.filter("template = {:templateId}", {
        templateId: template.id,
      }),
      requestKey: null,
    });
    const items = (
      await Promise.all(
        sections.map((section) =>
          pb.collection("checklist_items").getFullList({
            filter: pb.filter("section = {:sectionId}", {
              sectionId: section.id,
            }),
            requestKey: null,
          }),
        ),
      )
    ).flat();
    const sectionTemplate = new Map(
      sections.map((record) => [record.id, String(record.template)]),
    );
    const itemByTemplateAndLegacyId = new Map(
      items.map((record) => [
        `${sectionTemplate.get(String(record.section))}:${String(record.legacy_id)}`,
        record,
      ]),
    );

    const existingRun = await findFirst(
      "checklist_runs",
      pb.filter("template = {:templateId} && business_date = {:businessDate}", {
        templateId: template.id,
        businessDate,
      }),
    );
    const runPayload = {
      template: template.id,
      legacy_template_id: checklistId,
      business_date: businessDate,
      started_at: new Date(run.startedAt).toISOString(),
      completed_at: run.completedAt
        ? new Date(run.completedAt).toISOString()
        : "",
      started_at_ms: run.startedAt,
      completed_at_ms: run.completedAt ?? null,
      performed_by_name: run.by ?? "",
      status: run.status ?? "in_progress",
      legacy_payload: run,
    };
    const runRecord = existingRun
      ? await pb
          .collection("checklist_runs")
          .update(existingRun.id, runPayload, { requestKey: null })
      : await pb.collection("checklist_runs").create(
          {
            ...runPayload,
            source_record: String(template.source_record || "app"),
          },
          { requestKey: null },
        );
    const existingResults = await pb
      .collection("checklist_results")
      .getFullList({
        filter: pb.filter("run = {:runId}", { runId: runRecord.id }),
        requestKey: null,
      });
    const resultByItemId = new Map(
      existingResults.map((record) => [String(record.legacy_item_id), record]),
    );

    for (const [itemId, result] of Object.entries(run.results)) {
      const existingResult = resultByItemId.get(itemId);
      const item = itemByTemplateAndLegacyId.get(`${template.id}:${itemId}`);
      const resultPayload = {
        run: runRecord.id,
        item: item?.id ?? "",
        legacy_item_id: itemId,
        done: result.done,
        number_value: typeof result.value === "number" ? result.value : null,
        text_value: typeof result.value === "string" ? result.value : "",
        checked_at: result.at ? new Date(result.at).toISOString() : "",
        checked_at_ms: result.at ?? null,
        checked_by_name: result.by ?? "",
        legacy_payload: result,
      };
      if (existingResult) {
        await pb
          .collection("checklist_results")
          .update(existingResult.id, resultPayload, { requestKey: null });
      } else {
        await pb
          .collection("checklist_results")
          .create(resultPayload, { requestKey: null });
      }
    }
  }

  return {
    loadRecipes,
    saveRecipe,
    deleteRecipe,
    loadPunches,
    createPunch,
    loadChecklists,
    saveChecklistRun,
  };
}
