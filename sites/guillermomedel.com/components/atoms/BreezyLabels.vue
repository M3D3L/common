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
        class="label-card bg-[#ede8d8] text-[#111] flex flex-col overflow-hidden rounded-sm p-0"
        style="width: 230px; height: 350px; border: 1.5px solid #444"
      >
        <CardHeader
          class="p-0 flex-shrink-0 border-b-2 border-[#111] space-y-0"
        >
          <div class="px-1.5 pb-1">
            <div class="flex justify-end gap-1 mb-2 mt-1.5 h-7">
              <div class="flex items-center gap-0.5 px-1 mr-auto">
                <AlertTriangle
                  class="w-2 h-2 text-amber-700 flex-shrink-0 mt-px"
                />
                <p class="text-[5px] leading-[1.25] text-[#555] m-0">
                  <strong class="font-bold">Alérgenos:</strong> {{ label.alg }}
                </p>
              </div>
              <TooltipProvider v-for="(seal, i) in label.seals" :key="i">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <svg
                      class="flex-shrink-0 cursor-default"
                      width="30"
                      height="30"
                      viewBox="0 0 44 44"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <!-- White border -->
                      <polygon
                        points="12,0 32,0 44,12 44,32 32,44 12,44 0,32 0,12"
                        fill="white"
                      />

                      <!-- Black octagon -->
                      <polygon
                        points="13,1 31,1 43,13 43,31 31,43 13,43 1,31 1,13"
                        fill="#111"
                      />

                      <text
                        v-for="(line, li) in seal.lines"
                        :key="li"
                        :x="22"
                        :y="seal.ys[li]"
                        :font-size="
                          line.toLowerCase().includes('saturada') ? 4.5 : 6
                        "
                        text-anchor="middle"
                        fill="white"
                        font-weight="bold"
                        font-family="Oswald, Arial, sans-serif"
                      >
                        {{ line }}
                      </text>
                    </svg>
                  </TooltipTrigger>
                  <TooltipContent side="top" class="text-[9px]">
                    {{ seal.lines.join(" ") }}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="450.000000pt"
              height="150.000000pt"
              viewBox="0 0 450.000000 150.000000"
              preserveAspectRatio="xMidYMid meet"
              class="w-24 h-auto mx-auto"
            >
              <g
                transform="translate(0.000000,150.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
              >
                <path
                  d="M2243 1378 c-11 -13 -37 -69 -58 -124 l-37 -102 -56 3 c-50 2 -57 5
