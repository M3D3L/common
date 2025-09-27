<template>
  <motion.div id="portfolio"
    class="container grid w-full grid-cols-1 gap-6 mx-auto mt-12 sm:grid-cols-2 lg:grid-cols-3 scroll-mt-96"
    initial="hidden"
    whileInView="visible"
    :variants="{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
      },
    }"
  >
    <CardsBaseCard
      v-if="items"
      :class="{ 'md:block hidden': index > 2 }"
      v-for="(project, index) in items"
      :key="project.id"
      :image="project.cover_image"
      :removeSpacing="false"
      :content="project"
    ></CardsBaseCard>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";

// Props
interface Project {
  id: number;
  title: string;
  sub_title: string;
  description: string;
  cover_image?: string;
  slug?: string;
  caseStudy?: string;
  tags?: string[];
  tech?: string[];
  collectionId?: string;
  [key: string]: any;
}

const props = defineProps<{
  content?: {
    title?: string;
    subtitle?: string;
    video?: string;
  };
  title?: string;
  description?: string;
  items?: Project[];
}>();
</script>
