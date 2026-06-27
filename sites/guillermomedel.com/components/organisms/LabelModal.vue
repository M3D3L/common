<template>
  <Modal
    ref="createModal"
    :title="isEditMode ? 'Editar Etiqueta' : 'Generar Nueva Etiqueta'"
    :description="
      isEditMode
        ? 'Modifica los ingredientes, porciones o valores manuales de la etiqueta.'
        : 'Ingresa los ingredientes y el tamaño de porción para generar la etiqueta nutrimental.'
    "
  >
    <div class="space-y-3">
      <Card>
        <CardContent class="pt-4 pb-3 px-4 space-y-1.5">
          <label
            class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold flex items-center gap-1.5"
          >
            <ClipboardList class="w-3 h-3" /> Nombre del Platillo
          </label>
          <Input
            v-model="recipeName"
            placeholder="Ej. Pollo al chipotle con arroz"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-4 pb-3 px-4 space-y-2">
          <label
            class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold flex items-center gap-1.5"
          >
            <Tag class="w-3 h-3" /> Tipo
          </label>
          <div class="flex gap-2">
            <button
              v-for="opt in typeOptions"
              :key="opt.value"
              @click="selectedType = opt.value"
              :class="[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors',
                selectedType === opt.value
                  ? 'bg-amber-400/10 border-amber-500 text-amber-400 font-medium'
                  : 'border-neutral-700 text-neutral-400',
              ]"
            >
              <component :is="opt.icon" class="w-3 h-3" />
              {{ opt.label }}
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-4 pb-3 px-4 space-y-1.5">
          <label
            class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold flex items-center gap-1.5"
          >
            <ListChecks class="w-3 h-3" /> Ingredientes y Proporciones
          </label>
          <Textarea
            v-model="recipeText"
            placeholder="Ej.&#10;200 g pechuga de pollo&#10;80 g arroz blanco cocido&#10;30 g chile chipotle en adobo&#10;15 ml aceite de oliva&#10;..."
            rows="6"
            class="resize-none"
          />
        </CardContent>
      </Card>

      <div class="grid grid-cols-2 gap-3">
        <Card>
          <CardContent class="pt-4 pb-3 px-4 space-y-1.5">
            <label
              class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold flex items-center gap-1"
            >
              <Scale class="w-3 h-3" />
              Porción (g)
              <span
                class="text-neutral-600 normal-case tracking-normal font-normal ml-0.5"
                >· auto</span
              >
            </label>
            <Input
              v-model.number="portionSize"
              type="number"
              min="10"
              max="1000"
              placeholder="Auto"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent class="pt-4 pb-3 px-4 space-y-1.5">
            <label
              class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold flex items-center gap-1"
            >
              <Package class="w-3 h-3" />
              Total (g)
              <span
                class="text-neutral-600 normal-case tracking-normal font-normal ml-0.5"
                >· auto</span
              >
            </label>
            <Input
              v-model.number="totalSize"
              type="number"
              min="10"
              max="10000"
              placeholder="Auto"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent class="pt-4 pb-3 px-4 space-y-2">
          <label
            class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold flex items-center gap-1.5"
          >
            <CalendarClock class="w-3 h-3" />
            Fecha de Caducidad
            <span
              class="text-neutral-600 normal-case tracking-normal font-normal"
              >· opcional</span
            >
          </label>

          <div class="grid grid-cols-3 gap-1.5">
            <button
              v-for="opt in expirationOptions"
              :key="opt.value"
              @click="setExpirationPreset(opt.value)"
              :class="[
                'text-[11px] py-1.5 px-2 rounded-md border transition-colors text-center',
                expirationPreset === opt.value
                  ? 'bg-amber-400/10 border-amber-500 text-amber-400 font-medium'
                  : 'border-neutral-700 text-neutral-400',
              ]"
            >
              {{ opt.label }}
            </button>
            <button
              @click="setExpirationPreset('custom')"
              :class="[
                'text-[11px] py-1.5 px-2 rounded-md border transition-colors text-center',
                expirationPreset === 'custom'
                  ? 'bg-amber-400/10 border-amber-500 text-amber-400 font-medium'
                  : 'border-neutral-700 text-neutral-400',
              ]"
            >
              Personalizada…
            </button>
          </div>

          <div
            v-if="expirationDate && expirationPreset !== 'custom'"
            class="flex items-center gap-1.5"
          >
            <Badge
              variant="outline"
              class="border-amber-700 text-amber-400 bg-amber-400/5 text-[11px] px-2 py-0.5 font-normal"
            >
              <CalendarClock class="w-2.5 h-2.5 mr-1" />
              {{ expirationDate }}
            </Badge>
            <button @click="clearExpiration" class="text-neutral-600">
              <X class="w-3 h-3" />
            </button>
          </div>

          <div v-if="expirationPreset === 'custom'" class="space-y-1">
            <div class="relative">
              <CalendarClock
                class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500"
              />
              <Input
                v-model="expirationDate"
                type="text"
                placeholder="DD/MM/AAAA"
                maxlength="10"
                @input="formatExpirationDate"
                class="pl-7"
                :class="
                  expirationDateError
                    ? 'border-red-700 focus:border-red-500'
                    : ''
                "
              />
            </div>
            <p v-if="expirationDateError" class="text-[9px] text-red-400">
              {{ expirationDateError }}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card class="overflow-hidden">
        <CardHeader
          class="px-4 py-2.5 cursor-pointer"
          @click="showManualNutrition = !showManualNutrition"
        >
          <div class="flex items-center justify-between">
            <div
              class="flex items-center gap-2 text-[10px] text-neutral-400 tracking-widest uppercase font-semibold"
            >
              <FlaskConical class="w-3 h-3" />
              Valores Nutricionales Manuales
              <span
                class="text-neutral-600 normal-case tracking-normal font-normal"
                >· opcional, por 100 g</span
              >
            </div>
            <ChevronDown
              class="w-3.5 h-3.5 text-neutral-500 transition-transform"
              :class="showManualNutrition ? 'rotate-180' : ''"
            />
          </div>
        </CardHeader>

        <template v-if="showManualNutrition">
          <Separator />
          <CardContent class="px-4 pt-3 pb-4 space-y-3">
            <p class="text-[9px] text-neutral-500 leading-relaxed">
              Si ingresas valores aquí, tienen prioridad sobre los calculados
              por IA. Deja en blanco los que quieras calcular automáticamente.
            </p>

            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label
                  class="text-[9px] text-neutral-500 uppercase tracking-wider"
                  >Energía (kcal)</label
                >
                <Input
                  v-model.number="manualNutrition.energia_kcal_100g"
                  type="number"
                  min="0"
                  placeholder="Auto"
                  class="h-7"
                />
              </div>
              <div class="space-y-1">
                <label
                  class="text-[9px] text-neutral-500 uppercase tracking-wider"
                  >Energía (kJ)</label
                >
                <Input
                  v-model.number="manualNutrition.energia_kj_100g"
                  type="number"
                  min="0"
                  placeholder="Auto"
                  class="h-7"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div class="space-y-1">
                <label
                  class="text-[9px] text-neutral-500 uppercase tracking-wider"
                  >Proteína (g)</label
                >
                <Input
                  v-model.number="manualNutrition.proteina_g_100g"
                  type="number"
                  min="0"
                  placeholder="Auto"
                  class="h-7"
                />
              </div>
              <div class="space-y-1">
                <label
                  class="text-[9px] text-neutral-500 uppercase tracking-wider"
                  >Grasas Tot. (g)</label
                >
                <Input
                  v-model.number="manualNutrition.grasas_totales_g_100g"
                  type="number"
                  min="0"
                  placeholder="Auto"
                  class="h-7"
                />
              </div>
              <div class="space-y-1">
                <label
                  class="text-[9px] text-neutral-500 uppercase tracking-wider"
                  >Carbs. Disp. (g)</label
                >
                <Input
                  v-model.number="
                    manualNutrition.carbohidratos_disponibles_g_100g
                  "
                  type="number"
                  min="0"
                  placeholder="Auto"
                  class="h-7"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label
                  class="text-[9px] text-neutral-500 uppercase tracking-wider"
                  >Grasas Sat. (g)</label
                >
                <Input
                  v-model.number="manualNutrition.grasas_saturadas_g_100g"
                  type="number"
                  min="0"
                  placeholder="Auto"
                  class="h-7"
                />
              </div>
              <div class="space-y-1">
                <label
                  class="text-[9px] text-neutral-500 uppercase tracking-wider"
                  >Grasas Trans (g)</label
                >
                <Input
                  v-model.number="manualNutrition.grasas_trans_g_100g"
                  type="number"
                  min="0"
                  placeholder="Auto"
                  class="h-7"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div class="space-y-1">
                <label
                  class="text-[9px] text-neutral-500 uppercase tracking-wider"
                  >Azúcares Tot. (g)</label
                >
                <Input
                  v-model.number="manualNutrition.azucares_totales_g_100g"
                  type="number"
                  min="0"
                  placeholder="Auto"
                  class="h-7"
                />
              </div>
              <div class="space-y-1">
                <label
                  class="text-[9px] text-neutral-500 uppercase tracking-wider"
                  >Azúcares Añad. (g)</label
                >
                <Input
                  v-model.number="manualNutrition.azucares_anadidos_g_100g"
                  type="number"
                  min="0"
                  placeholder="Auto"
                  class="h-7"
                />
              </div>
              <div class="space-y-1">
                <label
                  class="text-[9px] text-neutral-500 uppercase tracking-wider"
                  >Fibra (g)</label
                >
                <Input
                  v-model.number="manualNutrition.fibra_g_100g"
                  type="number"
                  min="0"
                  placeholder="Auto"
                  class="h-7"
                />
              </div>
            </div>

            <div class="space-y-1 max-w-[50%]">
              <label
                class="text-[9px] text-neutral-500 uppercase tracking-wider"
                >Sodio (mg)</label
              >
              <Input
                v-model.number="manualNutrition.sodio_mg_100g"
                type="number"
                min="0"
                placeholder="Auto"
                class="h-7"
              />
            </div>
          </CardContent>
        </template>
      </Card>

      <Button
        class="w-full text-[10px] tracking-widest uppercase"
        @click="processLabel"
        :disabled="isLoading || !recipeText.trim() || !recipeName.trim()"
      >
        <Loader2 v-if="isLoading" class="w-3.5 h-3.5 animate-spin" />
        <Sparkles v-else class="w-3.5 h-3.5" />
        {{ buttonLabel }}
      </Button>

      <div
        v-if="error || saveError"
        class="flex items-start gap-2 rounded-md bg-red-950/50 border border-red-800/50 px-3 py-2"
      >
        <AlertTriangle class="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
        <p class="text-[10px] text-red-400 leading-snug">
          {{ error || saveError }}
        </p>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from "@common/components/ui/modal/Modal.vue";
