<template>
  <div class="min-h-screen bg-neutral-800 p-6 font-['Barlow',Arial,sans-serif]">
    <SeoMeta :follow="false" />
    <div class="text-center mb-8">
      <Badge
        variant="outline"
        class="mb-3 text-neutral-400 border-neutral-600 tracking-widest text-[9px] uppercase px-3"
      >
        <Sparkles class="w-2.5 h-2.5 mr-1" />
        Generador de Etiquetas
      </Badge>
      <h1
        class="font-black text-white text-2xl tracking-[0.2em] uppercase mb-1"
      >
        Breezy Meals
      </h1>
    </div>

    <div class="max-w-2xl mx-auto space-y-4">
      <div>
        <NuxtLink
          to="/label-generator"
          class="inline-flex items-center gap-1.5 text-[9px] text-neutral-500 hover:text-amber-400 transition-colors tracking-widest uppercase"
        >
          <ArrowLeft class="w-3 h-3" />
          Volver al generador
        </NuxtLink>
      </div>

      <template v-if="fetching">
        <Card>
          <CardContent
            class="py-8 flex items-center justify-center gap-3 text-neutral-600"
          >
            <Loader2 class="w-4 h-4 animate-spin" />
            <span class="text-[10px] tracking-widest uppercase"
              >Cargando etiqueta…</span
            >
          </CardContent>
        </Card>
      </template>

      <template v-else-if="fetchError">
        <Card>
          <CardContent class="py-8">
            <div
              class="flex items-start gap-2 rounded-md bg-red-950/50 border border-red-800/50 px-3 py-2"
            >
              <AlertTriangle
                class="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5"
              />
              <p class="text-[10px] text-red-400 leading-snug">
                {{ fetchError }}
              </p>
            </div>
          </CardContent>
        </Card>
      </template>

      <template v-else-if="record">
        <div class="space-y-2">
          <div class="flex items-center gap-2 px-1">
            <Package class="w-3.5 h-3.5 text-neutral-500" />
            <span
              class="text-[9px] text-neutral-500 tracking-widest uppercase font-semibold"
            >
              Vista previa actual
            </span>
          </div>
          <BreezyLabels :labelData="[currentLabelData]" />
        </div>

        <Card>
          <CardHeader class="pb-3">
            <CardTitle
              class="text-sm tracking-widest uppercase flex items-center gap-2"
            >
              <UtensilsCrossed class="w-4 h-4 text-amber-400" />
              Editar Receta
            </CardTitle>
            <CardDescription class="text-neutral-500 text-[10px]">
              Actualiza los ingredientes y vuelve a generar la etiqueta
              nutricional.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <div class="space-y-1.5">
              <label
                class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold"
              >
                Nombre del Platillo
              </label>
              <Input
                v-model="recipeName"
                placeholder="Ej. Pollo al chipotle con arroz"
                class="bg-neutral-800 border-neutral-700 text-white text-xs placeholder:text-neutral-600 focus:border-amber-500 focus:ring-amber-500/20"
              />
            </div>

            <div class="space-y-1.5">
              <label
                class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold"
              >
                Ingredientes y Proporciones
              </label>
              <Textarea
                v-model="recipeText"
                placeholder="Ej.&#10;200 g pechuga de pollo&#10;80 g arroz blanco cocido&#10;30 g chile chipotle en adobo&#10;15 ml aceite de oliva&#10;..."
                rows="6"
                class="bg-neutral-800 border-neutral-700 text-white text-xs placeholder:text-neutral-600 resize-none focus:border-amber-500 focus:ring-amber-500/20"
              />
            </div>

            <div class="flex items-end gap-3">
              <div class="space-y-1.5 w-36">
                <label
                  class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold"
                >
                  Porción (g)
                </label>
                <div class="relative">
                  <Scale
                    class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500"
                  />
                  <Input
                    v-model.number="portionSize"
                    type="number"
                    min="10"
                    max="1000"
                    class="bg-neutral-800 border-neutral-700 text-white text-xs pl-7 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div class="space-y-1.5 w-36">
                <label
                  class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold"
                >
                  Total (g)
                </label>
                <div class="relative">
                  <Package
                    class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500"
                  />
                  <Input
                    v-model.number="totalSize"
                    type="number"
                    min="10"
                    max="10000"
                    class="bg-neutral-800 border-neutral-700 text-white text-xs pl-7 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <button
                @click="regenerateLabel"
                :disabled="
                  loading || saving || !recipeText.trim() || !recipeName.trim()
                "
                class="flex-1 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all bg-amber-400 text-neutral-900 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
              >
                <Loader2
                  v-if="loading || saving"
                  class="w-3.5 h-3.5 animate-spin"
                />
                <RefreshCw v-else class="w-3.5 h-3.5" />
                {{
                  loading
                    ? "Analizando…"
                    : saving
                      ? "Guardando…"
                      : "Regenerar Etiqueta"
                }}
              </button>
            </div>

            <div
              v-if="error || saveError"
              class="flex items-start gap-2 rounded-md bg-red-950/50 border border-red-800/50 px-3 py-2"
            >
              <AlertTriangle
                class="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5"
              />
              <p class="text-[10px] text-red-400 leading-snug">
                {{ error || saveError }}
              </p>
            </div>
          </CardContent>
        </Card>

        <template v-if="updatedLabelData">
          <div class="space-y-2">
            <div class="flex items-center justify-between px-1">
              <div class="flex items-center gap-2">
                <Sparkles class="w-3.5 h-3.5 text-amber-400" />
                <span
                  class="text-[9px] text-amber-400 tracking-widest uppercase font-semibold"
                >
                  Nueva versión
                </span>
              </div>
              <button
                @click="updatedLabelData = null"
                class="text-[9px] text-neutral-600 hover:text-red-400 transition-colors tracking-widest uppercase"
              >
                Descartar
              </button>
            </div>
            <BreezyLabels :labelData="[updatedLabelData]" />
          </div>
        </template>

        <Card class="border-red-900/40">
          <CardHeader class="pb-2">
            <CardTitle
              class="text-sm tracking-widest uppercase flex items-center gap-2 text-red-400"
            >
              <Trash2 class="w-4 h-4" />
              Zona de peligro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <p class="text-[10px] text-neutral-500 max-w-xs">
                Eliminar esta etiqueta de forma permanente. Esta acción no se
                puede deshacer.
              </p>
              <button
                v-if="!confirmDelete"
                @click="confirmDelete = true"
                class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase border border-red-800/60 text-red-400 hover:bg-red-950/50 transition-colors"
              >
                <Trash2 class="w-3 h-3" />
                Eliminar
              </button>
              <div v-else class="flex items-center gap-2">
                <span class="text-[9px] text-red-400 tracking-widest uppercase"
                  >¿Confirmar?</span
                >
                <button
                  @click="deleteLabel"
                  :disabled="deleting"
                  class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase bg-red-700 text-white hover:bg-red-600 disabled:opacity-40 transition-colors"
                >
                  <Loader2 v-if="deleting" class="w-3 h-3 animate-spin" />
                  <Trash2 v-else class="w-3 h-3" />
                  {{ deleting ? "Eliminando…" : "Sí, eliminar" }}
                </button>
                <button
                  @click="confirmDelete = false"
                  class="text-[9px] text-neutral-500 hover:text-white transition-colors tracking-widest uppercase"
                >
                  Cancelar
                </button>
              </div>
            </div>
            <div
              v-if="deleteError"
              class="mt-2 flex items-start gap-2 rounded-md bg-red-950/50 border border-red-800/50 px-3 py-2"
            >
              <AlertTriangle
                class="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5"
              />
              <p class="text-[10px] text-red-400 leading-snug">
                {{ deleteError }}
              </p>
            </div>
          </CardContent>
        </Card>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useChatGPT } from "~/composables/useChatGPT";
