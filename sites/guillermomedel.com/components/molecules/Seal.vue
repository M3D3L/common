<template>
  <svg
    class="flex-shrink-0 cursor-default"
    :width="width"
    :height="height"
    viewBox="0 0 44 44"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon
      points="12,0 32,0 44,12 44,32 32,44 12,44 0,32 0,12"
      fill="white"
    />
    <polygon points="13,1 31,1 43,13 43,31 31,43 13,43 1,31 1,13" fill="#000" />
    <text
      v-for="(line, li) in seal.lines"
      :key="li"
      :x="22"
      :y="seal.ys[li]"
      :font-size="
        fontSize ?? (line.toLowerCase().includes('saturada') ? 4.5 : 6)
      "
      text-anchor="middle"
      fill="white"
      font-weight="900"
      font-family="Oswald, Arial, sans-serif"
    >
      {{ line }}
    </text>
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    seal: { lines: string[]; ys: number[] };
    width?: number | string;
    height?: number | string;
    fontSize?: number | string;
  }>(),
  {
    width: 36,
    height: 36,
  },
);
</script>
