<template>
  <main class="mx-auto max-w-6xl space-y-5 px-4 py-8 pb-24">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div><p class="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Cocina · Breezy Meals</p><h1 class="text-3xl font-bold tracking-tight">Planea tu semana</h1>
        <p class="mt-2 text-sm text-muted-foreground">Cuántos platos preparar y cuánto necesitas comprar.</p></div>
      <div class="flex items-center gap-3 text-sm">
        <Button v-if="tab !== 'plan'" variant="outline" @click="tab = 'plan'">Volver al plan</Button>
        <Button variant="ghost" @click="showSettings = !showSettings">Configuración</Button>
      </div>
    </header>
    <p v-if="error" role="alert" class="rounded border border-destructive p-3 text-destructive">{{ error }}</p>
    <p v-if="notice" role="status" class="rounded border p-3">{{ notice }}</p>
    <div v-if="loading" class="py-12">Cargando datos de producción...</div>
    <template v-if="data">
      <nav v-if="showSettings" class="flex flex-wrap gap-2 rounded-xl border bg-muted/20 p-3" aria-label="Configuración de planeación">
        <Button v-for="item in tabs" :key="item.id" :variant="tab === item.id ? 'default' : 'outline'" @click="tab = item.id">{{ item.label }}</Button>
        <Button variant="outline" :disabled="busy" @click="load">Actualizar datos</Button>
      </nav>

      <template v-if="tab === 'plan'">
        <section class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5" aria-label="Seleccionar semana">
          <div class="flex items-center gap-2">
            <Button size="icon" variant="outline" :disabled="loading || busy" aria-label="Semana anterior" @click="selectWeek(addDays(weekStart, -7))"><ChevronLeft :size="18" /></Button>
            <label class="px-2 text-xs font-medium text-muted-foreground">Semana
              <input type="week" :value="weekInputValue(weekStart)" :disabled="loading || busy" aria-label="Semana de planificación" class="mt-1 block min-w-44 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground" @change="changeWeek" />
            </label>
            <Button size="icon" variant="outline" :disabled="loading || busy" aria-label="Semana siguiente" @click="selectWeek(addDays(weekStart, 7))"><ChevronRight :size="18" /></Button>
          </div>
          <p class="text-sm font-medium">{{ dateLabel(weekStart) }} – {{ dateLabel(addDays(weekStart, 6)) }}</p>
          <div class="flex gap-2"><Button variant="outline" :disabled="busy || loading" @click="recalculateWeek">Recalcular semana</Button><Button :disabled="busy || loading || !lines.length" @click="savePlan(false)">Guardar plan</Button></div>
        </section>
        <section class="grid grid-cols-3 gap-3">
          <div class="min-w-0 rounded-xl border bg-card p-4"><p class="text-xs text-muted-foreground">Platos planeados</p><p class="mt-1 text-3xl font-bold tabular-nums">{{ totalPlates }}</p><p class="mt-2 text-xs text-muted-foreground">Membresías y clientes sin membresía</p></div>
          <div class="min-w-0 rounded-xl border bg-card p-4"><p class="text-xs text-muted-foreground">Previsión actual por día</p><p class="mt-1 text-3xl font-bold tabular-nums">{{ dailyForecastLabel }}</p><p class="mt-2 text-xs text-muted-foreground">{{ forecastWeeklyPlates }} platos repartidos en {{ serviceDays }} días</p></div>
          <div class="min-w-0 rounded-xl border bg-card p-4"><p class="text-xs text-muted-foreground">Créditos disponibles ahora</p><p class="mt-1 text-3xl font-bold tabular-nums">{{ credits }}</p><p class="mt-2 text-xs text-muted-foreground">Comidas de membresía aún disponibles</p></div>
        </section>
        <section class="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4" aria-label="Previsión de clientes sin membresía">
          <label class="text-sm font-medium">Clientes sin membresía por día
            <input v-model.number="extraDaily" type="number" min="0" step="1" aria-label="Clientes sin membresía por día" class="ml-2 w-20 rounded border bg-background p-2 tabular-nums" />
          </label>
          <p v-if="!forecastError" class="text-sm text-muted-foreground">{{ extraDaily }} personas × {{ serviceDays }} días = {{ extraDaily * serviceDays }} platos adicionales por semana. Un plato por persona.</p>
          <p v-if="!forecastError" class="w-full text-xs text-muted-foreground">Base de la previsión: {{ credits }} créditos disponibles al {{ utilization }}% de consumo, más los clientes sin membresía; margen de producción: {{ buffer }}%.</p>
        </section>
        <section v-if="lines.length && !forecastError && (forecastBalanceChanged || totalPlates !== forecastWeeklyPlates)" role="status" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 text-sm">
          <div class="min-w-0 flex-1">
            <p class="font-semibold">{{ forecastBalanceChanged ? "El saldo cambió desde que se calculó este plan" : "El plan tiene cantidades distintas a la previsión actual" }}</p>
            <p class="mt-1">{{ forecastCredits === null ? "" : `Base del plan: ${forecastCredits} créditos. ` }}Ahora hay {{ credits }} disponibles. Las compras corresponden a los {{ totalPlates }} platos planeados.</p>
            <p class="mt-1 text-muted-foreground">Previsión actual: {{ forecastWeeklyPlates }} platos en total, repartidos entre {{ serviceDays }} días. {{ autoDemand ? "Las cantidades se ajustan al saldo actual." : "El ajuste automático está desactivado para este plan manual." }}</p>
          </div>
          <Button variant="outline" :disabled="busy || loading" @click="recalculateWeek">Recalcular con saldo actual</Button>
        </section>
        <div class="flex flex-wrap items-center gap-2" aria-label="Período del resumen">
          <Button :variant="shoppingDate ? 'outline' : 'default'" size="sm" @click="shoppingDate = ''">Toda la semana</Button>
          <Button v-for="date in dates" :key="date" :variant="shoppingDate === date ? 'default' : 'outline'" size="sm" @click="shoppingDate = date">{{ dateLabel(date) }}</Button>
        </div>
        <div class="grid items-start gap-5 lg:grid-cols-2">
          <PlanningMealMixChart :items="mealShares" :editable="!!shoppingDate" @share="changeMealShare" />
          <section class="min-w-0 space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div><h2 class="text-lg font-semibold">{{ shoppingDate ? "Compras del día" : "Total de compras de la semana" }}</h2><p class="mt-1 text-sm text-muted-foreground">{{ shoppingDate ? dateLabel(shoppingDate) : `${dateLabel(weekStart)} – ${dateLabel(dates[dates.length - 1] || addDays(weekStart, 6))}` }}</p></div>
              <Button size="sm" variant="outline" :disabled="loading || busy || !shopping.requirements.length" @click="exportShoppingList">Descargar lista TXT</Button>
            </div>
            <div v-if="purchaseHighlights.length" class="grid grid-cols-2 gap-3" aria-label="Totales de ingredientes principales">
              <div v-for="group in purchaseHighlights" :key="group.name" class="rounded-xl bg-muted/50 p-3">
                <p class="text-xs font-medium text-muted-foreground">{{ group.name }}</p>
                <p class="mt-1 text-xl font-bold tabular-nums">{{ group.totals.map(total => formatPurchaseQuantity(total.quantity, total.unit)).join(' + ') }}</p>
              </div>
            </div>
            <details v-if="warnings.length && lines.length" class="rounded-xl border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
              <summary class="cursor-pointer font-medium">Totales provisionales · {{ warnings.length }} datos por revisar</summary>
              <p role="alert" class="mt-2 text-xs text-muted-foreground">Estos son los ingredientes calculables, no una lista completa garantizada. Faltan cantidades o recetas por verificar.</p>
              <ul class="mt-2 max-h-52 list-disc space-y-1 overflow-auto pl-5 text-xs"><li v-for="warning in warnings" :key="warning">{{ warning }}</li></ul>
              <Button size="sm" variant="outline" class="mt-3" @click="showSettings = true; tab = 'recipes'">Revisar recetas</Button>
            </details>
            <div class="max-h-[32rem] space-y-5 overflow-y-auto pr-1" aria-label="Lista de ingredientes">
              <section v-for="group in purchaseGroups" :key="group.name">
                <div class="mb-2 flex items-center justify-between gap-3 border-b pb-2">
                  <h3 class="text-sm font-semibold">{{ group.name }}</h3>
                  <span v-if="group.name !== 'Otros ingredientes'" class="text-xs font-medium text-muted-foreground">{{ group.totals.map(total => formatPurchaseQuantity(total.quantity, total.unit)).join(' + ') }}</span>
                </div>
                <ul class="divide-y divide-border/50">
                  <li v-for="row in group.items" :key="row.ingredient" class="flex items-start justify-between gap-4 py-2 text-sm">
                    <span>{{ row.name }}</span><span class="text-right font-medium tabular-nums">{{ row.totals.map(total => formatPurchaseQuantity(total.quantity, total.unit)).join(' + ') }}</span>
                  </li>
                </ul>
              </section>
              <p v-if="!shopping.requirements.length" class="py-10 text-center text-sm text-muted-foreground">No hay ingredientes calculables para este período.</p>
            </div>
            <p class="text-xs text-muted-foreground">Totales brutos, antes de descontar inventario. Los cortes se desglosan por separado; no se sustituyen entre sí.</p>
            <p class="text-xs text-muted-foreground">Estimación según las recetas. Cucharada = 15 ml; cucharadita = 5 ml. Piezas y envases conservan la presentación de la receta, sin adivinar su peso.</p>
            <p class="text-xs text-muted-foreground">Media crema por envase, queso amarillo por rebanada y Knorr por pieza.</p>
          </section>
        </div>
        <details class="space-y-4 rounded-xl border p-4">
          <summary class="cursor-pointer text-sm font-semibold">Ajustar previsión y opciones</summary>
          <label class="block text-sm"><input v-model="autoDemand" type="checkbox" /> Ajustar automáticamente los platos al saldo actual</label>
          <p class="text-xs text-muted-foreground">Activado por defecto. Al cargar, guardar o descargar se actualizan las cantidades sin cambiar los pesos de los platillos. Desactívalo solo para un plan con cantidades manuales.</p>
          <div class="grid gap-4 sm:grid-cols-3">
            <label class="text-sm">Días de servicio (desde la fecha inicial)<input v-model.number="serviceDays" type="number" min="1" max="7" class="mt-1 block w-full rounded border bg-background p-2" /></label>
            <label class="text-sm">Créditos que se espera consumir (%)<input v-model.number="utilization" type="number" min="0" max="100" class="mt-1 block w-full rounded border bg-background p-2" /></label>
            <label class="text-sm">Margen de producción (%)<input v-model.number="buffer" type="number" min="0" class="mt-1 block w-full rounded border bg-background p-2" /></label>
          </div>
          <div class="flex flex-wrap gap-4 text-sm">
            <label><input v-model="showNutrition" type="checkbox" /> Mostrar nutrición estimada</label>
          </div>
          <div class="flex flex-wrap gap-3 text-sm">
            <span>Grupos a repartir como platos principales:</span>
            <label v-for="group in availableGroups" :key="group"><input v-model="selectedGroups" type="checkbox" :value="group" /> {{ group }}</label>
          </div>
          <p class="text-xs text-muted-foreground">Créditos × consumo esperado ÷ días; se suman extras y después el margen. Las cantidades se escalan según las porciones por receta. Los platos se reparten entre los grupos seleccionados, no una vez por grupo. Agrega guarniciones mediante componentes o líneas manuales. Regenerar reemplaza las cantidades manuales.</p>
          <Button :disabled="busy" @click="generate">Proponer cantidades desde la rotación semanal</Button>
          <p v-if="forecastError" role="alert" class="text-sm text-destructive">{{ forecastError }}</p>
        </details>

        <details class="space-y-3 rounded-xl border p-4">
          <summary class="cursor-pointer text-sm font-semibold">Editar cantidades y platillos por día</summary>
          <Button v-if="generationWarnings.length" size="sm" variant="outline" @click="generationWarnings = []">Confirmé y corregí manualmente las advertencias de la propuesta</Button>
          <div v-for="date in dates" :key="date" class="space-y-2 border-b pb-4">
            <div class="flex flex-wrap items-center gap-3">
              <h3 class="font-semibold">{{ date }}</h3>
              <label class="text-xs">Objetivo de platos<input v-model.number="dailyTargets[date]" :disabled="autoDemand" type="number" min="0" class="ml-2 w-24 rounded border bg-background p-1" /></label>
              <Button size="sm" variant="outline" @click="rebalance(date)">Repartir por pesos</Button>
              <span class="text-xs">Asignados: {{ lines.filter(line => line.date === date).reduce((sum, line) => sum + line.quantity, 0) }}</span>
            </div>
            <div v-for="line in lines.filter(item => item.date === date)" :key="line.key" class="flex flex-wrap items-center gap-2 text-sm">
              <select v-model="line.menu_item" aria-label="Platillo" class="max-w-full flex-1 rounded border bg-background p-2">
                <option value="">Seleccionar platillo</option><option v-for="item in data.menuItems" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
              <label>Cantidad <input v-model.number="line.quantity" :disabled="autoDemand" type="number" min="0" step="1" class="w-20 rounded border bg-background p-2" /></label>
              <label>Peso <input v-model.number="line.weight" type="number" min="0" step="any" class="w-20 rounded border bg-background p-2" /></label>
              <Button variant="ghost" size="sm" @click="removeLine(line.key)">Quitar</Button>
            </div>
            <Button size="sm" variant="outline" @click="addLine(date)">Agregar platillo</Button>
          </div>
        </details>

        <details v-if="showSettings" class="space-y-3 rounded-xl border p-4">
          <summary class="cursor-pointer text-sm font-semibold">Nutrición y versiones fijas</summary>
          <p class="text-sm text-muted-foreground">Guardar una versión fija es opcional. Las recetas están disponibles sin aprobación.</p>
          <details v-if="approvalWarnings.length" class="text-sm">
            <summary>Requisitos para congelar una versión revisada</summary>
            <ul class="mt-2 list-disc pl-5"><li v-for="warning in approvalWarnings" :key="warning">{{ warning }}</li></ul>
          </details>
          <details v-if="showNutrition" class="text-sm">
            <summary>Nutrición por receta de producción</summary>
            <div v-for="entry in productionNutrition" :key="`${entry.date}-${entry.recipe}`" class="mt-2 rounded bg-muted/40 p-2">
              <strong>{{ entry.date }} · {{ entry.title }} — {{ entry.complete ? "ingredientes verificados" : "PARCIAL" }}</strong>
              <p>{{ entry.portions.toFixed(1) }} porciones previstas; {{ entry.kcal === null ? "nutrición no disponible" : `${entry.kcal.toFixed(0)} kcal conocidas${entry.complete ? "" : " (subtotal parcial)"}` }}.</p>
              <NuxtLink :to="`/planeacion?recipe=${entry.recipe}`" class="underline" @click="selectedRecipe = entry.recipe; tab = 'recipes'">Revisar receta y macros</NuxtLink>
            </div>
          </details>
          <div class="flex flex-wrap gap-3">
            <Button :disabled="busy || !lines.length" @click="savePlan(false)">Guardar plan</Button>
            <Button :disabled="busy || !!approvalWarnings.length || !lines.length" @click="savePlan(true)">Guardar versión fija</Button>
            <Button variant="outline" :disabled="loading || busy || !shopping.requirements.length" @click="exportShoppingList">Descargar compras TXT</Button>
          </div>
          <p class="text-xs text-muted-foreground">La versión fija conserva una instantánea del plan con cantidades calculables y objetivos diarios completos. La nutrición incompleta permanece señalada.</p>
        </details>
        <details class="space-y-2 rounded-xl border p-4">
          <summary class="cursor-pointer text-sm font-semibold">Versiones guardadas de esta semana</summary>
          <div v-for="plan in data.plans.filter(plan => plan.week_start === weekStart)" :key="plan.id" class="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>{{ plan.week_start }} — {{ plan.status === "approved" ? "Versión fija" : "Plan guardado" }}</span>
            <Button size="sm" variant="outline" @click="viewPlan(plan)">Ver / usar como nueva propuesta</Button>
          </div>
          <details v-if="savedSnapshot"><summary class="cursor-pointer text-xs text-muted-foreground">Datos de la instantánea (avanzado)</summary><pre class="max-h-80 overflow-auto whitespace-pre-wrap rounded bg-muted p-3 text-xs">{{ savedSnapshot }}</pre></details>
        </details>
      </template>

      <section v-if="tab === 'coverage'" class="space-y-4">
        <h2 class="text-xl font-semibold">Asociaciones del menú (sin tienda)</h2>
        <p class="text-sm">{{ data.menuItems.length }} platillos; {{ missingCoverage }} sin receta. Cada componente es una cantidad de porciones de receta por unidad vendida. Un platillo puede incluir guiso, arroz y salsa.</p>
        <input v-model="coverageSearch" placeholder="Buscar platillo..." aria-label="Buscar asociaciones" class="w-full rounded border bg-background p-2" />
        <article v-for="item in filteredMenu" :key="item.id" class="space-y-2 rounded-lg border p-4">
          <h3 class="font-semibold">{{ item.name }}</h3>
          <div v-for="component in data.components.filter(row => row.menu_item === item.id)" :key="component.id" class="flex flex-wrap items-center gap-2 text-sm">
            <span>{{ recipeName(component.recipe) }} × {{ component.portions }}</span>
            <label>Porciones de receta por plato
              <input v-model.number="component.portions" type="number" min="0.01" step="any" class="w-24 rounded border bg-background p-1" />
            </label>
            <Button size="sm" variant="outline" :disabled="busy" @click="saveMapping(component.id, component.portions)">Guardar porciones</Button>
            <Button size="sm" variant="ghost" @click="selectedRecipe = component.recipe; tab = 'recipes'">Revisar receta</Button>
            <Button size="sm" variant="ghost" :disabled="busy" @click="removeMapping(component.id)">Desvincular</Button>
          </div>
          <div class="flex flex-wrap gap-2">
            <select v-model="mappingRecipe[item.id]" aria-label="Receta para asociar" class="max-w-full flex-1 rounded border bg-background p-2 text-sm"><option value="">Agregar receta...</option><option v-for="recipe in data.recipes" :key="recipe.id" :value="recipe.id">{{ recipe.title }}</option></select>
            <input v-model.number="mappingPortions[item.id]" type="number" min="0.01" step="any" placeholder="1" aria-label="Porciones por platillo" class="w-24 rounded border bg-background p-2" />
            <Button size="sm" :disabled="busy" @click="addMapping(item.id)">Asociar</Button>
          </div>
          <p class="text-xs text-muted-foreground">Las cantidades de ingredientes se calculan usando las porciones por receta y las porciones de receta necesarias para cada plato.</p>
        </article>
      </section>

      <section v-if="tab === 'recipes'" class="space-y-4">
        <h2 class="text-xl font-semibold">Recetas y rendimientos</h2>
        <p class="text-sm">Todas las recetas están disponibles. Selecciona una para ajustar sus porciones e ingredientes.</p>
        <select v-model="selectedRecipe" aria-label="Seleccionar receta de producción" class="w-full rounded border bg-background p-2"><option value="">Seleccionar receta...</option><option v-for="recipe in data.recipes" :key="recipe.id" :value="recipe.id">{{ recipe.title }}</option></select>
        <RecipesRecipePlanningEditor v-if="selectedRecipe" :recipe-id="selectedRecipe" @saved="load" />
        <NuxtLink to="/recetas" class="inline-block text-sm underline">Editar texto e instrucciones en el recetario</NuxtLink>
      </section>

      <section v-if="tab === 'ingredients'" class="space-y-4">
        <h2 class="text-xl font-semibold">Ingredientes y nutrición</h2>
        <p class="text-sm">Valores por 100 g de alimento comestible. Macros y fibra en g, sodio en mg, energía en kcal. La fuente debe corresponder al corte, marca y estado crudo/cocido. Una porción comprada no equivale automáticamente a una porción comestible.</p>
        <div class="flex gap-2"><input v-model="newIngredientName" placeholder="Nuevo ingrediente..." class="min-w-0 flex-1 rounded border bg-background p-2" /><Button :disabled="busy" @click="createIngredient">Crear ingrediente</Button></div>
        <select v-model="selectedIngredient" aria-label="Seleccionar ingrediente" class="w-full rounded border bg-background p-2"><option value="">Seleccionar ingrediente...</option><option v-for="ingredient in data.ingredients" :key="ingredient.id" :value="ingredient.id">{{ ingredient.name }}{{ ingredient.nutrition_verified ? " — USDA / verificado" : " — sin verificar" }}</option></select>
        <div v-if="ingredientForm" class="space-y-4 rounded-lg border p-4">
          <div class="grid gap-3 sm:grid-cols-3">
            <label class="text-sm">Nombre<input v-model="ingredientForm.name" class="mt-1 block w-full rounded border bg-background p-2" /></label>
            <label class="text-sm">Categoría<input v-model="ingredientForm.category" class="mt-1 block w-full rounded border bg-background p-2" /></label>
            <label class="text-sm">Unidad de compra<select v-model="ingredientForm.base_unit" class="mt-1 block w-full rounded border bg-background p-2"><option value="g">g</option><option value="ml">ml</option><option value="piece">pieza</option></select></label>
            <label class="text-sm">Gramos por ml o por pieza (0 = desconocido)<input v-model.number="ingredientForm.grams_per_unit" type="number" min="0" step="any" class="mt-1 block w-full rounded border bg-background p-2" /></label>
            <label v-for="nutrient in nutrientFields" :key="nutrient.key" class="text-sm">{{ nutrient.label }} / 100 g<input v-model.number="nutritionForm[nutrient.key]" type="number" min="0" step="any" class="mt-1 block w-full rounded border bg-background p-2" /></label>
          </div>
          <label class="block text-sm">Fuente (URL HTTPS)<input v-model="ingredientForm.nutrition_source" type="url" class="mt-1 block w-full rounded border bg-background p-2" /></label>
          <label class="block text-sm">Descripción exacta del alimento en la fuente<input v-model="ingredientForm.nutrition_description" class="mt-1 block w-full rounded border bg-background p-2" /></label>
          <label class="block text-sm"><input v-model="ingredientForm.nutrition_verified" type="checkbox" /> Confirmé identidad, estado y valores de la fuente</label>
          <a href="https://fdc.nal.usda.gov/food-search" target="_blank" rel="noopener noreferrer" class="text-sm underline">Consultar USDA FoodData Central</a>
          <Button class="block" :disabled="busy" @click="saveIngredient">Guardar ingrediente y nutrición</Button>
        </div>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { Button } from "@common/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import usePocketBase from "@common/composables/usePocketbase";
