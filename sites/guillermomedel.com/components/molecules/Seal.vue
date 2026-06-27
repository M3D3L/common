<template>
  <div class="flex flex-col items-center" style="display: inline-flex">
    <svg
      class="flex-shrink-0 cursor-default"
      :width="renderWidth"
      :height="renderHeight"
      :viewBox="`0 0 ${vbWidth} 52`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Grouped: ONE chamfered outline wrapping all octagons + firma -->
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

      <!-- Single small: per-seal border (unchanged) -->
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

      <!-- Octagons -->
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
          :font-size="fontSize ?? mainFontSize(line)"
          text-anchor="middle"
          fill="white"
          font-weight="900"
          font-family="Oswald, Arial Black, sans-serif"
          letter-spacing="0.2"
        >
          {{ line.toUpperCase() }}
        </text>
      </g>

      <!-- Firma — one, spanning the full width -->
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
type Seal = { lines: string[]; ys: number[] };

// Octagon black fill spans x=3..41 (~38 wide). Stride must be >= that
// to prevent adjacent octagons from overlapping. 40 leaves a hair of gap.
const STRIDE = 37;

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

// Self-sizes in grouped mode at the original 0.62 scale unless overridden
const renderWidth = computed(
  () => props.width ?? (props.grouped ? vbWidth.value * 0.62 : 36),
);
const renderHeight = computed(
  () => props.height ?? (props.grouped ? 52 * 0.62 : 36),
);

const renderSeals = computed<Seal[]>(() => {
  if (props.grouped) {
    return list.value.map((s) => ({
      lines: s.lines.map((l) => l.toUpperCase()),
      ys: s.ys.map((y) => y + 2),
    }));
  }
  const s = props.seal!;
  if (props.size === "small") {
    return [{ lines: [String(s?.lines?.[0]), "SELLOS"], ys: [18, 27] }];
  }
  return [
    { lines: s.lines.map((l) => l.toUpperCase()), ys: s.ys.map((y) => y + 2) },
  ];
});

function mainFontSize(line: string): number {
  if (line.length > 10) return 4.5;
  if (line.length > 7) return 5.5;
  return 7;
}
</script>
