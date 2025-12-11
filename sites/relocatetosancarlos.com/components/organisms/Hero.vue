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
            :id="headerId"
            class="md:w-1/2 z-10 flex h-full bg-black bg-opacity-50 rounded-lg overflow-hidden flex-col items-center justify-center text-center p-6 transition-transform duration-100 ease-out"
          >
            <div class="w-full space-y-6">
              <h1
                class="text-2xl font-extralight uppercase tracking-[0.3em] text-white sm:text-3xl lg:text-4xl"
              >
                {{ titleLine1 }}
                <span
                  class="mt-2 font-bold leading-tight text-primary text-xl sm:text-2xl"
                >
                  {{ titleHighlight }}
                </span>
              </h1>

              <img
                :src="imageSrc"
                :alt="imageAlt"
                class="md:hidden w-2/3 mx-auto"
              />

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
            class="absolute hidden md:block bottom-24 cursor-pointer transition-opacity duration-500 hover:opacity-100"
          >
            <p
              class="text-xl uppercase tracking-widest text-white/70 font-light"
            >
              Discover San Carlos
            </p>
            <svg
              class="mx-auto mt-2 h-6 w-6 text-white animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
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

const props = defineProps<Partial<Props>>();

const {
  id,
  padding,
  video,
  headerId,
  imageSrc,
  imageAlt,
  titleLine1,
  titleHighlight,
  description,
} = props;

// Parallax effect
const parallaxContainer = ref<HTMLElement | null>(null);
const parallaxOffset = ref(0);

const handleScroll = () => {
  if (parallaxContainer.value) {
    const scrolled = window.scrollY;
    // Adjust the multiplier (0.3) to control parallax intensity
    // Positive value moves down when scrolling down
    // Negative value moves up when scrolling down
    parallaxOffset.value = scrolled * -0.3;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initialize on mount
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
