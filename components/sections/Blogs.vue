<template>
  <containers-video
    id="blogs"
    video="https://videos.pexels.com/video-files/5561385/5561385-uhd_2560_1440_25fps.mp4"
    :title="title"
    :description="description"
    class="min-h-[90vh] md:min-h-screen"
  >
    <template #video-container-content>
      <!-- Primary Blog - Featured Post -->
      <motion.div :variants="fadeUp" v-if="featuredPost">
        <article>
          <Card class="group">
            <CardContent
              class="flex flex-col items-center gap-6 p-0 md:flex-row"
            >
              <div
                class="order-2 w-full px-6 py-6 md:order-1 md:w-1/2 md:px-8 md:py-12"
              >
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs text-muted-foreground">
                    {{ formatDate(featuredPost.created)?.[0] }}
                  </span>
                </div>
                <h2
                  class="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl"
                >
                  <NuxtLink
                    :to="getPostLink(featuredPost)"
                    class="text-transparent transition-colors bg-clip-text bg-gradient-to-r from-primary to-primary/70 hover:from-primary/80 hover:to-primary/50"
                  >
                    {{ featuredPost.title || "Untitled Post" }}
                  </NuxtLink>
                </h2>
                <p class="mt-3 text-base text-muted-foreground line-clamp-3">
                  {{ featuredPost.description || "No description available" }}
                </p>
                <div class="flex items-center gap-3 mt-6">
                  <Button as-child size="default" class="px-6">
                    <NuxtLink :to="getPostLink(featuredPost)">
                      Read Full Article
                    </NuxtLink>
                  </Button>
                  <span
                    class="text-sm text-muted-foreground"
                    v-if="featuredPost.description"
                  >
                    {{ calculateReadingTime(featuredPost.description) }} min
                    read
                  </span>
                </div>
              </div>
              <div
                class="order-1 w-full overflow-hidden md:order-2 md:w-1/2 max-h-[450px] rounded-lg aspect-square lg:aspect-video shadow-md"
              >
                <NuxtLink
                  :to="getBlogUrl(featuredPost?.created, featuredPost?.slug)"
                >
                  <img
                    :src="featuredPost.cover_image || placeholderImage"
                    :alt="featuredPost.title || 'Post cover image'"
                    class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    width="800"
                    height="450"
                    loading="eager"
                  />
                </NuxtLink>
              </div>
            </CardContent>
          </Card>
        </article>
      </motion.div>

      <motion.div
        :variants="fadeUp"
        class="grid grid-cols-1 gap-6 mt-12 mb-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <template v-for="(post, index) in regularPosts" :key="post.id">
          <Card class="h-full overflow-hidden group">
            <CardHeader class="p-0 border-b border-muted">
              <div class="relative overflow-hidden aspect-video">
                <NuxtLink :to="getPostLink(post)">
                  <img
                    :src="post.cover_image || placeholderImage"
                    :alt="post.title"
                    width="600"
                    height="338"
                    loading="lazy"
                    class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </NuxtLink>
              </div>
            </CardHeader>
            <CardContent class="flex flex-col h-full p-6">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs text-muted-foreground">
                    {{ formatDate(post.created)?.[0] }}
                  </span>
                </div>
                <h3 class="text-lg font-bold">
                  <NuxtLink
                    :to="getPostLink(post)"
                    class="transition-colors hover:text-primary"
                  >
                    {{ post.title }}
                  </NuxtLink>
                </h3>
                <p class="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {{ post.description }}
                </p>
              </div>
              <div class="flex items-center justify-between pt-4 mt-auto">
                <span class="text-xs text-muted-foreground">
                  {{ calculateReadingTime(post.description) }} min read
                </span>
                <Button as-child size="sm" variant="outline">
                  <NuxtLink :to="getPostLink(post)"> Read More </NuxtLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </template>
        <!-- View All Card-->
        <Card class="relative h-full overflow-hidden group">
          <CardHeader class="p-0 border-b border-muted">
            <NuxtLink to="/blog">
              <div class="absolute w-full h-full overflow-hidden aspect-video">
                <img
                  :src="placeholderImage"
                  alt="View All Blogs"
                  width="600"
                  height="338"
                  loading="lazy"
                  class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <!-- Overlay with text -->
                <div
                  class="absolute inset-0 flex items-center justify-center bg-black/40"
                >
                  <h2 class="text-xl font-semibold text-white md:text-2xl">
                    Explore All Blogs
                  </h2>
                </div>
              </div>
            </NuxtLink>
          </CardHeader>

          <CardContent class="flex flex-col justify-end h-full p-6">
            <NuxtLink
              to="/blog"
              class="font-bold w-full transition-all hover:opacity-90 text-primary hover:underline pb-2"
            >
              View More Properties
            </NuxtLink>
          </CardContent>
        </Card>
      </motion.div>

      <SectionsSubscribe />
    </template>
  </containers-video>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/composables/blogHelpers";

const placeholderImage =
  "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1280";

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
    default: () => [],
  },
});

// Computed properties
const featuredPost = computed(() => props.content?.items?.[0]);
const regularPosts = computed(() => props.content.items?.slice(1));

// Utility to slugify title
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD") // handle special characters like é, ñ, ü
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^\w\s-]/g, "") // remove non-word characters
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/--+/g, "-") // remove multiple dashes
    .replace(/^-+|-+$/g, ""); // trim dashes from start/end
};

// Calculate reading time
const calculateReadingTime = (text: string) => {
  const wordsPerMinute = 200;
  const wordCount = text?.split(/\s+/)?.length || 0;
  return Math.ceil(wordCount / wordsPerMinute) || 1;
};

// Generate post link dynamically from created date + title slug
const getPostLink = (post: any) => {
  if (!post) return "/blog";
  const datePath = formatDate(post.created)?.[1];
  const slug = slugify(post.title || "untitled-post");
  return `/blog/${datePath}/${slug}`;
};

// Method to generate blog URL (same idea)
const getBlogUrl = (created: string, title: string) => {
  const datePath = formatDate(created)?.[1];
  const slug = slugify(title || "untitled-post");
  return `/blog/${datePath}/${slug}`;
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
