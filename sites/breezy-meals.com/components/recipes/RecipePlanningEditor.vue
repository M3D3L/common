<template>
  <section class="space-y-4 rounded-lg border border-border p-4">
    <h3 class="text-lg font-semibold">Producción y nutrición calculada</h3>
    <p v-if="loading" class="text-sm">Cargando ingredientes estructurados...</p>
    <p v-if="error" role="alert" class="text-sm text-destructive">
      {{ error }}
    </p>
    <template v-if="recipe">
      <div class="flex flex-wrap items-end gap-4">
        <label class="space-y-1 text-sm"
          >Porciones por receta
          <input
            v-model.number="recipe.yield_portions"
            type="number"
            min="0.01"
            step="any"
            class="block w-28 rounded border bg-background p-2"
          />
        </label>
      </div>
      <p class="text-xs text-muted-foreground">
        Nutrición estimada a partir de ingredientes, por 100 g de alimento
        comestible. No incluye factores de retención por cocción ni sustituye un
        análisis de laboratorio.
      </p>
      <div v-if="nutrition" class="rounded bg-muted/40 p-3 text-sm">
        <strong>{{
          nutrition.complete
            ? "Datos completos"
            : "Cálculo parcial: faltan datos verificados"
        }}</strong>
        <template v-if="nutrition.includedIngredients">
          <p>
            {{
              nutrition.complete
                ? "Total"
                : "Subtotal conocido (no es el total de la receta)"
            }}: {{ formatNutrition(nutrition.total) }}
          </p>
          <p v-if="nutrition.perPortion">
            {{
              nutrition.complete
                ? "Por porción original de la receta"
                : "Subtotal conocido por porción"
            }}: {{ formatNutrition(nutrition.perPortion) }}
          </p>
        </template>
        <p v-else>
          Nutrición no disponible: faltan datos de los ingredientes o de la
          etiqueta. Las cantidades de compra se calculan por separado.
        </p>
      </div>
      <details v-if="nutrition?.warnings.length" class="text-sm">
        <summary>
          {{ nutrition.warnings.length }} advertencias nutricionales
        </summary>
        <ul class="list-disc pl-5">
          <li v-for="warning in nutrition.warnings" :key="warning">
            {{ warning }}
          </li>
        </ul>
      </details>
      <div class="space-y-3">
        <div
          v-for="row in rows"
          :key="row.id"
          class="space-y-2 rounded border border-border p-3"
        >
          <p class="text-sm font-medium">{{ row.text }}</p>
          <div class="flex flex-wrap items-center gap-2">
            <select
              v-model="row.ingredient"
              aria-label="Ingrediente canónico"
              class="max-w-full rounded border bg-background p-2 text-sm"
            >
              <option value="">Seleccionar ingrediente</option>
              <option
                v-for="ingredient in ingredients"
                :key="ingredient.id"
                :value="ingredient.id"
              >
                {{ ingredient.name }}
              </option>
            </select>
            <input
              v-model.number="row.quantity"
              type="number"
              min="0"
              step="any"
              aria-label="Cantidad"
              class="w-24 rounded border bg-background p-2 text-sm"
            />
            <select
              v-model="row.unit"
              aria-label="Unidad"
              class="rounded border bg-background p-2 text-sm"
            >
              <option value="">Unidad</option>
              <option v-for="unit in units" :key="unit" :value="unit">
                {{ unit }}
              </option>
              <option
                v-if="row.unit && !units.includes(row.unit)"
                :value="row.unit"
              >
                {{ row.unit }}
              </option>
            </select>
            <label class="text-xs"
              ><input v-model="row.review_required" type="checkbox" />
              Revisar</label
            >
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Button :disabled="saving" @click="save">{{
          saving ? "Guardando..." : "Guardar datos de producción"
        }}</Button>
        <span v-if="saved" role="status" class="text-sm">Guardado.</span>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { Button } from "@common/components/ui/button";
import {
  calculateRecipeNutrition,
  PLANNING_UNITS,
  type RecipeIngredient,
  type NutritionProfile,
} from "~/lib/meal-planning";
import type {
  PlanningIngredient,
  PlanningRecipeRecord,
} from "~/composables/useMealPlanning";

const props = defineProps<{ recipeId: string }>();
const emit = defineEmits<{ saved: [] }>();
const api = useMealPlanning();
const recipe = ref<PlanningRecipeRecord | null>(null);
const rows = ref<RecipeIngredient[]>([]);
const ingredients = ref<PlanningIngredient[]>([]);
const loading = ref(false);
const saving = ref(false);
const saved = ref(false);
const error = ref("");
const units = PLANNING_UNITS;
const nutrition = computed(() =>
  recipe.value
    ? calculateRecipeNutrition(recipe.value, rows.value, ingredients.value)
    : null,
);
const formatNutrition = (value: NutritionProfile) =>
  `${value.kcal.toFixed(0)} kcal · proteína ${value.protein.toFixed(1)} g · carbohidratos ${value.carbs.toFixed(1)} g · grasa ${value.fat.toFixed(1)} g · fibra ${value.fiber.toFixed(1)} g · sodio ${value.sodium.toFixed(0)} mg`;
let loadSequence = 0;
watch(
  () => props.recipeId,
  async (id) => {
    const sequence = ++loadSequence;
    recipe.value = null;
    error.value = "";
    saved.value = false;
    if (!id) return;
    loading.value = true;
    try {
      const data = await api.loadRecipe(id);
      if (sequence !== loadSequence) return;
      recipe.value = data.recipe;
      rows.value = data.rows;
      ingredients.value = data.ingredients;
    } catch (cause) {
      if (sequence === loadSequence)
        error.value =
          cause instanceof Error
            ? cause.message
            : "No se pudo cargar la receta.";
    } finally {
      if (sequence === loadSequence) loading.value = false;
    }
  },
  { immediate: true },
);
async function save() {
  if (!recipe.value) return;
  saving.value = true;
  error.value = "";
  saved.value = false;
  try {
    await api.saveRecipeDetails(recipe.value, rows.value);
    saved.value = true;
    emit("saved");
  } catch (cause) {
    error.value =
      cause instanceof Error
        ? cause.message
        : "No se pudieron guardar los datos.";
  } finally {
    saving.value = false;
  }
}
</script>
