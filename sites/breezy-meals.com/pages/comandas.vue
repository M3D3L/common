<template>
  <div class="relative min-h-screen bg-background font-body text-foreground">
    <header
      class="sticky top-0 z-40 border-b border-border/70 bg-background/90 px-4 py-3 shadow-sm backdrop-blur-xl"
    >
      <div class="mx-auto flex max-w-7xl items-center gap-3">
        <div class="min-w-0 flex-1">
          <p
            class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Cocina
          </p>
          <h1 class="truncate text-lg font-bold text-primary">Comandas</h1>
        </div>

        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            :aria-pressed="soundEnabled"
            :title="
              soundEnabled
                ? 'Desactivar sonido de nuevas órdenes'
                : 'Activar sonido de nuevas órdenes'
            "
            @click="toggleOrderSound"
          >
            <ClientOnly>
              <BellRing v-if="soundEnabled" :size="15" class="mr-1.5" />
              <BellOff v-else :size="15" class="mr-1.5" />
            </ClientOnly>
            {{
              soundEnabled
                ? soundReady
                  ? "Sonido activo"
                  : "Sonido"
                : "Sonido"
            }}
          </Button>

          <Button as-child variant="outline" size="sm">
            <NuxtLink to="/menu">
              <ClientOnly><Plus :size="15" class="mr-1.5" /></ClientOnly>
              Nueva orden
            </NuxtLink>
          </Button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <OrganismsComandasOrders />
    </main>

    <Transition name="toast">
      <div
        v-if="toastMsg"
        class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-5 py-3 text-sm font-bold text-white shadow-lg"
      >
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { BellOff, BellRing, Plus } from "lucide-vue-next";

const { soundEnabled, soundReady, toastMsg, toggleOrderSound } =
  provideComandas();

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
