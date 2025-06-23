<template>
    <div>
        <Seo :seoData="computedSeoData" />
        <SectionsBlogsCols :content="posts" :showMore="false" :showPagination="true" />
    </div>
</template>

<script setup>
import usePocketBaseCore from '@/composables/usePocketBaseCore';
import { createSeoObject } from '@/composables/createSeoObject';
const pbUtils = usePocketBaseCore();
const posts = ref([]);

const route = useRoute();
const page = ref(route.query.page || 1);

const fetchPosts = async () => {
  try {
    const result = await pbUtils.fetchCollection('posts', page.value, 10, '', '-created', '', ['content']);
    return result;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

const loadPosts = async () => {
  posts.value = await fetchPosts();
};

const computedSeoData = computed(() => {
  return createSeoObject({
    title: 'Blog Page',
    summary: 'Explore my latest articles and insights on web development, design, and technology. Learn from practical tutorials and stay updated with industry trends.',
  })
});

// Watch the page query parameter and fetch posts when it changes
watch(() => route.query.page, async (newPage) => {
  await loadPosts();
});

onMounted(async () => {
  await loadPosts();
});
</script>

<style lang="postcss" scoped>
.active {
    @apply bg-black text-white rounded-full dark:bg-white dark:text-black;
}
</style>