<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <TheNavbar
      slogan="Real Estate"
      :links="siteMap"
      :siteName="contactInfo?.siteName"
    />
    <main class="w-full">
      <slot />
    </main>

    <DebugBar />
  </div>
</template>

<script setup lang="ts">
import DebugBar from "@common/components/DebugBar.vue";
import { contactInfo, siteMap, socials } from "~/assets/configs/layout";
</script>
