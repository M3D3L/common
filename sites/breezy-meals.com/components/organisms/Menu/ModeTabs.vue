<template>
  <section>
    <h2
      class="mb-2 inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/80"
    >
      ¿Cómo lo quieres? / How do you want it?
    </h2>
    <Tabs v-model="mode">
      <TabsList
        class="grid w-full grid-cols-3 rounded-xl border border-border/70 bg-card/90 p-1"
      >
        <TabsTrigger
          v-for="m in MODES"
          :key="m"
          :value="m"
          class="gap-1.5 rounded-lg border border-transparent px-3 py-2 font-semibold text-muted-foreground transition-all data-[state=active]:border-primary/30 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-sm"
        >
          <ClientOnly>
            <component
              class="mx-auto"
              :is="MODE_ICON[m] ?? Utensils"
              :size="14"
            />
          </ClientOnly>
          {{ MODE_SHORT[m] }}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </section>
</template>

<script lang="ts" setup>
import { Tabs, TabsList, TabsTrigger } from "@common/components/ui/tabs";
import { ShoppingBag, Bike, Utensils } from "lucide-vue-next";
import { MODES, MODE_SHORT } from "~/utils/comandas";
import type { OrderMode } from "~/composables/useWhatsappOrder";

const mode = defineModel<OrderMode>("mode", { required: true });

const MODE_ICON: Record<string, any> = {
  llevar: ShoppingBag,
  domicilio: Bike,
  comer: Utensils,
  aqui: Utensils,
  local: Utensils,
};
</script>
