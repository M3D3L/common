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
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen :size="18" />
          <span class="font-semibold text-foreground">{{
            recipes.length
          }}</span>
          recetas únicas
        </div>
        <Button @click="openCreateForm">
          <Plus :size="16" class="mr-2" /> Nueva receta
        </Button>
      </div>
    </header>

    <div
      v-if="loading"
      class="rounded-lg border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground"
    >
      Cargando recetas...
    </div>

    <Alert v-else-if="loadError" variant="destructive" class="mb-6">
      <CircleAlert :size="17" />
      <AlertTitle>No se pudieron cargar las recetas</AlertTitle>
      <AlertDescription
        class="flex flex-wrap items-center justify-between gap-3"
      >
        <span>{{ loadError }}</span>
        <Button size="sm" variant="outline" @click="loadRecipes"
          >Reintentar</Button
        >
      </AlertDescription>
    </Alert>

    <template v-else>
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
          <X :size="16" class="mr-2" /> Limpiar
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
          <SelectTrigger class="w-44"><SelectValue /></SelectTrigger>
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
          v-for="recipe in visibleRecipes"
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
            <!-- <Badge
              class="absolute left-3 top-3 shadow-sm"
              :variant="statusVariant(recipeStatus(recipe))"
            >
              {{ statusLabel(recipeStatus(recipe)) }}
            </Badge> -->
          </div>
          <CardHeader class="space-y-2 p-4">
            <CardTitle class="line-clamp-2 text-base leading-snug">{{
              recipe.title
            }}</CardTitle>
            <div
              class="flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"
            >
              <span
                v-if="recipe.totalTime"
                class="inline-flex items-center gap-1"
              >
                <Clock3 :size="13" /> {{ recipe.totalTime }}
              </span>
              <span
                v-if="recipe.servings"
                class="inline-flex items-center gap-1"
              >
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
        v-if="canLoadMore"
        ref="loadMoreTarget"
        class="flex min-h-20 items-center justify-center py-6 text-sm text-muted-foreground"
        aria-live="polite"
      >
        Cargando más recetas...
      </div>

      <div
        v-if="!filteredRecipes.length"
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
    </template>

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
              <SheetTitle class="pt-2 text-2xl leading-tight">{{
                selectedRecipe.title
              }}</SheetTitle>
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
                >
                  {{ selectedRecipe.nutrition.calories }}
                </Badge>
                <Badge
                  v-if="selectedRecipe.nutrition.protein"
                  variant="outline"
                >
                  Proteína {{ selectedRecipe.nutrition.protein }}
                </Badge>
                <Badge v-if="selectedRecipe.nutrition.carbs" variant="outline">
                  Carbohidratos {{ selectedRecipe.nutrition.carbs }}
                </Badge>
                <Badge v-if="selectedRecipe.nutrition.fat" variant="outline">
                  Grasa {{ selectedRecipe.nutrition.fat }}
                </Badge>
              </div>
            </section>

            <SheetFooter class="flex-row gap-2 border-t pt-5 print:hidden">
              <Button variant="outline" @click="openEditForm(selectedRecipe)">
                <Pencil :size="16" class="mr-2" /> Editar
              </Button>
              <Button
                variant="outline"
                class="text-destructive hover:text-destructive"
                :disabled="saving"
                @click="deleteRecipe(selectedRecipe)"
              >
                <Trash2 :size="16" class="mr-2" /> Eliminar
              </Button>
              <Button variant="outline" as-child>
                <a
                  :href="selectedRecipe.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink :size="16" class="mr-2" /> Fuente
                </a>
              </Button>
              <Button @click="printRecipe"
                ><Printer :size="16" class="mr-2" /> Imprimir</Button
              >
            </SheetFooter>
          </div>
        </article>
      </SheetContent>
    </Sheet>

    <Dialog v-model:open="formOpen">
      <DialogScrollContent class="max-w-3xl">
        <DialogHeader>
          <div class="flex flex-wrap items-center justify-between gap-3 pr-8">
            <DialogTitle>{{
              editingRecipeId ? "Editar receta" : "Nueva receta"
            }}</DialogTitle>
            <Button
              size="sm"
              variant="outline"
              :disabled="aiLoading || saving || !form.title.trim()"
              @click="completeWithAi"
            >
              <LoaderCircle
                v-if="aiLoading"
                :size="15"
                class="mr-2 animate-spin"
              />
              <WandSparkles v-else :size="15" class="mr-2" />
              {{ aiLoading ? "Completando..." : "Completar con IA" }}
            </Button>
          </div>
          <DialogDescription>
            Guarda los datos de la receta en el catálogo compartido. La IA solo
            completa campos vacíos.
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1.5 sm:col-span-2">
            <Label for="recipe-title">Nombre</Label>
            <Input
              id="recipe-title"
              v-model="form.title"
              placeholder="Nombre de la receta"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="recipe-id">ID</Label>
            <Input id="recipe-id" v-model="form.id" placeholder="r123456" />
          </div>
          <div class="space-y-1.5">
            <Label for="recipe-category">Categoría</Label>
            <Input
              id="recipe-category"
              v-model="form.category"
              placeholder="Carnes y aves"
            />
          </div>
          <div class="space-y-1.5 sm:col-span-2">
            <Label for="recipe-url">URL de origen</Label>
            <Input
              id="recipe-url"
              v-model="form.url"
              type="url"
              placeholder="https://..."
            />
          </div>
          <div class="space-y-1.5 sm:col-span-2">
            <Label for="recipe-image">Imagen</Label>
            <Input
              id="recipe-image"
              v-model="form.image"
              type="url"
              placeholder="https://..."
            />
          </div>
          <div class="space-y-1.5">
            <Label for="recipe-servings">Porciones</Label>
            <Input
              id="recipe-servings"
              v-model="form.servings"
              placeholder="10 porciones"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="recipe-prep-time">Preparación</Label>
            <Input
              id="recipe-prep-time"
              v-model="form.prepTime"
              placeholder="15 min"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="recipe-cook-time">Cocción</Label>
            <Input
              id="recipe-cook-time"
              v-model="form.cookTime"
              placeholder="30 min"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="recipe-total-time">Tiempo total</Label>
            <Input
              id="recipe-total-time"
              v-model="form.totalTime"
              placeholder="45 min"
            />
          </div>
          <div class="space-y-1.5 sm:col-span-2">
            <Label for="recipe-ingredients">Ingredientes, uno por línea</Label>
            <Textarea
              id="recipe-ingredients"
              v-model="form.ingredientsText"
              rows="7"
            />
          </div>
          <div class="space-y-1.5 sm:col-span-2">
            <Label for="recipe-steps">Preparación, un paso por línea</Label>
            <Textarea id="recipe-steps" v-model="form.stepsText" rows="7" />
          </div>
          <div class="space-y-1.5">
            <Label for="recipe-calories">Calorías</Label>
            <Input
              id="recipe-calories"
              v-model="form.calories"
              placeholder="320 kcal"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="recipe-protein">Proteína</Label>
            <Input
              id="recipe-protein"
              v-model="form.protein"
              placeholder="24 g"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="recipe-carbs">Carbohidratos</Label>
            <Input id="recipe-carbs" v-model="form.carbs" placeholder="30 g" />
          </div>
          <div class="space-y-1.5">
            <Label for="recipe-fat">Grasa</Label>
            <Input id="recipe-fat" v-model="form.fat" placeholder="12 g" />
          </div>
        </div>

        <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>

        <DialogFooter>
          <Button variant="outline" :disabled="saving" @click="formOpen = false"
            >Cancelar</Button
          >
          <Button :disabled="saving || !form.title.trim()" @click="saveRecipe">
            <LoaderCircle v-if="saving" :size="16" class="mr-2 animate-spin" />
            <Save v-else :size="16" class="mr-2" />
            {{ saving ? "Guardando..." : "Guardar receta" }}
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  </main>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@common/components/ui/alert";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Card, CardHeader, CardTitle } from "@common/components/ui/card";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from "@common/components/ui/dialog";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import { Separator } from "@common/components/ui/separator";
import { Textarea } from "@common/components/ui/textarea";
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
  LoaderCircle,
  Pencil,
  Plus,
  Printer,
  Save,
  Search,
  SearchX,
  Trash2,
  Users,
  WandSparkles,
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

