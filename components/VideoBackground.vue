<template>
  <client-only>
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
</template>

<script setup lang="ts">
import { motion } from 'motion-v';
import { PropType } from 'vue';

const props = defineProps({
  video: {
    type: String,
    required: true,
  },
  observeElement: {
    type: Object as PropType<HTMLElement | null>,
    default: null
  }
});

const emit = defineEmits(['video-active']);

const videoRef = ref<HTMLVideoElement | null>(null);
const isVideoActive = ref(false);
const videoControls = reactive({
  y: 0,
  opacity: 1
});

let observer: IntersectionObserver | null = null;

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      isVideoActive.value = true;
      videoControls.y = 0;
      videoControls.opacity = 1;
      videoRef.value?.play().catch(e => console.log("Autoplay prevented:", e));
    } else {
      isVideoActive.value = false;
      videoControls.y = -200;
      videoControls.opacity = 0;
      videoRef.value?.pause();
    }
    emit('video-active', isVideoActive.value);
  });
};

const setupIntersectionObserver = () => {
  if (observer) {
    observer.disconnect();
  }

  const elementToObserve = props.observeElement || videoRef.value?.parentElement?.parentElement;

  if (elementToObserve) {
    observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    });
    observer.observe(elementToObserve);
  }
};

onMounted(() => {
  setupIntersectionObserver();
});

watch(() => props.observeElement, () => {
  setupIntersectionObserver();
}, { immediate: true });

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
video {
  transition: opacity 0.75s ease-in-out;
}
</style>