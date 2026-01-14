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
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { name: "format-detection", content: "telephone=no" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
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
