<template>
  <section class="max-w-3xl">
    <h2 class="text-xl font-bold">Menú del turno</h2>
    <p class="mb-6 text-muted-foreground">
      {{ prettyDate }} · elige los platillos disponibles hoy.
    </p>

    <div v-for="group in groups" :key="group.key" class="mb-8">
      <div class="flex items-baseline gap-3 mb-3">
        <h3
          class="text-xs font-bold tracking-widest uppercase text-muted-foreground"
        >
          {{ group.label }}
        </h3>
        <Separator class="flex-1 shrink" />
        <span class="text-sm text-muted-foreground tabular-nums">
          {{ pick[group.key].size }} elegidos
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Toggle
          v-for="name in MENU[group.key]"
          :key="name"
          variant="outline"
          :pressed="pick[group.key].has(name)"
          class="flex w-full h-auto justify-start gap-2.5 p-3.5 data-[state=on]:border-primary data-[state=on]:bg-primary/5"
          @click="togglePick(group.key, name)"
        >
          <span
            class="grid text-white rounded shrink-0 h-5 w-5 place-items-center"
            :class="pick[group.key].has(name) ? 'bg-primary' : 'bg-muted'"
          >
            <ClientOnly>
              <Check v-if="pick[group.key].has(name)" :size="13" />
            </ClientOnly>
          </span>
          <span class="text-sm font-semibold">{{ name }}</span>
        </Toggle>
      </div>
    </div>

    <div class="sticky bottom-0 py-4 bg-gradient-to-t from-background">
      <Button
        size="lg"
        class="w-full md:w-auto"
        :disabled="pick.guisos.size === 0"
        @click="startShift"
      >
        Empezar turno
      </Button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Separator } from "@common/components/ui/separator";
import { Toggle } from "@common/components/ui/toggle";
import { Check } from "lucide-vue-next";
import { MENU, groups } from "~/utils/comandas";

const { pick, prettyDate, togglePick, startShift } = useComandas();
</script>
