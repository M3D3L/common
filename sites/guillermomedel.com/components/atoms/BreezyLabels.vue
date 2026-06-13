<template>
  <div class="page-root min-h-screen bg-neutral-800 p-4">
    <!-- Toolbar (hidden when printing) -->
    <div class="no-print flex justify-center mb-4">
      <button
        @click="downloadPdf"
        class="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-xs font-semibold text-neutral-900 shadow hover:bg-neutral-200 transition-colors"
      >
        <Printer class="w-4 h-4" />
        Descargar PDF
      </button>
    </div>

    <!-- Page Header -->
    <div class="no-print text-center mb-5">
      <Badge
        variant="outline"
        class="mb-2 text-neutral-400 border-neutral-600 tracking-widest text-[9px] uppercase px-3"
      >
        <UtensilsCrossed class="w-2.5 h-2.5 mr-1" />
        NOM-051-SCFI/SSA1-2010
      </Badge>
      <h1
        class="font-black text-white text-lg tracking-[0.2em] uppercase mb-0.5"
      >
        Breezy Meals
      </h1>
      <p class="text-neutral-500 text-[8px] tracking-widest uppercase">
        Etiquetas Nutricionales · 150 g por porción
      </p>
    </div>

    <!-- Stats Bar -->
    <div class="no-print flex justify-center gap-2 mb-5">
      <Badge variant="secondary" class="text-[8px] gap-1 px-2 py-0.5">
        <Package class="w-2.5 h-2.5" />
        {{ labels.length }} productos
      </Badge>
      <Badge variant="secondary" class="text-[8px] gap-1 px-2 py-0.5">
        <Flame class="w-2.5 h-2.5" />
        150 g / porción
      </Badge>
      <Badge variant="secondary" class="text-[8px] gap-1 px-2 py-0.5">
        <Snowflake class="w-2.5 h-2.5" />
        −18 °C
      </Badge>
    </div>

    <!-- Label Grid -->
    <div class="label-grid flex flex-wrap gap-3 justify-center">
      <Card
        v-for="label in labels"
        :key="label.id"
        class="label-card bg-[#ede8d8] text-[#111] flex flex-col overflow-hidden rounded-sm p-0"
        style="width: 230px; height: 350px; border: 1.5px solid #444"
      >
        <CardHeader
          class="p-0 flex-shrink-0 border-b-2 border-[#111] space-y-0"
        >
          <div class="px-2 pt-1 pb-1">
            <!-- Warning seals -->
            <div class="flex justify-center gap-1 mb-1">
              <TooltipProvider v-for="(seal, i) in label.seals" :key="i">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <svg
                      class="flex-shrink-0 cursor-default"
                      width="27"
                      height="27"
                      viewBox="0 0 44 44"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polygon
                        points="13,1 31,1 43,13 43,31 31,43 13,43 1,31 1,13"
                        fill="#111"
                      />
                      <text
                        v-for="(line, li) in seal.lines"
                        :key="li"
                        :x="22"
                        :y="seal.ys[li]"
                        :font-size="seal.sizes[li]"
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

            <!-- Brand -->
            <div
              class="text-center font-black text-[13px] tracking-[0.15em] leading-none mb-0.5"
            >
              BREEZY MEALS
            </div>

            <!-- Product name -->
            <div class="flex items-center gap-1 justify-center">
              <Separator class="flex-1 max-w-[12px] bg-[#111]" />
              <span
                class="font-black tracking-[0.1em] leading-tight text-center"
                :style="{ fontSize: label.nameSize }"
                >{{ label.name }}</span
              >
              <Separator class="flex-1 max-w-[12px] bg-[#111]" />
            </div>

            <!-- Subtitle -->
            <p
              class="text-center text-[5.5px] text-[#555] mt-0.5 italic leading-tight m-0"
            >
              {{ label.sub }}
            </p>
          </div>
        </CardHeader>

        <CardContent
          class="flex-1 flex flex-col gap-0.5 px-1.5 py-1 overflow-hidden p-0"
        >
          <!-- Ingredients -->
          <p class="text-[5.5px] leading-[1.3] text-[#111] m-0 px-1">
            <strong class="font-bold">Ingredientes:</strong> {{ label.ing }}
          </p>

          <!-- Allergens -->
          <div class="flex items-start gap-0.5 px-1">
            <AlertTriangle class="w-2 h-2 text-amber-700 flex-shrink-0 mt-px" />
            <p class="text-[5px] leading-[1.25] text-[#555] m-0">
              <strong class="font-bold">Alérgenos:</strong> {{ label.alg }}
            </p>
          </div>

          <!-- Pairing -->
          <div
            class="flex items-center gap-0.5 border-t border-b border-dashed border-[#aaa] py-0.5 px-1"
          >
            <UtensilsCrossed class="w-2 h-2 text-[#888] flex-shrink-0" />
            <p class="text-[5px] text-[#666] italic m-0 leading-tight">
              {{ label.pair }}
            </p>
          </div>

          <!-- NOM Table -->
          <Table
            class="nom-table w-full text-[5.5px]"
            style="border: 1px solid #111; border-collapse: collapse"
          >
            <TableHeader>
              <TableRow class="border-0">
                <TableHead
                  colspan="2"
                  class="text-left text-[6px] font-bold tracking-wide px-1 py-0.5 text-white h-auto leading-tight"
                  style="background: #111; border: none"
                >
                  INFORMACIÓN NUTRICIONAL
                </TableHead>
                <TableHead
                  class="text-right text-[6px] font-bold px-1 py-0.5 text-white w-5 h-auto leading-tight"
                  style="background: #111; border: none"
                >
                  % VD*
                </TableHead>
              </TableRow>
              <TableRow class="border-0">
                <TableHead
                  colspan="3"
                  class="px-1 py-0.5 font-semibold text-[5.5px] text-[#111] h-auto leading-tight"
                  style="background: #d8d2c0; border-bottom: 1px solid #111"
                >
                  Porción: 1 (150 g) · Porciones: 1
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="row in label.rows"
                :key="row.label"
                class="border-0"
                :style="{
                  borderBottom: row.last
                    ? '1px solid #111'
                    : row.sub
                      ? '0.4px solid #ccc'
                      : '0.75px solid #111',
                }"
              >
                <TableCell
                  colspan="2"
                  class="px-1 m-0 leading-tight"
                  :class="
                    row.sub
                      ? 'text-[5px] text-[#444]'
                      : 'text-[5.5px] font-semibold'
                  "
                  :style="{
                    paddingLeft:
                      row.indent === 2
                        ? '13px'
                        : row.indent === 1
                          ? '8px'
                          : '4px',
                  }"
                >
                  <strong v-if="!row.sub">{{ row.label }}</strong>
                  <span v-else>{{ row.label }}</span>
                </TableCell>
                <TableCell
                  class="text-right font-bold w-5 px-1 leading-tight"
                  :class="row.sub ? 'text-[5px]' : 'text-[5.5px]'"
                >
                  {{ row.pct }}
                </TableCell>
              </TableRow>
              <TableRow class="border-0">
                <TableCell
                  colspan="3"
                  class="text-[4.5px] leading-[1.25] px-1 py-0.5 text-[#777]"
                  style="background: #ddd8c8; border-top: 0.5px solid #999"
                >
                  *% VD basados en dieta de 2,000 kcal.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>

        <!-- Footer (minimal) -->
        <CardFooter class="flex-shrink-0 p-0" style="background: #111">
          <div class="w-full px-2 py-1 leading-none">
            <div
              class="flex justify-between text-[4px] text-neutral-400 leading-none"
            >
              <span>Lote: ______</span>
              <span>Prod: ______</span>
              <span>Vence: ______</span>
            </div>
            <p
              class="text-[3.5px] text-neutral-600 text-center tracking-wide leading-none m-0 mt-0.5"
            >
              BREEZY MEALS · México · Sin conservadores · −18 °C · NOM-051
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup>
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UtensilsCrossed,
  Flame,
  Snowflake,
  Package,
  AlertTriangle,
  Printer,
} from "lucide-vue-next";

