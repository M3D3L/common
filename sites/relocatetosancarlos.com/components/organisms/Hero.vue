<template>
  <containers-video :id="id" :padding="padding" :video="video">
    <template #video-container-content>
      <section
        :id="headerId"
        class="flex flex-col min-h-screen items-center justify-center w-full py-16 md:flex-row md:py-0"
      >
        <div
          class="flex flex-col rounded-lg items-center justify-center w-full overflow-hidden md:flex-row md:py-0"
        >
          <div
            class="flex items-end justify-center w-full md:w-1/2 lg:w-1/2 xl:w-2/3"
          >
            <img
              :src="imageSrc"
              :alt="imageAlt"
              class="hidden w-full lg:w-2/3 md:block ml-auto"
            />
          </div>

          <section
            ref="parallaxContainer"
            :style="{ transform: `translateY(${parallaxOffset}px)` }"
            class="md:w-1/2 z-10 flex h-full bg-black bg-opacity-50 rounded-lg overflow-hidden flex-col items-center justify-center text-center p-6 transition-transform duration-100 ease-out"
          >
            <div class="w-full space-y-6">
              <h1
                class="text-2xl font-extralight uppercase tracking-[0.3em] text-white sm:text-3xl lg:text-4xl"
              >
                {{ titleLine1 }}
                <span
                  class="mt-2 font-bold leading-tight text-primary text-xl sm:text-2xl block"
                >
                  {{ titleHighlight }}
                </span>
              </h1>

              <p
                class="mx-auto max-w-xl text-white/90 sm:text-base font-light leading-tight"
              >
                {{ description }}
              </p>

              <div
                class="flex flex-col gap-4 pt-8 lg:flex-row sm:justify-center"
              >
                <Button
                  v-for="(button, index) in buttons"
                  :key="button.title"
                  asChild
                  size="lg"
                  :variant="index === 0 ? 'default' : 'outline-white'"
                  class="min-w-56 font-semibold text-sm uppercase px-4 tracking-wider transition-all duration-300 transform hover:scale-[1.03]"
                >
                  <NuxtLink :to="button.link">
                    {{ button.title }}
                  </NuxtLink>
                </Button>
              </div>
            </div>
          </section>

          <nuxt-link
            to="/#about"
            class="absolute hidden md:block bottom-24 cursor-pointer"
          >
            <p
              class="text-xl uppercase tracking-widest text-white/70 font-light"
            >
              {{
                $isSpanishDomain ? "Descubre San Carlos" : "Discover San Carlos"
              }}
            </p>
          </nuxt-link>
        </div>
      </section>
    </template>
  </containers-video>
</template>

<script setup lang="ts">
import { Button } from "@common/components/ui/button";
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  id: string;
  padding: string;
  video: string;
  headerId: string;
  imageSrc: string;
  imageAlt: string;
  titleLine1: string;
  titleHighlight: string;
  description: string;
  buttons: Array<{ text: string; title: string; link: string }>;
}

// DO NOT DESTRUCTURE PROPS HERE
const props = defineProps<Props>();

// Use a simple proxy or computed to handle parallax if needed,
// but keep the prop values linked to the props object.
const parallaxContainer = ref<HTMLElement | null>(null);
const parallaxOffset = ref(0);

const handleScroll = () => {
  if (parallaxContainer.value) {
    parallaxOffset.value = window.scrollY * -0.3;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
