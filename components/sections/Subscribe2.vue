<template>
    <div class="flex flex-col w-full md:flex-row lg:flex-col">
      <!-- Left text/CTA block -->
      <div class="grid content-center w-full px-2 mb-8 md:w-1/2 lg:w-full md:pr-16 md:mb-4 md:px-0">
        <h2 class="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
          <span class="text-transparent transition-colors bg-clip-text bg-gradient-to-r from-primary to-primary/70 hover:from-primary/80 hover:to-primary/50"
          >
            Menu Items
          </span>
        </h2>
        <p class="mt-3 text-base text-muted-foreground line-clamp-3">
          Stay updated with the latest articles and insights on web development, design, and technology.
          Subscribe to our newsletter for exclusive content and tutorials.
        </p>
  
        <!-- Social proof -->
        <!-- <div class="inline-flex items-center mt-4 space-x-4 text-gray-400">
          <div class="flex -space-x-2">
            <img
              v-for="(avatar, index) in avatars"
              :key="index"
              :src="avatar"
              :alt="'Happy subscriber ' + (index + 1)"
              class="w-8 h-8 border-2 rounded-full border-white/10"
            />
          </div>
          <span class="text-sm">
            Join <span class="font-semibold text-white">10,000+</span> subscribers
          </span>
        </div> -->
      </div>
  
      <!-- Sticky newsletter hero container -->
      <SectionsNewsletterHero class="w-full md:w-1/2 lg:w-full" />
    </div>
  </template>
  
  <script setup lang="ts">
  const avatars = [
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/68.jpg',
    'https://randomuser.me/api/portraits/men/75.jpg',
  ]
  </script>
  