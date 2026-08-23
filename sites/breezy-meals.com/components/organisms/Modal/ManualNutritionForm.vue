<template>
  <Card class="overflow-hidden">
    <CardHeader class="px-4 py-2.5 cursor-pointer" @click="emit('toggle')">
      <div class="flex items-center justify-between">
        <div
          class="flex items-center gap-2 text-[10px] text-neutral-400 tracking-widest uppercase font-semibold"
        >
          <FlaskConical class="w-3 h-3" />
          Valores Nutricionales Manuales
          <span class="text-neutral-600 normal-case tracking-normal font-normal"
            >· opcional, por 100 g</span
          >
        </div>
        <ChevronDown
          class="w-3.5 h-3.5 text-neutral-500 transition-transform"
          :class="open ? 'rotate-180' : ''"
        />
      </div>
    </CardHeader>

    <template v-if="open">
      <Separator />
      <CardContent class="px-4 pt-3 pb-4 space-y-3">
        <p class="text-[9px] text-neutral-500 leading-relaxed">
          Si ingresas valores aquí, tienen prioridad sobre los calculados por
          IA. Deja en blanco los que quieras calcular automáticamente.
        </p>

        <div class="grid grid-cols-2 gap-2">
          <NutritionField
            label="Energía (kcal)"
            v-model="local.energia_kcal_100g"
          />
          <NutritionField
            label="Energía (kJ)"
            v-model="local.energia_kj_100g"
          />
        </div>

        <div class="grid grid-cols-3 gap-2">
          <NutritionField
            label="Proteína (g)"
            v-model="local.proteina_g_100g"
          />
          <NutritionField
            label="Grasas Tot. (g)"
            v-model="local.grasas_totales_g_100g"
          />
          <NutritionField
            label="Carbs. Disp. (g)"
            v-model="local.carbohidratos_disponibles_g_100g"
          />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <NutritionField
            label="Grasas Sat. (g)"
            v-model="local.grasas_saturadas_g_100g"
          />
          <NutritionField
            label="Grasas Trans (g)"
            v-model="local.grasas_trans_g_100g"
          />
        </div>

        <div class="grid grid-cols-3 gap-2">
          <NutritionField
            label="Azúcares Tot. (g)"
            v-model="local.azucares_totales_g_100g"
          />
          <NutritionField
            label="Azúcares Añad. (g)"
            v-model="local.azucares_anadidos_g_100g"
          />
          <NutritionField label="Fibra (g)" v-model="local.fibra_g_100g" />
        </div>

        <div class="max-w-[50%]">
          <NutritionField label="Sodio (mg)" v-model="local.sodio_mg_100g" />
        </div>
      </CardContent>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import { FlaskConical, ChevronDown } from "lucide-vue-next";
import { Card, CardContent, CardHeader } from "@common/components/ui/card";
import { Separator } from "@common/components/ui/separator";
import NutritionField from "./NutritionField.vue";
import { type ManualNutrition } from "~/composables/useNutritionalLabels";

const props = defineProps<{
  modelValue: ManualNutrition;
  open: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: ManualNutrition];
  toggle: [];
}>();

// Shallow-clone so mutations go through emit, not direct mutation
const local = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
</script>
