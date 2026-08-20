<template>
  <MenuPage
    fetched-collection="menu"
    dishes-field="store"
    :use-daily-menu="false"
    :show-member-code="false"
  />
</template>

<script setup lang="ts">
import MenuPage from "~/pages/menu.vue";

definePageMeta({ layout: "breezy" });
</script>
