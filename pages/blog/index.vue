<template>
  <div class="mt-8 md:pt-16">
    <Seo :seoData="computedSeoData" />
    <SectionsBlogColumn
      h1="true"
      :title
      :description
      :type
      :imgSrc
      :showMore="false"
      :showPagination="true"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  imgSrc: String,
  title: {
    type: String,
    default: 'Learn Web Development, Drone Photography, and More',
  },
  description: {
    type: String,
    default:
      "I'm passsionate about sharing knowledge and helping others grow. Explore my blog for insights, tutorials, and tips on web development, drone photography, and more.",
  },
  type: {
    type: String,
    default: 'posts',
  },
})

const computedSeoData = computed(() =>
  createSeoObject({
    title: props.title,
    summary: props.description,
    imageUri: props.imgSrc || '',
    pubDate: '',
    byline: '',
  })
)
</script>
