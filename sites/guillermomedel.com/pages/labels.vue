<template>
  <section>
    <SeoMeta :follow="false" />
    <div class="no-print text-center mb-5">
      <h1 class="font-black text-lg tracking-[0.2em] uppercase mb-0.5 mt-8">
        Breezy Meals
      </h1>
      <p class="text-neutral-500 text-[8px] tracking-widest uppercase">
        Nutritional Labels
      </p>

      <div class="mt-4 flex justify-center gap-2">
        <Button variant="outline" size="sm" @click="openCreateModal">
          <UtensilsCrossed class="w-4 h-4 mr-2" />
          Generar nueva etiqueta
        </Button>

        <Button variant="secondary" size="sm" @click="toggleLabelType">
          <Layers class="w-4 h-4 mr-2" />
          {{ labelType === "round" ? "Ver Estándar" : "Ver Redonda" }}
        </Button>
      </div>
    </div>

    <!-- Labels Grid/List -->
    <div
      v-if="labelType === 'round'"
      class="flex flex-wrap gap-6 container mx-auto"
    >
      <div
        v-for="(label, index) in labelData"
        :key="label.id || index"
        class="mb-4"
      >
        <OrganismsRoundGrid :labelData="[label]" />
      </div>
    </div>
    <div v-else class="flex flex-wrap gap-6 container mx-auto">
      <div
        v-for="(label, index) in labelData"
        :key="label.id || index"
        class="mb-4"
      >
        <OrganismsLabelGrid :labelData="[label]" />
      </div>
    </div>

    <!-- Create Label Modal -->
    <Modal
      ref="createModal"
      title="Generar Nueva Etiqueta"
      description="Ingresa los ingredientes y el tamaño de porción para generar la etiqueta nutritional."
    >
      <div class="space-y-4">
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

          <div class="space-y-1.5 flex-1">
            <label
              class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold"
            >
              Fecha de Caducidad
              <span class="text-neutral-600 normal-case tracking-normal"
                >· opcional</span
              >
            </label>
            <div class="relative">
              <CalendarClock
                class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500 z-10 pointer-events-none"
              />
              <ChevronDown
                class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500 z-10 pointer-events-none"
              />
              <select
                v-model="expirationPreset"
                @change="handlePresetChange"
                class="w-full appearance-none bg-neutral-800 border border-neutral-700 rounded-md text-xs pl-7 pr-7 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-colors"
                :class="
                  expirationPreset === '' ? 'text-neutral-600' : 'text-white'
                "
              >
                <option value="">Sin fecha de caducidad</option>
                <option value="1w">1 semana</option>
                <option value="2w">2 semanas</option>
                <option value="1m">1 mes</option>
                <option value="3m">3 meses</option>
                <option value="6m">6 meses</option>
                <option value="1y">1 año</option>
                <option value="custom">Personalizada…</option>
              </select>
            </div>

            <div v-if="expirationPreset === 'custom'" class="relative mt-2">
              <CalendarClock
                class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500"
              />
              <Input
                v-model="expirationDate"
                type="text"
                placeholder="DD/MM/AAAA"
                maxlength="10"
                @input="formatExpirationDate"
                class="bg-neutral-800 border-neutral-700 text-white text-xs pl-7 placeholder:text-neutral-600 focus:border-amber-500 focus:ring-amber-500/20"
                :class="
                  expirationDateError
                    ? 'border-red-700 focus:border-red-500'
                    : ''
                "
              />
              <p
                v-if="expirationDateError"
                class="text-[9px] text-red-400 mt-1"
              >
                {{ expirationDateError }}
              </p>
            </div>
          </div>
        </div>

        <button
          @click="generateLabel"
          :disabled="
            loading || saving || !recipeText.trim() || !recipeName.trim()
          "
          class="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all bg-amber-400 text-neutral-900 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
        >
          <Loader2 v-if="loading || saving" class="w-3.5 h-3.5 animate-spin" />
          <Sparkles v-else class="w-3.5 h-3.5" />
          {{
            loading ? "Analizando…" : saving ? "Guardando…" : "Generar Etiqueta"
          }}
        </button>

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
      </div>
    </Modal>
  </section>
</template>

<script lang="ts" setup>
import Modal from "@common/components/ui/modal/Modal.vue";
import { useNutritionalLabels } from "~/composables/useNutritionalLabels";
import { useChatGPT } from "@common/composables/useChatGPT";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Textarea } from "@common/components/ui/textarea";
import {
  UtensilsCrossed,
  Layers,
  Scale,
  Package,
  AlertTriangle,
  Loader2,
  CalendarClock,
  ChevronDown,
  Sparkles,
} from "lucide-vue-next";
import { NOM051_RESOLVE } from "~/lib/nom051-resolve";
import type { ResolveResult } from "~/composables/useNutritionalLabels";
definePageMeta({
  layout: "none",
});

const router = useRouter();
const { fetchCollection, createItem } = usePocketBaseCore();
const { transformRecord, buildRecordFromResolution } = useNutritionalLabels();
const { run, loading, error } = useChatGPT();

