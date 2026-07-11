<template>
  <Card
    class="flex flex-col p-4 border-t-4"
    :class="modeBorderClass(order.mode)"
  >
    <div class="flex items-center gap-2 mb-3">
      <Badge
        class="px-2.5 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/10 tabular-nums"
      >
        #{{ order.number }}
      </Badge>
      <Badge
        variant="outline"
        class="px-2 py-0.5 text-[10px] uppercase tracking-wider"
        :class="modeBadgeClass(order.mode)"
      >
        {{ MODE_LABEL[order.mode] || order.mode }}
      </Badge>
      <span class="ml-auto text-xs text-muted-foreground tabular-nums">
        {{ orderTime(order) }}
      </span>
    </div>

    <div class="flex-1 space-y-3">
      <div
        v-for="g in groups"
        v-show="hasGroupItems(order, g.key, catalog)"
        :key="g.key"
      >
        <p
          class="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-0.5"
        >
          {{ g.label }}
        </p>
        <div class="space-y-0.5">
          <div
            v-for="line in getGroupLines(order, g.key, catalog)"
            :key="line.name"
            class="flex items-baseline gap-2 text-sm"
          >
            <span class="font-bold text-primary shrink-0 tabular-nums"
              >{{ line.qty }}×</span
            >
            <span class="font-semibold text-card-foreground">{{
              line.name
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mt-3 pt-2 border-t border-dashed border-border flex items-center justify-between text-xs"
    >
      <span class="text-muted-foreground">Entrega programada:</span>
      <span
        class="font-bold tabular-nums"
        :class="
          order.fulfillDate !== todayISO()
            ? 'text-amber-600'
            : 'text-foreground'
        "
      >
        {{ order.fulfillDate === todayISO() ? "Hoy mismo" : order.fulfillDate }}
      </span>
    </div>

    <p
      v-if="order.mode === 'domicilio' && order.customer?.address"
      class="p-2 mt-2 text-xs rounded bg-purple-50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-300 font-medium border border-purple-100 dark:border-purple-900/30"
    >
      📍 {{ order.customer.address }}
      <span
        v-if="order.customer.name"
        class="font-bold block mt-0.5 text-[11px] text-purple-700 dark:text-purple-400"
        >Cliente: {{ order.customer.name }}</span
      >
    </p>

    <p
      v-if="order.note"
      class="p-2 mt-2 text-xs rounded-lg bg-muted/60 border border-muted text-muted-foreground font-medium italic"
    >
      Nota: {{ order.note }}
    </p>

    <div class="flex items-center gap-2 mt-4">
      <Button size="sm" class="flex-1" @click="completeOrder(order)">
        <ClientOnly><Check :size="15" class="mr-1.5" /></ClientOnly>
        Marcar lista
      </Button>
      <Button
        variant="outline"
        size="icon"
        title="Descartar sin avisar"
        class="h-9 w-9 shrink-0 text-muted-foreground hover:border-destructive hover:text-destructive"
        @click="discardOrder(order)"
      >
        <ClientOnly><Trash2 :size="15" /></ClientOnly>
      </Button>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { Check, Trash2 } from "lucide-vue-next";
import {
  groups,
  todayISO,
  orderTime,
  modeBorderClass,
  modeBadgeClass,
  hasGroupItems,
  getGroupLines,
  type PlacedOrder,
} from "~/utils/comandas";

defineProps<{ order: PlacedOrder }>();

const { completeOrder, discardOrder, catalog } = useComandas();
</script>
