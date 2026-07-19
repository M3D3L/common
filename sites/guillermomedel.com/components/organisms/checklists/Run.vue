<template>
  <section v-if="current" class="max-w-3xl">
    <h2 class="text-xl font-bold">{{ current.title }}</h2>
    <p v-if="current.description" class="mb-6 text-muted-foreground">
      {{ current.description }}
    </p>
    <p v-else class="mb-6 text-muted-foreground">
      {{ prettyDate }}
    </p>

    <div v-for="section in current.sections" :key="section.key" class="mb-8">
      <div class="flex items-baseline gap-3 mb-3">
        <h3
          class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
        >
          {{ section.label }}
        </h3>
        <Separator class="flex-1 shrink" />
      </div>

      <div class="space-y-2.5">
        <div
          v-for="item in section.items"
          :key="item.id"
          class="p-3.5 border rounded-xl border-border"
          :class="
            isItemDone(item, resultFor(current.id, item.id)) &&
            'border-primary/40 bg-primary/5'
          "
        >
          <!-- Ítem tipo check -->
          <Toggle
            v-if="(item.kind ?? 'check') === 'check'"
            variant="outline"
            :pressed="isItemDone(item, resultFor(current.id, item.id))"
            class="flex w-full h-auto justify-start gap-2.5 p-0 border-0 bg-transparent hover:bg-transparent data-[state=on]:bg-transparent"
            @click="toggleItem(current.id, item.id)"
          >
            <span
              class="grid text-white rounded shrink-0 h-5 w-5 place-items-center"
              :class="
                isItemDone(item, resultFor(current.id, item.id))
                  ? 'bg-primary'
                  : 'bg-muted'
              "
            >
              <ClientOnly>
                <Check
                  v-if="isItemDone(item, resultFor(current.id, item.id))"
                  :size="13"
                />
              </ClientOnly>
            </span>
            <span class="text-sm font-semibold text-left">
              {{ item.label }}
              <span v-if="item.required" class="text-destructive">*</span>
            </span>
          </Toggle>

          <!-- Ítem tipo number / text -->
          <div v-else>
            <Label
              :for="`${current.id}-${item.id}`"
              class="flex items-center gap-1 text-sm font-semibold"
            >
              {{ item.label }}
              <span v-if="item.required" class="text-destructive">*</span>
            </Label>

            <div class="flex items-center gap-2 mt-2">
              <Input
                :id="`${current.id}-${item.id}`"
                :type="item.kind === 'number' ? 'number' : 'text'"
                :value="rawValue(item.id)"
                :placeholder="item.hint"
                class="max-w-[10rem]"
                :class="rangeClass(item)"
                @input="onInput(item, $event)"
              />
              <span
                v-if="item.unit"
                class="text-sm font-semibold text-muted-foreground"
              >
                {{ item.unit }}
              </span>

              <span
                v-if="rangeState(item) === false"
                class="text-xs font-bold text-destructive"
              >
                Fuera de rango
              </span>
              <span
                v-else-if="rangeState(item) === true"
                class="text-xs font-bold text-green-700"
              >
                OK
              </span>
            </div>

            <p
              v-if="
                item.kind === 'number' && (item.min != null || item.max != null)
              "
              class="mt-1 text-[11px] text-muted-foreground tabular-nums"
            >
              Rango: {{ item.min ?? "—" }}–{{ item.max ?? "—" }}{{ item.unit }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de completar -->
    <div class="sticky bottom-0 py-4 bg-gradient-to-t from-background">
      <div class="flex items-center gap-3">
        <Button
          size="lg"
          class="w-full md:w-auto"
          :disabled="!canComplete"
          @click="completeChecklist(current.id)"
        >
          <ClientOnly><CheckCheck :size="17" class="mr-2" /></ClientOnly>
          Marcar completada
        </Button>
        <p
          v-if="!canComplete"
          class="text-xs font-semibold text-muted-foreground"
        >
          Faltan ítems obligatorios (<span class="text-destructive">*</span>)
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Separator } from "@common/components/ui/separator";
import { Toggle } from "@common/components/ui/toggle";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Check, CheckCheck } from "lucide-vue-next";
import {
  isItemDone,
  isItemInRange,
  type ChecklistItem,
} from "~/utils/checklists";

const {
  current,
  prettyDate,
  canComplete,
  resultFor,
  toggleItem,
  setValue,
  completeChecklist,
} = useChecklists();

const rawValue = (itemId: string) => {
  const v = current.value
    ? resultFor(current.value.id, itemId)?.value
    : undefined;
  return v ?? "";
};

function onInput(item: ChecklistItem, e: Event) {
  if (!current.value) return;
  const raw = (e.target as HTMLInputElement).value;
  if (item.kind === "number") {
    setValue(current.value.id, item.id, raw === "" ? "" : Number(raw));
  } else {
    setValue(current.value.id, item.id, raw);
  }
}

const rangeState = (item: ChecklistItem): boolean | null =>
  current.value
    ? isItemInRange(item, resultFor(current.value.id, item.id))
    : null;

const rangeClass = (item: ChecklistItem) => {
  const s = rangeState(item);
  if (s === false) return "border-destructive text-destructive";
  if (s === true) return "border-green-600/50";
  return "";
};
</script>
