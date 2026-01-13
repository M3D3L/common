<template>
  <div class="w-full">
    <SeoMeta :seoData="computedSeoData" />

    <section class="border-gray-100">
      <div class="container py-20 lg:py-32">
        <div class="max-w-4xl">
          <span
            class="inline-block px-3 py-1 mb-6 text-sm font-semibold tracking-wider uppercase bg-gray-100 rounded-full text-primary"
          >
            {{ sellData.hero.label }}
          </span>
          <h1 class="text-5xl font-extrabold tracking-tight sm:text-7xl">
            {{ sellData.hero.title }}
            <span class="block mt-2 text-primary">
              {{ sellData.hero.highlight }}
            </span>
          </h1>

          <p class="mt-8 text-xl leading-relaxed">
            {{ sellData.hero.description }}
          </p>

          <div class="flex flex-wrap gap-4 mt-10">
            <Button
              as="a"
              :href="realEstateHeroSection.propertiesLink"
              size="lg"
              class="px-8"
            >
              {{ realEstateHeroSection.propertiesText }}
            </Button>

            <ClientOnly>
              <nuxt-link
                v-if="isVerified"
                :to="isSp ? '/bienes-raices/admin/' : '/real-estate/admin/'"
                class="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-center text-primary underline rounded-lg hover:text-primary/80 focus:ring-4 focus:outline-none focus:ring-primary/50"
              >
                {{ isSp ? "Panel de Administración" : "Admin Dashboard" }}
              </nuxt-link>
            </ClientOnly>
          </div>
        </div>
      </div>
    </section>

    <div
      v-if="pending && (!categoryData || categoryData.length === 0)"
      class="container py-32 text-center"
    >
      <AtomsLoadingSpinner />
    </div>

    <div v-else-if="error" class="container py-32 text-center">
      <h2 class="text-2xl font-bold text-red-600">
        {{ isSp ? "Error al cargar datos" : "Error loading real estate data" }}
      </h2>
      <button
        @click="refresh"
        class="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
      >
        {{ isSp ? "Reintentar" : "Retry" }}
      </button>
    </div>

    <div v-else class="container pb-32 space-y-32">
      <section class="pt-24 border-t border-gray-100">
        <div class="grid gap-12 lg:grid-cols-3">
          <Card
            v-for="(step, index) in sellData.steps"
            :key="index"
            class="p-8"
          >
            <div
              class="flex mx-auto items-center bg-primary rounded-full text-background justify-center w-12 h-12 mb-6 text-xl font-bold"
            >
              {{ index + 1 }}
            </div>
            <h3 class="mb-4 text-2xl font-bold">
              {{ step.name }}
            </h3>
            <p class="leading-relaxed">{{ step.description }}</p>
          </Card>
        </div>
      </section>

      <section
        v-for="(cat, cIndex) in localizedCategoryData"
        :key="cIndex"
        class="pt-16 space-y-16 border-t border-gray-100"
      >
        <div
          v-if="cat.properties && cat.properties.length > 0"
          class="space-y-16"
        >
          <div>
            <h2 class="text-4xl font-extrabold">
              {{ cat.sectionTitle }}
            </h2>
            <p class="max-w-4xl mt-4 text-xl">
              {{ cat.subTitle }}
            </p>
          </div>

          <div class="space-y-8">
            <MoleculesFeaturedProperty
              v-for="(property, pIndex) in cat.properties"
              :key="cIndex + '-' + pIndex"
              :content="property"
              :reverse="cIndex % 2 === 1"
              :button-text="isSp ? 'Ver Detalles' : 'View Full Details'"
              :badge-text="isSp ? 'Listado Destacado' : 'Featured Listing'"
              :is-sp="isSp"
            />

            <div class="w-full flex justify-center">
              <AtomsBaseLink
                :to="getCategoryLink(cat.type)"
                :text="
                  isSp
                    ? `Ver Todo en ${translateType(cat.type)}`
                    : `View All ${cat.type}`
                "
                class="mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="realtor" class="py-12 scroll-mt-40">
        <h2
          class="mb-8 text-3xl font-bold sm:text-4xl font-heading text-foreground"
        >
          {{ sellData.realtor.sectionTitle }}
        </h2>

        <MoleculesRealtorBio
          :heroSection="heroSection"
          :sellData="sellData"
          :socialLinks="computedSocialLinks"
        />
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "@common/components/ui/button/Button.vue";
import { createSeoObject } from "@common/composables/useSeo";
import {
  categories as categoriesComputed,
  realEstateHeroSection,
  sellPropertyPage,
  heroSection,
  socials,
} from "@local/assets/configs/layout.js";
import Card from "@common/components/ui/card/Card.vue";

