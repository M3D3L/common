import { useChatGPT } from "@common/composables/useChatGPT";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import {
  useNutritionalLabels,
  NUTRITION_KEYS,
  emptyManualNutrition,
  type ManualNutrition,
  type ResolveResult,
} from "~/composables/useNutritionalLabels";
import { useExpiration } from "~/composables/useExpiration";
import { NOM051_RESOLVE } from "~/lib/nom051-resolve";

export function useCreateLabelForm(
  selectedLabel: Ref<any | null>,
  type: Ref<"create" | "edit">,
  onCreated: (entry: any) => void,
  onUpdated: (entry: any) => void,
) {
  const { createItem, updateItem } = usePocketBaseCore();
  const {
    transformRecord,
    buildRecordFromResolution,
    buildLocalRecord,
    mergePer100g,
  } = useNutritionalLabels();
  const { run, loading, error } = useChatGPT();
  const expiration = useExpiration();

  // ── Form state ──────────────────────────────────────────────────────────────
  const recipeName = ref("");
  const recipeText = ref("");
  const portionSize = ref<number | null>(null);
  const totalSize = ref<number | null>(null);
  const selectedType = ref<"snack" | "meal" | "drink" | "">("");
  const saving = ref(false);
  const saveError = ref<string | null>(null);
  const showManualNutrition = ref(false);
  const manualNutrition = ref<ManualNutrition>(emptyManualNutrition());

  // ── Derived ─────────────────────────────────────────────────────────────────
  const isEditMode = computed(
    () => type.value === "edit" && !!selectedLabel.value,
  );
  const isLoading = computed(() => loading.value || saving.value);

  const buttonLabel = computed(() => {
    if (loading.value) return "Analizando…";
    if (saving.value) return "Guardando…";
    return isEditMode.value ? "Guardar Cambios" : "Generar Etiqueta";
  });

  const originalIngredients = computed(() =>
    String(selectedLabel.value?.ing ?? "").trim(),
  );
  const ingredientsChanged = computed(
    () =>
      !isEditMode.value ||
      recipeText.value.trim() !== originalIngredients.value,
  );

  // ── Open / reset ─────────────────────────────────────────────────────────────
  function open() {
    saveError.value = null;
    if (isEditMode.value && selectedLabel.value) {
      recipeName.value = selectedLabel.value.name || "";
      recipeText.value = selectedLabel.value.ing || "";
      portionSize.value = selectedLabel.value.portion_size ?? null;
      totalSize.value = selectedLabel.value.total_size ?? null;
      selectedType.value = selectedLabel.value.type || "";
      showManualNutrition.value = true;
      expiration.reset(selectedLabel.value.expiration || "");
      manualNutrition.value = Object.fromEntries(
        NUTRITION_KEYS.map((k) => [k, selectedLabel.value[k] ?? null]),
      ) as ManualNutrition;
    } else {
      recipeName.value = "";
      recipeText.value = "";
      portionSize.value = null;
      totalSize.value = null;
      selectedType.value = "";
      showManualNutrition.value = false;
      manualNutrition.value = emptyManualNutrition();
      expiration.reset();
    }
  }

  // ── AI path ──────────────────────────────────────────────────────────────────
  async function resolveAndBuild(hasPortion: boolean, hasTotal: boolean) {
    const payload = {
      recipeName: recipeName.value.trim(),
      portionGrams: hasPortion ? portionSize.value : null,
      totalGrams: hasTotal ? totalSize.value : null,
      ingredients: recipeText.value.trim(),
    };

    let resolution: ResolveResult;
    try {
      const raw = await run(NOM051_RESOLVE, payload);
      const cleaned = raw.replace(/```json|```/g, "").trim();
      resolution = JSON.parse(cleaned);
      if (
        !Array.isArray(resolution.resolved) ||
        resolution.resolved.length === 0
      )
        throw new Error("Resolver returned no ingredients");
    } catch (e) {
      console.error("AI resolver parse error:", e);
      saveError.value = "No se pudo interpretar la receta. Revisa la consola.";
      return null;
    }

    resolution.nutrition_override = mergePer100g({
      manualNutrition: manualNutrition.value,
      isEditMode: isEditMode.value,
      ingredientsChanged: ingredientsChanged.value,
      storedLabel: selectedLabel.value,
      aiOverride: resolution.nutrition_override ?? {},
    }) as any;

    return buildRecordFromResolution(resolution, {
      portionGrams: hasPortion ? Number(portionSize.value) : null,
      totalGrams: hasTotal ? Number(totalSize.value) : null,
      fallbackName: recipeName.value,
    });
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function processLabel(onClose: () => void) {
    if (!recipeText.value.trim() || !recipeName.value.trim()) return;
    if (!expiration.validate()) return;
    saveError.value = null;

    const hasPortion =
      portionSize.value != null && Number(portionSize.value) > 0;
    const hasTotal = totalSize.value != null && Number(totalSize.value) > 0;
    const hasExpiration = expiration.expirationDate.value.trim() !== "";

    const rawRecord = ingredientsChanged.value
      ? await resolveAndBuild(hasPortion, hasTotal)
      : buildLocalRecord({
          manualNutrition: manualNutrition.value,
          isEditMode: isEditMode.value,
          ingredientsChanged: ingredientsChanged.value,
          storedLabel: selectedLabel.value,
          recipeName: recipeName.value,
          recipeText: recipeText.value,
          portionSize: portionSize.value,
          totalSize: totalSize.value,
          hasPortion,
          hasTotal,
        });

    if (!rawRecord) return;

    const entry = {
      ...transformRecord(rawRecord),
      pbId: isEditMode.value ? selectedLabel.value.id : null,
      expiration_date: hasExpiration ? expiration.expirationDate.value : null,
      type: selectedType.value || null,
    };

    isEditMode.value ? onUpdated(entry) : onCreated(entry);
    onClose();

    saving.value = true;
    try {
      const payload = {
        name: entry.name,
        sub: entry.sub,
        ing: entry.ing,
        alg: entry.alg,
        pair: entry.pair,
        type: entry.type,
        portion_size: entry.portion_size,
        total_size: entry.total_size,
        nameSize: entry.nameSize,
        expiration: entry.expiration_date,
        rows: entry.rows || [],
        ...Object.fromEntries(NUTRITION_KEYS.map((k) => [k, rawRecord[k]])),
      };

      if (isEditMode.value) {
        await updateItem("labels", selectedLabel.value.id, payload);
      } else {
        await createItem("labels", payload);
      }
    } catch (e) {
      saveError.value =
        "No se pudo guardar en la base de datos. Revisa la consola.";
      console.error("PocketBase write error:", e);
    } finally {
      saving.value = false;
      location.reload();
    }
  }

  return {
    // state
    recipeName,
    recipeText,
    portionSize,
    totalSize,
    selectedType,
    saving,
    saveError,
    showManualNutrition,
    manualNutrition,
    // expiration (spread so parent can v-bind directly to ExpirationPicker)
    ...expiration,
    // derived
    isEditMode,
    isLoading,
    buttonLabel,
    ingredientsChanged,
    // actions
    open,
    processLabel,
    // passthrough
    error,
  };
}
