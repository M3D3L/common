<template>
  <section class="container w-full max-w-6xl py-16 mx-auto">
    <h1 class="mb-12 !text-5xl font-bold capitalize">{{ formattedPropertyType[0] }}: {{ formattedPropertyType[1] ||
      'Property Details' }}</h1>
    <Card class="relative w-full mb-4 overflow-hidden rounded-lg md:h-full md:aspect-video">
      <div ref="heroRef">
        <VideoBackground :video="video" :observe-element="heroRef" @video-active="handleVideoComponentActive" />
      </div>
    </Card>

    <div class="flex flex-col gap-4 mb-1 md:flex-row">
      <Card class="w-full p-8 mb-4 rounded-lg shadow-md md:w-1/2">
        <h2 class="pb-6 mb-6 text-3xl font-semibold border-b">Property Specifics</h2>

        <div class="grid grid-cols-1 text-foreground sm:grid-cols-2 gap-y-3 gap-x-6">
          <div v-if="property?.price">
            <p class="text-sm uppercase text-foreground">Price</p>
            <p class="text-lg font-bold">${{ property.price.toLocaleString() }}</p>
          </div>
          <div v-if="property?.address">
            <p class="text-sm text-gray-500 uppercase">Address</p>
            <p class="text-lg">{{ property.address }}</p>
          </div>
          <div v-if="property?.bedrooms">
            <p class="text-sm text-gray-500 uppercase">Bedrooms</p>
            <p class="text-lg">{{ property.bedrooms }}</p>
          </div>
          <div v-if="property?.bathrooms">
            <p class="text-sm text-gray-500 uppercase">Bathrooms</p>
            <p class="text-lg">{{ property.bathrooms }}</p>
          </div>
          <div v-if="property?.area">
            <p class="text-sm text-gray-500 uppercase">Area</p>
            <p class="text-lg">{{ property.area }} sq ft</p>
          </div>
          <div v-if="property?.lotSize">
            <p class="text-sm text-gray-500 uppercase">Lot Size</p>
            <p class="text-lg">{{ property.lotSize }} acres</p>
          </div>
          <div v-if="property?.amenities && property.amenities.length > 0" class="col-span-full">
            <p class="text-sm text-gray-500 uppercase">Amenities</p>
            <p class="text-lg">{{ property.amenities.join(', ') }}</p>
          </div>
        </div>

        <div class="pt-6 mt-8 border-t">
          <p v-if="property?.type === 'rental' || property?.type === 'property'" class="leading-relaxed text-gray-700">
            This is a **{{ property.type }}** with **{{ property.bedrooms }}** bedrooms and **{{
              property.bathrooms }}** bathrooms. Total area: **{{ property.area }}** sq ft.
          </p>
          <p v-else-if="property?.type === 'lot'" class="leading-relaxed text-gray-700">
            This is a **lot** with **{{ property.lotSize }}** acres.
          </p>
          <p class="mt-4 text-sm italic text-gray-500">
            More specific details will appear here based on the property's type.
          </p>
        </div>
      </Card>
      <Card class="relative w-full min-h-[400px] mb-4 rounded-lg shadow-md md:w-1/2">
        <iframe class="absolute inset-0 w-full h-full" :src="mapSrc" style="border:0;" allowfullscreen loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </Card>
    </div>
    <pre>
      {{ property.gallery }}
    </pre>
    <ContainersCarousel :slides="property.gallery" @selected-event="openModalWithImage" />

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


    <TextSectionTitle class="container pt-20 pb-16 pl-0 capitalize"
      :title="`Explore More ${formattedPropertyType[0]} Listings`"
      :description="`Browse the latest real estate listings, prices, and availability for ${formattedPropertyType[0]} in ${route.path.split('/')?.[2].replace('-', ' ')}`"
      :h1="false" />
    <div class="relative flex flex-col gap-8 mb-16 lg:flex-row">
      <div class="grid w-full gap-8 md:grid-cols-2 lg:w-2/3">
        <!-- Display properties for each category -->
        <template v-for="(item, itemIndex) in fetchedProperties?.items" :key="itemIndex">
          <CardsBaseCard v-if="item" :key="itemIndex" baseUrl="/property" :removeSpacing="true" :content="item"
            :buttonText="`View`" />
        </template>
      </div>

      <div class="w-full lg:w-1/3">
        <CardsInfoCard :title="infocard?.sectionTitle" :footerText="'footerText'" :subtitle="infocard?.sectionTitle"
          :benefits="infocard?.benifits" :dataArray class="sticky z-10 top-28" :mode="'rental'" />
      </div>


    </div>

  </section>