// ── actions ────────────────────────────────────────────────
function downloadPdf() {
  // Opens the browser's print dialog — choose "Save as PDF" (or
  // "Microsoft Print to PDF") as the destination to get a file.
  window.print();
}

// ── helpers ────────────────────────────────────────────────
function makeSeal(rawLines) {
  const lines = rawLines.split("\n");
  const n = lines.length;
  const configs = {
    1: { ys: [26], sizes: [9] },
    2: { ys: [19, 30], sizes: [6, 8] },
    3: { ys: [15, 24, 33], sizes: [5.5, 7, 7] },
  };
  return { lines, ...configs[n] };
}

function nameSize(name) {
  const n = name.length;
  if (n <= 8) return "12px";
  if (n <= 16) return "9px";
  if (n <= 22) return "7.5px";
  return "6px";
}

function rows({
  kcal,
  kj,
  pkcal,
  prot,
  pprot,
  fat,
  pfat,
  sat,
  psat,
  trans,
  carb,
  pcarb,
  sugt,
  suga,
  psuga,
  fib,
  sod,
  psod,
}) {
  return [
    { label: `Energía: ${kcal} kcal (${kj} kJ)`, pct: `${pkcal}%`, sub: false },
    { label: `Proteínas: ${prot} g`, pct: `${pprot}%`, sub: false },
    { label: `Grasas totales: ${fat} g`, pct: `${pfat}%`, sub: false },
    { label: `— saturadas: ${sat} g`, pct: `${psat}%`, sub: true, indent: 1 },
    { label: `— trans: ${trans} g`, pct: "", sub: true, indent: 1 },
    { label: `Carbohidratos: ${carb} g`, pct: `${pcarb}%`, sub: false },
    { label: `— azúcares tot.: ${sugt} g`, pct: "", sub: true, indent: 1 },
    {
      label: `— azúcares añadidos: ${suga} g`,
      pct: `${psuga}%`,
      sub: true,
      indent: 2,
    },
    { label: `— fibra: ${fib} g`, pct: "", sub: true, indent: 1 },
    { label: `Sodio: ${sod} mg`, pct: `${psod}%`, sub: false, last: true },
  ];
}

