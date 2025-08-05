<template>
  <SectionsHero v-if="layoutConfig?.heroData"
    :video="layoutConfig?.heroData?.video" :image="layoutConfig?.heroData?.image"
    :buttons="layoutConfig.heroData.buttons" :cards="layoutConfig.heroData?.cards" :title="layoutConfig.heroData?.title"
    :description="layoutConfig.heroData?.description" />

  <ul class="pt-16 pb-32 space-y-32 lg:pt-24">
    <li v-for="(category, index) in categories" :key="category.name">
      <TextSectionTitle class="container pt-12 pb-16" :title="category.sectionTitle" :description="category.sectionSubTitle"
        :h1="false" />

      <div :class="index % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'" class="container flex flex-col gap-8">
        <div class="grid w-full gap-8 md:grid-cols-2 lg:w-2/3">
          <!-- Display properties for each category -->
          <template v-for="(item, itemIndex) in dataArray[index]" :key="itemIndex">
            <CardsBaseCard v-if="item" :key="itemIndex" baseUrl="/property" :removeSpacing="true" :content="item"
              :buttonText="`View ${category.name}`" />
          </template>

        </div>
        <div class="w-full lg:w-1/3">
          <CardsInfoCard :title="category.name" :footerText="category.footerText"
            :subtitle="category.description" :benefits="category.benifits" :categories :dataArray class="z-10 sticky-position top-28"
            :mode="category.mode" />
        </div>
      </div>

    </li>
  </ul>

  <SectionsBlogsCols :showPagination="false" :content="posts" />
  <SectionsContact />
</template>

<script lang="ts" setup>
import { layoutConfig } from '~/assets/configs/ui/layoutRealEstate'
import usePocketBaseCore from '@/composables/usePocketBaseCore'
import { categories } from '~/assets/configs/cards/real-estate'

const { fetchCollection } = usePocketBaseCore()

const properties = ref([])
const rentals = ref([])
const lots = ref([])
const posts = ref([])

const dataArray = computed(() => {
  return [properties.value, rentals.value, lots.value]
})

const fetchPropertiesByType = async (type: string) => {
  try {
    return await fetchCollection('properties', 1, 6, `type="${type}"`, '-created', '', ['content'])
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
  try {
    const [property, rents, lts] = await Promise.all([
      fetchPropertiesByType('property'),
      fetchPropertiesByType('rental'),
      fetchPropertiesByType('lot'),
    ]);
    
    properties.value = property?.items || [];
    rentals.value = rents?.items || [];
    lots.value = lts?.items || [];
    posts.value = await fetchPosts();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})
</script>