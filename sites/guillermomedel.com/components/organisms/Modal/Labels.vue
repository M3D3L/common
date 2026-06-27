<!-- CreateLabelModal.vue -->
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
      <!-- Name -->
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

      <!-- Type -->
      <Card>
        <CardContent class="pt-4 pb-3 px-4 space-y-2">
          <label
            class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold flex items-center gap-1.5"
          >
            <Tag class="w-3 h-3" /> Tipo
          </label>
          <div class="flex gap-2">
            <button
              v-for="opt in TYPE_OPTIONS"
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

      <!-- Ingredients -->
      <Card>
        <CardContent class="pt-4 pb-3 px-4 space-y-1.5">
          <label
            class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold flex items-center gap-1.5"
          >
            <ListChecks class="w-3 h-3" /> Ingredientes y Proporciones
          </label>
          <Textarea
            v-model="recipeText"
            placeholder="Ej.&#10;200 g pechuga de pollo&#10;..."
            rows="6"
            class="resize-none"
          />
        </CardContent>
      </Card>

      <!-- Portion / Total -->
      <div class="grid grid-cols-2 gap-3">
        <Card>
          <CardContent class="pt-4 pb-3 px-4 space-y-1.5">
            <label
              class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold flex items-center gap-1"
            >
              <Scale class="w-3 h-3" /> Porción (g)
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
              <Package class="w-3 h-3" /> Total (g)
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

      <ExpirationPicker
        :preset="expirationPreset"
        :date="expirationDate"
        :date-error="expirationDateError"
        @set-preset="setPreset"
        @clear="clear"
        @input="formatInput"
      />

      <ManualNutritionForm
        v-model="manualNutrition"
        :open="showManualNutrition"
        @toggle="showManualNutrition = !showManualNutrition"
      />

      <NutritionPreviewTable
        :manual-nutrition="manualNutrition"
        :portion-size="portionSize"
        :total-size="totalSize"
        :stored-label="selectedLabel"
        :is-edit-mode="isEditMode"
      />

      <Button
        class="w-full text-[10px] tracking-widest uppercase"
        @click="processLabel(() => createModal?.toggleModal(false))"
        :disabled="isLoading || !recipeText.trim() || !recipeName.trim()"
      >
        <Loader2 v-if="isLoading" class="w-3.5 h-3.5 animate-spin" />
        <Sparkles v-else class="w-3.5 h-3.5" />
        {{ buttonLabel }}
      </Button>

      <p
        v-if="isEditMode && !ingredientsChanged"
        class="text-[9px] text-neutral-500 text-center leading-snug"
      >
        Sin cambios en los ingredientes: se reescalan los valores existentes sin
        volver a consultar la IA.
      </p>

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
import { Input } from "@common/components/ui/input";
import { Textarea } from "@common/components/ui/textarea";
import { Card, CardContent } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import {
  Scale,
  Package,
  AlertTriangle,
  Loader2,
  Sparkles,
  ClipboardList,
  ListChecks,
  Tag,
  Utensils,
  Cookie,
  Coffee,
} from "lucide-vue-next";
import ExpirationPicker from "./ExpirationPicker.vue";
import ManualNutritionForm from "./ManualNutritionForm.vue";
import NutritionPreviewTable from "./NutritionPreviewTable.vue";
import { useCreateLabelForm } from "~/composables/useCreateLabelForm";

const TYPE_OPTIONS = [
  { value: "meal", label: "Comida", icon: Utensils },
  { value: "snack", label: "Snack", icon: Cookie },
  { value: "drink", label: "Bebida", icon: Coffee },
] as const;

const props = defineProps<{
  selectedLabel: any | null;
  type: "create" | "edit";
}>();
const emit = defineEmits<{ created: [any]; updated: [any] }>();

const createModal = ref<InstanceType<typeof Modal> | null>(null);

const form = useCreateLabelForm(
  toRef(props, "selectedLabel"),
  toRef(props, "type"),
  (entry) => emit("created", entry),
  (entry) => emit("updated", entry),
);

const {
  recipeName,
  recipeText,
  portionSize,
  totalSize,
  selectedType,
  saveError,
  showManualNutrition,
  manualNutrition,
  expirationPreset,
  expirationDate,
  expirationDateError,
  setPreset,
  clear,
  formatInput,
  isEditMode,
  isLoading,
  buttonLabel,
  ingredientsChanged,
  processLabel,
  error,
  open,
} = form;

function openModal() {
  form.open();
  createModal.value?.toggleModal(true);
}

defineExpose({ open: openModal });
</script>
