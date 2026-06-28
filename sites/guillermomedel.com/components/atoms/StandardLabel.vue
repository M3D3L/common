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

          <div class="relative flex space-x-6">
            <MoleculesSeal :seals="label.seals" grouped />
          </div>
        </div>

        <div class="w-20 mx-auto mb-1">
          <MoleculesSvg src="/icons/tetakawi.svg" />
        </div>

        <div
          class="text-center uppercase font-black text-[13px] tracking-[0.15em] leading-none mb-0.5 text-black"
        >
          BREEZY {{ label?.type + "s" }}
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

      <NutritionalTable
        :rows="label.rows"
        :total-size="label.total_size"
        :portion-size="label.portion_size"
      />

      <p
        class="text-[6px] text-black font-bold italic px-1 mt-0.5 leading-tight"
      >
        *% del Valor Diario de Referencia con base en una dieta de 2,000 kcal.
        Sus necesidades diarias pueden ser mayores o menores.
      </p>
    </CardContent>

    <CardFooter class="flex-shrink-0">
      <div
        class="w-full px-1 flex relative flex-col items-center gap-1 leading-none"
      >
        <div
          class="flex justify-between w-full absolute -bottom-0.5 text-black text-[5.5px] font-black leading-none"
        >
          <span>Lote: {{ generateLot(label) }}</span>
          <span
            >Caducidad:
            {{ label?.expiration || generateExpiration(label) }}</span
          >
        </div>

        <div class="bg-white rounded-sm px-1.5 py-0.5">
          <MoleculesBarcode
            :value="internalEan13(label.sku ?? label.id)"
            :height="18"
            :width="1.1"
          />
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
import { Separator } from "@common/components/ui/separator";
import { AlertTriangle } from "lucide-vue-next";
import {
  generateLot,
  generateExpiration,
} from "~/composables/useNutritionalLabels";
import { internalEan13 } from "~/composables/useBarcode";
import NutritionalTable from "~/components/atoms/NutritionalTable.vue";

const props = defineProps<{
  label: any;
}>();
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600&display=swap");

.label-card {
  font-family: "Barlow", Arial, sans-serif !important;
}

.label-card .font-black,
.label-card .font-black *,
.label-card strong,
.label-card strong *,
.label-card [class*="font-black"] {
  font-family: "Oswald", sans-serif !important;
  font-weight: 700 !important;
}

.label-card * {
  font-family: inherit;
}

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
