<template>
  <div
    class="container relative w-full p-6 font-body bg-background text-foreground md:py-10"
  >
    <section
      id="video"
      class="w-full"
      aria-labelledby="video-heading aspect-video"
    >
      <SeoMeta :seoData="computedSeoData" />

      <TitleBlock
        :title="property?.title || 'Property Details'"
        :description="
          property?.description || 'Detailed information about the property.'
        "
        type="h1"
        class="mb-6"
      />

      <PageTitle
        :title="property?.title || 'Property Details'"
        :description="
          property?.description || 'Detailed information about the property.'
        "
        class="mb-6"
      />

      <Card
        v-if="property?.video"
        class="relative w-full h-full mb-4 overflow-hidden rounded-lg aspect-video"
        role="region"
        aria-label="Property Video Walkthrough"
      >
        <div class="aspect-video" ref="propertyHeroRef">
          <video
            class="absolute inset-0 object-cover w-full h-full rounded-lg"
            :src="property?.video"
            autoplay
            muted
            loop
            playsinline
            controls
          ></video>
        </div>
      </Card>

      <img
        v-else-if="imgSrc"
        :src="imgSrc"
        :alt="`${property?.title} Cover Image`"
        class="w-full h-auto mt-10 rounded-lg shadow-md"
      />
    </section>

    <section
      id="gallery"
      class="w-full scroll-mt-24"
      aria-labelledby="gallery-heading"
    >
      <ModalCarousel
        class="mt-10"
        :slides="slides"
        :collectionId="fetchedProperty?.items?.[0]?.collectionId"
        :propertyId="fetchedProperty?.items?.[0]?.id"
      />
    </section>

    <div v-html="property?.content" type="h1" class="mb-6"></div>

    <section
      id="details"
      class="w-full scroll-mt-24"
      aria-labelledby="details-heading"
    >
      <div class="flex flex-col gap-6 mt-10 mb-6 md:flex-row">
        <Card class="w-full p-8 rounded-lg shadow-md md:w-1/2">
          <h3 class="pb-2 mb-6 text-2xl font-semibold border-b border-gray-300">
            Property Specifics
          </h3>

          <dl
            class="grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2 text-foreground"
          >
            <template v-if="property?.price">
              <dt class="text-sm text-gray-500 uppercase">Price</dt>
              <dd class="text-lg font-bold">
                ${{ property.price.toLocaleString() }}
              </dd>
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
              <dt class="text-sm text-gray-500 uppercase col-span-full">
                Amenities
              </dt>
              <!-- List all the amenities here with an icon -->
              <dd class="col-span-full">
                <ul
                  class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3"
                >
                  <li
                    v-for="(amenity, amenityIndex) in property.amenities"
                    :key="amenityIndex"
                    class="flex flex-col justify-center text-center items-start gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted/60"
                  >
                    <span
                      class="flex justify-center h-5 w-5 items-center mx-auto rounded-full bg-green-500/10 text-green-600 dark:text-green-400"
                      aria-hidden="true"
                    >
                      <Check class="w-3 h-3" />
                    </span>

                    <p
                      class="text-sm font-medium block mx-auto text-foreground/90"
                    >
                      {{ amenity?.name }}
                    </p>
                  </li>
                </ul>
              </dd></template
            >
          </dl>

          <div class="pt-6 mt-8 border-t border-gray-300">
            <p
              v-if="
                property?.type === 'rental' || property?.type === 'property'
              "
              class="leading-relaxed text-gray-700"
            >
              This is a <b>{{ property.type }}</b> with
              <b>{{ property.bedrooms }}</b> bedrooms and
              <b>{{ property.bathrooms }}</b> bathrooms. Total area:
              <b>{{ property.area }}</b> sq ft.
            </p>
            <p
              v-else-if="property?.type === 'lot'"
              class="leading-relaxed text-gray-700"
            >
              This is a <b>lot</b> with <b>{{ property.lotSize }}</b> acres.
            </p>
            <p class="mt-4 text-sm italic text-gray-500">
              More specific details will appear here based on the property's
              type.
            </p>
          </div>
        </Card>

        <Card
          class="relative w-full min-h-[300px] rounded-lg shadow-md md:w-1/2 scroll-mt-40"
          role="region"
          aria-label="Property Location Map"
        >
          <iframe
            v-if="mapSrc"
            class="absolute inset-0 w-full h-full rounded-lg"
            :src="mapSrc"
            style="border: 0"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Map showing the property location"
          ></iframe>
        </Card>
      </div>
    </section>

    <section id="realtor" class="py-12 scroll-mt-40" ref="setSectionRef">
      <h2 class="mb-8 text-3xl font-bold sm:text-4xl font-heading text-primary">
        Realtor
      </h2>
      <Card class="flex flex-col gap-6 py-6 md:flex-row md:gap-8">
        <div class="flex-shrink-0 w-full md:w-1/3">
          <img
            :src="authorImageUrl"
            :alt="property?.expand?.author?.name"
            class="object-cover w-full h-64 rounded-lg shadow-md md:h-full"
          />
        </div>

        <div class="flex flex-col justify-between w-full space-y-6 md:w-2/3">
          <div>
            <h3 class="text-2xl font-bold text-primary">
              {{ property?.expand?.author?.name }}
            </h3>
            <p class="text-lg text-muted-foreground">
              {{ property?.expand?.author?.title }}
            </p>
            <p class="mt-3 leading-relaxed">
              {{ property?.expand?.author?.bio }}
            </p>
          </div>

          <div class="flex flex-col gap-2 text-sm">
            <a
              :href="`mailto:${property?.expand?.author?.email}`"
              class="flex items-center gap-2 hover:underline"
            >
              <Mail class="w-4 h-4" /> {{ property?.expand?.author?.email }}
            </a>
            <a
              :href="`tel:${property?.expand?.author?.phone}`"
              class="flex items-center gap-2 hover:underline"
            >
              <Phone class="w-4 h-4" /> {{ property?.expand?.author?.phone }}
            </a>
          </div>
          <ContainersSocials
            :socialLinks="computedSocialLinks"
            :columnOnMobile="false"
          />
        </div>
      </Card>
    </section>
  </div>