// ── data ───────────────────────────────────────────────────
const rawLabels = [
  {
    id: "birria",
    name: "BIRRIA DE RES",
    sub: "Guiso de Res / Shredded Beef",
    pair: "Frijoles Rancheros + Vegetales Rostizados",
    ing: "Diezmillo de res, chile guajillo seco, chile ancho seco, caldo de res, ajo, orégano mexicano, comino molido, sal yodada.",
    alg: "Contiene: Apio. Puede contener trazas de: Gluten, lácteos.",
    seals: ["EXCESO\nSODIO", "EXCESO\nGRASAS\nSATURADAS", "EXCESO\nCALORÍAS"],
    kcal: "315",
    kj: "1,317",
    pkcal: "16",
    prot: "28.0",
    pprot: "56",
    fat: "21.0",
    pfat: "27",
    sat: "8.4",
    psat: "42",
    trans: "0.0",
    carb: "5.0",
    pcarb: "2",
    sugt: "2.0",
    suga: "0.0",
    psuga: "0",
    fib: "1.0",
    sod: "890",
    psod: "39",
  },
  {
    id: "cochinita",
    name: "COCHINITA PIBIL",
    sub: "Guiso de Cerdo / Shredded Pork",
    pair: "Frijoles Rancheros + Vegetales Rostizados",
    ing: "Espaldilla de cerdo, pasta de achiote (axiote, especias, vinagre, sal), jugo de naranja agria, ajo, orégano mexicano, comino molido, sal yodada.",
    alg: "Puede contener trazas de: Gluten, lácteos, huevo.",
    seals: ["EXCESO\nSODIO", "EXCESO\nGRASAS\nSATURADAS", "EXCESO\nCALORÍAS"],
    kcal: "300",
    kj: "1,255",
    pkcal: "15",
    prot: "24.0",
    pprot: "48",
    fat: "19.0",
    pfat: "25",
    sat: "7.0",
    psat: "35",
    trans: "0.0",
    carb: "8.0",
    pcarb: "3",
    sugt: "4.0",
    suga: "0.0",
    psuga: "0",
    fib: "0.0",
    sod: "750",
    psod: "33",
  },
  {
    id: "lasagna",
    name: "LASAÑA DE CALABACITA",
    sub: "Lasaña con Carne / Zucchini Lasagna",
    pair: "Puré de Papa + Vegetales Rostizados",
    ing: "Carne molida de res, calabacita italiana, queso mozzarella (leche pasteurizada de vaca, sal, cultivos lácticos, cuajo), puré de tomate, zanahoria, cebolla blanca, apio, ajo, orégano, albahaca, sal, pimienta negra, azúcar.",
    alg: "Contiene: Gluten (trigo), Leche. Puede contener: Huevo, soya.",
    seals: ["EXCESO\nSODIO", "EXCESO\nGRASAS\nSATURADAS"],
    kcal: "280",
    kj: "1,171",
    pkcal: "14",
    prot: "18.0",
    pprot: "36",
    fat: "17.0",
    pfat: "22",
    sat: "8.0",
    psat: "40",
    trans: "0.0",
    carb: "10.0",
    pcarb: "4",
    sugt: "3.0",
    suga: "1.0",
    psuga: "2",
    fib: "2.0",
    sod: "520",
    psod: "23",
  },
  {
    id: "meatloaf",
    name: "HOME-STYLE MEATLOAF",
    sub: "Pastel de Carne / Meat Loaf",
    pair: "Puré de Papa + Vegetales Rostizados",
    ing: "Carne molida mixta (res, cerdo), pan molido (harina de trigo, sal, levadura), huevo entero pasteurizado, catsup, miel de abeja, mostaza amarilla, ajo en polvo, cebolla en polvo, sal, pimienta negra.",
    alg: "Contiene: Gluten (trigo), Huevo, Mostaza, Leche. Puede contener: Soya.",
    seals: ["EXCESO\nSODIO", "EXCESO\nGRASAS\nSATURADAS", "EXCESO\nCALORÍAS"],
    kcal: "320",
    kj: "1,338",
    pkcal: "16",
    prot: "22.0",
    pprot: "44",
    fat: "20.0",
    pfat: "26",
    sat: "9.0",
    psat: "45",
    trans: "0.3",
    carb: "12.0",
    pcarb: "4",
    sugt: "5.0",
    suga: "3.0",
    psuga: "6",
    fib: "0.0",
    sod: "720",
    psod: "31",
  },
  {
    id: "chipotle",
    name: "CHIPOTLE CREAM CHICKEN",
    sub: "Pollo en Crema Chipotle / Chipotle Chicken",
    pair: "Arroz Mexicano + Vegetales Rostizados",
    ing: "Pechuga de pollo, crema para cocinar (leche descremada pasteurizada, grasa de leche), queso crema, chile chipotle en adobo, cebolla blanca, ajo, comino molido, sal, pimienta negra.",
    alg: "Contiene: Leche (lácteos). Puede contener: Gluten, huevo, soya.",
    seals: ["EXCESO\nSODIO", "EXCESO\nGRASAS\nSATURADAS", "EXCESO\nCALORÍAS"],
    kcal: "310",
    kj: "1,297",
    pkcal: "16",
    prot: "26.0",
    pprot: "52",
    fat: "19.0",
    pfat: "25",
    sat: "9.0",
    psat: "45",
    trans: "0.0",
    carb: "6.0",
    pcarb: "2",
    sugt: "2.0",
    suga: "0.0",
    psuga: "0",
    fib: "0.0",
    sod: "600",
    psod: "26",
  },
  {
    id: "mushroom",
    name: "MUSHROOM BACON CREAM",
    sub: "Pollo con Champiñones / Bacon Mushroom Chicken",
    pair: "Puré de Papa + Vegetales Rostizados",
    ing: "Pechuga de pollo, champiñones blancos, tocino (carne de cerdo curada, sal, azúcar, nitritos de sodio), crema para cocinar, queso crema, ajo, cebolla blanca, tomillo seco, sal, pimienta negra.",
    alg: "Contiene: Leche (lácteos). Puede contener: Gluten, huevo, soya.",
    seals: ["EXCESO\nSODIO", "EXCESO\nGRASAS\nSATURADAS", "EXCESO\nCALORÍAS"],
    kcal: "350",
    kj: "1,464",
    pkcal: "18",
    prot: "24.0",
    pprot: "48",
    fat: "25.0",
    pfat: "32",
    sat: "13.0",
    psat: "65",
    trans: "0.0",
    carb: "4.0",
    pcarb: "1",
    sugt: "1.0",
    suga: "0.0",
    psuga: "0",
    fib: "0.0",
    sod: "650",
    psod: "28",
  },
  {
    id: "bistec",
    name: "BISTEC RANCHERO",
    sub: "Guiso de Res con Papa / Beef and Potato",
    pair: "Sopa de Lentejas + Vegetales Rostizados",
    ing: "Milanesa bola de res, papa blanca, jitomate bola, cebolla blanca, chile serrano, ajo, caldo de res, sal yodada, pimienta negra molida.",
    alg: "Contiene: Apio. Puede contener: Gluten, lácteos, huevo.",
    seals: ["EXCESO\nSODIO"],
    kcal: "260",
    kj: "1,088",
    pkcal: "13",
    prot: "22.0",
    pprot: "44",
    fat: "9.0",
    pfat: "12",
    sat: "3.5",
    psat: "18",
    trans: "0.0",
    carb: "18.0",
    pcarb: "7",
    sugt: "4.0",
    suga: "0.0",
    psuga: "0",
    fib: "2.0",
    sod: "680",
    psod: "30",
  },
  {
    id: "chicharron",
    name: "CHICHARRÓN EN SALSA VERDE",
    sub: "Estilo Casero / Pork Rinds in Green Sauce",
    pair: "Arroz Mexicano + Frijoles Rancheros + Vegetales",
    ing: "Chicharrón de cerdo (piel de cerdo frita, sal yodada), tomatillo verde fresco, cebolla blanca, chile serrano, cilantro fresco, ajo, sal yodada, pimienta negra molida.",
    alg: "Contiene: Apio. Puede contener: Gluten, lácteos, huevo, soya.",
    seals: ["EXCESO\nSODIO", "EXCESO\nGRASAS\nSATURADAS", "EXCESO\nCALORÍAS"],
    kcal: "380",
    kj: "1,590",
    pkcal: "19",
    prot: "22.0",
    pprot: "44",
    fat: "28.0",
    pfat: "36",
    sat: "10.0",
    psat: "50",
    trans: "0.0",
    carb: "8.0",
    pcarb: "3",
    sugt: "3.0",
    suga: "0.0",
    psuga: "0",
    fib: "2.0",
    sod: "780",
    psod: "34",
  },
];

