<template>
  <main
    class="mx-auto w-full max-w-7xl space-y-6 px-4 pb-16 pt-6 sm:px-6 lg:py-8"
  >
    <header class="border-b border-border pb-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase text-primary">Equipo Breezy</p>
          <h1 class="mt-1 font-heading text-3xl font-extrabold">
            Horario semanal
          </h1>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ weekRangeLabel }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            aria-label="Semana anterior"
            @click="moveWeek(-1)"
          >
            <ChevronLeft :size="18" />
          </Button>
          <Button variant="outline" @click="goToCurrentWeek"
            >Esta semana</Button
          >
          <Button
            size="icon"
            variant="outline"
            aria-label="Semana siguiente"
            @click="moveWeek(1)"
          >
            <ChevronRight :size="18" />
          </Button>
          <Button v-if="canEdit" class="ml-1" @click="openNewShift()">
            <Plus :size="17" class="mr-2" /> Asignar turno
          </Button>
        </div>
      </div>
      <p
        v-if="!canEdit"
        class="mt-4 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Eye :size="15" /> Puedes consultar el horario. Solo usuarios
        verificados pueden editarlo.
      </p>
    </header>

    <Alert v-if="errorMessage" variant="destructive">
      <CircleAlert :size="18" />
      <AlertTitle>No se pudo cargar el horario</AlertTitle>
      <AlertDescription>{{ errorMessage }}</AlertDescription>
    </Alert>

    <section v-if="loading" class="space-y-3">
      <Skeleton v-for="index in 4" :key="index" class="h-24 w-full" />
    </section>

    <section
      v-else-if="!staff.length"
      class="border-y border-border py-16 text-center"
    >
      <Users :size="30" class="mx-auto text-muted-foreground" />
      <h2 class="mt-3 font-semibold">No hay personal disponible</h2>
      <p class="mt-1 text-sm text-muted-foreground">
        Crea las cuentas del equipo antes de asignar turnos.
      </p>
    </section>

    <section v-else class="overflow-x-auto pb-3">
      <div class="min-w-[1120px]">
        <div
          class="grid grid-cols-[180px_repeat(7,minmax(128px,1fr))] border-y border-border bg-muted/40"
        >
          <div
            class="px-3 py-3 text-xs font-bold uppercase text-muted-foreground"
          >
            Personal
          </div>
          <div
            v-for="day in weekDays"
            :key="day.iso"
            class="border-l border-border px-3 py-3 text-center"
          >
            <p class="text-xs font-bold uppercase text-muted-foreground">
              {{ day.weekday }}
            </p>
            <p
              class="mt-0.5 text-sm font-semibold"
              :class="day.isToday && 'text-primary'"
            >
              {{ day.date }}
            </p>
          </div>
        </div>

        <div
          v-for="person in staff"
          :key="person.id"
          class="grid min-h-24 grid-cols-[180px_repeat(7,minmax(128px,1fr))] border-b border-border"
          :class="person.id === currentUserId && 'bg-primary/[0.035]'"
        >
          <div class="flex min-w-0 items-center gap-3 px-3 py-4">
            <div
              class="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary"
            >
              {{ initials(person) }}
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-bold">{{ staffName(person) }}</p>
              <p class="truncate text-xs text-muted-foreground">
                {{
                  person.title ||
                  (person.id === currentUserId ? "Tu horario" : "Equipo")
                }}
              </p>
            </div>
          </div>

          <button
            v-for="day in weekDays"
            :key="`${person.id}-${day.iso}`"
            type="button"
            class="min-h-24 border-l border-border p-2 text-left transition-colors"
            :class="canEdit ? 'hover:bg-muted/60' : 'cursor-default'"
            :disabled="!canEdit"
            @click="openCell(person.id, day.iso)"
          >
            <template v-if="shiftFor(person.id, day.iso)">
              <div class="border-l-4 border-emerald-600 pl-2.5">
                <p class="text-sm font-extrabold tabular-nums">
                  {{ shiftFor(person.id, day.iso)?.start_time }}–{{
                    shiftFor(person.id, day.iso)?.end_time
                  }}
                </p>
                <p
                  v-if="shiftFor(person.id, day.iso)?.position"
                  class="mt-1 text-xs font-semibold text-emerald-800"
                >
                  {{ shiftFor(person.id, day.iso)?.position }}
                </p>
                <p
                  v-if="shiftFor(person.id, day.iso)?.notes"
                  class="mt-1 line-clamp-2 text-xs text-muted-foreground"
                >
                  {{ shiftFor(person.id, day.iso)?.notes }}
                </p>
              </div>
            </template>
            <span
              v-else-if="canEdit"
              class="flex h-full items-center justify-center text-xs text-muted-foreground/70"
            >
              + Asignar
            </span>
            <span
              v-else
              class="flex h-full items-center justify-center text-xs text-muted-foreground/50"
              >Libre</span
            >
          </button>
        </div>
      </div>
    </section>

    <Dialog v-model:open="editorOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{{
            editingShiftId ? "Editar turno" : "Asignar turno"
          }}</DialogTitle>
          <DialogDescription
            >Define el horario de una persona para un día.</DialogDescription
          >
        </DialogHeader>

        <form id="shift-form" class="grid gap-4" @submit.prevent="save">
          <div class="space-y-1.5">
            <Label>Personal</Label>
            <Select v-model="form.assigned_to">
              <SelectTrigger
                ><SelectValue placeholder="Selecciona una persona"
              /></SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="person in staff"
                  :key="person.id"
                  :value="person.id"
                >
                  {{ staffName(person) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5">
            <Label for="shift-date">Fecha</Label>
            <Input
              id="shift-date"
              v-model="form.business_date"
              type="date"
              required
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="shift-start">Entrada</Label>
              <Input
                id="shift-start"
                v-model="form.start_time"
                type="time"
                required
              />
            </div>
            <div class="space-y-1.5">
              <Label for="shift-end">Salida</Label>
              <Input
                id="shift-end"
                v-model="form.end_time"
                type="time"
                required
              />
            </div>
          </div>
          <div class="space-y-1.5">
            <Label for="shift-position">Puesto o área</Label>
            <Input
              id="shift-position"
              v-model="form.position"
              placeholder="Ej. Cocina, caja, reparto"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="shift-notes">Notas</Label>
            <Textarea
              id="shift-notes"
              v-model="form.notes"
              rows="3"
              placeholder="Opcional"
            />
          </div>
          <p v-if="editorError" class="text-sm font-semibold text-destructive">
            {{ editorError }}
          </p>
        </form>

        <DialogFooter class="gap-2 sm:justify-between">
          <Button
            v-if="editingShiftId"
            variant="ghost"
            class="text-destructive hover:text-destructive"
            :disabled="saving"
            @click="remove"
          >
            <Trash2 :size="16" class="mr-2" /> Eliminar
          </Button>
          <div class="flex gap-2 sm:ml-auto">
            <Button
              variant="outline"
              :disabled="saving"
              @click="editorOpen = false"
              >Cancelar</Button
            >
            <Button type="submit" form="shift-form" :disabled="saving">
              {{ saving ? "Guardando..." : "Guardar turno" }}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </main>
</template>

<script setup lang="ts">
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@common/components/ui/alert";
import { Button } from "@common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import { Skeleton } from "@common/components/ui/skeleton";
import { Textarea } from "@common/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  Plus,
  Trash2,
  Users,
} from "lucide-vue-next";
import { addDays, mondayOf } from "~/utils/rotation";
import { todayISO } from "~/utils/comandas";
import type {
  ScheduleStaff,
  StaffShift,
  StaffShiftInput,
} from "~/types/staff-schedule";

definePageMeta({ layout: "staff", staffOnly: true });

const schedule = useStaffSchedule();
const { canEdit, currentUserId } = schedule;
const weekStart = ref(mondayOf(todayISO()));
const staff = ref<ScheduleStaff[]>([]);
const shifts = ref<StaffShift[]>([]);
const loading = ref(true);
const saving = ref(false);
const errorMessage = ref("");
const editorError = ref("");
const editorOpen = ref(false);
const editingShiftId = ref("");
const form = reactive<StaffShiftInput>({
  assigned_to: "",
  business_date: todayISO(),
  start_time: "09:00",
  end_time: "17:00",
  position: "",
  notes: "",
});

const weekDays = computed(() =>
  Array.from({ length: 7 }, (_, index) => {
    const iso = addDays(weekStart.value, index);
    const date = new Date(`${iso}T12:00:00Z`);
    return {
      iso,
      weekday: date
        .toLocaleDateString("es-MX", { weekday: "short", timeZone: "UTC" })
        .replace(".", ""),
      date: date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
      isToday: iso === todayISO(),
    };
  }),
);

const weekRangeLabel = computed(() => {
  const start = new Date(`${weekStart.value}T12:00:00Z`);
  const end = new Date(`${addDays(weekStart.value, 6)}T12:00:00Z`);
  return `${start.toLocaleDateString("es-MX", { day: "numeric", month: "long", timeZone: "UTC" })} – ${end.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}`;
});

const shiftsByCell = computed(
  () =>
    new Map(
      shifts.value.map((shift) => [
        `${shift.assigned_to}:${shift.business_date}`,
        shift,
      ]),
    ),
);

function staffName(person: ScheduleStaff) {
  return person.name?.trim() || person.username || "Sin nombre";
}

function initials(person: ScheduleStaff) {
  return staffName(person)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function shiftFor(userId: string, date: string) {
  return shiftsByCell.value.get(`${userId}:${date}`);
}

async function load() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const [people, weekShifts] = await Promise.all([
      schedule.listStaff(),
      schedule.listWeek(weekStart.value, addDays(weekStart.value, 6)),
    ]);
    staff.value = people;
    shifts.value = weekShifts;
  } catch (error: any) {
    errorMessage.value =
      error?.status === 404
        ? "La colección staff_shifts aún no está instalada en PocketBase."
        : (error?.message ?? "No se pudo cargar el horario.");
  } finally {
    loading.value = false;
  }
}

