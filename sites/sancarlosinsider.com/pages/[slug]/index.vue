<template>
  <SeoMeta :seoData="seoData" />

  <div class="container relative w-full py-10 md:py-16 font-body bg-background text-foreground">
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <p class="text-lg font-semibold">{{ loadingBusinessText }}</p>
      <div class="w-12 h-12 mt-4 border-b-2 rounded-full animate-spin border-primary"></div>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[50vh] text-center text-red-500">
      <h2 class="text-2xl font-bold">{{ errorTitle }}</h2>
      <p class="mt-2">{{ error.message || errorText }}</p>
    </div>

    <template v-else-if="business">
      <div class="container flex flex-row justify-between gap-4 mt-16 mb-6 md:items-center">
        <TitleBlock class="mb-6" :title="business.name" :description="isSpanish ? business.description_ES : business.description_En
          " />

        <!-- Social Links -->
        <ContainersSocialsIcons v-if="business.socials.length && business?.is_featured" :socials="business.socials"
          :columnOnMobile="true" />
      </div>

      <button @click="isSpanish = !isSpanish"
        class="fixed flex flex-col items-center content-center gap-2 right-4 bottom-4">
        <img :src="isSpanish
            ? '/images/countries/USA.png'
            : '/images/countries/Mexico.png'
          " alt="Country Flag" class="w-10 h-10" />
        {{ isSpanish ? "English" : "Español" }}
      </button>

      <section id="hero" class="relative w-full h-[40vh] lg:h-[60vh] container overflow-hidden scroll-mt-72">
        <ModalCarousel v-if="business?.promoGallery" :slides="business?.promoGallery"
          :collection-id="business?.collectionId" :propertyId="business?.id" @selected-event="openModalWithImage"
          :aspectRatio="'aspect-video'" :breakpoints="{
            640: { slidesPerView: 1.1 },
            768: { slidesPerView: 1.1 },
            1024: { slidesPerView: 1.1 },
          }" />
      </section>

      <div class="container mx-auto font-body lg:flex lg:gap-8 lg:pt-16">
        <aside class="self-start mb-10 space-y-6 lg:w-1/3 lg:sticky lg:top-8 lg:mb-0">
          <Card id="contact" class="p-6 space-y-4 shadow-lg scroll-mt-20" ref="setSectionRef">
            <h2 class="text-xl font-bold font-heading text-primary">
              {{ contactTitle }}
            </h2>
            <p class="text-sm italic text-muted-foreground">
              {{ businessSlogan }}
            </p>

            <div v-if="business.address" class="pt-2">
              <p class="font-semibold text-foreground">{{ addressLabel }}</p>
              <p class="text-sm text-muted-foreground">
                {{ formatAddress(business.address) }}
              </p>
            </div>

            <div v-if="business.contact?.phone">
              <p class="font-semibold text-foreground">{{ phoneLabel }}</p>
              <div class="flex items-center gap-2">
                <a :href="`tel:${business.contact.phone}`" class="text-blue-600 hover:text-blue-700 hover:underline">
                  {{ business.contact.phone }}
                </a>
                <a :href="`https://wa.me/${formatPhoneForWhatsapp(
                  business.contact.phone
                )}`" target="_blank" rel="noopener noreferrer"
                  class="flex items-center justify-center w-8 h-8 text-white transition-colors bg-green-500 rounded-full hover:bg-green-600"
                  aria-label="Chat on WhatsApp">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                      d="M12 0C5.373 0 0 5.373 0 12c0 3.535 1.442 6.75 3.77 9.06l-.75 2.76 2.87-.75c2.31 1.25 4.96 1.95 7.09 1.95 6.627 0 12-5.373 12-12S18.627 0 12 0zm5.176 15.658c-.146.243-.75.54-.925.748-.175.208-.344.225-.632.075-.288-.15-.992-.37-1.89-1.162-.647-.565-1.076-1.265-1.206-1.465-.13-.2-.105-.375-.034-.52.071-.145.176-.38.35-.555.175-.175.26-.302.35-.502.09-.2.045-.375-.018-.502-.063-.127-.585-1.397-.8-1.928-.215-.53-.438-.456-.632-.456-.192 0-.41.015-.632.015-.222 0-.585.075-.895.45-.31.375-1.18 1.15-1.18 2.812 0 1.662 1.21 3.268 1.385 3.518.175.25 2.373 3.633 5.768 5.045 3.395 1.412 3.395.955 4.015.918.62-.038 1.69-.693 1.93-1.365.24-.672.24-1.248.165-1.36-.075-.112-.276-.177-.585-.327z" />
                  </svg>
                </a>
              </div>
            </div>

            <div v-if="business.contact?.email">
              <p class="font-semibold text-foreground">{{ emailLabel }}</p>
              <a :href="`mailto:${business.contact.email}`" class="text-sm text-blue-600 hover:underline">
                {{ business.contact.email }}
              </a>
            </div>
            <div v-if="business.contact?.website">
              <p class="font-semibold text-foreground">{{ websiteLabel }}</p>
              <a :href="business.contact.website" target="_blank" class="text-sm text-blue-600 hover:underline">
                {{ business.contact.website }}
              </a>
            </div>

            <div v-if="business.hours_of_operation" class="pt-4">
              <h3 class="font-semibold text-foreground">{{ hoursTitle }}</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li v-for="(hours, day) in business.hours_of_operation" :key="day"
                  :class="{ 'font-bold text-green-600': isCurrentDay(day) }" class="flex justify-between">
                  <span>{{ formatDay(day) }}:</span>
                  <span v-if="hours === 'Closed'" class="text-red-500">{{
                    closedLabel
                    }}</span>
                  <span v-else>{{ hours }}</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card v-if="mapSrc" class="relative w-full h-[300px] overflow-hidden shadow-lg">
            <iframe class="absolute inset-0 w-full h-full" :src="mapSrc" style="border: 0" allowfullscreen
              loading="lazy"></iframe>
          </Card>
          <Card v-else
            class="relative flex items-center justify-center w-full h-[300px] bg-gray-100 text-gray-500 shadow-lg">
            {{ locationUnavailableText }}
          </Card>
        </aside>

        <main class="space-y-12 lg:w-2/3">
          <div v-if="!isPremiumMember"
            class="flex items-center justify-center w-full h-32 bg-gray-200 rounded-lg shadow-inner">
            <span class="text-lg font-semibold text-gray-600">[Advertisement Placeholder]</span>
          </div>

          <section v-if="isPremiumMember && businessServices.length" id="services" class="scroll-mt-20"
            ref="setSectionRef">
            <h2 class="pb-2 mb-6 text-2xl font-bold border-b sm:text-3xl font-heading text-primary">
              {{ servicesTitle }}
            </h2>
            <ul class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <li v-for="(service, i) in businessServices" :key="i">
                <Card class="flex h-full p-4 overflow-hidden transition-all duration-300 hover:shadow-xl group">
                  <div class="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                    <img :src="service.image" :alt="service.alt"
                      class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      @error="replaceWithPlaceholder($event, 'Service')" />
                  </div>
                  <div class="flex flex-col flex-grow ml-4">
                    <CardTitle class="text-lg font-bold text-primary">{{
                      service.title
                      }}</CardTitle>
                    <CardDescription class="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {{ service.description }}
                    </CardDescription>
                  </div>
                </Card>
              </li>
            </ul>
          </section>

          <section v-if="isPremiumMember && businessGallery.length" id="gallery" class="scroll-mt-20"
            ref="setSectionRef">
            <h2 class="pb-2 mb-6 text-2xl font-bold border-b sm:text-3xl font-heading text-primary">
              {{ galleryTitle }}
            </h2>
            <ModalCarousel v-if="business?.gallery?.length" :slides="business.gallery"
              :collection-id="business?.collectionId" :propertyId="business?.id" @selected-event="openModalWithImage"
              :aspectRatio="'aspect-video'" />
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

          <section id="menu" class="scroll-mt-20" ref="setSectionRef">
            <Card
              class="relative flex flex-col items-center justify-between gap-8 p-8 overflow-hidden md:flex-row">
              <!-- Text content -->
              <div class="z-10 flex flex-col items-center space-y-3 text-center md:items-start md:text-left">
                <h2 class="text-3xl font-extrabold tracking-tight">
                  {{ isSpanish ? "¡Descubre Nuestro Menú!" : "Discover Our Menu!" }}
                </h2>

                <p class="max-w-md text-muted-foreground">
                  {{
                    isSpanish
                      ? "Explora deliciosos platillos de mariscos frescos y tradicionales mexicanos."
                      : "Explore delicious seafood dishes made with fresh, local ingredients."
                  }}
                </p>

                <NuxtLink :to="`${route.path.endsWith('/') ? route.path : `${route.path}/`}menu`">
                  <Button class="mt-2">
                    {{ isSpanish ? "Ver Menú Completo" : "View Full Menu" }}
                  </Button>
                </NuxtLink>
              </div>

              <!-- Icon or background graphic -->
              <div class="relative flex items-center justify-center w-full md:w-auto opacity-20 md:opacity-100">
                <MenuSquare class="w-48 h-48 text-primary/70" />
              </div>

              <!-- Decorative gradient overlay -->
              <div class="absolute inset-0 pointer-events-none bg-gradient-to-tr from-primary/5 to-transparent" />
            </Card>
          </section>

        </main>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Card, CardTitle, CardDescription } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import Modal from "@common/components/sections/Modal.vue";
import ModalCarousel from "@common/components/ui/modal/ModalCarousel.vue";
// Composables
import useBusinesses from "@common/composables/useBusiness";
import { Facebook, Instagram, Twitter, Linkedin, MenuSquare } from "lucide-vue-next";
import {
  TwitterLogoIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  InstagramLogoIcon,
} from "@radix-icons/vue";

const route = useRoute();
const { fetchBusinessBySlug } = useBusinesses();
const business = ref<any>(null);
const loading = ref(true);
const error = ref<Error | null>(null);
const isSpanish = ref(false); // Language state

const businessDescription = computed(() =>
  isSpanish.value
    ? business.value?.description_Sp
    : business.value?.description_En
);

const businessSlogan = computed(() =>
  isSpanish.value
    ? "¡El mejor sabor y vista al mar en San Carlos!"
    : "The best flavor and ocean view in San Carlos!"
);

const businessServices = computed(
  () =>
    business.value?.services
      ?.map((s: any) => ({
        // Use proper nested image URL if available
        image: s.image?.url || s.image || placeholderUrl("Service"),
        title: isSpanish.value ? s.title_es || s.title : s.title_en || s.title,
        description: isSpanish.value
          ? s.description_es || s.description
          : s.description_en || s.description,
        alt: isSpanish.value ? s.image?.alt_es : s.image?.alt_en,
      }))
      .filter((s: any) => s.title) || [] // Filter out empty services
);

const businessGallery = computed(
  () =>
    business.value?.gallery?.map((g: any) => ({
      url: g.url || placeholderUrl("Image"),
      alt: isSpanish.value ? g.alt_es : g.alt_en,
    })) || []
);

const iconMap: Record<string, any> = {
  instagram: InstagramLogoIcon,
  twitter: TwitterLogoIcon,
  linkedin: LinkedinLogoIcon,
  github: GithubLogoIcon,
};

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
  // Ensure we are using the correct URL for Google Maps embedding
  return loc?.lat && loc?.lng
    ? `https://maps.google.com/maps?q=${loc.lat},${loc.lng}&z=${zoom}&t=k&output=embed`
    : "";
});

