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

const config = useRuntimeConfig();

const computedSeoData = computed(() =>
  createSeoObject({
    title: seoDefaults.home.title,
    summary: seoDefaults.home.description,
    keywords: seoDefaults.home.keywords,
    imageUri: seoDefaults.home.image,
    pubDate: "",
    byline: seoDefaults.home.byline,
    siteName: config.public.siteName,
    twitterSite: config.public.twitterSite,

    // Optional for homepage JSON-LD customization
    jsonLd: {
      "@type": "WebSite",
      url: config.public.siteUrl,
      name: seoDefaults.home.title,
      description: seoDefaults.home.description,
      publisher: {
        "@type": "Organization",
        name: config.public.siteName,
      },
    },
  })
);
</script>

<style lang="postcss" scoped>
.active {
  @apply bg-black text-white rounded-full dark:bg-white dark:text-black;
}
</style>
