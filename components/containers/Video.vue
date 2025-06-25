<template>
  <section
    class="relative flex items-center justify-center w-full min-h-screen py-16 overflow-hidden lg:py-24 text-foreground"
    ref="heroRef" :aria-label="'section for video background of a ' + title + ' and hero content'"
    :aria-labelledby="title" :aria-describedby="description" :role="'region'" :tabindex="0" :class="{
      'bg-cover bg-center': !isVideoComponentActive, // Use a new reactive property to control this
    }" :style="{
      backgroundImage: isVideoComponentActive ? 'none' : 'url(' + video + ')', // Adjust based on component's state
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }" :aria-live="isVideoComponentActive ? 'polite' : 'off'">

    <VideoBackground :video="video" :observe-element="heroRef" @video-active="handleVideoComponentActive" />

    <span class="sr-only">
      {{ description }}
    </span>
    <motion.div class="z-10 w-full px-4 mx-auto lg:container rounded-2xl" initial="hidden" whileInView="visible"
      :variants="{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 }
        }
      }">

      <TextSectionTitle :title :description :imgSrc :h1 />

      <div class="flex flex-col gap-8 lg:flex-row">
        <slot name="video-container-content" />
      </div>
    </motion.div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

const props = defineProps({
  video: {
    type: String,
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  h1: {
    type: Boolean,
    default: false
  },
  hideDescription: {
    type: Boolean,
    default: false
  },
  imgSrc: {
    type: String,
    default: ''
  }
})

const heroRef = ref<HTMLElement | null>(null)
const isVideoComponentActive = ref(false)

// Listen for the custom event from VideoBackground component
const handleVideoComponentActive = (isActive: boolean) => {
  isVideoComponentActive.value = isActive
}
</script>

<style scoped>
</style>