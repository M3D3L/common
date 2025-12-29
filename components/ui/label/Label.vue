<script setup lang="ts">
import { Label, type LabelProps } from "reka-ui";
import { type HTMLAttributes, computed } from "vue";
import { cn } from "~/lib/utils";

const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>();

// 1. Generate a stable ID for SSR (Nuxt built-in)
const id = useId();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <Label
    v-bind="delegatedProps"
    :id="id"
    :class="
      cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        props.class
      )
    "
  >
    <slot />
  </Label>
</template>