// Text labels
const loadingText = computed(() =>
  isSpanish.value ? "Cargando..." : "Loading..."
);
const loadingBusinessText = computed(() =>
  isSpanish.value ? "Cargando datos del negocio..." : "Loading business data..."
);
const errorTitle = computed(() =>
  isSpanish.value ? "Error al cargar el negocio" : "Error loading business"
);
const errorText = computed(() =>
  isSpanish.value
    ? "No se pudo cargar la información del negocio."
    : "Could not load business information."
);
const contactTitle = computed(() =>
  isSpanish.value ? "Información de Contacto" : "Contact Information"
);
const hoursTitle = computed(() =>
  isSpanish.value ? "Horario de Operación" : "Hours of Operation"
);
const closedLabel = computed(() => (isSpanish.value ? "Cerrado" : "Closed"));
const addressLabel = computed(() =>
  isSpanish.value ? "Dirección:" : "Address:"
);
const phoneLabel = computed(() => (isSpanish.value ? "Teléfono:" : "Phone:"));
const emailLabel = computed(() => (isSpanish.value ? "Correo:" : "Email:"));
const websiteLabel = computed(() =>
  isSpanish.value ? "Sitio Web:" : "Website:"
);
const locationUnavailableText = computed(() =>
  isSpanish.value ? "Ubicación no disponible" : "Location not available"
);
const servicesTitle = computed(() =>
  isSpanish.value ? "Servicios Destacados" : "Featured Services"
);
const galleryTitle = computed(() => (isSpanish.value ? "Galería" : "Gallery"));
const socialTitle = computed(() =>
  isSpanish.value ? "Redes Sociales" : "Social Media"
);

