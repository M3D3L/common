<template>
  <nuxt-link
    :to
    class="font-light capitalize transition-all hover:opacity-90 text-foreground hover:text-primary hover:underline pb-2"
  >
    {{ text }}
  </nuxt-link>
</template>

<script lang="ts" setup>
const props = defineProps({
  to: { type: String, required: true },
  text: { type: String, required: true },
});
</script>
