<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: 'Feature Highlights',
  },
  description: {
    type: String,
    default: 'Discover what makes our solution stand out',
  },
  type: {
    type: String,
    default: 'h2',
  },
  textPosition: {
    type: String,
    default: 'text-center md:text-left',
  },
})
</script>

<template>
      <!-- Header -->
      <div :class="textPosition" class="flex flex-col w-full gap-4">
        <component :is="type" class="text-4xl lg:text-6xl text-primary md:text-5xl" v-html="title"></component>
        <p :class="textPosition"  class="w-full max-w-2xl text-lg text-muted-foreground">
          {{ description }}
        </p>
      </div>
</template>
