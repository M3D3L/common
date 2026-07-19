<template>
  <section class="lg:max-w-3xl px-4 pt-8 pb-28 mx-auto">
    <h2 class="text-xl font-bold">Menú semanal</h2>
    <p class="mb-6 text-muted-foreground">
      Define qué se puede pedir cada día. Esto es lo que verán los clientes al
      hacer preórdenes.
    </p>

    <div v-if="loading" class="py-16 text-center">
      <p class="text-sm text-muted-foreground animate-pulse">
        Cargando catálogo…
      </p>
    </div>

    <div
      v-else-if="catalogEmpty"
      class="py-16 text-center border border-dashed rounded-xl border-border"
    >
      <p class="font-semibold">No hay platillos en el catálogo.</p>
      <p class="mt-1 text-sm text-muted-foreground">
        Agrega los platillos en la colección <code>menu</code> (campo
        <code>dishes</code>).
      </p>
    </div>

    <template v-else>
      <!-- Selector de día -->
      <div class="flex gap-2 pb-2 mb-6 -mx-1 overflow-x-auto px-1">
        <button
          v-for="d in dayList"
          :key="d.date"
          class="px-3 py-2 text-sm font-medium border rounded-lg whitespace-nowrap transition-colors"
          :class="
            activeDate === d.date
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border text-muted-foreground'
          "
          @click="activeDate = d.date"
        >
          {{ d.short }}
          <span class="ml-1 text-xs tabular-nums"
            >({{ countFor(d.date) }})</span
          >
        </button>
      </div>

      <div v-for="g in groups" :key="g.key" class="mb-8">
        <div class="flex items-baseline gap-3 mb-3">
          <h3
            class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
          >
            {{ g.label }}
          </h3>
          <Separator class="flex-1 shrink" />
          <span class="text-sm text-muted-foreground tabular-nums">
            {{ pickFor(activeDate)[g.key].size }} elegidos
          </span>
        </div>

        <div
          v-if="catalog[g.key].length"
          class="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
        >
          <Toggle
            v-for="name in catalog[g.key]"
            :key="name"
            variant="outline"
            :pressed="pickFor(activeDate)[g.key].has(name)"
            class="flex w-full h-auto justify-start gap-2.5 p-3.5 data-[state=on]:border-primary data-[state=on]:bg-primary/5"
            @click="toggle(activeDate, g.key, name)"
          >
            <span
              class="grid w-5 h-5 text-white rounded shrink-0 place-items-center"
              :class="
                pickFor(activeDate)[g.key].has(name) ? 'bg-primary' : 'bg-muted'
              "
            >
              <ClientOnly>
                <Check v-if="pickFor(activeDate)[g.key].has(name)" :size="13" />
              </ClientOnly>
            </span>
            <span class="text-sm font-semibold">{{ name }}</span>
          </Toggle>
        </div>
        <p v-else class="text-sm text-muted-foreground">
          Sin platillos en esta categoría.
        </p>
      </div>

      <!-- Copiar rápido de otro día -->
      <div class="flex flex-wrap items-center gap-2 mt-4 text-sm">
        <span class="text-muted-foreground">Copiar de:</span>
        <button
          v-for="d in dayList.filter(
            (x) => x.date !== activeDate && countFor(x.date) > 0,
          )"
          :key="d.date"
          class="px-2.5 py-1 border rounded-md border-border text-muted-foreground hover:text-foreground"
          @click="copyFrom(d.date)"
        >
          {{ d.short }}
        </button>
      </div>
    </template>

    <div
      v-if="!loading && !catalogEmpty"
      class="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur border-border"
    >
      <div class="flex items-center gap-3 px-4 py-3 mx-auto max-w-3xl">
        <span class="text-sm text-muted-foreground">
          {{ configuredDays }} día(s) con menú
        </span>
        <Button size="lg" class="ml-auto" :disabled="saving" @click="save">
          {{ saving ? "Guardando…" : "Guardar semana" }}
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
import { ref, reactive, computed, onMounted } from "vue";
import { Button } from "@common/components/ui/button";
import { Separator } from "@common/components/ui/separator";
import { Toggle } from "@common/components/ui/toggle";
import { Check } from "lucide-vue-next";
import {
  groups,
  todayISO,
  type GroupKey,
  type DayDishes,
} from "~/utils/comandas";

