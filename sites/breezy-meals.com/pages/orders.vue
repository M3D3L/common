<template>
  <div class="relative min-h-screen bg-background font-body text-foreground">
    <header
      class="sticky top-0 z-40 border-b border-border/70 bg-background/90 px-4 py-3 shadow-sm backdrop-blur-xl"
    >
      <div class="mx-auto flex max-w-2xl items-center gap-2">
        <div v-if="view === 'order'" class="min-w-0 flex-1">
          <p
            class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Empleados
          </p>
          <h1 class="truncate text-lg font-bold text-primary">Nueva orden</h1>
        </div>
        <div v-else class="min-w-0 flex-1">
          <p
            class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Cocina
          </p>
          <h1 class="truncate text-lg font-bold text-primary">Comandas</h1>
        </div>

        <template v-if="view === 'order'">
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
          <Button variant="outline" size="sm" @click="sendTodayMenu">
            <ClientOnly><Send :size="15" class="mr-1.5" /></ClientOnly>
            <span class="hidden sm:inline">Enviar menú</span>
          </Button>
        </template>

        <Button
          v-if="view === 'orders'"
          variant="outline"
          size="sm"
          @click="view = 'order'"
        >
          <ClientOnly><ArrowLeft :size="15" class="mr-1.5" /></ClientOnly>
          Nueva orden
        </Button>
      </div>
    </header>

    <MenuPage
      v-if="view === 'order'"
      fetched-collection="menu"
      dishes-field="dishes"
      :use-daily-menu="false"
      :staff-mode="true"
      :show-promos="true"
    />
    <div v-else class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <OrganismsComandasOrders />
    </div>

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
import { Send, ClipboardList, ArrowLeft } from "lucide-vue-next";
import MenuPage from "~/pages/menu.vue";

const store = provideComandas();
const { view, orders, toastMsg, sendTodayMenu } = store;

// Si venimos de /socios con ?code=GM1234, precargar el PIN del socio y
// mandar directo a la pantalla de orden.
const route = useRoute();
onMounted(() => {
  const code = route.query.code;
  if (typeof code === "string" && code.trim()) {
    store.memberCode.value = code.replace(/\s+/g, "").toUpperCase();
    view.value = "order";
  }
});

definePageMeta({ layout: "staff" });
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
