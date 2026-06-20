<template><svg ref="svg" class="block mx-auto" /></template>
<script setup lang="ts">
import JsBarcode from "jsbarcode";
const props = withDefaults(
  defineProps<{
    value: string;
    format?: string;
    height?: number;
    width?: number;
  }>(),
  { format: "EAN13", height: 24, width: 1.1 },
);
const svg = ref<SVGElement | null>(null);
function render() {
  if (!svg.value) return;
  const v = String(props.value ?? "").trim();
  if (!v) {
    svg.value.innerHTML = "";
    return;
  }
  try {
    JsBarcode(svg.value, v, {
      format: props.format,
      height: props.height,
      width: props.width,
      margin: 4,
      fontSize: 9,
      background: "#ffffff",
      lineColor: "#000000",
      displayValue: true,
    });
  } catch {
    svg.value.innerHTML = "";
  }
}
onMounted(render);
watch(() => props.value, render);
</script>
