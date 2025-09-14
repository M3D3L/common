<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <!-- <div class="flex items-center justify-center w-full bg-gray-200 rounded-lg h-72">
      <span class="text-gray-600">[Advertisement]</span>
    </div> -->
    <OrganismsHeader />
    <SectionsModal />
    <main class="w-full">
      <slot />
    </main>
    <SectionsContact imgSrc="" />
    <OrganismsBaseFooter v-if="layoutConfig?.footerData" :footer-data="layoutConfig.footerData" />
  </div>
</template>

<script setup lang="ts">
import { layoutConfig } from '~/assets/configs/ui/layout'
</script>

<style lang="postcss" scoped></style>