<template>
  <Card class="max-w-md mx-auto p-5 sm:p-6">
    <!-- Reloj en vivo -->
    <div class="flex items-center gap-3 pb-4 mb-4 border-b border-border">
      <div
        class="grid w-10 h-10 rounded-full place-items-center bg-primary/10 text-primary"
      >
        <ClientOnly><Clock :size="20" /></ClientOnly>
      </div>
      <div>
        <p class="text-2xl font-bold leading-none tabular-nums">{{ clock }}</p>
        <p class="text-xs capitalize text-muted-foreground mt-0.5">
          {{ dateLabel }}
        </p>
      </div>
      <Badge variant="secondary" class="ml-auto tabular-nums">
        {{ insideCount }} dentro
      </Badge>
    </div>

    <!-- Navegación -->
    <div class="flex gap-1 mb-5">
      <Button
        v-for="t in tabs"
        :key="t.key"
        size="sm"
        class="flex-1"
        :variant="tab === t.key ? 'secondary' : 'ghost'"
        @click="tab = t.key"
      >
        {{ t.label }}
      </Button>
    </div>

    <!-- ===== RELOJ (toggle) ===== -->
    <div v-if="tab === 'reloj'">
      <template v-if="me.id">
        <!-- Estado -->
        <div class="p-5 mb-4 text-center border rounded-xl border-border">
          <p class="text-sm text-muted-foreground truncate">{{ me.name }}</p>
          <p
            class="mt-1 text-2xl font-bold"
            :class="amInside ? 'text-green-600' : 'text-muted-foreground'"
          >
            {{ amInside ? "Dentro" : "Fuera" }}
          </p>
          <p
            v-if="amInside"
            class="mt-1 text-xs text-muted-foreground tabular-nums"
          >
            Desde {{ myClockInTime }} · {{ fmtDur(myElapsedMinutes) }}
          </p>
        </div>

        <!-- Toggle -->
        <Button
          size="lg"
          class="w-full h-16 text-lg"
          :variant="amInside ? 'outline' : 'default'"
          :disabled="busy"
          @click="toggle"
        >
          <ClientOnly>
            <LogOut v-if="amInside" :size="20" class="mr-2" />
            <LogIn v-else :size="20" class="mr-2" />
          </ClientOnly>
          {{ amInside ? "Registrar salida" : "Registrar entrada" }}
        </Button>

        <!-- Stats rápidas -->
        <div class="grid grid-cols-2 gap-2.5 mt-4">
          <div class="p-3 text-center border rounded-lg border-border">
            <p class="text-xs text-muted-foreground">Hoy</p>
            <p class="text-lg font-bold tabular-nums">
              {{ fmtDur(workedMinutes(me.id, todayStr, todayStr)) }}
            </p>
          </div>
          <div class="p-3 text-center border rounded-lg border-border">
            <p class="text-xs text-muted-foreground">Esta semana</p>
            <p class="text-lg font-bold tabular-nums">
              {{ fmtDur(workedMinutes(me.id, weekStart, weekEnd)) }}
            </p>
          </div>
        </div>
      </template>

      <div v-else class="py-10 text-sm text-center text-muted-foreground">
        Inicia sesión para registrar tu turno.
      </div>
    </div>

    <!-- ===== RESUMEN (horas + exportar) ===== -->
    <div v-else-if="tab === 'resumen'">
      <!-- Selector de periodo -->
      <div class="flex gap-1 mb-4">
        <Button
          size="sm"
          class="flex-1"
          :variant="period === 'week' ? 'secondary' : 'ghost'"
          @click="period = 'week'"
        >
          Esta semana
        </Button>
        <Button
          size="sm"
          class="flex-1"
          :variant="period === 'all' ? 'secondary' : 'ghost'"
          @click="period = 'all'"
        >
          Todo
        </Button>
      </div>

      <p
        class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
      >
        {{ rangeLabel }}
      </p>

      <div
        v-if="!people.length"
        class="py-8 text-sm text-center text-muted-foreground"
      >
        Sin registros.
      </div>
      <div v-else class="divide-y divide-border">
        <div
          v-for="m in people"
          :key="m.id"
          class="flex items-center gap-3 py-3"
        >
          <span
            class="w-2 h-2 rounded-full shrink-0"
            :class="isIn(m.id) ? 'bg-green-500' : 'bg-muted-foreground/30'"
          ></span>
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate">{{ m.name }}</p>
            <p class="text-xs text-muted-foreground tabular-nums">
              Hoy {{ fmtDur(workedMinutes(m.id, todayStr, todayStr)) }}
              <template v-if="isIn(m.id)">
                · dentro desde {{ lastTime(m.id) }}</template
              >
            </p>
          </div>
          <span class="text-sm font-bold tabular-nums">
            {{ fmtDur(workedMinutes(m.id, rangeFrom, rangeTo)) }}
          </span>
        </div>
      </div>
      <div class="flex items-center pt-3 mt-1 border-t border-border">
        <span class="text-sm font-semibold">
          Total {{ period === "week" ? "semana" : "periodo" }}
        </span>
        <span class="ml-auto text-sm font-bold tabular-nums">
          {{ fmtDur(rangeTotalMinutes) }}
        </span>
      </div>

      <!-- Descargas (solo admin) -->
      <div v-if="isAdmin" class="grid gap-2 mt-5">
        <Button
          variant="outline"
          size="sm"
          :disabled="!data.punches.length"
          @click="downloadReport"
        >
          <ClientOnly><Download :size="15" class="mr-2" /></ClientOnly>
          Descargar reporte de horas (CSV)
        </Button>
        <Button
          variant="ghost"
          size="sm"
          :disabled="!data.punches.length"
          @click="downloadPunches"
        >
          <ClientOnly><Download :size="15" class="mr-2" /></ClientOnly>
          Descargar todos los registros (CSV)
        </Button>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toastMsg"
      class="fixed z-50 px-4 py-2.5 text-sm font-medium -translate-x-1/2 rounded-lg bottom-6 left-1/2 shadow-lg"
      :class="
        toastKind === 'error'
          ? 'bg-destructive text-white'
          : 'bg-foreground text-background'
      "
    >
      {{ toastMsg }}
    </div>
  </Card>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { Clock, LogIn, LogOut, Download } from "lucide-vue-next";
