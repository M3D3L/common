<template>
  <OrganismsHero />

  <ul class="pt-16 pb-32 space-y-32 lg:pt-24">
    <li v-for="(category, index) in categories" :key="category.name">
      <TextSectionTitle
        class="container pt-12 pb-16"
        :title="category.sectionTitle"
        :description="category.sectionSubTitle"
        :h1="false"
      />
      <div
        :class="index % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'"
        class="container flex flex-col gap-8"
      >
        <div class="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:w-2/3">
          <!-- Display properties for each category -->
          <template
            v-for="(item, itemIndex) in category?.properties?.items"
            :key="`${index}-${itemIndex}`"
          >
            <CardsBaseCard
              v-if="item"
              :key="itemIndex"
              baseUrl="/real-estate"
              :removeSpacing="true"
              :content="item"
              :buttonText="category.name"
            >
              <template #extraButton>
                <MoleculesWhatsappButton text="Send" :message="`Hello, I would like more information on this ${item?.type} : https://www.RelocateToSanCarlos.com/real-estate${item.slug}`" />
              </template>
            </CardsBaseCard>
          </template>
          <div class="flex justify-center md:col-span-2">
            <nuxt-link :to="`/real-estate/${category?.type}/`"
              class="text-sm font-medium underline capitalize transition-colors hover:text-primary underline-offset-4">
              View All {{ category?.type }}
            </nuxt-link>
          </div>
        </div>
        <div class="w-full lg:w-1/3">
          <CardsInfoCard
            v-if="category"
            :title="category.name"
            :footerText="category.footerText"
            :subtitle="category.description"
            :benefits="category.benifits"
            :categories
            :dataArray="category?.properties?.items"
            class="z-10 sticky-position top-28"
            :mode="category.mode"
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

// Vars
const posts = ref([]);
const title = 'Our Blog Explains Why Relocating to San Carlos is the Best Decision You\'ll Ever Make';
const description = 'Discover the latest trends, tips, and insights in real estate with our expert guidance.';


// Methods
const fetchPropertiesByType = async (type: string) => {
  try {
    return await fetchCollection(
      "properties",
      1,
      6,
      `type="${type}"`,
      "-created",
      "",
    );
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
  }
};

const fetchPosts = async () => {
  try {
    const result = await fetchCollection("posts", 1, 6, "", "-created", "");
    return result;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

categories[0].properties = (await fetchPropertiesByType("property")) || [];
categories[1].properties = (await fetchPropertiesByType("rental")) || [];
categories[2].properties = (await fetchPropertiesByType("lot")) || [];
posts.value = (await fetchPosts()) || [];
</script>