interface RecipeForm {
  id: string;
  title: string;
  url: string;
  image: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  category: string;
  ingredientsText: string;
  stepsText: string;
  calories: string;
  carbs: string;
  fat: string;
  protein: string;
}

const COLLECTION = "recipies";
const { fetchCollection, createItem, updateItem } = usePocketBaseCore();
const { run: runChatGPT, loading: aiLoading } = useChatGPT();
const recipes = ref<Recipe[]>([]);
const collectionRecordId = ref("");
const loading = ref(true);
const saving = ref(false);
const loadError = ref("");
const formError = ref("");
const formOpen = ref(false);
const editingRecipeId = ref("");
const query = ref("");
const category = ref("all");
const sortBy = ref<"title" | "newest" | "time">("title");
const selectedRecipe = ref<Recipe | null>(null);
const detailsOpen = ref(false);
const loadMoreTarget = ref<HTMLElement | null>(null);
const visibleCount = ref(24);
const emptyForm = (): RecipeForm => ({
  id: "",
  title: "",
  url: "",
  image: "",
  servings: "10 porciones",
  prepTime: "",
  cookTime: "",
  totalTime: "",
  category: "",
  ingredientsText: "",
  stepsText: "",
  calories: "",
  carbs: "",
  fat: "",
  protein: "",
});
const form = reactive<RecipeForm>(emptyForm());

