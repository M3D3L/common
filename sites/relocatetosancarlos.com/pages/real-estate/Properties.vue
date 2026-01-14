<template>
  <div class="w-full">
    <SeoMeta :seoData="computedSeoData" />

    <div v-if="error" class="container py-32 text-center">
      <h2 class="text-2xl font-bold text-red-600">
        {{ isSp ? "Error al cargar propiedades" : "Error loading properties" }}
      </h2>
      <Button
        @click="refresh"
        class="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
      >
        {{ isSp ? "Reintentar" : "Retry" }}
      </Button>
    </div>

    <div
      v-else-if="pending && !propertyData"
      class="container py-32 text-center"
    >
      <AtomsLoadingSpinner />
    </div>

    <ul v-else class="container pb-32 space-y-32">
      <li v-if="typeMap[mappedType] && propertyData">
        <TextSectionTitle
          class="pt-12 pb-6"
          :title="categoriesHeaders[typeMap[mappedType].query as keyof typeof categoriesHeaders]?.title"
          :description="categoriesHeaders[typeMap[mappedType].query as keyof typeof categoriesHeaders]?.subTitle"
          :h1="true"
        />

        <div v-if="featuredProperties.length > 0" class="space-y-6">
          <MoleculesFeaturedProperty
            v-for="(property, index) in featuredProperties"
            :key="`featured-${property.id}`"
            :content="property"
            :button-text="isSp ? 'Ver Detalles' : 'View Full Details'"
            :badge-text="isSp ? 'Listado Destacado' : 'Featured Listing'"
            :is-sp="isSp"
            :reverse="index % 2 !== 0"
          />

          <div class="flex justify-center w-full mt-8" v-if="totalPages > 1">
            <Pagination :showPagination="true" :total-pages="totalPages" />
          </div>
        </div>

        <div v-else class="py-8 text-center">
          <p class="text-lg text-gray-600">
            {{
              isSp
                ? "No se encontraron propiedades destacadas."
                : "No featured properties found."
            }}
          </p>
        </div>
      </li>

      <li
        v-else-if="!pending && !typeMap[mappedType]"
        class="container py-32 text-center"
      >
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
import { Button } from "@common/components/ui/button";
import { createSeoObject } from "@common/composables/useSeo";

const props = defineProps({
  lang: { type: String, default: "En" },
  type: { type: String, default: "properties" },
});

const isSp = computed(() => props.lang === "Sp");
const { fetchCollection } = usePocketBaseCore();
const route = useRoute();

const perPage = 3;
const typeMap: Record<string, { index: number; query: string }> = {
  properties: { index: 0, query: "property" },
  rentals: { index: 1, query: "rental" },
  lots: { index: 2, query: "lot" },
};

const mappedType = computed(() => {
  const rawType = props.type?.toLowerCase();
  if (!rawType) return "properties";

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

const mapProperty = (item: any) => {
  if (!item || !isSp.value) return item;
  return {
    ...item,
    title: item.title_Sp || item.title,
    sub_title: item.sub_title_Sp || item.sub_title,
    description: item.description_Sp || item.description,
    content: item.content_Sp || item.content,
    keywords: item.keywords_Sp || item.keywords,
    amenities:
      item.amenities_Sp?.length > 0 ? item.amenities_Sp : item.amenities,
  };
};

const {
  data: propertyData,
  pending,
  error,
  refresh,
} = useAsyncData(
  () => `featured-properties-${props.lang}-${mappedType.value}-${page.value}`,
  async () => {
    const currentType = mappedType.value;
    const configMatch = typeMap[currentType];

    if (!configMatch) return null;
    const { query } = configMatch;

    try {
      const featuredFilter = `type='${query}' && featured=true`;

      const featuredRes = await fetchCollection(
        "properties",
        page.value,
        perPage,
        featuredFilter,
        "-created",
        null,
        null,
        false,
        { requestKey: null }
      );

      const itemsMapped = featuredRes?.items?.map(mapProperty) || [];

      return {
        items: itemsMapped,
        totalPages: featuredRes?.totalPages || 0,
      };
    } catch (err: any) {
      if (err.isAbort) return null;
      console.error("Critical Fetch Error in Index.vue:", err);
      throw err;
    }
  },
  {
    watch: [mappedType, page],
    lazy: true,
    server: true,
  }
);

const featuredProperties = computed(() => propertyData.value?.items || []);
const totalPages = computed(() => propertyData.value?.totalPages || 0);

const computedSeoData = computed(() => {
  const header =
    categoriesHeaders[
      typeMap[mappedType.value]?.query as keyof typeof categoriesHeaders
    ];
  return createSeoObject({
    title: header?.title || "Real Estate",
    summary: header?.subTitle || "",
  });
});
</script>
