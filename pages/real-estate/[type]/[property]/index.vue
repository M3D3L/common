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

        <div class="grid grid-cols-1 text-gray-700 sm:grid-cols-2 gap-y-3 gap-x-6">
          <div v-if="property?.price">
            <p class="text-sm text-gray-500 uppercase">Price</p>
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
      <Card class="w-full min-h-[400px] mb-4 rounded-lg shadow-md md:w-1/2">

        <iframe class="object-cover w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.679763099767!2d-117.16370938476018!3d34.0535768806067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c32b6e037d3a51%3A0x6b1a1d9a7f0d9a1b!2sCalifornia%20State%20University%2C%20San%20Bernardino!5e0!3m2!1sen!2sus!4v1622568466628!5m2!1sen!2sus"
          style="border:0;" allowfullscreen="true" loading="lazy">
        </iframe>

      </Card>
    </div>

    <ContainersCarousel :slides @selected-event="openModalWithImage" />

    <Modal ref="modal">
      <Card class="relative flex flex-row items-center justify-between p-4">
        <button @click="moveSlider('back')" class="text-gray-500 hover:text-gray-700 w-12 bottom-0 absolute left-0 top-0 min-h-[80vh]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="w-full min-h-[80vh] lg:aspect-video">
          <img :src="selectedImage" class="object-contain w-full h-full" />
        </div>
        <button @click="moveSlider('back')" class="text-gray-500 hover:text-gray-700 w-12 bottom-0 absolute right-0 top-0 min-h-[80vh]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-auto transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </Card>
    </Modal>
  </section>
</template>

<script lang="ts" setup>
import usePocketBaseCore from '@/composables/usePocketBaseCore'
import Modal from '~/components/sections/Modal.vue';

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
  video?: string;
  gallery?: any[] | null;
}

const fetchedProperty = ref<Property[]>([]);
const heroRef = ref<HTMLElement | null>(null)
const isVideoComponentActive = ref(false)
const video = 'https://picsum.photos/200/300'

const slides = ref<Property[]>([
  {
    id: '1',
    title: 'Beautiful Family Home',
    type: 'home',
    address: '123 Main St, Springfield, USA',
    amenities: ['Pool', 'Garage', 'Garden'],
    area: 2500,
    bathrooms: 3,
    bedrooms: 4,
    lotSize: 0.5,
    price: 350000,
    cover_image: 'https://picsum.photos/200/300',
    slug: 'beautiful-family-home'
  },
  {
    id: '2',
    title: 'Modern Rental Apartment',
    type: 'rental',
    address: '456 Elm St, Springfield, USA',
    amenities: ['Gym', 'Balcony'],
    area: 1200,
    bathrooms: 2,
    bedrooms: 2,
    price: 1500,
    cover_image: 'https://picsum.photos/200/300',
    slug: 'modern-rental-apartment'
  },
  {
    id: '3',
    title: 'Spacious Lot for Sale',
    type: 'lot',
    address: '789 Oak St, Springfield, USA',
    lotSize: 1.5,
    price: 80000,
    cover_image: 'https://picsum.photos/200/301',
    slug: 'spacious-lot-for-sale'
  },
  {
    id: '4',
    title: 'Luxury Villa with Ocean View',
    type: 'home',
    address: '101 Beach Ave, Springfield, USA',
    amenities: ['Pool', 'Spa', 'Ocean View'],
    area: 4000,
    bathrooms: 5,
    bedrooms: 6,
    lotSize: 1.0,
    price: 1200000,
    cover_image: 'https://picsum.photos/200/302',
    slug: 'luxury-villa-with-ocean-view'
  },
  {
    id: '5',
    title: 'Cozy Cottage in the Woods',
    type: 'home',
    address: '202 Pine St, Springfield, USA',
    amenities: ['Fireplace', 'Garden'],
    area: 1500,
    bathrooms: 2,
    bedrooms: 3,
    lotSize: 0.75,
    price: 250000,
    cover_image: 'https://picsum.photos/200/303',
    slug: 'cozy-cottage-in-the-woods'
  },
]);




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
    const res = await fetchCollection('properties', 1, 6, `slug="${slug}"`, '-created', '', ['content'])
    console.log('Fetched property:', res);
    return res || null;
  } catch (error) {
    console.error(`Error fetching ${slug}:`, error)
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
});

</script>