<template>
  <section>
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
      <Button variant="outline" size="sm" class="mt-4" @click="view = 'order'">
        Crear una orden
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <OrganismsComandasTicket
        v-for="o in filteredOrders"
        :key="o.id"
        :order="o"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { FILTER_OPTIONS } from "~/utils/comandas";

const { view, orders, filter, statCards, filteredOrders } = useComandas();
</script>
