<template>
  <div class="label-grid flex flex-wrap gap-3 justify-center">
    <MoleculesButtonWrapper
      v-for="label in labels"
      :id="label?.id"
      :key="label?.id"
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
        <AtomsStandardLabel :label="label" />
      </div>
    </MoleculesButtonWrapper>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  labelData: any[];
}>();

const router = useRouter();
const cardRefs = ref<Record<string, HTMLElement>>({});
const labels = computed(() => props.labelData);

const FONT_EMBED_API_URL =
  "https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap";

// Cache base64 fonts so we only fetch once per session
const fontEmbedCache = ref<string | null>(null);

function injectFonts(doc: Document) {
  const link1 = doc.createElement("link");
  link1.rel = "preconnect";
  link1.href = "https://fonts.googleapis.com";
  doc.head.appendChild(link1);

  const link2 = doc.createElement("link");
  link2.rel = "preconnect";
  link2.href = "https://fonts.gstatic.com";
  link2.crossOrigin = "anonymous";
  doc.head.appendChild(link2);

  const link3 = doc.createElement("link");
  link3.href = FONT_EMBED_API_URL;
  link3.rel = "stylesheet";
  doc.head.appendChild(link3);
}

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

// Loads fonts into the parent document so html-to-image can access them
async function ensureFontsLoaded(): Promise<void> {
  if (document.fonts.check("700 1em Oswald")) return;

  const style = document.createElement("style");
  style.textContent = `@import url('${FONT_EMBED_API_URL}');`;
  document.head.appendChild(style);

  await document.fonts.ready;
}

// Fetches Google Fonts CSS, downloads each woff2, and returns fully embedded CSS
async function getFontEmbedCSS(): Promise<string> {
  if (fontEmbedCache.value) return fontEmbedCache.value;

  // 1. Fetch the Google Fonts CSS to get the real, current woff2 URLs
  const cssRes = await fetch(FONT_EMBED_API_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const cssText = await cssRes.text();

  // 2. Extract all woff2 URLs from the CSS
  const urlMatches = [
    ...cssText.matchAll(
      /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g,
    ),
  ];
  const woff2Urls = urlMatches.map((m) => m[1]);

  if (woff2Urls.length === 0) {
    console.error("No woff2 URLs found in Google Fonts CSS response");
    return "";
  }

  // 3. Fetch and base64-encode each font file
  const base64Fonts = await Promise.all(
    woff2Urls.map(async (url) => {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      return { url, b64 };
    }),
  );

  // 4. Replace the original URLs in the CSS with base64 data URIs
  let embeddedCSS = cssText;
  for (const { url, b64 } of base64Fonts) {
    embeddedCSS = embeddedCSS.replace(url, `data:font/woff2;base64,${b64}`);
  }

  fontEmbedCache.value = embeddedCSS;
  return embeddedCSS;
}

async function downloadLabelAsPng(label: any) {
  const el = cardRefs.value[label.id];
  if (!el) return;

  const node = (el as any).$el ?? el;
  const html = node.outerHTML;

  // Pre-load fonts in the parent document and build embed CSS in parallel
  const [, fontEmbedCSS] = await Promise.all([
    ensureFontsLoaded(),
    getFontEmbedCSS(),
  ]);

  // Use the same iframe as print for identical rendering
  const iframe = createPrintIframe(html);

  await new Promise<void>((resolve) => {
    iframe.onload = () => setTimeout(resolve, 1200);
  });

  // Also wait for fonts inside the iframe itself
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
  let html = node.outerHTML;

  const fontHtml = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="${FONT_EMBED_API_URL}" rel="stylesheet">
  `;

  html = html.replace("</head>", fontHtml + "</head>");
  html = html.replace(/class="/g, 'class="print-label ');

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
