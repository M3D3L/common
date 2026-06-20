<template>
  <div class="label-grid flex flex-wrap gap-3 justify-center">
    <MoleculesButtonWrapper
      v-for="label in labels"
      :key="label.id"
      @edit="editLabel(label)"
      @print="printLabel(label)"
    >
      <Card
        :ref="
          (el) => {
            if (el) cardRefs[label.id] = el as HTMLElement;
          }
        "
        :id="label.id"
        class="label-card bg-white text-black flex flex-col overflow-hidden rounded-sm p-0"
        style="width: 230px; height: 350px; border: 2px solid #000"
      >
        <CardHeader class="p-0 flex-shrink-0 border-b-2 border-black space-y-0">
          <div class="px-1.5 pb-1">
            <div class="flex justify-end gap-1 mb-6 mt-1.5 h-7">
              <div class="flex items-center gap-0.5 px-1 mr-auto">
                <AlertTriangle
                  class="w-2 h-2 text-amber-700 flex-shrink-0 mt-px"
                />
                <p class="text-[5px] leading-[1.25] text-black m-0 font-bold">
                  <strong class="font-black">Alérgenos:</strong> {{ label.alg }}
                </p>
              </div>
              <TooltipProvider v-for="(seal, i) in label.seals" :key="i">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <MoleculesSeal :seal="seal" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    class="text-[9px] font-bold bg-black text-white"
                  >
                    {{ seal.lines.join(" ") }}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div class="w-20 mx-auto mb-1">
              <MoleculesSvg src="/icons/tetakawi.svg" />
            </div>

            <div
              class="text-center font-black text-[13px] tracking-[0.15em] leading-none mb-0.5 text-black"
            >
              BREEZY MEALS
            </div>

            <div class="flex items-center gap-1 justify-center">
              <Separator class="flex-1 max-w-[12px] bg-black" />
              <span
                class="font-black tracking-[0.1em] leading-tight text-center text-black"
                :style="{ fontSize: label.nameSize }"
                >{{ label.name }}</span
              >
              <Separator class="flex-1 max-w-[12px] bg-black" />
            </div>

            <p
              class="text-center text-[5.5px] text-black mt-0.5 font-bold italic leading-tight mx-0 mb-1"
            >
              {{ label.sub }}
            </p>

            <div
              v-if="label.leyendas && label.leyendas.length > 0"
              class="flex flex-col gap-1 px-1"
            >
              <div
                v-for="(leyenda, i) in label.leyendas"
                :key="i"
                class="bg-black border border-white text-white px-1 py-0.5 text-center uppercase tracking-wide font-black"
                style="box-shadow: 0 0 0 1px black"
              >
                <p class="text-[5px] leading-none m-0">
                  {{ leyenda.text }}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent
          class="flex-1 flex flex-col gap-0.5 px-1.5 py-1 overflow-hidden p-0 bg-white"
        >
          <p
            class="text-[5.5px] leading-[1.3] text-black mt-1 mx-0 px-1 font-semibold"
          >
            <strong class="font-black">Ingredientes:</strong> {{ label.ing }}
          </p>

          <Table
            class="nom-table w-full text-[6.5px]"
            style="border: 1.5px solid #000; border-collapse: collapse"
          >
            <TableRow class="border-0">
              <TableHead
                colspan="4"
                class="px-1 py-0.5 text-white h-auto leading-tight bg-black"
                style="border-bottom: 1.5px solid #000"
              >
                <div
                  class="flex justify-between w-full font-black text-[5.8px]"
                >
                  <span
                    >Cont. neto: <strong>{{ label.total_size }} g</strong></span
                  >
                  <span
                    >Porciones por envase:
                    <strong>{{
                      label.total_size && label.portion_size
                        ? Math.round(label.total_size / label.portion_size)
                        : 1
                    }}</strong></span
                  >
                  <span
                    >Porción: <strong>{{ label.portion_size }} g</strong></span
                  >
                </div>
              </TableHead>
            </TableRow>
            <TableRow style="background: #fff; border-bottom: 1.5px solid #000">
              <TableCell class="px-1 py-0.5 font-black text-left text-black"
                >Declaración Nutrimental</TableCell
              >
              <TableCell
                class="px-1 py-0.5 font-black text-right w-14 text-black"
                >Por 100 g</TableCell
              >
              <TableCell
                class="px-1 py-0.5 font-black text-right w-14 text-black"
                >Por porción</TableCell
              >
              <TableCell
                class="px-1 py-0.5 font-black text-right w-10 text-black"
                >% VNR*</TableCell
              >
            </TableRow>
            <TableBody>
              <TableRow
                v-for="row in label.rows"
                :key="row.label"
                class="border-0"
                :style="{
                  borderBottom: row.last
                    ? '1.5px solid #000'
                    : row.sub
                      ? '0.5px solid #000'
                      : '1.25px solid #000',
                }"
              >
                <TableCell
                  class="px-1 m-0 leading-tight text-black"
                  :class="
                    row.sub ? 'text-[6px] font-bold' : 'text-[6.5px] font-black'
                  "
                  :style="{
                    paddingLeft:
                      row.indent === 2
                        ? '10px'
                        : row.indent === 1
                          ? '6px'
                          : '2px',
                  }"
                >
                  <strong v-if="!row.sub">{{ row.label }}</strong>
                  <span v-else>{{ row.label }}</span>
                </TableCell>

                <TableCell
                  class="text-right font-bold px-1 leading-tight text-black"
                >
                  {{ row.val100g }}
                </TableCell>
                <TableCell
                  class="text-right font-black px-1 leading-tight text-black"
                >
                  {{ row.valPortion }}
                </TableCell>
                <TableCell
                  class="text-right font-bold px-1 leading-tight text-black"
                >
                  {{ row.vdr }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <p
            class="text-[5px] text-black font-bold italic px-1 mt-0.5 leading-tight"
          >
            *% del Valor Diario de Referencia con base en una dieta de 2,000
            kcal. Sus necesidades diarias pueden ser mayores o menores.
          </p>
        </CardContent>

        <CardFooter class="flex-shrink-0 p-0 bg-black">
          <div class="w-full px-2 py-1 leading-none">
            <div
              class="flex justify-between text-[6px] gap-4 text-white font-black leading-none"
            >
              <span>Lote: {{ generateLot(label) }}</span>

              <MoleculesBarcode
                :value="internalEan13(label.sku ?? label.id)"
                :height="15"
                :width="0.9"
              />
              <span>Caducidad: {{ generateExpiration(label) }}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </MoleculesButtonWrapper>
  </div>
</template>

<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@common/components/ui/card";
import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@common/components/ui/table";
import { Separator } from "@common/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@common/components/ui/tooltip";
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

function editLabel(label: any) {
  router.push(`/label-generator/${label.id}`);
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
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <style>
          /* 1. Ensure the canvas fills the viewport completely without scrollbars */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            height: 100%;
            background: #transparent;
            overflow: hidden;
          }

          /* 2. Define a clean physical size (230:350 aspect ratio fits perfectly in 65mm x 99mm) */
          @page {
            margin: 0;
            size: 65mm 99mm;
          }

          /* 3. Force your card element to disregard fixed pixels and stretch to 100% of the print canvas */
          .label-card {
            font-family: 'Barlow', Arial, sans-serif;
            width: 100% !important;
            height: 100% !important;
            box-shadow: none !important;
            border: none !important; /* Optional: remove outer border if your sticker edge defines the boundary */
          }

          .label-card .font-black { font-family: 'Oswald', Impact, sans-serif; }

          td, th {
            border: none !important;
            height: auto !important;
            padding-top: 0.5px !important;
            padding-bottom: 0.5px !important;
            line-height: 1.15 !important;
            vertical-align: middle;
          }

          tr { border: none; }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        </style>
      </head>
      <body>${html}</body>
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
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.label-card .font-black {
  font-family: "Oswald", Impact, sans-serif;
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
</style>