import { todayISO } from "~/utils/comandas";
import { mondayOf, addDays } from "~/utils/rotation";

/* ===== Composables ===== */
const { waLink } = useWhatsappOrder();

/* ===== Config ===== */
const COLLECTION = "clockins";
const FIELD = "data";

/* ===== Tipos ===== */
type PunchType = "in" | "out";
interface Punch {
  user: string;
  name: string;
  type: PunchType;
  at: string;
}
interface Person {
  id: string;
  name: string;
}
interface ClockData {
  punches: Punch[];
}

const { fetchCollection, createItem, updateItem, subscribe, unsubscribe } =
  usePocketBaseCore();
const { openWhatsApp } = useWhatsappOrder();

const props = defineProps({
  isAdmin: {
    type: Boolean,
    default: false,
  },
  // Cuenta autenticada que registra su propio turno.
  currentUser: {
    type: Object as PropType<Person>,
    default: () => ({ id: "", name: "" }),
  },
});

/* ===== Estado ===== */
const loading = ref(true);
const recordId = ref<string | null>(null);
const data = reactive<ClockData>({ punches: [] });

const tab = ref<"reloj" | "resumen">("reloj");
const tabs = [
  { key: "reloj", label: "Reloj" },
  { key: "resumen", label: "Resumen" },
] as const;

const period = ref<"week" | "all">("week");
const busy = ref(false);
const toastMsg = ref("");
const toastKind = ref<"ok" | "error">("ok");

const now = ref(new Date());
let ticker: ReturnType<typeof setInterval> | undefined;

// Usuario actual (desde la cuenta con sesión iniciada).
const me = computed<Person>(() => props.currentUser ?? { id: "", name: "" });

/* ===== Reloj / fechas ===== */
const clock = computed(() =>
  now.value.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
);
const dateLabel = computed(() => {
  const s = now.value.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
});

const todayStr = computed(() => todayISO());
const weekStart = computed(() => mondayOf(todayStr.value));
const weekEnd = computed(() => addDays(weekStart.value, 6));

// Rango activo (semana o todo) para el resumen y la exportación.
const allDates = computed(() => data.punches.map((p) => localDay(p.at)).sort());
const rangeFrom = computed(() =>
  period.value === "week"
    ? weekStart.value
    : (allDates.value[0] ?? todayStr.value),
);
const rangeTo = computed(() =>
  period.value === "week" ? weekEnd.value : todayStr.value,
);
const rangeLabel = computed(() => {
  if (period.value === "week") {
    const a = new Date(weekStart.value + "T00:00:00");
    const b = new Date(weekEnd.value + "T00:00:00");
    const mo = b.toLocaleDateString("es-MX", { month: "short" });
    return `Semana ${a.getDate()}–${b.getDate()} ${mo}`;
  }
  return `Todo · ${rangeFrom.value} → ${rangeTo.value}`;
});

