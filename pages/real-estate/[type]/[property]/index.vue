<template>
  <section class="container w-full max-w-6xl py-16 mx-auto">
    <h1 class="mb-12 !text-5xl font-bold capitalize">{{ formattedPropertyType[0] }}: {{ formattedPropertyType[1] ||
      'Property Details' }}</h1>
    <Card class="relative w-full mb-4 overflow-hidden rounded-lg md:h-full md:aspect-video">
      <div ref="heroRef">
        <VideoBackground :video="video" :observe-element="heroRef" @video-active="handleVideoComponentActive" />
      </div>
    </Card>

    <div class="flex flex-col gap-4 md:flex-row">
      <Card class="w-full p-8 mb-4 rounded-lg shadow-md md:w-1/2">
        <h2 class="mb-4 text-2xl font-semibold">Property Specifics</h2>

        <ul class="mt-4 text-gray-700">
          <li v-if="property?.price"><strong>Price:</strong> ${{ property.price.toLocaleString() }}</li>
          <li v-if="property?.address"><strong>Address:</strong> {{ property.address }}</li>
          <li v-if="property?.bedrooms"><strong>Bedrooms:</strong> {{ property.bedrooms }}</li>
          <li v-if="property?.bathrooms"><strong>Bathrooms:</strong> {{ property.bathrooms }}</li>
          <li v-if="property?.area"><strong>Area:</strong> {{ property.area }} sq ft</li>
          <li v-if="property?.lotSize"><strong>Lot Size:</strong> {{ property.lotSize }} acres</li>
          <li v-if="property?.amenities && property.amenities.length > 0">
            <strong>Amenities:</strong> {{ property.amenities.join(', ') }}
          </li>
        </ul>

        <div v-if="property?.type === 'rental' || property?.type === 'property'">
          <p v-if="property?.bedrooms">This is a {{ property.type }} with {{ property.bedrooms }} bedrooms and {{
            property.bathrooms }} bathrooms.</p>
          <p v-if="property?.area">Total area: {{ property.area }} sq ft.</p>
        </div>
        <div v-else-if="property?.type === 'lot'">
          <p v-if="property?.lotSize">This is a lot with {{ property.lotSize }} acres.</p>
        </div>
        <p class="mt-4 text-sm text-gray-500">
          More specific details will appear here based on the property's type.
        </p>
      </Card>
      <Card class="w-full min-h-[400px] mb-4 rounded-lg shadow-md md:w-1/2">

        <iframe class="object-cover w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.679763099767!2d-117.16370938476018!3d34.0535768806067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c32b6e037d3a51%3A0x6b1a1d9a7f0d9a1b!2sCalifornia%20State%20University%2C%20San%20Bernardino!5e0!3m2!1sen!2sus!4v1622568466628!5m2!1sen!2sus"
          style="border:0;" loading="lazy">
        </iframe>

      </Card>
    </div>
  </section>
</template>

<script lang="ts" setup>
import usePocketBaseCore from '@/composables/usePocketBaseCore'

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
const video = 'https://videos.pexels.com/video-files/28100367/12301150_2560_1440_30fps.mp4'


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

onMounted(async () => {
  fetchedProperty.value = await fetchPropertiesBySlug(formattedPropertyType.value?.[2]);
});

</script>