const parseRecipeData = (value: unknown): Recipe[] => {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((recipe): recipe is Recipe =>
    Boolean(
      recipe &&
      typeof recipe === "object" &&
      typeof recipe.id === "string" &&
      typeof recipe.title === "string",
    ),
  );
};

const loadRecipes = async () => {
  loading.value = true;
  loadError.value = "";
  try {
    const response = await fetchCollection(
      COLLECTION,
      1,
      1,
      "",
      "-created",
      null,
      null,
      true,
    );
    const record = response.items[0] as Record<string, unknown> | undefined;
    collectionRecordId.value = String(record?.id ?? "");
    recipes.value = parseRecipeData(record?.data);
  } catch (error) {
    loadError.value =
      error instanceof Error ? error.message : "Error desconocido.";
  } finally {
    loading.value = false;
  }
};

const persistRecipes = async (nextRecipes: Recipe[]) => {
  if (collectionRecordId.value) {
    await updateItem(COLLECTION, collectionRecordId.value, {
      data: nextRecipes,
    });
  } else {
    const record = await createItem(COLLECTION, { data: nextRecipes });
    collectionRecordId.value = String(record.id);
  }
  recipes.value = nextRecipes;
};

const openCreateForm = () => {
  editingRecipeId.value = "";
  formError.value = "";
  Object.assign(form, emptyForm(), { id: `r${Date.now()}` });
  formOpen.value = true;
};

const openEditForm = (recipe: Recipe) => {
  editingRecipeId.value = recipe.id;
  formError.value = "";
  Object.assign(form, emptyForm(), {
    id: recipe.id,
    title: recipe.title,
    url: recipe.url ?? "",
    image: recipe.image ?? "",
    servings: recipe.servings ?? "",
    prepTime: recipe.prepTime ?? "",
    cookTime: recipe.cookTime ?? "",
    totalTime: recipe.totalTime ?? "",
    category: recipe.category ?? "",
    ingredientsText: (recipe.ingredients ?? []).join("\n"),
    stepsText: (recipe.steps ?? []).join("\n"),
    calories: recipe.nutrition?.calories ?? "",
    carbs: recipe.nutrition?.carbs ?? "",
    fat: recipe.nutrition?.fat ?? "",
    protein: recipe.nutrition?.protein ?? "",
  });
  formOpen.value = true;
};

