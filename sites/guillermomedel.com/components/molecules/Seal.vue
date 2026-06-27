<template>
  <div class="flex flex-col items-center" style="display: inline-flex">
    <svg
      class="flex-shrink-0 cursor-default"
      :width="width"
      :height="height"
      viewBox="0 0 44 52"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Outer border: chamfered top corners, then straight walls down to firma box -->
      <path
        v-if="size === 'small'"
        d="M 12,0.5
           L 32,0.5
           L 43.5,12
           L 43.5,50.5
           L 0.5,50.5
           L 0.5,12
           Z"
        fill="none"
        stroke="#888"
        stroke-width="0.75"
        stroke-linejoin="round"
      />

      <!-- Divider line between octagon area and firma -->
      <line
        v-if="size === 'small'"
        x1="0.5"
        y1="43.5"
        x2="43.5"
        y2="43.5"
        stroke="#888"
        stroke-width="0.75"
      />

      <!-- Octagon: black fill (inset from the border) -->
      <polygon
        points="13.5,3 30.5,3 41,13.5 41,30.5 30.5,41 13.5,41 3,30.5 3,13.5"
        fill="#000"
      />
      <!-- Inner white border stroke -->
      <polygon
        points="15,5 29,5 39,15 39,29 29,39 15,39 5,29 5,15"
        fill="none"
        stroke="white"
        stroke-width="0.9"
      />

      <!-- Main nutrient lines -->
      <text
        v-for="(line, li) in sealData.lines"
        :key="li"
        :x="22"
        :y="sealData.ys[li]"
        :font-size="fontSize ?? mainFontSize(line)"
        text-anchor="middle"
        fill="white"
        font-weight="900"
        font-family="Oswald, Arial Black, sans-serif"
        letter-spacing="0.2"
      >
        {{ line.toUpperCase() }}
      </text>

      <!-- "SECRETARÍA DE SALUD" firma — required by NOM-051 Appendix A.2.2 -->
      <text
        v-if="size"
        x="22"
        y="48"
        font-size="3"
        text-anchor="middle"
        fill="#000"
        font-weight="800"
        font-family="Montserrat, Arial, sans-serif"
        letter-spacing="0.1"
      >
        SECRETARÍA DE SALUD
      </text>
    </svg>
  </div>
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
      lines: [String(seal?.lines?.[0]), "SELLOS"],
      ys: [18, 27],
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
