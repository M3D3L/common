<script setup lang="ts">
import { TooltipProvider, type TooltipProviderProps } from "reka-ui";

const props = defineProps<TooltipProviderProps>();
</script>

<template>
  <client-only>
    <TooltipProvider v-bind="props">
      <slot />
    </TooltipProvider>
  </client-only>
</template>
