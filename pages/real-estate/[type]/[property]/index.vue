<template>
  <div
    class="relative w-full p-6 mx-auto lg:max-w-6xl font-body bg-background text-foreground md:p-10"
  >
    <SectionsNavigator
      :title="property?.title"
      :description="property?.description"
      :sections="[
        { id: 'video', title: 'Video' },
        { id: 'details', title: 'Details' },
        { id: 'gallery', title: 'Gallery' }
      ]"
      ref="navRef"
    >
      <!-- Video Walkthrough Section -->
      <section id="video" class="w-full" aria-labelledby="video-heading">
        <h2 id="walkthrough-heading" class="sr-only">Video Walkthrough</h2>
        <h2 class="pt-8 pb-8 mb-8 text-3xl font-semibold border-b border-gray-300">
          Video
        </h2>
        <Card
          class="relative w-full h-full min-h-[75vh] mb-4 overflow-hidden rounded-lg lg:aspect-video"
          role="region"
          aria-label="Property Video Walkthrough"
        >
          <div ref="heroRef">
            <VideoBackground
              :video="video"
              :observe-element="heroRef"
              @video-active="handleVideoComponentActive"
            />
          </div>
        </Card>
      </section>

      <!-- Property Details Section -->
      <section id="details" class="w-full scroll-mt-24" aria-labelledby="details-heading">
        <h2 id="details-heading" class="pt-16 pb-8 text-3xl font-semibold border-b border-gray-300">
          Property Overview
        </h2>

        <div class="flex flex-col gap-6 mt-10 mb-6 md:flex-row">
          <!-- Property Specifics Card -->
          <Card class="w-full p-8 rounded-lg shadow-md md:w-1/2">
            <h3 class="pb-2 mb-6 text-2xl font-semibold border-b border-gray-300">Property Specifics</h3>

            <dl class="grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2 text-foreground">
              <template v-if="property?.price">
                <dt class="text-sm text-gray-500 uppercase">Price</dt>
                <dd class="text-lg font-bold">${{ property.price.toLocaleString() }}</dd>
              </template>

              <template v-if="property?.address">
                <dt class="text-sm text-gray-500 uppercase">Address</dt>
                <dd class="text-lg">{{ property.address }}</dd>
              </template>

              <template v-if="property?.bedrooms">
                <dt class="text-sm text-gray-500 uppercase">Bedrooms</dt>
                <dd class="text-lg">{{ property.bedrooms }}</dd>
              </template>

              <template v-if="property?.bathrooms">
                <dt class="text-sm text-gray-500 uppercase">Bathrooms</dt>
                <dd class="text-lg">{{ property.bathrooms }}</dd>
              </template>

              <template v-if="property?.area">
                <dt class="text-sm text-gray-500 uppercase">Area</dt>
                <dd class="text-lg">{{ property.area }} sq ft</dd>
              </template>

              <template v-if="property?.lotSize">
                <dt class="text-sm text-gray-500 uppercase">Lot Size</dt>
                <dd class="text-lg">{{ property.lotSize }} acres</dd>
              </template>

              <template v-if="property?.amenities?.length">
                <dt class="text-sm text-gray-500 uppercase col-span-full">Amenities</dt>
                <dd class="text-lg col-span-full">{{ property.amenities.join(', ') }}</dd>
              </template>
            </dl>

            <div class="pt-6 mt-8 border-t border-gray-300">
              <p v-if="property?.type === 'rental' || property?.type === 'property'" class="leading-relaxed text-gray-700">
                This is a <b>{{ property.type }}</b> with <b>{{ property.bedrooms }}</b> bedrooms and
                <b>{{ property.bathrooms }}</b> bathrooms. Total area: <b>{{ property.area }}</b> sq ft.
              </p>
              <p v-else-if="property?.type === 'lot'" class="leading-relaxed text-gray-700">
                This is a <b>lot</b> with <b>{{ property.lotSize }}</b> acres.
              </p>
              <p class="mt-4 text-sm italic text-gray-500">
                More specific details will appear here based on the property's type.
              </p>
            </div>
          </Card>

          <!-- Map Card -->
          <Card
            class="relative w-full min-h-[300px] rounded-lg shadow-md md:w-1/2 scroll-mt-40"
            role="region"
            aria-label="Property Location Map"
          >
            <iframe
              class="absolute inset-0 w-full h-full rounded-lg"
              :src="mapSrc"
              style="border:0;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Map showing the property location"
            ></iframe>
          </Card>
        </div>
      </section>

      <!-- Gallery Section -->
      <section id="gallery" class="w-full scroll-mt-24" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" class="sr-only">Gallery</h2>
        <h2 class="pt-16 pb-8 text-3xl font-semibold border-b border-gray-300">
          Gallery
        </h2>
        <ModalCarousel class="mt-10"
          :slides="slides"
          :pocketbaseUrl="config.public.pocketbaseUrl"
          :collectionId="fetchedProperty?.items?.[0]?.collectionId"
          :propertyId="fetchedProperty?.items?.[0]?.id"
        />
      </section>
    </SectionsNavigator>
  </div>
</template>

<script lang="ts" setup>
import usePocketBaseCore from '@/composables/usePocketBaseCore'
import ModalCarousel from '~/components/ui/modal/ModalCarousel.vue'

const config = useRuntimeConfig()
const { fetchCollection } = usePocketBaseCore()

interface Property {
  id: string
  title: string
  description?: string
  type: 'home' | 'rental' | 'lot'
  address?: string
  amenities?: string[] | null
  area?: number
  bathrooms?: number
  bedrooms?: number
  lotSize?: number
  price?: number
  gallery?: any[] | null
  lat: string
  lng: string
}

const fetchedProperty = ref<any>(null)
const fetchedProperties = ref<any>(null)
const slides = ref<any[]>([])
const heroRef = ref<HTMLElement | null>(null)
const video = 'https://videos.pexels.com/video-files/3410663/3410663-uhd_2562_1440_30fps.mp4'

const lat = 27.9513
const lng = -111.025
const zoom = 14
const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`

const route = useRoute()

const formattedPropertyType = computed(() => {
  let type = route.params.type as string
  let property = route.params.property as string
  const slug = `/${type}/${property}`

  if (type === 'rentals') type = 'rental'
  else if (type === 'properties') type = 'property'
  else if (type === 'lots') type = 'lot'

  if (property) {
    property = property.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
  }

  return [type, property, slug]
})

const property = computed(() => fetchedProperty.value?.items?.[0] || {})

const fetchPropertiesBySlug = async (slug: string) => {
  return await fetchCollection('properties', 1, 1, `slug="${slug}"`, '-created', '', ['content'])
}

const fetchPropertiesByType = async (type: string) => {
  return await fetchCollection('properties', 1, 6, `type="${type}"`, '-created', '', ['content'])
}

onMounted(async () => {
  fetchedProperty.value = await fetchPropertiesBySlug(formattedPropertyType.value?.[2])
  fetchedProperties.value = await fetchPropertiesByType(formattedPropertyType.value?.[0])
  slides.value = property.value?.gallery || []
})
</script>
