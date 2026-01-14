<template>
  <div
    :class="{ 'flex-col lg:flex-row': columnOnMobile }"
    class="flex gap-2 mt-3"
    v-if="socialLinks"
  >
    <Button
      v-for="social in socialLinks"
      :key="social.href"
      variant="default"
      size="icon"
      as="a"
      :href="social.href"
      target="_blank"
      class="hover:scale-105 trasform"
    >
      <client-only>
        <component v-if="social?.icon" :is="social?.icon" class="w-5 h-5" />
      </client-only>
    </Button>
  </div>
</template>

<script setup>
import { Button } from "@/components/ui/button";

const props = defineProps({
  socialLinks: {
    type: Array,
    default: () => [],
  },
  columnOnMobile: {
    type: Boolean,
    default: false,
  },
});
</script>
