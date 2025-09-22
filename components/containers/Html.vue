<!-- components/ContentRenderer.vue -->
<template>
  <div
    v-html="content"
    class="content-renderer"
    :class="{
      'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto dark:prose-invert':
        useProse,
    }"
  ></div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: String,
  },
  useProse: {
    type: Boolean,
  },
});
</script>

<style>
/* Basic content styling */
.content-renderer {
  @apply leading-relaxed;
}

/* Headings */
.content-renderer h1,
.content-renderer h2,
.content-renderer h3,
.content-renderer h4 {
  @apply my-4 font-bold;
}

.content-renderer h1 {
  @apply text-3xl;
}

.content-renderer h2 {
  @apply text-2xl;
}

.content-renderer h3 {
  @apply text-xl;
}

/* Paragraphs */
.content-renderer p {
  @apply my-2;
}

/* Lists */
.content-renderer ul,
.content-renderer ol {
  @apply my-2 pl-6 list-inside;
}

/* Code blocks */
.content-renderer pre {
  @apply p-4 rounded-md overflow-x-auto my-4;
}

.content-renderer code {
  @apply font-mono px-1 py-0.5 rounded-sm;
}

/* Sections */
.content-renderer section {
  @apply mb-8;
}

/* Links */
.content-renderer a {
  @apply text-blue-600 underline hover:text-blue-700;
}
</style>
