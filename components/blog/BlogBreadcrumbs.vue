<template>
    <nav class="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
      <ol class="flex flex-wrap items-center gap-2">
        <li>
          <NuxtLink to="/" class="transition-colors hover:text-primary">Home</NuxtLink>
        </li>
        <li>/</li>
        <li>
          <NuxtLink to="/blog" class="transition-colors hover:text-primary">Blog</NuxtLink>
        </li>
        <li>/</li>
        <li class="font-medium text-foreground">
          {{ title }}
        </li>
      </ol>
    </nav>
  </template>
  
  <script setup lang="ts">
  defineProps({
    title: {
      type: String,
      required: true
    }
  })
  </script>