<template>
  <svg
    class="flex-shrink-0 cursor-default"
    :width="width"
    :height="height"
    viewBox="0 0 44 44"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Outer octagon: black fill -->
    <polygon points="13,1 31,1 43,13 43,31 31,43 13,43 1,31 1,13" fill="#000" />
    <!-- Inner white border stroke -->
    <polygon
      points="14.5,3.5 29.5,3.5 40.5,14.5 40.5,29.5 29.5,40.5 14.5,40.5 3.5,29.5 3.5,14.5"
      fill="none"
      stroke="white"
      stroke-width="1"
    />

    <!-- Main nutrient lines -->
    <text
      v-for="(line, li) in sealData.lines"
      :key="li"
      :x="22"
      :y="seal.ys[li]"
      :font-size="fontSize ?? mainFontSize(line)"
      text-anchor="middle"
      fill="white"
      font-weight="900"
      font-family="Oswald, Arial Black, sans-serif"
      letter-spacing="0.2"
    >
      {{ line.toUpperCase() }}
    </text>
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    seal: { lines: string[]; ys: number[] };
    width?: number | string;
    height?: number | string;
    fontSize?: number | string;
    size: "small" | "medium" | "large";
  }>(),
  {
    width: 36,
    height: 36,
  },
);

const sealData = computed(() => {
  const { size, seal } = props;
  if (size === "small") {
    return {
      lines: ["Exceso", `${seal?.lines?.[0]} Sellos`],
    };
  } else {
    return {
      lines: seal.lines.map((line) => line.toUpperCase()),
      ys: seal.ys.map((y) => y + 2),
    };
  }
});

function mainFontSize(line: string): number {
  if (line.length > 10) return 4.5;
  if (line.length > 7) return 5.5;
  return 7;
}
</script>
