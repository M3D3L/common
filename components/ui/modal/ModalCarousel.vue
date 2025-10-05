<template>
  <div>
    <ContainersCarousel :breakpoints
      :slides="normalizedSlides.map(slide => slide.url)"
      @selected-event="openModalWithImage"
    />

    <Modal ref="modal" class="w-full">
      <template #default>
        <!-- Back -->
        <button
          @click="moveSlider('back')"
          class="absolute top-0 bottom-0 left-0 w-10 text-gray-500 transition-all hover:bg-black/5 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="w-full h-full">
          <img
            :src="selectedImage?.url"
            :alt="selectedImage?.alt || 'Selected property image'"
            class="object-cover w-full h-full"
          />
        </div>

        <!-- Forward -->
        <button
          @click="moveSlider('forward')"
          class="absolute top-0 bottom-0 right-0 w-10 text-gray-500 transition-all hover:bg-black/5 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto transform rotate-180" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import Modal from '@/components/ui/modal/Modal.vue'

const config = useRuntimeConfig()

const props = defineProps<{
  slides: (string | { url: string; alt?: string })[]
  collectionId: string
  propertyId: string
  breakpoints: Record<string, { slidesPerView: number }>
}>()

const modal = ref<typeof Modal | null>(null)
const selectedImage = ref<{ url: string; alt?: string } | null>(null)

const normalizedSlides = computed(() => {
  // Detect structure
  if (!props.slides.length) return []
  const isObjectFormat = typeof props.slides[0] === 'object'

  if (isObjectFormat) {
    return props.slides as { url: string; alt?: string }[]
  }

  // Assume string[] => build PocketBase URLs
  return (props.slides as string[]).map((filename) => ({
    url: `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.propertyId}/${filename}?token=`,
    alt: filename
  }))
})

const openModalWithImage = (index: number) => {
  selectedImage.value = normalizedSlides.value[index]
  modal.value?.toggleModal()
}

const moveSlider = (direction: 'back' | 'forward') => {
  const currentIndex = normalizedSlides.value.findIndex(s => s.url === selectedImage.value?.url)
  let newIndex = direction === 'back' ? currentIndex - 1 : currentIndex + 1
  if (newIndex < 0) newIndex = normalizedSlides.value.length - 1
  if (newIndex >= normalizedSlides.value.length) newIndex = 0
  selectedImage.value = normalizedSlides.value[newIndex]
}

watch(
  () => props.slides,
  (newSlides) => {
    if (newSlides.length) selectedImage.value = normalizedSlides.value[0]
  },
  { immediate: true }
)
</script>
