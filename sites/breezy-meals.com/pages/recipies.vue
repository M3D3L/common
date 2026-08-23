<template>
  <main class="mx-auto max-w-7xl px-4 pb-20 pt-8">
    <header class="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-primary">
          Recetario de cocina
        </p>
        <h1 class="mt-1 text-3xl font-bold tracking-tight">Recetas</h1>
        <p class="mt-2 max-w-2xl text-sm text-muted-foreground">
          Consulta ingredientes, tiempos y preparación desde un solo lugar.
        </p>
      </div>
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <BookOpen :size="18" />
        <span class="font-semibold text-foreground">{{ recipes.length }}</span>
        recetas únicas
      </div>
    </header>

    <section class="mb-6 grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3">
      <button
        v-for="summary in summaries"
        :key="summary.value"
        type="button"
        class="rounded-lg border bg-card px-3 py-3 text-left transition-colors hover:bg-muted/60"
        :class="
          status === summary.value
            ? 'border-primary ring-1 ring-primary'
            : 'border-border'
        "
        @click="status = summary.value"
      >
        <span class="block text-xl font-bold tabular-nums">{{
          summary.count
        }}</span>
        <span class="mt-0.5 block text-xs text-muted-foreground">{{
          summary.label
        }}</span>
      </button>
    </section>

    <section class="mb-6 flex flex-col gap-3 sm:flex-row">
      <div class="relative min-w-0 flex-1">
        <Search
          :size="17"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          v-model="query"
          class="pl-9"
          placeholder="Buscar receta, ingrediente o categoría..."
          aria-label="Buscar recetas"
        />
      </div>
      <Select v-model="category">
        <SelectTrigger class="w-full sm:w-56">
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          <SelectItem v-for="item in categories" :key="item" :value="item">
            {{ item }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Button
        v-if="hasFilters"
        variant="outline"
        class="shrink-0"
        @click="clearFilters"
      >
        <X :size="16" class="mr-2" />
        Limpiar
      </Button>
    </section>

    <div class="mb-4 flex items-center justify-between gap-3">
      <p class="text-sm text-muted-foreground">
        <span class="font-semibold text-foreground">{{
          filteredRecipes.length
        }}</span>
        resultados
      </p>
      <Select v-model="sortBy">
        <SelectTrigger class="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="title">Nombre A-Z</SelectItem>
          <SelectItem value="newest">ID más reciente</SelectItem>
          <SelectItem value="time">Menor tiempo</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div
      v-if="filteredRecipes.length"
      class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <Card
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="group min-w-0 cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
        tabindex="0"
        role="button"
        :aria-label="`Abrir ${recipe.title}`"
        @click="openRecipe(recipe)"
        @keydown.enter="openRecipe(recipe)"
      >
        <div class="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            v-if="recipe.image"
            :src="recipe.image"
            :alt="recipe.title"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div v-else class="grid h-full place-items-center">
            <ImageOff :size="28" class="text-muted-foreground" />
          </div>
          <Badge
            class="absolute left-3 top-3 shadow-sm"
            :variant="statusVariant(recipeStatus(recipe))"
          >
            {{ statusLabel(recipeStatus(recipe)) }}
          </Badge>
        </div>
        <CardHeader class="space-y-2 p-4">
          <CardTitle class="line-clamp-2 text-base leading-snug">
            {{ recipe.title }}
          </CardTitle>
          <div
            class="flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"
          >
            <span
              v-if="recipe.totalTime"
              class="inline-flex items-center gap-1"
            >
              <Clock3 :size="13" /> {{ recipe.totalTime }}
            </span>
            <span v-if="recipe.servings" class="inline-flex items-center gap-1">
              <Users :size="13" /> {{ recipe.servings }}
            </span>
          </div>
          <p
            v-if="recipe.category"
            class="truncate text-xs text-muted-foreground"
          >
            {{ recipe.category }}
          </p>
        </CardHeader>
      </Card>
    </div>

    <div
      v-else
      class="rounded-lg border border-dashed border-border px-6 py-16 text-center"
    >
      <SearchX :size="32" class="mx-auto text-muted-foreground" />
      <h2 class="mt-3 font-semibold">No se encontraron recetas</h2>
      <p class="mt-1 text-sm text-muted-foreground">
        Prueba otra búsqueda o limpia los filtros.
      </p>
      <Button class="mt-4" variant="outline" @click="clearFilters"
        >Limpiar filtros</Button
      >
    </div>

    <Sheet v-model:open="detailsOpen">
      <SheetContent
        side="right"
        class="w-full overflow-y-auto p-0 sm:max-w-2xl print:static print:w-full print:max-w-none print:border-0 print:shadow-none"
      >
        <article
          v-if="selectedRecipe"
          id="print-recipe"
          class="min-h-full bg-background"
        >
          <div
            class="relative aspect-[16/8] overflow-hidden bg-muted print:aspect-[16/6]"
          >
            <img
              v-if="selectedRecipe.image"
              :src="selectedRecipe.image"
              :alt="selectedRecipe.title"
              class="h-full w-full object-cover"
            />
          </div>

          <div class="space-y-6 p-5 sm:p-7 print:p-0 print:pt-5">
            <SheetHeader class="pr-8 text-left">
              <div class="flex flex-wrap items-center gap-2">
                <Badge :variant="statusVariant(recipeStatus(selectedRecipe))">
                  {{ statusLabel(recipeStatus(selectedRecipe)) }}
                </Badge>
                <Badge v-if="selectedRecipe.category" variant="outline">
                  {{ selectedRecipe.category }}
                </Badge>
              </div>
              <SheetTitle class="pt-2 text-2xl leading-tight">
                {{ selectedRecipe.title }}
              </SheetTitle>
              <SheetDescription class="sr-only">
                Ingredientes y preparación de {{ selectedRecipe.title }}
              </SheetDescription>
            </SheetHeader>

            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div
                v-if="selectedRecipe.prepTime"
                class="rounded-md bg-muted/60 p-3"
              >
                <span class="block text-xs text-muted-foreground"
                  >Preparación</span
                >
                <span class="mt-1 block text-sm font-semibold">{{
                  selectedRecipe.prepTime
                }}</span>
              </div>
              <div
                v-if="selectedRecipe.totalTime"
                class="rounded-md bg-muted/60 p-3"
              >
                <span class="block text-xs text-muted-foreground">Total</span>
                <span class="mt-1 block text-sm font-semibold">{{
                  selectedRecipe.totalTime
                }}</span>
              </div>
              <div
                v-if="selectedRecipe.servings"
                class="rounded-md bg-muted/60 p-3"
              >
                <span class="block text-xs text-muted-foreground"
                  >Rendimiento</span
                >
                <span class="mt-1 block text-sm font-semibold">{{
                  selectedRecipe.servings
                }}</span>
              </div>
              <div
                v-if="selectedRecipe.nutrition?.calories"
                class="rounded-md bg-muted/60 p-3"
              >
                <span class="block text-xs text-muted-foreground">Energía</span>
                <span class="mt-1 block text-sm font-semibold">{{
                  selectedRecipe.nutrition.calories
                }}</span>
              </div>
            </div>

            <Alert v-if="recipeStatus(selectedRecipe) !== 'complete'">
              <CircleAlert :size="17" />
              <AlertTitle>Datos incompletos</AlertTitle>
              <AlertDescription>
                {{
                  selectedRecipe.hasDetail
                    ? "Se encontraron ingredientes, pero faltan los pasos de preparación."
                    : "Esta receta solo está en el índice. Abre la fuente para consultar el detalle."
                }}
              </AlertDescription>
            </Alert>

            <section
              v-if="selectedRecipe.ingredients?.length"
              class="break-inside-avoid"
            >
              <div class="mb-3 flex items-center gap-2">
                <ListChecks :size="18" class="text-primary" />
                <h2 class="text-lg font-bold">Ingredientes</h2>
                <Badge variant="secondary">{{
                  selectedRecipe.ingredients.length
                }}</Badge>
              </div>
              <ul class="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                <li
                  v-for="ingredient in selectedRecipe.ingredients"
                  :key="ingredient"
                  class="flex items-start gap-2 text-sm leading-relaxed"
                >
                  <span
                    class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  />
                  {{ ingredient }}
                </li>
              </ul>
            </section>

            <Separator
              v-if="
                selectedRecipe.ingredients?.length &&
                selectedRecipe.steps?.length
              "
            />

            <section v-if="selectedRecipe.steps?.length">
              <div class="mb-4 flex items-center gap-2">
                <ChefHat :size="19" class="text-primary" />
                <h2 class="text-lg font-bold">Preparación</h2>
              </div>
              <ol class="space-y-4">
                <li
                  v-for="(step, index) in selectedRecipe.steps"
                  :key="`${selectedRecipe.id}-${index}`"
                  class="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-relaxed"
                >
                  <span
                    class="grid h-8 w-8 place-items-center rounded-full bg-primary font-bold text-primary-foreground"
                  >
                    {{ index + 1 }}
                  </span>
                  <p class="pt-1">{{ step }}</p>
                </li>
              </ol>
            </section>

            <section v-if="selectedRecipe.nutrition" class="break-inside-avoid">
              <Separator class="mb-5" />
              <h2 class="mb-3 text-sm font-bold uppercase tracking-widest">
                Nutrición
              </h2>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-if="selectedRecipe.nutrition.calories"
                  variant="outline"
                  >{{ selectedRecipe.nutrition.calories }}</Badge
                >
                <Badge v-if="selectedRecipe.nutrition.protein" variant="outline"
                  >Proteína {{ selectedRecipe.nutrition.protein }}</Badge
                >
                <Badge v-if="selectedRecipe.nutrition.carbs" variant="outline"
                  >Carbohidratos {{ selectedRecipe.nutrition.carbs }}</Badge
                >
                <Badge v-if="selectedRecipe.nutrition.fat" variant="outline"
                  >Grasa {{ selectedRecipe.nutrition.fat }}</Badge
                >
              </div>
            </section>

            <SheetFooter class="flex-row gap-2 border-t pt-5 print:hidden">
              <Button variant="outline" as-child>
                <a
                  :href="selectedRecipe.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink :size="16" class="mr-2" /> Fuente
                </a>
              </Button>
              <Button @click="printRecipe">
                <Printer :size="16" class="mr-2" /> Imprimir
              </Button>
            </SheetFooter>
          </div>
        </article>
      </SheetContent>
    </Sheet>
  </main>
</template>

<script setup lang="ts">
import recipesData from "../../../tools/recipe-scraper/output/recipes.json";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@common/components/ui/alert";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Card, CardHeader, CardTitle } from "@common/components/ui/card";
import { Input } from "@common/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import { Separator } from "@common/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@common/components/ui/sheet";
import {
  BookOpen,
  ChefHat,
  CircleAlert,
  Clock3,
  ExternalLink,
  ImageOff,
  ListChecks,
  Printer,
  Search,
  SearchX,
  Users,
  X,
} from "lucide-vue-next";

type RecipeStatus = "complete" | "incomplete" | "index";
interface Nutrition {
  calories?: string | null;
  carbs?: string | null;
  fat?: string | null;
  protein?: string | null;
}
interface Recipe {
  id: string;
  title: string;
  url: string;
  image?: string | null;
  servings?: string | null;
  prepTime?: string | null;
  cookTime?: string | null;
  totalTime?: string | null;
  category?: string | null;
  ingredients?: string[];
  steps?: string[];
  nutrition?: Nutrition | null;
  hasDetail: boolean;
}

const recipes = recipesData as Recipe[];
const query = ref("");
const status = ref<"all" | RecipeStatus>("all");
const category = ref("all");
const sortBy = ref<"title" | "newest" | "time">("title");
const selectedRecipe = ref<Recipe | null>(null);
const detailsOpen = ref(false);

const recipeStatus = (recipe: Recipe): RecipeStatus => {
  if (!recipe.hasDetail) return "index";
  return recipe.steps?.length ? "complete" : "incomplete";
};
const statusLabel = (value: RecipeStatus) =>
  ({
    complete: "Completa",
    incomplete: "Sin preparación",
    index: "Solo índice",
  })[value];
const statusVariant = (value: RecipeStatus) =>
  (
    ({
      complete: "default",
      incomplete: "secondary",
      index: "outline",
    }) as const
  )[value];

const summaries = computed(() => [
  { value: "all" as const, label: "Todas", count: recipes.length },
  {
    value: "complete" as const,
    label: "Completas",
    count: recipes.filter((recipe) => recipeStatus(recipe) === "complete")
      .length,
  },
  {
    value: "incomplete" as const,
    label: "Por completar",
    count: recipes.filter((recipe) => recipeStatus(recipe) !== "complete")
      .length,
  },
]);

const categories = computed(() =>
  [
    ...new Set(
      recipes.flatMap(
        (recipe) =>
          recipe.category?.split(",").map((item) => item.trim()) || [],
      ),
    ),
  ]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es")),
);

const durationMinutes = (value?: string | null) => {
  if (!value) return Number.POSITIVE_INFINITY;
  const hours = Number(value.match(/(\d+)\s*h/)?.[1] || 0);
  const minutes = Number(value.match(/(\d+)\s*min/)?.[1] || 0);
  return hours * 60 + minutes;
};

const filteredRecipes = computed(() => {
  const term = query.value.trim().toLocaleLowerCase("es");
  const result = recipes.filter((recipe) => {
    const matchesStatus =
      status.value === "all" ||
      (status.value === "incomplete"
        ? recipeStatus(recipe) !== "complete"
        : recipeStatus(recipe) === status.value);
    const matchesCategory =
      category.value === "all" ||
      recipe.category
        ?.split(",")
        .map((item) => item.trim())
        .includes(category.value);
    const haystack = [
      recipe.title,
      recipe.category,
      ...(recipe.ingredients || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("es");
    return (
      matchesStatus && matchesCategory && (!term || haystack.includes(term))
    );
  });

  return result.sort((a, b) => {
    if (sortBy.value === "newest") {
      return Number(b.id.slice(1)) - Number(a.id.slice(1));
    }
    if (sortBy.value === "time") {
      return durationMinutes(a.totalTime) - durationMinutes(b.totalTime);
    }
    return a.title.localeCompare(b.title, "es");
  });
});

const hasFilters = computed(
  () =>
    Boolean(query.value) || status.value !== "all" || category.value !== "all",
);
const clearFilters = () => {
  query.value = "";
  status.value = "all";
  category.value = "all";
};
const openRecipe = (recipe: Recipe) => {
  selectedRecipe.value = recipe;
  detailsOpen.value = true;
};
const printRecipe = () => window.print();

definePageMeta({ layout: "staff" });
useSeoMeta({ title: "Recetas | Breezy Meals", robots: "noindex, nofollow" });
</script>

<style>
@media print {
  body > * {
    visibility: hidden;
  }
  [data-reka-dialog-overlay] {
    display: none !important;
  }
  #print-recipe,
  #print-recipe * {
    visibility: visible;
  }
  #print-recipe {
    position: absolute;
    inset: 0;
    width: 100%;
  }
}
</style>
