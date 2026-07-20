<template>
  <div
    class="max-w-3xl absolute bottom-0 left-0 right-0 mx-auto px-4 py-8 h-screen top-0 grid content-center items-center"
  >
    <OrganismsClockIn :isAdmin />
  </div>
</template>

<script lang="ts" setup>
import usePocketBase from "@common/composables/usePocketbase";

const isAdmin = computed(() => {
  const pb = usePocketBase();
  return pb.authStore.model?.id === "eftdr8q9xuy4wkb";
});

definePageMeta({
  layout: "breezy",
  middleware: defineNuxtRouteMiddleware(() => {
    const pb = usePocketBase();
    if (!pb.authStore.isValid || pb.authStore.model?.verified !== true)
      return navigateTo("/");
  }),
});
</script>
