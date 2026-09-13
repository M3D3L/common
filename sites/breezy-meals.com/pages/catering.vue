<template>
  <MenuPage
    fetched-collection="menu"
    dishes-field="catering"
    :use-daily-menu="false"
    :show-member-code="false"
    :promo-config="cateringPromo"
  />
</template>

<script setup lang="ts">
import MenuPage from "~/pages/menu.vue";

definePageMeta({ layout: "breezy" });

const cateringPromo = {
  variant: "catering" as const,
  eyebrow: "Celebra con Breezy",
  title: "Un menú especial para tu evento",
  description:
    "Cuéntanos qué estás planeando y preparamos una propuesta a tu medida.",
  ctaLabel: "Cotiza aquí",
  whatsappMessage:
    "Hola Breezy Meals, me gustaría cotizar el servicio de catering para mi evento.",
};
</script>
