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

      <span
        v-if="live"
        class="ml-auto flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
      >
        <span class="h-2 w-2 rounded-full bg-green-500" />
        En vivo
      </span>
    </header>

    <ChecklistsIndex />

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
// Adjust these two paths to match your project's actual file locations/casing.
import ChecklistsIndex from "~/components/organisms/checklists/Index.vue";
import { provideChecklists } from "~/composables/Usechecklists";

const { toastMsg, live } = provideChecklists();

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