const props = defineProps<{
  lang?: string;
}>();

const { fetchCollection, isUserVerified } = usePocketBaseCore();
const sellData = sellPropertyPage;
const isSp = computed(() => props.lang === "Sp");
const isVerified = computed(() => isUserVerified());

// FETCHING DATA - Using useAsyncData for SSR support and Safari stability
const {
  data: categoryData,
  pending,
  error,
  refresh,
} = await useAsyncData(
  "properties-featured",
  async () => {
    const rawCategories = toValue(categoriesComputed);

    const featuredRes = await fetchCollection(
      "properties",
      1,
      100,
      "featured=true",
      "-created"
    );

    const allFeatured = featuredRes?.items || [];

    return rawCategories
      .map((cat) => {
        const typeKey = (cat.type || "").toLowerCase();
        const filteredProperties = allFeatured.filter((item) => {
          if (typeKey === "properties") return item.type === "property";
          if (typeKey === "rentals") return item.type === "rental";
          if (typeKey === "lots") return item.type === "lot";
          return false;
        });
        return { ...cat, properties: filteredProperties };
      })
      .filter((cat) => cat.properties.length > 0);
  },
  {
    default: () => [],
  }
);

// HELPERS FOR TRANSLATION & ROUTING
const translateType = (type: string) => {
  if (!isSp.value) return type;
  const lowerType = type.toLowerCase();
  const translations: Record<string, string> = {
    properties: "Ventas",
    rentals: "Rentas",
    lots: "Terrenos",
  };
  return translations[lowerType] || type;
};

const getCategoryLink = (type: string) => {
  const lowerType = type.toLowerCase();
  const base = isSp.value ? "/bienes-raices" : "/real-estate";

  let slug = lowerType;
  if (isSp.value) {
    if (lowerType === "properties") slug = "ventas";
    if (lowerType === "rentals") slug = "rentas";
    if (lowerType === "lots") slug = "terrenos";
  }

  return `${base}/${slug}`;
};

// DATA MAPPING FOR CARDS
const localizedCategoryData = computed(() => {
  const data = categoryData.value || [];
  return data.map((cat) => ({
    ...cat,
    properties: cat.properties.map((p: any) => ({
      ...p,
      title: isSp.value && p.title_Sp ? p.title_Sp : p.title,
      description:
        isSp.value && p.description_Sp ? p.description_Sp : p.description,
      sub_title: isSp.value && p.sub_title_Sp ? p.sub_title_Sp : p.sub_title,
    })),
  }));
});

const computedSeoData = computed(() => {
  const seo = sellData.seo || {};
  return createSeoObject({
    title: isSp.value && seo.title_Sp ? seo.title_Sp : seo.title,
    summary:
      isSp.value && seo.description_Sp ? seo.description_Sp : seo.description,
    keywords: isSp.value && seo.keywords_Sp ? seo.keywords_Sp : seo.keywords,
    byline: "Brenda – San Carlos Relocation Specialist",
  });
});

const computedSocialLinks = computed(() => {
  return socials.map((s) => ({
    icon: s.icon,
    href: s.href,
    label: s.label,
  }));
});
</script>
