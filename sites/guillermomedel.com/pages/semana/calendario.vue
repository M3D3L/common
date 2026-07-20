<template>
  <section class="lg:max-w-3xl px-4 pt-16 pb-28 mx-auto">
    <!-- Sub-nav admin -->
    <div class="flex gap-1 mb-4">
      <Button as-child size="sm" variant="ghost">
        <NuxtLink to="/semana/menu">Semanas</NuxtLink>
      </Button>
      <Button as-child size="sm" variant="secondary">
        <NuxtLink to="/semana/calendario">Calendario</NuxtLink>
      </Button>
    </div>

    <h2 class="text-xl font-bold">Rotación y calendario</h2>
    <p class="mb-6 text-muted-foreground">
      Define el orden en que se repiten los bloques y ajusta semanas concretas.
    </p>

    <div v-if="loading" class="py-16 text-center">
      <p class="text-sm text-muted-foreground animate-pulse">Cargando…</p>
    </div>

    <div
      v-else-if="!blocks.length"
      class="py-16 text-center border border-dashed rounded-xl border-border"
    >
      <p class="font-semibold">Primero crea bloques de semana.</p>
      <Button as-child size="sm" class="mt-3">
        <NuxtLink to="/semana/menu">Ir a Semanas</NuxtLink>
      </Button>
    </div>

    <template v-else>
      <!-- Orden de rotación -->
      <div class="p-4 mb-4 border rounded-xl border-border bg-muted/30">
        <p
          class="mb-3 text-xs font-bold tracking-widest uppercase text-muted-foreground"
        >
          Orden de rotación
        </p>

        <div v-if="rotation.length" class="flex flex-col gap-2 mb-3">
          <div
            v-for="(id, i) in rotation"
            :key="i"
            class="flex items-center gap-2 px-3 py-2 border rounded-lg bg-background border-border"
          >
            <span class="text-xs font-bold tabular-nums text-muted-foreground">
              {{ i + 1 }}
            </span>
            <span
              class="w-2.5 h-2.5 rounded-full"
              :style="{ backgroundColor: blockColor(id) }"
            ></span>
            <span class="text-sm font-semibold">{{ blockName(id) }}</span>
            <div class="flex-1"></div>
            <button
              class="p-1 disabled:opacity-30"
              :disabled="i === 0"
              @click="move(i, -1)"
            >
              <ChevronUp :size="16" />
            </button>
            <button
              class="p-1 disabled:opacity-30"
              :disabled="i === rotation.length - 1"
              @click="move(i, 1)"
            >
              <ChevronDown :size="16" />
            </button>
            <button class="p-1 text-destructive" @click="removeAt(i)">
              <X :size="16" />
            </button>
          </div>
        </div>
        <p v-else class="mb-3 text-sm text-muted-foreground">
          Aún no hay bloques en la rotación.
        </p>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="b in blocks"
            :key="b.id"
            class="flex items-center gap-2 px-2.5 py-1 text-sm border rounded-md border-border text-muted-foreground hover:text-foreground"
            @click="addToRotation(b.id)"
          >
            <span
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: b.color }"
            ></span>
            + {{ b.name }}
          </button>
        </div>
      </div>

      <!-- Ancla -->
      <div
        class="flex items-center gap-3 p-4 mb-6 border rounded-xl border-border bg-muted/30"
      >
        <div>
          <p
            class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
          >
            La rotación empieza
          </p>
          <p class="text-sm font-semibold capitalize">
            semana del {{ prettyMonday(anchor) }}
          </p>
        </div>
        <div class="flex gap-1 ml-auto">
          <Button size="sm" variant="outline" @click="shiftAnchor(-1)">
            <ChevronLeft :size="16" />
          </Button>
          <Button size="sm" variant="outline" @click="shiftAnchor(1)">
            <ChevronRight :size="16" />
          </Button>
        </div>
      </div>

      <!-- Calendario -->
      <p
        class="mb-3 text-xs font-bold tracking-widest uppercase text-muted-foreground"
      >
        Próximas {{ weeks.length }} semanas
      </p>
      <div class="flex flex-col gap-2">
        <div
          v-for="w in weeks"
          :key="w.monday"
          class="border rounded-lg border-border"
        >
          <button
            class="flex items-center w-full gap-3 px-3 py-2.5 text-left"
            @click="expanded = expanded === w.monday ? '' : w.monday"
          >
            <span class="text-sm font-medium tabular-nums w-28 shrink-0">
              {{ rangeLabel(w.monday) }}
            </span>
            <span
              v-if="w.res.closed"
              class="px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground"
            >
              Cerrado
            </span>
            <span
              v-else-if="w.res.block"
              class="flex items-center gap-1.5 text-sm font-semibold"
            >
              <span
                class="w-2.5 h-2.5 rounded-full"
                :style="{ backgroundColor: w.res.block.color }"
              ></span>
              {{ w.res.block.name }}
            </span>
            <span v-else class="text-sm text-muted-foreground"
              >Sin asignar</span
            >

            <span v-if="overrides[w.monday]" class="ml-1 text-xs text-primary"
              >(ajustada)</span
            >
            <div class="flex-1"></div>
            <ChevronDown
              :size="16"
              class="transition-transform text-muted-foreground"
              :class="expanded === w.monday ? 'rotate-180' : ''"
            />
          </button>

          <!-- Opciones de la semana -->
          <div
            v-if="expanded === w.monday"
            class="flex flex-wrap gap-2 px-3 py-3 border-t border-border"
          >
            <button
              class="px-2.5 py-1 text-sm border rounded-md transition-colors"
              :class="
                !overrides[w.monday]
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted-foreground'
              "
              @click="setWeek(w.monday, 'auto')"
            >
              Automático
            </button>
            <button
              v-for="b in blocks"
              :key="b.id"
              class="flex items-center gap-1.5 px-2.5 py-1 text-sm border rounded-md transition-colors"
              :class="
                isPinned(w.monday, b.id)
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted-foreground'
              "
              @click="setWeek(w.monday, b.id)"
            >
              <span
                class="w-2 h-2 rounded-full"
                :style="{ backgroundColor: b.color }"
              ></span>
              {{ b.name }}
            </button>
            <button
              class="px-2.5 py-1 text-sm border rounded-md transition-colors"
              :class="
                isClosed(w.monday)
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted-foreground'
              "
              @click="setWeek(w.monday, 'closed')"
            >
              Cerrado
            </button>
          </div>
        </div>
      </div>
    </template>

    <div
      v-if="!loading && blocks.length"
      class="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur border-border"
    >
      <div class="flex items-center gap-3 px-4 py-3 mx-auto max-w-3xl">
        <span class="text-sm text-muted-foreground">
          {{ rotation.length }} en rotación · {{ overrideCount }} ajuste(s)
        </span>
        <Button size="lg" class="ml-auto" :disabled="saving" @click="save">
          {{ saving ? "Guardando…" : "Guardar calendario" }}
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
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-vue-next";
import { todayISO } from "~/utils/comandas";
import {
  mondayOf,
  addDays,
  resolveWeek,
  type WeekBlock,
  type WeekOverride,
  type RotationConfig,
} from "~/utils/rotation";
import usePocketBase from "@common/composables/usePocketbase";

