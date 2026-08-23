<template>
  <div class="flex flex-col items-center" style="display: inline-flex">
    <svg
      class="flex-shrink-0 cursor-default"
      :width="renderWidth"
      :height="renderHeight"
      :viewBox="`0 0 ${vbWidth} 52`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <template v-if="grouped">
        <path
          :d="`M 12,0.5
               L ${vbWidth - 12},0.5
               L ${vbWidth - 0.5},12
               L ${vbWidth - 0.5},50.5
               L 0.5,50.5
               L 0.5,12
               Z`"
          fill="none"
          stroke="#888"
          stroke-width="0.75"
          stroke-linejoin="round"
        />
        <line
          x1="0.5"
          y1="43.5"
          :x2="vbWidth - 0.5"
          y2="43.5"
          stroke="#888"
          stroke-width="0.75"
        />
      </template>

      <template v-else-if="size === 'small'">
        <path
          d="M 12,0.5 L 32,0.5 L 43.5,12 L 43.5,50.5 L 0.5,50.5 L 0.5,12 Z"
          fill="none"
          stroke="#888"
          stroke-width="0.75"
          stroke-linejoin="round"
        />
        <line
          x1="0.5"
          y1="43.5"
          x2="43.5"
          y2="43.5"
          stroke="#888"
          stroke-width="0.75"
        />
      </template>

      <g
        v-for="(s, si) in renderSeals"
        :key="si"
        :transform="`translate(${si * STRIDE}, 0)`"
      >
        <polygon
          points="13.5,3 30.5,3 41,13.5 41,30.5 30.5,41 13.5,41 3,30.5 3,13.5"
          fill="#000"
        />
        <polygon
          points="15,5 29,5 39,15 39,29 29,39 15,39 5,29 5,15"
          fill="none"
          stroke="white"
          stroke-width="0.9"
        />
        <text
          v-for="(line, li) in s.lines"
          :key="li"
          x="22"
          :y="s.ys[li]"
          :font-size="fontSize ?? mainFontSize(line, s.lines.length)"
          text-anchor="middle"
          fill="white"
          font-weight="900"
          font-family="Oswald, Arial Black, sans-serif"
          letter-spacing="0.1"
          :textLength="line.length > 7 ? '28' : undefined"
          lengthAdjust="spacingAndGlyphs"
        >
          {{ line.toUpperCase() }}
        </text>
      </g>

      <text
        v-if="grouped || size"
        :x="vbWidth / 2"
        y="48"
        :font-size="grouped ? 3.5 : 3"
        text-anchor="middle"
        fill="#000"
        :font-weight="grouped ? 700 : 800"
        font-family="Montserrat, Arial, sans-serif"
        letter-spacing="0.1"
      >
        SECRETARÍA DE SALUD
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Seal = { lines: string[]; ys: number[] };

const STRIDE = 37;
const GROUPED_SCALE = 0.85;

const props = withDefaults(
  defineProps<{
    seal?: Seal;
    seals?: Seal[];
    width?: number | string;
    height?: number | string;
    fontSize?: number | string;
    size?: "small" | "medium" | "large";
    grouped?: boolean;
  }>(),
  { grouped: false },
);

const list = computed(() => props.seals ?? (props.seal ? [props.seal] : []));

const vbWidth = computed(() =>
  props.grouped ? 44 + STRIDE * (list.value.length - 1) : 44,
);

const renderWidth = computed(
  () => props.width ?? (props.grouped ? vbWidth.value * GROUPED_SCALE : 56),
);
const renderHeight = computed(
  () => props.height ?? (props.grouped ? 52 * GROUPED_SCALE : 56),
);

/**
 * Reverted completely to your original spacing logic parameters
 */
function calculateCompactYs(lines: string[]): number[] {
  const count = lines.length;
  if (count <= 1) return [24];

  const gap = count > 3 ? 5.5 : count === 3 ? 6.5 : 7.5;
  const startY = 24 - ((count - 1) * gap) / 2;

  return lines.map((_, i) => startY + i * gap + 1.5);
}

const renderSeals = computed<Seal[]>(() => {
  if (props.grouped) {
    return list.value.map((s) => {
      const hasLongText = s.lines.some((l) => l.length > 9);
      return {
        lines: s.lines.map((l) => l.toUpperCase()),
        ys: hasLongText ? calculateCompactYs(s.lines) : s.ys.map((y) => y + 2),
      };
    });
  }

  if (props.size === "small") {
    const s = props.seal;
    return [{ lines: [String(s?.lines?.[0]), "SELLOS"], ys: [18, 27] }];
  }

  const s = props.seal!;
  const hasLongText = s?.lines?.some((l) => l.length > 9);
  return [
    {
      lines: (s?.lines ?? []).map((l) => l.toUpperCase()),
      ys: hasLongText
        ? calculateCompactYs(s.lines)
        : (s?.ys ?? []).map((y) => y + 2),
    },
  ];
});

/**
 * Actual font-size parameters dropped by ~25% overall to fix the overflow.
 */
function mainFontSize(line: string, totalLines: number): number {
  let size = 5.2; // Dropped baseline down from 7.0

  if (line.length > 12)
    size = 3.0; // Dropped from 3.8
  else if (line.length > 9)
    size = 3.6; // Dropped from 4.5
  else if (line.length > 6) size = 4.2; // Dropped from 5.5

  if (totalLines > 3 && size > 3.6) size = 3.6;
  else if (totalLines === 3 && size > 4.2) size = 4.2;

  return size;
}
</script>