import { aggregateRequirements, allocatePlates, availableCredits, calculateRecipeNutrition, forecastWeekly, type NutritionProfile, type ProductionLine } from "~/lib/meal-planning";
import { addDays, mondayOf, resolveDay } from "~/utils/rotation";
import type { MenuRecordFull } from "~/composables/useMenuData";
import type { PlanningIngredient, SavedMealPlan } from "~/composables/useMealPlanning";
import { allocateMealShare, buildShoppingText, formatPurchaseQuantity, rebalanceProductionPlan, summarizeMealShares, summarizePurchases, weekInputValue, weekStartFromInput } from "~/lib/meal-planning-summary";

definePageMeta({ layout: "staff", staffOnly: true, verifiedOnly: true, keepalive: false });
useHead({ title: "Planeación | Breezy Meals" });
const api = useMealPlanning();
const menu = useLatestMenuRecord<MenuRecordFull>();
const data = ref<Awaited<ReturnType<typeof api.load>> | null>(null);
const loading = ref(true);
const busy = ref(false);
const error = ref("");
const notice = ref("");
const tabs = [{ id: "plan", label: "Plan semanal" }, { id: "coverage", label: "Cobertura del menú" }, { id: "recipes", label: "Recetas y equipo" }, { id: "ingredients", label: "Ingredientes y nutrición" }];
const route = useRoute();
const tab = ref(route.query.recipe ? "recipes" : "plan");
const showSettings = ref(!!route.query.recipe);
const weekStart = ref(mondayOf(addDays(new Date().toLocaleDateString("en-CA", { timeZone: "America/Hermosillo" }), 7)));
const serviceDays = ref(5);
const utilization = ref(100);
const extraDaily = ref(15);
const buffer = ref(0);
const showNutrition = ref(true);
const selectedGroups = ref(["guisos", "caldos"]);
const shoppingDate = ref("");
const dailyTargets = ref<Record<string, number>>({});
const forecastCredits = ref<number | null>(null);
const autoDemand = ref(true);
interface EditableLine extends ProductionLine { key: number; weight: number }
const lines = ref<EditableLine[]>([]);
let sequence = 0;
const generationWarnings = ref<string[]>([]);
const savedSnapshot = ref("");
const selectedRecipe = ref(typeof route.query.recipe === "string" ? route.query.recipe : "");
const selectedIngredient = ref("");
const ingredientForm = ref<PlanningIngredient | null>(null);
const emptyNutrition = (): NutritionProfile => ({ kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sodium: 0 });
const nutritionForm = ref(emptyNutrition());
const newIngredientName = ref("");
const mappingRecipe = ref<Record<string, string>>({});
const mappingPortions = ref<Record<string, number>>({});
const coverageSearch = ref("");
let initialized = false;
const dateLabel = (date: string) => new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
const nutrientFields: Array<{ key: keyof NutritionProfile; label: string }> = [
  { key: "kcal", label: "Energía (kcal)" }, { key: "protein", label: "Proteína (g)" },
  { key: "fat", label: "Grasa (g)" }, { key: "carbs", label: "Carbohidratos (g)" },
  { key: "fiber", label: "Fibra (g)" }, { key: "sodium", label: "Sodio (mg)" },
];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const credits = computed(() => data.value ? availableCredits(data.value.memberships) : 0);
const forecastError = computed(() => {
  if (!Number.isInteger(serviceDays.value) || serviceDays.value < 1 || serviceDays.value > 7) return "Selecciona entre 1 y 7 días de servicio.";
  if (!Number.isSafeInteger(extraDaily.value) || extraDaily.value < 0) return "Indica un número entero de clientes sin membresía, desde cero.";
  try { forecastWeekly(credits.value, serviceDays.value, utilization.value, extraDaily.value, buffer.value); return ""; }
  catch (cause) { return cause instanceof Error ? cause.message : "Parámetros no válidos."; }
});
const forecastWeeklyPlates = computed(() => forecastError.value ? 0 : forecastWeekly(credits.value, serviceDays.value, utilization.value, extraDaily.value, buffer.value));
const forecastBalanceChanged = computed(() => forecastCredits.value !== null && forecastCredits.value !== credits.value);
const dates = computed(() => /^\d{4}-\d{2}-\d{2}$/.test(weekStart.value) && Number.isInteger(serviceDays.value) && serviceDays.value >= 1 && serviceDays.value <= 7
  ? Array.from({ length: serviceDays.value }, (_, index) => addDays(weekStart.value, index)) : []);
