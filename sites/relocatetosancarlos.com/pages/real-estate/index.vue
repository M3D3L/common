<template>
  <ul class="pt-16 pb-32 container space-y-32 lg:pt-24">
    <!-- SeoMeta component for SEO metadata -->
    <SeoMeta :seoData="computedSeoData" />
    <div class="flex flex-col md:flex-row justify-between gap-4">
      <TextSectionTitle
        title="Relocate to San Carlos"
        description="Your trusted partner for finding the perfect property in San Carlos, Mexico. From expert guidance and personalized service to comprehensive support throughout your relocation journey, we're here to make your move seamless and stress-free."
        :h1="true"
      />

      <Button @click.prevent="() => {}" v-if="isVerified">
        <nuxt-link
          to="/real-estate/admin"
          class="flex items-center justify-center text-center w-full gap-2"
        >
          <Edit class="w-4 h-4" />
          Manage Listings
        </nuxt-link>
      </Button>
    </div>

    <AtomsPictureGrid />

    <li v-for="(category, index) in categories" :key="category.name">
      <TextSectionTitle
        :class="{ 'pt-12': index !== 0 }"
        :title="category.title"
        :description="category.sectionSubTitle"
        :h1="false"
      />
      <div
        :class="index % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'"
        class="flex flex-col gap-8 mt-6"
      >
        <div
          class="grid w-full items-center grid-cols-1 gap-8 md:grid-cols-2 lg:w-2/3"
        >
          <template
            v-if="!category?.properties?.items?.length"
            :key="`no-items-${index}`"
          >
            <p class="col-span-2 text-center text-muted-foreground italic">
              No results available right now. Please check back soon.
            </p>
          </template>

          <template v-else>
            <CardsPropertyCard
              v-for="(item, itemIndex) in category?.properties?.items"
              :key="`${index}-${itemIndex}`"
              baseUrl="/real-estate"
              :removeSpacing="true"
              :content="item"
              buttonText="Check it Out!"
            >
              <template #extraButton> </template>
            </CardsPropertyCard>
          </template>
          <div
            v-if="category?.properties?.totalPages > 1"
            class="flex justify-center md:col-span-2"
          >
            <nuxt-link
              :to="`/real-estate/${category?.type}/`"
              class="text-sm font-medium underline capitalize transition-colors hover:text-primary underline-offset-4"
            >
              View All {{ category?.type }}
            </nuxt-link>
          </div>
        </div>
        <div class="w-full lg:w-1/3">
          <CardsInfoCard
            v-if="category"
            :title="category.sectionTitle"
            :footerText="category.footerText"
            :subtitle="category.subtitle"
            :benefits="category.benefits"
            :categories
            :dataArray="category?.properties?.items"
            class="z-10 sticky-position top-28"
            :mode="category.mode"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import Button from "@common/components/ui/button/Button.vue";
import usePocketBaseCore from "@common/composables/usePocketBaseCore";
import { realEstateHeroSection, categories } from "~/assets/configs/layout.js";
import { Edit } from "lucide-vue-next";
import { createSeoObject } from "@common/composables/useSeo";

const config = useRuntimeConfig();

const { fetchCollection, isUserVerified } = usePocketBaseCore();

const isVerified = computed(() => isUserVerified());

// Methods
const fetchPropertiesByType = async (type: string) => {
  try {
    return await fetchCollection(
      "properties",
      1,
      6,
      `type="${type}"`,
      "-created",
      ""
    );
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
  }
};

categories[0].properties = (await fetchPropertiesByType("property")) || [];
categories[1].properties = (await fetchPropertiesByType("rental")) || [];
categories[2].properties = (await fetchPropertiesByType("lot")) || [];

const computedSeoData = computed(() => {
  return createSeoObject({
    title:
      realEstateHeroSection.titleLine1 +
      " " +
      realEstateHeroSection.titleHighlight,
    summary: realEstateHeroSection.description,
    keywords: realEstateHeroSection.keywords,
    imageUri: realEstateHeroSection.imageSrc,
    pubDate: "",
    byline: "Brenda – San Carlos Relocation Specialist",
    siteName: config.public.siteName,
    twitterSite: config.public.twitterSite,

    // Optional for homepage JSON-LD customization
    jsonLd: {
      "@type": "WebSite",
      url: config.public.siteUrl,
      name:
        realEstateHeroSection.titleLine1 +
        " " +
        realEstateHeroSection.titleHighlight,
      description: realEstateHeroSection.description,
      publisher: {
        "@type": "Organization",
        name: config.public.siteName,
      },
    },
  });
});
</script>