import { useChatGPT } from "@common/composables/useChatGPT";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import { Input } from "@common/components/ui/input";
import { Textarea } from "@common/components/ui/textarea";
import { Badge } from "@common/components/ui/badge";
import { Separator } from "@common/components/ui/separator";
import { Card, CardContent, CardHeader } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import {
  Scale,
  Package,
  AlertTriangle,
  Loader2,
  CalendarClock,
  ChevronDown,
  Sparkles,
  ClipboardList,
  ListChecks,
  Tag,
  Utensils,
  Cookie,
  Coffee,
  FlaskConical,
  X,
} from "lucide-vue-next";
import { useNutritionalLabels } from "~/composables/useNutritionalLabels";
import { NOM051_RESOLVE } from "~/lib/nom051-resolve";
import type { ResolveResult } from "~/composables/useNutritionalLabels";

// ─── Define Props ────────────────────────────────────────────────────────────
const props = defineProps<{
  selectedLabel: any | null;
  type: "create" | "edit";
}>();

// ─── Emits ────────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  created: [entry: any];
  updated: [entry: any];
}>();

// ─── Composables ─────────────────────────────────────────────────────────────
const { createItem, updateItem } = usePocketBaseCore();
const { transformRecord, buildRecordFromResolution } = useNutritionalLabels();
const { run, loading, error } = useChatGPT();

