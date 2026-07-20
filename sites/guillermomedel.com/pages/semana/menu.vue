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
      Arma menús de una semana (Lun–Vie) y guárdalos. Luego se rotan en el
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
        <div v-for="g in groups" :key="g.key" class="mb-8">
          <div class="flex items-baseline gap-3 mb-3">
            <h3
              class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
            >
              {{ g.label }}
            </h3>
            <Separator class="flex-1 shrink" />
          </div>
          <div
            v-if="catalog[g.key].length"
            class="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
          >
            <Toggle
              v-for="name in catalog[g.key]"
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
              (x) => x.key !== activeDay && dayCount(current, x.key) > 0,
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
import { Button } from "@common/components/ui/button";
import { Separator } from "@common/components/ui/separator";
import { Toggle } from "@common/components/ui/toggle";
import { Check, Plus, Copy, Trash2 } from "lucide-vue-next";
import { groups, type GroupKey, type DayDishes } from "~/utils/comandas";
import type { WeekBlock, WeekdayKey } from "~/utils/rotation";
import usePocketBase from "@common/composables/usePocketbase";

const weekdays: { key: WeekdayKey; label: string }[] = [
  { key: "1", label: "Lun" },
  { key: "2", label: "Mar" },
  { key: "3", label: "Mié" },
  { key: "4", label: "Jue" },
  { key: "5", label: "Vie" },
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

const loading = ref(true);
const saving = ref(false);
const toastMsg = ref("");
const menuRecordId = ref<string | null>(null);
const catalog = reactive<DayDishes>({ guisos: [], sides: [], bebidas: [] });
const blocks = ref<WeekBlock[]>([]);
const selectedId = ref<string>("");
const activeDay = ref<WeekdayKey>("1");

const current = computed(
  () => blocks.value.find((b) => b.id === selectedId.value) ?? null,
);
const catalogEmpty = computed(
  () =>
    !catalog.guisos.length && !catalog.sides.length && !catalog.bebidas.length,
);

function genId() {
  return "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
function emptyDay(): DayDishes {
  return { guisos: [], sides: [], bebidas: [] };
}
function dayOf(block: WeekBlock, key: WeekdayKey): DayDishes {
  if (!block.days[key]) block.days[key] = emptyDay();
  return block.days[key]!;
}
function has(k: GroupKey, name: string): boolean {
  const d = current.value?.days[activeDay.value];
  return !!d && d[k].includes(name);
}
function toggleDish(k: GroupKey, name: string) {
  const b = current.value;
  if (!b) return;
  const day = dayOf(b, activeDay.value);
  const i = day[k].indexOf(name);
  if (i >= 0) day[k].splice(i, 1);
  else day[k].push(name);
}
function dayCount(block: WeekBlock, key: WeekdayKey): number {
  const d = block.days[key];
  if (!d) return 0;
  return d.guisos.length + d.sides.length + d.bebidas.length;
}
function copyDay(from: WeekdayKey) {
  const b = current.value;
  if (!b || !b.days[from]) return;
  const src = b.days[from]!;
  b.days[activeDay.value] = {
    guisos: [...src.guisos],
    sides: [...src.sides],
    bebidas: [...src.bebidas],
  };
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
      catalog.guisos = rec.dishes?.guisos ?? [];
      catalog.sides = rec.dishes?.sides ?? [];
      catalog.bebidas = rec.dishes?.bebidas ?? [];
      blocks.value = (rec.week_blocks ?? []) as WeekBlock[];
      selectedId.value = blocks.value[0]?.id ?? "";
    }
  } catch {
    /* offline */
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  toast("Guardando…");
  // Limpia días vacíos para no persistir basura.
  const clean = blocks.value.map((b) => {
    const days: WeekBlock["days"] = {};
    (Object.keys(b.days) as WeekdayKey[]).forEach((k) => {
      const d = b.days[k]!;
      if (d.guisos.length || d.sides.length || d.bebidas.length) days[k] = d;
    });
    return { ...b, days };
  });
  try {
    if (menuRecordId.value) {
      await updateItem("menu", menuRecordId.value, { week_blocks: clean });
    } else {
      const created = await createItem("menu", {
        dishes: catalog,
        active: { guisos: [], sides: [], bebidas: [] },
        sold_out: [],
        week_blocks: clean,
        rotation: [],
        rotation_anchor: "",
        overrides: {},
      });
      menuRecordId.value = (created as any).id;
    }
    toast("Bloques guardados ✅");
  } catch {
    toast("No se pudo guardar");
  } finally {
    saving.value = false;
  }
}

onMounted(load);

definePageMeta({
  layout: "breezy",
  middleware: defineNuxtRouteMiddleware(() => {
    const pb = usePocketBase();
    if (!pb.authStore.isValid || pb.authStore.model?.verified !== true)
      return navigateTo("/");
  }),
});
</script>
