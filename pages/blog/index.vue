<template>
  <div class="mt-8 md:pt-16">
    <SeoMeta :seoData="computedSeoData" />
  </div>
</template>

<script setup lang="ts">
import { blogSection } from "@local/assets/configs/layout";
import { createSeoObject } from "~/composables/useSeo";

const config = useRuntimeConfig();

const computedSeoData = computed(() =>
  createSeoObject({
    title: blogSection.title,
    summary: blogSection.description,
    keywords: blogSection.keywords,
    imageUri: blogSection.imgSrc,
    pubDate: "",
    byline: blogSection.byline,

    // Optional for homepage JSON-LD customization
    jsonLd: {
      "@type": "WebSite",
      url: config.public.siteUrl,
      name: blogSection.title,
      description: blogSection.description,
      publisher: {
        "@type": "Organization",
        name: config.public.siteName,
      },
    },
  })
);
</script>
