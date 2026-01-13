<script setup lang="ts">
interface Props {
  seoData?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  seoData: undefined,
});

const headConfig = computed(() => {
  const base = props.seoData || { meta: [], link: [], script: [] };

  return {
    title: base.title,

    meta: [
      { name: 'format-detection', content: 'telephone=no' }
      ...base.meta,
      {
        name: "robots",
        content: "index, follow",
      },
    ],
    link: [...(base.link || [])],
    script: [...(base.script || [])],
  };
});

useHead(headConfig);
</script>

<template>
  <slot />
</template>
