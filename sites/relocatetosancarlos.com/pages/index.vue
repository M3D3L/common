<template>
  <div class="w-full pb-16">
    <SeoMeta :seoData="computedSeoData" />

    <OrganismsHero v-bind="heroSection?.value || heroSection" />

    <div class="container">
      <TextSectionTitle
        class="pt-12 pb-8"
        :title="propertiesSection?.value?.title || propertiesSection?.title"
        :description="
          propertiesSection?.value?.description ||
          propertiesSection?.description
        "
        :h1="false"
      />

      <div class="grid md:grid-cols-3 gap-6">
        <CardsPropertyCard
          v-for="(item, itemIndex) in propertyItems.items"
          :key="`property-home-${itemIndex}`"
          :content="item"
          class="mt-8"
        />
      </div>

      <div class="w-full flex justify-end mt-16">
        <NuxtLink
          to="/real-estate/"
          class="font-bold w-full transition-all hover:opacity-90 text-primary hover:underline pb-2"
        >
          {{
            $isSpanishDomain
              ? "Ver Todas las Propiedades"
              : "View All Properties"
          }}
        </NuxtLink>
      </div>
    </div>

    <SectionsSocialsCarousel v-bind="socialsSection?.value || socialsSection" />
  </div>
</template>

<script setup>
import { createSeoObject } from "@common/composables/useSeo";

// Nuxt / app context (SAFE)
const { $isSpanishDomain } = useNuxtApp();
const config = useRuntimeConfig();

// Layout configs (computed refs)
import {
  seoDefaults,
  heroSection,
  socialsSection,
  propertiesSection,
} from "~/assets/configs/layout";

// Data
const { fetchCollection } = usePocketBaseCore();
const loading = ref(false);
const propertyItems = ref({ items: [] });

// Fetch properties
const loadProperties = async (ignoreCache = false) => {
  loading.value = true;
  try {
    const data = await fetchCollection(
      "properties",
      1,
      3,
      "",
      "-created",
      null,
      null,
      ignoreCache
    );
    propertyItems.value = data || { items: [] };
  } catch (error) {
    console.error("Error fetching properties:", error);
  } finally {
    loading.value = false;
  }
};

// SEO (PURE + SAFE)
const computedSeoData = computed(() => {
  const defaults = seoDefaults.value?.home || {};

  return createSeoObject({
    title: defaults.title || "Real Estate",
    summary: defaults.description || "",
    keywords: defaults.keywords || "",
    imageUri: defaults.image || "",
    pubDate: "",
    byline: defaults.byline || "",
    jsonLd: {
      "@type": "WebSite",
      url: config.public.siteUrl,
      name: defaults.title,
      description: defaults.description,
      publisher: {
        "@type": "Organization",
        name: config.public.siteName,
      },
    },
  });
});

// Lifecycle
onMounted(() => {
  loadProperties();
});
</script>

<style lang="postcss" scoped>
.active {
  @apply bg-black text-white rounded-full dark:bg-white dark:text-black;
}
</style>
