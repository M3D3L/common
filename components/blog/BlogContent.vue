<template>
    <article
      class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:border prose-img:border-muted prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-pre:bg-muted prose-pre:rounded-lg">
      <h1 class="text-3xl font-bold md:text-4xl lg:text-5xl">{{ title }}</h1>
      <p v-if="description" class="text-xl text-muted-foreground">{{ description }}</p>
      <ContainersHtml :content="content" />
    </article>
  </template>
  
  <script setup lang="ts">
  defineProps({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      required: true
    }
  })
  </script>