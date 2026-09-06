<template>
  <div
    class="relative mx-auto grid min-h-screen w-full max-w-2xl content-start px-4 py-6 font-body text-foreground sm:px-6 md:py-10"
  >
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

const { toastMsg } = provideChecklists();

definePageMeta({ layout: "staff", alias: "/checklists" });
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
