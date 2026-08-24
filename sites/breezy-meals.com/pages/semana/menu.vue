<template>
  <section class="lg:max-w-3xl px-4 pt-8 pb-28 mx-auto">
    <!-- Sub-nav admin -->
    <div class="flex gap-1 mb-4">
      <Button as-child size="sm" variant="secondary">
        <NuxtLink to="/semana/menu">Semanas</NuxtLink>
      </Button>
      <Button as-child size="sm" variant="ghost">
        <NuxtLink to="/semana/calendario">Calendario</NuxtLink>
      </Button>
    </div>

    <h2 class="text-xl font-bold">Bloques de semana</h2>
    <p class="mb-6 text-muted-foreground">
      Arma menús de una semana (Lun–Dom) y guárdalos. Luego se rotan en el
      calendario.
    </p>

    <div v-if="loading" class="py-16 text-center">
      <p class="text-sm text-muted-foreground animate-pulse">Cargando…</p>
    </div>

    <div
      v-else-if="catalogEmpty"
      class="py-16 text-center border border-dashed rounded-xl border-border"
    >
      <p class="font-semibold">No hay platillos en el catálogo.</p>
    </div>

    <template v-else>
      <!-- Selector de bloque -->
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="b in blocks"
          :key="b.id"
          class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors"
          :class="
            selectedId === b.id
              ? 'border-primary bg-primary/5'
              : 'border-border text-muted-foreground'
          "
          @click="selectedId = b.id"
        >
          <span
            class="w-2.5 h-2.5 rounded-full"
            :style="{ backgroundColor: b.color }"
          ></span>
          {{ b.name }}
        </button>
        <Button size="sm" variant="outline" @click="addBlock">
          <Plus :size="15" class="mr-1" /> Nuevo bloque
        </Button>
        <Button
          size="sm"
          variant="outline"
          :disabled="generating || saving"
          @click="generatorOpen = true"
        >
          <WandSparkles :size="15" class="mr-1" />
          {{ generating ? "Generando…" : "Generar semana" }}
        </Button>
      </div>

      <div
        v-if="!current"
        class="py-16 text-center border border-dashed rounded-xl border-border"
      >
        <p class="text-sm text-muted-foreground">
          Crea un bloque para empezar.
        </p>
      </div>

      <template v-else>
        <!-- Nombre + color + acciones -->
        <div class="p-4 mb-6 border rounded-xl border-border bg-muted/30">
          <input
            v-model="current.name"
            placeholder="Nombre del bloque"
            class="w-full px-3 py-2 mb-3 text-sm font-semibold border rounded-md bg-background border-border"
          />
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="c in palette"
              :key="c"
              class="w-6 h-6 rounded-full border-2 transition-transform"
              :class="
                current.color === c
                  ? 'scale-110 border-foreground'
                  : 'border-transparent'
              "
              :style="{ backgroundColor: c }"
              @click="current.color = c"
            ></button>
            <div class="flex-1"></div>
            <Button size="sm" variant="ghost" @click="duplicateBlock">
              <Copy :size="15" class="mr-1" /> Duplicar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              class="text-destructive hover:text-destructive"
              @click="deleteBlock"
            >
              <Trash2 :size="15" class="mr-1" /> Eliminar
            </Button>
          </div>
        </div>

        <!-- Días de la semana -->
        <div class="flex gap-2 mb-6">
          <button
            v-for="d in weekdays"
            :key="d.key"
            class="flex-1 px-2 py-2 text-sm font-medium border rounded-lg transition-colors"
            :class="
              activeDay === d.key
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border text-muted-foreground'
            "
            @click="activeDay = d.key"
          >
            {{ d.label }}
            <span class="block text-xs tabular-nums">{{
              dayCount(current, d.key)
            }}</span>
          </button>
        </div>

        <!-- Grid de platillos por grupo -->
        <div v-for="g in menuGroups" :key="g.key" class="mb-8">
          <div class="flex items-baseline gap-3 mb-3">
            <h3
              class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
            >
              {{ g.label }}
            </h3>
            <Separator class="flex-1 shrink" />
          </div>
          <div
            v-if="optionsForGroup(g.key).length"
            class="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
          >
            <Toggle
              v-for="name in optionsForGroup(g.key)"
              :key="name"
              variant="outline"
              :pressed="has(g.key, name)"
              class="flex w-full h-auto justify-start gap-2.5 p-3.5 data-[state=on]:border-primary data-[state=on]:bg-primary/5"
              @click="toggleDish(g.key, name)"
            >
              <span
                class="grid w-5 h-5 text-white rounded shrink-0 place-items-center"
                :class="has(g.key, name) ? 'bg-primary' : 'bg-muted'"
              >
                <ClientOnly>
                  <Check v-if="has(g.key, name)" :size="13" />
                </ClientOnly>
              </span>
              <span class="text-sm font-semibold">{{ name }}</span>
            </Toggle>
          </div>
          <p v-else class="text-sm text-muted-foreground">
            Sin platillos en esta categoría.
          </p>
        </div>

        <!-- Copiar de otro día del mismo bloque -->
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <span class="text-muted-foreground">Copiar a este día desde:</span>
          <button
            v-for="d in weekdays.filter(
              (x) => x.key !== activeDay && currentDayCount(x.key) > 0,
            )"
            :key="d.key"
            class="px-2.5 py-1 border rounded-md border-border text-muted-foreground hover:text-foreground"
            @click="copyDay(d.key)"
          >
            {{ d.label }}
          </button>
        </div>
      </template>
    </template>

    <Dialog v-model:open="generatorOpen">
      <DialogScrollContent class="max-w-xl">
        <DialogHeader>
          <DialogTitle>Generar semana con recetas</DialogTitle>
          <DialogDescription>
            Agrega reglas para que ChatGPT elija recetas y arme un bloque de
            lunes a domingo.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="generated-week-name">Nombre del bloque</Label>
            <Input
              id="generated-week-name"
              v-model="generatedWeekName"
              placeholder="Semana generada"
            />
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between gap-3">
              <Label>Requisitos</Label>
              <Button size="sm" variant="ghost" @click="addRequirement">
                <Plus :size="14" class="mr-1" /> Agregar requisito
              </Button>
            </div>
            <div
              v-for="(_, index) in requirements"
              :key="index"
              class="flex items-center gap-2"
            >
              <Input
                v-model="requirements[index]"
                :aria-label="`Requisito ${index + 1}`"
                placeholder="Ej. El jueves debe llevar res"
              />
              <Button
                size="icon"
                variant="ghost"
                :aria-label="`Eliminar requisito ${index + 1}`"
                @click="removeRequirement(index)"
              >
                <X :size="16" />
              </Button>
            </div>
            <p
              v-if="!requirements.length"
              class="text-sm text-muted-foreground"
            >
              Sin requisitos adicionales.
            </p>
          </div>

          <p v-if="generationError" class="text-sm text-destructive">
            {{ generationError }}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            :disabled="generating"
            @click="generatorOpen = false"
          >
            Cancelar
          </Button>
          <Button :disabled="generating || saving" @click="generateWeek">
            <LoaderCircle
              v-if="generating"
              :size="16"
              class="mr-2 animate-spin"
            />
            <WandSparkles v-else :size="16" class="mr-2" />
            {{ generating ? "Generando…" : "Generar y guardar" }}
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>

    <div
      v-if="!loading && !catalogEmpty"
      class="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur border-border"
    >
      <div class="flex items-center gap-3 px-4 py-3 mx-auto max-w-3xl">
        <span class="text-sm text-muted-foreground">
          {{ blocks.length }} bloque(s)
        </span>
        <Button size="lg" class="ml-auto" :disabled="saving" @click="save">
          {{ saving ? "Guardando…" : "Guardar bloques" }}
        </Button>
      </div>
    </div>

    <div
      v-if="toastMsg"
      class="fixed z-50 px-4 py-2 text-sm -translate-x-1/2 rounded-lg bottom-20 left-1/2 bg-foreground text-background"
    >
      {{ toastMsg }}
    </div>
  </section>
