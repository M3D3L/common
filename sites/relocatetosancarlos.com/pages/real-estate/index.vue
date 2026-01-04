<template>
  <ul class="pt-16 pb-32 container space-y-32 lg:pt-24">
    <SeoMeta :seoData="computedSeoData" />

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
          {{ $isSpanishDomain ? "Administrar Listados" : "Manage Listings" }}
        </nuxt-link>
      </Button>
    </div>

    <template v-for="(category, index) in categoryData">
      <li
        v-if="category?.properties?.items?.length"
        :key="category.type || index"
      >
        <TextSectionTitle
          :class="{ 'pt-12': index !== 0 }"
          :title="category.title"
          :description="category?.subtitle"
          :h1="false"
        />

        <div
          :class="index % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'"
          class="flex flex-col gap-8 mt-6"
        >
          <div
            class="grid w-full items-center grid-cols-1 gap-8 md:grid-cols-2 lg:w-2/3"
          >
            <CardsPropertyCard
              v-for="(item, itemIndex) in category.properties.items"
              :key="`${category.type}-${itemIndex}`"
              baseUrl="/real-estate"
              :removeSpacing="true"
              :content="item"
              :buttonText="
                $isSpanishDomain ? '¡Ver Detalles!' : 'Check it Out!'
              "
            />

            <div
              v-if="category.properties?.totalPages > 1"
              class="flex justify-center md:col-span-2"
            >
              <nuxt-link
                :to="`/real-estate/${category.type}/`"
                class="text-sm font-medium underline capitalize transition-colors hover:text-primary underline-offset-4"
              >
                {{ $isSpanishDomain ? "Ver todo" : "View All" }}
                {{ category.type }}
              </nuxt-link>
            </div>
          </div>

          <div class="w-full lg:w-1/3">
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
</template>

<script lang="ts" setup>
import Button from "@common/components/ui/button/Button.vue";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import {
  realEstateHeroSection,
  categories as categoriesComputed,
  categoryHeaders,
} from "~/assets/configs/layout.js";
import { Edit } from "lucide-vue-next";
import { createSeoObject } from "@common/composables/useSeo";

const { $isSpanishDomain } = useNuxtApp();
const config = useRuntimeConfig();
const { fetchCollection, isUserVerified } = usePocketBaseCore();

const isVerified = computed(() => isUserVerified());

const categoryData = ref([]);

// Use toValue to safely unwrap the computed property
const rawCategories = toValue(categoriesComputed);
if (Array.isArray(rawCategories)) {
  categoryData.value = [...rawCategories];
}

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
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return { items: [], totalPages: 0 };
  }
};

const [propData, rentalData, lotData] = await Promise.all([
  fetchPropertiesByType("property"),
  fetchPropertiesByType("rental"),
  fetchPropertiesByType("lot"),
]);

// Efficiently map the results
categoryData.value = categoryData.value
  .map((cat) => {
    if (typeof cat === "string") return null;

    const typeKey = (cat.type || "").toLowerCase();
    let fetched = { items: [], totalPages: 0 };

    if (typeKey === "properties" || typeKey === "property") fetched = propData;
    else if (typeKey === "rentals" || typeKey === "rental")
      fetched = rentalData;
    else if (typeKey === "lots" || typeKey === "lot") fetched = lotData;

    return {
      ...cat,
      properties: fetched,
    };
  })
  .filter(Boolean);

const computedSeoData = computed(() => {
  const isSpanish = unref($isSpanishDomain);
  const hero = toValue(realEstateHeroSection);

  // FIX: Explicitly unwrap categoryHeaders using toValue
  const headers = toValue(categoryHeaders);

  const defaultTitle = isSpanish
    ? "Inmobiliaria San Carlos"
    : (hero?.titleLine1 || "") + " " + (hero?.titleHighlight || "");

  return createSeoObject({
    // Use the title from headers if it exists, otherwise fallback to defaultTitle
    title: headers?.title || defaultTitle,
    summary: isSpanish
      ? "Tu especialista en reubicación."
      : hero?.description || "",
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
