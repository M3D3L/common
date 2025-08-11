<template>
  <div>
    <ContainersCarousel :slides="slides.map(slide => `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.propertyId}/${slide}?token=`)" @selected-event="openModalWithImage" />

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
            :src="imageUrl"
            class="object-cover w-full h-full"
            alt="Selected property image"
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
  slides: string[]
  collectionId: string
  propertyId: string
}>()

const modal = ref<typeof Modal | null>(null)
const selectedImage = ref('')

const openModalWithImage = (index: number) => {
  selectedImage.value = props.slides[index]
  modal.value?.toggleModal()
}

const moveSlider = (direction: 'back' | 'forward') => {
  const currentIndex = props.slides.findIndex(slide => slide === selectedImage.value)
  let newIndex = direction === 'back' ? currentIndex - 1 : currentIndex + 1

  if (newIndex < 0) newIndex = props.slides.length - 1
  if (newIndex >= props.slides.length) newIndex = 0

  selectedImage.value = props.slides[newIndex] || ''
}

const imageUrl = computed(() => {
  return `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.propertyId}/${selectedImage.value}?token=`
})

// Reset selectedImage if slides change
watch(() => props.slides, (newSlides) => {
  if (newSlides.length > 0) selectedImage.value = newSlides[0] || ''
})
</script>
