<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <TheNavbar :links="siteMap" :siteName="contactInfo?.siteName" />
    <main class="w-full">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { contactInfo, siteMap } from "~/assets/configs/layout";
</script>
