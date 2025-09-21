<!-- Example usage -->
<template>
  <div class="grid content-center w-full min-h-screen px-4 mx-auto overflow-hidden lg:px-8 lg:container">
    <TextSectionTitle
      class="pt-12 pb-16"
      :title
      :description
      :h1="false"
    />
    <ContainersCarousel :slides="socials">
      <template #slide="{ slide, index }">
        <CardsSocialsCard :key="index" :title="slide.title" :description="slide.description" :likes="slide.likes"
          :imageUrl="slide.imageUrl" />
      </template>
    </ContainersCarousel>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  socials: {
    type: Array as () => any[],
  },
});
</script>
