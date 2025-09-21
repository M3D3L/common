<template>
    <BlogPage class="mb-24" type="relocateBlog" :title="blogSection?.title" :description="blogSection?.description" imgSrc="" />
</template>

<script setup>
import BlogPage from '@common/pages/blog/index.vue'
import { blogSection } from '~/assets/configs/layout'
</script>