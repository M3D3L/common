<template>
  <div
    class="container relative w-full p-6 font-body min-h-screen grid content-center text-foreground md:py-10"
  >
    <SeoMeta :follow="false" />

    <header class="flex items-center gap-3 mb-8">
      <div>
        <p
          class="text-xs font-semibold tracking-wider uppercase text-muted-foreground"
        >
          Comida corrida
        </p>
        <h1
          class="text-3xl font-extrabold tracking-tight text-primary md:text-4xl font-heading"
        >
          Breezy Market
        </h1>
      </div>

      <div v-if="view === 'order'" class="flex items-center gap-2 ml-auto">
        <Badge
          class="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/10 tabular-nums"
        >
          Orden #{{ counter }}
        </Badge>
        <Button variant="outline" size="sm" @click="view = 'orders'">
          <ClientOnly><ClipboardList :size="15" class="mr-1.5" /></ClientOnly>
          Comandas
          <Badge
            v-if="orders.length"
            class="ml-1.5 h-5 min-w-5 justify-center px-1 text-[11px] tabular-nums"
          >
            {{ orders.length }}
          </Badge>
        </Button>
        <Button variant="outline" size="sm" @click="editMenu">
          <ClientOnly><Pencil :size="15" class="mr-1.5" /></ClientOnly>
          Editar menú
        </Button>
      </div>

      <div
        v-else-if="view === 'orders'"
        class="flex items-center gap-2 ml-auto"
      >
        <Button variant="outline" size="sm" @click="view = 'order'">
          <ClientOnly><ArrowLeft :size="15" class="mr-1.5" /></ClientOnly>
          Nueva orden
        </Button>
      </div>
    </header>

    <OrganismsComandasSetup v-if="view === 'setup'" />
    <OrganismsComandasOrder v-else-if="view === 'order'" />
    <OrganismsComandasOrders v-else />

    <Transition name="toast">
      <div
        v-if="toastMsg"
        class="fixed z-50 px-5 py-3 text-sm font-bold text-white -translate-x-1/2 rounded-full shadow-lg bottom-6 left-1/2 bg-foreground"
      >
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { Pencil, ClipboardList, ArrowLeft } from "lucide-vue-next";

const { view, counter, orders, toastMsg, editMenu } = provideComandas();

definePageMeta({ layout: "none" });
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
