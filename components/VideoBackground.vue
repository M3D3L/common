<template>
  <client-only>
    <div class="absolute inset-0 z-0 overflow-hidden bg-black">
      <motion.div
        class="w-full h-full will-change-transform"
        :initial="{ y: 100, opacity: 0 }"
        :animate="videoControls"
      >
        <video
          ref="videoRef"
          :src="shouldLoadVideo ? video : ''"
          preload="none"
          muted
          loop
          playsinline
          class="object-cover w-full h-full transition-opacity duration-700"
          :class="{ 'opacity-0': !isVideoActive, 'opacity-100': isVideoActive }"
        />

        <div
          v-if="!isVideoActive"
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url(${poster})` }"
        />

        <div class="absolute inset-0 bg-black/40 transition-opacity" />
      </motion.div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { motion } from "motion-v";

const props = defineProps({
  video: { type: String, required: true },
  // Recommended for "Low Power" fallback
  poster: { type: String, default: "" },
  observeElement: { type: Object as () => HTMLElement | null, default: null },
});

const emit = defineEmits(["video-active"]);

const videoRef = ref<HTMLVideoElement | null>(null);
const isVideoActive = ref(false);
// Flag to prevent network requests early
const shouldLoadVideo = ref(false);

const videoControls = reactive({
  y: 0,
  opacity: 1,
});

let observer: IntersectionObserver | null = null;

/**
 * Smart Check: Detects if the device is on a slow connection,
 * data saver mode, or prefers reduced motion.
 */
const checkPerformanceMode = () => {
  if (typeof window === "undefined" || !navigator) return false;

  const conn = (navigator as any).connection;
  const isDataSaver = conn?.saveData;
  const isSlowConnection = ["slow-2g", "2g", "3g"].includes(
    conn?.effectiveType || ""
  );
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return isDataSaver || isSlowConnection || prefersReducedMotion;
};

const handleIntersection = async (entries: IntersectionObserverEntry[]) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      // 1. Mark as active to trigger CSS/Motion transitions
      isVideoActive.value = true;
      videoControls.y = 0;
      videoControls.opacity = 1;

      // 2. Start the actual video load
      if (videoRef.value) {
        try {
          // Trigger the network request manually
          if (videoRef.value.readyState < 2) videoRef.value.load();
          await videoRef.value.play();
        } catch (e) {
          console.warn(
            "Autoplay blocked (likely Low Power Mode or user pref):",
            e
          );
          isVideoActive.value = false;
        }
      }
    } else {
      isVideoActive.value = false;
      // Subtle move away
      videoControls.y = -50;
      videoControls.opacity = 0;
      videoRef.value?.pause();
    }
    emit("video-active", isVideoActive.value);
  }
};

const setupIntersectionObserver = () => {
  if (observer) observer.disconnect();

  // If the device is in a restricted state, we simply never set up the video logic
  if (checkPerformanceMode()) {
    console.info("Lite Mode: Video background disabled for performance.");
    return;
  }

  shouldLoadVideo.value = true;

  const elementToObserve =
    props.observeElement || videoRef.value?.parentElement;
  if (elementToObserve) {
    observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      // Load slightly before it scrolls into view
      rootMargin: "100px",
    });
    observer.observe(elementToObserve);
  }
};

onMounted(() => {
  // Use nextTick to ensure Vue has finished DOM updates
  nextTick(() => {
    // Wait for the browser to be idle (or a 200ms timeout for Safari)
    const idleCallback =
      (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 200));

    idleCallback(() => {
      setupIntersectionObserver();
    });
  });
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* Optimize for smooth GPU rendering */
.will-change-transform {
  will-change: transform, opacity;
}
</style>
