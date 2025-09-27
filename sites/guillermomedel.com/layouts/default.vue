<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <!-- <div class="flex items-center justify-center w-full bg-gray-200 rounded-lg h-72">
      <span class="text-gray-600">[Advertisement]</span>
    </div> -->
    <the-navbar :links="siteMap" :siteName="contactInfo?.siteName" class="fixed top-0 left-0 right-0 z-50 w-full" />
    <Modal />
    <main class="w-full">
      <slot />
    </main>
    <SectionsContact :contactInfo :social-links="socials" v-bind="contactSection" />
    <the-footer :links="siteMap" type="posts" :contactInfo :socials />
  </div>
</template>

<script setup lang="ts">
import { contactInfo, siteMap, contactSection, socials  } from '~/assets/configs/layout'
import Modal from '@common/components/ui/modal/Modal.vue';

</script>

<style lang="postcss" scoped></style>