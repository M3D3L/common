
Modern Blog Card Component
Code 
I've transformed your blog card into a modern, premium component:

✨ Key Improvements:
Visual Design:

🎨 Glassmorphism - Semi-transparent card with backdrop blur
💫 Lift on hover - Card floats up slightly (hover:-translate-y-1)
🌊 Enhanced shadows - Grows from shadow-md to shadow-xl on hover
🖼️ Image zoom effect - Image scales up smoothly on hover (scale-110)
🌅 Gradient overlay - Dark gradient appears over image on hover
Layout:

📐 Better proportions - Image takes 2/5, content takes 3/5 width
📦 Improved spacing - Generous padding (p-6 on mobile, p-8 on desktop)
🎯 Flex layout - Content spreads evenly with justify-between
Typography & Content:

📅 Calendar icon - Added SVG icon next to date
📏 Better line height - Improved readability (leading-tight, leading-relaxed)
📝 Line clamping - Title clamps to 2 lines, description to 3 lines
🎨 Title hover effect - Title changes to primary color on card hover
Interactive Elements:

➡️ "Read More" CTA - Clear call-to-action with animated arrow
🎪 Arrow animation - Arrow slides right on hover (translate-x-1)
📏 Gap animation - Gap between text and arrow expands on hover
🎭 Smooth transitions - All animations are fluid (300-700ms)
Structure:

🔄 Removed padding from CardContent - Added p-0 to prevent double padding
🖼️ Fixed image overflow - Image container properly constrained
📱 Responsive - Stacks vertically on mobile, side-by-side on desktop
The card now feels like a premium blog post preview with smooth, engaging interactions that encourage clicks!





<template>
  <Card class="w-full overflow-hidden transition-all duration-300 border shadow-md group hover:shadow-xl hover:-translate-y-1 border-border/40 bg-card/50 backdrop-blur-sm">
    <CardContent class="p-0">
      <NuxtLink
        :to="link"
        class="flex flex-col w-full h-full md:flex-row"
      >
        <!-- Image -->
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
          <!-- Gradient overlay on hover -->
          <div class="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:opacity-100" />
        </div>

        <!-- Text Content -->
        <div class="flex flex-col justify-between w-full p-6 md:w-3/5 md:p-8">
          <div>
            <!-- Date & Category -->
            <div class="flex items-center gap-3 mb-3">
              <span class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formattedDate }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="mb-3 text-xl font-bold leading-tight transition-colors line-clamp-2 group-hover:text-primary">
              {{ title }}
            </h3>

            <!-- Description -->
            <p
              class="text-sm leading-relaxed text-muted-foreground line-clamp-3"
              v-html="safeDescription"
            />
          </div>

          <!-- Read More Link -->
          <div class="flex items-center gap-2 mt-4 text-sm font-semibold transition-all text-primary group-hover:gap-3">
            <span>Read More</span>
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
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
