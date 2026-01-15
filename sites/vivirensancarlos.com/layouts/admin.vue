<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <TheNavbar
      slogan="Bienes Raíces"
      :links="siteMap"
      :siteName="contactInfo?.siteName"
    />
    <main class="w-full">
      <slot />
    </main>

    <!-- <DebugBar /> -->
  </div>
</template>

<script setup lang="ts">
import { contactInfo, siteMap } from "~/assets/configs/layout";
// import DebugBar from "@common/components/DebugBar.vue";
</script>