</template>

<script lang="ts" setup>
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import ModalCarousel from "@common/components/ui/modal/ModalCarousel.vue";
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Facebook,
  Instagram,
  Check,
} from "lucide-vue-next";

const config = useRuntimeConfig();
const { fetchCollection, toggleEmailVisibility } = usePocketBaseCore();

const fetchedProperty = ref<any>(null);
const fetchedProperties = ref<any>(null);
const slides = ref<any[]>([]);
const propertyHeroRef = ref<HTMLElement | null>(null);

const route = useRoute();

const formattedPropertyType = computed(() => {
  let type = route.params.type as string;
  let property = route.params.property as string;
  const slug = `/${type}/${property}`;

  if (type === "rentals") type = "rental";
  else if (type === "properties") type = "property";
  else if (type === "lots") type = "lot";

  if (property) {
    property = property
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return [type, property, slug];
});

const property = computed(() => fetchedProperty.value?.items?.[0] || {});

const zoom = 14;
const mapSrc = computed(() => {
  const lat = property.value?.lat;
  const long = property.value?.long;

  if (lat == null || long == null) return "";

  return `https://maps.google.com/maps?q=${lat},${long}&z=${zoom}&output=embed`;
});

const imgSrc = computed(
  () =>
    `${config.public.pocketbaseUrl}api/files/${property.value?.collectionId}/${property.value?.id}/${property.value?.cover_image}?token=`
);

const fetchPropertiesBySlug = async (slug: string) => {
  return await fetchCollection(
    "properties",
    1,
    1,
    `slug="${slug}"`,
    "-created",
    "author"
  );
};

const fetchPropertiesByType = async (type: string) => {
  return await fetchCollection("properties", 1, 6, `type="${type}"`);
};

const authorImageUrl = computed(
  () =>
    `${config.public.pocketbaseUrl}api/files/${property.value?.expand?.author?.collectionId}/${property.value?.expand?.author?.id}/${property.value?.expand?.author?.avatar}`
);

const computedSocialLinks = computed(() => {
  // check the label to get the social media icon
  const socials = property.value?.expand?.author?.socials?.socials || [];
  return socials.map((social: any) => {
    let iconComponent = null;
    if (social.label.toLowerCase().includes("linkedin")) {
      iconComponent = Linkedin;
    } else if (social.label.toLowerCase().includes("github")) {
      iconComponent = Github;
    }
    return {
      icon: iconComponent,
      href: social.href,
      label: social.label,
    };
  });
});

const computedSeoData = computed(() =>
  createSeoObject({
    title: property.value?.title || "Property Details",
    summary:
      property.value?.description || "Detailed information about the property.",
    imageUri: imgSrc.value || "",
    pubDate: "",
    byline: "",
    siteName: "RelocateToSanCarlos.com",
  })
);
// **UPDATED LOGIC**
onMounted(async () => {
  // 1. Fetch the single property first
  const propertySlug = formattedPropertyType.value?.[2];
  const propertyType = formattedPropertyType.value?.[0];

  if (propertySlug) {
    fetchedProperty.value = await fetchPropertiesBySlug(propertySlug);
    slides.value = fetchedProperty.value?.items?.[0]?.gallery || [];
  }

  // 2. Conditionally fetch other properties of the same type
  //    This prevents the second, unnecessary call if the primary one fails or if we're on a page
  //    where related properties aren't needed.
  if (propertyType) {
    fetchedProperties.value = await fetchPropertiesByType(propertyType);
  }
});
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
