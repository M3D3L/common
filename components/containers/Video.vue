<template>
  <section
    class="relative flex items-center justify-center w-full min-h-screen py-16 overflow-hidden lg:py-24 text-foreground xl:px-48"
    ref="heroRef" :aria-label="'section for video background of a ' + title + ' and hero content'"
    :aria-labelledby="title" :aria-describedby="description" :role="'region'" :tabindex="0" :class="{
      'bg-cover bg-center': isVideoActive,
    }" :style="{
      backgroundImage: isVideoActive ? 'none' : 'url(' + video + ')',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }" :aria-live="isVideoActive ? 'polite' : 'off'">

    <client-only>
      <!-- Scroll Video Container -->
      <div class="absolute inset-0 z-0 overflow-hidden">
        <motion.div class="w-full h-full will-change-transform" :initial="{ y: 200, opacity: 0 }"
          :animate="videoControls" :viewport="{ amount: 0.4, once: false }">
          <video ref="videoRef" loading="lazy" muted loop playsinline role="presentation"
            class="object-cover w-full h-full transition-opacity duration-500" :src="video"
            :class="{ 'opacity-0': !isVideoActive }" />
          <div class="absolute inset-0 transition-opacity duration-500 bg-black/40"
            :class="{ 'opacity-0': !isVideoActive }" />
        </motion.div>
      </div>
    </client-only>

    <!-- Visually hidden description for screen readers -->
    <span class="sr-only">
      {{ description }}
    </span>
    <!-- Hero Content -->

    <motion.div class="z-10 w-full px-4 mx-auto lg:container rounded-2xl" initial="hidden" whileInView="visible" :variants="{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 }
        }
      }">

        <div class="flex items-center w-full gap-8 mb-8 md:mb-12">
          <h1 v-if="h1" class="text-4xl font-black leading-tight tracking-tighter md:text-6xl lg:text-7xl">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/60">{{
              title }}</span>
          </h1>

          <template v-else>
            <h2 v-if="title" class="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-5xl">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                {{ title }}
              </span>
            </h2>
          </template>

          <img v-if="imgSrc" :src="imgSrc" lazy :alt="`${title} image`" class="w-[84px] border-white -border-4 md:w-28" />
        </div>


        <p v-if="description" class="max-w-3xl mt-6 text-lg text-foreground/70">
          {{ description }}
        </p>

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
  }
})


const heroRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const isVideoActive = ref(false)
const videoControls = reactive({
  y: 0,
  opacity: 1
})

// Handle video playback based on visibility
const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // When in view
      isVideoActive.value = true
      videoControls.y = 0
      videoControls.opacity = 1
      videoRef.value?.play().catch(e => console.log("Autoplay prevented:", e))
    } else {
      // When out of view
      isVideoActive.value = false
      videoControls.y = -200
      videoControls.opacity = 0
      videoRef.value?.pause()
    }
  })
}

onMounted(() => {
  const observer = new IntersectionObserver(handleIntersection, {
    // Trigger when 15% of element is visible
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  })

  if (heroRef.value) {
    observer.observe(heroRef.value)
  }

  // Cleanup
  onBeforeUnmount(() => {
    if (heroRef.value) {
      observer.unobserve(heroRef.value)
    }
  })
})
</script>

<style scoped>
video {
  transition: opacity 0.75s ease-in-out;
}
</style>