const forecastTargets = computed(() => {
  if (forecastError.value || !dates.value.length) return {};
  const quantities = allocatePlates(forecastWeeklyPlates.value, dates.value.map(() => 1));
  return Object.fromEntries(dates.value.map((date, index) => [date, quantities[index]!]));
});
const dailyForecastLabel = computed(() => {
  const counts = Object.values(forecastTargets.value);
  if (!counts.length) return "0";
  const min = Math.min(...counts); const max = Math.max(...counts);
  return min === max ? String(min) : `${min}–${max}`;
});
const availableGroups = computed(() => [...new Set(data.value?.menuItems.map((item) => item.category) ?? [])]);
const missingCoverage = computed(() => data.value?.menuItems.filter((item) => !data.value?.components.some((component) => component.menu_item === item.id)).length ?? 0);
const filteredMenu = computed(() => data.value?.menuItems.filter((item) => normalize(item.name).includes(normalize(coverageSearch.value))) ?? []);
const recipeName = (id: string) => data.value?.recipes.find((recipe) => recipe.id === id)?.title ?? id;
const effectiveComponents = computed(() => data.value?.components.map((component) => ({
  ...component, protein_target_g: 0,
})) ?? []);
const shopping = computed(() => {
  if (!data.value) return { requirements: [], warnings: [], recipePortions: [] };
  return aggregateRequirements(lines.value.filter((line) => !shoppingDate.value || line.date === shoppingDate.value), effectiveComponents.value,
    data.value.recipes, data.value.rows, data.value.ingredients);
});
const allRequirements = computed(() => data.value
  ? aggregateRequirements(lines.value, effectiveComponents.value, data.value.recipes, data.value.rows, data.value.ingredients)
  : { requirements: [], warnings: [], recipePortions: [] });
