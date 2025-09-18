<template>
  <div class="w-full">
    <ul class="container pb-32 space-y-32">
      <li v-if="currentCategory?.properties?.items?.length > 0">
        <TextSectionTitle
          class="pt-12 pb-16"
          :title="currentCategory.sectionTitle"
          :description="currentCategory.sectionSubTitle"
          :h1="true"
        />

        <div class="flex flex-col gap-6 lg:flex-row">
          <div class="grid w-full gap-6 md:grid-cols-2 lg:w-2/3">
            <!-- Display properties -->
            <CardsBaseCard
              v-for="(item, itemIndex) in currentCategory?.properties?.items"
              :key="itemIndex"
              baseUrl="/real-estate"
              :removeSpacing="true"
              :content="item"
              :buttonText="currentCategory.name"
            >
              <template #extraButton>
                <MoleculesWhatsappButton
                  text="Send"
                  :message="`Hello, I would like more information on this ${item?.type} : https://www.RelocateToSanCarlos.com/real-estate${item.slug}`"
                />
              </template>
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
              :title="currentCategory.name"
              :footerText="currentCategory.footerText"
              :subtitle="currentCategory.description"
              :benefits="currentCategory.benifits"
              :categories
              :dataArray="currentCategory?.properties?.items"
              class="z-10 sticky-position top-28"
              :mode="currentCategory.mode"
            />
          </div>
        </div>
      </li>
    </ul>

    <SectionsBlogColumn
      :title
      :description
      :showPagination="false"
      class="pb-24"
    />
  </div>
</template>

<script lang="ts" setup>
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import { categories } from "@local/assets/configs/cards/real-estate";

const { fetchCollection } = usePocketBaseCore();
const route = useRoute();

const perPage = 10;
const title =
  "Our Blog Explains Why Relocating to San Carlos is the Best Decision You'll Ever Make";
const description =
  "Discover the latest trends, tips, and insights in real estate with our expert guidance.";

const page = computed(() => Number(route.query.page) || 1);
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

const { data: properties, pending, error, refresh } = await useAsyncData(
  `properties-${type.value}-${page.value}`,
  async () => {
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
  }
);

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