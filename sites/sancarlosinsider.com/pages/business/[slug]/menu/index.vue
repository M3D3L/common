<template>
  <div class="mt-8 md:pt-16">
    <Seo :seoData="computedSeoData" />
    <SectionsBlogColumn
      h1="true"
      :title
      :description
      :imgSrc
      :content="posts?.items"
      :showMore="false"
      :showPagination="true"
    />
  </div>
</template>

<script setup lang="ts">
import usePocketBaseCore from '@common/composables/usePocketBaseCore'

const { fetchCollection } = usePocketBaseCore()
const posts = ref<any>(null)

const route = useRoute()
const page = ref(Number(route.query.page) || 1)

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
    default:
      "I'm passsionate about sharing knowledge and helping others grow. Explore my blog for insights, tutorials, and tips on web development, drone photography, and more.",
  },
})

async function loadPosts() {
  try {
    posts.value = await fetchCollection(
      'posts',
      page.value,
      10,
      '',
      '-created',
      'author'
    )
  } catch (err) {
    console.error('Error fetching posts:', err)
    posts.value = { items: [] }
  }
}

const computedSeoData = computed(() =>
  createSeoObject({
    title: props.title,
    summary: props.description,
    imageUri: props.imgSrc || '',
    pubDate: '',
    byline: '',
  })
)

watch(
  () => route.query.page,
  async (newPage) => {
    page.value = Number(newPage) || 1
    await loadPosts()
  }
)

onMounted(loadPosts)
</script>

<style scoped lang="postcss">
/* Add CSS rules here if needed */
</style>