function placeholderUrl(text: string) {
  return `https://placehold.co/400x300/F0F0F0/000000?text=${encodeURIComponent(
    text
  )}`;
}
function replaceWithPlaceholder(e: Event, text: string) {
  (e.target as HTMLImageElement).src = placeholderUrl(text);
}
function formatAddress(addr: any) {
  return [addr.street, addr.city, addr.state, addr.zip, addr.country]
    .filter(Boolean)
    .join(", ");
}
const formatPhoneForWhatsapp = (phone: string) => phone.replace(/\D/g, "");

// Utility functions for Hours of Operation
function formatDay(day: string) {
  if (isSpanish.value) {
    const daysEs: { [key: string]: string } = {
      Monday: "Lunes",
      Tuesday: "Martes",
      Wednesday: "Miércoles",
      Thursday: "Jueves",
      Friday: "Viernes",
      Saturday: "Sábado",
      Sunday: "Domingo",
    };
    return daysEs[day] || day;
  }
  return day;
}

function isCurrentDay(day: string) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return today === day;
}

// Gallery modal
const modal = ref<any>(null);
const selectedImageIndex = ref(0);
const selectedImage = computed(
  () => businessGallery.value[selectedImageIndex.value] || {}
);
function openModalWithImage(i: number) {
  selectedImageIndex.value = i;
  modal.value?.open();
}
function moveSlider(dir: "back" | "next") {
  const len = businessGallery.value.length;
  if (!len) return;
  selectedImageIndex.value =
    dir === "next"
      ? (selectedImageIndex.value + 1) % len
      : (selectedImageIndex.value - 1 + len) % len;
}

