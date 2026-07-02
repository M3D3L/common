<template>
  <div class="label-grid flex flex-wrap gap-3 justify-center">
    <MoleculesButtonWrapper
      v-for="label in labels"
      :key="label?.id"
      :id="label?.id"
      :labels="labels"
      @edit="$emit('edit', $event)"
      @print="printLabel(label)"
      @download="downloadLabelAsPng(label)"
    >
      <template #default="{ label: activeLabel, zoomed }">
        <div
          :ref="
            !zoomed
              ? (el) => {
                  if (el) cardRefs[activeLabel.id] = el as HTMLElement;
                }
              : undefined
          "
        >
          <AtomsStandardLabel :label="activeLabel" />
        </div>
      </template>
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
  "https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap";

const { injectFonts, ensureFontsLoaded, getFontEmbedCSS } =
  useLabelExport(FONT_EMBED_API_URL);

function createPrintIframe(html: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;width:65mm;height:99mm;border:0;opacity:0;top:0;left:0;pointer-events:none;z-index:-9999;";
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
          html, body { margin: 0 !important; padding: 0 !important; width: 65mm !important; height: 99mm !important; background: transparent; overflow: hidden !important; }
          @page { margin: 0; size: 65mm 99mm; }
          .label-card { font-family: 'Barlow', Arial, sans-serif !important; width: 65mm !important; height: 99mm !important; box-shadow: none !important; border: none !important; box-sizing: border-box !important; }
          .label-card .font-black { font-family: 'Oswald', sans-serif !important; font-weight: 700 !important; }
          td, th { border: none !important; height: auto !important; padding-top: 0.5px !important; padding-bottom: 0.5px !important; line-height: 1.15 !important; vertical-align: middle; }
          tr { border: none; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; overflow: visible !important; }
          .label-card .seal-container { display: flex !important; }
          .label-card .leyenda-item { box-shadow: 0 0 0 1px black !important; }
        </style>
      </head>
      <body><div class="label-grid">${html}</div></body>
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
    const dataUrl = await toPng(targetEl, {
      pixelRatio: 3,
      width: targetEl.offsetWidth,
      height: targetEl.offsetHeight,
      backgroundColor: "#ffffff",
      fontEmbedCSS,
    });

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${label.name ?? label.id}-label.png`;
    a.click();
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
    }, 1000);
  };
}

const emit = defineEmits<{
  (e: "edit", id: any): void;
}>();
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap");

.label-card {
  font-family: "Barlow", Arial, sans-serif;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.label-card .font-black {
  font-family: "Oswald", Impact, sans-serif;
  font-weight: 700;
}

.label-card :deep(td),
.label-card :deep(th) {
  border: none !important;
  height: auto !important;
  padding-top: 0.5px !important;
  padding-bottom: 0.5px !important;
  line-height: 1.15 !important;
  vertical-align: middle;
}

.label-card :deep(tr) {
  border: none;
}

.label-card :deep(.nom-table) {
  line-height: 1.15;
  overflow: visible;
}

@media print {
  .label-card {
    width: 65mm !important;
    height: 99mm !important;
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
