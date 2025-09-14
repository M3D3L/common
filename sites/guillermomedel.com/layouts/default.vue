<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <!-- <div class="flex items-center justify-center w-full bg-gray-200 rounded-lg h-72">
      <span class="text-gray-600">[Advertisement]</span>
    </div> -->
    <the-navbar class="fixed top-0 left-0 right-0 z-50 w-full" />
    <Modal />
    <main class="w-full">
      <slot />
    </main>
    <SectionsContact />
    <the-footer :footer-data="layoutConfig.footerData" />
  </div>
</template>

<script setup lang="ts">
import { layoutConfig } from '~/assets/configs/ui/layout'
import Modal from '~/components/ui/modal/Modal.vue';

</script>

<style lang="postcss" scoped></style>