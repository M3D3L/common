<template>
  <div
    class="relative max-w-5xl min-h-screen p-6 mx-auto font-body bg-background text-foreground md:p-10 scroll-pt-28"
  >

    <div class="mt-8 space-y-12">
        <!-- Shared Navigation -->
    <SectionsNavigator
      :title="isSpanish ? 'El Tamalón' : 'El Tamalón'"
      :sections="businessSections"
      ref="navRef"
    >
      <template #button>
        <ContainersSocials :socialLinks="socialLinks" :columnOnMobile="true" />
      </template>

      <section
        id="about"
        class="pb-8 scroll-mt-40"
        ref="setSectionRef"
      >
        <h2
          class="mb-6 text-3xl font-bold sm:text-4xl font-heading text-primary"
        >
          About Us
        </h2>
        <div class="flex flex-col gap-6 lg:flex-row">
            <Card class="p-5 md:w-1/2">
                <p class="text-base leading-relaxed">{{ businessDescription }}</p>
                <p class="mt-4 text-sm text-muted-foreground">{{ businessSlogan }}</p>
            </Card>
          
            <Card class="relative w-full min-h-[400px] h-full rounded-lg shadow-md md:w-1/2">
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

      <section
        id="services"
        class="pb-8 scroll-mt-40"
        ref="setSectionRef"
      >
        <h2
          class="w-full mb-6 text-3xl font-bold sm:text-4xl font-heading text-primary"
        >
          Services
        </h2>
        <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <li v-for="(service, index) in businessServices" :key="index">
            <Card class="flex flex-col p-4 sm:flex-row sm:p-5">
              <img
                :src="service.image"
                :alt="service.title"
                class="object-cover w-full h-40 mb-4 rounded-lg sm:w-32 sm:h-32 sm:mr-4 sm:mb-0"
              />
              <div class="flex flex-col flex-grow w-full">
                <CardTitle class="w-full text-lg font-bold sm:text-xl">{{
                  service.title
                }}</CardTitle>
                <CardDescription class="text-sm leading-relaxed">{{
                  service.description
                }}</CardDescription>
              </div>
            </Card>
          </li>
        </ul>
      </section>

      <section
        id="gallery"
        class="pb-8 scroll-mt-40"
        ref="setSectionRef"
      >
        <h2
          class="mb-6 text-3xl font-bold sm:text-4xl font-heading text-primary"
        >
          Gallery
        </h2>

        <ContainersCarousel :slides="businessGallery" @selected-event="openModalWithImage"  />

        <Modal ref="modal">
          <Card class="relative flex flex-row items-center justify-between p-4">
            <button @click="moveSlider('back')"
              class="text-gray-500 hover:text-gray-700 w-12 bottom-0 bg-foreground/5 absolute left-0 top-0 min-h-[80vh]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="w-full min-h-[80vh] lg:aspect-video">
              <img :src="selectedImage" class="object-cover w-full h-full" />
            </div>
            <button @click="moveSlider('back')"
              class="text-gray-500 hover:text-gray-700 w-12 bottom-0 absolute right-0 top-0 min-h-[80vh]">
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
  </div>
</template>

<script setup>
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import Modal from '~/components/sections/Modal.vue';
import { businessData } from "@/assets/configs/mock";
import {
  Mail,
  Phone,
  Linkedin,
  Github,
} from 'lucide-vue-next'

const props = defineProps({
  socialLinks: {
    type: Array,
    default: () => [
      {
        icon: Linkedin,
        href: 'https://www.linkedin.com/in/guillermo-medel-9a4465151/'
      },
      {
        icon: Github,
        href: 'https://github.com/M3D3L'
      }
    ]
  }
})

const lat = 27.9513
const lng = -111.025
const zoom = 14
const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`

const businessName = ref('')
const businessDescription = ref('')
const businessSlogan = ref('')
const businessServices = ref([])
const businessGallery = ref([])

// Sticky navbar sections
const businessSections = [
  { id: "about", title: "About Us" },
  { id: "services", title: "Services" },
  { id: "gallery", title: "Gallery" },
];


onMounted(() => {
  businessName.value = businessData.name;
  businessDescription.value = businessData.description;
  businessSlogan.value = businessData.slogan;
  businessServices.value = businessData.services;
  businessGallery.value = businessData.gallery;
});
</script>