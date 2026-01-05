<template>
  <TheFooter
    :links="siteMap"
    :footerConfig
    :contactInfo
    :socials
    type="relocateBlog"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  socials: {
    type: Array,
    default: () => [],
  },
  contactInfo: {
    type: Object,
    default: () => ({}),
  },
  siteMap: {
    type: Array,
    default: () => [],
  },
  footerConfig: {
    type: Object,
    default: () => ({}),
  },
});
</script>
