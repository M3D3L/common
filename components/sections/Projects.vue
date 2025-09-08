<template>
  <motion.div
    class="container grid w-full grid-cols-1 gap-6 mx-auto mt-12 sm:grid-cols-2 lg:grid-cols-3"
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
      v-if="projectsData"
      :class="{ 'md:block hidden': index > 2 }"
      v-for="(project, index) in projectsData"
      :key="project.id"
      :image="project.cover_image"
      :removeSpacing="false"
      :content="project"
    ></CardsBaseCard>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import BlockMe3 from "/images/block-me-3.webp";
import { projectsData } from "~/assets/configs/cards/projects";

// Props
const props = defineProps({
  content: {
    type: Object,
    required: false,
    default: () => ({
      title: "My Portfolio",
      subtitle: "Selected projects I've worked on for clients and companies",
      video:
        "https://videos.pexels.com/video-files/2344545/2344545-uhd_2560_1440_25fps.mp4",
    }),
  },
  title: {
    type: String,
    default: "My Projects",
  },
  description: {
    type: String,
    default:
      "A selection of projects I have worked on, showcasing my skills and expertise.",
  },
});
</script>
