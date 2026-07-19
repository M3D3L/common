<template>
  <section class="max-w-3xl">
    <!-- Week strip -->
    <div class="flex items-center gap-2 mb-4">
      <Button
        variant="ghost"
        size="icon"
        class="h-9 w-9 shrink-0"
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
        @click="nextWeek"
      >
        <ClientOnly><ChevronRight :size="18" /></ClientOnly>
      </Button>
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
      <Button
        v-if="!isTodaySelected"
        variant="outline"
        size="sm"
        class="ml-auto"
        @click="goToday"
      >
        Hoy
      </Button>
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
        Elige otro día de la semana para ver sus tareas.
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
      <p class="font-semibold">Sin tareas para este día.</p>
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
          </div>

          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <template v-for="item in section.items" :key="item.id">
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
                class="p-3.5 border rounded-xl border-border sm:col-span-2"
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
            </template>
          </div>
        </div>

        <div class="flex items-center gap-3">
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
  </section>
</template>

<script lang="ts" setup>
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Separator } from "@common/components/ui/separator";
import { Toggle } from "@common/components/ui/toggle";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Check, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { isItemDone, type ChecklistItem } from "~/utils/checklists";

const {
  weekStrip,
  selectedPretty,
  isSelectedClosed,
  isTodaySelected,
  dayLists,
  dayTotal,
  completedCount,
  loading,
  templatesEmpty,
  progressFor,
  statusFor,
  resultFor,
  selectDay,
  goToday,
  prevWeek,
  nextWeek,
  toggleItem,
  setValue,
  completeChecklist,
  reopenChecklist,
} = useChecklists();

const isDone = (listId: string, item: ChecklistItem) =>
  isItemDone(item, resultFor(listId, item.id));

function onInput(listId: string, item: ChecklistItem, e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  setValue(
    listId,
    item.id,
    item.kind === "number" ? (raw === "" ? "" : Number(raw)) : raw,
  );
}
</script>
