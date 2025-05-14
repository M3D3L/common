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
})
</script>

<template>
  <section class="w-full">
    <div class="container flex flex-col gap-12">
      <!-- Header -->
      <div class="flex flex-col items-center gap-4 text-center">
        <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">{{ title }}</h2>
        <p class="max-w-2xl text-lg text-muted-foreground">
          {{ description }}
        </p>
      </div>
    </div>
  </section>
</template>