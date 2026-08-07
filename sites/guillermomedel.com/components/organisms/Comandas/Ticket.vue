<template>
  <Card
    class="flex flex-col p-4 border-t-4"
    :class="modeBorderClass(order.mode)"
  >
    <!-- Header remains the same -->
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
        <template v-if="order.mode === 'llevar'">Para llevar</template>
        <template v-else-if="order.mode === 'aqui'">Para aquí</template>
        <template v-else-if="order.mode === 'domicilio'">A domicilio</template>
        <template v-else>{{ order.mode }}</template>
      </Badge>
      <span class="ml-auto text-xs text-muted-foreground tabular-nums">
        {{ orderTime(order) }}
      </span>
    </div>

    <!-- Items List -->
    <div class="flex-1 space-y-3">
      <div
        v-for="g in ticketGroups"
        v-show="hasGroupItems(order, g.key, catalog)"
        :key="g.key"
      >
        <p
          class="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-0.5"
        >
          {{ g.label }}
        </p>
        <template v-if="isTaquizaGroup(g.key) && hasTaquizaBreakdown(order)">
          <div v-if="taquizaLines(order, 'tacos').length" class="space-y-0.5">
            <p
              class="text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
            >
              Tacos
            </p>
            <div
              v-for="line in taquizaLines(order, 'tacos')"
              :key="`tacos-${line.name}`"
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

          <div
            v-if="taquizaLines(order, 'quesadillas').length"
            class="space-y-0.5"
            :class="taquizaLines(order, 'tacos').length ? 'mt-1' : ''"
          >
            <p
              class="text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
            >
              Quesadillas
            </p>
            <div
              v-for="line in taquizaLines(order, 'quesadillas')"
              :key="`quesadillas-${line.name}`"
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
        </template>

        <div v-else class="space-y-0.5">
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

    <!-- Delivery Date: Using neutral gray/slate for clarity -->
    <div
      class="mt-3 pt-2 border-t border-dashed border-border flex items-center justify-between text-xs"
    >
      <span class="text-muted-foreground">Entrega programada:</span>
      <span
        class="font-bold tabular-nums"
        :class="
          order.fulfillDate !== todayISO()
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-foreground'
        "
      >
        {{ order.fulfillDate === todayISO() ? "Hoy mismo" : order.fulfillDate }}
      </span>
    </div>

    <!-- Address: Replaced purples with neutral slate-gray -->
    <div
      v-if="order.mode === 'domicilio' && order.customer?.address"
      class="p-2 mt-2 text-xs rounded bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-medium border border-slate-100 dark:border-slate-800"
    >
      <p class="flex items-start gap-1">
        <span class="mt-0.5">📍</span> {{ order.customer.address }}
      </p>
      <span
        v-if="order.customer.name"
        class="font-bold block mt-1 text-[11px] text-slate-900 dark:text-slate-100"
      >
        Cliente: {{ order.customer.name }}
      </span>
    </div>

    <p
      v-if="order.note"
      class="p-2 mt-2 text-xs rounded-lg bg-muted/60 border border-muted text-muted-foreground font-medium italic"
    >
      Nota: {{ order.note }}
    </p>

    <!-- Footer buttons -->
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
import { computed } from "vue";
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { Check, Trash2 } from "lucide-vue-next";
import {
  groups,
  groupsFromData,
  todayISO,
  orderTime,
  modeBorderClass,
  modeBadgeClass,
  hasGroupItems,
  getGroupLines,
  type PlacedOrder,
} from "~/utils/comandas";

const props = defineProps<{ order: PlacedOrder }>();

const { completeOrder, discardOrder, catalog } = useComandas();

const ticketGroups = computed(() =>
  groupsFromData(catalog.value as Record<string, unknown>),
);

const taquizaGroup = groups.find((g) => "pieceOptions" in g);

function isTaquizaGroup(key: string) {
  return !!taquizaGroup && key === taquizaGroup.key;
}

function hasTaquizaBreakdown(order: PlacedOrder) {
  const tacos = Object.values(order.taquizaByKind?.tacos ?? {}).some(
    (q) => q > 0,
  );
  const quesadillas = Object.values(
    order.taquizaByKind?.quesadillas ?? {},
  ).some((q) => q > 0);
  return tacos || quesadillas;
}

function taquizaLines(order: PlacedOrder, kind: "tacos" | "quesadillas") {
  return Object.entries(order.taquizaByKind?.[kind] ?? {})
    .filter(([, qty]) => qty > 0)
    .map(([name, qty]) => ({ name, qty }));
}
</script>
