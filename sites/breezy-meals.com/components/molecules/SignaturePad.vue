<template>
  <div class="overflow-hidden rounded-md border border-input bg-white">
    <canvas
      ref="canvas"
      class="block h-44 w-full touch-none cursor-crosshair"
      aria-label="Área para firma del empleado"
      @pointerdown="startDrawing"
      @pointermove="draw"
      @pointerup="stopDrawing"
      @pointercancel="stopDrawing"
      @pointerleave="stopDrawing"
    />
    <div
      class="flex items-center justify-between border-t border-border bg-muted/30 px-3 py-2"
    >
      <span class="text-xs text-muted-foreground"
        >Firma dentro del recuadro</span
      >
      <Button type="button" size="sm" variant="ghost" @click="clear">
        <Eraser :size="15" class="mr-2" /> Limpiar
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@common/components/ui/button";
import { Eraser } from "lucide-vue-next";

const canvas = ref<HTMLCanvasElement>();
const hasSignature = ref(false);
let drawing = false;
let resizeObserver: ResizeObserver | undefined;

function context() {
  return canvas.value?.getContext("2d") ?? null;
}

function resize() {
  const element = canvas.value;
  if (!element) return;
  const snapshot = hasSignature.value ? element.toDataURL("image/png") : "";
  const ratio = window.devicePixelRatio || 1;
  element.width = Math.max(1, Math.round(element.clientWidth * ratio));
  element.height = Math.max(1, Math.round(element.clientHeight * ratio));
  const ctx = context();
  if (!ctx) return;
  ctx.scale(ratio, ratio);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 2.25;
  ctx.strokeStyle = "#111827";
  if (snapshot) {
    const image = new Image();
    image.onload = () =>
      ctx.drawImage(image, 0, 0, element.clientWidth, element.clientHeight);
    image.src = snapshot;
  }
}

function point(event: PointerEvent) {
  const bounds = canvas.value!.getBoundingClientRect();
  return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
}

function startDrawing(event: PointerEvent) {
  const ctx = context();
  if (!ctx || !canvas.value) return;
  canvas.value.setPointerCapture(event.pointerId);
  const position = point(event);
  ctx.beginPath();
  ctx.moveTo(position.x, position.y);
  drawing = true;
  hasSignature.value = true;
}

function draw(event: PointerEvent) {
  if (!drawing) return;
  const ctx = context();
  if (!ctx) return;
  const position = point(event);
  ctx.lineTo(position.x, position.y);
  ctx.stroke();
}

function stopDrawing() {
  drawing = false;
  context()?.closePath();
}

function clear() {
  const element = canvas.value;
  if (!element) return;
  context()?.clearRect(0, 0, element.width, element.height);
  hasSignature.value = false;
}

async function toFile(): Promise<File | null> {
  if (!canvas.value || !hasSignature.value) return null;
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.value?.toBlob(resolve, "image/png"),
  );
  return blob
    ? new File([blob], "firma-empleado.png", { type: "image/png" })
    : null;
}

onMounted(() => {
  resize();
  resizeObserver = new ResizeObserver(resize);
  if (canvas.value) resizeObserver.observe(canvas.value);
});
onBeforeUnmount(() => resizeObserver?.disconnect());

defineExpose({ clear, hasSignature, toFile });
</script>