import usePocketBaseCore from "~/composables/usePocketBaseCore";
import { useNutritionalLabels } from "~/composables/useNutritionalLabels";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BreezyLabels from "~/components/atoms/BreezyLabels.vue";
// Slim resolver prompt replaces the heavy all-in-one NOM051_COMMAND.
import { NOM051_RESOLVE } from "~/lib/nom051-resolve";
import {
  UtensilsCrossed,
  Sparkles,
  Scale,
  Package,
  AlertTriangle,
  Loader2,
  Trash2,
  ArrowLeft,
  RefreshCw,
} from "lucide-vue-next";

// ── Router ────────────────────────────────────────────────────────────────
const route = useRoute();
const router = useRouter();
const id = route.params.id;

// ── Composables ───────────────────────────────────────────────────────────
const { fetchRecord, updateItem, deleteItem } = usePocketBaseCore();
const { transformRecord, buildRecordFromResolution } = useNutritionalLabels();

// ── Fetch state ───────────────────────────────────────────────────────────
const fetching = ref(true);
const fetchError = ref(null);
const record = ref(null);

// ── Form state ────────────────────────────────────────────────────────────
const recipeName = ref("");
const recipeText = ref("");
const portionSize = ref(150);
const totalSize = ref(300);

// ── Regeneration state ────────────────────────────────────────────────────
const saving = ref(false);
const saveError = ref(null);
const updatedLabelData = ref(null);

