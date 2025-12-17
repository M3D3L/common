<template>
  <div class="w-full">
    <SeoMeta :seoData="computedSeoData" />

    <!-- Hero Section -->
    <SectionsHero
      v-if="heroSection"
      v-bind="heroSection"
      image="/images/block-me.webp"
      video="https://videos.pexels.com/video-files/4665104/4665104-uhd_2560_1440_30fps.mp4"
    />

    <!-- Projects Section -->
    <div
      class="flex flex-col items-center justify-center w-full min-h-screen py-16"
    >
      <TextSectionTitle
        class="container py-16"
        :title="recentProjects?.title"
        :description="recentProjects?.description"
      />

      <SectionsProjects
        v-if="recentProjects?.items?.length"
        :title="recentProjects?.title"
        :description="recentProjects?.description"
        :items="recentProjects?.items"
      />
    </div>

    <div
      class="flex flex-col items-center justify-center w-full min-h-screen py-16"
    >
      <TextSectionTitle
        class="container py-16"
        :title="skillsSection?.title"
        :description="skillsSection?.description"
      />
      <SectionsSkills v-bind="skillsSection" />
    </div>
  </div>
</template>

<script setup>
import * as layoutConfig from "~/assets/configs/layout";
import { createSeoObject } from "@common/composables/useSeo.ts";

const { heroSection, skillsSection, recentProjects, seoDefaults } =
  layoutConfig;

const computedSeoData = computed(() => {
  return createSeoObject({
    title: seoDefaults?.title || "Home",
    summary: seoDefaults?.description || "Welcome to our website",
    keywords: seoDefaults?.keywords || "portfolio, projects, skills",
    imageUri: seoDefaults?.image || "",
    pubDate: "",
    byline: "Guillermo Medel - Full Stack Developer",
    siteName: "GuillermoMedel.com",
    // Optional for homepage JSON-LD customization
    jsonLd: {
      "@type": "WebSite",
      url: "https://guillermomedel.com",
      name: seoDefaults?.title || "Home",
      description: seoDefaults?.description || "Welcome to our website",
    },
  });
});
</script>

<style lang="postcss" scoped>
.active {
  @apply bg-black text-white rounded-full dark:bg-white dark:text-black;
}
</style>
