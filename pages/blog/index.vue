<template>
    <div class="mt-8 md:pt-16">
        <Seo :seoData="computedSeoData" />
        <SectionsBlogPage h1="true" :title :description :imgSrc :content="posts" :showMore="false" :showPagination="true" />
    </div>
</template>

<script setup>
import usePocketBaseCore from '@/composables/usePocketBaseCore';

const pbUtils = usePocketBaseCore();
const posts = ref([]);

const route = useRoute();
const page = ref(route.query.page || 1);

const props = defineProps({
  imgSrc: {
    type: String,
  },
  title: {
    type: String,
    default: 'Learn Web Development, Drone Photography, and More',
  },
  description: {
    type: String,
    default: "I'm passsionate about sharing knowledge and helping others grow. Explore my blog for insights, tutorials, and tips on web development, drone photography, and more.",
  },
});

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
    title: props.title,
    summary: props.description,
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