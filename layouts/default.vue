<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <the-navbar class="fixed top-0 left-0 right-0 z-50 w-full" />
    <main class="w-full">
      <slot />
    </main>
    <the-footer :footer-data="layoutConfig.footerData" />
  </div>
</template>

<script setup lang="ts">
import { layoutConfig } from '~/assets/configs/ui/layout'
</script>

<style lang="postcss" scoped></style>