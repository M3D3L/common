<template>
    <div :class="{ 'flex-col lg:flex-row' :columnOnMobile }" class="flex gap-2 mt-3" v-if="socialLinks">
      <Button v-for="social in socialLinks"
        :key="social.href"
        variant="outline"
        size="icon"
        as="a"
        :href="social.href"
        target="_blank"
        class="transition-all duration-200 hover:scale-105 hover:shadow-md"
      >
        <component :is="social.icon" class="w-4 h-4 text-muted-foreground hover:text-primary" />
      </Button>
    </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'

const props = defineProps({
  socialLinks: {
    type: Array,
    default: () => []
  },
  columnOnMobile: {
    type: Boolean,
    default: false
  }
})
</script>