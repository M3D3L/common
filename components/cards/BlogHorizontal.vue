<template>
  <Card :class="cardClass">
    <CardContent class="flex flex-col-reverse items-start w-full h-full p-6 lg:flex-row">
      <!-- Text Content -->
      <div class="w-full mt-6 lg:mt-0 md:pr-8 md:w-3/4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-muted-foreground">{{ formattedDate }}</span>
        </div>
        <h3 class="text-lg font-bold">
          <NuxtLink :to="link" class="transition-colors hover:text-primary">{{ title }}</NuxtLink>
        </h3>
        <p class="mt-2 text-sm text-muted-foreground line-clamp-3">{{ description }}</p>
      </div>

      <!-- Image -->
      <div
        class="relative w-full h-full p-0 overflow-hidden border-b rounded-t-lg border-muted md:rounded-lg aspect-video lg:w-1/3"
      >
        <NuxtLink :to="link" class="w-full h-full">
          <img
            :src="imageUrl"
            :alt="title"
            width="600"
            loading="lazy"
            class="object-cover w-full h-full transition-transform duration-500"
          />
        </NuxtLink>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { useRuntimeConfig } from '#imports'
import { computed } from 'vue'

const props = defineProps({
  title: String,
  description: String,
  created: String,
  slug: String,
  collectionId: String,
  id: String,
  coverImage: String,
  index: Number, // for conditional class
  baseUrl: {
    type: String,
    default: ''
  }
})

const config = useRuntimeConfig()

const formattedDate = computed(() => new Date(props.created).toLocaleDateString())
const link = computed(() => `${props.baseUrl}/blog${props.slug}`)
const imageUrl = computed(() =>
  `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.id}/${props.coverImage}?token=`
)
const cardClass = computed(() => (props.index <= 2 ? 'flex' : 'hidden md:flex'))
</script>
