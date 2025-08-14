<template>
  <SeoMeta :seoData="seoData" />

  <div class="relative w-full p-6 mx-auto lg:max-w-6xl font-body bg-background text-foreground md:p-10">
    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <p class="text-lg font-semibold">{{ loadingBusinessText }}</p>
      <div class="w-12 h-12 mt-4 border-b-2 rounded-full animate-spin border-primary"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[50vh] text-center text-red-500">
      <h2 class="text-2xl font-bold">{{ errorTitle }}</h2>
      <p class="mt-2">{{ error.message || errorText }}</p>
    </div>
    <!-- Business Content -->
    <template v-else-if="business">
      <SectionsNavigator :title="business?.name || loadingText" :sections="businessSections" ref="navRef">
        <!-- Social Links -->
        <template #button>
          <ContainersSocials v-if="isPremiumMember && socialLinks.length" :socialLinks="socialLinks"
            :columnOnMobile="true" />
        </template>

        <!-- Top -->
        <section id="intro" class="pb-12 scroll-mt-72">
          <div class="relative w-full mb-6 overflow-hidden h-96">
            <img v-if="!isPremiumMember"
              src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/restaurant-website-banner-design-template-9af8d62d2505f04d08f144bc0f2b1bf4_screen.jpg?ts=1652771082"
              :alt="`${business?.name} banner`" class="object-cover w-full h-full bg-center rounded-lg shadow-md" />
            <!-- Otherwise banner carousel -->
            <template v-else>
              <ContainersCarousel :slides="[
                'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/restaurant-website-banner-design-template-9af8d62d2505f04d08f144bc0f2b1bf4_screen.jpg?ts=1652771082',
                'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/restaurant-website-banner-design-template-9af8d62d2505f04d08f144bc0f2b1bf4_screen.jpg?ts=1652771082',
                'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/restaurant-website-banner-design-template-9af8d62d2505f04d08f144bc0f2b1bf4_screen.jpg?ts=1652771082',
                'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/restaurant-website-banner-design-template-9af8d62d2505f04d08f144bc0f2b1bf4_screen.jpg?ts=1652771082'

              ]" @selected-event="openModalWithImage" :breakpoints="{
                640: {
                  slidesPerView: 1.1,
                },
                768: {
                  slidesPerView: 1.1,
                },
                1024: {
                  slidesPerView: 1.1,
                },
              }" />

            </template>
          </div>
        </section>

        <!-- About -->
        <section id="contact" class="pt-6 pb-12 scroll-mt-40" ref="setSectionRef">
          <h2 class="mb-8 text-3xl font-bold sm:text-4xl font-heading text-primary">{{ aboutTitle }}</h2>
          <div class="flex flex-col gap-6 lg:flex-row">

            <!-- Info -->
            <Card class="p-6 space-y-4 lg:w-1/2">
              <p class="text-base leading-relaxed">{{ businessDescription }}</p>
              <p class="text-sm text-muted-foreground">{{ businessSlogan }}</p>

              <p v-if="business.address" class="mt-4 text-base font-semibold leading-relaxed">
                {{ addressLabel }} {{ formatAddress(business.address) }}
              </p>

              <div v-if="business.contact">
                <p v-if="business.contact.phone">
                  {{ phoneLabel }}
                  <a id="phone" :href="`tel:${business.contact.phone}`" class="text-blue-600 hover:underline">
                    {{ business.contact.phone }}
                  </a>
                  <!-- WhatsApp link -->
                  <a v-if="business.contact.phone"
                    :href="`https://wa.me/${formatPhoneForWhatsapp(business.contact.phone)}`" target="_blank"
                    rel="noopener noreferrer" class="ml-4 text-green-600 hover:underline" aria-label="Chat on WhatsApp">
                    WhatsApp
                  </a>
                </p>

                <p v-if="business.contact.email">
                  {{ emailLabel }}
                  <a :href="`mailto:${business.contact.email}`" class="text-blue-600 hover:underline">
                    {{ business.contact.email }}
                  </a>
                </p>

                <p v-if="business.contact.website">
                  {{ websiteLabel }}
                  <a :href="business.contact.website" target="_blank" class="text-blue-600 hover:underline">
                    {{ business.contact.website }}
                  </a>
                </p>
              </div>
            </Card>

            <!-- Map -->
            <Card v-if="mapSrc" class="relative w-full min-h-[400px] lg:w-1/2 overflow-hidden">
              <iframe class="absolute inset-0 w-full h-full" :src="mapSrc" style="border:0;" allowfullscreen
                loading="lazy"></iframe>
            </Card>
            <Card v-else
              class="relative flex items-center justify-center w-full min-h-[400px] lg:w-1/2 bg-gray-100 text-gray-500">
              {{ locationUnavailableText }}
            </Card>
          </div>
        </section>

        <!-- Ad Placeholder -->
        <div v-if="!isPremiumMember" class="flex items-center justify-center w-full h-40 bg-gray-200 rounded-lg">
          <span class="text-gray-600">[Advertisement]</span>
        </div>

        <!-- Services -->
        <section v-if="isPremiumMember && businessServices.length" id="services" class="py-12 scroll-mt-40"
          ref="setSectionRef">

          <h2 class="mb-8 text-3xl font-bold sm:text-4xl font-heading text-primary">{{ servicesTitle }}</h2>
          <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <li v-for="(service, i) in businessServices" :key="i">
              <Card class="flex flex-col h-full gap-4 p-6 sm:flex-row sm:items-start">
                <img :src="service.image" :alt="service.alt"
                  class="object-cover w-full h-40 rounded-lg shadow-sm sm:w-32 sm:h-32"
                  @error="replaceWithPlaceholder($event, 'Service')" />
                <div class="flex flex-col flex-grow">
                  <CardTitle class="text-lg font-bold sm:text-xl">{{ service.title }}</CardTitle>
                  <CardDescription class="text-sm leading-relaxed">{{ service.description }}</CardDescription>
                </div>
              </Card>
            </li>
          </ul>
        </section>

        <!-- Gallery -->
        <section v-if="isPremiumMember && businessGallery.length" id="gallery" class="py-12 scroll-mt-40"
          ref="setSectionRef">
          <h2 class="mb-8 text-3xl font-bold sm:text-4xl font-heading text-primary">{{ galleryTitle }}</h2>
          <ModalCarousel :slides="businessGallery" :collection-id="business?.collectionId" :propertyId="business?.id"
            @selected-event="openModalWithImage" />
          <Modal ref="modal">
            <Card class="relative flex flex-row items-center justify-between p-4 bg-background">
              <button @click="moveSlider('back')" class="left-0 gallery-nav-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div class="w-full min-h-[80vh] lg:aspect-video flex items-center justify-center">
                <img :src="selectedImage.url" :alt="selectedImage.alt"
                  class="object-contain max-w-full max-h-[80vh] rounded-lg shadow-lg" />
              </div>
              <button @click="moveSlider('next')" class="right-0 gallery-nav-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-auto transform rotate-180" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </Card>
          </Modal>
        </section>

        <section id="menu" class="pt-6 pb-12 scroll-mt-40" ref="setSectionRef">
          <Card
            class="relative flex flex-col items-center justify-center gap-4 p-8 overflow-hidden text-center shadow-lg bg-gradient-to-r from-primary/90 to-primary-foreground/90 rounded-2xl md:flex-row md:text-left">
            <!-- Left: Text -->
            <div class="z-10 flex flex-col items-center gap-2 md:items-start">
              <h2 class="text-2xl font-bold text-background drop-shadow-sm">
                {{ isSpanish.value ? "¡Descubre nuestro menú!" : "Discover Our Menu!" }}
              </h2>
              <p class="max-w-md text-background/90">
                {{ isSpanish.value
                  ? "Explora deliciosos platillos preparados con ingredientes frescos."
                  : "Explore delicious dishes made with fresh ingredients." }}
              </p>
              <NuxtLink :to="`${route.path}/menu`"
                class="px-5 py-2 mt-2 font-semibold transition-colors rounded-lg shadow text-primary bg-background hover:bg-background/90">
                {{ isSpanish.value ? "Ver Menú" : "View Menu" }}
              </NuxtLink>
            </div>

            <!-- Right: Image / Icon -->
            <div class="absolute inset-0 overflow-hidden opacity-20 md:static md:opacity-100 md:flex md:items-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxPPCzE7IDzDog-ufAkkokAWsxA0_DHk_KGw&s" alt="Menu preview"
                class="object-cover w-full h-full rounded-lg shadow-md md:w-48 md:h-48" />
            </div>
          </Card>
        </section>

      </SectionsNavigator>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import Modal from '~/components/sections/Modal.vue';
