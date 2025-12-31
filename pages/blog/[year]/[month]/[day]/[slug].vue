<template>
  <section
    class="container relative z-10 min-h-screen px-4 pt-20 pb-24 mx-auto"
  >
    <SeoMeta v-if="post" :seoData="computedSeoData" />

    <div class="w-full">
      <nav v-if="post" class="mb-8">
        <ul class="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <NuxtLink
              to="/"
              class="transition-colors text-muted-foreground hover:text-primary"
              >Home</NuxtLink
            >
          </li>
          <li class="text-muted-foreground">/</li>
          <li>
            <NuxtLink
              to="/blog"
              class="transition-colors text-muted-foreground hover:text-primary"
              >Blog</NuxtLink
            >
          </li>
          <li class="text-muted-foreground">/</li>
          <li class="font-medium text-foreground">{{ post.title }}</li>
        </ul>
      </nav>

      <TooltipProvider>
        <Card v-if="post" class="overflow-hidden">
          <CardContent class="p-0">
            <div
              v-if="post.cover_image"
              class="relative w-full overflow-hidden aspect-auto h-96 lg:h-[500px]"
            >
              <img
                :src="`${config.public.pocketbaseUrl}api/files/${post.collectionId}/${post.id}/${post.cover_image}`"
                :alt="post.title"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              />
            </div>

            <div class="items-center p-6 lg:p-12">
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
                  class="mb-6 text-3xl w-full block font-bold md:text-4xl lg:text-5xl"
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
                class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border/40"
              >
                <p
                  v-if="post.description"
                  v-html="post.description"
                  class="text-xl leading-relaxed text-muted-foreground"
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
                    class="text-sm font-medium transition-all cursor-pointer hover:bg-accent hover:scale-105"
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
            <div
              class="flex flex-col w-full gap-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-start gap-4">
                <Avatar class="w-16 h-16 border-2 shadow-md border-border">
                  <AvatarImage
                    v-if="post.expand.author.avatar"
                    :src="`${config.public.pocketbaseUrl}api/files/${post.expand.author.collectionId}/${post.expand.author.id}/${post.expand.author.avatar}`"
                    :alt="post.expand.author.username"
                  />
                  <AvatarFallback class="text-lg font-semibold">
                    {{ getInitials(post.expand.author.username) }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex flex-col gap-1">
                  <h3 class="text-lg font-semibold">
                    {{ post.expand.author.username }}
                  </h3>
                  <p
                    v-if="post.expand.author.bio"
                    class="text-sm leading-relaxed text-muted-foreground"
                  >
                    {{ post.expand.author.bio }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button
                      variant="outline"
                      size="sm"
                      class="gap-2"
                      @click="scrollToComments"
                    >
                      <MessageSquare class="w-4 h-4" />
                      {{ post.expand["comments_via_post"]?.length || 0 }}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Jump to comments</p></TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div class="mt-12">
          <SubmitComment v-if="post?.id" :id="post.id" />
        </div>
      </TooltipProvider>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Calendar, Clock, MessageSquare } from "lucide-vue-next";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TooltipProvider from "@/components/ui/tooltip/TooltipProvider.vue";

import { formatDate } from "@/composables/blogHelpers";
import { createSeoObject } from "@/composables/useSeo";

const config = useRuntimeConfig();
const route = useRoute();
const { fetchPostBySlug } = usePosts();

// 1. Build Slug
const fullSlug = computed(() => {
  const { year, month, day, slug } = route.params;
  return `/${year}/${month}/${day}/${slug}`;
});

// 2. Data Fetching - Renamed 'data' to 'post' directly
const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
  fetchPostBySlug(fullSlug.value, config.public.blogType as string)
);

// 3. SEO Logic
const computedSeoData = computed(() => {
  if (!post.value) return null;
  const p = post.value;

  return createSeoObject({
    title: p.title,
    summary: p.description || "",
    imageUri: p.cover_image
      ? `${config.public.pocketbaseUrl}api/files/${p.collectionId}/${p.id}/${p.cover_image}`
      : undefined,
    jsonLd: {
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description || "",
      datePublished: p.created,
      dateModified: p.updated,
      author: {
        "@type": "Person",
        name: p.expand?.author?.username || "Author",
      },
      publisher: { "@type": "Organization", name: config.public.siteName },
    },
  });
});

// 4. Helper Functions
const calculateReadingTime = (html: string) => {
  if (!html) return "1 min read";
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
};

const getInitials = (name: string) => {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";
};

const scrollToComments = () => {
  document
    .getElementById("comments-section")
    ?.scrollIntoView({ behavior: "smooth" });
};

const navigateToTag = (tag: string) => {
  navigateTo(`/blog/tag/${encodeURIComponent(tag)}`);
};
</script>

<style>
/* Center all images in prose content */
article.prose img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
