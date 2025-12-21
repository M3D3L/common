<template>
  <div class="w-full pb-16">
    <!-- SeoMeta component for SEO metadata -->
    <SeoMeta :seoData="computedSeoData" />
    <!-- Layout Sections -->
    <OrganismsHero v-bind="heroSection" />
    <SectionsIntro v-bind="servicesSection" />
    <div class="container">
      <Card class="border-muted/60">
        <TextSectionTitle
          class="pt-12 pb-16"
          :title="propertiesSection.title"
          :description="propertiesSection.description"
          :h1="false"
        />
        <div class="grid md:grid-cols-3 gap-6">
          <CardsPropertyCard
            v-for="(item, itemIndex) in properties?.items"
            :key="`property-home-${itemIndex}`"
            :content="item"
            class="mt-8"
          />
        </div>

        <div class="w-full flex justify-end">
          <div class="mt-16">
            <nuxt-link
              to="/real-estate/"
              class="font-bold w-full transition-all hover:opacity-90 text-primary hover:underline pb-2"
            >
              View More Properties
            </nuxt-link>
          </div>
        </div>
      </Card>
    </div>
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
  propertiesSection,
} from "~/assets/configs/layout";

const { fetchCollection } = usePocketBaseCore();
const config = useRuntimeConfig();

const loading = ref(false);
const properties = ref([]);

const loadProperties = async (ignoreCache = false) => {
  loading.value = true;
  try {
    properties.value = await fetchCollection(
      "properties",
      1,
      3,
      "",
      "-created",
      null,
      null,
      ignoreCache
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

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

// Initial load
onMounted(() => {
  loadProperties();
});
</script>

<style lang="postcss" scoped>
.active {
  @apply bg-black text-white rounded-full dark:bg-white dark:text-black;
}
</style>
