<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <!-- <div class="flex items-center justify-center w-full bg-gray-200 rounded-lg h-72">
      <span class="text-gray-600">[Advertisement]</span>
    </div> -->
    <TheNavbar :links="siteMap" :siteName="contactInfo?.siteName" />
    <SectionsModal />
    <main class="w-full">
      <slot />
    </main>
    <SectionsBlogColumn
      v-if="!isBlogPage && !isOnBoadrdingPage"
      class="pb-16"
      :showPagination="false"
      type="relocateBlog"
      v-bind="blogSection"
    />
    <SectionsContact
      :contactInfo
      :social-links="socials"
      v-bind="contactSection"
    />

    <a
      href="https://calendly.com/brendaaigsc/30min"
      target="_blank"
      rel="noopener noreferrer"
      class="fixed z-50 bottom-4 px-4 py-2 right-4 flex gap-4 items-center bg-primary text-white rounded-lg whitespace-nowrap shadow-lg"
    >
      <p>Schedule a Call</p>

      <!-- <CalendlyButton
        class="hover:scale-125 transition-all duration-150 transform"
        link="https://calendly.com/brendaaigsc/30min"
      />
      <WhatsappButton
        class="hover:scale-125 transition-all duration-150 transform"
        phone="+526444572193"
        message="Hello, I would like to schedule a call!"
      /> -->
    </a>
    <OrganismsBaseFooter :links="siteMap" :contactInfo :socials />
  </div>
</template>

<script setup lang="ts">
import {
  contactInfo,
  siteMap,
  blogSection,
  contactSection,
  socials,
} from "~/assets/configs/layout";
import WhatsappButton from "@common/components/molecules/WhatsappButton.vue";
import CalendlyButton from "@common/components/molecules/CalendlyButton.vue";

const route = useRoute();

// is blog page
const isBlogPage = computed(() => {
  return route.path === "/blog/" || route.path.startsWith("/blog");
});

const isOnBoadrdingPage = computed(() => {
  return route.path === "/onboarding" || route.path.startsWith("/onboarding");
});
</script>

<style lang="postcss" scoped></style>
