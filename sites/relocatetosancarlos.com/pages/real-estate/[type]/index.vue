<template>
  <ul class="pb-32 space-y-32">
    <li v-if="currentCategory?.properties?.items?.length > 0">
      <TextSectionTitle
        class="container pt-12 pb-16"
        :title="currentCategory.sectionTitle"
        :description="currentCategory.sectionSubTitle"
        :h1="true"
      />

      <div class="container flex flex-col gap-6 lg:flex-row">
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
              <MoleculesWhatsappButton text="Send" :message="`Hello, I would like more information on this ${item?.type} : https://www.RelocateToSanCarlos.com/real-estate${item.slug}`" />
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

  <SectionsBlogPage
    :title
    :description
    :showPagination="false"
    :content="posts?.items"
    class="pb-24"
  />
</template>

<script lang="ts" setup>
import { layoutConfig } from "~/assets/configs/ui/layoutRealEstate";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import { categories } from "@local/assets/configs/cards/real-estate";

const { fetchCollection } = usePocketBaseCore();
const route = useRoute();

const posts = ref([]);
const perPage = 10;
const title = 'Our Blog Explains Why Relocating to San Carlos is the Best Decision You\'ll Ever Make';
const description = 'Discover the latest trends, tips, and insights in real estate with our expert guidance.';

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

const fetchPropertiesByType = async (queryType: string) => {
  try {
    return await fetchCollection(
      "properties",
      page.value,
      perPage,
      `type="${queryType}"`,
      "-created",
      "",
    );
  } catch (error) {
    console.error(`Error fetching ${queryType}:`, error);
    return [];
  }
};

const fetchPosts = async () => {
  try {
    return await fetchCollection("posts", 1, 10, "", "-created", "");
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

const updateCategory = async () => {
  if (typeMap[type.value]) {
    const { index, query } = typeMap[type.value];
    categories[index].properties =
      (await fetchPropertiesByType(query)) || [];
  }
};

watch([type, page], updateCategory, { immediate: true });

posts.value = await fetchPosts();
</script>
