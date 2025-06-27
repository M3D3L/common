<script setup lang="ts">
import type { Swiper } from 'swiper/types'

const containerRef = ref<HTMLElement | null>(null)

const props = defineProps({
  slides: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['selected-event'])

const { instance: swiperInstance } = useSwiper(containerRef, {
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  slidesPerView: 1.25,
  spaceBetween: 16,
  breakpoints: {
    640: {
      slidesPerView: 1.5,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 3.15,
    },
  },
})

const handleSlideClick = (index: number) => {
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(index)
    emit('selected-event', index)
  }
}

onMounted(() => {
  console.log(swiperInstance.value)
})
</script>

<template>
  <ClientOnly>
    <swiper-container ref="containerRef" :init="false">
      <swiper-slide
        v-for="(slide, index) in slides"
        :key="index"
        class="aspect-square"
        @click="handleSlideClick(index)"
      >
        <Card class="flex items-center justify-center w-full h-full aspect-square">
          <img
            v-if="slide.cover_image"
            :src="slide.cover_image"
            alt="Slide image"
            class="object-cover w-full h-full rounded-lg"
          />
        </Card>
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<style lang="css">
swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
}
</style>