const totalPlates = computed(() => lines.value.reduce((sum, line) => sum + (Number.isInteger(line.quantity) && line.quantity >= 0 ? line.quantity : 0), 0));
const mealShares = computed(() => summarizeMealShares(
  lines.value.filter((line) => (!shoppingDate.value || line.date === shoppingDate.value)
    && Number.isInteger(line.quantity) && line.quantity >= 0 && (shoppingDate.value || line.quantity > 0)),
  data.value?.menuItems ?? [],
));
const purchaseGroups = computed(() => summarizePurchases(shopping.value.requirements));
const purchaseHighlights = computed(() => purchaseGroups.value.filter((group) => group.name !== "Otros ingredientes"));
const planWarnings = computed(() => {
  if (!data.value) return ["Sin datos."];
  const result = [...generationWarnings.value];
  if (forecastError.value) result.push(forecastError.value);
  if (!dates.value.length) result.push("Selecciona fechas válidas.");
  if (lines.value.some((line) => !dates.value.includes(line.date))) result.push("Hay líneas fuera del período seleccionado; regenera o corrige el plan.");
  for (const date of dates.value) {
    const target = dailyTargets.value[date];
    const actual = lines.value.filter((line) => line.date === date).reduce((sum, line) => sum + line.quantity, 0);
    if (!Number.isInteger(target) || target < 0 || actual !== target) result.push(`${date}: las cantidades no coinciden con el objetivo diario.`);
  }
  return [...new Set(result)];
});
const approvalWarnings = computed(() => {
  if (!data.value) return ["Sin datos."];
  const result = [...allRequirements.value.warnings, ...planWarnings.value];
  return [...new Set(result)];
});
const warnings = computed(() => [...new Set([...shopping.value.warnings, ...planWarnings.value])]);
const productionNutrition = computed(() => shopping.value.recipePortions.map((portion) => {
  const recipe = data.value?.recipes.find((item) => item.id === portion.recipe);
  if (!recipe || !data.value) return { date: portion.date, recipe: portion.recipe, title: portion.recipe, portions: portion.portions, kcal: null, complete: false };
  const nutrition = calculateRecipeNutrition(recipe, data.value.rows.filter((row) => row.recipe === recipe.id), data.value.ingredients);
  return { date: portion.date, recipe: recipe.id, title: recipe.title, portions: portion.portions,
    kcal: nutrition.includedIngredients && nutrition.perPortion ? nutrition.perPortion.kcal * portion.portions : null,
    complete: nutrition.complete };
}));
watch(selectedIngredient, (id) => {
  const ingredient = data.value?.ingredients.find((row) => row.id === id);
  ingredientForm.value = ingredient ? structuredClone(toRaw(ingredient)) : null;
  nutritionForm.value = ingredient?.nutrition ? { ...ingredient.nutrition } : emptyNutrition();
});
watch(dates, (values) => { if (shoppingDate.value && !values.includes(shoppingDate.value)) shoppingDate.value = ""; });
watch([credits, dates, utilization, extraDaily, buffer, autoDemand], () => syncDemand());
function syncDemand(): boolean {
  if (!autoDemand.value || !data.value || !lines.value.length) return true;
  try {
    if (forecastError.value || !dates.value.length) throw new Error(forecastError.value || "Selecciona fechas válidas.");
    lines.value = rebalanceProductionPlan(lines.value.filter((line) => dates.value.includes(line.date)), forecastTargets.value);
    dailyTargets.value = { ...forecastTargets.value };
    forecastCredits.value = credits.value;
    return true;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : "No se pudieron ajustar las cantidades al saldo actual.";
    return false;
  }
}
async function load() {
  loading.value = true;
  error.value = "";
  try {
    const [loaded] = await Promise.all([api.load(), menu.load({ cache: "no-store", strict: true })]);
    // Category keys are used by weekly menus; catalog relations are resolved here.
    const pb = usePocketBase();
    const categories = await pb.collection("menu_categories").getFullList<{ id: string; key: string }>({ requestKey: null, cache: "no-store" });
    for (const item of loaded.menuItems) item.category = categories.find((category) => category.id === item.category)?.key ?? item.category;
    availableCredits(loaded.memberships);
    data.value = loaded;
    if (!initialized) {
      initialized = true;
      if (tab.value === "plan") {
        const saved = loaded.plans.find((plan) => plan.week_start === weekStart.value);
        if (saved) { viewPlan(saved); notice.value = ""; }
        else generate();
      }
    }
    return syncDemand();
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : "No se pudieron cargar los datos.";
    return false;
  }
  finally { loading.value = false; }
}
async function action(work: () => Promise<void>) {
  busy.value = true; error.value = ""; notice.value = "";
  try { await work(); }
  catch (cause) { error.value = cause instanceof Error ? cause.message : "No se pudo completar la operación."; }
  finally { busy.value = false; }
}
function addLine(date: string) {
  lines.value.push({ key: ++sequence, date, menu_item: "", quantity: 0, weight: 1 });
  dailyTargets.value[date] ??= forecastTargets.value[date] ?? 0;
}
function removeLine(key: number) {
  lines.value = lines.value.filter((line) => line.key !== key);
  syncDemand();
}
async function selectWeek(date: string) {
  if (loading.value || busy.value || !await load()) return;
  weekStart.value = mondayOf(date);
  shoppingDate.value = "";
  savedSnapshot.value = "";
  notice.value = "";
  const saved = data.value?.plans.find((plan) => plan.week_start === weekStart.value);
  if (saved) { viewPlan(saved); notice.value = ""; }
  else generate();
}
function changeWeek(event: Event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  try { selectWeek(weekStartFromInput(input.value)); }
  catch (cause) { error.value = cause instanceof Error ? cause.message : "No se pudo seleccionar la semana."; }
}
function changeMealShare(id: string, percentage: number) {
  error.value = "";
  try {
    if (!shoppingDate.value) throw new Error("Selecciona un día para ajustar los porcentajes.");
    const items = mealShares.value;
    const quantities = allocateMealShare(items, id, percentage);
    items.forEach((item, index) => {
      const matching = lines.value.filter((line) => line.date === shoppingDate.value && line.menu_item === item.id);
      const split = allocatePlates(quantities[index], matching.map((line) => line.quantity || 1));
      matching.forEach((line, position) => { line.quantity = split[position]; line.weight = split[position]; });
    });
    dailyTargets.value[shoppingDate.value] = quantities.reduce((sum, quantity) => sum + quantity, 0);
  } catch (cause) { error.value = cause instanceof Error ? cause.message : "No se pudo ajustar la distribución."; }
}
function rebalance(date: string) {
  error.value = "";
  try {
    lines.value = rebalanceProductionPlan(lines.value, { [date]: dailyTargets.value[date] ?? forecastTargets.value[date] ?? 0 });
  } catch (cause) { error.value = cause instanceof Error ? cause.message : "No se pudieron repartir los platos."; }
}
async function recalculateWeek() {
  if (await load()) generate();
}
function generate() {
  error.value = ""; generationWarnings.value = [];
  if (!data.value) return;
  if (forecastError.value || !dates.value.length) { error.value = forecastError.value || "Selecciona una fecha válida."; return; }
  if (!menu.record.value || menu.loadError.value) { error.value = "No se pudo cargar la rotación del menú. Reintenta antes de generar."; return; }
  forecastCredits.value = credits.value;
  lines.value = [];
  const rec = menu.record.value;
  for (const date of dates.value) {
    dailyTargets.value[date] = forecastTargets.value[date] ?? 0;
    const resolved = resolveDay(date, { blocks: rec.week_blocks ?? [], rotation: rec.rotation ?? [], anchor: rec.rotation_anchor ?? "", overrides: rec.overrides ?? {} });
    if (!resolved) { generationWarnings.value.push(`${date}: sin menú resuelto; confirma si hay servicio o define cantidades manuales.`); continue; }
    const entries = selectedGroups.value.flatMap((group) => (resolved.menu[group] ?? []).map((name) => ({ name, group })));
    const usedItems = new Set<string>();
    for (const { name, group } of entries) {
      const matches = data.value.menuItems.filter((item) => item.category === group && normalize(item.name) === normalize(name));
      if (matches.length !== 1) { generationWarnings.value.push(`${date}: "${name}" no tiene una asociación única con el catálogo.`); continue; }
      const item = matches[0];
      if (usedItems.has(item.id)) continue;
      usedItems.add(item.id);
      lines.value.push({ key: ++sequence, date, menu_item: item.id, quantity: 0, weight: 1 });
    }
    if (lines.value.some((line) => line.date === date)) rebalance(date);
    else generationWarnings.value.push(`${date}: no hay platillos elegibles para repartir.`);
  }
}
async function addMapping(menuItem: string) {
  await action(async () => {
    await api.addComponent(menuItem, mappingRecipe.value[menuItem] ?? "", mappingPortions.value[menuItem] ?? 1);
    await load();
  });
}
async function removeMapping(id: string) { await action(async () => { await api.removeComponent(id); await load(); }); }
async function saveMapping(id: string, portions: number) {
  await action(async () => { await api.saveComponent(id, portions); notice.value = "Porciones guardadas."; });
}
async function createIngredient() {
  await action(async () => { const ingredient = await api.createIngredient(newIngredientName.value); await load(); selectedIngredient.value = ingredient.id; newIngredientName.value = ""; });
}
async function saveIngredient() {
  await action(async () => {
    if (!ingredientForm.value) throw new Error("Selecciona un ingrediente.");
    const saved = await api.saveIngredient({ ...ingredientForm.value, nutrition: { ...nutritionForm.value } });
    const index = data.value!.ingredients.findIndex((ingredient) => ingredient.id === saved.id);
    data.value!.ingredients[index] = saved;
    notice.value = "Ingrediente guardado. Los cálculos se han actualizado.";
  });
}
async function savePlan(approve: boolean) {
  await action(async () => {
    if (!await load()) throw new Error(error.value);
    if (!lines.value.length) throw new Error("Agrega al menos una línea.");
    if (!syncDemand()) throw new Error(error.value);
    if (approve && approvalWarnings.value.length) throw new Error("Corrige los datos del plan antes de guardar una versión fija.");
    if (lines.value.some((line) => !line.menu_item || !Number.isInteger(line.quantity) || line.quantity < 0)) throw new Error("Corrige platillos y cantidades enteras.");
    const ingredientRows = data.value!.rows.filter((row) => allRequirements.value.recipePortions.some((portion) => portion.recipe === row.recipe));
    const ingredientIds = new Set(ingredientRows.map((row) => row.ingredient));
    const snapshot = {
      generated_at: new Date().toISOString(), credits: credits.value,
      requirements: allRequirements.value, warnings: approvalWarnings.value,
      recipes: data.value!.recipes.filter((recipe) => allRequirements.value.recipePortions.some((portion) => portion.recipe === recipe.id)),
      ingredient_rows: ingredientRows,
      ingredients: data.value!.ingredients.filter((ingredient) => ingredientIds.has(ingredient.id)),
      components: effectiveComponents.value.filter((component) => lines.value.some((line) => line.menu_item === component.menu_item)),
    };
    const saved = await api.savePlan({
      week_start: weekStart.value, status: approve ? "approved" : "draft",
      parameters: { serviceDays: serviceDays.value, utilization: utilization.value, extraDaily: extraDaily.value, walkInDaily: extraDaily.value, buffer: buffer.value, showNutrition: showNutrition.value, selectedGroups: selectedGroups.value, dailyTargets: dailyTargets.value, forecastCredits: forecastCredits.value, autoDemand: autoDemand.value },
      lines: lines.value.map(({ date, menu_item, quantity, weight }) => ({ date, menu_item, quantity, weight })), snapshot,
    });
    data.value!.plans.unshift(saved);
    notice.value = approve ? "Versión fija guardada. Se conservó una instantánea independiente de futuras ediciones." : "Plan guardado.";
  });
}
function viewPlan(plan: SavedMealPlan) {
  savedSnapshot.value = JSON.stringify(plan.snapshot, null, 2);
  weekStart.value = plan.week_start;
  const params = plan.parameters;
  autoDemand.value = params.autoDemand !== false;
  const snapshotCredits = plan.snapshot && typeof plan.snapshot === "object" && "credits" in plan.snapshot ? plan.snapshot.credits : null;
  const basis = "forecastCredits" in params ? params.forecastCredits : snapshotCredits;
  forecastCredits.value = typeof basis === "number" && Number.isFinite(basis) && basis >= 0 ? basis : null;
  if (typeof params.serviceDays === "number") serviceDays.value = params.serviceDays;
  if (typeof params.utilization === "number") utilization.value = params.utilization;
  extraDaily.value = typeof params.walkInDaily === "number" ? params.walkInDaily
    : typeof params.extraDaily === "number" && params.extraDaily > 0 ? params.extraDaily : 15;
  if (typeof params.buffer === "number") buffer.value = params.buffer;
  if (typeof params.showNutrition === "boolean") showNutrition.value = params.showNutrition;
  if (Array.isArray(params.selectedGroups) && params.selectedGroups.every((group) => typeof group === "string")) selectedGroups.value = params.selectedGroups;
  dailyTargets.value = {};
  if (params.dailyTargets && typeof params.dailyTargets === "object") {
    for (const [date, target] of Object.entries(params.dailyTargets)) if (typeof target === "number") dailyTargets.value[date] = target;
  }
  if (Array.isArray(plan.lines)) {
    lines.value = plan.lines.flatMap((line: unknown) => {
      if (!line || typeof line !== "object") return [];
      const item = line as Record<string, unknown>;
      return typeof item.date === "string" && typeof item.menu_item === "string" && typeof item.quantity === "number"
        ? [{ key: ++sequence, date: item.date, menu_item: item.menu_item, quantity: item.quantity, weight: typeof item.weight === "number" ? item.weight : 1 }] : [];
    });
  }
  generationWarnings.value = [];
  if (!syncDemand()) return;
  notice.value = "Plan de la semana cargado. Los cambios se guardarán como una nueva versión.";
}
async function exportShoppingList() {
  if (loading.value || busy.value || !await load()) return;
  const period = shoppingDate.value ? `Día: ${shoppingDate.value}` : `Semana: ${weekStart.value} al ${addDays(weekStart.value, 6)}`;
  const content = buildShoppingText(shopping.value.requirements, period, warnings.value, {
    plannedPlates: mealShares.value.reduce((total, item) => total + item.quantity, 0),
    availableCredits: credits.value, forecastCredits: forecastCredits.value,
    walkIns: { daily: extraDaily.value, days: shoppingDate.value ? 1 : serviceDays.value },
  });
  const url = URL.createObjectURL(new Blob(["\uFEFF", content], { type: "text/plain;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `compras-${shoppingDate.value || weekStart.value}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
onMounted(load);
</script>
