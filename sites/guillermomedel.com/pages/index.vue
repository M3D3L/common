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
  <TitleBlock
      title="Projects"
      description="A selection of projects I've worked on recently."
      class="container pt-16 pb-8 mx-auto md:pt-24"
    />
    <SectionsProjects />

    <TitleBlock
      title="Skills"
      description="Full-stack developer focused on sleek digital experiences — a part-time drone pilot bringing both code and cameras to new heights. This unique combination allows for a diverse approach to problem-solving and project execution."
      class="container pt-16 pb-8 mx-auto md:pt-24"
    />
    <SectionsSkills :content="layoutConfig.skillsData" />
    <SectionsBlogColumn
      class="my-24"
      :showPagination="false"
    />
  </div>
</template>

<script setup>
import { layoutConfig } from "~/assets/configs/ui/layout";
import { createSeoObject } from "@common/composables/useSeo";

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
