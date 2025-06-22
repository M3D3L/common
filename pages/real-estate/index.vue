<template>
  <SectionsHero v-if="layoutConfig?.heroData"
    video="https://videos.pexels.com/video-files/2541964/2541964-hd_1920_1080_24fps.mp4"
    :buttons="layoutConfig.heroData.buttons" :cards="layoutConfig.heroData?.cards" :title="layoutConfig.heroData?.title"
    :description="layoutConfig.heroData?.description" :image="layoutConfig.heroData?.image" />
  <div class="pt-16 xl:px-48 lg:pt-24">
    <template v-for="(category, index) in categories" :key="category.name">
      <TextSectionTitle class="container py-12" :title="category.name" :description="category.description"
        :h1="false" />

      <div :class="index % 2 ? 'lg:flex-row' : 'lg:flex-row-reverse'" class="container flex flex-col gap-8 pb-12">
        <div class="grid w-full gap-8 md:grid-cols-2 lg:w-2/3">
          <CardsBaseCard v-for="(item, itemIndex) in getCategoryItems(index)" :key="itemIndex" :removeSpacing="true"
            :content="item" :buttonText="`View ${category.name}`" />
        </div>
        <div class="w-full lg:w-1/3">
          <component :is="category.subscribeComponent" class="z-10 sticky-position top-28" :mode="category.mode" />
        </div>
      </div>
    </template>

  </div>

  <SectionsBlogsCols :showPagination="false" :content="posts" />

</template>

<script lang="ts" setup>
import { createSeoObject } from '@/composables/createSeoObject';
import usePocketBaseCore from '@/composables/usePocketBaseCore';
import { rentalData } from '~/assets/configs/cards/rentals'
import Subscribe from '~/components/sections/Subscribe.vue';
import Subscribe2 from '~/components/sections/Subscribe2.vue';
import Subscribe3 from '~/components/sections/Subscribe3.vue';
import { layoutConfig } from '~/assets/configs/ui/layout'


const categories = [
  {
    name: 'Homes',
    description: 'Discover beautiful homes in San Carlos, Sonora - from beachfront properties to modern desert villas. Find your perfect home in this growing coastal community.',
    subscribeComponent: Subscribe,
    mode: 'homes',
    cta: 'Get exclusive home listings in San Carlos'
  },
  {
    name: 'Rentals',
    description: 'Explore short-term and long-term rental properties in San Carlos. Perfect for vacation stays or temporary housing while you find your dream home.',
    subscribeComponent: Subscribe2,
    mode: 'rentals',
    cta: 'Receive rental opportunities first'
  },
  {
    name: 'Lots',
    description: 'Prime land available in San Carlos for your custom build. Beachfront lots, desert view parcels, and development opportunities in this booming region.',
    subscribeComponent: Subscribe3,
    mode: 'lots',
    cta: 'Be notified about new land listings'
  }
];

const dataArray = [...rentalData, ...rentalData, ...rentalData];

// Split dataArray into roughly equal parts for each category
const getCategoryItems = (index: number) => {
  const chunkSize = Math.ceil(dataArray.length / categories.length);
  return dataArray.slice(index * chunkSize, (index + 1) * chunkSize);
};

const pbUtils = usePocketBaseCore();
const posts = ref([]);

const fetchPosts = async () => {
  try {
    const result = await pbUtils.fetchCollection('posts', 1, 6, '', '-created', '', ['content']);
    return result;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

const loadPosts = async () => {
  posts.value = await fetchPosts();
};

onMounted(async () => {
  await loadPosts();
});
</script>

<style scoped>
.sticky-position {
  position: sticky !important;
  z-index: 32;
}
</style>