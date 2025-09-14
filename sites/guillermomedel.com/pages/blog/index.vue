<template>
    <BlogPage :title="title" :description="description" imgSrc="" />
</template>

<script setup>
import BlogPage from '@common/pages/blog/index.vue'

const title = 'Our Blog Explains Why Relocating to San Carlos is the Best Decision You\'ll Ever Make';
const description = 'Discover the latest trends, tips, and insights in real estate with our expert guidance.';
</script>