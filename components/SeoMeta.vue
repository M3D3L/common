<script setup lang="ts">
import { useSeoMetaHead } from "../composables/useSeoMetaHead";

interface Props {
  seoData?: Record<string, any>;
  follow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  seoData: undefined,
  follow: true,
});

useSeoMetaHead(
  computed(() => ({
    seoData: props.seoData,
    follow: props.follow,
  })),
);
</script>

<template>
  <slot />
</template>
