<template>
  <div class="w-full">
    <SeoMeta :seoData="computedSeoData" />

    <div v-if="error" class="container py-32 text-center">
      <h2 class="text-2xl font-bold text-red-600">
        {{ isSp ? "Error al cargar propiedades" : "Error loading properties" }}
      </h2>
      <button
        @click="fetchProperties"
        class="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        {{ isSp ? "Reintentar" : "Retry" }}
      </button>
    </div>

    <div
      v-else-if="pending && !propertyData"
      class="container py-32 text-center"
    >
      <AtomsLoadingSpinner />
    </div>

    <ul v-else class="container pb-32 space-y-32">
      <li v-if="typeMap[mappedType] && (propertyData || propertiesLoading)">
        <TextSectionTitle
          class="pt-12 pb-6"
          :title="categoriesHeaders[typeMap[mappedType].query]?.title"
          :description="categoriesHeaders[typeMap[mappedType].query]?.subTitle"
          :h1="true"
        />

        <MoleculesFeaturedProperty
          v-if="currentCategory?.featuredProperty"
          :content="currentCategory.featuredProperty"
          :button-text="isSp ? 'Ver Detalles' : 'View Full Details'"
          :badge-text="isSp ? 'Listado Destacado' : 'Featured Listing'"
          :is-sp="isSp"
          class="mb-6"
        />

        <div class="flex flex-col gap-6 lg:flex-row mb-6">
          <div v-if="propertiesLoading" class="w-full lg:w-2/3"></div>

          <div
            v-else
            class="grid content-center w-full gap-6 md:grid-cols-2 lg:w-2/3"
          >
            <CardsPropertyCard
              v-for="(
                item, itemIndex
              ) in currentCategory?.properties?.items.slice(0, 6)"
              :key="item.id || `property-${itemIndex}`"
              :content="item"
              :button-text="isSp ? 'Ver Propiedad' : 'View Listing'"
              :is-sp="isSp"
            />

            <div
              v-if="currentCategory?.properties?.items?.length === 0"
              class="py-8 text-center md:col-span-2"
            >
              <p class="text-lg text-gray-600">
                {{
                  isSp
                    ? "No se encontraron propiedades."
                    : "No properties found."
                }}
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
              v-if="typeMap[mappedType]"
              :title="rawCategories?.[typeMap[mappedType].index]?.sectionTitle"
              :subTitle="rawCategories?.[typeMap[mappedType].index]?.subTitle"
              :footerText="
                rawCategories?.[typeMap[mappedType].index]?.footerText
              "
              :benefits="rawCategories?.[typeMap[mappedType].index]?.benefits"
              :mode="rawCategories?.[typeMap[mappedType].index]?.mode"
              class="z-10 sticky top-28"
            />
          </div>
        </div>

        <div class="grid content-center w-full gap-6 md:grid-cols-3">
          <CardsPropertyCard
            v-for="(
              item, itemIndex
            ) in currentCategory?.properties?.items.slice(6)"
            :key="item.id || `extra-property-${itemIndex}`"
            :content="item"
            :button-text="isSp ? 'Ver Propiedad' : 'View Listing'"
            :is-sp="isSp"
          />
        </div>
      </li>

      <li v-else-if="!typeMap[mappedType]" class="container py-32 text-center">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ isSp ? "Categoría no encontrada" : "Category not found" }}
        </h2>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {
  categories as rawCategories,
  categoriesHeaders,
} from "@local/assets/configs/layout.js";
import { createSeoObject } from "@common/composables/useSeo";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  lang: { type: String, default: "En" },
});

const isSp = computed(() => props.lang === "Sp");
const { fetchCollection } = usePocketBaseCore();
const route = useRoute();

const perPage = 10;
const typeMap: Record<string, { index: number; query: string }> = {
  properties: { index: 0, query: "property" },
  rentals: { index: 1, query: "rental" },
  lots: { index: 2, query: "lot" },
};

// Handle route translation
const mappedType = computed(() => {
  const rawType = route.params?.type as string;
  if (!isSp.value) return rawType;

  const translationMap: Record<string, string> = {
    ventas: "properties",
    propiedades: "properties",
    rentas: "rentals",
    alquileres: "rentals",
    terrenos: "lots",
  };
  return translationMap[rawType] || rawType;
});

const page = computed(() => Number(route.query.page) || 1);

// Logic to map fields to Spanish if necessary
const mapProperty = (item: any) => {
  if (!item || !isSp.value) return item;
  return {
    ...item,
    sub_title: item.sub_title_Sp || item.sub_title,
    description: item.description_Sp || item.description,
    content: item.content_Sp || item.content,
    keywords: item.keywords_Sp || item.keywords,
    amenities:
      item.amenities_Sp?.length > 0 ? item.amenities_Sp : item.amenities,
  };
};

const propertyData = ref<any>(null);
const pending = ref(false);
const error = ref<any>(null);
const propertiesLoading = ref(false);

const fetchProperties = async () => {
  const currentType = mappedType.value;
  const configMatch = typeMap[currentType];

  if (!configMatch) return;

  pending.value = true;
  propertiesLoading.value = true;
  error.value = null;

  try {
    const { query } = configMatch;

    // 1. Fetch Featured
    const featuredRes = await fetchCollection(
      "properties",
      1,
      1,
      `type="${query}" && featured=true`,
      "-created"
    );

    // 2. Fetch Standard
    const standardRes = await fetchCollection(
      "properties",
      page.value,
      perPage,
      `type="${query}"`,
      "-created"
    );

    const featuredMapped = featuredRes?.items[0]
      ? mapProperty(featuredRes.items[0])
      : null;

    const itemsMapped =
      standardRes?.items
        ?.map(mapProperty)
        .filter((i: any) => i.id !== featuredMapped?.id) || [];

    propertyData.value = {
      featured: featuredMapped,
      standard: { ...standardRes, items: itemsMapped },
    };
  } catch (err) {
    error.value = err;
  } finally {
    pending.value = false;
    propertiesLoading.value = false;
  }
};

watch([mappedType, page], () => fetchProperties(), { immediate: true });

const currentCategory = computed(() => ({
  properties: propertyData.value?.standard || { items: [], totalPages: 0 },
  featuredProperty: propertyData.value?.featured || null,
}));

const computedSeoData = computed(() => {
  const header = categoriesHeaders[typeMap[mappedType.value]?.query];
  return createSeoObject({
    title: header?.title || "Real Estate",
    summary: header?.subTitle || "",
    // If you have specific SEO data from propertyData, you can merge it here
  });
});
</script>
