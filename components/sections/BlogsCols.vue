<template>
  <section
    id="blogs"
    class="relative z-10 flex flex-col px-6 py-24 md:px-0"
    ref="heroRef"
    :class="{ 'bg-cover bg-center': !isVideoComponentActive }"
    :style="{
      backgroundImage: isVideoComponentActive ? 'none' : 'url(' + video + ')',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <span class="sr-only">
      {{ props.description }}
    </span>

    <VideoBackground
      :video="video"
      :observe-element="heroRef"
      @video-active="handleVideoComponentActive"
    />

    <div class="relative md:container flex-flex-col">
      <TextSectionTitle :title :description :imgSrc />
      <div
        class="flex flex-col w-full min-h-screen gap-8 pb-16 mt-12 lg:pb-24 lg:flex-row"
      >
        <motion.div
          :variants="fadeUp"
          class="flex flex-col gap*:-8 w-full lg:w-2/3 lg:flex-row"
        >
          <div
            class="grid w-full grid-cols-1 gap-4 lg:grid-cols-1 md:grid-cols-2 lg:w-full"
          >
            <template
              v-for="(post, index) in props.content.items"
              :key="post.id"
            >
              <BlogHorizontal
                :title="post.title"
                :description="post.description"
                :created="post.created"
                :slug="post.slug"
                :collection-id="post.collectionId"
                :id="post.id"
                :cover-image="post.cover_image"
                :index="index"
                :base-url="baseUrl"
              />
            </template>
          </div>
        </motion.div>

        <div class="w-full lg:w-1/3">
          <SectionsSubscribe class="z-10 sticky-position top-24" />
        </div>
      </div>

      <div class="container flex justify-start w-full mr-auto -mt-12 lg:-mt-20">
        <nuxt-link
          v-if="showMore"
          to="/blog/"
          class="z-50 flex flex-row justify-end w-full cursor-pointer lg:pr-16 lg:w-2/3"
        >
          <div class="mt-4 ml-auto">
            <nuxt-link to="/blog">
              <Button size="lg" class="font-bold">
                View All Posts
              </Button>
            </nuxt-link>
          </div>
        </nuxt-link>

        <Pagination
          v-if="showPagination"
          :total-pages="Math.ceil(content?.totalPages > 1)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { Button } from "../ui/button";

import BlockMe5 from "/images/block-me-5.webp";
import BlogHorizontal from "../cards/BlogHorizontal.vue";

const video =
  "https://videos.pexels.com/video-files/28100367/12301150_2560_1440_30fps.mp4";

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
    default: () => ({ items: [] }), // Ensure items is initialized to an array
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
  imgSrc: {
    type: String,
    default: BlockMe5,
  },
});

const heroRef = ref<HTMLElement | null>(null);
const isVideoComponentActive = ref(false);

// Listen for the custom event from VideoBackground component
const handleVideoComponentActive = (isActive: boolean) => {
  isVideoComponentActive.value = isActive;
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
</script>

<style scoped>
.sticky-position {
  position: sticky !important;
  z-index: 32;
}
</style>