// Cuántos días hacia adelante ofrecer para configurar.
const PREORDER_DAYS_AHEAD = 7;

const { fetchCollection, updateItem, createItem } = usePocketBaseCore();

const loading = ref(true);
const saving = ref(false);
const toastMsg = ref("");
const menuRecordId = ref<string | null>(null);
const catalog = reactive<DayDishes>({ guisos: [], sides: [], bebidas: [] });

// picks por fecha ISO: { [iso]: { guisos:Set, sides:Set, bebidas:Set } }
const picks = reactive<Record<string, Record<GroupKey, Set<string>>>>({});
const activeDate = ref<string>("");

function emptyPick(): Record<GroupKey, Set<string>> {
  return { guisos: new Set(), sides: new Set(), bebidas: new Set() };
}

function isoOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const dayList = computed(() => {
  const out: { date: string; short: string }[] = [];
  const base = new Date(todayISO() + "T00:00:00");
  for (let i = 0; i < PREORDER_DAYS_AHEAD; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const short = d.toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
    });
    out.push({
      date: isoOf(d),
      short: short.charAt(0).toUpperCase() + short.slice(1),
    });
  }
  return out;
});

const catalogEmpty = computed(
  () =>
    !catalog.guisos.length && !catalog.sides.length && !catalog.bebidas.length,
);

function pickFor(date: string) {
  if (!picks[date]) picks[date] = emptyPick();
  return picks[date];
}
function toggle(date: string, k: GroupKey, name: string) {
  const p = pickFor(date)[k];
  if (p.has(name)) p.delete(name);
  else p.add(name);
}
function countFor(date: string) {
  const p = picks[date];
  if (!p) return 0;
  return p.guisos.size + p.sides.size + p.bebidas.size;
}
function copyFrom(date: string) {
  const src = picks[date];
  if (!src) return;
  picks[activeDate.value] = {
    guisos: new Set(src.guisos),
    sides: new Set(src.sides),
    bebidas: new Set(src.bebidas),
  };
}
const configuredDays = computed(
  () => dayList.value.filter((d) => countFor(d.date) > 0).length,
);

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
      const weekly = (rec.weekly ?? {}) as Record<string, DayDishes>;
      for (const iso of Object.keys(weekly)) {
        picks[iso] = {
          guisos: new Set(weekly[iso]?.guisos ?? []),
          sides: new Set(weekly[iso]?.sides ?? []),
          bebidas: new Set(weekly[iso]?.bebidas ?? []),
        };
      }
    }
  } catch {
    /* offline */
  } finally {
    loading.value = false;
    // Pre-inicializa los días visibles (evita mutar estado durante el render).
    dayList.value.forEach((d) => pickFor(d.date));
    activeDate.value = dayList.value[0]?.date ?? "";
  }
}

async function save() {
  saving.value = true;
  toast("Guardando…");
  const weekly: Record<string, DayDishes> = {};
  for (const iso of Object.keys(picks)) {
    const p = picks[iso];
    if (p.guisos.size + p.sides.size + p.bebidas.size === 0) continue; // no guardar vacíos
    weekly[iso] = {
      guisos: [...p.guisos],
      sides: [...p.sides],
      bebidas: [...p.bebidas],
    };
  }
  try {
    if (menuRecordId.value) {
      await updateItem("menu", menuRecordId.value, { weekly });
    } else {
      const created = await createItem("menu", {
        dishes: catalog,
        active: { guisos: [], sides: [], bebidas: [] },
        sold_out: [],
        weekly,
      });
      menuRecordId.value = (created as any).id;
    }
    toast("Semana guardada ✅");
  } catch {
    toast("No se pudo guardar");
  } finally {
    saving.value = false;
  }
}

onMounted(load);

definePageMeta({ layout: "breezy" });
</script>
