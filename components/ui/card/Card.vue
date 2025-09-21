<template>
  <div :class="cn(props.styles, props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  styles?: string
}>(), {
  styles: 'transform hover:-translate-y-1 card-styles'
})
</script>


<!-- <style scoped>
text-5xl
</style> -->