import ModalCarousel from "~/components/ui/modal/ModalCarousel.vue";
import useBusinesses from '~/composables/useBusiness';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-vue-next';
import { createSeoObject } from "~/composables/useSeo";

const route = useRoute();
const { fetchBusinessBySlug } = useBusinesses();
const business = ref<any>(null);
const loading = ref(true);
const error = ref<Error | null>(null);
const isSpanish = ref(false);

const routeId = computed(() => route.params.slug);

const businessDescription = computed(() =>
  isSpanish.value ? business.value?.description_Sp : business.value?.description_En
);

const businessSlogan = computed(() =>
  isSpanish.value ? '¡Ven a visitarnos!' : 'Come visit us!'
);

const businessCoverImageUrl = computed(() =>
  business.value?.cover_image?.url || null
);

const businessServices = computed(() =>
  business.value?.services?.map((s: any) => ({
    image: s.image?.url || placeholderUrl('Service'),
    title: isSpanish.value ? s.title_es : s.title_en,
    description: isSpanish.value ? s.description_es : s.description_en,
    alt: isSpanish.value ? s.image?.alt_es : s.image?.alt_en,
  })) || []
);

const businessGallery = computed(() =>
  business.value?.gallery?.map((g: any) => ({
    url: g.url || placeholderUrl('Image'),
    alt: isSpanish.value ? g.alt_es : g.alt_en,
  })) || []
);