const mappedSocials = computed(() => {
  const socials = business.value?.socials || [];
  return socials.map((s: { platform: string; url: string }) => ({
    href: s.url,
    icon: iconMap[s.platform.toLowerCase()] || GithubLogoIcon,
  }));
});

const seoData = computed(() => {
  return {
    title: business.value?.name || "Loading Business",
    summary:
      businessDescription.value || "Check out this great local business!",
    imageUri: business.value?.logo || "",
    pubDate: business.value?.created || "",
    siteName: "San Carlos Insider",
  };
});

onMounted(async () => {
  const slug = route.params.slug as string;
  if (!slug) {
    error.value = new Error(
      isSpanish.value
        ? "Falta el slug del negocio en la URL."
        : "Business slug missing in URL."
    );
    loading.value = false;
    return;
  }
  try {
    business.value = await fetchBusinessBySlug(slug);
    if (!business.value) {
      error.value = new Error(
        isSpanish.value ? "Negocio no encontrado." : "Business not found."
      );
    }
  } catch (err: any) {
    error.value = err;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Styles for the Gallery Modal Navigation */
.gallery-nav-btn {
  @apply text-white/80 hover:text-white transition-colors w-12 bottom-0 absolute top-0 min-h-[80vh] flex items-center justify-center z-20;
  backdrop-filter: blur(1px);
  background: rgba(0, 0, 0, 0.2);
}

.gallery-nav-btn.left-0 {
  @apply rounded-l-lg;
}

.gallery-nav-btn.right-0 {
  @apply rounded-r-lg;
}

/* New style for sticky sidebar on large screens */
@media (min-width: 1024px) {
  .lg\:sticky {
    position: sticky;
  }
}
</style>
