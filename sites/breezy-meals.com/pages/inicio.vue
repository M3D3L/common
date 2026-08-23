<template>
  <div
    class="max-w-3xl absolute bottom-0 left-0 right-0 mx-auto px-4 py-8 h-screen top-0 grid content-center items-center"
  >
    <OrganismsClockIn :current-user="currentUser" />
  </div>
</template>

<script lang="ts" setup>
import usePocketBase from "@common/composables/usePocketbase";

const pb = usePocketBase();

const isAdmin = true;

// Identidad automática desde la cuenta con sesión iniciada.
// Ajusta el campo del nombre si tu colección `users` usa otro.
const currentUser = computed(() => ({
  id: pb.authStore.model?.id ?? "",
  name:
    pb.authStore.model?.name ||
    pb.authStore.model?.username ||
    pb.authStore.model?.email ||
    "Usuario",
}));

definePageMeta({
  layout: "staff",
  // middleware: defineNuxtRouteMiddleware(() => {
  //   const pb = usePocketBase();
  //   if (!pb.authStore.isValid || pb.authStore.model?.verified !== true)
  //     return navigateTo("/");
  // }),
});
</script>