const { run, loading, error } = useChatGPT();

// ── Delete state ──────────────────────────────────────────────────────────
const deleting = ref(false);
const deleteError = ref(null);
const confirmDelete = ref(false);

// ── Derived: current label preview ───────────────────────────────────────
// transformRecord handles row generation + vdr just like every other page.
const currentLabelData = computed(() =>
  record.value ? transformRecord(record.value) : {},
);

// ── Load record on mount ──────────────────────────────────────────────────
onMounted(async () => {
  try {
    const fetched = await fetchRecord("labels", id);
    record.value = fetched;
    recipeName.value = fetched.name ?? "";
    recipeText.value = fetched.recipe_text || fetched.ing || "";
    portionSize.value = Number(fetched.portion_size ?? 150);
    totalSize.value = Number(fetched.total_size ?? 300);
  } catch (e) {
    fetchError.value =
      "No se pudo cargar la etiqueta. Verifica que el ID sea correcto.";
    console.error("Fetch error:", e);
  } finally {
    fetching.value = false;
  }
});

// ── Regenerate → update in PocketBase ────────────────────────────────────
async function regenerateLabel() {
  const originalInputText = recipeText.value.trim();
  if (!originalInputText || !recipeName.value.trim()) return;

  saveError.value = null;
  updatedLabelData.value = null;

  // On the edit page both fields always carry a value, so treat them as the
  // explicit user overrides the engine should honor verbatim.
  const activePortion = Number(portionSize.value);
  const activeTotal = Number(totalSize.value);

  const payload = {
    recipeName: recipeName.value.trim(),
    portionGrams: activePortion,
    totalGrams: activeTotal,
    ingredients: originalInputText,
  };

  // 1. LLM RESOLUTION ONLY — maps each line to { key, grams } and writes the
  //    Spanish label texts. No nutrition math comes from the model anymore.
  let resolution;
  try {
    const raw = await run(NOM051_RESOLVE, payload);
    const clean = raw.replace(/```json|```/g, "").trim();
    resolution = JSON.parse(clean);
    // TEMP DEBUG — paste this console output back. Remove once verified.
    console.log("RESOLVED:", JSON.stringify(resolution.resolved, null, 2));
    console.log(
      "LEYENDAS keys:",
      resolution.resolved?.map((r) => r.key),
    );
    if (
      !Array.isArray(resolution.resolved) ||
      resolution.resolved.length === 0
    ) {
      throw new Error("Resolver returned no ingredients");
    }
  } catch (e) {
    console.error("AI resolver parse error:", e);
    saveError.value =
      "Error al analizar la receta con Inteligencia Artificial.";
    return;
  }

  // 2. DETERMINISTIC ENGINE — aggregation, rounding, seals, legends.
  //    User-supplied portion/total are honored verbatim.
  const rawRecord = buildRecordFromResolution(resolution, {
    portionGrams: activePortion,
    totalGrams: activeTotal,
    fallbackName: recipeName.value,
  });
  // Preserve the record id so the update targets the right row.
  rawRecord.id = id;

  // Show immediate visual preview with vdr column populated.
  updatedLabelData.value = transformRecord(rawRecord);

  // 3. Persist to PocketBase. Keep recipe_text so future edits reload the
  //    original input rather than the stripped ingredient list.
  saving.value = true;
  try {
    const updated = await updateItem("labels", id, {
      ...rawRecord,
      recipe_text: originalInputText,
      rows: [],
    });

    // Swap the live record so currentLabelData recomputes via transformRecord.
    record.value = updated;
    updatedLabelData.value = null;
  } catch (e) {
    saveError.value =
      "No se pudo guardar en la base de datos. Revisa la consola.";
    console.error("PocketBase update error:", e);
  } finally {
    saving.value = false;
  }
}

// ── Delete ────────────────────────────────────────────────────────────────
async function deleteLabel() {
  deleting.value = true;
  deleteError.value = null;
  try {
    await deleteItem("labels", id);
    router.push("/label-generator");
  } catch (e) {
    deleteError.value = "No se pudo eliminar la etiqueta. Revisa la consola.";
    console.error("Delete error:", e);
    deleting.value = false;
  }
}

definePageMeta({ layout: "none" });
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap");
</style>
