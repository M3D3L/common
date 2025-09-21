<template>
  <section
    class="relative flex items-center justify-center w-full overflow-hidden text-foreground"
    ref="heroRef" :aria-label="'section for video background of a ' + title + ' and hero content'"
    :aria-labelledby="title" :aria-describedby="description" :role="'region'" :tabindex="0" :class="[{
      'bg-cover bg-center': !isVideoComponentActive,
    }, padding]" :style="{
      backgroundImage: isVideoComponentActive ? 'none' : 'url(' + video + ')',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }" :aria-live="isVideoComponentActive ? 'polite' : 'off'">

    <VideoBackground :video="video" :observe-element="heroRef" @video-active="handleVideoComponentActive" />

    <motion.div class="container z-10 w-full mx-auto rounded-2xl" initial="hidden" whileInView="visible"
      :variants="{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 }
        }
      }">

      <slot name="video-container-content" />
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
  },
  padding: {
    type: String,
    default: 'md:py-16 lg:py-24'
  }
})

const heroRef = ref<HTMLElement | null>(null)
const isVideoComponentActive = ref(false)

// Listen for the custom event from VideoBackground component
const handleVideoComponentActive = (isActive: boolean) => {
  isVideoComponentActive.value = isActive
}
</script>