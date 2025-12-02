<template>
  <div class="relative w-full overflow-hidden">
    <Button
      @click="slidePrev"
      class="absolute left-0 z-10 p-2 m-2 rounded-full top-1/2"
    >
      <ChevronLeftIcon class="w-5 h-5" />
    </Button>
    <Button
      @click="slideNext"
      class="absolute right-0 z-10 p-2 m-2 rounded-full top-1/2"
    >
      <ChevronRightIcon class="w-5 h-5" />
    </Button>

    <Swiper
      :modules="[Autoplay, Navigation]"
      :loop="slides.length > 3"
      :looped-slides="slides.length"
      :space-between="16"
      :slides-per-view="1.25"
      :breakpoints="breakpoints"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      @swiper="onSwiper"
    >
      <SwiperSlide
        v-for="(slide, index) in slides"
        :key="`slide-${index}`"
        @click="handleSlideClick(index)"
        class="w-full h-full py-6"
      >
        <slot name="slide" class="w-full h-full" :slide="slide" :index="index">
          <Card class="w-full h-full overflow-hidden cursor-pointer">
            <img
              loading="lazy"
              :src="slide"
              alt="Slide image"
              class="object-cover w-full h-full rounded-lg"
            />
          </Card>
        </slot>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-icons/vue";

const props = defineProps({
  slides: {
    type: Array as () => any[],
    default: () => [],
  },
  breakpoints: {
    type: Object as () => Record<string, any>,
    default: () => ({
      320: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 1.5,
      },
      768: {
        slidesPerView: 2.5,
      },
      1024: {
        slidesPerView: 3,
      },
    }),
  },
});

const emit = defineEmits(["selected-event"]);

const swiperInstance = ref<any>(null);

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper;
};

const handleSlideClick = (index: number) => {
  swiperInstance.value?.slideToLoop(index);
  emit("selected-event", index);
};

const slidePrev = () => {
  if (!swiperInstance.value) return;
  swiperInstance.value.slidePrev();
  swiperInstance.value.autoplay.start();
};

const slideNext = () => {
  if (!swiperInstance.value) return;
  swiperInstance.value.slideNext();
  swiperInstance.value.autoplay.start();
};
</script>

<style lang="css">
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
