<template>
  <div class="w-full pb-16">
    <SeoMeta :seoData="computedSeoData" />
    <OrganismsHero
      :key="partner?.id || 'default'"
      :id="personalizedHeroSection.id"
      :padding="personalizedHeroSection.padding"
      :video="personalizedHeroSection.video"
      :header-id="personalizedHeroSection.headerId"
      :image-src="personalizedHeroSection.imageSrc"
      :image-alt="personalizedHeroSection.imageAlt"
      :title-line1="personalizedHeroSection.titleLine1"
      :title-highlight="personalizedHeroSection.titleHighlight"
      :description="personalizedHeroSection.description"
      :buttons="personalizedHeroSection.buttons"
      :call-to-action="personalizedHeroSection.callToAction"
    />

    <div class="container">
      <TextSectionTitle
        class="pt-12 pb-8"
        :title="personalizedPropertiesSection.title"
        :description="personalizedPropertiesSection.description"
        :h1="false"
      />

      <div
        v-if="error"
        class="py-12 text-center border border-red-100 rounded-xl bg-red-50"
      >
        <p class="text-red-600 font-medium">
          We couldn't load the featured properties.
        </p>
        <button
          @click="loadProperties(true)"
          class="mt-2 text-sm underline hover:text-primary"
        >
          Try again
        </button>
      </div>

      <div v-else-if="loading" class="grid md:grid-cols-3 gap-6 mt-8">
        <AtomsBaseSkeleton v-for="n in 3" :key="n" class="h-[400px]" />
      </div>

      <div v-else class="grid md:grid-cols-3 gap-6">
        <CardsPropertyCard
          v-for="(item, itemIndex) in propertyItems.items"
          :key="`property-home-${itemIndex}`"
          :content="item"
          class="mt-8"
          :is-sp="isSp"
        />

        <div
          v-if="propertyItems.items.length === 0"
          class="col-span-3 py-12 text-center text-gray-500"
        >
          No featured properties available at the moment.
        </div>
      </div>

      <div v-if="!loading && !error" class="w-full flex justify-center mt-16">
        <AtomsBaseLink
          :to="isSp ? '/bienes-raices/' : '/real-estate/'"
          :text="isSp ? 'Ver Todas las Propiedades' : 'View All Properties'"
        />
      </div>
    </div>

    <SectionsSocialsCarousel
      v-if="showSocialsSection"
      v-bind="personalizedSocialsSection"
    />
  </div>
</template>

<script setup>
import { createSeoObject } from "@common/composables/useSeo";

const config = useRuntimeConfig();
const {
  partner,
  partnerPhotoUrl,
  partnerHeroImageUrl,
  partnerHeroVideoUrl,
  partnerLandingContent,
} = useReferralPartner();

// Layout configs (computed refs)
import {
  seoDefaults,
  heroSection,
  socialsSection,
  propertiesSection,
} from "@local/assets/configs/layout.js";

const props = defineProps({
  lang: {
    type: String,
    default: "En",
  },
});

const personalizedHeroSection = computed(() => {
  if (!partner.value) return heroSection;

  const hero = partnerLandingContent.value.hero || {};

  return {
    ...heroSection,
    video: partnerHeroVideoUrl.value || heroSection.video,
    imageSrc: partnerPhotoUrl.value || partnerHeroImageUrl.value || "",
    imageAlt: partner.value.name,
    titleLine1:
      hero.title_line_1 ||
      partner.value.hero_title ||
      `Explore San Carlos with ${partner.value.name}`,
    titleHighlight:
      hero.title_highlight ||
      partner.value.brokerage ||
      partner.value.title ||
      "San Carlos Real Estate",
    description:
      hero.description ||
      partner.value.hero_description ||
      partner.value.welcome_message ||
      `Explore San Carlos properties and relocation options with ${partner.value.name}.`,
    callToAction: hero.call_to_action || "Explore San Carlos",
  };
});

const personalizedPropertiesSection = computed(() => {
  if (!partner.value) return propertiesSection;
  return {
    title:
      partnerLandingContent.value.properties?.title ||
      "San Carlos Homes, Rentals & Investment Opportunities",
    description:
      partnerLandingContent.value.properties?.description ||
      "Browse a curated local catalog of homes, rentals, and investment properties in San Carlos, Sonora.",
  };
});

const personalizedSocialsSection = computed(() => {
  if (!partner.value) return socialsSection;
  const socialContent = partnerLandingContent.value.socials || {};
  return {
    title: socialContent.title || `Connect with ${partner.value.name}`,
    description: socialContent.description || "",
    socials: Array.isArray(socialContent.items) ? socialContent.items : [],
  };
});

const showSocialsSection = computed(() => {
  if (!partner.value) return true;
  const socialContent = partnerLandingContent.value.socials;
  return Boolean(
    socialContent?.enabled &&
    Array.isArray(socialContent.items) &&
    socialContent.items.length,
  );
});

// Data
const { fetchCollection } = usePocketBaseCore();
const loading = ref(false);
const error = ref(null);
const propertyItems = ref({ items: [] });

// Fetch properties
const loadProperties = async (ignoreCache = false) => {
  loading.value = true;
  error.value = null;
  try {
    // fetch only featured properties

    const data = await fetchCollection(
      "properties",
      1,
      2,
      "featured=true",
      "-created",
      null,
      null,
      ignoreCache,
    );
    propertyItems.value = data || { items: [] };
  } catch (err) {
    console.error("Error fetching properties:", err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// SEO (PURE + SAFE)
const computedSeoData = computed(() => {
  const defaults = seoDefaults?.home || {};
  const partnerSeo = partnerLandingContent.value.seo || {};
  const title = partner.value
    ? partnerSeo.title || `San Carlos Real Estate with ${partner.value.name}`
    : defaults.title || "Real Estate";
  const description = partner.value
    ? partnerSeo.description ||
      `Explore San Carlos real estate and relocation opportunities with ${partner.value.name}.`
    : defaults.description || "";

  return createSeoObject({
    title,
    summary: description,
    keywords: partner.value
      ? partnerSeo.keywords || "San Carlos Sonora real estate"
      : defaults.keywords || "",
    imageUri: partner.value
      ? partnerHeroImageUrl.value || partnerPhotoUrl.value
      : defaults.image || "",
    pubDate: "",
    byline: partner.value
      ? `${partner.value.name}, Referral Partner`
      : defaults.byline || "",
    jsonLd: {
      "@type": "WebSite",
      url: config.public.siteUrl,
      name: title,
      description,
      publisher: {
        "@type": "Organization",
        name: config.public.siteName,
      },
    },
  });
});

const isSp = computed(() => props.lang === "Sp");

// Lifecycle
onMounted(() => {
  loadProperties();
});
</script>

<style lang="postcss" scoped>
.active {
  @apply bg-black text-white rounded-full dark:bg-white dark:text-black;
}
</style>
