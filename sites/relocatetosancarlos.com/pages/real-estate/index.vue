<template>
  <OrganismsHero v-bind="realEstateHeroSection" />

  <ul class="pt-16 pb-32 space-y-32 lg:pt-24">
    <li v-for="(category, index) in categories" :key="category.name">
      <TextSectionTitle
        class="container pt-12 pb-16"
        :title="category.title"
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
                <MoleculesWhatsappButton
                  text="Send"
                  :message="`Hello, I would like more information on this ${item?.type} : https://www.RelocateToSanCarlos.com/real-estate${item.slug}`"
                />
              </template>
            </CardsBaseCard>
          </template>
          <div class="flex justify-center md:col-span-2">
            <nuxt-link
              :to="`/real-estate/${category?.type}/`"
              class="text-sm font-medium underline capitalize transition-colors hover:text-primary underline-offset-4"
            >
              View All {{ category?.type }}
            </nuxt-link>
          </div>
        </div>
        <div class="w-full lg:w-1/3">
          <CardsInfoCard
            v-if="category"
            :title="category.sectionTitle"
            :footerText="category.footerText"
            :subtitle="category.subtitle"
            :benefits="category.benefits"
            :categories
            :dataArray="category?.properties?.items"
            class="z-10 sticky-position top-28"
            :mode="category.mode"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import { realEstateHeroSection, categories } from "~/assets/configs/layout.js";

const { fetchCollection } = usePocketBaseCore();

// Methods
const fetchPropertiesByType = async (type: string) => {
  try {
    return await fetchCollection(
      "properties",
      1,
      6,
      `type="${type}"`,
      "-created",
      ""
    );
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
  }
};

categories[0].properties = (await fetchPropertiesByType("property")) || [];
categories[1].properties = (await fetchPropertiesByType("rental")) || [];
categories[2].properties = (await fetchPropertiesByType("lot")) || [];
</script>