/* ===== Personas (derivadas de los registros) ===== */
// Ya no hay roster: la lista sale de quién ha fichado, más la propia cuenta.
const punchers = computed<Person[]>(() => {
  const map = new Map<string, string>();
  for (const p of data.punches) map.set(p.user, p.name); // último gana = nombre más reciente
  if (me.value.id && !map.has(me.value.id)) map.set(me.value.id, me.value.name);
  return [...map]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
});
// Admin ve a todos; el resto solo se ve a sí mismo.
const people = computed<Person[]>(() =>
  props.isAdmin
    ? punchers.value
    : punchers.value.filter((p) => p.id === me.value.id),
);

/* ===== Estado por persona ===== */
function punchesOf(userId: string): Punch[] {
  return data.punches
    .filter((p) => p.user === userId)
    .sort((a, b) => a.at.localeCompare(b.at));
}
function lastPunch(userId: string): Punch | null {
  const ps = punchesOf(userId);
  return ps[ps.length - 1] ?? null;
}
function isIn(userId: string): boolean {
  return lastPunch(userId)?.type === "in";
}
function lastTime(userId: string): string {
  const p = lastPunch(userId);
  return p ? timeOf(p.at) : "";
}
const insideCount = computed(
  () => punchers.value.filter((m) => isIn(m.id)).length,
);

/* ===== Estado del usuario actual ===== */
const amInside = computed(() => isIn(me.value.id));
const myClockInTime = computed(() => {
  const p = lastPunch(me.value.id);
  return p && p.type === "in" ? timeOf(p.at) : "";
});
const myElapsedMinutes = computed(() => {
  const p = lastPunch(me.value.id);
  if (!p || p.type !== "in") return 0;
  return Math.max(0, (now.value.getTime() - new Date(p.at).getTime()) / 60000);
});

/* ===== Horas ===== */
function localDay(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}
function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Turnos (entrada→salida) de un usuario en [from,to]. Turno abierto: outAt=null.
function buildShifts(userId: string, from: string, to: string) {
  const ps = punchesOf(userId).filter((p) => {
    const d = localDay(p.at);
    return d >= from && d <= to;
  });
  const shifts: { inAt: string; outAt: string | null }[] = [];
  let open: string | null = null;
  for (const p of ps) {
    if (p.type === "in") {
      if (open) shifts.push({ inAt: open, outAt: null });
      open = p.at;
    } else if (p.type === "out" && open) {
      shifts.push({ inAt: open, outAt: p.at });
      open = null;
    }
  }
  if (open) shifts.push({ inAt: open, outAt: null });
  return shifts.map((s) => {
    const inT = new Date(s.inAt).getTime();
    const outT = s.outAt ? new Date(s.outAt).getTime() : now.value.getTime();
    return {
      date: localDay(s.inAt),
      inAt: s.inAt,
      outAt: s.outAt,
      mins: Math.max(0, (outT - inT) / 60000),
    };
  });
}
// Minutos trabajados en [from, to] (turno abierto cuenta hasta ahora).
function workedMinutes(userId: string, from: string, to: string): number {
  return buildShifts(userId, from, to).reduce((sum, s) => sum + s.mins, 0);
}
function fmtDur(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}
const rangeTotalMinutes = computed(() =>
  people.value.reduce(
    (sum, m) => sum + workedMinutes(m.id, rangeFrom.value, rangeTo.value),
    0,
  ),
);

