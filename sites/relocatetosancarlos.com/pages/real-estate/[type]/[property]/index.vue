<template>
  <div
    class="container relative w-full p-6 font-body bg-background text-foreground md:py-10"
  >
    <SectionsNavigator
      :title="property?.title"
      :description="property?.description"
      :sections="[
        { id: 'video', title: 'Video' },
        { id: 'gallery', title: 'Gallery' },
        { id: 'details', title: 'Details' },
        { id: 'realtor', title: 'Realtor' }
      ]"
      ref="navRef"
    >
      <section id="video" class="w-full" aria-labelledby="video-heading aspect-video">
        <Card
          class="relative w-full h-full mb-4 overflow-hidden rounded-lg aspect-video"
          role="region"
          aria-label="Property Video Walkthrough"
        >
          <div class="aspect-video" ref="heroRef">
            <VideoBackground
              class="aspect-video"
              :video="video"
              :observe-element="heroRef"
              @video-active="handleVideoComponentActive"
            />
          </div>
        </Card>
      </section>

      <section id="gallery" class="w-full scroll-mt-24" aria-labelledby="gallery-heading">
        <ModalCarousel class="mt-10"
          :slides="slides"
          :collectionId="fetchedProperty?.items?.[0]?.collectionId"
          :propertyId="fetchedProperty?.items?.[0]?.id"
        />
      </section>

      <section id="details" class="w-full scroll-mt-24" aria-labelledby="details-heading">
        <div class="flex flex-col gap-6 mt-10 mb-6 md:flex-row">
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

      <section id="realtor" class="py-12 scroll-mt-40" ref="setSectionRef">
          <pre>
            {{ property?.author }}
          </pre>
          <h2 class="mb-8 text-3xl font-bold sm:text-4xl font-heading text-primary">
            Realtor
          </h2>
          
          <Card class="flex flex-col gap-6 p-6 md:flex-row md:gap-8">
            <div class="flex-shrink-0 w-full md:w-1/3">
              <img
                :src="realtor.photo"
                :alt="realtor.name"
                class="object-cover w-full h-64 rounded-lg shadow-md md:h-full"
              />
            </div>

            <div class="flex flex-col justify-between w-full space-y-6 md:w-2/3">
              <div>
                <h3 class="text-2xl font-bold text-primary">{{ realtor.name }}</h3>
                <p class="text-lg text-muted-foreground">{{ realtor.title }}</p>
                <p class="mt-3 leading-relaxed">{{ realtor.bio }}</p>
              </div>

              <div class="flex flex-col gap-2 text-sm">
                <a
                  :href="`mailto:${realtor.email}`"
                  class="flex items-center gap-2 hover:underline"
                >
                  <Mail class="w-4 h-4" /> {{ realtor.email }}
                </a>
                <a
                  :href="`tel:${realtor.phone}`"
                  class="flex items-center gap-2 hover:underline"
                >
                  <Phone class="w-4 h-4" /> {{ realtor.phone }}
                </a>
              </div>
              <ContainersSocials
                :socialLinks="realtor.socialLinks"
                :columnOnMobile="false"
              />
            </div>
          </Card>
        </section>
    </SectionsNavigator>
  </div>
</template>

<script lang="ts" setup>
import usePocketBaseCore from '@common/composables/usePocketBaseCore'
import ModalCarousel from '@common/components/ui/modal/ModalCarousel.vue'
import { Mail, Phone, Linkedin, Github } from 'lucide-vue-next'

const config = useRuntimeConfig()
const { fetchCollection } = usePocketBaseCore()

const realtor = ref({
  name: "Sofia Ramirez",
  title: "Real Estate Agent",
  photo: "https://images.pexels.com/photos/8292809/pexels-photo-8292809.jpeg",
  bio: "With over 10 years of experience in the San Carlos area, Sofia specializes in helping clients find their dream homes and investment properties by the sea.",
  email: "sofia.ramirez@example.com",
  phone: "+52 622 123 4567",
  socialLinks: [
    { icon: Linkedin, href: "https://linkedin.com/in/example" },
    { icon: Github, href: "https://github.com/example" }
  ]
});

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
  return await fetchCollection(
    'properties', 
    1, 
    1, 
    `slug="${slug}"`, 
    '-created', 
    'author'
  );
}

const fetchPropertiesByType = async (type: string) => {
  return await fetchCollection('properties', 1, 6, `type="${type}"`);
}

// Add this function to handle the video-active event
function handleVideoComponentActive(isActive: boolean) {
  // pause or play the video based on isActive
  const videoElement = heroRef.value?.querySelector('video') as HTMLVideoElement | null;
  if (videoElement) {
    if (isActive) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }
}

// **UPDATED LOGIC**
onMounted(async () => {
  // 1. Fetch the single property first
  const propertySlug = formattedPropertyType.value?.[2]
  const propertyType = formattedPropertyType.value?.[0]
  
  if (propertySlug) {
    fetchedProperty.value = await fetchPropertiesBySlug(propertySlug)
    slides.value = fetchedProperty.value?.items?.[0]?.gallery || []
  }

  // 2. Conditionally fetch other properties of the same type
  //    This prevents the second, unnecessary call if the primary one fails or if we're on a page
  //    where related properties aren't needed.
  if (propertyType) {
    fetchedProperties.value = await fetchPropertiesByType(propertyType)
  }
})
</script>

<style lang="css">
.aspect-video {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
}

.aspect-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>