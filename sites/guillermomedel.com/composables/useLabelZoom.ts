import { ref, computed, nextTick, watch, onBeforeUnmount, type Ref } from "vue";

export interface UseLabelZoomOptions {
  min?: number;
  max?: number;
  default?: number;
  step?: number;
}

export function useLabelZoom(opts: UseLabelZoomOptions = {}) {
  const MIN_SCALE = opts.min ?? 0.5;
  const MAX_SCALE = opts.max ?? 6;
  const DEFAULT_SCALE = opts.default ?? 2;
  const STEP = opts.step ?? 0.25;

  const open = ref(false);
  const scale = ref(DEFAULT_SCALE);

  const stage = ref<HTMLElement | null>(null);
  const frame = ref<HTMLElement | null>(null);
  const natW = ref(0);
  const natH = ref(0);

  function measure() {
    const el = frame.value;
    if (!el) return;
    // offsetWidth/Height are the layout size *before* the CSS transform,
    // so this stays stable regardless of the current scale.
    natW.value = el.offsetWidth;
    natH.value = el.offsetHeight;
  }

  function remeasure() {
    nextTick().then(() => requestAnimationFrame(measure));
  }

  const sizerStyle = computed(() => ({
    width: natW.value ? `${natW.value * scale.value}px` : "auto",
    height: natH.value ? `${natH.value * scale.value}px` : "auto",
  }));

  const frameStyle = computed(() => ({
    transform: `scale(${scale.value})`,
  }));

  function clampScale(v: number) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, +v.toFixed(2)));
  }

  function zoomIn() {
    scale.value = clampScale(scale.value + STEP);
  }
  function zoomOut() {
    scale.value = clampScale(scale.value - STEP);
  }
  function resetZoom() {
    scale.value = DEFAULT_SCALE;
  }

  function onWheel(e: WheelEvent) {
    // Ctrl/Cmd + wheel to zoom, otherwise let the stage scroll normally.
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    scale.value = clampScale(scale.value + (e.deltaY < 0 ? STEP : -STEP));
  }

  watch(open, (isOpen) => {
    if (isOpen) {
      scale.value = DEFAULT_SCALE;
      stage.value?.scrollTo({ top: 0, left: 0 });
      remeasure();
    }
  });

  onBeforeUnmount(() => {
    // nothing to clean up now, kept for future listeners
  });

  return {
    // constants (for :disabled bounds in the template)
    MIN_SCALE,
    MAX_SCALE,
    open,
    scale,
    stage,
    frame,
    sizerStyle,
    frameStyle,
    zoomIn,
    zoomOut,
    resetZoom,
    onWheel,
    remeasure,
  };
}
