<template>
  <div class="mt-8 md:pt-16">
    <SeoMeta :seoData="computedSeoData" />
    <SectionsBlogColumn
      :h1="true"
      :title="blogSection?.title"
      :description="blogSection?.description"
      :type="(config.public.blogType as string)"
      :imgSrc
      :showMore="false"
      :showPagination="true"
    />
  </div>
</template>

<script setup lang="ts">
import { blogSection } from "~/assets/configs/layout";
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
    siteName: config.public.siteName,
    twitterSite: config.public.twitterSite,

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
