<template>
  <main class="mx-auto max-w-7xl space-y-6 px-5 pb-16 pt-6 sm:px-6 lg:py-8">
    <section>
      <div class="relative p-6 sm:p-8">
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-400/10"
        />
        <div class="relative space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              class="text-[10px] uppercase tracking-widest"
            >
              Mes activo
            </Badge>
            <Badge
              variant="outline"
              class="text-[10px] uppercase tracking-widest"
            >
              {{ monthLabel }}
            </Badge>
            <Badge
              variant="outline"
              class="text-[10px] uppercase tracking-widest"
            >
              {{ weekRows.length }} semana(s)
            </Badge>
          </div>

          <div class="space-y-1.5">
            <h1 class="font-heading text-2xl leading-tight sm:text-3xl">
              Menú mensual
            </h1>
            <p class="max-w-2xl text-xs text-muted-foreground sm:text-sm">
              Vista calendario del menú activo del mes (lunes a viernes), usando
              la rotación y ajustes semanales configurados.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="loading" class="space-y-3">
      <div class="overflow-x-auto pb-2">
        <div class="min-w-[960px] space-y-3">
          <Card v-for="i in 5" :key="i" class="border-border/70 shadow-sm">
            <CardContent class="grid grid-cols-5 gap-3 p-4">
              <Skeleton class="h-3 w-20" />
              <Skeleton class="h-3 w-20" />
              <Skeleton class="h-3 w-20" />
              <Skeleton class="h-3 w-20" />
              <Skeleton class="h-3 w-20" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <section
      v-else-if="!record"
      class="grid min-h-[240px] place-items-center rounded-2xl border border-dashed border-border p-6 text-center"
    >
      <div class="max-w-md space-y-2">
        <p class="text-2xl">🗓️</p>
        <h2 class="text-base font-semibold">No hay calendario disponible</h2>
        <p class="text-xs text-muted-foreground">
          No encontramos una configuración de menú para este mes.
        </p>
      </div>
    </section>

    <!-- UI Improved with Horizontal Overflow Scrolling -->
    <section v-else class="space-y-3">
      <div class="relative overflow-x-auto pb-4 scrollbar-thin">
        <div class="min-w-[960px] space-y-3">
          <!-- Days Header -->
          <div
            class="grid grid-cols-5 gap-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            <div
              v-for="col in weekColumns"
              :key="col"
              class="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-center shadow-2xs"
            >
              {{ col }}
            </div>
          </div>

          <!-- Week Rows -->
          <div
            v-for="week in weekRows"
            :key="week.monday"
            class="grid grid-cols-5 gap-3 px-0.5"
          >
            <Card
              v-for="day in week.days"
              :key="day.iso"
              class="border-border/70 shadow-sm transition-all duration-200 hover:shadow-md"
              :class="[
                day.isToday && 'ring-2 ring-primary/60 bg-primary/5',
                !day.inCurrentMonth && 'opacity-40 grayscale-[20%]',
              ]"
            >
              <CardContent class="space-y-3 p-3.5">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p
                      class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      {{ day.weekdayLabel }}
                    </p>
                    <p class="text-xs font-semibold">{{ day.dateLabel }}</p>
                  </div>
                  <Badge
                    v-if="day.isToday"
                    variant="secondary"
                    class="text-[10px] px-1.5 py-0.5"
                    >Hoy</Badge
                  >
                </div>

                <div
                  v-if="day.state === 'closed'"
                  class="rounded-md border border-dashed border-border/80 bg-muted/20 p-2.5 text-center"
                >
                  <p class="text-xs font-semibold">Cerrado</p>
                  <p class="text-[11px] text-muted-foreground">
                    No hay servicio esta semana.
                  </p>
                </div>

                <div
                  v-else-if="day.state === 'empty'"
                  class="rounded-md border border-dashed border-border/80 bg-muted/20 p-2.5 text-center"
                >
                  <p class="text-xs font-semibold">Sin menú publicado</p>
                  <p class="text-[11px] text-muted-foreground">
                    Aún no hay platillos para este día.
                  </p>
                </div>

                <div v-else class="space-y-3">
                  <div
                    v-for="group in day.groups"
                    :key="`${day.iso}-${group.key}`"
                    class="space-y-1"
                  >
                    <p
                      class="text-[10px] font-bold uppercase tracking-widest text-primary/80"
                    >
                      {{ group.label }}
                    </p>
                    <ul class="space-y-0.5">
                      <li
                        v-for="item in group.items"
                        :key="`${day.iso}-${group.key}-${item}`"
                        class="text-xs leading-snug text-foreground/90"
                      >
                        • {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { Badge } from "@common/components/ui/badge";
import { Card, CardContent } from "@common/components/ui/card";
import { Skeleton } from "@common/components/ui/skeleton";
import {
  emptyDayDishes,
  groupsFromData,
  normalizeDishNames,
  todayISO,
  type DayDishes,
  type GroupKey,
  type MenuRecord,
} from "~/utils/comandas";
import {
  addDays,
  mondayOf,
  resolveDay,
  resolveWeek,
  type RotationConfig,
  type WeekBlock,
  type WeekOverride,
} from "~/utils/rotation";

definePageMeta({ layout: "breezy" });

type MenuRecordFull = MenuRecord & {
  week_blocks?: WeekBlock[];
  rotation?: string[];
  rotation_anchor?: string;
  overrides?: Record<string, WeekOverride>;
  active_date?: string;
};

interface DayGroupView {
  key: string;
  label: string;
  items: string[];
}

interface DayView {
  iso: string;
  weekdayLabel: string;
  dateLabel: string;
  isToday: boolean;
  inCurrentMonth: boolean;
  state: "menu" | "closed" | "empty";
  blockName: string;
  groups: DayGroupView[];
}

interface WeekRowView {
  monday: string;
  days: DayView[];
}

const { fetchCollection } = usePocketBaseCore();

const loading = ref(true);
const record = ref<MenuRecordFull | null>(null);

const weekColumns = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const monthStart = computed(() => {
  const now = new Date(todayISO() + "T00:00:00");
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  return first.toISOString().slice(0, 10);
});

const monthEnd = computed(() => {
  const start = new Date(monthStart.value + "T00:00:00");
  const last = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  return last.toISOString().slice(0, 10);
});

const monthLabel = computed(() => {
  const date = new Date(monthStart.value + "T00:00:00");
  return date
    .toLocaleDateString("es-MX", { month: "long", year: "numeric" })
    .replace(/^./, (char) => char.toUpperCase());
});

const rotationCfg = computed<RotationConfig>(() => ({
  blocks: record.value?.week_blocks ?? [],
  rotation: record.value?.rotation ?? [],
  anchor: record.value?.rotation_anchor ?? "",
  overrides: record.value?.overrides ?? {},
}));

function dayTitle(iso: string) {
  const date = new Date(iso + "T00:00:00");
  const weekdayLabel = date
    .toLocaleDateString("es-MX", { weekday: "long" })
    .replace(/^./, (char) => char.toUpperCase());
  const dateLabel = date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
  });
  return { weekdayLabel, dateLabel };
}

