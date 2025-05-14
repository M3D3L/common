<template>
    <div v-if="tags?.length" class="mt-12">
      <h2 class="sr-only">Tags</h2>
      <div class="flex flex-wrap gap-2">
        <Badge v-for="tag in tags" :key="tag" variant="outline"
          class="text-sm font-medium cursor-pointer hover:bg-accent" @click="$emit('navigateToTag', tag)"
          :aria-label="`View all posts tagged ${tag}`">
          #{{ tag }}
        </Badge>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    tags: {
      type: Array as () => string[],
      default: () => []
    }
  })
  
  defineEmits(['navigateToTag'])
  </script>