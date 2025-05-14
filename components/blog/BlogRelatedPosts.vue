<template>
    <div v-if="posts.length" class="mt-12">
      <h2 class="mb-6 text-2xl font-bold">Related Posts</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="post in posts" :key="post.id" class="transition-shadow group hover:shadow-lg">
          <NuxtLink :to="post.slug">
            <CardHeader class="p-0 border-b border-muted">
              <div class="overflow-hidden aspect-video">
                <img :src="post.image" :alt="post.title" width="400" height="225" loading="lazy"
                  class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
              </div>
            </CardHeader>
            <CardContent class="p-6">
              <h3 class="text-lg font-bold line-clamp-2">
                {{ post.title }}
              </h3>
              <p class="mt-2 text-sm text-muted-foreground line-clamp-2">
                {{ post.summary }}
              </p>
              <div class="flex items-center justify-between mt-4">
                <time :datetime="post.date" class="text-xs text-muted-foreground">
                  {{ formatDate(post.date) }}
                </time>
                <span class="text-xs text-muted-foreground">
                  {{ post.readingTime }}
                </span>
              </div>
            </CardContent>
          </NuxtLink>
        </Card>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { formatDate } from '@/composables/blogHelpers'
  
  interface BlogPost {
    id: number
    title: string
    summary: string
    date: string
    readingTime: string
    image: string
    slug: string
  }
  
  defineProps({
    posts: {
      type: Array as () => BlogPost[],
      default: () => []
    }
  })
  </script>