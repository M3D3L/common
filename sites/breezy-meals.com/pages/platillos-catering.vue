<template>
  <ItemsCatalogAdmin
    fetched-collection="menu"
    dishes="catering"
    title="Platillos de catering"
    description="Administra los items disponibles para catering."
  />
</template>

<script setup lang="ts">
import ItemsCatalogAdmin from "~/components/organisms/ItemsCatalogAdmin.vue";

definePageMeta({
  layout: "staff",
  alias: "/catering-items",
});
</script>
