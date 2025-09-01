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
  <section class="w-full">
    <div class="container flex flex-col gap-12">
      <!-- Header -->
      <div class="flex flex-col w-full gap-4 text-center md:text-left">
        <component :is="type"> {{ title }} </component>
        <p class="max-w-2xl text-lg text-muted-foreground">
          {{ description }}
        </p>
      </div>
    </div>
  </section>
</template>
