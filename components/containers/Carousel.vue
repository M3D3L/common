<script setup lang="ts">
import type { Swiper } from 'swiper/types'

const containerRef = ref<HTMLElement | null>(null)

const props = defineProps({
  slides: {
    type: Array,
    required: true,
    default: () => []
  },
  breakpoints: {
    type: Object,
    required: true,
    default: () => ({
      640: {
        slidesPerView: 1.5,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 3.15,
      },
    })
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
  breakpoints: props.breakpoints,
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
  <div class="relative w-full">
    <ClientOnly>
      <button
        class="absolute top-0 bottom-0 left-0 w-10 text-gray-500 transition-all hover:bg-black/5 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <swiper-container ref="containerRef" :init="false">
        <swiper-slide v-for="(slide, index) in slides" :key="index" class="aspect-square"
          @click="handleSlideClick(index)">
          <Card class="flex w-full h-full aspect-square">
            <img :lazy="true" :src="slide" alt="Slide image" class="object-cover w-full h-full rounded-lg" />
          </Card>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </div>
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