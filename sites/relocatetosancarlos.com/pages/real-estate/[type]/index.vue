<template>
  <div class="w-full">
    <SeoMeta :seoData="computedSeoData" />

    <ul class="container pb-32 space-y-32">
      <li v-if="!pending && typeMap[type]">
        <TextSectionTitle
          class="pt-12 pb-6"
          :title="categoriesHeaders[typeMap[type].query]?.title"
          :description="categoriesHeaders[typeMap[type].query]?.subTitle"
          :h1="true"
        />

        <MoleculesFeaturedProperty
          v-if="currentCategory?.featuredProperty"
          :content="currentCategory.featuredProperty"
          class="mb-6"
        />

        <div class="flex flex-col gap-6 lg:flex-row">
          <div class="grid content-center w-full gap-6 md:grid-cols-2 lg:w-2/3">
            <CardsPropertyCard
              v-for="(item, itemIndex) in currentCategory?.properties?.items"
              :key="item.id || `property-${itemIndex}`"
              :content="item"
            />

            <div
              class="flex justify-center w-full mt-8 md:col-span-2"
              v-if="currentCategory?.properties?.totalPages > 1"
            >
              <Pagination
                :showPagination="true"
                :total-pages="currentCategory?.properties?.totalPages"
              />
            </div>
          </div>

          <div class="w-full lg:w-1/3">
            <CardsInfoCard
              :title="rawCategories?.[typeMap[type]?.index]?.sectionTitle"
              :footerText="rawCategories?.[typeMap[type]?.index]?.footerText"
              :subTitle="rawCategories?.[typeMap[type]?.index]?.subTitle"
              :benefits="rawCategories?.[typeMap[type]?.index]?.benefits"
              :dataArray="
                rawCategories?.[typeMap[type]?.index]?.properties?.items
              "
              class="z-10 sticky-position top-28"
              :mode="rawCategories?.[typeMap[type]?.index]?.mode"
            />
          </div>
        </div>
      </li>

      <li v-else-if="pending" class="pt-20 text-center">
        <p>Loading San Carlos Properties...</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {
  categories as rawCategories,
  categoriesHeaders,
} from "~/assets/configs/layout.js";
import { createSeoObject } from "@common/composables/useSeo";

const { fetchCollection } = usePocketBaseCore();
const config = useRuntimeConfig();
const route = useRoute();

// 1. CONSTANTS & MAPS
const perPage = 10;
const typeMap: Record<string, { index: number; query: string }> = {
  properties: { index: 0, query: "property" },
  rentals: { index: 1, query: "rental" },
  lots: { index: 2, query: "lot" },
};

// 2. REACTIVE PARAMS
const type = computed(() => (route.params?.type as string) || "");
const page = computed(() => Number(route.query.page) || 1);

// 3. SEO DATA
const computedSeoData = computed(() => {
  const currentType = type.value;
  const configMatch = typeMap[currentType];

  // 1. Check if configMatch exists AND categoriesHeaders.value exists
  if (!configMatch || !categoriesHeaders?.value) {
    return createSeoObject({
      title: "Real Estate San Carlos",
      summary: "Expert Real Estate Services in San Carlos, Sonora",
    });
  }

  // 2. Safe access to the query key
  const queryKey = configMatch.query;

  // 3. Use optional chaining in case queryKey doesn't exist in the object
  const header = categoriesHeaders.value[queryKey];

  if (!header) {
    return createSeoObject({
      title: "Real Estate San Carlos",
      summary: "Expert Real Estate Services in San Carlos, Sonora",
      keywords: "Real Estate, San Carlos, Sonora",
    });
  }

  return createSeoObject({
    title: header.title,
    summary: header.subTitle,
    keywords: header.keywords || "",
    jsonLd: {
      "@type": "WebSite",
      url: `${config.public.siteUrl}${route.fullPath}`,
      name: header.title,
    },
  });
});

// 4. DATA FETCHING
const {
  data: propertyData,
  pending,
  refresh,
} = await useAsyncData(
  `properties-split-${type.value}-${page.value}`,
  async () => {
    const configMatch = typeMap[type.value];
    if (!configMatch) return null;

    const { query } = configMatch;

    const [featuredRes, standardRes] = await Promise.all([
      fetchCollection(
        "properties",
        1,
        1,
        `type="${query}" && featured=true`,
        "-created"
      ),
      fetchCollection(
        "properties",
        page.value,
        perPage,
        `type="${query}" && featured=false`,
        "-created"
      ),
    ]);

    return {
      featured: featuredRes?.items[0] || null,
      standard: standardRes || { items: [], totalPages: 0 },
    };
  },
  {
    // Ensure data is watched correctly in Nuxt 3
    watch: [type, page],
  }
);

// 5. VIEW COMPUTEDS
const currentCategory = computed(() => {
  return {
    properties: propertyData.value?.standard || { items: [], totalPages: 0 },
    featuredProperty: propertyData.value?.featured || null,
  };
});
</script>
