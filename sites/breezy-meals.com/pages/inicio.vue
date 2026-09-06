<template>
  <main class="min-h-[calc(100vh-5rem)] px-4 py-8">
    <OrganismsClockIn :current-user="currentUser" :is-admin="isManager" />
  </main>
</template>

<script lang="ts" setup>
import usePocketBase from "@common/composables/usePocketbase";

const pb = usePocketBase();

const isManager = ref(false);
const currentUser = ref({ id: "", name: "" });

function syncAuth() {
  const model = pb.authStore.model;
  isManager.value = model?.verified === true;
  currentUser.value = {
    id: model?.id ?? "",
    name: model?.name || model?.username || model?.email || "Usuario",
  };
}

let stopAuthListener: (() => void) | undefined;
onMounted(() => {
  syncAuth();
  stopAuthListener = pb.authStore.onChange(syncAuth);
});
onBeforeUnmount(() => stopAuthListener?.());

definePageMeta({
  layout: "staff",
  // middleware: defineNuxtRouteMiddleware(() => {
  //   const pb = usePocketBase();
  //   if (!pb.authStore.isValid || pb.authStore.model?.verified !== true)
  //     return navigateTo("/");
  // }),
});
</script>
