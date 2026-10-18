<template>
  <section class="space-y-4 rounded-lg border border-border p-4">
    <h3 class="text-lg font-semibold">Producción y nutrición calculada</h3>
    <p v-if="loading" class="text-sm">Cargando ingredientes estructurados...</p>
    <p v-if="error" role="alert" class="text-sm text-destructive">{{ error }}</p>
    <template v-if="recipe">
      <div class="flex flex-wrap items-end gap-4">
        <label class="space-y-1 text-sm">Porciones por receta
          <input v-model.number="recipe.yield_portions" type="number" min="0.01" step="any" class="block w-28 rounded border bg-background p-2" />
        </label>
        <label class="text-sm"><input v-model="recipe.yield_verified" type="checkbox" /> Rendimiento verificado en cocina</label>
        <label class="text-sm"><input v-model="recipe.planning_draft" type="checkbox" /> Borrador: pendiente de aprobación</label>
      </div>
      <div class="space-y-2 rounded border border-border p-3 text-sm">
        <label class="block">Peso final medido de carne/alimento proteico en toda la receta (g)
          <input v-model.number="recipe.protein_yield_g" type="number" min="0" step="any" class="mt-1 block w-40 rounded border bg-background p-2" />
        </label>
        <label><input v-model="recipe.protein_yield_verified" type="checkbox" /> Peso cocido verificado en cocina</label>
        <p class="text-xs text-muted-foreground">Es peso del alimento servido, no gramos del macronutriente proteína. Excluye salsa y guarniciones. Un objetivo de 150 g de carne por plato requiere este rendimiento; no se deduce del peso crudo.</p>
      </div>
      <p class="text-xs text-muted-foreground">Nutrición estimada a partir de ingredientes, por 100 g de alimento comestible. No incluye factores de retención por cocción ni sustituye un análisis de laboratorio.</p>
      <div v-if="nutrition" class="rounded bg-muted/40 p-3 text-sm">
        <strong>{{ nutrition.complete ? "Datos completos" : "Cálculo parcial: faltan datos verificados" }}</strong>
        <p>Total: {{ formatNutrition(nutrition.total) }}</p>
        <p v-if="nutrition.perPortion">Por porción original de la receta: {{ formatNutrition(nutrition.perPortion) }}</p>
      </div>
      <details v-if="nutrition?.warnings.length" class="text-sm">
        <summary>{{ nutrition.warnings.length }} advertencias nutricionales</summary>
        <ul class="list-disc pl-5"><li v-for="warning in nutrition.warnings" :key="warning">{{ warning }}</li></ul>
      </details>
      <div class="space-y-3">
        <div v-for="row in rows" :key="row.id" class="space-y-2 rounded border border-border p-3">
          <p class="text-sm font-medium">{{ row.text }}</p>
          <div class="flex flex-wrap items-center gap-2">
            <select v-model="row.ingredient" aria-label="Ingrediente canónico" class="max-w-full rounded border bg-background p-2 text-sm">
              <option value="">Seleccionar ingrediente</option>
              <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient.id">{{ ingredient.name }}</option>
            </select>
            <input v-model.number="row.quantity" type="number" min="0" step="any" aria-label="Cantidad" class="w-24 rounded border bg-background p-2 text-sm" />
            <select v-model="row.unit" aria-label="Unidad" class="rounded border bg-background p-2 text-sm">
              <option value="">Unidad</option>
              <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
              <option v-if="row.unit && !units.includes(row.unit)" :value="row.unit">{{ row.unit }}</option>
            </select>
            <label class="text-xs"><input v-model="row.review_required" type="checkbox" /> Revisar</label>
          </div>
        </div>
      </div>
      <label class="block text-sm">Notas de producción y variantes
        <textarea v-model="recipe.planning_notes" rows="3" class="mt-1 w-full rounded border bg-background p-2" />
      </label>
      <details class="text-sm">
        <summary>Métodos Thermomix / Ninja / arrocera (validar modelo y capacidad)</summary>
        <label class="mt-3 block">Thermomix
          <textarea v-model="thermomix" rows="4" class="mt-1 w-full rounded border bg-background p-2" />
        </label>
        <label class="mt-3 block">Ninja / slow cooker
          <textarea v-model="ninja" rows="4" class="mt-1 w-full rounded border bg-background p-2" />
        </label>
        <label class="mt-3 block">Arrocera
          <textarea v-model="riceCooker" rows="4" class="mt-1 w-full rounded border bg-background p-2" />
        </label>
      </details>
      <div class="flex items-center gap-3">
        <Button :disabled="saving" @click="save">{{ saving ? "Guardando..." : "Guardar datos de producción" }}</Button>
        <span v-if="saved" role="status" class="text-sm">Guardado.</span>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { Button } from "@common/components/ui/button";
import { calculateRecipeNutrition, type RecipeIngredient, type NutritionProfile } from "~/lib/meal-planning";
import type { PlanningIngredient, PlanningRecipeRecord } from "~/composables/useMealPlanning";

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
const thermomix = ref("");
const ninja = ref("");
const riceCooker = ref("");
const units = ["g", "kg", "ml", "l", "piece"];
const nutrition = computed(() => recipe.value
  ? calculateRecipeNutrition(recipe.value, rows.value, ingredients.value) : null);
const formatNutrition = (value: NutritionProfile) =>
  `${value.kcal.toFixed(0)} kcal · proteína ${value.protein.toFixed(1)} g · carbohidratos ${value.carbs.toFixed(1)} g · grasa ${value.fat.toFixed(1)} g · fibra ${value.fiber.toFixed(1)} g · sodio ${value.sodium.toFixed(0)} mg`;
let loadSequence = 0;
watch(() => props.recipeId, async (id) => {
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
    thermomix.value = data.recipe.equipment_methods?.thermomix?.join("\n") ?? "";
    ninja.value = data.recipe.equipment_methods?.ninja?.join("\n") ?? "";
    riceCooker.value = data.recipe.equipment_methods?.riceCooker?.join("\n") ?? "";
  } catch (cause) {
    if (sequence === loadSequence) error.value = cause instanceof Error ? cause.message : "No se pudo cargar la receta.";
  } finally {
    if (sequence === loadSequence) loading.value = false;
  }
}, { immediate: true });
async function save() {
  if (!recipe.value) return;
  saving.value = true;
  error.value = "";
  saved.value = false;
  try {
    recipe.value.equipment_methods = {
      thermomix: thermomix.value.split("\n").filter((line) => line.trim()),
      ninja: ninja.value.split("\n").filter((line) => line.trim()),
      riceCooker: riceCooker.value.split("\n").filter((line) => line.trim()),
    };
    await api.saveRecipeDetails(recipe.value, rows.value);
    saved.value = true;
    emit("saved");
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : "No se pudieron guardar los datos.";
  } finally {
    saving.value = false;
  }
}
</script>