/* ===== Exportar CSV (sin dependencias) ===== */
function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function csvRow(arr: unknown[]): string {
  return arr.map(csvCell).join(",");
}
function downloadCSV(filename: string, content: string) {
  if (typeof window === "undefined") return;
  // BOM para que Excel respete acentos.
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadReport() {
  const from = rangeFrom.value;
  const to = rangeTo.value;
  const rows: string[] = [];
  rows.push(csvRow(["Reporte de horas — Breezy"]));
  rows.push(csvRow(["Periodo", from, "a", to]));
  rows.push(csvRow(["Generado", new Date().toLocaleString("es-MX")]));
  rows.push("");
  rows.push(csvRow(["Empleado", "Fecha", "Entrada", "Salida", "Horas"]));

  let grand = 0;
  for (const m of punchers.value) {
    const shifts = buildShifts(m.id, from, to);
    let sub = 0;
    for (const s of shifts) {
      sub += s.mins;
      rows.push(
        csvRow([
          m.name,
          s.date,
          timeOf(s.inAt),
          s.outAt ? timeOf(s.outAt) : "— (abierto)",
          (s.mins / 60).toFixed(2),
        ]),
      );
    }
    if (shifts.length) {
      rows.push(
        csvRow(["", "", "", `Subtotal ${m.name}`, (sub / 60).toFixed(2)]),
      );
    }
    grand += sub;
  }

  rows.push("");
  rows.push(csvRow(["RESUMEN"]));
  rows.push(csvRow(["Empleado", "Horas"]));
  for (const m of punchers.value) {
    rows.push(
      csvRow([m.name, (workedMinutes(m.id, from, to) / 60).toFixed(2)]),
    );
  }
  rows.push(csvRow(["TOTAL", (grand / 60).toFixed(2)]));

  downloadCSV(`reporte-horas_${from}_a_${to}.csv`, rows.join("\n"));
}

function downloadPunches() {
  const rows: string[] = [
    csvRow(["Empleado", "Tipo", "Fecha", "Hora", "TimestampISO"]),
  ];
  const sorted = [...data.punches].sort((a, b) => a.at.localeCompare(b.at));
  for (const p of sorted) {
    rows.push(
      csvRow([
        p.name,
        p.type === "in" ? "Entrada" : "Salida",
        localDay(p.at),
        timeOf(p.at),
        p.at,
      ]),
    );
  }
  downloadCSV(`registros_${todayStr.value}.csv`, rows.join("\n"));
}

/* ===== Toast ===== */
let toastTimer: ReturnType<typeof setTimeout> | undefined;
function toast(msg: string, kind: "ok" | "error" = "ok") {
  toastMsg.value = msg;
  toastKind.value = kind;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastMsg.value = ""), 2500);
}

/* ===== Datos (single JSON object) ===== */
function normalize(d: any): ClockData {
  return { punches: Array.isArray(d?.punches) ? d.punches : [] };
}
function apply(d: ClockData) {
  data.punches = d.punches;
}

async function load() {
  loading.value = true;
  try {
    const res = await fetchCollection(
      COLLECTION,
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
      recordId.value = rec.id;
      apply(normalize(rec[FIELD]));
    }
  } catch {
    /* offline */
  } finally {
    loading.value = false;
  }
}

// Relee lo más fresco, aplica la mutación encima y guarda (mitiga choques).
async function mutate(fn: (d: ClockData) => ClockData) {
  let base: ClockData = { punches: [...data.punches] };
  try {
    const res = await fetchCollection(
      COLLECTION,
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
      recordId.value = rec.id;
      base = normalize(rec[FIELD]);
    }
  } catch {
    /* usa estado local si no hay red */
  }
  const next = fn(base);
  if (recordId.value) {
    await updateItem(COLLECTION, recordId.value, { [FIELD]: next });
  } else {
    const created = await createItem(COLLECTION, { [FIELD]: next });
    recordId.value = (created as any).id;
  }
  apply(next);
}

/* ===== Registrar turno (toggle) ===== */
async function toggle() {
  if (busy.value || !me.value.id) return;
  const direction: PunchType = amInside.value ? "out" : "in";

  // Abre la pestaña YA, dentro del gesto del clic (así iOS y los bloqueadores
  // la permiten). La redirigimos cuando termine el guardado.
  const waTab = window.open("about:blank", "_blank");

  busy.value = true;
  const punch: Punch = {
    user: me.value.id,
    name: me.value.name,
    type: direction,
    at: new Date().toISOString(),
  };
  try {
    await mutate((d) => ({ ...d, punches: [...d.punches, punch] }));
    const time = timeOf(punch.at);
    const verb = direction === "in" ? "Entrada" : "Salida";
    const url = waLink(
      `🕐 *Registro de turno*\n👤 ${me.value.name}\n${
        direction === "in" ? "🟢" : "🔴"
      } *${verb}* · ${time}\n📅 ${dateLabel.value}`,
    );
    if (waTab && !waTab.closed) waTab.location.href = url;
    else window.open(url, "_blank", "noopener");
    toast(`${verb} · ${time}`);
  } catch {
    waTab?.close();
    toast("No se pudo registrar", "error");
  } finally {
    busy.value = false;
  }
}

/* ===== Realtime (PC + teléfono en sync) ===== */
let unsub: (() => void) | null = null;
function onEvent(e: { action: string; record: any }) {
  if (e.action === "delete") return;
  recordId.value = e.record.id;
  apply(normalize(e.record[FIELD]));
}

onMounted(async () => {
  now.value = new Date();
  ticker = setInterval(() => (now.value = new Date()), 1000);
  await load();
  try {
    unsub = await subscribe(COLLECTION, onEvent, "*");
  } catch {
    /* sin realtime; sigue por recarga */
  }
});
onBeforeUnmount(() => {
  clearInterval(ticker);
  try {
    if (unsub) unsub();
    else unsubscribe(COLLECTION);
  } catch {
    /* noop */
  }
});
</script>
