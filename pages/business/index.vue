<template>
  <div
    class="relative max-w-5xl min-h-screen p-6 mx-auto mt-8 space-y-16 font-body bg-background text-foreground md:p-10 scroll-pt-28"
  >
    <!-- Shared Navigation -->
    <SectionsNavigator
      :title="isSpanish ? 'El Tamalón' : 'El Tamalón'"
      :sections="businessSections"
      ref="navRef"
    >
      <template #button>
        <ContainersSocials v-if="isPremiumMember" :socialLinks="socialLinks" :columnOnMobile="true" />
      </template>

      <!-- Top Section -->
      <section v-if="isPremiumMember" id="top" class="pb-12 scroll-mt-40">
        <div class="relative w-full mb-6 aspect-video">
          <img
            src="https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg"
            alt="Banner"
            class="object-cover w-full h-full"
          />
          <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <h2 class="text-2xl font-bold text-white">Welcome to Our Business</h2>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="py-12 scroll-mt-40" ref="setSectionRef">
        <h2 class="mb-8 text-3xl font-bold sm:text-4xl font-heading text-primary">
          About Us
        </h2>
        <div class="flex flex-col gap-6 lg:flex-row">
          <Card class="p-6 space-y-4 md:w-1/2">
            <p class="text-base leading-relaxed">{{ businessDescription }}</p>
            <p class="text-sm text-muted-foreground">{{ businessSlogan }}</p>
          </Card>

          <Card class="relative w-full min-h-[400px] h-full rounded-lg shadow-md md:w-1/2 overflow-hidden">
            <iframe
              class="absolute inset-0 w-full h-full"
              :src="mapSrc"
              style="border:0;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </Card>
        </div>
      </section>

      <!-- Ad Placeholder -->
      <div v-if="!isPremiumMember" class="flex items-center justify-center w-full h-40 bg-gray-200 rounded-lg">
        <span class="text-gray-600">[Advertisement]</span>
      </div>

      <!-- Services Section -->
      <section v-if="isPremiumMember" id="services" class="py-12 scroll-mt-40" ref="setSectionRef">
        <h2 class="mb-8 text-3xl font-bold sm:text-4xl font-heading text-primary">
          Services
        </h2>

        <!-- Premium -->
        <ul class="grid h-full grid-cols-1 gap-6 sm:grid-cols-2">
          <li v-for="(service, index) in businessServices" :key="index" class="h-full">
            <Card class="flex flex-col h-full gap-4 p-6 sm:flex-row sm:items-start">
              <img
                :src="service.image"
                :alt="service.title"
                class="object-cover w-full h-40 rounded-lg sm:w-32 sm:h-32"
              />
              <div class="flex flex-col flex-grow">
                <CardTitle class="text-lg font-bold sm:text-xl">
                  {{ service.title }}
                </CardTitle>
                <CardDescription class="text-sm leading-relaxed">
                  {{ service.description }}
                </CardDescription>
              </div>
            </Card>
          </li>
        </ul>
      </section>

      <!-- Gallery Section -->
      <section v-if="isPremiumMember && businessGallery" id="gallery" class="py-12 scroll-mt-40" ref="setSectionRef">
        <h2  class="mb-8 text-3xl font-bold sm:text-4xl font-heading text-primary">
          Gallery
        </h2>

        <!-- Premium: full gallery -->
        <ModalCarousel
          :slides="businessGallery"
          @selected-event="openModalWithImage"
        />
        <!-- Gallery Modal -->
        <Modal ref="modal">
          <Card class="relative flex flex-row items-center justify-between p-4">
            <button
              @click="moveSlider('back')"
              class="text-gray-500 hover:text-gray-700 w-12 bottom-0 bg-foreground/5 absolute left-0 top-0 min-h-[80vh]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="w-full min-h-[80vh] lg:aspect-video">
              <img :src="`${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.propertyId}/${selectedImage.value}?token=`" class="object-cover w-full h-full" />
            </div>
            <button
              @click="moveSlider('next')"
              class="text-gray-500 hover:text-gray-700 w-12 bottom-0 absolute right-0 top-0 min-h-[80vh]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-auto transform rotate-180" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </Card>
        </Modal>
      </section>
    </SectionsNavigator>
  </div>
</template>

<script setup>
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import Modal from '~/components/sections/Modal.vue';
import { businessData } from "@/assets/configs/mock";
import { Mail, Phone, Linkedin, Github } from 'lucide-vue-next'
import ModalCarousel from "~/components/ui/modal/ModalCarousel.vue";

const config = useRuntimeConfig()

const props = defineProps({
  socialLinks: {
    type: Array,
    default: () => [
      { icon: Linkedin, href: 'https://www.linkedin.com/in/guillermo-medel-9a4465151/' },
      { icon: Github, href: 'https://github.com/M3D3L' }
    ]
  },
  isPremiumMember: { 
    type: Boolean, 
    default: true
  },
  collectionId: {
    type: String,
    required: true
  },
  propertyId: {
    type: String,
    required: true
  }
});

const lat = 27.9513
const lng = -111.025
const zoom = 14
const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`

const businessName = ref('')
const businessDescription = ref('')
const businessSlogan = ref('')
const businessServices = ref([])
const businessGallery = ref([])

const businessSections = computed(() => props.isPremiumMember.value ? [
  { id: "top", title: "Home" },
  { id: "about", title: "About Us" },
  { id: "services", title: "Services" },
  { id: "gallery", title: "Gallery" },
] : [
  { id: "top", title: "Home" },
  { id: "about", title: "About Us" },
  { id: "services", title: "Services" },
  { id: "gallery", title: "Gallery" },
]);

onMounted(() => {
  businessName.value = businessData.name;
  businessDescription.value = businessData.description;
  businessSlogan.value = businessData.slogan;
  businessServices.value = businessData.services;
  businessGallery.value = businessData.gallery;
});
</script>
