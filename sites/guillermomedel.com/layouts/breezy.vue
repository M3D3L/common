<template>
  <div class="relative">
    <OrganismsBreezyHeader :logoSrc :links />
    <slot />
  </div>
</template>

<script lang="ts" setup>
const logoSrc =
  "https://cdn.shopify.com/oxygen-v2/57245/154448/316060/3919871/assets/breezy-BBRcmAK6.png";

const links = [
  { to: "/menu", label: "Menú" },
  { to: "/menu-semanal", label: "Calendario" },
  { to: "/promos", label: "Promos" },
];
</script>

<style></style>
