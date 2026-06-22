<template>
  <div class="label-grid flex flex-wrap gap-3 justify-center">
    <MoleculesButtonWrapper
      v-for="label in labels"
      :key="label.id"
      :id="label.id"
      @edit="editLabel(label)"
      @print="printLabel(label)"
      @download="downloadLabelAsPng(label)"
    >
      <Card
        :ref="
          (el) => {
            if (el) cardRefs[label.id] = el as HTMLElement;
          }
        "
        :id="label.id"
        class="label-card bg-white relative text-black items-center rounded-full aspect-square overflow-hidden p-3 text-center border-2 border-black"
        style="width: 192px; height: 192px"
      >
        <div
          class="justify-center flex w-[5.5rem] gap-0.5 text-center items-center left-8 absolute top-7"
        >
          <AlertTriangle class="w-2 h-2 text-amber-700" />
          <p class="text-[6px] leading-tight text-black font-black">
            <strong class="font-black">Alérgenos:</strong>
            {{ label.alg || "Ninguno" }}
          </p>
        </div>
        <div class="w-full flex flex-col items-center mt-1">
          <div class="flex justify-between items-center w-full px-2 h-5 mb-0.5">
            <div
              v-if="label.seals && label.seals.length > 0"
              class="flex-shrink-0 absolute top-4 right-7 mt-1 mr-1"
            >
              <MoleculesSeal
                width="32"
                height="32"
                fontSize="8"
                :seal="sellosSeal(label.seals.length)"
              />
            </div>
          </div>
          <div class="w-12 mx-auto mt-2">
            <MoleculesSvg src="/icons/tetakawi.svg" />
          </div>

          <div
            class="font-black text-[10px] tracking-[0.12em] leading-none mb-0.5 text-black"
          >
            BREEZY MEALS
          </div>

          <div class="flex items-center gap-1 justify-center w-full px-2">
            <Separator class="flex-1 max-w-[8px] bg-black" />
            <span
              class="font-black tracking-[0.05em] leading-tight text-center text-black text-[11px]"
              :style="{
                fontSize: label.nameSize
                  ? `calc(${label.nameSize} * 0.85)`
                  : '11px',
              }"
              >{{ label.name }}</span
            >
            <Separator class="flex-1 max-w-[8px] bg-black" />
          </div>

          <!-- <p
            class="text-[8px] text-black mt-0.5 font-bold italic leading-none mx-0"
          >
            {{ label.sub }}
          </p> -->
        </div>

        <div class="w-full flex flex-col gap-0.5 px-2 my-auto">
          <p
            class="text-[6px] leading-[1.2] text-black m-0 line-clamp-2 px-1 font-semibold"
          >
            <strong class="font-black">Ing:</strong> {{ label.ing }}
          </p>

          <div
            v-if="label.leyendas && label.leyendas.length > 0"
            class="flex flex-col gap-1 mt-0.5 px-1"
          >
            <div
              v-for="(leyenda, i) in label.leyendas"
              :key="i"
              class="bg-black border border-white text-white px-1 py-0.5 text-center uppercase tracking-wide font-black"
              style="box-shadow: 0 0 0 1px black"
            >
              <p class="text-[4px] leading-none m-0">
                {{ leyenda.text }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="text-[5.5px] mt-1 font-black max-w-20 mx-auto leading-none bg-black text-white px-1.5 py-0.5 rounded-sm"
        >
          Cont. Neto: {{ label.total_size }} g
        </div>

        <div
          class="flex flex-col space-y-0! justify-between items-center text-[4.5px] w-full px-4 text-black font-bold"
        >
          <MoleculesBarcode
            :value="internalEan13(label.sku ?? label.id)"
            :width="0.75"
            :height="10"
          />
          <span
            class="flex flex-col justify-center gap-0 text-semibold text-[6px] w-full px-1"
          >
            <span
              >Cad: {{ label?.expiration || generateExpiration(label) }}</span
            >
          </span>
          <span class="-mt-[1.2rem]">Lote: {{ generateLot(label) }}</span>
        </div>
      </Card>
    </MoleculesButtonWrapper>
  </div>
</template>

<script setup lang="ts">
import { Card } from "@common/components/ui/card";
import { Separator } from "@common/components/ui/separator";
import { AlertTriangle } from "lucide-vue-next";
import {
  generateLot,
  generateExpiration,
} from "~/composables/useNutritionalLabels";
import { internalEan13 } from "~/composables/useBarcode";

const props = defineProps<{
  labelData: any[];
}>();

const router = useRouter();
const cardRefs = ref<Record<string, HTMLElement>>({});
const labels = computed(() => props.labelData);

function sellosSeal(count: number): { lines: string[]; ys: number[] } {
  const word = count === 1 ? "Sello" : "Sellos";
  return {
    lines: [String(count), word],
    ys: [20, 29],
  };
}

function editLabel(label: any) {
  router.push(`/label-generator/${label.id}`);
}

async function downloadLabelAsPng(label: any) {
  const el = cardRefs.value[label.id];
  if (!el) return;
  const node = (el as any).$el ?? el;

  // Wait for web fonts so the capture doesn't fall back to Arial
  await (document as any).fonts?.ready;

  // foreignObject-based capture: the browser renders the node itself,
  // so the PNG matches exactly what's on screen (flex, gap, max-w, oklch, etc.)
  const { toCanvas } = await import("html-to-image");
  const canvas = await toCanvas(node, {
    pixelRatio: 4, // 192 * 4 = 768px output
    cacheBust: true,
  });

  // Clip the square capture into a perfect circle
  const size = Math.min(canvas.width, canvas.height);
  const offscreen = document.createElement("canvas");
  offscreen.width = size;
  offscreen.height = size;
  const ctx = offscreen.getContext("2d")!;

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(canvas, 0, 0);

  offscreen.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${label.name ?? label.id}-label.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

function printLabel(label: any) {
  const el = cardRefs.value[label.id];
  if (!el) return;

  const node = (el as any).$el ?? el;
  const html = node.outerHTML;

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;width:0;height:0;border:0;opacity:0;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <script src="https://cdn.tailwindcss.com"><\/script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap" rel="stylesheet" />
        <style>
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: transparent;
            overflow: hidden;
            width: 2in;
            height: 2in;
          }
          @page {
            margin: 0;
            size: 2in 2in;
          }
          .print-clip {
            width: 2in;
            height: 2in;
            border-radius: 50%;
            overflow: hidden;
            clip-path: circle(50% at 50% 50%);
            position: relative;
          }
          .label-card {
            font-family: 'Barlow', Arial, sans-serif;
            width: 2in !important;
            height: 2in !important;
            border-radius: 50% !important;
            overflow: hidden !important;
            box-shadow: none !important;
            border: 2px solid black !important;
          }
          .label-card .font-black { font-family: 'Oswald', Impact, sans-serif; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        </style>
      </head>
      <body>
        <div class="print-clip">
          ${html}
        </div>
      </body>
    </html>
  `);
  doc.close();

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 800);
  };
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap");

.label-card {
  font-family: "Barlow", Arial, sans-serif;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}
.label-card .font-black {
  font-family: "Oswald", Impact, sans-serif;
}
</style>