const labels = rawLabels.map((d) => ({
  ...d,
  nameSize: nameSize(d.name),
  seals: d.seals.map(makeSeal),
  rows: rows(d),
}));
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

/* ── Table reset ───────────────────────────────────────────
   shadcn's Table base sets line-height via `text-sm` (~20px),
   which the arbitrary text-[5.5px] sizes do NOT override (they
   only set font-size). That inherited line-height is what blew
   the table up. Force a tight line-height + minimal vertical
   padding and kill shadcn's default cell borders/heights. */
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
}

/* The shadcn Table wrapper adds overflow-auto; with everything
   fitting we don't want a stray scrollbar. */
.label-card :deep(.nom-table) {
  overflow: visible;
}

@media print {
  @page {
    margin: 12mm;
  }

  /* Hide on-screen-only chrome (toolbar, header, stats) */
  .no-print {
    display: none !important;
  }

  /* Neutralize the dark page shell */
  .page-root {
    background: #fff !important;
    padding: 0 !important;
    min-height: 0 !important;
  }

  /* Collapse the wrapped grid into a single centered column */
  .label-grid {
    display: flex !important;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    align-items: center !important;
    gap: 6mm !important;
  }

  /* Keep each label intact across page boundaries */
  .label-card {
    break-inside: avoid;
    page-break-inside: avoid;
    box-shadow: none !important;
    border: 1.5px solid #444 !important;
  }

  /* Force backgrounds/black bars to actually print */
  .label-card,
  .label-card * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
