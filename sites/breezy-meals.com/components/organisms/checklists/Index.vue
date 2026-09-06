<template>
  <section class="max-w-3xl">
    <!-- Date picker + week strip -->
    <div v-if="isManager" class="mb-4 space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <Label for="checklist-date" class="text-xs font-bold uppercase">
          Fecha
        </Label>
        <Input
          id="checklist-date"
          v-model="selectedDate"
          type="date"
          class="h-9 w-[10.5rem]"
        />
        <Button
          v-if="!isTodaySelected"
          variant="outline"
          size="sm"
          @click="goToday"
        >
          Hoy
        </Button>
      </div>

      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          class="h-9 w-9 shrink-0"
          aria-label="Día anterior"
          title="Día anterior"
          @click="prevWeek"
        >
          <ClientOnly><ChevronLeft :size="18" /></ClientOnly>
        </Button>

        <div class="grid flex-1 grid-cols-7 gap-1.5">
          <button
            v-for="d in weekStrip"
            :key="d.date"
            type="button"
            class="flex flex-col items-center gap-0.5 py-2 rounded-lg border transition-colors"
            :class="[
              d.isSelected
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50',
              d.isClosed && !d.isSelected && 'opacity-50',
            ]"
            @click="selectDay(d.date)"
          >
            <span class="text-[10px] font-bold tracking-wide uppercase">
              {{ d.short }}
            </span>
            <span class="text-sm font-bold tabular-nums">{{ d.num }}</span>
            <span
              v-if="d.isToday"
              class="h-1 w-1 rounded-full"
              :class="d.isSelected ? 'bg-primary' : 'bg-muted-foreground'"
            />
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          class="h-9 w-9 shrink-0"
          aria-label="Día siguiente"
          title="Día siguiente"
          @click="nextWeek"
        >
          <ClientOnly><ChevronRight :size="18" /></ClientOnly>
        </Button>
      </div>
    </div>

    <!-- Selected-day header -->
    <div class="flex items-center gap-3 mb-6">
      <div>
        <h2 class="text-xl font-bold">{{ selectedPretty }}</h2>
        <p
          v-if="!isSelectedClosed && dayTotal"
          class="text-sm text-muted-foreground tabular-nums"
        >
          {{ completedCount }} / {{ dayTotal }} listas completadas
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-16 text-center">
      <p class="text-sm text-muted-foreground animate-pulse">Cargando…</p>
    </div>

    <!-- Sunday / closed -->
    <div
      v-else-if="isSelectedClosed"
      class="py-16 text-center border border-dashed rounded-xl border-border"
    >
      <p class="text-2xl">🦭</p>
      <p class="mt-2 font-semibold">Cerrado los domingos</p>
      <p class="mt-1 text-sm text-muted-foreground">
        {{
          isManager
            ? "Elige otro día de la semana para ver sus tareas."
            : "No hay tareas programadas para hoy."
        }}
      </p>
    </div>

    <!-- No templates at all -->
    <div
      v-else-if="templatesEmpty"
      class="py-16 text-center border border-dashed rounded-xl border-border"
    >
      <p class="font-semibold">No hay checklists configuradas.</p>
      <p class="mt-1 text-sm text-muted-foreground">
        Agrega las listas en la colección <code>checklists</code> (campo
        <code>data</code>) de PocketBase.
      </p>
    </div>

    <!-- No tasks scheduled this day -->
    <div
      v-else-if="!dayLists.length"
      class="py-16 text-center border border-dashed rounded-xl border-border"
    >
      <p class="font-semibold">
        {{
          isManager
            ? "Sin tareas para este día."
            : "No tienes tareas asignadas para hoy."
        }}
      </p>
    </div>

    <!-- The day's task lists -->
    <div v-else class="space-y-10">
      <div v-for="t in dayLists" :key="t.id">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-bold leading-tight">{{ t.title }}</h3>
              <Badge
                v-if="statusFor(t.id) === 'done'"
                class="h-5 px-2 text-[11px] bg-green-600/10 text-green-700 hover:bg-green-600/10"
              >
                Completada
              </Badge>
            </div>
            <p
              v-if="t.description"
              class="mt-0.5 text-sm text-muted-foreground"
            >
              {{ t.description }}
            </p>
          </div>
          <span
            class="text-sm font-bold text-muted-foreground tabular-nums shrink-0"
          >
            {{ progressFor(t.id).done }} / {{ progressFor(t.id).total }}
          </span>
        </div>

        <div v-for="section in t.sections" :key="section.key" class="mb-6">
          <div class="flex items-baseline gap-3 mb-3">
            <h4
              class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
            >
              {{ section.label }}
            </h4>
            <Separator class="flex-1 shrink" />
            <Button
              v-if="isManager"
              variant="ghost"
              size="icon"
              class="h-8 w-8 shrink-0"
              :aria-label="`Agregar tarea a ${section.label}`"
              :title="`Agregar tarea a ${section.label}`"
              @click="openCreateTask(section)"
            >
              <Plus :size="16" />
            </Button>
          </div>

          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div
              v-for="item in section.items"
              :key="item.recordId || item.id"
              class="space-y-2"
              :class="(item.kind ?? 'check') !== 'check' && 'sm:col-span-2'"
            >
              <!-- Checkbox -->
              <Toggle
                v-if="(item.kind ?? 'check') === 'check'"
                variant="outline"
                :pressed="isDone(t.id, item)"
                class="flex w-full h-auto justify-start gap-2.5 p-3.5 data-[state=on]:border-primary data-[state=on]:bg-primary/5"
                @click="toggleItem(t.id, item.id)"
              >
                <span
                  class="grid text-white rounded shrink-0 h-5 w-5 place-items-center"
                  :class="isDone(t.id, item) ? 'bg-primary' : 'bg-muted'"
                >
                  <ClientOnly>
                    <Check v-if="isDone(t.id, item)" :size="13" />
                  </ClientOnly>
                </span>
                <span class="text-sm font-semibold text-left">
                  {{ item.label }}
                  <span v-if="item.required" class="text-destructive">*</span>
                </span>
              </Toggle>

              <!-- Number / text -->
              <div
                v-else
                class="p-3.5 border rounded-xl border-border"
                :class="isDone(t.id, item) && 'border-primary/40 bg-primary/5'"
              >
                <Label
                  :for="`${t.id}-${item.id}`"
                  class="flex items-center gap-1 text-sm font-semibold"
                >
                  {{ item.label }}
                  <span v-if="item.required" class="text-destructive">*</span>
                </Label>
                <div class="flex items-center gap-2 mt-2">
                  <Input
                    :id="`${t.id}-${item.id}`"
                    :type="item.kind === 'number' ? 'number' : 'text'"
                    :value="resultFor(t.id, item.id)?.value ?? ''"
                    :placeholder="item.hint"
                    class="max-w-[10rem]"
                    @input="onInput(t.id, item, $event)"
                  />
                  <span
                    v-if="item.unit"
                    class="text-sm font-semibold text-muted-foreground"
                  >
                    {{ item.unit }}
                  </span>
                </div>
              </div>

              <div v-if="isManager" class="flex items-center gap-1.5">
                <Select
                  :model-value="assignmentValue(item)"
                  @update:model-value="onAssigneeChange(item, $event)"
                >
                  <SelectTrigger class="h-8 min-w-0 flex-1 text-xs">
                    <SelectValue placeholder="Asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__unassigned">Sin asignar</SelectItem>
                    <SelectItem
                      v-for="staffUser in assignableUsers"
                      :key="staffUser.id"
                      :value="staffUser.id"
                    >
                      {{ staffUser.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 shrink-0"
                  aria-label="Editar tarea"
                  title="Editar tarea"
                  @click="openEditTask(item)"
                >
                  <Pencil :size="15" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                      aria-label="Archivar tarea"
                      title="Archivar tarea"
                    >
                      <Archive :size="15" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Archivar esta tarea?</AlertDialogTitle>
                      <AlertDialogDescription>
                        “{{ item.label }}” dejará de aparecer en las listas. Su
                        historial se conservará.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        @click="archiveTask(item)"
                      >
                        Archivar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isManager" class="flex items-center gap-3">
          <Button
            v-if="statusFor(t.id) !== 'done'"
            size="sm"
            :disabled="!progressFor(t.id).requiredMet"
            @click="completeChecklist(t.id)"
          >
            Marcar completada
          </Button>
          <Button
            v-else
            variant="outline"
            size="sm"
            @click="reopenChecklist(t.id)"
          >
            Reabrir
          </Button>
        </div>
      </div>
    </div>

    <Dialog v-model:open="taskDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {{ editingItem ? "Editar tarea" : "Nueva tarea" }}
          </DialogTitle>
          <DialogDescription>
            {{
              editingItem
                ? "Actualiza cómo aparece esta tarea."
                : `Agregar a ${targetSection?.label ?? "la sección"}.`
            }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <div class="space-y-1.5">
            <Label for="task-label">Tarea</Label>
            <Input
              id="task-label"
              v-model="taskForm.label"
              placeholder="Descripción de la tarea"
              @keydown.enter="saveTaskForm"
            />
          </div>

          <div class="space-y-1.5">
            <Label>Tipo de respuesta</Label>
            <Select v-model="taskForm.kind">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="check">Casilla</SelectItem>
                <SelectItem value="number">Número</SelectItem>
                <SelectItem value="text">Texto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <label class="flex items-center gap-2 text-sm font-semibold">
            <Checkbox v-model:checked="taskForm.required" />
            Obligatoria
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="taskDialogOpen = false">
            Cancelar
          </Button>
          <Button
            :disabled="savingTask || !taskForm.label.trim()"
            @click="saveTaskForm"
          >
            {{ savingTask ? "Guardando…" : "Guardar" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
</template>

<script lang="ts" setup>
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Separator } from "@common/components/ui/separator";
import { Toggle } from "@common/components/ui/toggle";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Checkbox } from "@common/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@common/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@common/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/ui/select";
import {
  Archive,
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
} from "lucide-vue-next";
import {
  isItemDone,
  type ChecklistItem,
  type ChecklistSection,
  type ItemKind,
} from "~/utils/checklists";

const {
  selectedDate,
  weekStrip,
  selectedPretty,
  isSelectedClosed,
  isTodaySelected,
  dayLists,
  dayTotal,
  completedCount,
  loading,
  templatesEmpty,
  assignableUsers,
  isManager,
  progressFor,
  statusFor,
  resultFor,
  assignmentFor,
  selectDay,
  goToday,
  prevWeek,
  nextWeek,
  toggleItem,
  setValue,
  completeChecklist,
  reopenChecklist,
  setItemAssignee,
  createTask,
  updateTask,
  archiveTask,
} = useChecklists();

const taskDialogOpen = ref(false);
const savingTask = ref(false);
const editingItem = ref<ChecklistItem | null>(null);
const targetSection = ref<ChecklistSection | null>(null);
const taskForm = reactive({
  label: "",
  kind: "check" as ItemKind,
  required: true,
});

function openCreateTask(section: ChecklistSection) {
  editingItem.value = null;
  targetSection.value = section;
  taskForm.label = "";
  taskForm.kind = "check";
  taskForm.required = true;
  taskDialogOpen.value = true;
}

function openEditTask(item: ChecklistItem) {
  editingItem.value = item;
  targetSection.value = null;
  taskForm.label = item.label;
  taskForm.kind = item.kind ?? "check";
  taskForm.required = item.required === true;
  taskDialogOpen.value = true;
}

async function saveTaskForm() {
  const label = taskForm.label.trim();
  if (!label || savingTask.value) return;
  savingTask.value = true;
  const input = {
    label,
    kind: taskForm.kind,
    required: taskForm.required,
  };
  const saved = editingItem.value
    ? await updateTask(editingItem.value, input)
    : targetSection.value
      ? await createTask(targetSection.value, input)
      : false;
  savingTask.value = false;
  if (saved) taskDialogOpen.value = false;
}

const isDone = (listId: string, item: ChecklistItem) =>
  isItemDone(item, resultFor(listId, item.id));

const assignmentValue = (item: ChecklistItem) =>
  assignmentFor(item.recordId)?.assignedTo || "__unassigned";

function onAssigneeChange(item: ChecklistItem, value: unknown) {
  const assignedTo = String(value);
  void setItemAssignee(item, assignedTo === "__unassigned" ? "" : assignedTo);
}

function onInput(listId: string, item: ChecklistItem, e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  setValue(
    listId,
    item.id,
    item.kind === "number" ? (raw === "" ? "" : Number(raw)) : raw,
  );
}
</script>
