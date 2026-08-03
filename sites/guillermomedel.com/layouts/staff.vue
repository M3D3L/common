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
  { to: "/socios", label: "Miembros" },
  { to: "/orders", label: "Órdenes" },
  { to: "/menu", label: "Menú" },
  { to: "/semana", label: "Semanal" },
];
</script>

<style></style>
