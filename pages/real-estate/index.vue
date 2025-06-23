<template>
  <SectionsHero v-if="layoutConfig?.heroData"
    video="https://videos.pexels.com/video-files/28100367/12301150_2560_1440_30fps.mp4"
    :image="SanCarlos"
    :buttons="layoutConfig.heroData.buttons" :cards="layoutConfig.heroData?.cards" :title="layoutConfig.heroData?.title"
    :description="layoutConfig.heroData?.description" />
  
  <div class="pt-16 xl:px-48 lg:pt-24">
    <template v-for="(category, index) in categories" :key="category.name">
      <TextSectionTitle class="container py-12" :title="category.name" :description="category.description"
        :h1="false" />

      <div :class="index % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'" class="container flex flex-col gap-8 pb-12">
        <div class="grid w-full gap-8 md:grid-cols-2 lg:w-2/3">
          <!-- Display properties for each category -->
           <template v-for="(item, itemIndex) in dataArray[index]" :key="itemIndex">
            <CardsBaseCard 
            v-if="item"
            :key="itemIndex" 
            baseUrl="/property" 
            :removeSpacing="true"
            :content="item" 
            :buttonText="`View ${category.name}`" 
          />

           </template>
          
        </div>
        <div class="w-full lg:w-1/3">
          <component :is="category.subscribeComponent" class="z-10 sticky-position top-28" :mode="category.mode" />
        </div>
      </div>
      
    </template>
  </div>

  <SectionsBlogsCols :showPagination="false" :content="posts" />
  <SectionsContact/>
</template>

<script lang="ts" setup>
import { layoutConfig } from '~/assets/configs/ui/layout'
import usePocketBaseCore from '@/composables/usePocketBaseCore'

import Subscribe from '~/components/sections/Subscribe.vue'
import Subscribe2 from '~/components/sections/Subscribe2.vue'
import Subscribe3 from '~/components/sections/Subscribe3.vue'

import SanCarlos from '/images/san-carlos.png'

const { fetchCollection } = usePocketBaseCore()

const properties = ref([])
const rentals = ref([])
const lots = ref([])
const posts = ref([])

const dataArray = computed(() => {
  return [[...properties.value], [...rentals.value], [...lots.value]]
})

const categories = [
  {
    name: 'Homes',
    description: 'Discover beautiful homes in San Carlos, Sonora...',
    subscribeComponent: Subscribe,
    mode: 'properties',
    cta: 'Get exclusive home listings in San Carlos'
  },
  {
    name: 'Rentals',
    description: 'Explore short-term and long-term rental properties...',
    subscribeComponent: Subscribe2,
    mode: 'rentals',
    cta: 'Receive rental opportunities first'
  },
  {
    name: 'Lots',
    description: 'Prime land available in San Carlos...',
    subscribeComponent: Subscribe3,
    mode: 'lots',
    cta: 'Be notified about new land listings'
  }
]

const fetchPropertiesByType = async (type: string, targetRef: Ref<any[]>) => {
  try {
    const res = await fetchCollection('properties', 1, 6, `type="${type}"`, '-created', '', ['content'])
    targetRef.value = res.items
    return targetRef.value
  } catch (error) {
    console.error(`Error fetching ${type}:`, error)
  }
}

const fetchPosts = async () => {
  try {
    const result = await fetchCollection('posts', 1, 6, '', '-created', '', ['content']);
    return result;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};


onMounted(async () => {
  await Promise.all([
    fetchPropertiesByType('property', properties),
    fetchPropertiesByType('rental', rentals),
    fetchPropertiesByType('lot', lots),
    posts.value = await fetchPosts()
  ])
})
</script>

<style scoped>
.sticky-position {
  position: sticky !important;
  z-index: 32;
}
</style>
