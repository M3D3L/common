<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <!-- <div class="flex items-center justify-center w-full bg-gray-200 rounded-lg h-72">
      <span class="text-gray-600">[Advertisement]</span>
    </div> -->
    <TheNavbar
      :links="siteMap"
      slogan="Real Estate"
      :siteName="contactInfo?.siteName"
    />
    <SectionsModal />
    <main class="w-full">
      <slot />
    </main>

    <SectionsBlogColumn
      class="pb-16"
      :h1="isBlogPage"
      :showPagination="isBlogPage"
      type="relocateBlog"
      v-bind="blogSection"
      :title="blogSection.title"
      :perPage="isBlogPage ? 10 : 5"
      :newsLetterModule
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
      class="fixed z-50 bottom-4 hover:opacity-80 hover:scale-105 transform uppercase px-4 py-2 right-4 flex gap-4 items-center bg-primary text-primary-foreground rounded-lg transition-all whitespace-nowrap shadow-lg"
    >
      <p>schedule a call</p>

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
    <OrganismsBaseFooter :links="siteMap" :footerConfig :contactInfo :socials />
  </div>
</template>

<script setup lang="ts">
import {
  contactInfo,
  siteMap,
  blogSection,
  contactSection,
  socials,
  footerConfig,
  newsLetterModule,
} from "~/assets/configs/layout";

const route = useRoute();

const isBlogPage = computed(() => {
  // Remove leading and trailing slashes, then lowercase
  const path = route.path.replace(/^\/|\/$/g, "").toLowerCase();
  return path === "blog";
});
</script>
