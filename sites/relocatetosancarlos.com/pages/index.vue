<template>
  <div class="w-full">
    <Seo :seoData="computedSeoData" />

    <OrganismsHero />
    <SectionsIntro />
    <SectionsBlogColumn :title :description :showPagination="posts?.totalPages > 1" :content="posts?.items" />
    <!-- <SectionsBlogsCols imgSrc="" :showPagination="false" :content="posts" /> -->
    <SectionsSocialsCarousel />
  </div>
</template>

<script setup>
import { layoutConfig } from '~/assets/configs/ui/layout'
import { createSeoObject } from '@common/composables/useSeo';
import usePocketBaseCore from '@common/composables/usePocketBaseCore';

const title = 'Our Blog Explains Why Relocating to San Carlos is the Best Decision You\'ll Ever Make';
const description = 'Discover the latest trends, tips, and insights in real estate with our expert guidance.';

const computedSeoData = computed(() => {
  return createSeoObject({
    title: layoutConfig?.heroData?.title || 'Home',
    summary: layoutConfig?.heroData?.description || 'Welcome to our website',
  })
});

const pbUtils = usePocketBaseCore();
const posts = ref([]);

const fetchPosts = async () => {
  try {
    const result = await pbUtils.fetchCollection('relocateBlog', 1, 6, '', '-created', '');
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

<style lang="postcss" scoped>
.active {
  @apply bg-black text-white rounded-full dark:bg-white dark:text-black;
}
</style>