</template>

<script lang="ts" setup>
import recipesData from "../../../../tools/recipe-scraper/output/recipes.json";
import { Button } from "@common/components/ui/button";
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
import { Separator } from "@common/components/ui/separator";
import { Toggle } from "@common/components/ui/toggle";
import {
  Check,
  Copy,
  LoaderCircle,
  Plus,
  Trash2,
  WandSparkles,
  X,
} from "lucide-vue-next";
import {
  catalogToDayDishes,
  dayDishesToCatalog,
  groupsFromData,
  emptyDayDishes,
  normalizeMenuCatalog,
  type GroupKey,
  type DayDishes,
} from "~/utils/comandas";
import type { WeekBlock, WeekdayKey } from "~/utils/rotation";
import { menuPricingConfig } from "~/config/menu-pricing";
import usePocketBase from "@common/composables/usePocketbase";

interface RecipeCandidate {
  id: string;
  title: string;
  category?: string | null;
  ingredients?: string[];
  hasDetail: boolean;
}

interface GeneratedWeek {
  name?: string;
  days?: Record<string, Record<string, string[]>>;
}

const weekdays: { key: WeekdayKey; label: string }[] = [
  { key: "1", label: "Lun" },
  { key: "2", label: "Mar" },
  { key: "3", label: "Mié" },
  { key: "4", label: "Jue" },
  { key: "5", label: "Vie" },
  { key: "6", label: "Sáb" },
  { key: "7", label: "Dom" },
];

