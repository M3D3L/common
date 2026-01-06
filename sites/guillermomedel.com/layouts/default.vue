<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <!-- <div class="flex items-center justify-center w-full bg-gray-200 rounded-lg h-72">
      <span class="text-gray-600">[Advertisement]</span>
    </div> -->
    <the-navbar
      :links="siteMap"
      :siteName="contactInfo?.siteName"
      class="fixed top-0 left-0 right-0 z-50 w-full"
    />
    <Modal />
    <div>
      <main class="w-full">
        <slot />
      </main>
      <SectionsBlogColumn
        class="pb-16"
        :h1="isBlogPage"
        :showPagination="isBlogPage"
        :perPage="isBlogPage ? 10 : 5"
        type="relocateBlog"
        v-bind="blogSection"
        :title="blogSection.title"
        :newsLetterModule
      />
      <SectionsContact
        :contactInfo
        :social-links="socials"
        v-bind="contactSection"
      />
    </div>
    <the-footer :links="siteMap" type="posts" :contactInfo :socials />
  </div>
</template>

<script setup lang="ts">
import {
  contactInfo,
  siteMap,
  contactSection,
  socials,
  blogSection,
} from "~/assets/configs/layout";
import Modal from "@common/components/ui/modal/Modal.vue";

const route = useRoute();

const isBlogPage = computed(() => {
  // Remove leading and trailing slashes, then lowercase
  const path = route.path.replace(/^\/|\/$/g, "").toLowerCase();
  return path === "blog";
});
</script>
