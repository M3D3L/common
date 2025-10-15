<template>
  <div class="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
    <Card
      v-for="(item, index) in items"
      :key="index"
      class="flex flex-col items-center justify-center p-6 transition-all border group rounded-2xl hover:shadow-lg hover:-translate-y-1"
    >
      <nuxt-link :to="item.link" class="flex flex-col items-center space-y-3">
        <div class="relative w-20 h-20 overflow-hidden transition-all border-4 rounded-full border-primary/70 group-hover:border-primary">
          <img
            :src="item.image"
            :alt="item.alt || 'Navigation Image'"
            class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span class="text-base font-semibold transition-colors text-foreground group-hover:text-primary">
          {{ item.title }}
        </span>
      </nuxt-link>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card"

const props = defineProps<{
  items: {
    image: string
    link: string
    alt?: string
    title: string
  }[]
}>()
</script>
