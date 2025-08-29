<template>
  <div
    class="relative w-full p-6 mx-auto lg:max-w-6xl font-body bg-background text-foreground md:p-10"
  >
    <SectionsNavigator
      :title="property?.title"
      :description="property?.description"
      :sections="[
        { id: 'video', title: 'Video' },
        { id: 'gallery', title: 'Gallery' },
        { id: 'details', title: 'Details' },
        { id: 'realtor', title: 'Realtor' }
      ]"
      ref="navRef"
    >
      <!-- Video Walkthrough Section -->
      <section id="video" class="w-full" aria-labelledby="video-heading aspect-video">

        </section>
    </SectionsNavigator>
  </div>
</template>

<script lang="ts" setup>
import usePocketBaseCore from '@/composables/usePocketBaseCore'
</script>

<style lang="css">

</style>