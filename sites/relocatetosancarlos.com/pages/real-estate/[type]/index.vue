<template>
  <div class="w-full">
    <ul class="container pb-32 space-y-32">
      <template
        v-if="currentCategory?.properties?.items?.length === 0"
        :key="`no-items-${index}`"
      >
        <p
          class="w-full h-[80vh] grid content-center text-center text-muted-foreground italic"
        >
          No results available right now. Please check back soon.
        </p>
      </template>
      <li v-else>
        <TextSectionTitle
          class="pt-12 pb-16"
          :title="currentCategory.title"
          :description="currentCategory.sectionSubTitle"
          :h1="true"
        />

        <div class="flex flex-col gap-6 lg:flex-row">
          <div class="grid content-center w-full gap-6 md:grid-cols-2 lg:w-2/3">
            <!-- Display properties -->
            <CardsBaseCard
              v-for="(item, itemIndex) in currentCategory?.properties?.items"
              :key="itemIndex"
              baseUrl="/real-estate"
              :removeSpacing="true"
              :content="item"
              buttonText="Check it Out!"
            >
              <template #extraButton> </template>
            </CardsBaseCard>

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

const { fetchCollection } = usePocketBaseCore();
const route = useRoute();
const page = computed(() => Number(route.query.page) || 1);
const perPage = 10;
const type = computed(
  () => (route.params.type as string | undefined)?.toLowerCase() ?? ""
);

const typeMap: Record<string, { index: number; query: string }> = {
  properties: { index: 0, query: "property" },
  rentals: { index: 1, query: "rental" },
  lots: { index: 2, query: "lot" },
};

const currentCategory = computed(() => {
  if (typeMap[type.value]) {
    return categories[typeMap[type.value].index];
  }
  return null;
});

const {
  data: properties,
  pending,
  error,
  refresh,
} = await useAsyncData(`properties-${type.value}-${page.value}`, async () => {
  if (typeMap[type.value]) {
    const { query } = typeMap[type.value];
    return await fetchCollection(
      "properties",
      page.value,
      perPage,
      `type="${query}"`,
      "-created",
      ""
    );
  }
  return null;
});

// Update the category's properties reactive value when the async data is fetched
watch(
  properties,
  (newProperties) => {
    if (currentCategory.value) {
      currentCategory.value.properties = newProperties;
    }
  },
  { immediate: true }
);

// Watch for changes in route parameters and manually refresh data
watch([type, page], () => {
  refresh();
});
</script>
