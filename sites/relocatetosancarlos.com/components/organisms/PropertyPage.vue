<template>
  <div class="w-full">
    <SeoMeta :seoData="computedSeoData" />

    <ul class="container pb-32 space-y-32">
      <template
        v-if="
          !pending &&
          !currentCategory?.featuredProperty &&
          currentCategory?.properties?.items?.length === 0
        "
      >
        <li>
          <p
            class="w-full h-[80vh] grid content-center text-center text-muted-foreground italic"
          >
            No results available right now. Please check back soon.
          </p>
        </li>
      </template>

      <li v-else>
        <TextSectionTitle
          class="pt-12 pb-6"
          :title="currentCategory?.title"
          :description="currentCategory?.sectionSubTitle"
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
              v-if="currentCategory"
              :title="currentCategory.sectionTitle"
              :footerText="currentCategory.footerText"
              :subTitle="currentCategory.subTitle"
              :sectionTitle="currentCategory.sectionTitle"
              :benefits="currentCategory.benefits"
              :categories="currentCategory.categories"
              :dataArray="currentCategory?.properties?.items"
              class="z-10 sticky-position top-28"
              :mode="currentCategory.mode"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { categories } from "~/assets/configs/layout.js";
import { createSeoObject } from "@common/composables/useSeo";

const props = defineProps<{
  type: string;
}>();

const { fetchCollection } = usePocketBaseCore();
const config = useRuntimeConfig();
const route = useRoute();

const page = computed(() => Number(route.query.page) || 1);
const perPage = 10;
const typeMap: Record<string, { index: number; query: string }> = {
  properties: { index: 0, query: "property" },
  rentals: { index: 1, query: "rental" },
  lots: { index: 2, query: "lot" },
};

const currentCategory = computed(() => {
  if (typeMap[props?.type]) {
    return categories[typeMap[props.type].index];
  }
  return null;
});

const {
  data: propertyData,
  pending,
  refresh,
} = await useAsyncData(
  `properties-split-${props.type}-${page.value}`,
  async () => {
    if (!typeMap[props.type]) return null;
    const { query } = typeMap[props.type];

    // 1. Fetch exactly one featured item for this type
    const featuredRes = await fetchCollection(
      "properties",
      1,
      1,
      `type="${query}" && featured=true`,
      "-created"
    );

    // 2. Fetch standard items (where featured is false)
    const standardRes = await fetchCollection(
      "properties",
      page.value,
      perPage,
      `type="${query}" && featured=false`,
      "-created"
    );

    return {
      featured: featuredRes.items[0] || null,
      standard: standardRes,
    };
  }
);

// Sync both standard list and featured item to your category object
watch(
  propertyData,
  (newData) => {
    if (currentCategory.value && newData) {
      currentCategory.value.properties = newData.standard;
      currentCategory.value.featuredProperty = newData.featured;
    }
  },
  { immediate: true }
);

watch([props.type, page], () => {
  refresh();
});

const computedSeoData = computed(() =>
  createSeoObject({
    title: currentCategory.value?.title || "",
    summary: currentCategory.value?.subTitle || "",
    keywords: currentCategory.value?.keywords || [],
    siteName: config.public.siteName,
    twitterSite: config.public.twitterSite,
    jsonLd: {
      "@type": "WebSite",
      url: config.public.siteUrl,
      name: currentCategory.value?.title,
    },
  })
);
</script>
