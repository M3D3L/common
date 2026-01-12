<template>
  <section v-if="content" class="relative w-full">
    <Card
      class="lg:grid flex flex-col border items-stretch overflow-hidden gap-0 lg:grid-cols-2 min-h-[500px] shadow-xl border-border/40 bg-card/50 backdrop-blur-sm group"
    >
      <NuxtLink
        :to="link"
        class="relative min-h-[300px] lg:min-h-full overflow-hidden order-1 lg:order-2"
      >
        <img
          :src="imageUrl"
          :alt="content.title"
          class="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent lg:hidden"
        />
      </NuxtLink>

      <div
        class="flex flex-col justify-center px-6 py-10 lg:px-12 lg:py-16 order-2 lg:order-1"
      >
        <div class="flex items-center gap-3 mb-6">
          <Badge
            variant="default"
            class="px-3 py-1 text-xs uppercase tracking-wider bg-primary"
          >
            Featured Story
          </Badge>
          <span
            class="flex items-center gap-1.5 text-sm font-medium text-muted-foreground"
          >
            <Calendar class="w-4 h-4" />
            {{ formattedDate }}
          </span>
        </div>

        <NuxtLink
          :to="link"
          class="hover:text-primary transition-all group-hover:underline decoration-primary/30"
        >
          <h2
            class="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl mb-6 leading-[1.1]"
          >
            {{ content.title }}
          </h2>
        </NuxtLink>

        <p
          class="text-lg leading-relaxed text-muted-foreground mb-8 line-clamp-4"
        >
          {{ safeDescription }}
        </p>

        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-8 border-t border-border/60"
        >
          <div v-if="content.expand?.author" class="flex items-center gap-3">
            <img
              :src="getAuthorAvatar(content.expand.author)"
              class="w-10 h-10 rounded-full object-cover border border-border"
              alt="Author avatar"
            />
            <div>
              <p class="text-sm font-bold leading-none">
                {{ content.expand.author.name }}
              </p>
              <p class="text-xs text-muted-foreground mt-1">
                {{ content.expand.author.title }}
              </p>
            </div>
          </div>

          <NuxtLink :to="link" class="shrink-0">
            <Button
              size="lg"
              class="px-8 text-md font-bold md:w-auto w-full h-14 shadow-lg hover:shadow-primary/20 transition-all flex gap-2"
            >
              Read Full Story
              <ArrowRight
                class="w-5 h-5 transition-transform group-hover:translate-x-1"
              />
            </Button>
          </NuxtLink>
        </div>
      </div>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Calendar, ArrowRight } from "lucide-vue-next";

const config = useRuntimeConfig();

export interface BlogContent {
  id: string;
  collectionId: string;
  title: string;
  description: string;
  created: string;
  slug: string;
  coverImage: string;
  expand?: {
    author?: {
      name: string;
      title: string;
      avatar: string;
      collectionId: string;
      id: string;
    };
  };
}

interface Props {
  content: BlogContent | null;
  baseUrl?: string;
}

const props = defineProps<Props>();

const formattedDate = computed(() => {
  if (!props.content?.created) return "";
  return new Date(props.content.created).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const link = computed(
  () => `${props.baseUrl || ""}/blog${props.content?.slug || ""}`
);

const imageUrl = computed(() => {
  if (!props.content) return "";
  return `${config.public.pocketbaseUrl}api/files/${props.content.collectionId}/${props.content.id}/${props.content.coverImage}`;
});

const getAuthorAvatar = (author: any) => {
  return `${config.public.pocketbaseUrl}api/files/${author.collectionId}/${author.id}/${author.avatar}`;
};

const safeDescription = computed(() => {
  // Strip HTML tags if description contains them, otherwise just trim
  return props.content?.description?.replace(/<[^>]*>?/gm, "").trim() || "";
});
</script>