</template>

<script lang="ts" setup>
import usePocketBaseCore from '@/composables/usePocketBaseCore'
import Modal from '~/components/sections/Modal.vue';
import { categories } from '~/assets/configs/cards/real-estate'

const { fetchCollection } = usePocketBaseCore()
interface Property {
  id: string;
  title: string;
  description?: string;
  type: 'home' | 'rental' | 'lot';
  address?: string;
  amenities?: string[] | null;
  area?: number;
  bathrooms?: number;
  bedrooms?: number;
  lotSize?: number;
  price?: number;
  author?: string;
  collectionId?: string;
  collectionName?: string;
  cover_image?: string;
  created?: string;
  slug?: string;
  sub_title?: string;
  tags?: string[] | null;
  updated?: string;
  gallery?: any[] | null;
  lat: string;
  lng: string;
}

const fetchedProperty = ref<Property[]>([]);
const fetchedProperties = ref<Property[]>([]);
const heroRef = ref<HTMLElement | null>(null)
const isVideoComponentActive = ref(false)
const video = 'https://videos.pexels.com/video-files/3410663/3410663-uhd_2562_1440_30fps.mp4'
const dataArray = ref<Property[][]>([]);

const baseUrl = '/property';

const lat = 27.9513
const lng = -111.025
const zoom = 14

const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`


const infocard = computed(() => {
  return categories.filter(x => x.mode === formattedPropertyType.value?.[0])?.[0] || {};
});

// Utils
const route = useRoute();

// Use a computed property to format the property type for display
const formattedPropertyType = computed(() => {
  let type = route.params.type as string;
  let property = route.params.property as string;
  const slug = `/${type}/${property}`;

  if (type === 'rentals') {
    type = 'rental';
  } else if (type === 'properties') {
    type = 'property';
  } else if (type === 'lots') {
    type = 'lot';
  }
  // Format the property name to be more readable
  if (property) {
    property = property.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  return [type, property, slug]
});

const property = computed(() => {
  return fetchedProperty.value?.items?.[0] || {};
});

const handleVideoComponentActive = (isActive: boolean) => {
  isVideoComponentActive.value = isActive
}


const fetchPropertiesBySlug = async (slug: string) => {
  try {
    console.log(`Fetching property with slug: ${slug}`);
    const res = await fetchCollection('properties', 1, 1, `slug="${slug}"`, '-created', '', ['content'])
    console.log('Fetched property:', res);
    return res || null;
  } catch (error) {
    console.error(`Error fetching ${slug}:`, error)
  }
}

const fetchPropertiesByType = async (type: string) => {
  try {
    console.log(`Fetching properties of type: ${type}`);
    const res = await fetchCollection('properties', 1, 6, `type="${type}"`, '-created', '', ['content'])
    console.log('Fetched properties:', res);
    return res || null;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error)
  }
}



const modal = ref();
const selectedImage = ref('');

const openModalWithImage = (index: number) => {
  selectedImage.value = slides.value[index]?.cover_image || '';
  if (modal.value) {
    modal.value.openModal();
  }
};

const moveSlider = (direction: 'back' | 'forward') => {
  if (modal.value) {
    const currentIndex = slides.value.findIndex(slide => slide.cover_image === selectedImage.value);
    let newIndex = direction === 'back' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0) newIndex = slides.value.length - 1;
    if (newIndex >= slides.value.length) newIndex = 0;

    selectedImage.value = slides.value[newIndex]?.cover_image || '';
  }
};

onMounted(async () => {
  fetchedProperty.value = await fetchPropertiesBySlug(formattedPropertyType.value?.[2]);
  fetchedProperties.value = await fetchPropertiesByType(formattedPropertyType.value?.[0]);
});

</script>