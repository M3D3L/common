<template>
  <section
    id="services"
    class="relative z-10 flex flex-col py-24 bg-neutral-50"
    ref="servicesRef"
  >
    <span class="sr-only">{{ description }}</span>

    <!-- Section Title -->
    <div class="container relative mx-auto mb-12 text-center">
      <h2 class="text-5xl font-bold text-primary">
        {{ title }}
      </h2>
      <p class="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
        {{ description }}
      </p>
    </div>

    <!-- Services Grid -->
    <motion.div
      :variants="fadeUp"
      initial="hidden"
      while-in-view="visible"
      viewport="{ once: true }"
      class="container grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
    >
      <CardsInfoCard
        v-for="(service, index) in content.items"
        :key="index"
        :title="service.title"
        :subtitle="service.description"
        :footer-text="service.footerText"
        :benefits="service.benefits || []"
      />
    </motion.div>

    <!-- Call-to-Action Banner -->
    <AtomsBanner
      id="real-estate-promo"
      title="Explore Real Estate in San Carlos"
      class="w-full"
      description="Discover available properties, investment opportunities, and your dream home in San Carlos."
      :button="{
        label: 'View Properties',
        href: '/real-estate',
      }"
    />
  </section>
</template>

<script setup lang="ts">
import { motion } from "motion-v";

const props = defineProps({
  title: {
    type: String,
    default: "Our Services",
  },
  description: {
    type: String,
    default:
      "From relocation support to real estate expertise, we help you settle in San Carlos with confidence and ease.",
  },
  content: {
    type: Object as () => {
      items: {
        title: string;
        description: string;
        footerText?: string;
        benefits?: { title: string; description: string }[];
      }[];
    },
    default: () => ({
      items: [
        {
          title: "Relocation Support",
          description:
            "Guidance on moving logistics, paperwork, and settling into San Carlos smoothly.",
          footerText: "",
          benefits: [],
        },
        {
          title: "Real Estate Services",
          description:
            "Buy, sell, or rent with confidence using our local expertise and network.",
          footerText: "",
          benefits: [],
        },
        {
          title: "Local Orientation",
          description:
            "Tours, introductions, and insider knowledge to help you feel at home quickly.",
          footerText: "",
          benefits: [],
        },
        {
          title: "Investment Guidance",
          description:
            "Explore opportunities in San Carlos’ growing real estate and lifestyle market.",
          footerText: "",
          benefits: [],
        },
      ],
    }),
  },
});

const servicesRef = ref<HTMLElement | null>(null);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
</script>