const palette = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const { fetchCollection, updateItem, createItem } = usePocketBaseCore();
const { run: runChatGPT, loading: generating } = useChatGPT();

const loading = ref(true);
const saving = ref(false);
const toastMsg = ref("");
const menuRecordId = ref<string | null>(null);
const catalog = reactive<DayDishes>(emptyDayDishes());
const blocks = ref<WeekBlock[]>([]);
const selectedId = ref<string>("");
const activeDay = ref<WeekdayKey>("1");
const generatorOpen = ref(false);
const generatedWeekName = ref("");
const requirements = ref<string[]>([""]);
const generationError = ref("");
const recipeCandidates = (recipesData as RecipeCandidate[]).filter(
  (recipe) => recipe.hasDetail && recipe.ingredients?.length,
);
const recipesById = new Map(
  recipeCandidates.map((recipe) => [recipe.id, recipe]),
);
const recipesByTitle = new Map(
  recipeCandidates.map((recipe) => [recipe.title, recipe]),
);
const menuGroups = computed(() =>
  groupsFromData(catalog as unknown as Record<string, unknown>),
);

const current = computed(
  () => blocks.value.find((b) => b.id === selectedId.value) ?? null,
);
const catalogEmpty = computed(
  () => !menuGroups.value.some((g) => catalog[g.key]?.length),
);