// State
const labelData = ref<any[]>([]);
const labelType = ref<"round" | "standard">("round");

// Form State
const recipeName = ref("");
const recipeText = ref("");
const portionSize = ref<number | null>(null);
const totalSize = ref<number | null>(null);
const expirationPreset = ref<string>("");
const expirationDate = ref<string>("");
const expirationDateError = ref<string | null>(null);
const saving = ref(false);
const saveError = ref<string | null>(null);
const createModal = ref<InstanceType<typeof Modal> | null>(null);

// Modal methods
const openCreateModal = () => {
  // Reset form
  recipeName.value = "";
  recipeText.value = "";
  portionSize.value = null;
  totalSize.value = null;
  expirationPreset.value = "";
  expirationDate.value = "";
  expirationDateError.value = null;
  saveError.value = null;
  createModal.value?.toggleModal(true);
};

const toggleLabelType = () => {
  labelType.value = labelType.value === "round" ? "standard" : "round";
};

// Expiration helpers
function addDays(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}
function addMonths(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d;
}
function addYears(n: number): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() + n);
  return d;
}
function fmtDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function handlePresetChange() {
  expirationDate.value = "";
  expirationDateError.value = null;

  const presetMap: Record<string, Date> = {
    "1w": addDays(7),
    "2w": addDays(14),
    "1m": addMonths(1),
    "3m": addMonths(3),
    "6m": addMonths(6),
    "1y": addYears(1),
  };

  if (expirationPreset.value in presetMap) {
    expirationDate.value = fmtDate(presetMap[expirationPreset.value]);
  }
}

function formatExpirationDate(e: Event) {
  const input = e.target as HTMLInputElement;
  let digits = input.value.replace(/\D/g, "").slice(0, 8);
  let formatted = digits;
  if (digits.length > 2) formatted = digits.slice(0, 2) + "/" + digits.slice(2);
  if (digits.length > 4)
    formatted = formatted.slice(0, 5) + "/" + formatted.slice(5);
  expirationDate.value = formatted;
  expirationDateError.value = null;
}

function validateExpirationDate(): boolean {
  const val = expirationDate.value.trim();
  if (!val) return true;
  const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    expirationDateError.value = "Formato inválido. Usa DD/MM/AAAA.";
    return false;
  }
  const [, dd, mm, yyyy] = match;
  const date = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
  if (
    isNaN(date.getTime()) ||
    date.getUTCDate() !== Number(dd) ||
    date.getUTCMonth() + 1 !== Number(mm)
  ) {
    expirationDateError.value = "Fecha inválida.";
    return false;
  }
  expirationDateError.value = null;
  return true;
}

// Generate Label
async function generateLabel() {
  if (!recipeText.value.trim() || !recipeName.value.trim()) return;
  if (!validateExpirationDate()) return;
  saveError.value = null;

  const hasPortion = portionSize.value != null && Number(portionSize.value) > 0;
  const hasTotal = totalSize.value != null && Number(totalSize.value) > 0;
  const hasExpiration = expirationDate.value.trim() !== "";

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
    ) {
      throw new Error("Resolver returned no ingredients");
    }
  } catch (e) {
    console.error("AI resolver parse error:", e);
    saveError.value = "No se pudo interpretar la receta. Revisa la consola.";
    return;
  }

  const rawRecord = buildRecordFromResolution(resolution, {
    portionGrams: hasPortion ? Number(portionSize.value) : null,
    totalGrams: hasTotal ? Number(totalSize.value) : null,
    fallbackName: recipeName.value,
  });

  const entry = {
    ...transformRecord(rawRecord),
    pbId: null as string | null,
    expiration_date: hasExpiration ? expirationDate.value : null,
  };

  // Add to beginning of list
  labelData.value.unshift(entry);

  // Close modal
  createModal.value?.toggleModal(false);

  // Reset form
  recipeName.value = "";
  recipeText.value = "";
  portionSize.value = null;
  totalSize.value = null;
  expirationPreset.value = "";
  expirationDate.value = "";
  expirationDateError.value = null;

  // Persist to PocketBase
  saving.value = true;
  try {
    await createItem("labels", {
      name: entry.name,
      sub: entry.sub,
      ing: entry.ing,
      alg: entry.alg,
      pair: entry.pair,
      portion_size: entry.portion_size,
      total_size: entry.total_size,
      nameSize: entry.nameSize,
      expiration: entry.expiration_date,
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
  } catch (e) {
    saveError.value =
      "No se pudo guardar en la base de datos. Revisa la consola.";
    console.error("PocketBase write error:", e);
  } finally {
    saving.value = false;
    // Refresh the page
    location.reload();
  }
}

// Fetch labels
const fetchLabels = async () => {
  try {
    const result = await fetchCollection(
      "labels",
      1,
      200,
      "",
      "-created",
      "",
      null,
      true,
    );

    labelData.value = (result?.items ?? []).map(transformRecord);
  } catch (error) {
    console.error("Error fetching labels:", error);
    labelData.value = [];
  }
};

onMounted(() => {
  fetchLabels();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap");
</style>
