<template>
  <div
    class="absolute bottom-0 left-0 right-0 top-0 mx-auto grid h-screen max-w-2xl content-center items-center px-4 py-8"
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
