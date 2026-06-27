<template>
  <Card v-if="hasAny" class="overflow-hidden">
    <CardHeader class="px-4 py-2.5">
      <div class="flex items-center justify-between">
        <div
          class="flex items-center gap-2 text-[10px] text-neutral-400 tracking-widest uppercase font-semibold"
        >
          <Scale class="w-3 h-3" />
          Vista Previa Nutrimental
        </div>
        <span class="text-[9px] text-neutral-600 normal-case tracking-normal">
          se recalcula al cambiar la porción
        </span>
      </div>
    </CardHeader>
    <Separator />
    <CardContent class="px-4 pt-3 pb-4">
      <div
        class="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-2 gap-y-1.5 items-center"
      >
        <span />
        <span
          class="text-[9px] text-neutral-500 uppercase tracking-wider text-right"
          >100 g</span
        >
        <span
          class="text-[9px] text-amber-500/80 uppercase tracking-wider text-right"
        >
          Porción<template v-if="portion"> ({{ portion }}g)</template>
        </span>
        <span
          class="text-[9px] text-neutral-500 uppercase tracking-wider text-right"
        >
          Total<template v-if="total"> ({{ total }}g)</template>
        </span>

        <template v-for="row in rows" :key="row.key">
          <template v-if="row.has">
            <span class="text-[11px] text-neutral-300">{{ row.label }}</span>
            <span class="text-[11px] text-neutral-400 text-right tabular-nums"
              >{{ row.per100Str }} {{ row.unit }}</span
            >
            <span
              class="text-[11px] text-amber-400 text-right tabular-nums font-medium"
            >
              {{ row.perPortionStr
              }}<template v-if="row.perPortionStr !== '—'">
                {{ row.unit }}</template
              >
            </span>
            <span class="text-[11px] text-neutral-400 text-right tabular-nums">
              {{ row.perTotalStr
              }}<template v-if="row.perTotalStr !== '—'">
                {{ row.unit }}</template
              >
            </span>
          </template>
        </template>
      </div>
      <p class="text-[9px] text-neutral-500 leading-relaxed mt-3">
        Los valores por 100 g son la base y no cambian con la porción; solo las
        columnas de porción y total se escalan proporcionalmente.
      </p>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Scale } from "lucide-vue-next";
import { Card, CardContent, CardHeader } from "@common/components/ui/card";
import { Separator } from "@common/components/ui/separator";
import {
  NUTRITION_KEYS,
  type ManualNutrition,
  type NutritionKey,
} from "~/composables/useNutritionalLabels";

const props = defineProps<{
  manualNutrition: ManualNutrition;
  portionSize: number | null;
  totalSize: number | null;
  storedLabel: any | null; // existing record when editing
  isEditMode: boolean;
}>();

const PREVIEW_FIELDS: {
  key: NutritionKey;
  label: string;
  unit: string;
  decimals: number;
}[] = [
  { key: "energia_kcal_100g", label: "Energía", unit: "kcal", decimals: 0 },
  { key: "proteina_g_100g", label: "Proteínas", unit: "g", decimals: 1 },
  {
    key: "grasas_totales_g_100g",
    label: "Grasas totales",
    unit: "g",
    decimals: 1,
  },
  {
    key: "grasas_saturadas_g_100g",
    label: "Grasas saturadas",
    unit: "g",
    decimals: 1,
  },
  {
    key: "azucares_totales_g_100g",
    label: "Azúcares totales",
    unit: "g",
    decimals: 1,
  },
  {
    key: "azucares_anadidos_g_100g",
    label: "Azúcares añadidos",
    unit: "g",
    decimals: 1,
  },
  {
    key: "carbohidratos_disponibles_g_100g",
    label: "Carbohidratos disp.",
    unit: "g",
    decimals: 1,
  },
  { key: "fibra_g_100g", label: "Fibra", unit: "g", decimals: 1 },
  { key: "sodio_mg_100g", label: "Sodio", unit: "mg", decimals: 0 },
];

const effectivePer100g = computed(() => {
  const out = {} as Record<NutritionKey, number | null>;
  for (const key of NUTRITION_KEYS) {
    const manual = props.manualNutrition[key];
    const stored = props.isEditMode ? (props.storedLabel?.[key] ?? null) : null;
    out[key] =
      manual != null ? Number(manual) : stored != null ? Number(stored) : null;
  }
  return out;
});

const scaleStr = (
  base: number | null,
  grams: number | null,
  decimals: number,
) =>
  base == null || grams == null || grams <= 0
    ? "—"
    : ((base * grams) / 100).toFixed(decimals);

const portion = computed(() =>
  props.portionSize && props.portionSize > 0 ? props.portionSize : null,
);
const total = computed(() =>
  props.totalSize && props.totalSize > 0 ? props.totalSize : null,
);
const hasAny = computed(() =>
  NUTRITION_KEYS.some((k) => effectivePer100g.value[k] != null),
);
const rows = computed(() =>
  PREVIEW_FIELDS.map((f) => {
    const base = effectivePer100g.value[f.key];
    return {
      ...f,
      has: base != null,
      per100Str: base == null ? "—" : base.toFixed(f.decimals),
      perPortionStr: scaleStr(base, portion.value, f.decimals),
      perTotalStr: scaleStr(base, total.value, f.decimals),
    };
  }),
);
</script>
