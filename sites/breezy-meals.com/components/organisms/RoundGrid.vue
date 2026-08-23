<template>
  <div class="label-grid flex flex-wrap gap-3 justify-center">
    <MoleculesButtonWrapper
      v-for="label in labels"
      :key="label.id"
      :id="label.id"
      @edit="$emit('edit', $event)"
      @print="printLabel(label)"
      @download="downloadLabelAsPng(label)"
    >
      <div
        :ref="
          (el) => {
            if (el) cardRefs[label.id] = el as HTMLElement;
          }
        "
      >
        <AtomsRoundLabel :label="label" />
      </div>
    </MoleculesButtonWrapper>
  </div>
</template>

<script setup lang="ts">
import { useLabelExport } from "~/composables/useLabelExport";

const props = defineProps<{
  labelData: any[];
}>();

const cardRefs = ref<Record<string, HTMLElement>>({});
const labels = computed(() => props.labelData);

const FONT_EMBED_API_URL =
  "https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600;800&display=swap";

const { injectFonts, ensureFontsLoaded, getFontEmbedCSS } =
  useLabelExport(FONT_EMBED_API_URL);

function createPrintIframe(html: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;width:2in;height:2in;border:0;opacity:0;top:0;left:0;pointer-events:none;z-index:-9999;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <script src="https://cdn.tailwindcss.com"><\/script>
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

  injectFonts(doc);
  doc.close();
  return iframe;
}

async function downloadLabelAsPng(label: any) {
  const el = cardRefs.value[label.id];
  if (!el) return;

  const node = (el as any).$el ?? el;
  const html = node.outerHTML;

  const [, fontEmbedCSS] = await Promise.all([
    ensureFontsLoaded(),
    getFontEmbedCSS(),
  ]);

  const iframe = createPrintIframe(html);

  await new Promise<void>((resolve) => {
    iframe.onload = () => setTimeout(resolve, 1200);
  });

  await iframe.contentDocument?.fonts.ready;

  const { toPng } = await import("html-to-image");
  const targetEl = iframe.contentDocument!.querySelector(
    ".label-card",
  ) as HTMLElement;

  if (!targetEl) {
    console.error("Could not find .label-card inside iframe");
    document.body.removeChild(iframe);
    return;
  }

  try {
    const size = targetEl.offsetWidth;

    const dataUrl = await toPng(targetEl, {
      pixelRatio: 3,
      width: size,
      height: size,
      backgroundColor: "#ffffff",
      fontEmbedCSS,
    });

    // Crop to circle using an offscreen canvas
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    const outputSize = size * 3; // match pixelRatio
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d")!;

    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, outputSize, outputSize);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${label.name ?? label.id}-label.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  } catch (err) {
    console.error("Failed to generate PNG:", err);
  } finally {
    document.body.removeChild(iframe);
  }
}

function printLabel(label: any) {
  const el = cardRefs.value[label.id];
  if (!el) return;

  const node = (el as any).$el ?? el;
  const html = node.outerHTML;

  const iframe = createPrintIframe(html);

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 800);
  };
}

const emit = defineEmits<{
  (e: "edit", id: any): void;
}>();
</script>
