<template>
  <section>
    <div
      class="mb-6 inline-flex w-full rounded-md border border-border p-1 sm:w-auto"
      role="tablist"
      aria-label="Vista de comandas"
    >
      <button
        v-for="tab in TABS"
        :key="tab.value"
        type="button"
        role="tab"
        class="inline-flex h-9 flex-1 items-center justify-center rounded px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none"
        :class="
          ordersTab === tab.value
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        "
        :aria-selected="ordersTab === tab.value"
        @click="ordersTab = tab.value"
      >
        <ClientOnly
          ><component :is="tab.icon" :size="16" class="mr-2"
        /></ClientOnly>
        {{ tab.label }}
      </button>
    </div>

    <template v-if="ordersTab === 'active'">
      <div class="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
        <Card v-for="s in statCards" :key="s.label" class="p-3">
          <p
            class="text-[11px] font-bold tracking-wider uppercase text-muted-foreground"
          >
            {{ s.label }}
          </p>
          <p class="text-2xl font-black tabular-nums" :class="s.color">
            {{ s.value }}
          </p>
        </Card>
      </div>

      <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
        <div class="flex items-baseline gap-2">
          <h2 class="text-xl font-bold">Comandas activas</h2>
          <span class="text-xs text-muted-foreground tabular-nums"
            >({{ filteredOrders.length }} filtradas)</span
          >
        </div>

        <div class="flex flex-wrap gap-1.5 sm:ml-auto">
          <Button
            v-for="f in FILTER_OPTIONS"
            :key="f.value"
            size="sm"
            class="rounded-full"
            :variant="filter === f.value ? 'default' : 'outline'"
            @click="filter = f.value"
          >
            {{ f.label }}
          </Button>
        </div>
      </div>

      <div
        v-if="!filteredOrders.length"
        class="py-16 text-center border border-dashed rounded-xl border-border"
      >
        <p class="font-semibold">No hay comandas que coincidan.</p>
        <p class="mt-1 text-sm text-muted-foreground">
          {{
            orders.length
              ? "Prueba cambiando los filtros de arriba."
              : "Las órdenes nuevas aparecerán aquí de forma automática."
          }}
        </p>
        <Button as-child variant="outline" size="sm" class="mt-4">
          <NuxtLink to="/menu">Crear una orden</NuxtLink>
        </Button>
      </div>

      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <OrganismsComandasTicket
          v-for="o in filteredOrders"
          :key="o.id"
          :order="o"
        />
      </div>
    </template>

    <template v-else>
      <div class="mb-6 flex flex-wrap items-end gap-2">
        <div class="space-y-1.5">
          <Label
            for="comandas-history-date"
            class="text-xs font-bold uppercase"
          >
            Fecha
          </Label>
          <Input
            id="comandas-history-date"
            v-model="historyDate"
            type="date"
            :max="today"
            class="h-9 w-[10.5rem]"
          />
        </div>
        <Button
          v-if="historyDate !== today"
          variant="outline"
          size="sm"
          @click="historyDate = today"
        >
          Hoy
        </Button>
        <p class="w-full text-sm text-muted-foreground sm:ml-auto sm:w-auto">
          {{ historyDateLabel }} · {{ historyOrders.length }} comandas
        </p>
      </div>

      <div
        v-if="historyLoading"
        class="py-16 text-center text-sm font-semibold text-muted-foreground"
      >
        Cargando historial...
      </div>
      <div
        v-else-if="!historyOrders.length"
        class="py-16 text-center border border-dashed rounded-xl border-border"
      >
        <p class="font-semibold">No hay comandas para esta fecha.</p>
        <p class="mt-1 text-sm text-muted-foreground">
          El historial se conserva a partir de esta actualización.
        </p>
      </div>
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <OrganismsComandasTicket
          v-for="o in historyOrders"
          :key="o.recordId || o.id"
          :order="o"
          readonly
        />
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { ClipboardList, History } from "lucide-vue-next";
import { FILTER_OPTIONS, todayISO } from "~/utils/comandas";

const TABS = [
  { value: "active" as const, label: "Activas", icon: ClipboardList },
  { value: "history" as const, label: "Historial", icon: History },
];
const today = todayISO();
const {
  orders,
  filter,
  statCards,
  filteredOrders,
  ordersTab,
  historyDate,
  historyOrders,
  historyLoading,
  loadOrderHistory,
} = useComandas();

const historyDateLabel = computed(() =>
  new Date(`${historyDate.value}T12:00:00`).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }),
);

watch([ordersTab, historyDate], ([tab, date]) => {
  if (tab === "history") void loadOrderHistory(date);
});
</script>
