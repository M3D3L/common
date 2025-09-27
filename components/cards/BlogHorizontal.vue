<template>
  <Card class="w-full">
    <CardContent>
      <NuxtLink
        :to="link"
        class="flex flex-col-reverse items-start w-full h-full pt-6 md:flex-row"
      >
        <!-- Text Content -->
        <div class="w-full mt-6 md:w-3/4 md:pr-8 md:mt-0">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs text-muted-foreground">{{
              formattedDate
            }}</span>
          </div>

          <h3 class="text-lg font-bold">
            <NuxtLink :to="link" class="transition-colors hover:text-primary">
              {{ title }}
            </NuxtLink>
          </h3>

          <p
            class="mt-2 text-sm text-muted-foreground line-clamp-3"
            v-html="safeDescription"
          />
        </div>

        <!-- Image -->
        <div v-if="coverImage"
          class="relative md:w-2/5 aspect-[16/9] card-styles my-auto overflow-hidden"
        >
          <img v-if="imageUrl"
            :src="imageUrl"
            :alt="title"
            width="600"
            height="338"
            loading="lazy"
            class="object-cover w-full h-full transition-transform duration-500"
            decoding="async"
          />
        </div>
      </NuxtLink>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";

// ✅ Define props
const props = defineProps<{
  title: string;
  description: string;
  created: string;
  slug: string;
  collectionId: string;
  id: string;
  coverImage: string;
  index?: number;
  baseUrl?: string;
}>();

const config = useRuntimeConfig();

// ✅ Computed: SSR-safe and pre-formatted
const formattedDate = computed(() =>
  new Date(props.created).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
);

// ✅ Safe link composition
const link = computed(() => `${props.baseUrl || ""}/blog${props.slug}`);

// ✅ Full image URL
const imageUrl = computed(
  () =>
    `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.id}/${props.coverImage}`
);

// ✅ Safe description rendering
const safeDescription = computed(() => props?.description?.trim() || "");
</script>
