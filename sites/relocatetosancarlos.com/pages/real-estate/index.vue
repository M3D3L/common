<template>
  <div class="w-full">
    <SeoMeta :seoData="computedSeoData" />

    <div v-if="error" class="container py-32 text-center">
      <h2 class="text-2xl font-bold text-red-600">
        Error loading real estate data
      </h2>
      <p class="mt-4 text-gray-600">
        We're having trouble reaching the server. Please try again.
      </p>
      <button
        @click="loadAllData"
        class="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>

    <div
      v-else-if="pending && categoryData.length === 0"
      class="container py-32 text-center"
    >
      <AtomsLoadingSpinner />
    </div>

    <ul v-else class="pt-16 pb-32 container space-y-16 lg:pt-24">
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <TextSectionTitle
          :title="categoryHeaders?.title"
          :description="categoryHeaders?.subTitle"
          :h1="true"
        />

        <Button @click.prevent="() => {}" v-if="isVerified">
          <nuxt-link
            to="/real-estate/admin"
            class="flex items-center justify-center text-center w-full gap-2"
          >
            <Edit class="w-4 h-4" />
            Manage Listings
          </nuxt-link>
        </Button>
      </div>

      <div v-if="featuredProperty && !pending">
        <MoleculesFeaturedProperty :content="featuredProperty" />
      </div>

      <template v-for="(category, index) in categoryData">
        <li
          v-if="category?.properties?.items?.length || pending"
          :key="category.type || index"
        >
          <TextSectionTitle
            :class="{ 'pt-12': index !== 0 || featuredProperty }"
            :title="category.title"
            :description="category?.subtitle"
            :h1="false"
          />

          <div
            :class="index % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'"
            class="flex flex-col gap-8 mt-6"
          >
            <div v-if="pending" class="w-full lg:w-2/3">
              <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                <AtomsBaseSkeleton v-for="n in 4" :key="n" />
              </div>
            </div>

            <div
              v-else
              class="grid w-full items-center grid-cols-1 gap-8 md:grid-cols-2 lg:w-2/3"
            >
              <CardsPropertyCard
                v-for="(item, itemIndex) in category.properties.items"
                :key="`${category.type}-${item.id || itemIndex}`"
                baseUrl="/real-estate"
                :removeSpacing="true"
                :content="item"
                buttonText="Check it Out!"
              />

              <div
                v-if="category.properties?.totalPages > 1"
                class="flex justify-center md:col-span-2"
              >
                <AtomsBaseLink
                  to="/real-estate/"
                  :text="`View All ${category.type}`"
                />
              </div>
            </div>

            <div class="w-full lg:w-1/3 lg:pb-16">
              <CardsInfoCard
                :title="category.sectionTitle"
                :footerText="category.footerText"
                :subtitle="category.subtitle"
                :benefits="category.benefits"
                :dataArray="category.properties?.items || []"
                class="z-10 sticky-position top-28"
                :mode="category.mode"
              />
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import Button from "@common/components/ui/button/Button.vue";
import {
  realEstateHeroSection,
  categories as categoriesComputed,
  categoryHeaders,
} from "@local/assets/configs/layout.js";
import { Edit } from "lucide-vue-next";
import { createSeoObject } from "@common/composables/useSeo";

const config = useRuntimeConfig();
const { fetchCollection, isUserVerified } = usePocketBaseCore();

const isVerified = computed(() => isUserVerified());

// STATE
const categoryData = ref([]);
const featuredProperty = ref(null);
const pending = ref(false);
const error = ref(null);

const fetchPropertiesByType = async (type: string) => {
  try {
    const res = await fetchCollection(
      "properties",
      1,
      6,
      `type="${type}"`,
      "-created",
      ""
    );
    return res || { items: [], totalPages: 0 };
  } catch (err) {
    console.error(`Error fetching ${type}:`, err);
    return { items: [], totalPages: 0 };
  }
};

const loadAllData = async () => {
  pending.value = true;
  error.value = null;

  try {
    const rawCategories = toValue(categoriesComputed);
    if (!Array.isArray(rawCategories)) return;

    // 1. Fetch Global Featured Property and category data in parallel
    const [featuredRes, propData, rentalData, lotData] = await Promise.all([
      fetchCollection("properties", 1, 1, "featured=true", "-created"),
      fetchPropertiesByType("property"),
      fetchPropertiesByType("rental"),
      fetchPropertiesByType("lot"),
    ]);

    // Set the featured property
    featuredProperty.value = featuredRes?.items[0] || null;

    // 2. Map data and filter out the featured property if it exists in any category
    categoryData.value = rawCategories
      .map((cat) => {
        if (typeof cat === "string") return null;

        const typeKey = (cat.type || "").toLowerCase();
        let fetched = { items: [], totalPages: 0 };

        if (typeKey === "properties" || typeKey === "property")
          fetched = { ...propData };
        else if (typeKey === "rentals" || typeKey === "rental")
          fetched = { ...rentalData };
        else if (typeKey === "lots" || typeKey === "lot")
          fetched = { ...lotData };

        // Filter out the featured property from the specific category list
        if (featuredProperty.value && fetched.items.length) {
          fetched.items = fetched.items.filter(
            (item) => item.id !== featuredProperty.value.id
          );
        }

        return {
          ...cat,
          properties: fetched,
        };
      })
      .filter(Boolean);
  } catch (err) {
    console.error("Critical error loading data:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  loadAllData();
});

const computedSeoData = computed(() => {
  const hero = toValue(realEstateHeroSection);
  const headers = toValue(categoryHeaders);
  const defaultTitle = "Real Estate Listings in San Carlos, Sonora Mexico";

  return createSeoObject({
    title: headers?.title || defaultTitle,
    summary: headers?.summary || "",
    keywords: hero?.keywords || "",
    imageUri: hero?.imageSrc || "",
    pubDate: "",
    byline: "Brenda – San Carlos Relocation Specialist",
    jsonLd: {
      "@type": "WebSite",
      url: config.public.siteUrl,
      name: headers?.title || defaultTitle,
      description: hero?.description || "",
      publisher: {
        "@type": "Organization",
        name: config.public.siteName,
      },
    },
  });
});
</script>
