<template>
  <div class="container w-full py-16 mx-auto">
    <h1 class="mb-12 !text-5xl font-bold capitalize">{{ formattedPropertyType[0] }}: {{ formattedPropertyType[1] || 'Property Details' }}</h1>
    <Card class="min-h-[400px] w-full rounded-lg p-8 mb-4">
      <h2 class="mb-4 text-2xl font-semibold">Overview</h2>
      <p class="text-lg">{{ property?.description || 'No description available for this property.' }}</p>
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
          <p v-if="property?.bedrooms">This is a {{ property.type }} with {{ property.bedrooms }} bedrooms and {{ property.bathrooms }} bathrooms.</p>
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
        <div class="min-h-[300px] flex items-center justify-center rounded-md">
          Map goes here (placeholder for map component).
        </div>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import usePocketBaseCore from '@/composables/usePocketBaseCore'

const { fetchCollection } = usePocketBaseCore()
// Define the shape of your property object based on the provided structure
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

  // Existing PocketBase metadata fields (optional for UI purposes unless displayed)
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