const lines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

type AiRecipeFields = Partial<{
  category: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  ingredients: string[];
  steps: string[];
  calories: string;
  carbs: string;
  fat: string;
  protein: string;
}>;

const missingAiFields = () => {
  const fields: string[] = [];
  if (!form.category.trim()) fields.push("category");
  if (!form.servings.trim()) fields.push("servings");
  if (!form.prepTime.trim()) fields.push("prepTime");
  if (!form.cookTime.trim()) fields.push("cookTime");
  if (!form.totalTime.trim()) fields.push("totalTime");
  if (!lines(form.ingredientsText).length) fields.push("ingredients");
  if (!lines(form.stepsText).length) fields.push("steps");
  if (!form.calories.trim()) fields.push("calories");
  if (!form.carbs.trim()) fields.push("carbs");
  if (!form.fat.trim()) fields.push("fat");
  if (!form.protein.trim()) fields.push("protein");
  return fields;
};

const parseAiFields = (raw: string): AiRecipeFields => {
  const json = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? raw;
  return JSON.parse(json.trim()) as AiRecipeFields;
};

const completeWithAi = async () => {
  formError.value = "";
  const missingFields = missingAiFields();
  if (!missingFields.length) {
    formError.value = "No hay campos culinarios pendientes por completar.";
    return;
  }

  const command = `Completa únicamente los campos faltantes de una receta para 10 porciones. Usa cocina práctica, cantidades métricas y pasos claros en español. No modifiques ni contradigas los datos existentes. Devuelve solo JSON válido y exclusivamente las claves solicitadas. ingredients y steps deben ser arrays de strings. Los tiempos deben usar formatos como "15 min" o "1 h 20 min". La nutrición debe ser una estimación por porción con unidades, por ejemplo "320 kcal" o "24 g". Si falta información para inferir un campo razonablemente, omítelo en vez de inventar una fuente o URL.`;

  try {
    const raw = await runChatGPT(command, {
      missingFields,
      recipe: {
        title: form.title.trim(),
        category: form.category.trim() || undefined,
        servings: form.servings.trim() || "10 porciones",
        prepTime: form.prepTime.trim() || undefined,
        cookTime: form.cookTime.trim() || undefined,
        totalTime: form.totalTime.trim() || undefined,
        ingredients: lines(form.ingredientsText),
        steps: lines(form.stepsText),
        nutrition: {
          calories: form.calories.trim() || undefined,
          carbs: form.carbs.trim() || undefined,
          fat: form.fat.trim() || undefined,
          protein: form.protein.trim() || undefined,
        },
      },
    });
    const result = parseAiFields(raw);
    const requested = new Set(missingFields);
    const assignString = (field: keyof RecipeForm, value: unknown) => {
      if (typeof value === "string" && value.trim() && !form[field].trim()) {
        form[field] = value.trim();
      }
    };

    if (requested.has("category")) assignString("category", result.category);
    if (requested.has("servings")) assignString("servings", result.servings);
    if (requested.has("prepTime")) assignString("prepTime", result.prepTime);
    if (requested.has("cookTime")) assignString("cookTime", result.cookTime);
    if (requested.has("totalTime")) assignString("totalTime", result.totalTime);
    if (requested.has("calories")) assignString("calories", result.calories);
    if (requested.has("carbs")) assignString("carbs", result.carbs);
    if (requested.has("fat")) assignString("fat", result.fat);
    if (requested.has("protein")) assignString("protein", result.protein);
    if (
      requested.has("ingredients") &&
      !lines(form.ingredientsText).length &&
      Array.isArray(result.ingredients)
    ) {
      form.ingredientsText = result.ingredients
        .filter((item) => typeof item === "string")
        .join("\n");
    }
    if (
      requested.has("steps") &&
      !lines(form.stepsText).length &&
      Array.isArray(result.steps)
    ) {
      form.stepsText = result.steps
        .filter((item) => typeof item === "string")
        .join("\n");
    }
  } catch (error) {
    formError.value =
      error instanceof Error
        ? error.message
        : "No se pudieron completar los campos con IA.";
  }
};

