<template>
  <div
    class="container relative w-full p-6 font-body min-h-screen grid content-start text-foreground md:py-10"
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
          Checklists
        </h1>
      </div>

      <div v-if="view === 'index'" class="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" @click="view = 'history'">
          <ClientOnly><History :size="15" class="mr-1.5" /></ClientOnly>
          Completadas
          <Badge
            v-if="completedCount"
            class="ml-1.5 h-5 min-w-5 justify-center px-1 text-[11px] tabular-nums"
          >
            {{ completedCount }}
          </Badge>
        </Button>
      </div>

      <div v-else class="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" @click="back">
          <ClientOnly><ArrowLeft :size="15" class="mr-1.5" /></ClientOnly>
          Checklists
        </Button>
      </div>
    </header>

    <Index v-if="view === 'index'" />
    <OrganismsChecklistsRun v-else-if="view === 'run'" />
    <OrganismsChecklistsHistory v-else />

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
import { History, ArrowLeft } from "lucide-vue-next";
import Index from "~/components/organisms/checklists/Index.vue";
import { provideChecklists } from "~/composables/Usechecklists";

const { view, completedCount, toastMsg, back } = provideChecklists();

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
