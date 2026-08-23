<!-- components/molecules/Svg.vue -->
<script lang="ts">
const cache = new Map<string, string>();
</script>

<script setup lang="ts">
const props = defineProps<{ src: string }>();
const markup = ref(cache.get(props.src) ?? "");

function normalize(raw: string): string {
  const i = raw.indexOf("<svg");
  if (i === -1) return "";
  return raw.slice(i).replace(/<svg([^>]*)>/, (_m, attrs: string) => {
    const cleaned = attrs
      // drop hardcoded dimensions
      .replace(/\s(?:width|height)="[^"]*"/g, "")
      // drop any root style
      .replace(/\sstyle="[^"]*"/g, "");
    // inline style survives outerHTML → sizes correctly in the print iframe too
    return `<svg${cleaned} style="width:100%;height:auto;display:block">`;
  });
}

async function load(url: string) {
  if (cache.has(url)) {
    markup.value = cache.get(url)!;
    return;
  }
  try {
    const svg = normalize(await (await fetch(url)).text());
    if (!svg) {
      markup.value = "";
      return;
    }
    cache.set(url, svg);
    markup.value = svg;
  } catch {
    markup.value = "";
  }
}

onMounted(() => load(props.src));
watch(() => props.src, load);
</script>

<template><span class="block leading-none" v-html="markup" /></template>
