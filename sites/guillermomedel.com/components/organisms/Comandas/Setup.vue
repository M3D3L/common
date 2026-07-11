<template>
  <section class="max-w-3xl">
    <h2 class="text-xl font-bold">Menú del turno</h2>
    <p class="mb-6 text-muted-foreground">
      {{ prettyDate }} · elige los platillos disponibles hoy.
    </p>

    <!-- Cargando catálogo -->
    <div v-if="menuLoading" class="py-16 text-center">
      <p class="text-sm text-muted-foreground animate-pulse">
        Cargando catálogo…
      </p>
    </div>

    <!-- Sin catálogo en la BD -->
    <div
      v-else-if="catalogEmpty"
      class="py-16 text-center border border-dashed rounded-xl border-border"
    >
      <p class="font-semibold">No hay platillos en el catálogo.</p>
      <p class="mt-1 text-sm text-muted-foreground">
        Agrega los platillos en la colección <code>menu</code> (campo
        <code>dishes</code>) de PocketBase.
      </p>
    </div>

    <template v-else>
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

        <div
          v-if="catalog[group.key].length"
          class="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
        >
          <Toggle
            v-for="name in catalog[group.key]"
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
        <p v-else class="text-sm text-muted-foreground">
          Sin platillos en esta categoría.
        </p>
      </div>

      <div class="sticky bottom-0 py-4 bg-gradient-to-t from-background">
        <Button
          size="lg"
          class="w-full md:w-auto"
          :disabled="pick.guisos.size === 0 || savingMenu"
          @click="startShift"
        >
          {{ savingMenu ? "Guardando…" : "Empezar turno" }}
        </Button>
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Separator } from "@common/components/ui/separator";
import { Toggle } from "@common/components/ui/toggle";
import { Check } from "lucide-vue-next";
import { groups } from "~/utils/comandas";

const {
  catalog,
  catalogEmpty,
  menuLoading,
  savingMenu,
  pick,
  prettyDate,
  togglePick,
  startShift,
} = useComandas();
</script>
