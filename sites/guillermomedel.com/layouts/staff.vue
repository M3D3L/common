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
  { to: "/inicio", label: "🕒" },
  { to: "/socios", label: "Miembros" },
  { to: "/orders", label: "Órdenes" },
  { to: "/labels", label: "Etiquetas" },
];
</script>

<style></style>
