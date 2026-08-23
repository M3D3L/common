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

function calcEAN13CheckDigit(digits12: string): string {
  const sum = digits12.split("").reduce((acc, d, i) => {
    return acc + parseInt(d) * (i % 2 === 0 ? 1 : 3);
  }, 0);
  return String((10 - (sum % 10)) % 10);
}

function normalizeEAN13(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12) {
    return digits + calcEAN13CheckDigit(digits);
  }
  if (digits.length === 13) {
    const expected = calcEAN13CheckDigit(digits.slice(0, 12));
    if (digits[12] !== expected) {
      console.warn(
        `EAN-13 check digit mismatch: got ${digits[12]}, expected ${expected}`,
      );
    }
    return digits;
  }
  return null;
}

function render() {
  if (!svg.value) return;
  const normalized = normalizeEAN13(String(props.value ?? "").trim());

  if (!normalized) {
    svg.value.innerHTML = "";
    return;
  }

  try {
    JsBarcode(svg.value, normalized, {
      format: props.format,
      height: props.height,
      width: props.width,
      fontSize: 9,
      background: "#ffffff",
      lineColor: "#000000",
      displayValue: true,
    });
  } catch (e) {
    console.error("JsBarcode error:", e); // don't swallow silently
    svg.value.innerHTML = "";
  }
}

onMounted(render);
watch(() => props.value, render);
</script>
