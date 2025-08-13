<template>
  <div class="hidden"></div>
</template>
<script setup>
const props = defineProps({
  seoData: { type: Object, required: true }
});

useHead(computed(() => ({
  title: props.seoData?.title || 'San Carlos Insider',
  ...props.seoData
})));
</script>