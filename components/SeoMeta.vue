<script setup lang="ts">
interface Props {
  seoData?: Record<string, any>;
  noIndex?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  seoData: undefined,
  noIndex: false,
});

const headConfig = computed(() => {
  const base = props.seoData || { meta: [], link: [], script: [] };

  return {
    title: base.title,
    meta: [
      ...base.meta,
      ...(props.noIndex
        ? [{ name: "robots", content: "noindex, follow" }]
        : []),
    ],
    link: base.link,
    script: base.script,
  };
});

useHead(headConfig);
</script>

<template>
  <slot />
</template>
