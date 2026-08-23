<template>
  <div
    class="js-reveal-item rounded-xl border border-border/70 bg-background/90 p-2.5"
  >
    <div class="mb-2 flex items-center justify-between gap-2">
      <div>
        <p class="text-xs font-bold uppercase">
          Orden {{ idx + 1 }} ·
          {{ order.kind === "tacos" ? "Tacos" : "Quesadillas" }}
        </p>
        <p class="text-[11px] text-muted-foreground">
          {{ orderFillTotal(order) }}/{{ taquizaCap[order.kind] }}
          pieza(s)
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7 text-background hover:text-destructive"
        :aria-label="`Quitar orden ${idx + 1}`"
        @click="$emit('remove')"
      >
        <ClientOnly><Trash2 :size="15" /></ClientOnly>
      </Button>
    </div>

    <div v-if="items.length" class="space-y-2">
      <Card
        v-for="item in items"
        :key="`${order.id}-${item.name}`"
        class="flex items-center gap-3 rounded-xl border border-border/60 p-3"
        :class="[
          isOut(item.name) && 'opacity-60',
          (order.fills[item.name] ?? 0) > 0 &&
            'bg-primary/5 ring-1 ring-primary/40',
        ]"
      >
        <div class="flex-1">
          <p
            class="font-semibold leading-tight"
            :class="isOut(item.name) && 'text-muted-foreground line-through'"
          >
            {{ item.name }}
          </p>
        </div>

        <div v-if="!isOut(item.name)" class="flex shrink-0 items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            class="h-8 w-8"
            :disabled="(order.fills[item.name] ?? 0) <= 0"
            @click="setOrderFill(order, item.name, -1)"
          >
            <ClientOnly><Minus :size="15" /></ClientOnly>
          </Button>
          <span class="w-6 text-center font-bold tabular-nums">
            {{ order.fills[item.name] ?? 0 }}
          </span>
          <Button
            variant="outline"
            size="icon"
            class="h-8 w-8"
            :disabled="!canAddToOrder(order)"
            @click="setOrderFill(order, item.name, 1)"
          >
            <ClientOnly><Plus :size="15" /></ClientOnly>
          </Button>
        </div>
      </Card>
    </div>
    <p v-else class="text-[11px] text-muted-foreground">
      No hay guisos disponibles para taquizas hoy.
    </p>

    <p class="mt-2 text-[11px] text-muted-foreground">
      Máximo {{ taquizaCap[order.kind] }} pieza(s) en esta orden.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-vue-next";
import type { GroupKey, MenuItem } from "~/utils/comandas";
import type { TaquizaKind, TaquizaOrder } from "~/composables/useTaquizaOrders";

defineProps<{
  order: TaquizaOrder;
  idx: number;
  items: (MenuItem & { group: GroupKey })[];
  taquizaCap: Record<TaquizaKind, number>;
  orderFillTotal: (order: TaquizaOrder) => number;
  canAddToOrder: (order: TaquizaOrder) => boolean;
  setOrderFill: (order: TaquizaOrder, name: string, delta: number) => void;
  isOut: (name: string) => boolean;
}>();
defineEmits<{ remove: [] }>();
</script>
