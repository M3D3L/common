<template>
  <div
    class="container relative w-full p-6 font-body bg-background text-foreground md:py-10"
  >
    <SeoMeta :seoData="computedSeoData" />

    <div
      class="flex flex-col gap-6 mb-8 md:flex-row md:items-start md:justify-between"
    >
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span
            v-if="property?.type"
            class="py-1 text-xs font-semibold uppercase rounded-full bg-primary/10 text-primary"
          >
            {{ property.type }}
          </span>
          <span
            v-if="property?.address"
            class="text-sm text-muted-foreground items-center flex"
          >
            {{ property.address }}
          </span>
        </div>

        <h1
          class="text-3xl text-primary font-extrabold tracking-tight md:text-5xl"
        >
          {{ property?.title || "Property Details" }}
        </h1>

        <div class="flex items-center gap-4 text-sm font-medium md:text-base">
          <span v-if="property?.bedrooms" class="flex items-center gap-1.5">
            <Bed :size="18" class="text-muted-foreground" />
            {{ property.bedrooms }} Bed
          </span>
          <span v-if="property?.bathrooms" class="flex items-center gap-1.5">
            <Bath :size="18" class="text-muted-foreground" />
            {{ property.bathrooms }} Bath
          </span>
          <span v-if="property?.area" class="flex items-center gap-1.5">
            <Square :size="18" class="text-muted-foreground" />
            {{ property.area }} sq ft
          </span>
        </div>

        <p>
          {{ property?.description }}
        </p>
      </div>

      <div class="flex flex-row items-center gap-2 my-auto">
        <div
          v-if="property?.price"
          class="text-3xl font-bold md:text-4xl text-primary"
        >
          ${{ property.price.toLocaleString() }}
        </div>
        <div
          v-if="property?.pricingType"
          class="text-sm font-medium text-muted-foreground"
        >
          {{ property.pricingType }}
        </div>
      </div>
    </div>

    <section id="hero" class="w-full mb-10">
      <Card
        v-if="property?.video"
        class="relative w-full overflow-hidden rounded-xl aspect-video shadow-xl"
      >
        <video
          class="absolute inset-0 object-cover w-full h-full"
          :src="property?.video"
          autoplay
          muted
          loop
          playsinline
          controls
        ></video>
      </Card>

      <img
        v-else-if="imgSrc"
        :src="imgSrc"
        :alt="property?.title"
        class="w-full h-auto max-h-[600px] object-cover rounded-xl shadow-lg"
      />
    </section>

    <section
      id="details"
      class="grid grid-cols-1 gap-8 lg:grid-cols-3 scroll-mt-24"
    >
      <div class="lg:col-span-2 space-y-10">
        <div
          class="prose prose-slate max-w-none"
          v-html="property?.content"
        ></div>

        <Card class="p-6 md:p-8">
          <h3 class="mb-6 text-xl font-bold border-b pb-4">
            Property Specifics
          </h3>

          <dl class="grid grid-cols-1 gap-y-6 gap-x-12 sm:grid-cols-2">
            <div v-if="property?.lotSize">
              <dt
                class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Lot Size
              </dt>
              <dd class="text-lg font-medium">{{ property.lotSize }} acres</dd>
            </div>
            <div v-if="property?.type">
              <dt
                class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Property Type
              </dt>
              <dd class="text-lg font-medium capitalize">
                {{ property.type }}
              </dd>
            </div>
          </dl>

          <div v-if="property?.amenities?.length" class="mt-10">
            <h4
              class="mb-4 text-sm font-semibold text-muted-foreground uppercase"
            >
              Key Amenities
            </h4>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div
                v-for="(amenity, index) in property.amenities"
                :key="index"
                class="flex items-center gap-2 p-3 rounded-lg bg-muted/40"
              >
                <Check :size="16" class="text-green-600" />
                <span class="text-sm font-medium">{{ amenity?.name }}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card
        v-if="mapSrc !== 'https://maps.google.com/maps?q=,&z=14&output=embed'"
        class="relative my-auto w-full h-[400px] bg-primary overflow-hidden rounded-xl shadow-md"
      >
        <iframe
          class="inset-0 w-full h-full object-cover"
          :src="mapSrc"
          style="border: 0"
          allowfullscreen
          loading="lazy"
          title="Property Location"
        ></iframe>
      </Card>
    </section>

    <section id="gallery" class="w-full lg:mt-0 mt-16 scroll-mt-24">
      <h2 class="text-2xl font-bold">Photo Gallery</h2>
      <ModalCarousel
        :slides="slides"
        :collectionId="fetchedProperty?.items?.[0]?.collectionId"
        :propertyId="fetchedProperty?.items?.[0]?.id"
      />
    </section>

    <section id="realtor" class="py-12 scroll-mt-40" ref="setSectionRef">
      <h2 class="mb-8 text-3xl font-bold sm:text-4xl font-heading text-primary">
        Realtor
      </h2>
      <Card
        class="flex flex-col gap-6 rounded-lg md:flex-row md:gap-8 border overflow-hidden shadow-md"
      >
        <div class="flex-shrink-0 w-full md:w-1/3">
          <img
            :src="authorImageUrl"
            :alt="property?.expand?.author?.name"
            class="object-cover w-full h-64 rounded-lg shadow-md md:h-full"
          />
        </div>

        <div class="grid w-full items-center md:w-2/3 lg:p-0 px-6 pb-6">
          <div>
            <h3 class="text-2xl font-bold text-primary md:mt-4 lg:mt-0">
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
              class="flex items-center gap-2 hover:underline hover:text-primary transition-colors"
            >
              <Mail class="w-4 h-4" /> {{ property?.expand?.author?.email }}
            </a>
            <a
              :href="`tel:${property?.expand?.author?.phone}`"
              class="flex items-center gap-2 hover:underline hover:text-primary transition-colors"
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
  MapPin,
  Bed,
  Bath,
  Square,
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
