<template>
  <div class="flex flex-col items-center" style="display: inline-flex">
    <svg
      class="flex-shrink-0 cursor-default"
      :width="size === 'small' ? renderWidth * 1.1 : renderWidth"
      :height="size === 'small' ? renderHeight * 1.1 : renderHeight"
      :viewBox="size === 'small' ? '0 0 44 52' : `0 0 ${vbWidth} 52`"
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
          :font-size="fontSize ?? mainFontSize(line)"
          text-anchor="middle"
          fill="white"
          font-weight="900"
          font-family="Oswald, Arial Black, sans-serif"
          letter-spacing="0.2"
          :textLength="needsClamp(line) ? 30 : undefined"
          :lengthAdjust="needsClamp(line) ? 'spacingAndGlyphs' : undefined"
        >
          {{ line.toUpperCase() }}
        </text>
      </g>

      <text
        v-if="grouped || size"
        :x="size === 'small' ? 22 : vbWidth / 2"
        y="48"
        :font-size="size === 'small' ? 3 : 5"
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
type Seal = { lines: string[]; ys?: number[] };

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

const renderWidth = computed(() => {
  if (props.width) return props.width;
  if (props.grouped) return vbWidth.value * 1.1;
  if (props.size === "small") return 87;
  return 87;
});

const renderHeight = computed(() => {
  if (props.height) return props.height;
  if (props.grouped) return 52 * 1.1;
  if (props.size === "small") return 87;
  return 87;
});

/** Reduced font sizes to prevent overflow on longer text */
function mainFontSize(line: string): number {
  if (props.fontSize) return Number(props.fontSize);
  const len = line.length;
  if (len > 12) return 3.5;
  if (len > 10) return 4;
  if (len > 7) return 5;
  return 6;
}

/** Rough check: would this line overflow the ~30-unit inner width? */
function needsClamp(line: string): boolean {
  const fs = Number(props.fontSize) || mainFontSize(line);
  // Oswald is condensed — ~0.55 × fontSize per uppercase char
  return line.length * fs * 0.55 > 30;
}

/** Auto-compute tighter vertical positions centred in the octagon */
function computeYs(lines: string[]): number[] {
  const center = 22;
  const sizes = lines.map((l) => mainFontSize(l));
  const gap = 1; // tight inter-line gap
  const totalHeight =
    sizes.reduce((a, b) => a + b, 0) + gap * (sizes.length - 1);
  let top = center - totalHeight / 2;

  return sizes.map((s) => {
    // baseline sits ~78 % down the em square
    const baseline = top + s * 0.78;
    top += s + gap;
    return baseline;
  });
}

const renderSeals = computed<Seal[]>(() => {
  if (props.grouped) {
    return list.value.map((s) => {
      const upper = s.lines.map((l) => l.toUpperCase());
      return { lines: upper, ys: s.ys ?? computeYs(upper) };
    });
  }
  const s = props.seal!;
  if (props.size === "small") {
    return [{ lines: [String(s?.lines?.[0]), "SELLOS"], ys: [18, 27] }];
  }
  const upper = s.lines.map((l) => l.toUpperCase());
  return [{ lines: upper, ys: s.ys ?? computeYs(upper) }];
});
</script>
