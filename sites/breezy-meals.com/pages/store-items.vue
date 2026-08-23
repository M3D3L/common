<template>
  <StoreItems dishes="store" />
</template>

<script setup lang="ts">
import StoreItems from "~/pages/menu-items.vue";

definePageMeta({
  layout: "staff",
});
</script>
