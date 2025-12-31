<template>
  <section
    class="container relative z-10 min-h-screen px-4 pt-20 pb-24 mx-auto"
  >
    <div v-if="pending && !post" class="flex items-center justify-center h-64">
      <p class="text-muted-foreground animate-pulse">
        Loading San Carlos guide...
      </p>
    </div>

    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center h-64 gap-4"
    >
      <p class="text-destructive">Post not found.</p>
      <NuxtLink to="/blog" class="text-primary hover:underline"
        >Back to Blog</NuxtLink
      >
    </div>

    <div v-else-if="post" class="w-full">
      <SeoMeta :seoData="computedSeoData" :noIndex="false" />

      <nav class="mb-8">
        <ul class="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <NuxtLink to="/" class="text-muted-foreground hover:text-primary"
              >Home</NuxtLink
            >
          </li>
          <li class="text-muted-foreground">/</li>
          <li>
            <NuxtLink
              to="/blog"
              class="text-muted-foreground hover:text-primary"
              >Blog</NuxtLink
            >
          </li>
          <li class="text-muted-foreground">/</li>
          <li class="font-medium text-foreground truncate max-w-[200px]">
            {{ post.title }}
          </li>
        </ul>
      </nav>

      <TooltipProvider>
        <Card class="overflow-hidden">
          <CardContent class="p-0">
            <div
              v-if="post.cover_image"
              class="relative w-full aspect-video h-96 lg:h-[500px] overflow-hidden"
            >
              <img
                :src="imgSrc"
                :alt="post.title"
                class="object-cover w-full h-full"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              />
            </div>

            <div class="p-6 lg:p-12">
              <div
                class="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-border/40"
              >
                <div
                  class="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <Calendar class="w-4 h-4" />
                  <ClientOnly>
                    <time :datetime="post.created">{{
                      formatDate(post.created)?.[0]
                    }}</time>
                  </ClientOnly>
                </div>
                <span class="text-muted-foreground">•</span>
                <div
                  class="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Clock class="w-4 h-4" />
                  {{ calculateReadingTime(post.content) }}
                </div>
                <h1
                  class="block w-full mb-6 text-3xl font-bold md:text-4xl lg:text-5xl"
                >
                  {{ post.title }}
                </h1>
                <SectionsShareTools
                  :title="post.title"
                  :description="post.description"
                  class="ml-auto"
                />
              </div>

              <article
                class="max-w-none prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-lg"
              >
                <div
                  v-if="post.description"
                  v-html="post.description"
                  class="mb-8 text-xl leading-relaxed text-muted-foreground"
                />
                <ContainersHtml v-if="post.content" :content="post.content" />
              </article>

              <div
                v-if="post.tags?.length"
                class="pt-8 mt-12 border-t border-border/40"
              >
                <h2
                  class="mb-4 text-sm font-semibold tracking-wide uppercase text-muted-foreground"
                >
                  Tags
                </h2>
                <div class="flex flex-wrap gap-2">
                  <Badge
                    v-for="tag in post.tags"
                    :key="tag"
                    variant="outline"
                    class="transition-all cursor-pointer hover:bg-accent hover:scale-105"
                    @click="navigateToTag(tag)"
                  >
                    #{{ tag }}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter
            v-if="post.expand?.author"
            class="p-6 border-t border-border/40 bg-muted/20 lg:p-8"
          >
            <div class="flex items-start gap-4">
              <Avatar class="w-16 h-16 border-2 shadow-md border-border">
                <AvatarImage
                  v-if="post.expand.author.avatar"
                  :src="`${config.public.pocketbaseUrl}api/files/${post.expand.author.collectionId}/${post.expand.author.id}/${post.expand.author.avatar}`"
                />
                <AvatarFallback>{{
                  getInitials(post.expand.author.username)
                }}</AvatarFallback>
              </Avatar>
              <div class="flex flex-col gap-1">
                <h3 class="text-lg font-semibold">
                  {{ post.expand.author.username }}
                </h3>
                <p
                  v-if="post.expand.author.bio"
                  class="text-sm text-muted-foreground"
                >
                  {{ post.expand.author.bio }}
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </TooltipProvider>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Calendar, Clock } from "lucide-vue-next";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TooltipProvider from "@/components/ui/tooltip/TooltipProvider.vue";
import { formatDate } from "@/composables/blogHelpers";
import { createSeoObject } from "@/composables/useSeo";

const config = useRuntimeConfig();
const route = useRoute();
const { fetchPostBySlug } = usePosts();

// 1. Reactive Slug - This ensures the key changes when navigation happens
const fullSlug = computed(() => {
  const { year, month, day, slug } = route.params;
  return `/${year}/${month}/${day}/${slug}`;
});

// 2. Data Fetching with a unique key based on the slug
const {
  data: post,
  pending,
  error,
} = await useAsyncData(
  `post-${route.params.slug}`,
  () => fetchPostBySlug(fullSlug.value, config.public.blogType as string),
  { watch: [fullSlug] }
);

// 3. Computed Helpers
const imgSrc = computed(() => {
  if (!post.value?.id) return "";
  return `${config.public.pocketbaseUrl}api/files/${post.value.collectionId}/${post.value.id}/${post.value.cover_image}`;
});

const computedSeoData = computed(() => {
  if (!post.value) return null;
  return createSeoObject({
    title: post.value.title,
    summary: post.value.description || "",
    imageUri: imgSrc.value,
    pubDate: post.value.created,
    byline: post.value.expand?.author?.username || "Relocate to San Carlos",
    keywords: post.value.tags?.join(", ") || "",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.value.title,
      image: [imgSrc.value],
      datePublished: post.value.created,
      author: [
        { "@type": "Person", name: post.value.expand?.author?.username },
      ],
    },
  });
});

// 4. Utility Functions
const calculateReadingTime = (html: string) => {
  if (!html) return "1 min read";
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
};

const getInitials = (name: string) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "A";

const navigateToTag = (tag: string) =>
  navigateTo(`/blog/tag/${encodeURIComponent(tag)}`);
</script>