function genId() {
  return "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
function emptyDay(): DayDishes {
  return emptyDayDishes(Object.keys(catalog));
}
function dayOf(block: WeekBlock, key: WeekdayKey): DayDishes {
  if (!block.days[key]) block.days[key] = emptyDay();
  const d = block.days[key]!;
  // Rellena categorías nuevas (p. ej. taquizas) en días guardados antes de
  // que existieran, para que toggle/has no revienten al indexar.
  menuGroups.value.forEach((g) => {
    if (!d[g.key]) d[g.key] = [];
  });
  return d;
}
function has(k: GroupKey, name: string): boolean {
  const d = current.value?.days[activeDay.value];
  return !!d && (d[k] ?? []).includes(name);
}
function toggleDish(k: GroupKey, name: string) {
  const b = current.value;
  if (!b) return;
  const day = dayOf(b, activeDay.value);
  const i = day[k].indexOf(name);
  if (i >= 0) day[k].splice(i, 1);
  else day[k].push(name);
}
function optionsForGroup(key: GroupKey): string[] {
  const names = new Set(catalog[key] ?? []);
  blocks.value.forEach((block) => {
    Object.values(block.days).forEach((day) => {
      (day?.[key] ?? []).forEach((name) => names.add(name));
    });
  });
  return [...names].sort((a, b) => a.localeCompare(b, "es"));
}
function dayCount(block: WeekBlock, key: WeekdayKey): number {
  const d = block.days[key];
  if (!d) return 0;
  return menuGroups.value.reduce((n, g) => n + (d[g.key] ?? []).length, 0);
}
function currentDayCount(key: WeekdayKey): number {
  return current.value ? dayCount(current.value, key) : 0;
}
function copyDay(from: WeekdayKey) {
  const b = current.value;
  if (!b || !b.days[from]) return;
  const src = b.days[from]!;
  const dst = emptyDayDishes(Object.keys(catalog));
  menuGroups.value.forEach((g) => {
    dst[g.key] = [...(src[g.key] ?? [])];
  });
  b.days[activeDay.value] = dst;
}

function addBlock() {
  const n = blocks.value.length;
  const block: WeekBlock = {
    id: genId(),
    name: `Semana ${n + 1}`,
    color: palette[n % palette.length],
    days: {},
  };
  blocks.value.push(block);
  selectedId.value = block.id;
  activeDay.value = "1";
}
function duplicateBlock() {
  const b = current.value;
  if (!b) return;
  const copy: WeekBlock = {
    id: genId(),
    name: b.name + " (copia)",
    color: b.color,
    days: JSON.parse(JSON.stringify(b.days)),
  };
  blocks.value.push(copy);
  selectedId.value = copy.id;
}
function deleteBlock() {
  const b = current.value;
  if (!b) return;
  if (!confirm(`¿Eliminar "${b.name}"? Revisa la rotación en Calendario.`))
    return;
  blocks.value = blocks.value.filter((x) => x.id !== b.id);
  selectedId.value = blocks.value[0]?.id ?? "";
}

function addRequirement() {
  requirements.value.push("");
}
function removeRequirement(index: number) {
  requirements.value.splice(index, 1);
}

function parseGeneratedWeek(raw: string): GeneratedWeek {
  const json = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? raw;
  return JSON.parse(json.trim()) as GeneratedWeek;
}

function fillFromCatalog(
  day: DayDishes,
  groupKey: GroupKey,
  minimum: number,
  dayIndex: number,
) {
  const available = catalog[groupKey] ?? [];
  if (!available.length) return;
  const selected = new Set(day[groupKey] ?? []);
  for (
    let offset = 0;
    selected.size < minimum && offset < available.length;
    offset++
  ) {
    selected.add(available[(dayIndex + offset) % available.length]!);
  }
  day[groupKey] = [...selected];
}

function enableFullCatalogGroup(day: DayDishes, groupKey: GroupKey) {
  if (catalog[groupKey]?.length) day[groupKey] = [...catalog[groupKey]];
}

function isBeefMain(title: string): boolean {
  const recipe = recipesByTitle.get(title);
  const text = [title, recipe?.category, ...(recipe?.ingredients ?? [])]
    .filter(Boolean)
    .join(" ");
  return /\b(res|beef|bistec|birria|alb[oó]ndigas?|lasaña de calabaza|machaca|discada|teriyaki de res|salpic[oó]n de res|carne en su jugo)\b/i.test(
    text,
  );
}

function fillNonBeefCatalogGroup(
  day: DayDishes,
  groupKey: GroupKey,
  minimum: number,
  dayIndex: number,
) {
  const available = (catalog[groupKey] ?? []).filter(
    (name) => !isBeefMain(name),
  );
  const selected = new Set(
    (day[groupKey] ?? []).filter((name) => !isBeefMain(name)),
  );
  for (
    let offset = 0;
    selected.size < minimum && offset < available.length;
    offset++
  ) {
    selected.add(available[(dayIndex + offset) % available.length]!);
  }
  day[groupKey] = [...selected];
}

function isCaldoRecipe(recipe: RecipeCandidate): boolean {
  return /\b(caldo|sopa|crema|consom[eé]|bisque|potaje)\b/i.test(
    `${recipe.title} ${recipe.category ?? ""}`,
  );
}

function recipeUsage() {
  const usage = new Map<string, number>();
  blocks.value.forEach((block) => {
    Object.values(block.days).forEach((day) => {
      [...(day?.guisos ?? []), ...(day?.caldos ?? [])].forEach((title) => {
        usage.set(title, (usage.get(title) ?? 0) + 1);
      });
    });
  });
  return usage;
}

function addRecipeMain(day: DayDishes, recipe: RecipeCandidate) {
  const groupKey = isCaldoRecipe(recipe) ? "caldos" : "guisos";
  day[groupKey] = [...new Set([...(day[groupKey] ?? []), recipe.title])];
}

function fillMainChoices(
  day: DayDishes,
  minimum: number,
  candidates: RecipeCandidate[],
  usedThisWeek: Set<string>,
) {
  let mainCount = (day.guisos?.length ?? 0) + (day.caldos?.length ?? 0);
  for (const recipe of candidates) {
    if (mainCount >= minimum) break;
    if (usedThisWeek.has(recipe.title)) continue;
    addRecipeMain(day, recipe);
    usedThisWeek.add(recipe.title);
    mainCount++;
  }
}

async function promoContext() {
  try {
    const response = await fetchCollection(
      "promos",
      1,
      100,
      "active = true",
      "priority",
      null,
      null,
      true,
    );
    if (response.items.length) {
      return response.items.map((record: any) => {
        const data =
          record.data && typeof record.data === "object" ? record.data : record;
        return {
          label: record.label || data.label,
          summary:
            record.summary || record.display?.summary || data.display?.summary,
          requirements:
            record.requirements ||
            record.match?.requirements ||
            data.match?.requirements ||
            [],
        };
      });
    }
  } catch {
    // The built-in promo rules remain available when PocketBase is offline.
  }
  return menuPricingConfig.promos.map((promo) => ({
    label: promo.label,
    summary: promo.display?.summary,
    requirements: promo.match?.requirements ?? [],
  }));
}

async function generateWeek() {
  generationError.value = "";
  const groups = menuGroups.value.map(({ key, label, kind }) => ({
    key,
    label,
    kind,
  }));
  const recipeList = recipeCandidates.map(
    ({ id, title, category, ingredients }) => ({
      id,
      title,
      category,
      ingredients,
    }),
  );
  const rules = requirements.value.map((rule) => rule.trim()).filter(Boolean);
  const existingWeeks = blocks.value.map(({ name, days }) => ({ name, days }));
  const catalogByGroup = Object.fromEntries(
    menuGroups.value.map((group) => [group.key, catalog[group.key] ?? []]),
  );
  const promotions = await promoContext();
  const command = `Crea un menú semanal completo y vendible para Breezy Meals de lunes a viernes (días 1 a 5), siguiendo el patrón de existingWeeks. Reglas obligatorias: (1) todos los días deben ofrecer desayunos, ensaladas y sweets; (2) ofrece tortas_burgers_burritos por lo menos un día, pero ese día también debe incluir al menos un guiso o caldo; (3) ofrece taquizas por lo menos un día con 2 o 3 selecciones, y ese día también debe incluir al menos un guiso o caldo; (4) los demás días deben tener un mínimo combinado de 2 platos entre guisos y caldos; (5) cada día debe tener 3 sides y 3 bebidas; (6) concentra toda la carne de res en un solo día de la semana; Lasaña de Calabaza y cualquier albóndiga cuentan como res y deben ir juntas ese día. Los otros cuatro días no deben tener res. Respeta las promociones y todos los requisitos adicionales. Para platos principales usa únicamente IDs exactos de recipes; el sistema clasificará localmente cada receta como guiso o caldo. Para sides, bebidas y oferta complementaria usa únicamente nombres exactos de catalogByGroup. Prioriza recetas poco usadas y variedad de proteínas e ingredientes. Devuelve únicamente JSON válido con esta forma: {"name":"Nombre","days":{"1":{"guisos":["recipe-id"],"sides":["nombre exacto"],"bebidas":["nombre exacto"]}}}. No inventes IDs, nombres ni grupos. No incluyas markdown ni explicaciones.`;

  try {
    const raw = await runChatGPT(command, {
      requirements: rules,
      groups,
      recipes: recipeList,
      catalogByGroup,
      promotions,
      existingWeeks,
    });
    const generated = parseGeneratedWeek(raw);
    const days: WeekBlock["days"] = {};
    const serviceDays = ["1", "2", "3", "4", "5"] as WeekdayKey[];
    const validDays = new Set<WeekdayKey>(serviceDays);
    const validGroups = new Set(menuGroups.value.map((group) => group.key));
    let recipeCount = 0;

    Object.entries(generated.days ?? {}).forEach(
      ([dayKey, generatedGroups]) => {
        if (!validDays.has(dayKey as WeekdayKey) || !generatedGroups) return;
        const day = emptyDay();
        Object.entries(generatedGroups).forEach(([groupKey, selections]) => {
          if (!validGroups.has(groupKey) || !Array.isArray(selections)) return;
          const availableNames = new Set(catalog[groupKey] ?? []);
          selections.forEach((selection) => {
            const value = String(selection);
            const recipe = recipesById.get(value);
            if (recipe && (groupKey === "guisos" || groupKey === "caldos")) {
              addRecipeMain(day, recipe);
              recipeCount++;
            } else if (availableNames.has(value)) {
              day[groupKey] = [...new Set([...(day[groupKey] ?? []), value])];
            }
          });
        });
        const dayIndex = Number(dayKey) - 1;
        fillFromCatalog(day, "sides", 3, dayIndex);
        fillFromCatalog(day, "bebidas", 3, dayIndex);
        enableFullCatalogGroup(day, "desayunos");
        enableFullCatalogGroup(day, "ensaladas");
        enableFullCatalogGroup(day, "sweets");
        if (Object.values(day).some((items) => items.length)) {
          days[dayKey as WeekdayKey] = day;
        }
      },
    );

    if (!recipeCount)
      throw new Error("La respuesta no contiene IDs de recetas válidos.");
    serviceDays.forEach((dayKey) => {
      if (!days[dayKey]) days[dayKey] = emptyDay();
    });

    const tortaDay =
      serviceDays.find(
        (dayKey) => days[dayKey]?.tortas_burgers_burritos?.length,
      ) ?? "3";
    fillFromCatalog(
      days[tortaDay]!,
      "tortas_burgers_burritos",
      2,
      Number(tortaDay) - 1,
    );

    const taquizaDay =
      serviceDays.find((dayKey) => days[dayKey]?.taquizas?.length) ?? "2";
    fillFromCatalog(days[taquizaDay]!, "taquizas", 3, Number(taquizaDay) - 1);
    days[taquizaDay]!.taquizas = (days[taquizaDay]!.taquizas ?? []).slice(0, 3);
    if ((days[taquizaDay]!.taquizas?.length ?? 0) < 2) {
      throw new Error(
        "El catálogo necesita por lo menos dos opciones de taquiza.",
      );
    }

    const usage = recipeUsage();
    const mainCandidates = [...recipeCandidates].sort(
      (a, b) => (usage.get(a.title) ?? 0) - (usage.get(b.title) ?? 0),
    );
    const usedThisWeek = new Set(
      serviceDays.flatMap((dayKey) => [
        ...(days[dayKey]?.guisos ?? []),
        ...(days[dayKey]?.caldos ?? []),
      ]),
    );
    serviceDays.forEach((dayKey) => {
      const day = days[dayKey]!;
      const hasSpecial = Boolean(
        day.tortas_burgers_burritos?.length || day.taquizas?.length,
      );
      fillMainChoices(day, hasSpecial ? 1 : 2, mainCandidates, usedThisWeek);
    });

    const lasagna = (catalog.guisos ?? []).find(
      (name) => name.toLocaleLowerCase("es") === "lasaña de calabaza",
    );
    let beefDay = serviceDays.find((dayKey) =>
      days[dayKey]?.guisos?.some(
        (name) => name.toLocaleLowerCase("es") === "lasaña de calabaza",
      ),
    );
    beefDay ??= serviceDays.find((dayKey) =>
      [...(days[dayKey]?.guisos ?? []), ...(days[dayKey]?.caldos ?? [])].some(
        isBeefMain,
      ),
    );
    if (!lasagna) {
      throw new Error("Lasaña de Calabaza no está disponible en el catálogo.");
    }
    if (!beefDay) {
      const beefRecipe = mainCandidates.find((recipe) =>
        isBeefMain(recipe.title),
      );
      if (!beefRecipe) {
        throw new Error(
          "No hay una receta de res disponible para acompañar Lasaña de Calabaza.",
        );
      }
      beefDay = "4";
      addRecipeMain(days[beefDay]!, beefRecipe);
    }
    const beefPartner = mainCandidates.find(
      (recipe) => isBeefMain(recipe.title) && !/lasaña/i.test(recipe.title),
    );
    if (!beefPartner) {
      throw new Error(
        "No hay un guiso de res disponible para acompañar la lasaña.",
      );
    }

    const specialGroups = ["taquizas", "tortas_burgers_burritos"];
    serviceDays.forEach((dayKey) => {
      const day = days[dayKey]!;
      day.guisos = (day.guisos ?? []).filter(
        (name) => dayKey === beefDay || !isBeefMain(name),
      );
      day.caldos = (day.caldos ?? []).filter(
        (name) => dayKey === beefDay || !isBeefMain(name),
      );
      specialGroups.forEach((groupKey) => {
        day[groupKey] = (day[groupKey] ?? []).filter(
          (name) => dayKey === beefDay || !isBeefMain(name),
        );
      });
      if (dayKey !== beefDay) {
        day.guisos = day.guisos.filter((name) => name !== lasagna);
      }
    });

    days[beefDay]!.guisos = [
      ...new Set([
        ...(days[beefDay]!.guisos ?? []).filter((name) => name !== lasagna),
        beefPartner.title,
        lasagna,
      ]),
    ];

    if (taquizaDay !== beefDay) {
      fillNonBeefCatalogGroup(
        days[taquizaDay]!,
        "taquizas",
        3,
        Number(taquizaDay) - 1,
      );
      days[taquizaDay]!.taquizas = days[taquizaDay]!.taquizas.slice(0, 3);
    }
    if (tortaDay !== beefDay) {
      fillNonBeefCatalogGroup(
        days[tortaDay]!,
        "tortas_burgers_burritos",
        2,
        Number(tortaDay) - 1,
      );
    }

    const nonBeefCandidates = mainCandidates.filter(
      (recipe) => !isBeefMain(recipe.title),
    );
    serviceDays.forEach((dayKey) => {
      if (dayKey === beefDay) return;
      const day = days[dayKey]!;
      const hasSpecial = Boolean(
        day.tortas_burgers_burritos?.length || day.taquizas?.length,
      );
      fillMainChoices(day, hasSpecial ? 1 : 2, nonBeefCandidates, usedThisWeek);
    });

    const finalUsedMains = new Set<string>();
    serviceDays.forEach((dayKey) => {
      const day = days[dayKey]!;
      day.guisos = (day.guisos ?? []).filter((title) => {
        if (finalUsedMains.has(title)) return false;
        finalUsedMains.add(title);
        return true;
      });
      day.caldos = (day.caldos ?? []).filter((title) => {
        if (finalUsedMains.has(title)) return false;
        finalUsedMains.add(title);
        return true;
      });
    });

    serviceDays.forEach((dayKey) => {
      const day = days[dayKey]!;
      const hasSpecial = Boolean(
        day.tortas_burgers_burritos?.length || day.taquizas?.length,
      );
      const candidates =
        dayKey === beefDay ? mainCandidates : nonBeefCandidates;
      fillMainChoices(day, hasSpecial ? 1 : 2, candidates, finalUsedMains);
    });

    const finalMainTitles = serviceDays.flatMap((dayKey) => [
      ...(days[dayKey]?.guisos ?? []),
      ...(days[dayKey]?.caldos ?? []),
    ]);
    if (new Set(finalMainTitles).size !== finalMainTitles.length) {
      throw new Error(
        "No se pudo crear una semana con platos principales únicos.",
      );
    }
    const incompleteDay = serviceDays.find((dayKey) => {
      const day = days[dayKey]!;
      const hasSpecial = Boolean(
        day.tortas_burgers_burritos?.length || day.taquizas?.length,
      );
      const mainCount = day.guisos.length + day.caldos.length;
      return mainCount < (hasSpecial ? 1 : 2);
    });
    if (incompleteDay) {
      throw new Error(
        `No hay suficientes recetas únicas para completar el día ${incompleteDay}.`,
      );
    }

    const block: WeekBlock = {
      id: genId(),
      name:
        generatedWeekName.value.trim() ||
        generated.name?.trim() ||
        `Semana ${blocks.value.length + 1}`,
      color: palette[blocks.value.length % palette.length],
      days,
    };
    blocks.value.push(block);
    selectedId.value = block.id;
    activeDay.value = "1";
    const saved = await save();
    if (saved) {
      generatorOpen.value = false;
      generatedWeekName.value = "";
      requirements.value = [""];
    }
  } catch (error) {
    generationError.value =
      error instanceof Error ? error.message : "No se pudo generar la semana.";
  }
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
function toast(m: string) {
  toastMsg.value = m;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastMsg.value = ""), 2000);
}