const recipeFromForm = (): Recipe => {
  const ingredients = lines(form.ingredientsText);
  const steps = lines(form.stepsText);
  const nutrition = {
    calories: form.calories.trim() || null,
    carbs: form.carbs.trim() || null,
    fat: form.fat.trim() || null,
    protein: form.protein.trim() || null,
  };
  const existing = recipes.value.find(
    (recipe) => recipe.id === editingRecipeId.value,
  );
  return {
    ...existing,
    id: form.id.trim(),
    title: form.title.trim(),
    url: form.url.trim(),
    image: form.image.trim() || null,
    servings: form.servings.trim() || null,
    prepTime: form.prepTime.trim() || null,
    cookTime: form.cookTime.trim() || null,
    totalTime: form.totalTime.trim() || null,
    category: form.category.trim() || null,
    ingredients,
    steps,
    nutrition: Object.values(nutrition).some(Boolean) ? nutrition : null,
    hasDetail: Boolean(ingredients.length || steps.length),
  };
};

const saveRecipe = async () => {
  formError.value = "";
  const recipe = recipeFromForm();
  if (!recipe.id || !recipe.title) {
    formError.value = "El ID y el nombre son obligatorios.";
    return;
  }
  const duplicate = recipes.value.some(
    (item) => item.id === recipe.id && item.id !== editingRecipeId.value,
  );
  if (duplicate) {
    formError.value = "Ya existe una receta con ese ID.";
    return;
  }

  saving.value = true;
  try {
    const nextRecipes = editingRecipeId.value
      ? recipes.value.map((item) =>
          item.id === editingRecipeId.value ? recipe : item,
        )
      : [...recipes.value, recipe];
    await persistRecipes(nextRecipes);
    selectedRecipe.value = recipe;
    formOpen.value = false;
  } catch (error) {
    formError.value =
      error instanceof Error ? error.message : "No se pudo guardar la receta.";
  } finally {
    saving.value = false;
  }
};

const deleteRecipe = async (recipe: Recipe) => {
  if (
    !confirm(`¿Eliminar "${recipe.title}"? Esta acción no se puede deshacer.`)
  )
    return;
  saving.value = true;
  try {
    await persistRecipes(recipes.value.filter((item) => item.id !== recipe.id));
    detailsOpen.value = false;
    selectedRecipe.value = null;
  } catch (error) {
    loadError.value =
      error instanceof Error ? error.message : "No se pudo eliminar la receta.";
  } finally {
    saving.value = false;
  }
};

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

const categories = computed(() =>
  [
    ...new Set(
      recipes.value.flatMap(
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
  const result = recipes.value.filter((recipe) => {
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
    return matchesCategory && (!term || haystack.includes(term));
  });

  return result.sort((a, b) => {
    if (sortBy.value === "newest")
      return Number(b.id.slice(1)) - Number(a.id.slice(1));
    if (sortBy.value === "time")
      return durationMinutes(a.totalTime) - durationMinutes(b.totalTime);
    return a.title.localeCompare(b.title, "es");
  });
});

const visibleRecipes = computed(() =>
  filteredRecipes.value.slice(0, visibleCount.value),
);
const canLoadMore = computed(
  () => visibleCount.value < filteredRecipes.value.length,
);
const hasFilters = computed(
  () => Boolean(query.value) || category.value !== "all",
);
const clearFilters = () => {
  query.value = "";
  category.value = "all";
};
const openRecipe = (recipe: Recipe) => {
  selectedRecipe.value = recipe;
  detailsOpen.value = true;
};
const printRecipe = () => window.print();

watch([query, category, sortBy], () => {
  visibleCount.value = 24;
});
useIntersectionObserver(
  loadMoreTarget,
  ([entry]) => {
    if (entry?.isIntersecting && canLoadMore.value) visibleCount.value += 24;
  },
  { rootMargin: "300px" },
);

onMounted(loadRecipes);

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
