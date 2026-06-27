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
const props = defineProps<{
  labelData: any[];
}>();

const router = useRouter();
const cardRefs = ref<Record<string, HTMLElement>>({});
const labels = computed(() => props.labelData);

async function downloadLabelAsPng(label: any) {
  const el = cardRefs.value[label.id];
  if (!el) return;
  const node = (el as any).$el ?? el;

  await (document as any).fonts?.ready;

  const { toCanvas } = await import("html-to-image");
  const canvas = await toCanvas(node, {
    pixelRatio: 4,
    cacheBust: true,
  });

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
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600;800&display=swap" rel="stylesheet" />
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

// define emit
const emit = defineEmits<{
  (e: "edit", id: any): void;
}>();
</script>
