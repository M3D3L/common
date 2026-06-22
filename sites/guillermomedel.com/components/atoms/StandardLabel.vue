<template>
  <Card
    class="label-card bg-white text-black flex flex-col overflow-hidden rounded-sm p-0"
    style="width: 230px; height: 350px; border: 2px solid #000"
  >
    <CardHeader class="p-0 flex-shrink-0 border-b-2 border-black space-y-0">
      <div class="px-1.5 pb-1">
        <div class="flex justify-end gap-1 mb-4 mt-1.5 h-7">
          <div class="flex items-center gap-0.5 px-1 mr-auto">
            <AlertTriangle
              class="w-2.5 h-2.5 text-amber-700 flex-shrink-0 mt-px"
            />
            <p
              class="text-[6px] leading-tight text-black font-black m-0 font-bold"
            >
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
          class="text-center text-[6px] text-black mt-0.5 font-bold italic leading-tight mx-0"
        >
          {{ label.sub }}
        </p>

        <div
          v-if="label.leyendas && label.leyendas.length > 0"
          class="flex flex-col gap-1 px-1 mt-0.5"
        >
          <div
            v-for="(leyenda, i) in label.leyendas"
            :key="i"
            class="leyenda-item bg-black border border-white text-white px-1 py-0.5 text-center uppercase tracking-wide font-black"
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
        class="text-[6px] leading-[1.3] text-black mt-0.5 mx-0 px-1 font-semibold"
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
            <div class="flex justify-between w-full font-black text-[5.8px]">
              <span
                >Cont. neto: <strong>{{ label.total_size }} g</strong></span
              >
              <span
                >Porciones por envase:
                <strong>{{
                  label.total_size && label.portion_size
                    ? Math.round(label.total_size / label.portion_size)
                    : 1
                }}</strong>
                <strong class="ml-1">({{ label.portion_size }} g)</strong>
              </span>
            </div>
          </TableHead>
        </TableRow>
        <TableRow style="background: #fff; border-bottom: 1.5px solid #000">
          <TableCell class="px-1 py-0.5 font-black text-left text-black"
            >Declaración Nutrimental</TableCell
          >
          <TableCell class="px-1 py-0.5 font-black text-right w-14 text-black"
            >Por 100 g</TableCell
          >
          <TableCell class="px-1 py-0.5 font-black text-right w-14 text-black"
            >Por porción</TableCell
          >
          <TableCell class="px-1 py-0.5 font-black text-right w-10 text-black"
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
                  row.indent === 2 ? '10px' : row.indent === 1 ? '6px' : '2px',
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
        class="text-[6px] text-black font-bold italic px-1 mt-0.5 leading-tight"
      >
        *% del Valor Diario de Referencia con base en una dieta de 2,000 kcal.
        Sus necesidades diarias pueden ser mayores o menores.
      </p>
    </CardContent>

    <CardFooter class="flex-shrink-0 p-1 bg-black">
      <div class="w-full px-1 py-0 leading-none">
        <div
          class="flex justify-between items-center text-[5.5px] gap-1 text-white font-black leading-none"
        >
          <span>Lote: {{ generateLot(label) }}</span>

          <MoleculesBarcode
            :value="internalEan13(label.sku ?? label.id)"
            :height="8"
            :width="0.6"
          />
          <span
            >Caducidad:
            {{ label?.expiration || generateExpiration(label) }}</span
          >
        </div>
      </div>
    </CardFooter>
  </Card>
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
  label: any;
}>();
</script>

<style scoped>
/* IMPORTANT: Add font imports here */
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap");

/* Force font-family on the entire card */
.label-card {
  font-family: "Barlow", Arial, sans-serif !important;
}

/* Force Oswald font on all elements with font-black class */
.label-card .font-black,
.label-card .font-black *,
.label-card strong,
.label-card strong *,
.label-card [class*="font-black"] {
  font-family: "Oswald", sans-serif !important;
  font-weight: 700 !important;
}

/* Ensure all text elements use the correct fonts */
.label-card * {
  font-family: inherit;
}

/* Specific fixes for table headers and cells */
.label-card th,
.label-card td {
  font-family: "Barlow", Arial, sans-serif !important;
}

.label-card th.font-black,
.label-card td.font-black,
.label-card th .font-black,
.label-card td .font-black {
  font-family: "Oswald", sans-serif !important;
  font-weight: 700 !important;
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
