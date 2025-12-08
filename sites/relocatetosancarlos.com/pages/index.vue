<template>
  <div class="w-full pb-16">
    <!-- SeoMeta component for SEO metadata -->
    <SeoMeta :seoData="computedSeoData" />
    <!-- Layout Sections -->
    <OrganismsHero v-bind="heroSection" />
    <SectionsIntro v-bind="servicesSection" />
    <SectionsSocialsCarousel v-bind="socialsSection" />
  </div>
</template>

<script setup>
import { createSeoObject } from "@common/composables/useSeo";
import {
  seoDefaults,
  heroSection,
  servicesSection,
  socialsSection,
} from "~/assets/configs/layout";

const computedSeoData = computed(() => {
  return createSeoObject({
    title: seoDefaults.home.title,
    summary: seoDefaults.home.description,
    keywords: seoDefaults.home.keywords,
    imageUri: seoDefaults.home.image,
    pubDate: "",
    byline: "Brenda – San Carlos Relocation Specialist",
    siteName: "RelocateToSanCarlos.com",

    // Optional for homepage JSON-LD customization
    jsonLd: {
      "@type": "WebSite",
      url: "https://relocatetosancarlos.com",
      name: seoDefaults.home.title,
      description: seoDefaults.home.description,
    },
  });
});
</script>

<style lang="postcss" scoped>
.active {
  @apply bg-black text-white rounded-full dark:bg-white dark:text-black;
}
</style>
