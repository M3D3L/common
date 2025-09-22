<template>
  <div class="w-full">
    <Seo :seoData="computedSeoData" />

    <!-- Hero Section -->
    <SectionsHero
      v-if="layoutConfig?.heroData"
      :buttons="layoutConfig.heroData.buttons"
      :cards="layoutConfig.heroData?.cards"
      :title="layoutConfig.heroData?.title"
      :sub-title="layoutConfig.heroData?.subtitle"
      :image="layoutConfig.heroData?.image"
      video="https://videos.pexels.com/video-files/4665104/4665104-uhd_2560_1440_30fps.mp4"
      :description="layoutConfig.heroData?.description"
    />

    <!-- Projects Section -->
    <div class="flex flex-col items-center justify-center w-full min-h-screen py-16">
      <TextSectionTitle
        class="container py-16"
        title="Projects"
        description="A selection of projects I've worked on recently."
      />
      <SectionsProjects />
    </div>

    <div class="flex flex-col items-center justify-center w-full min-h-screen py-16">
      <TextSectionTitle
        class="container py-16"
        title="Skills"
        description="Full-stack developer focused on sleek digital experiences — a part-time drone pilot bringing both code and cameras to new heights. This unique combination allows for a diverse approach to problem-solving and project execution."
      />
      <SectionsSkills :content="layoutConfig.skillsData" />
    </div>
    <SectionsBlogColumn class="my-24" :showPagination="false" />
  </div>
</template>

<script setup>
import { layoutConfig } from "~/assets/configs/ui/layout";
import { createSeoObject } from "@common/composables/useSeo.ts";

const computedSeoData = computed(() => {
  return createSeoObject({
    title: layoutConfig?.heroData?.title || "Home",
    summary: layoutConfig?.heroData?.description || "Welcome to our website",
  });
});
</script>

<style lang="postcss" scoped>
.active {
  @apply bg-black text-white rounded-full dark:bg-white dark:text-black;
}
</style>
