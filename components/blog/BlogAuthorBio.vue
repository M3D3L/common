<template>
    <div v-if="author" class="flex items-center gap-4">
      <Avatar class="border border-muted">
        <AvatarImage :src="author.avatar" :alt="author.username" width="64" height="64" />
        <AvatarFallback>{{ getInitials(author.username) }}</AvatarFallback>
      </Avatar>
      <div class="flex items-center">
        <div class="flex flex-col">
          <h3 class="font-medium">{{ author.username }}</h3>
          <p class="text-sm text-muted-foreground">{{ author.bio }}</p>
        </div>
        <div v-if="author.social" class="flex gap-2 mt-2">
          <Button v-for="social in author.social" :key="social.name" variant="ghost" size="sm" as-child>
            <NuxtLink :to="social.url" target="_blank" :aria-label="`Follow ${author.name} on ${social.name}`">

            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Author {
    username: string
    bio: string
    avatar: string
    social?: {
      name: string
      url: string
      icon: string
    }[]
  }
  
  defineProps({
    author: {
      type: Object as () => Author,
      default: null
    }
  })
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }
  </script>