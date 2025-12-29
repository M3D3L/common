<template>
  <div>
    <ContainersCarousel
      :breakpoints="breakpoints"
      :slides="normalizedSlides.map((slide) => slide.url)"
      @selected-event="openModalWithImage"
    />

    <Dialog :open="isModalOpen" @update:open="closeModal">
      <DialogContent
        class="max-w-[100vw] w-full h-[100vh] p-0 border-none bg-black/25 text-white flex flex-col gap-0"
      >
        <div
          class="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-50"
        >
          <div>
            <h2 class="text-lg font-semibold tracking-tight">
              {{ selectedImage?.alt || "Property Image" }}
            </h2>
            <p class="text-xs text-gray-400">
              Image {{ currentIndex + 1 }} of {{ normalizedSlides.length }}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            @click="closeModal"
            class="rounded-full hover:bg-white/20 text-white"
          >
            <X class="w-6 h-6" />
          </Button>
        </div>

        <div
          class="relative flex-grow flex items-center justify-center p-4 md:p-12 overflow-hidden"
        >
          <Button
            @click="moveSlider('back')"
            variant="ghost"
            size="icon"
            class="absolute left-4 z-50 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
          >
            <ChevronLeft class="w-8 h-8" />
          </Button>

          <img
            :src="selectedImage?.url"
            :alt="selectedImage?.alt"
            class="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300"
          />

          <Button
            @click="moveSlider('forward')"
            variant="ghost"
            size="icon"
            class="absolute right-4 z-50 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
          >
            <ChevronRight class="w-8 h-8" />
          </Button>
        </div>

        <div
          class="w-full bg-background/10 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex items-center justify-between"
        >
          <div class="flex flex-col">
            <span class="text-2xl font-bold text-white leading-none">
              Viewing Property Gallery
            </span>
          </div>

          <div class="flex items-center gap-4">
            <Button
              variant="outline"
              class="hidden border-white/20 hover:bg-white/10 hover:text-white md:flex"
            >
              Request Info
            </Button>
            <Button class="bg-primary text-primary-foreground font-bold">
              Inquire Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ChevronLeft, ChevronRight, X, MapPin } from "lucide-vue-next";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const config = useRuntimeConfig();

const props = defineProps<{
  slides: (string | { url: string; alt?: string })[];
  collectionId: string;
  propertyId: string;
  breakpoints: Record<string, { slidesPerView: number }>;
}>();

const isModalOpen = ref(false);
const selectedImage = ref<{ url: string; alt?: string } | null>(null);

const normalizedSlides = computed(() => {
  if (!props.slides.length) return [];
  const isObjectFormat = typeof props.slides[0] === "object";

  if (isObjectFormat) {
    return props.slides as { url: string; alt?: string }[];
  }

  return (props.slides as string[]).map((filename) => ({
    url: `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.propertyId}/${filename}`,
    alt: filename,
  }));
});

const currentIndex = computed(() =>
  normalizedSlides.value.findIndex((s) => s.url === selectedImage.value?.url)
);

const openModalWithImage = (index: number) => {
  selectedImage.value = normalizedSlides.value[index];
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const moveSlider = (direction: "back" | "forward") => {
  let newIndex =
    direction === "back" ? currentIndex.value - 1 : currentIndex.value + 1;
  if (newIndex < 0) newIndex = normalizedSlides.value.length - 1;
  if (newIndex >= normalizedSlides.value.length) newIndex = 0;
  selectedImage.value = normalizedSlides.value[newIndex];
};

// Handle Escape and Arrow Keys
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (!isModalOpen.value) return;
    if (e.key === "ArrowLeft") moveSlider("back");
    if (e.key === "ArrowRight") moveSlider("forward");
    if (e.key === "Escape") closeModal();
  };
  window.addEventListener("keydown", handleKeydown);
  onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
});

watch(
  () => props.slides,
  (newSlides) => {
    if (newSlides.length && !selectedImage.value) {
      selectedImage.value = normalizedSlides.value[0];
    }
  },
  { immediate: true }
);
</script>