// ─── Refs ─────────────────────────────────────────────────────────────────────
const createModal = ref<InstanceType<typeof Modal> | null>(null);
const recipeName = ref("");
const recipeText = ref("");
const portionSize = ref<number | null>(null);
const totalSize = ref<number | null>(null);
const selectedType = ref<"snack" | "meal" | "drink" | "">("");
const expirationPreset = ref<string>("");
const expirationDate = ref<string>("");
const expirationDateError = ref<string | null>(null);
const saving = ref(false);
const saveError = ref<string | null>(null);
const showManualNutrition = ref(false);

const emptyManualNutrition = () => ({
  energia_kcal_100g: null as number | null,
  energia_kj_100g: null as number | null,
  proteina_g_100g: null as number | null,
  grasas_totales_g_100g: null as number | null,
  grasas_saturadas_g_100g: null as number | null,
  grasas_trans_g_100g: null as number | null,
  carbohidratos_disponibles_g_100g: null as number | null,
  azucares_totales_g_100g: null as number | null,
  azucares_anadidos_g_100g: null as number | null,
  fibra_g_100g: null as number | null,
  sodio_mg_100g: null as number | null,
});
const manualNutrition = ref(emptyManualNutrition());

// ─── Computed Mode Detection ─────────────────────────────────────────────────
const isEditMode = computed(
  () => props.type === "edit" && !!props.selectedLabel,
);
const isLoading = computed(() => loading.value || saving.value);

const buttonLabel = computed(() => {
  if (loading.value) return "Analizando…";
  if (saving.value) return "Guardando…";
  return isEditMode.value ? "Guardar Cambios" : "Generar Etiqueta";
});

// ─── Type options ─────────────────────────────────────────────────────────────
const typeOptions = [
  { value: "meal", label: "Comida", icon: Utensils },
  { value: "snack", label: "Snack", icon: Cookie },
  { value: "drink", label: "Bebida", icon: Coffee },
] as const;

