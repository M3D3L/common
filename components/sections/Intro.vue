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
const title = "About Our Services";
const description =
  "Learn more about our relocation and real estate services in San Carlos, Sonora. Click on any category below to explore details and submit a quick service request form.";
</script>
