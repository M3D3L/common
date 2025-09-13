<template>
  <section id="about" class="container grid content-center min-h-screen py-24 mx-auto">
    <TextSectionTitle
      class="pt-12 pb-16"
      :title
      :description
      :h1="false"
    />
    <MoleculesUserTypes />
    <AtomsBanner
      class="mt-6"
      id="real-estate-promo"
      title="Explore Real Estate in San Carlos"
      description="Discover available properties, investment opportunities, and your dream home in San Carlos."
      :button="{
        label: 'View Properties',
        href: '/real-estate',
      }"
    />
  </section>
</template>

<script setup lang="ts">
const title = "Relocation Services for Every Lifestyle";
const description =
  "Whether you’re retiring by the sea, traveling with family, working remotely as a digital nomad, or escaping the cold as a snowbird, our relocation services are designed to make moving to San Carlos seamless. We help retirees, families, adventurers, and professionals find the right homes, activities, and connections so you can settle in with ease.";
</script>
