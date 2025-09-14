<template>
<TheFooter v-if="footerData" :footer-data="footerData" />
</template>

<script setup lang="ts">
const props = defineProps({
  footerData: {
    type: Object,
    required: true
  }
})
</script>