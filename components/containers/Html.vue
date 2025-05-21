<!-- components/ContentRenderer.vue -->
<template>
  <div 
    v-html="content" 
    class="content-renderer"
    :class="{ 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto dark:prose-invert': useProse }"
  ></div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: String,
  },
  useProse: {
    type: Boolean,
  }
});

</script>

<style>
/* Basic content styling */
.content-renderer {
  line-height: 1.6;
}

/* Headings */
.content-renderer h1,
.content-renderer h2,
.content-renderer h3,
.content-renderer h4 {
  margin: 1em 0 0.5em;
  font-weight: bold;
}

.content-renderer h1 { font-size: 2em; }
.content-renderer h2 { font-size: 1.5em; }
.content-renderer h3 { font-size: 1.25em; }

/* Paragraphs */
.content-renderer p {
  margin: 0.5em 0 1em;
}

/* Lists */
.content-renderer ul,
.content-renderer ol {
  margin: 0.5em 0 1em;
  padding-left: 1.5em;
}

/* Code blocks */
.content-renderer pre {
  background: #f5f5f5;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1em 0;
}

.content-renderer code {
  font-family: monospace;
  background: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

/* Sections */
.content-renderer section {
  margin-bottom: 2em;
}

/* Links */
.content-renderer a {
  color: #2563eb;
  text-decoration: underline;
}

.content-renderer a:hover {
  color: #1d4ed8;
}
</style>