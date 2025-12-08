<template>
  <section
    class="container relative z-10 min-h-screen px-4 pt-20 pb-24 mx-auto"
  >
    <SeoMeta :seoData="computedSeoData" />

    <motion.div
      class="w-full"
      initial="hidden"
      whileInView="visible"
      viewport="{ once: true, amount: 0.2 }"
      :variants="{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 },
        },
      }"
    >
      <!-- Breadcrumbs -->
      <nav class="mb-8" v-if="post">
        <ul class="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <NuxtLink
              to="/"
              class="transition-colors text-muted-foreground hover:text-primary"
            >
              Home
            </NuxtLink>
          </li>
          <li class="text-muted-foreground">/</li>
          <li>
            <NuxtLink
              to="/blog"
              class="transition-colors text-muted-foreground hover:text-primary"
            >
              Blog
            </NuxtLink>
          </li>
          <li class="text-muted-foreground">/</li>
          <li class="font-medium text-foreground">{{ post.title }}</li>
        </ul>
      </nav>

      <TooltipProvider>
        <Card v-if="post" class="overflow-hidden">
          <CardContent class="p-0">
            <!-- Hero Image -->
            <div
              v-if="post?.cover_image"
              class="relative w-full overflow-hidden"
            >
              <img
                :src="`${config.public.pocketbaseUrl}api/files/${post.collectionId}/${post.id}/${post.cover_image}?token=`"
                :alt="post.title"
                class="object-center mx-auto h-full"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              />
            </div>

            <!-- Content -->
            <div class="items-center p-6 lg:p-12">
              <!-- Article Metadata -->
              <div
                class="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-border/40"
              >
                <div
                  class="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <ClientOnly>
                    <time :datetime="post.created">
                      {{ formatDate(post.created)?.[0] }}
                    </time>
                  </ClientOnly>
                </div>

                <span class="text-muted-foreground">•</span>

                <div
                  class="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
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

              <!-- Article Content -->
              <article
                class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border/40"
              >
                <p
                  v-if="post.description"
                  v-html="post.description"
                  class="text-xl leading-relaxed text-muted-foreground"
                ></p>

                <ContainersHtml v-if="post.content" :content="post?.content" />
              </article>

              <!-- Tags -->
              <div
                v-if="post.tags && post.tags.length"
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
                    :aria-label="`View all posts tagged ${tag}`"
                  >
                    #{{ tag }}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>

          <!-- Author Bio -->
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
                      aria-label="Jump to comments section"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      {{ post.expand["comments_via_post"]?.length || 0 }}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Jump to comments</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardFooter>
        </Card>

        <!-- Comments -->
        <div class="mt-12">
          <SubmitComment v-if="post?.id" :id="post.id" />
        </div>
      </TooltipProvider>
    </motion.div>
  </section>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader, // Note: CardHeader is imported but not used in the template
} from "@/components/ui/card";
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
import type { RecordModel } from "pocketbase";
import { createSeoObject } from "@/composables/useSeo";
import SeoMeta from "../SeoMeta.vue";

const config = useRuntimeConfig();

const { fetchPostBySlug } = usePosts();
const route = useRoute();

const post = ref<RecordModel | null>(null);
const isLiked = ref(false);

const props = defineProps({
  type: {
    type: String,
    default: "posts",
  },
});

onMounted(async () => {
  try {
    // Extract the slug from the route
    const fullSlug = route.path.replace("/blog", "");
    post.value = await fetchPostBySlug(fullSlug, props.type);
  } catch (error) {
    console.error("Error fetching post:", error);
  }
});

const likePost = () => {
  isLiked.value = !isLiked.value;
  if (post.value) {
    if (isLiked.value) {
      post.value.likes = (post.value.likes || 0) + 1;
    } else {
      post.value.likes = Math.max(0, (post.value.likes || 1) - 1);
    }
  }
};

const calculateReadingTime = (html: string) => {
  if (!html) return "0 min read";
  const textContent = html?.replace(/<[^>]*>/g, " ") || "";
  const wordCount = textContent?.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
  return `${readingTime} min read`;
};

const getInitials = (name: string) => {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || ""
  );
};

const computedSeoData = computed(() => {
  if (!post.value) {
    return createSeoObject({
      title: "RelocateToSanCarlos.com Blog",
      summary:
        "Find essential information about relocating and living in San Carlos, Mexico.",
    });
  }

  const postData = post.value;
  const authorUsername =
    postData?.expand?.author?.username || postData.author || "";

  const fullImageUri = postData.cover_image
    ? `${config.public.pocketbaseUrl}api/files/${postData.collectionId}/${postData.id}/${postData.cover_image}`
    : undefined;

  // Format tags into a single string, checking if postData.tags is an array
  const tagsString = Array.isArray(postData.tags)
    ? postData.tags.join(", ")
    : postData.tags || "";

  return createSeoObject({
    title: postData.title,
    summary: postData.description,
    imageUri: fullImageUri,
    pubDate: postData.created,
    keywords: postData.keywords,
    byline: authorUsername,
    tags: tagsString,
    // Use the route path for canonical URL generation
    ogUrl: route.path,
    twitterCreator: authorUsername,
  });
});
</script>

<style>
/* Center all images in prose content */
article.prose img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
