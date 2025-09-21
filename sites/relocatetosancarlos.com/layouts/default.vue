<template>
  <div class="relative flex flex-col min-h-screen mx-auto">
    <!-- <div class="flex items-center justify-center w-full bg-gray-200 rounded-lg h-72">
      <span class="text-gray-600">[Advertisement]</span>
    </div> -->
    <OrganismsHeader :links="siteMap" :siteName="contactInfo?.siteName" />
    <SectionsModal />
    <main class="w-full">
      <slot />
    </main>
    <SectionsBlogColumn v-if="!isBlogPage && !isOnBoadrdingPage" class="pb-16" type="relocateBlog" v-bind="blogSection" />
    <SectionsContact :contactInfo :social-links="socials" v-bind="contactSection" />
    <OrganismsBaseFooter :links="siteMap" :contactInfo :socials />
  </div>
</template>

<script setup lang="ts">
import { contactInfo, siteMap, blogSection, contactSection, socials  } from '~/assets/configs/layout'

const route = useRoute()

// is blog page
const isBlogPage = computed(() => {
  return route.path === '/blog/' || route.path.startsWith('/blog')
})

const isOnBoadrdingPage = computed(() => {
  return route.path === '/onboarding' || route.path.startsWith('/onboarding')
})

</script>

<style lang="postcss" scoped></style>