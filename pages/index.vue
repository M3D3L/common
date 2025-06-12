<template>
    <div class="w-full">
        <Seo :seoData="computedSeoData" />
        <!-- Hero Section -->
        <SectionsHero v-if="layoutConfig?.heroData" video="https://videos.pexels.com/video-files/2541964/2541964-hd_1920_1080_24fps.mp4" :buttons="layoutConfig.heroData.buttons"
          :cards="layoutConfig.heroData?.cards" :title="layoutConfig.heroData?.title"
          :description="layoutConfig.heroData?.description" :image="layoutConfig.heroData?.image" />
        
        <!-- Projects Section -->
        <SectionsProjects />

        
        <SectionsSkills :content="layoutConfig.skillsData" />
        
        <!-- <SectionsBlogs :content="posts" /> -->

        <SectionsBlogsCols :showPagination="false" :content="posts" />
        
        <SectionsContact />
    </div>
</template>

<script setup>
import { layoutConfig } from '~/assets/configs/ui/layout'
import { createSeoObject } from '@/composables/createSeoObject';
import usePocketBaseCore from '@/composables/usePocketBaseCore';

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
    const result = await pbUtils.fetchCollection('posts', 1, 5, '', '-created', '', ['content']);
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