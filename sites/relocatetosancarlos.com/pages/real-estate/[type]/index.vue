<template>
  <div class="w-full">
    <SeoMeta :seoData="computedSeoData" />

    <div v-if="error" class="container py-32 text-center">
      <h2 class="text-2xl font-bold text-red-600">Error loading properties</h2>
      <p class="mt-4 text-gray-600">
        Please try again or contact support if the problem persists.
      </p>
      <button
        @click="refreshData"
        class="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>

    <div
      v-else-if="pending && !propertyData"
      class="container py-32 text-center"
    >
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
      <p class="mt-4 text-gray-600">Loading properties...</p>
    </div>

    <ul v-else class="container pb-32 space-y-32">
      <li v-if="typeMap[type] && (propertyData || propertyDataLoading)">
        <TextSectionTitle
          class="pt-12 pb-6"
          :title="categoriesHeaders[typeMap[type].query]?.title"
          :description="categoriesHeaders[typeMap[type].query]?.subTitle"
          :h1="true"
        />

        <!-- Show featured property only when it exists -->
        <MoleculesFeaturedProperty
          v-if="currentCategory?.featuredProperty"
          :content="currentCategory.featuredProperty"
          class="mb-6"
        />

        <div class="flex flex-col gap-6 lg:flex-row">
          <!-- Show loading state for properties -->
          <div v-if="propertiesLoading" class="w-full lg:w-2/3">
            <div class="grid gap-6 md:grid-cols-2">
              <div v-for="n in 4" :key="n" class="animate-pulse">
                <div class="h-64 bg-gray-200 rounded-lg"></div>
                <div class="mt-2 space-y-2">
                  <div class="h-4 bg-gray-200 rounded"></div>
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Show properties when loaded -->
          <div
            v-else
            class="grid content-center w-full gap-6 md:grid-cols-2 lg:w-2/3"
          >
            <CardsPropertyCard
              v-for="(item, itemIndex) in currentCategory?.properties?.items"
              :key="item.id || `property-${itemIndex}`"
              :content="item"
            />

            <!-- Show message when no properties found -->
            <div
              v-if="currentCategory?.properties?.items?.length === 0"
              class="py-8 text-center md:col-span-2"
            >
              <p class="text-lg text-gray-600">
                No properties found in this category.
              </p>
            </div>

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

      <li v-else-if="!typeMap[type]" class="container py-32 text-center">
        <h2 class="text-2xl font-bold text-gray-800">Category not found</h2>
        <p class="mt-4 text-gray-600">
          The requested property type does not exist.
        </p>
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

// 2. Get type from route params
const type = computed(() => route.params?.type as string);
const page = computed(() => Number(route.query.page) || 1);

// 3. SEO DATA
const computedSeoData = computed(() => {
  const currentType = type.value;

  if (!currentType) {
    return createSeoObject({
      title: "Real Estate San Carlos",
      summary: "Expert Real Estate Services in San Carlos, Sonora",
    });
  }

  const configMatch = typeMap[currentType];

  if (!configMatch || !categoriesHeaders?.value) {
    return createSeoObject({
      title: "Real Estate San Carlos",
      summary: "Expert Real Estate Services in San Carlos, Sonora",
    });
  }

  const queryKey = configMatch.query;
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

// 4. Separate loading states for better UX
const propertyData = ref<any>(null);
const pending = ref(false);
const error = ref<any>(null);
const propertiesLoading = ref(false);

// 5. Fetch data function
const fetchProperties = async () => {
  const currentType = type.value;
  const configMatch = typeMap[currentType];

  if (!currentType || !configMatch) {
    propertyData.value = null;
    return;
  }

  const { query } = configMatch;
  const currentPage = page.value;

  pending.value = true;
  propertiesLoading.value = true;
  error.value = null;

  try {
    console.log(`Fetching properties for type: ${query}, page: ${currentPage}`);

    // Fetch regular properties first
    const standardRes = await fetchCollection(
      "properties",
      currentPage,
      perPage,
      `type="${query}"`,
      "-created"
    );

    console.log("Standard properties fetched:", standardRes?.items?.length);

    // Try to get a featured property (first item sorted by featured flag and date)
    const featuredRes = await fetchCollection(
      "properties",
      1,
      1,
      `type="${query}" && featured=true`,
      "-created"
    );

    console.log("Featured properties found:", featuredRes?.items?.length);

    // If no featured property is flagged, use the first property as featured
    let featuredProperty = featuredRes?.items[0] || null;

    // If no featured property found but we have regular properties,
    // use the first one as featured (optional behavior)
    if (!featuredProperty && standardRes?.items?.length > 0) {
      // Uncomment if you want to use first property as featured when none are flagged
      // featuredProperty = standardRes.items[0];
    }

    propertyData.value = {
      featured: featuredProperty,
      standard: {
        ...standardRes,
        // Remove the featured property from standard list if we're using it as featured
        items:
          standardRes?.items?.filter((item) =>
            featuredProperty ? item.id !== featuredProperty.id : true
          ) || [],
      },
    };

    console.log("Final data:", {
      hasFeatured: !!featuredProperty,
      standardCount: propertyData.value.standard.items.length,
      totalPages: propertyData.value.standard.totalPages,
    });
  } catch (err) {
    console.error("Error fetching properties:", err);
    error.value = err;

    // Provide fallback data structure
    propertyData.value = {
      featured: null,
      standard: {
        items: [],
        totalPages: 0,
        page: currentPage,
        perPage,
        totalItems: 0,
      },
    };
  } finally {
    pending.value = false;
    propertiesLoading.value = false;
  }
};

// 6. Watch for route changes and fetch data
watch(
  [type, page],
  () => {
    // Don't fetch if type is invalid
    if (!type.value || !typeMap[type.value]) {
      return;
    }

    // Use setTimeout to avoid rapid consecutive requests
    setTimeout(() => {
      fetchProperties();
    }, 10);
  },
  { immediate: true }
);

// 7. Manual refresh function
const refreshData = () => {
  fetchProperties();
};

// 8. VIEW COMPUTEDS
const currentCategory = computed(() => {
  if (!propertyData.value) {
    return {
      properties: { items: [], totalPages: 0 },
      featuredProperty: null,
    };
  }

  return {
    properties: propertyData.value?.standard || { items: [], totalPages: 0 },
    featuredProperty: propertyData.value?.featured || null,
  };
});

// 9. Debug logging (optional)
onMounted(() => {
  console.log("Component mounted, current route:", {
    type: type.value,
    page: page.value,
    fullPath: route.fullPath,
  });
});
</script>
