<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <TheNavbar :links="siteMap" :siteName="contactInfo?.siteName" />
    <main class="w-full">
      <slot />
    </main>
    <OrganismsBaseFooter :links="siteMap" :contactInfo :socials />
  </div>
</template>

<script setup lang="ts">
import { contactInfo, siteMap, socials } from "~/assets/configs/layout";
</script>
