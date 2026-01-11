<template>
  <div class="w-full">
    <SeoMeta :seoData="computedSeoData" />

    <section class="bg-white border-b border-gray-100">
      <div class="container py-20 lg:py-32">
        <div class="max-w-4xl">
          <span
            class="inline-block px-3 py-1 mb-6 text-sm font-semibold tracking-wider uppercase bg-gray-100 rounded-full text-primary"
          >
            {{ sellData.hero.label }}
          </span>
          <h1
            class="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl"
          >
            {{ sellData.hero.title }}
            <span class="block mt-2 text-primary">
              {{ sellData.hero.highlight }}
            </span>
          </h1>

          <p class="mt-8 text-xl leading-relaxed text-gray-600">
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
          </div>
        </div>
      </div>
    </section>

    <div
      v-if="pending && categoryData.length === 0"
      class="container py-32 text-center"
    >
      <AtomsLoadingSpinner />
    </div>

    <div v-else-if="error" class="container py-32 text-center">
      <h2 class="text-2xl font-bold text-red-600">
        Error loading real estate data
      </h2>
      <button
        @click="loadAllData"
        class="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
      >
        Retry
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
        v-for="(cat, cIndex) in categoryData"
        :key="cIndex"
        class="pt-16 space-y-16 border-t border-gray-100"
      >
        <div v-if="cat.properties.length > 0" class="space-y-16">
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
            />

            <div class="w-full flex justify-center">
              <AtomsBaseLink
                :to="`/real-estate/${cat.type.toLowerCase()}`"
                :text="`View All ${cat.type}`"
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
import { Edit } from "lucide-vue-next";
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

const { fetchCollection } = usePocketBaseCore();
const categoryData = ref([]);
const pending = ref(false);
const error = ref(null);

// Assigning your provided sellData structure
const sellData = sellPropertyPage;

const computedSocialLinks = computed(() => {
  return socials.map((s) => ({
    icon: s.icon,
    href: s.href,
    label: s.label,
  }));
});

const loadAllData = async () => {
  pending.value = true;
  error.value = null;
  try {
    const rawCategories = toValue(categoriesComputed);
    const featuredRes = await fetchCollection(
      "properties",
      1,
      100,
      "featured=true",
      "-created"
    );
    const allFeatured = featuredRes?.items || [];

    categoryData.value = rawCategories
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
  } catch (err) {
    console.error("Error loading data:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  loadAllData();
});

const computedSeoData = computed(() => {
  // Now using the 'seo' block from your sellData
  return createSeoObject({
    title: sellData.seo.title,
    summary: sellData.seo.description,
    keywords: sellData.seo.keywords,
    byline: "Brenda – San Carlos Relocation Specialist",
  });
});
</script>