-65 28 -29 88 -116 -3 -131 -138 -4 -33 -16 -79 -28 -102 -29 -63 -142 -162
-243 -213 -47 -25 -114 -70 -149 -101 -53 -47 -79 -61 -162 -90 -55 -18 -169
-68 -255 -111 -162 -81 -237 -104 -298 -94 -60 9 -170 -14 -266 -56 -49 -22
-121 -52 -160 -65 -72 -26 -72 -26 -222 -6 -60 7 -113 -12 -113 -42 0 -23 0
-23 50 -8 40 12 61 12 101 4 96 -21 130 -15 312 55 l172 67 132 7 132 6 153
77 c84 42 206 96 270 121 64 24 128 52 141 62 13 11 48 38 76 61 29 24 87 61
130 83 142 74 239 182 262 290 21 103 32 140 45 151 13 11 22 -11 42 -106 15
-73 49 -51 67 43 7 36 8 36 36 21 33 -17 63 11 89 83 12 34 34 88 47 118 22
50 26 53 37 37 8 -9 16 -36 20 -58 9 -57 39 -111 78 -141 23 -18 43 -49 66
-107 27 -64 39 -82 58 -87 29 -7 56 13 74 57 23 55 34 37 92 -156 39 -132 59
-162 123 -190 29 -13 78 -46 110 -74 32 -28 74 -55 93 -60 37 -11 98 -2 171
23 74 27 89 22 209 -64 62 -44 130 -89 152 -100 47 -24 116 -26 167 -5 40 17
90 19 125 6 13 -5 71 -47 130 -94 136 -108 193 -136 310 -148 50 -5 116 -16
148 -24 73 -19 72 -19 68 7 -4 28 -48 43 -189 62 -139 20 -189 42 -299 136
-47 39 -105 81 -130 92 -53 25 -127 26 -189 4 -24 -9 -54 -16 -67 -16 -21 0
-90 44 -264 166 -59 41 -69 45 -110 41 -25 -3 -73 -15 -107 -27 -86 -31 -119
-23 -193 45 -33 30 -72 57 -87 61 -66 15 -110 84 -144 220 -27 109 -52 161
-84 176 -30 14 -50 0 -70 -50 -8 -18 -20 -32 -27 -30 -6 2 -24 35 -40 74 -20
50 -40 80 -73 109 -39 35 -47 49 -65 119 -12 44 -23 83 -26 88 -10 16 -61 8
-81 -14z"
                />
              </g>
            </svg>

            <div
              class="text-center font-black text-[13px] tracking-[0.15em] leading-none mb-0.5"
            >
              BREEZY MEALS
            </div>

            <div class="flex items-center gap-1 justify-center">
              <Separator class="flex-1 max-w-[12px] bg-[#111]" />
              <span
                class="font-black tracking-[0.1em] leading-tight text-center"
                :style="{ fontSize: label.nameSize }"
                >{{ label.name }}</span
              >
              <Separator class="flex-1 max-w-[12px] bg-[#111]" />
            </div>

            <p
              class="text-center text-[5.5px] text-[#555] mt-0.5 italic leading-tight mx-0 mb-1"
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
                class="bg-black border border-white text-white px-1 py-0.5 text-center uppercase tracking-wide font-bold"
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
          class="flex-1 flex flex-col gap-0.5 px-1.5 py-1 overflow-hidden p-0"
        >
          <p class="text-[5.5px] leading-[1.3] text-[#111] mt-1 mx-0 px-1">
            <strong class="font-bold">Ingredientes:</strong> {{ label.ing }}
          </p>

          <Table
            class="nom-table w-full text-[6.5px]"
            style="border: 1px solid #111; border-collapse: collapse"
          >
            <TableRow class="border-0">
              <TableHead
                colspan="4"
                class="px-1 py-0.5 text-[#111] h-auto leading-tight"
                style="background: #d8d2c0; border-bottom: 1px solid #111"
              >
                <div
                  class="flex justify-between w-full font-normal text-[5.8px]"
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
            <TableRow style="background: #eee; border-bottom: 1px solid #111">
              <TableCell class="px-1 py-0.5 font-bold text-left"
                >Declaración Nutrimental</TableCell
              >
              <TableCell class="px-1 py-0.5 font-bold text-right w-14"
                >Por 100 g</TableCell
              >
              <TableCell class="px-1 py-0.5 font-bold text-right w-14"
                >Por porción</TableCell
              >
              <TableCell class="px-1 py-0.5 font-bold text-right w-10"
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
                    ? '1px solid #111'
                    : row.sub
                      ? '0.4px solid #eee'
                      : '0.75px solid #111',
                }"
              >
                <TableCell
                  class="px-1 m-0 leading-tight"
                  :class="
                    row.sub
                      ? 'text-[6px] text-[#555]'
                      : 'text-[6.5px] font-semibold'
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

                <TableCell class="text-right font-medium px-1 leading-tight">
                  {{ row.val100g }}
                </TableCell>
                <TableCell
                  class="text-right font-bold px-1 leading-tight text-neutral-800"
                >
                  {{ row.valPortion }}
                </TableCell>
                <TableCell
                  class="text-right font-medium px-1 leading-tight text-neutral-500"
                >
                  {{ row.vdr }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <p class="text-[4.5px] text-[#777] italic px-1 mt-0.5 leading-tight">
            *% del Valor Diario de Referencia con base en una dieta de 2,000
            kcal. Sus necesidades diarias pueden ser mayores o menores.
          </p>
        </CardContent>

        <CardFooter class="flex-shrink-0 p-0" style="background: #111">
          <div class="w-full px-2 py-1 leading-none">
            <div
              class="flex justify-between text-[4px] text-neutral-400 leading-none"
            >
              <span>Lote: {{ generateLot(label) }}</span>
              <span>Caducidad: {{ generateExpiration(label) }}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </MoleculesButtonWrapper>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
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
          body {
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 12mm;
            font-family: 'Barlow', Arial, sans-serif;
          }

          @page { margin: 0; size: auto; }

          .label-card { font-family: 'Barlow', Arial, sans-serif; }
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
