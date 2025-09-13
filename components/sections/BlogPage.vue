<template>
  <div class="container flex flex-col">
    <SectionTitle class="pb-16" :title :description :h1 />
    <SectionsBlog
      v-if="content?.length"
      class="flex w-full mt-6"
      :content
      :baseUrl
    />

    <div class="container flex justify-start w-full mr-auto -mt-12 lg:-mt-20">
      <nuxt-link
        v-if="showMore"
        to="/blog/"
        class="z-50 flex flex-row justify-end w-full cursor-pointer lg:pr-16 lg:w-2/3"
      >
        View All Posts
      </nuxt-link>
      <Pagination v-if="showPagination" :total-pages="content?.totalPages" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionTitle from "../text/SectionTitle.vue";

const props = defineProps({
  title: {
    type: String,
    default: "Blog Articles & Tutorials",
  },
  description: {
    type: String,
    default:
      "Explore my latest articles and insights on web development, design, and technology. Learn from practical tutorials and stay updated with industry trends.",
  },
  content: {
    type: Object as () => {},
    default: () => ({ items: [] }),
  },
  showMore: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  baseUrl: {
    type: String,
    default: "",
  },
  h1: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.sticky-position {
  position: sticky !important;
  z-index: 32;
}
</style>
