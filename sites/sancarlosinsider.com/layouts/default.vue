<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <!-- <div class="flex items-center justify-center w-full bg-gray-200 rounded-lg h-72">
      <span class="text-gray-600">[Advertisement]</span>
    </div> -->
    <the-navbar :logo="business?.is_featured ? business?.logo : undefined" :links="businessMap" :show-auth-buttons="false" :siteName="contactInfo?.siteName" class="fixed top-0 left-0 right-0 z-50 w-full" />
    <Modal />
    <div>
      <main class="w-full">
        <slot />
      </main>
      <!-- <SectionsBlogColumn v-if="!isOnBlogPage" v-bind="blogSection" class="my-24" :showPagination="false" />
      <SectionsContact :contactInfo :social-links="socials" v-bind="contactSection" /> -->
    </div>
    <!-- <the-footer :links="siteMap" type="posts" :contactInfo :socials /> -->
  </div>
</template>

<script setup lang="ts">
import { contactInfo, siteMap, contactSection, socials, blogSection } from '~/assets/configs/layout'
import Modal from '@common/components/ui/modal/Modal.vue';
import usePocketBase from '@common/composables/usePocketBaseCore';

const route = useRoute()

const { fetchCollection } = usePocketBase()

const businessMap = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
];

const { data, pending, error } = await useAsyncData(
  () => `menu-${route.params.slug}`,
  async () => {
    if (!route?.params?.slug) return null;
    try {
      const result = await fetchCollection(
        "menus",
        1,
        1,
        `slug="${route.params.slug}"`,
        "-created",
        "business"
      );
      return result.items.length ? result.items[0] : null;
    } catch (err) {
      console.error("Failed to fetch menu:", err);
      return null;
    }
  }
);

const business = computed(() => data.value?.expand?.business || null);
</script>