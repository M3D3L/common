<template>
  <containers-fixed-rail>
    <template #main>
      <div class="grid w-full gap-4">
        <CardsBlogHorizontal
        v-for="(post, index) in content"
        :key="post.id"
        :title="post.title"
        :description="post.description"
        :created="post.created"
        :slug="post.slug"
        :collection-id="post.collectionId"
        :id="post.id"
        :cover-image="post.cover_image"
        :index="index"
        :base-url="baseUrl"
      />
      </div>
    </template>
    <template #right>
      <SectionsSubscribe class="z-10 sticky-position top-24" />
    </template>
  </containers-fixed-rail>
</template>

<script setup lang="ts">
defineProps({
  content: {
    type: Array as PropType<any[]>,
    required: true,
  },
  baseUrl: {
    type: String,
  },
});
</script>
