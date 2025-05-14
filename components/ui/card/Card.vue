<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="
      cn(
        'rounded-xl border bg-card/75 text-card-foreground shadow transition-all duration-300 hover:border-primary/30 hover:shadow-l',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
