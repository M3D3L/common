<template>
  <section class="max-w-3xl">
    <h2 class="text-xl font-bold">Checklists</h2>
    <p class="mb-6 text-muted-foreground">
      {{ prettyDate }} · marca las tareas conforme las completes.
    </p>

    <!-- Cargando -->
    <div v-if="loading" class="py-16 text-center">
      <p class="text-sm text-muted-foreground animate-pulse">
        Cargando checklists…
      </p>
    </div>

    <!-- Sin plantillas en la BD -->
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

    <!-- Listas -->
    <div v-else class="space-y-4">
      <Card v-for="t in activeTemplates" :key="t.id" class="overflow-hidden">
        <!-- Encabezado (toca para abrir/cerrar) -->
        <button
          type="button"
          class="flex items-center w-full gap-3 p-4 text-left"
          @click="toggleOpen(t.id)"
        >
          <span
            class="grid rounded-lg shrink-0 h-10 w-10 place-items-center"
            :class="
              statusFor(t.id) === 'done'
                ? 'bg-green-600/10 text-green-700'
                : 'bg-primary/10 text-primary'
            "
          >
            <ClientOnly>
              <component :is="iconFor(t.icon)" :size="18" />
            </ClientOnly>
          </span>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="font-bold leading-tight truncate">{{ t.title }}</h3>
              <Badge
                v-if="statusFor(t.id) === 'done'"
                class="h-5 px-2 text-[11px] bg-green-600/10 text-green-700 hover:bg-green-600/10"
              >
                Completada
              </Badge>
            </div>
            <p
              class="mt-0.5 text-xs font-semibold text-muted-foreground tabular-nums"
            >
              {{ progressFor(t.id).done }} / {{ progressFor(t.id).total }}
              <span
                v-if="
                  progressFor(t.id).reqTotal && !progressFor(t.id).requiredMet
                "
                class="text-destructive"
              >
                · faltan obligatorios
              </span>
            </p>
          </div>

          <ClientOnly>
            <ChevronDown
              :size="18"
              class="shrink-0 text-muted-foreground transition-transform"
              :class="isOpen(t.id) && 'rotate-180'"
            />
          </ClientOnly>
        </button>

        <!-- Barra de progreso -->
        <div class="h-1 w-full bg-muted">
          <div
            class="h-full transition-all"
            :class="progressFor(t.id).complete ? 'bg-green-600' : 'bg-primary'"
            :style="{
              width:
                (progressFor(t.id).total
                  ? (progressFor(t.id).done / progressFor(t.id).total) * 100
                  : 0) + '%',
            }"
          />
        </div>

        <!-- Contenido expandible -->
        <div
          v-if="isOpen(t.id)"
          class="p-4 pt-5 space-y-7 border-t border-border"
        >
          <div v-for="section in t.sections" :key="section.key">
            <div class="flex items-baseline gap-3 mb-3">
              <h4
                class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
              >
                {{ section.label }}
              </h4>
              <Separator class="flex-1 shrink" />
            </div>

            <!-- Ítems tipo check (rejilla, como la página de ejemplo) -->
            <div
              v-if="checkItems(section).length"
              class="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
            >
              <Toggle
                v-for="item in checkItems(section)"
                :key="item.id"
                variant="outline"
                :pressed="isItemDone(item, resultFor(t.id, item.id))"
                class="flex w-full h-auto justify-start gap-2.5 p-3.5 data-[state=on]:border-primary data-[state=on]:bg-primary/5"
                @click="toggleItem(t.id, item.id)"
              >
                <span
                  class="grid text-white rounded shrink-0 h-5 w-5 place-items-center"
                  :class="
                    isItemDone(item, resultFor(t.id, item.id))
                      ? 'bg-primary'
                      : 'bg-muted'
                  "
                >
                  <ClientOnly>
                    <Check
                      v-if="isItemDone(item, resultFor(t.id, item.id))"
                      :size="13"
                    />
                  </ClientOnly>
                </span>
                <span class="text-sm font-semibold text-left">
                  {{ item.label }}
                  <span v-if="item.required" class="text-destructive">*</span>
                </span>
              </Toggle>
            </div>

            <!-- Ítems tipo number / text -->
            <div v-if="fieldItems(section).length" class="mt-2.5 space-y-2.5">
              <div
                v-for="item in fieldItems(section)"
                :key="item.id"
                class="p-3.5 border rounded-xl border-border"
                :class="
                  isItemDone(item, resultFor(t.id, item.id)) &&
                  'border-primary/40 bg-primary/5'
                "
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
                    :value="rawValue(t.id, item.id)"
                    :placeholder="item.hint"
                    class="max-w-[10rem]"
                    :class="rangeClass(t.id, item)"
                    @input="onInput(t.id, item, $event)"
                  />
                  <span
                    v-if="item.unit"
                    class="text-sm font-semibold text-muted-foreground"
                  >
                    {{ item.unit }}
                  </span>
                  <span
                    v-if="rangeState(t.id, item) === false"
                    class="text-xs font-bold text-destructive"
                  >
                    Fuera de rango
                  </span>
                  <span
                    v-else-if="rangeState(t.id, item) === true"
                    class="text-xs font-bold text-green-700"
                  >
                    OK
                  </span>
                </div>

                <p
                  v-if="
                    item.kind === 'number' &&
                    (item.min != null || item.max != null)
                  "
                  class="mt-1 text-[11px] text-muted-foreground tabular-nums"
                >
                  Rango: {{ item.min ?? "—" }}–{{ item.max ?? "—"
                  }}{{ item.unit }}
                </p>
              </div>
            </div>
          </div>

          <!-- Acción de la lista -->
          <div class="flex items-center gap-3 pt-1">
            <template v-if="statusFor(t.id) === 'done'">
              <Button
                variant="outline"
                size="sm"
                @click="reopenChecklist(t.id)"
              >
                <ClientOnly><RotateCcw :size="15" class="mr-1.5" /></ClientOnly>
                Reabrir
              </Button>
              <span class="text-xs font-semibold text-green-700">
                Completada ✅
              </span>
            </template>
            <template v-else>
              <Button
                size="sm"
                :disabled="!progressFor(t.id).requiredMet"
                @click="completeChecklist(t.id)"
              >
                <ClientOnly
                  ><CheckCheck :size="15" class="mr-1.5"
                /></ClientOnly>
                Marcar completada
              </Button>
              <span
                v-if="!progressFor(t.id).requiredMet"
                class="text-xs font-semibold text-muted-foreground"
              >
                Faltan obligatorios (<span class="text-destructive">*</span>)
              </span>
            </template>
          </div>
        </div>
      </Card>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { Card } from "@common/components/ui/card";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Separator } from "@common/components/ui/separator";