const socialLinks = computed(() => {
  const iconMap = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
  };
  return (business.value?.socials || []).map((s: any) => ({
    icon: iconMap[s.platform.toLowerCase()] || Facebook,
    href: s.url,
  }));
});

const isPremiumMember = computed(() => business.value?.is_featured || false);

const zoom = 15;
const mapSrc = computed(() => {
  const loc = business.value?.location;
  return loc?.lat && loc?.lng
    ? `https://maps.google.com/maps?q=${loc.lat},${loc.lng}&z=${zoom}&t=k&output=embed`
    : '';
});

const businessSections = computed(() => {
  const sections = [];

  sections.push(
    { id: "intro", title: isSpanish.value ? "Introducción" : "Introduction" },
    { id: "contact", title: isSpanish.value ? "Contacto" : "Contact" },
  );

  if (isPremiumMember.value) {
    sections.push(
      { id: "services", title: isSpanish.value ? "Servicios" : "Services" },
      { id: "gallery", title: isSpanish.value ? "Galería" : "Gallery" },
      { id: "menu", title: isSpanish.value ? "Menú" : "Menu" }
    );
  }

  return sections;
});

// Text labels
const loadingText = computed(() => isSpanish.value ? 'Cargando...' : 'Loading...');
const loadingBusinessText = computed(() => isSpanish.value ? 'Cargando datos del negocio...' : 'Loading business data...');
const errorTitle = computed(() => isSpanish.value ? 'Error al cargar el negocio' : 'Error loading business');
const errorText = computed(() => isSpanish.value ? 'No se pudo cargar la información del negocio.' : 'Could not load business information.');
const aboutTitle = computed(() => isSpanish.value ? 'Sobre Nosotros' : 'About Us');
const addressLabel = computed(() => isSpanish.value ? 'Dirección:' : 'Address:');
const phoneLabel = computed(() => isSpanish.value ? 'Teléfono:' : 'Phone:');
const emailLabel = computed(() => isSpanish.value ? 'Correo:' : 'Email:');
const websiteLabel = computed(() => isSpanish.value ? 'Sitio Web:' : 'Website:');
const locationUnavailableText = computed(() => isSpanish.value ? 'Ubicación no disponible' : 'Location not available');
const servicesTitle = computed(() => isSpanish.value ? 'Servicios' : 'Services');
const galleryTitle = computed(() => isSpanish.value ? 'Galería' : 'Gallery');

function placeholderUrl(text: string) {
  return `https://placehold.co/400x300/F0F0F0/000000?text=${encodeURIComponent(text)}`;
}
function replaceWithPlaceholder(e: Event, text: string) {
  (e.target as HTMLImageElement).src = placeholderUrl(text);
}
function formatAddress(addr: any) {
  return [addr.street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(', ');
}
const formatPhoneForWhatsapp = (phone: string) => phone.replace(/\D/g, '');

// Gallery modal
const modal = ref<any>(null);
const selectedImageIndex = ref(0);
const selectedImage = computed(() => businessGallery.value[selectedImageIndex.value] || {});
function openModalWithImage(i: number) { selectedImageIndex.value = i; modal.value?.open(); }
function moveSlider(dir: 'back' | 'next') {
  const len = businessGallery.value.length;
  if (!len) return;
  selectedImageIndex.value = dir === 'next'
    ? (selectedImageIndex.value + 1) % len
    : (selectedImageIndex.value - 1 + len) % len;
}

const seoData = computed(() => {
  return createSeoObject({
    title: business.value?.name || '',
    summary: businessDescription.value || '',
    imageUri: businessCoverImageUrl.value || '',
    pubDate: business.value?.created_at || '',
    byline: business.value?.owner || '',
    siteName: 'San Carlos Insider',
    twitterSite: business.value?.socials?.find(link => link.platform === 'twitter')?.url || '',
    tags: business.value?.tags || [],
  });
});

onMounted(async () => {
  const slug = route.params.slug as string;
  if (!slug) {
    error.value = new Error(isSpanish.value ? 'Falta el slug del negocio en la URL.' : 'Business slug missing in URL.');
    loading.value = false;
    return;
  }
  try {
    business.value = await fetchBusinessBySlug(slug);

  } catch (err: any) {
    error.value = err;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.gallery-nav-btn {
  @apply text-gray-500 hover:text-gray-700 w-12 bottom-0 absolute top-0 min-h-[80vh] flex items-center justify-center;
}

.gallery-nav-btn.left-0 {
  @apply rounded-l-lg bg-background/5;
}

.gallery-nav-btn.right-0 {
  @apply rounded-r-lg;
}
</style>
