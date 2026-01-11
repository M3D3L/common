<template>
  <Card
    class="w-full overflow-hidden transition-all duration-300 border shadow-md group hover:shadow-xl hover:-translate-y-1 border-border/40 bg-card/50 backdrop-blur-sm"
  >
    <CardContent class="p-0">
      <NuxtLink :to="link" class="flex flex-col w-full h-full md:flex-row">
        <div
          v-if="coverImage"
          class="relative overflow-hidden md:w-2/5 aspect-[16/9] md:aspect-auto"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="title"
            width="600"
            height="338"
            loading="lazy"
            class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            decoding="async"
          />
          <div
            class="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:opacity-100"
          />
        </div>

        <div class="flex flex-col justify-between w-full p-6 md:w-3/5 md:p-8">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <span
                class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
              >
                <Calendar class="w-3.5 h-3.5" />
                {{ formattedDate }}
              </span>
            </div>

            <h3
              class="mb-3 text-xl font-bold leading-tight transition-colors line-clamp-2 group-hover:text-primary"
            >
              {{ title }}
            </h3>

            <p
              class="text-sm leading-relaxed text-muted-foreground line-clamp-3"
              v-html="safeDescription"
            />
          </div>

          <div
            class="flex items-center gap-2 mt-4 text-sm font-semibold transition-all text-primary group-hover:gap-3"
          >
            <span>Read More</span>
            <ArrowRight
              class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </NuxtLink>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-vue-next";

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

const formattedDate = computed(() =>
  new Date(props.created).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
);

const link = computed(() => `${props.baseUrl || ""}/blog${props.slug}`);

const imageUrl = computed(
  () =>
    `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.id}/${props.coverImage}`
);

const safeDescription = computed(() => props?.description?.trim() || "");
</script>
