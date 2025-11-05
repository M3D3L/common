<template>
  <section class="w-full py-16 bg-muted/30">
    <div class="container">
      <p class="mb-8 text-sm text-center text-muted-foreground">
        {{ tagline }}
      </p>

      <div class="flex flex-wrap items-center justify-center gap-12 opacity-70">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="flex items-center gap-2 text-xl font-semibold"
        >
          <component :is="feature.icon" class="w-6 h-6 text-primary" />
          {{ feature.text }}
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Heart, Leaf, Users, Clock } from "lucide-vue-next";

const props = defineProps({
  tagline: {
    type: String,
    default: "Trusted by the San Carlos community",
  },
  features: {
    type: Array as () => { icon: any; text: string }[],
    default: () => [
      { icon: Heart, text: "Heart Healthy Options" },
      { icon: Leaf, text: "Gluten-Free Available" },
      { icon: Users, text: "Diabetic Friendly" },
      { icon: Clock, text: "Ready in Minutes" },
    ],
  },
});
</script>

<style></style>