function moveWeek(amount: number) {
  weekStart.value = addDays(weekStart.value, amount * 7);
}

function goToCurrentWeek() {
  weekStart.value = mondayOf(todayISO());
}

function openNewShift(
  userId = staff.value[0]?.id ?? "",
  date = weekStart.value,
) {
  editingShiftId.value = "";
  editorError.value = "";
  Object.assign(form, {
    assigned_to: userId,
    business_date: date,
    start_time: "09:00",
    end_time: "17:00",
    position: "",
    notes: "",
  });
  editorOpen.value = true;
}

function openCell(userId: string, date: string) {
  if (!canEdit.value) return;
  const shift = shiftFor(userId, date);
  if (!shift) return openNewShift(userId, date);
  editingShiftId.value = shift.id;
  editorError.value = "";
  Object.assign(form, {
    assigned_to: shift.assigned_to,
    business_date: shift.business_date,
    start_time: shift.start_time,
    end_time: shift.end_time,
    position: shift.position ?? "",
    notes: shift.notes ?? "",
  });
  editorOpen.value = true;
}

async function save() {
  saving.value = true;
  editorError.value = "";
  try {
    await schedule.saveShift({ ...form }, editingShiftId.value || undefined);
    editorOpen.value = false;
    await load();
  } catch (error: any) {
    editorError.value =
      error?.status === 400
        ? "Esa persona ya tiene un turno asignado para esta fecha."
        : (error?.message ?? "No se pudo guardar el turno.");
  } finally {
    saving.value = false;
  }
}

async function remove() {
  if (!editingShiftId.value) return;
  saving.value = true;
  editorError.value = "";
  try {
    await schedule.removeShift(editingShiftId.value);
    editorOpen.value = false;
    await load();
  } catch (error: any) {
    editorError.value = error?.message ?? "No se pudo eliminar el turno.";
  } finally {
    saving.value = false;
  }
}

watch(weekStart, load);
onMounted(load);
</script>