import { Toggle } from "@common/components/ui/toggle";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import {
  Check,
  CheckCheck,
  ChevronDown,
  RotateCcw,
  Sunrise,
  Moon,
  Sun,
  Snowflake,
  Sparkles,
  Package,
  Thermometer,
  ClipboardList,
  ClipboardCheck,
} from "lucide-vue-next";
import {
  isItemDone,
  isItemInRange,
  type ChecklistItem,
  type ChecklistSection,
} from "~/utils/checklists";

const {
  activeTemplates,
  loading,
  templatesEmpty,
  prettyDate,
  progressFor,
  statusFor,
  resultFor,
  toggleItem,
  setValue,
  completeChecklist,
  reopenChecklist,
} = useChecklists();

/* Abrir/cerrar: por defecto abierta si no está completada. */
const overrides = reactive<Record<string, boolean>>({});
const isOpen = (id: string) => overrides[id] ?? statusFor(id) !== "done";
const toggleOpen = (id: string) => {
  overrides[id] = !isOpen(id);
};

/* Separar ítems por tipo dentro de la sección. */
const checkItems = (s: ChecklistSection) =>
  s.items.filter((i) => (i.kind ?? "check") === "check");
const fieldItems = (s: ChecklistSection) =>
  s.items.filter((i) => (i.kind ?? "check") !== "check");

/* Campos number / text. */
const rawValue = (listId: string, itemId: string) =>
  resultFor(listId, itemId)?.value ?? "";

function onInput(listId: string, item: ChecklistItem, e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  if (item.kind === "number") {
    setValue(listId, item.id, raw === "" ? "" : Number(raw));
  } else {
    setValue(listId, item.id, raw);
  }
}

const rangeState = (listId: string, item: ChecklistItem): boolean | null =>
  isItemInRange(item, resultFor(listId, item.id));

const rangeClass = (listId: string, item: ChecklistItem) => {
  const s = rangeState(listId, item);
  if (s === false) return "border-destructive text-destructive";
  if (s === true) return "border-green-600/50";
  return "";
};

/* Iconos por plantilla. */
const ICONS: Record<string, any> = {
  sunrise: Sunrise,
  moon: Moon,
  sun: Sun,
  snowflake: Snowflake,
  sparkles: Sparkles,
  package: Package,
  thermometer: Thermometer,
  clipboard: ClipboardList,
};
const iconFor = (name?: string) => (name && ICONS[name]) || ClipboardCheck;
</script>
