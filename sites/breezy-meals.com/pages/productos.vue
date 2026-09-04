<template>
  <StoreItems dishes="store" />
</template>

<script setup lang="ts">
import StoreItems from "~/pages/platillos.vue";

definePageMeta({
  layout: "staff",
  alias: "/store-items",
});
</script>
