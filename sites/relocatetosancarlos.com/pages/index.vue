<template>
  <div class="w-full pb-16">
    <Seo :seoData="computedSeoData" />
    <OrganismsHero v-bind="heroSection" />
    <SectionsIntro v-bind="servicesSection" />
    <SectionsSocialsCarousel v-bind="socialsSection" />
  </div>
</template>

<script setup>
import { createSeoObject } from '@common/composables/useSeo';
import { seoDefaults, heroSection, servicesSection, socialsSection } from '~/assets/configs/layout';

const computedSeoData = computed(() => {
  return createSeoObject({
    title: seoDefaults?.home?.title || '',
    summary: seoDefaults?.home?.description || '',
  })
});
</script>

<style lang="postcss" scoped>
.active {
  @apply bg-black text-white rounded-full dark:bg-white dark:text-black;
}
</style>