async function load() {
  loading.value = true;
  try {
    const res = await fetchCollection(
      "menu",
      1,
      1,
      "",
      "-created",
      null,
      null,
      true,
    );
    const rec = res.items[0] as any;
    if (rec) {
      menuRecordId.value = rec.id;
      // Carga cada categoría desde el catálogo; las que falten quedan vacías.
      const names = catalogToDayDishes(
        normalizeMenuCatalog(rec.dishes as Partial<Record<string, unknown>>),
      );
      Object.keys(catalog).forEach((k) => {
        if (!(k in names)) delete catalog[k];
      });
      Object.entries(names).forEach(([k, list]) => {
        catalog[k] = list ?? [];
      });
      blocks.value = (rec.week_blocks ?? []) as WeekBlock[];
      selectedId.value = blocks.value[0]?.id ?? "";
    }
  } catch {
    /* offline */
  } finally {
    loading.value = false;
  }
}

async function save(): Promise<boolean> {
  saving.value = true;
  toast("Guardando…");
  // Limpia días vacíos para no persistir basura.
  const clean = blocks.value.map((b) => {
    const days: WeekBlock["days"] = {};
    (Object.keys(b.days) as WeekdayKey[]).forEach((k) => {
      const d = b.days[k]!;
      if (menuGroups.value.some((g) => (d[g.key] ?? []).length > 0))
        days[k] = d;
    });
    return { ...b, days };
  });
  try {
    if (menuRecordId.value) {
      await updateItem("menu", menuRecordId.value, { week_blocks: clean });
    } else {
      const created = await createItem("menu", {
        dishes: dayDishesToCatalog(catalog),
        active: emptyDayDishes(),
        sold_out: [],
        week_blocks: clean,
        rotation: [],
        rotation_anchor: "",
        overrides: {},
      });
      menuRecordId.value = (created as any).id;
    }
    toast("Bloques guardados ✅");
    return true;
  } catch {
    toast("No se pudo guardar");
    return false;
  } finally {
    saving.value = false;
  }
}

onMounted(load);

definePageMeta({
  layout: "staff",
});
</script>