const WEEKS_AHEAD = 13; // ~3 meses

const { fetchCollection, updateItem, createItem } = usePocketBaseCore();

const loading = ref(true);
const saving = ref(false);
const toastMsg = ref("");
const menuRecordId = ref<string | null>(null);

const blocks = ref<WeekBlock[]>([]);
const rotation = ref<string[]>([]);
const anchor = ref<string>("");
const overrides = reactive<Record<string, WeekOverride>>({});
const expanded = ref<string>("");

const cfg = computed<RotationConfig>(() => ({
  blocks: blocks.value,
  rotation: rotation.value,
  anchor: anchor.value,
  overrides,
}));

const weeks = computed(() => {
  const start = mondayOf(todayISO());
  const out: { monday: string; res: ReturnType<typeof resolveWeek> }[] = [];
  for (let i = 0; i < WEEKS_AHEAD; i++) {
    const monday = addDays(start, i * 7);
    out.push({ monday, res: resolveWeek(monday, cfg.value) });
  }
  return out;
});

const overrideCount = computed(() => Object.keys(overrides).length);

function blockName(id: string) {
  return blocks.value.find((b) => b.id === id)?.name ?? "(eliminado)";
}
function blockColor(id: string) {
  return blocks.value.find((b) => b.id === id)?.color ?? "#9ca3af";
}

function addToRotation(id: string) {
  rotation.value.push(id);
}
function removeAt(i: number) {
  rotation.value.splice(i, 1);
}
function move(i: number, dir: number) {
  const j = i + dir;
  if (j < 0 || j >= rotation.value.length) return;
  const arr = rotation.value;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

function shiftAnchor(weeks: number) {
  anchor.value = addDays(anchor.value, weeks * 7);
}

function isPinned(monday: string, id: string) {
  const ov = overrides[monday];
  return !!ov && "block" in ov && ov.block === id;
}
function isClosed(monday: string) {
  const ov = overrides[monday];
  return !!ov && "closed" in ov && ov.closed;
}
function setWeek(monday: string, choice: "auto" | "closed" | string) {
  if (choice === "auto") delete overrides[monday];
  else if (choice === "closed") overrides[monday] = { closed: true };
  else overrides[monday] = { block: choice };
  expanded.value = "";
}

function prettyMonday(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
  });
}
function rangeLabel(monday: string) {
  const friday = addDays(monday, 4);
  const m = new Date(monday + "T00:00:00");
  const f = new Date(friday + "T00:00:00");
  const month = f.toLocaleDateString("es-MX", { month: "short" });
  return `${m.getDate()}–${f.getDate()} ${month}`;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
function toast(msg: string) {
  toastMsg.value = msg;
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
      blocks.value = (rec.week_blocks ?? []) as WeekBlock[];
      rotation.value = (rec.rotation ?? []) as string[];
      const ov = (rec.overrides ?? {}) as Record<string, WeekOverride>;
      Object.keys(ov).forEach((k) => (overrides[k] = ov[k]));
    }
  } catch {
    /* offline */
  } finally {
    loading.value = false;
    // Ancla por defecto: el lunes de esta semana.
    if (!anchor.value) anchor.value = mondayOf(todayISO());
  }
}

async function save() {
  saving.value = true;
  toast("Guardando…");
  // No persistir overrides de semanas ya pasadas.
  const thisMon = mondayOf(todayISO());
  const cleanOverrides: Record<string, WeekOverride> = {};
  Object.keys(overrides).forEach((k) => {
    if (k >= thisMon) cleanOverrides[k] = overrides[k];
  });
  try {
    if (menuRecordId.value) {
      await updateItem("menu", menuRecordId.value, {
        rotation: rotation.value,
        rotation_anchor: anchor.value,
        overrides: cleanOverrides,
      });
    } else {
      const created = await createItem("menu", {
        dishes: { guisos: [], sides: [], bebidas: [] },
        active: { guisos: [], sides: [], bebidas: [] },
        sold_out: [],
        week_blocks: [],
        rotation: rotation.value,
        rotation_anchor: anchor.value,
        overrides: cleanOverrides,
      });
      menuRecordId.value = (created as any).id;
    }
    toast("Calendario guardado ✅");
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
