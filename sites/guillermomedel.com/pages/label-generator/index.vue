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
    </div>

    <div class="max-w-2xl mx-auto mb-6">
      <button
        @click="router.push('/labels')"
        class="text-[9px] text-neutral-600 hover:text-amber-400 transition-colors tracking-widest uppercase flex items-center gap-1"
      >
        <Package class="w-3.5 h-3.5" />
        Ver todas las etiquetas
      </button>
    </div>

    <div class="max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle
            class="text-sm tracking-widest uppercase flex items-center gap-2"
          >
            <UtensilsCrossed class="w-4 h-4 text-amber-400" />
            Nueva Receta
          </CardTitle>
          <CardDescription class="text-neutral-500 text-[10px]">
            Ingresa los ingredientes y el tamaño de porción para generar la
            etiqueta nutritional.
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
                <span class="text-neutral-600 normal-case tracking-normal"
                  >· auto</span
                >
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
                  placeholder="Auto"
                  class="bg-neutral-800 border-neutral-700 text-white text-xs pl-7 placeholder:text-neutral-600 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div class="space-y-1.5 w-36">
              <label
                class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold"
              >
                Total (g)
                <span class="text-neutral-600 normal-case tracking-normal"
                  >· auto</span
                >
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
                  placeholder="Auto"
                  class="bg-neutral-800 border-neutral-700 text-white text-xs pl-7 placeholder:text-neutral-600 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <button
              @click="generateLabel"
              :disabled="
                loading || saving || !recipeText.trim() || !recipeName.trim()
              "
              class="flex-1 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all bg-amber-400 text-neutral-900 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
            >
              <Loader2
                v-if="loading || saving"
                class="w-3.5 h-3.5 animate-spin"
              />
              <Sparkles v-else class="w-3.5 h-3.5" />
              {{
                loading
                  ? "Analizando…"
                  : saving
                    ? "Guardando…"
                    : "Generar Etiqueta"
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

      <div v-if="generatedLabels.length > 0" class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <Package class="w-3.5 h-3.5 text-neutral-500" />
            <span
              class="text-[9px] text-neutral-500 tracking-widest uppercase font-semibold"
            >
              {{ generatedLabels.length }} etiqueta{{
                generatedLabels.length !== 1 ? "s" : ""
              }}
              generada{{ generatedLabels.length !== 1 ? "s" : "" }}
            </span>
          </div>
          <button
            @click="clearAll"
            class="text-[9px] text-neutral-600 hover:text-red-400 transition-colors tracking-widest uppercase"
          >
            Limpiar todo
          </button>
        </div>

        <template v-if="generatedLabels.length > 0">
          <BreezyLabels
            v-for="(item, i) in generatedLabels"
            :key="item.pbId || i"
            :labelData="[item]"
          />
        </template>
      </div>

      <div v-else-if="!loading" class="text-center py-16 text-neutral-700">
        <UtensilsCrossed class="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p class="text-[10px] tracking-widest uppercase">
          Ninguna etiqueta generada aún
        </p>
        <p class="text-[9px] mt-1 text-neutral-800">
          Ingresa una receta arriba para empezar
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatGPT } from "@common/composables/useChatGPT";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import {
  useNutritionalLabels,
  type ResolveResult,
} from "~/composables/useNutritionalLabels";
import { NOM051_RESOLVE } from "~/lib/nom051-resolve";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";
import { Input } from "@common/components/ui/input";
import { Textarea } from "@common/components/ui/textarea";
import BreezyLabels from "~/components/atoms/BreezyLabels.vue";
import {
  UtensilsCrossed,
  Sparkles,
  Scale,
  Package,
  AlertTriangle,
  Loader2,
} from "lucide-vue-next";

// ── State ──────────────────────────────────────────────────────────────────
const router = useRouter();
const recipeName = ref("");
const recipeText = ref("");
// Default to null so a blank field means "derive it from the recipe".
const portionSize = ref<number | null>(null);
const totalSize = ref<number | null>(null);
const generatedLabels = ref<any[]>([]);

const saving = ref(false);
const saveError = ref<string | null>(null);

const { run, loading, error } = useChatGPT();
const { createItem } = usePocketBaseCore();
const { transformRecord, buildRecordFromResolution } = useNutritionalLabels();

// ── Generate + Save Pipeline ──────────────────────────────────────────────
async function generateLabel() {
  if (!recipeText.value.trim() || !recipeName.value.trim()) return;
  saveError.value = null;

  // Blank / non-positive input = let the engine derive it from the recipe.
  const hasPortion = portionSize.value != null && Number(portionSize.value) > 0;
  const hasTotal = totalSize.value != null && Number(totalSize.value) > 0;

  const payload = {
    recipeName: recipeName.value.trim(),
    portionGrams: hasPortion ? portionSize.value : null,
    totalGrams: hasTotal ? totalSize.value : null,
    ingredients: recipeText.value.trim(),
  };

  // 1. LLM RESOLUTION ONLY — maps each line to { key, grams } and writes the
  //    Spanish label texts. No nutrition math comes from the model anymore.
  let resolution: ResolveResult;
  try {
    const raw = await run(NOM051_RESOLVE, payload);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    resolution = JSON.parse(cleaned);
    if (
      !Array.isArray(resolution.resolved) ||
      resolution.resolved.length === 0
    ) {
      throw new Error("Resolver returned no ingredients");
    }
  } catch (e) {
    console.error("AI resolver parse error:", e);
    saveError.value = "No se pudo interpretar la receta. Revisa la consola.";
    return;
  }

  // 2. DETERMINISTIC ENGINE — all aggregation, rounding, seals, legends, and
  //    portion/total resolution happen on the frontend. User-supplied
  //    portion/total override the engine's auto values.
  const rawRecord = buildRecordFromResolution(resolution, {
    portionGrams: hasPortion ? Number(portionSize.value) : null,
    totalGrams: hasTotal ? Number(totalSize.value) : null,
    fallbackName: recipeName.value,
  });

  // 3. Build display rows via the shared transformer (single rounding site).
  const entry = { ...transformRecord(rawRecord), pbId: null as string | null };

  // 4. Push to top of list immediately (optimistic).
  generatedLabels.value.unshift(entry);

  // Reset form.
  recipeName.value = "";
  recipeText.value = "";
  portionSize.value = null;
  totalSize.value = null;

  // 5. Persist to PocketBase (unchanged shape; values now come from the engine).
  saving.value = true;
  try {
    const record = await createItem("labels", {
      name: entry.name,
      sub: entry.sub,
      ing: entry.ing,
      alg: entry.alg,
      pair: entry.pair,
      portion_size: entry.portion_size,
      total_size: entry.total_size,
      nameSize: entry.nameSize,
      seals: entry.seals,
      leyendas: entry.leyendas,
      energia_kcal_100g: rawRecord.energia_kcal_100g,
      energia_kj_100g: rawRecord.energia_kj_100g,
      proteina_g_100g: rawRecord.proteina_g_100g,
      grasas_totales_g_100g: rawRecord.grasas_totales_g_100g,
      grasas_saturadas_g_100g: rawRecord.grasas_saturadas_g_100g,
      grasas_trans_g_100g: rawRecord.grasas_trans_g_100g,
      carbohidratos_disponibles_g_100g:
        rawRecord.carbohidratos_disponibles_g_100g,
      azucares_totales_g_100g: rawRecord.azucares_totales_g_100g,
      azucares_anadidos_g_100g: rawRecord.azucares_anadidos_g_100g,
      fibra_g_100g: rawRecord.fibra_g_100g,
      sodio_mg_100g: rawRecord.sodio_mg_100g,
      rows: [],
    });

    entry.pbId = record.id;
  } catch (e) {
    saveError.value =
      "No se pudo guardar en la base de datos. Revisa la consola.";
    console.error("PocketBase write transactional breakdown:", e);
  } finally {
    saving.value = false;
  }
}

function clearAll() {
  generatedLabels.value = [];
}

definePageMeta({ layout: "none" });
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap");
</style>