// ─── Expiration options ───────────────────────────────────────────────────────
const expirationOptions = [
  { value: "1w", label: "1 semana" },
  { value: "2w", label: "2 semanas" },
  { value: "1m", label: "1 mes" },
  { value: "3m", label: "3 meses" },
  { value: "6m", label: "6 meses" },
  { value: "1y", label: "1 año" },
];

// ─── Public API ───────────────────────────────────────────────────────────────
function open() {
  saveError.value = null;
  expirationDateError.value = null;

  if (isEditMode.value && props.selectedLabel) {
    // Populate with existing data for editing
    recipeName.value = props.selectedLabel.name || "";
    recipeText.value = props.selectedLabel.ing || "";
    portionSize.value = props.selectedLabel.portion_size ?? null;
    totalSize.value = props.selectedLabel.total_size ?? null;
    selectedType.value = props.selectedLabel.type || "";
    expirationDate.value = props.selectedLabel.expiration || "";
    expirationPreset.value = props.selectedLabel.expiration ? "custom" : "";
    showManualNutrition.value = true; // Show manual context to reflect DB inputs

    // Map DB values back to the manual nutrition object fields
    manualNutrition.value = {
      energia_kcal_100g: props.selectedLabel.energia_kcal_100g ?? null,
      energia_kj_100g: props.selectedLabel.energia_kj_100g ?? null,
      proteina_g_100g: props.selectedLabel.proteina_g_100g ?? null,
      grasas_totales_g_100g: props.selectedLabel.grasas_totales_g_100g ?? null,
      grasas_saturadas_g_100g:
        props.selectedLabel.grasas_saturadas_g_100g ?? null,
      grasas_trans_g_100g: props.selectedLabel.grasas_trans_g_100g ?? null,
      carbohidratos_disponibles_g_100g:
        props.selectedLabel.carbohidratos_disponibles_g_100g ?? null,
      azucares_totales_g_100g:
        props.selectedLabel.azucares_totales_g_100g ?? null,
      azucares_anadidos_g_100g:
        props.selectedLabel.azucares_anadidos_g_100g ?? null,
      fibra_g_100g: props.selectedLabel.fibra_g_100g ?? null,
      sodio_mg_100g: props.selectedLabel.sodio_mg_100g ?? null,
    };
  } else {
    // Reset fields for creation mode
    recipeName.value = "";
    recipeText.value = "";
    portionSize.value = null;
    totalSize.value = null;
    selectedType.value = "";
    expirationPreset.value = "";
    expirationDate.value = "";
    showManualNutrition.value = false;
    manualNutrition.value = emptyManualNutrition();
  }

  createModal.value?.toggleModal(true);
}

defineExpose({ open });

// ─── Expiration helpers ───────────────────────────────────────────────────────
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
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function setExpirationPreset(value: string) {
  expirationPreset.value = value;
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
  if (value in presetMap) expirationDate.value = fmtDate(presetMap[value]);
}

function clearExpiration() {
  expirationPreset.value = "";
  expirationDate.value = "";
  expirationDateError.value = null;
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

// ─── Core Logic Processing ────────────────────────────────────────────────────
async function processLabel() {
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

  const aiOverride = resolution.nutrition_override ?? {};
  const mergedOverride: Record<string, number | null> = {};
  const nutritionKeys = [
    "energia_kcal_100g",
    "energia_kj_100g",
    "proteina_g_100g",
    "grasas_totales_g_100g",
    "grasas_saturadas_g_100g",
    "grasas_trans_g_100g",
    "carbohidratos_disponibles_g_100g",
    "azucares_totales_g_100g",
    "azucares_anadidos_g_100g",
    "fibra_g_100g",
    "sodio_mg_100g",
  ] as const;

  for (const key of nutritionKeys) {
    const manualVal = manualNutrition.value[key];
    mergedOverride[key] =
      manualVal !== null && manualVal !== undefined
        ? manualVal
        : (aiOverride[key] ?? null);
  }
  resolution.nutrition_override = mergedOverride as any;

  const rawRecord = buildRecordFromResolution(resolution, {
    portionGrams: hasPortion ? Number(portionSize.value) : null,
    totalGrams: hasTotal ? Number(totalSize.value) : null,
    fallbackName: recipeName.value,
  });

  const entry = {
    ...transformRecord(rawRecord),
    pbId: isEditMode.value ? props.selectedLabel.id : null,
    expiration_date: hasExpiration ? expirationDate.value : null,
    type: selectedType.value || null,
  };

  emit(isEditMode.value ? "updated" : "created", entry);
  createModal.value?.toggleModal(false);

  saving.value = true;
  try {
    const recordPayload = {
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
      rows: entry.rows || [],
    };

    if (isEditMode.value) {
      await updateItem("labels", props.selectedLabel.id, recordPayload);
    } else {
      await createItem("labels", recordPayload);
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
</script>
