<script setup lang="ts">
import { icons } from "lucide-vue-next";

const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (value: string) => {
      return Object.keys(icons).includes(value);
    },
  },
  size: {
    type: [Number, String],
    default: 24,
  },
  color: {
    type: String,
    default: "currentColor",
  },
  strokeWidth: {
    type: [Number, String],
    default: 2,
  },
});

const IconComponent = computed(() => icons[props.name]);
</script>

<template>
  <component
    :is="IconComponent"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
  />
</template>