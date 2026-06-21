<template>
  <div class="label-grid flex flex-wrap gap-3 justify-center">
    <MoleculesButtonWrapper
      v-for="label in labels"
      :key="label.id"
      @edit="editLabel(label)"
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

function editLabel(label: any) {
  router.push(`/label-generator/${label.id}`);
}

// Helper function to inject fonts into any document
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
  link3.href =
    "https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap";
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

  // Inject fonts into the iframe
  injectFonts(doc);
  doc.close();
  return iframe;
}

async function downloadLabelAsPng(label: any) {
  const el = cardRefs.value[label.id];
  if (!el) return;

  const node = (el as any).$el ?? el;

  // Create a container with proper font loading
  const pngContainer = document.createElement("div");
  pngContainer.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 227px;
    height: 350px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    z-index: -9999;
    background: white;
  `;

  // Clone the node
  const clonedCard = node.cloneNode(true) as HTMLElement;

  // Apply PNG-specific root overrides
  clonedCard.style.width = "227px";
  clonedCard.style.height = "350px";
  clonedCard.style.border = "2px solid #000";
  clonedCard.style.boxShadow = "none";
  clonedCard.style.margin = "0";
  clonedCard.style.padding = "0";
  clonedCard.style.boxSizing = "border-box";
  clonedCard.style.background = "#ffffff";

  // INJECT EXPLICIT COMPACT STYLE PATRICES FOR TABLE CELLS AND SCROLLBAR ANNIHILATION
  const pngStyleOverride = document.createElement("style");
  pngStyleOverride.textContent = `
    /* Nuke browser scrollbar displays entirely */
    * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
    *::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
    
    /* Strict font-family map fallback for isolated clone environment */
    .print-label, .label-card, * { font-family: 'Barlow', Arial, sans-serif !important; }
    .font-black, strong { font-family: 'Oswald', Impact, sans-serif !important; font-weight: 700 !important; }

    /* Enforce downscaled rendering matrix on nutritional table values */
    .nom-table { width: 100% !important; table-layout: fixed !important; border-collapse: collapse !important; margin: 0 !important; }
    .nom-table th, .nom-table td { 
      padding-top: 0.25px !important; 
      padding-bottom: 0.25px !important; 
      line-height: 1.1 !important;
      font-size: 5.2px !important; 
    }
    .nom-table th span, .nom-table th div { font-size: 4.8px !important; }
    .nom-table td.text-\\[6\\.5px\\] { font-size: 5.2px !important; }
    .nom-table td.text-\\[6px\\] { font-size: 4.8px !important; }

    /* CRITICAL FIX FOR LEYENDAS CUTOFF: Let black headers spill box shadows cleanly */
    .bg-black { overflow: visible !important; }
  `;
  pngContainer.appendChild(pngStyleOverride);

  // Clean elements and cascade targeted structural overflows
  const allElements = clonedCard.querySelectorAll("*");
  allElements.forEach((el) => {
    const element = el as HTMLElement;

    // Check if the node is an ancestor/part of the top header or leyendas layout
    if (element.closest("thead") || element.closest(".nom-table")) {
      element.style.overflow = "hidden";
    } else {
      // Allow general structural elements like seals, headers, and barcodes to render fully
      element.style.overflow = "visible";
    }

    if (element.classList.contains("font-black")) {
      element.style.fontFamily = "'Oswald', sans-serif";
    }
  });

  const tables = clonedCard.querySelectorAll(".nom-table, table");
  tables.forEach((table) => {
    const t = table as HTMLElement;
    t.style.width = "100%";
    t.style.tableLayout = "fixed";
    t.style.borderCollapse = "collapse";
    t.style.overflow = "hidden";
  });

  // Inject font link directly into clone scope
  const fontLink = document.createElement("link");
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap";
  fontLink.rel = "stylesheet";
  clonedCard.prepend(fontLink);

  pngContainer.appendChild(clonedCard);
  document.body.appendChild(pngContainer);

  try {
    const { toPng } = await import("html-to-image");

    // Wait explicitly for layouts and styling vectors to settle
    await document.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, 250));

    const dataUrl = await toPng(clonedCard, {
      pixelRatio: 4,
      cacheBust: true,
      width: 227,
      height: 350,
      backgroundColor: "#ffffff",
      skipFonts: false,
      style: {
        transform: "scale(1)",
        width: "227px",
        height: "350px",
      },
    });

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${label.name ?? label.id}-label.png`;
    a.click();
  } catch (err) {
    console.error("Failed to generate PNG:", err);
  } finally {
    document.body.removeChild(pngContainer);
  }
}

function printLabel(label: any) {
  const el = cardRefs.value[label.id];
  if (!el) return;

  const node = (el as any).$el ?? el;
  let html = node.outerHTML;

  // Add font link to the HTML
  const fontHtml = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap" rel="stylesheet">
  `;

  // Insert font link before the closing head tag
  html = html.replace("</head>", fontHtml + "</head>");

  // Ensure print-specific classes and attributes
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
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap");

/* Display styles */
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

/* Print-specific styles */
@media print {
  .label-card {
    width: 65mm !important;
    height: 99mm !important;
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
