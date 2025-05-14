<script setup>
const props = defineProps({
  seoData: {
    type: Object,
    default: () => ({})
  },
})
</script>

<template>
  <Head>
    <Title v-if="seoData?.title">{{ seoData.title }}</Title>
    
    <!-- SEO Meta Tags -->
     <template v-if="seoData?.meta">
      <Meta
      v-for="meta in seoData.meta"
      :key="meta.hid"
      :hid="meta.hid"
      :name="meta.name"
      :content="meta.content"
      :property="meta.property"
      :prefix="meta.prefix"
    />
    </template>
    
  </Head>
</template>