<template>
  <div class="w-full pb-16">
    <SeoMeta :seoData="computedSeoData" />
    <OrganismsHero v-bind="heroSection" />

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

      <div
        v-if="error"
        class="py-12 text-center border border-red-100 rounded-xl bg-red-50"
      >
        <p class="text-red-600 font-medium">
          We couldn't load the featured properties.
        </p>
        <button
          @click="loadProperties(true)"
          class="mt-2 text-sm underline hover:text-primary"
        >
          Try again
        </button>
      </div>

      <div v-else-if="loading" class="grid md:grid-cols-3 gap-6 mt-8">
        <AtomsBaseSkeleton v-for="n in 3" :key="n" class="h-[400px]" />
      </div>

      <div v-else class="grid md:grid-cols-3 gap-6">
        <CardsPropertyCard
          v-for="(item, itemIndex) in propertyItems.items"
          :key="`property-home-${itemIndex}`"
          :content="item"
          class="mt-8"
          :is-sp="isSp"
        />

        <div
          v-if="propertyItems.items.length === 0"
          class="col-span-3 py-12 text-center text-gray-500"
        >
          No featured properties available at the moment.
        </div>
      </div>

      <div v-if="!loading && !error" class="w-full flex justify-center mt-16">
        <AtomsBaseLink
          :to="isSp ? '/bienes-raices/' : '/real-estate/'"
          :text="isSp ? 'Ver Todas las Propiedades' : 'View All Properties'"
        />
      </div>
    </div>

    <SectionsSocialsCarousel v-bind="socialsSection?.value || socialsSection" />
  </div>
</template>

<script setup>
import { createSeoObject } from "@common/composables/useSeo";

const config = useRuntimeConfig();

// Layout configs (computed refs)
import {
  seoDefaults,
  heroSection,
  socialsSection,
  propertiesSection,
} from "@local/assets/configs/layout.js";

const props = defineProps({
  lang: {
    type: String,
    default: "En",
  },
});

// Data
const { fetchCollection } = usePocketBaseCore();
const loading = ref(false);
const error = ref(null);
const propertyItems = ref({ items: [] });

// Fetch properties
const loadProperties = async (ignoreCache = false) => {
  loading.value = true;
  error.value = null;
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
  } catch (err) {
    console.error("Error fetching properties:", err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// SEO (PURE + SAFE)
const computedSeoData = computed(() => {
  const defaults = seoDefaults?.home || {};

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

const isSp = computed(() => props.lang === "Sp");

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
