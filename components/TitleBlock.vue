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
})
</script>

<template>
      <!-- Header -->
      <div class="flex flex-col w-full gap-4 text-center md:text-left">
        <component :is="type" class="text-4xl lg:text-6xl md:text-5xl"> {{ title }} </component>
        <p class="max-w-2xl text-lg text-muted-foreground">
          {{ description }}
        </p>
      </div>
</template>