function groupsForMenu(menu: DayDishes): DayGroupView[] {
  return groupsFromData(menu as Record<string, unknown>)
    .map((group) => ({
      key: group.key,
      label: group.label,
      items: menu[group.key] ?? [],
    }))
    .filter((group) => group.items.length > 0);
}

function dayMenuFor(iso: string) {
  const rec = record.value;
  if (!rec) return { state: "empty" as const, blockName: "", groups: [] };

  const overrideResolved = resolveWeek(mondayOf(iso), rotationCfg.value);
  if (overrideResolved.closed) {
    return { state: "closed" as const, blockName: "", groups: [] };
  }

  const activeToday = normalizeDishNames(
    rec.active as Partial<Record<GroupKey, unknown>>,
  );
  const activeIsFreshToday =
    rec.active_date === todayISO() &&
    groupsFromData(activeToday as Record<string, unknown>).some(
      (group) => (activeToday[group.key] ?? []).length > 0,
    );

  const resolved = resolveDay(iso, rotationCfg.value);

  const menu =
    iso === todayISO() && activeIsFreshToday
      ? activeToday
      : resolved
        ? normalizeDishNames(
            resolved.menu as Partial<Record<GroupKey, unknown>>,
          )
        : emptyDayDishes();

  const groups = groupsForMenu(menu);
  return {
    state: groups.length ? ("menu" as const) : ("empty" as const),
    blockName: resolved?.block.name ?? "",
    groups,
  };
}

const weekRows = computed<WeekRowView[]>(() => {
  const rows: WeekRowView[] = [];
  let cursor = mondayOf(monthStart.value);

  while (cursor <= monthEnd.value) {
    const days = Array.from({ length: 5 }, (_, offset) => {
      const iso = addDays(cursor, offset);
      const titles = dayTitle(iso);
      const dayMenu = dayMenuFor(iso);
      return {
        iso,
        weekdayLabel: titles.weekdayLabel,
        dateLabel: titles.dateLabel,
        isToday: iso === todayISO(),
        inCurrentMonth: iso >= monthStart.value && iso <= monthEnd.value,
        state: dayMenu.state,
        blockName: dayMenu.blockName,
        groups: dayMenu.groups,
      };
    });

    rows.push({ monday: cursor, days });
    cursor = addDays(cursor, 7);
  }

  // If the 1st of the month falls on a Saturday or Sunday,
  // the first row will contain zero days belonging to the current month.
  return rows.filter((row) => row.days.some((day) => day.inCurrentMonth));
});

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
    record.value = (res.items[0] as unknown as MenuRecordFull) ?? null;
  } catch {
    record.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>
