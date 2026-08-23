<template>
  <Card
    class="label-card bg-white relative text-black items-center rounded-full aspect-square overflow-hidden p-3 text-center border-2 border-black"
    style="width: 192px; height: 192px"
  >
    <div
      class="justify-center flex w-[5.5rem] gap-0.5 text-center items-center left-8 absolute top-7"
    >
      <AlertTriangle class="w-2.5 h-2.5 text-black font-bold" />
      <p class="text-[6px] leading-tight text-black font-black">
        <strong class="font-black">Alérgenos:</strong>
        {{ label.alg || "Ninguno" }}
      </p>
    </div>

    <div class="w-full flex flex-col items-center mt-1">
      <div class="flex justify-between items-center w-full px-2 h-5 mb-0.5">
        <div
          v-if="label.seals && label.seals.length > 0"
          class="flex-shrink-0 absolute top-4 right-7 mt-1 mr-1"
        >
          <MoleculesSeal
            width="32"
            height="32"
            fontSize="8"
            size="small"
            :seal="sellosSeal(label.seals.length)"
          />
        </div>
      </div>

      <div class="w-12 mx-auto mt-2">
        <MoleculesSvg src="/icons/tetakawi.svg" />
      </div>

      <div
        class="font-black text-[10px] uppercase tracking-[0.12em] leading-none mb-0.5 text-black"
      >
        BREEZY {{ label?.type + "s" }}
      </div>

      <div class="flex items-center gap-1 justify-center w-full px-2">
        <Separator class="flex-1 max-w-[8px] bg-black" />
        <span
          class="font-black tracking-[0.05em] leading-tight text-center text-black text-[11px]"
          :style="{
            fontSize: label.nameSize
              ? `calc(${label.nameSize} * 0.85)`
              : '11px',
          }"
          >{{ label.name }}</span
        >
        <Separator class="flex-1 max-w-[8px] bg-black" />
      </div>
    </div>

    <div class="w-full flex flex-col gap-0.5 px-2 my-auto">
      <p
        :class="label.ing.length > 76 ? 'text-[5px]' : 'text-[6px]'"
        class="leading-[1.2] text-black m-0 line-clamp-2 px-1 font-semibold"
      >
        <strong class="font-black">Ing:</strong> {{ label.ing }}
      </p>

      <div
        v-if="label.leyendas && label.leyendas.length > 0"
        class="flex flex-col gap-1 mt-0.5 px-1"
      >
        <div
          v-for="(leyenda, i) in label.leyendas"
          :key="i"
          class="bg-black border border-white text-white px-1 py-0.5 text-center uppercase tracking-wide font-black"
          style="box-shadow: 0 0 0 1px black"
        >
          <p class="text-[4px] leading-none m-0">{{ leyenda.text }}</p>
        </div>
      </div>
    </div>

    <div class="flex relative">
      <div
        class="text-[5.5px] absolute left-0 right-0 z-100 mt-1 font-black max-w-20 mx-auto leading-none bg-black text-white px-1.5 py-0.5 rounded-sm"
      >
        Cont. Neto: {{ label.total_size }} g
      </div>

      <div
        class="flex flex-col mt-2 z-1 space-y-0! justify-between items-center text-[4.5px] w-full px-1 text-black font-bold"
      >
        <MoleculesBarcode
          :value="internalEan13(label.sku ?? label.id)"
          :width="1.2"
          :height="20"
        />
      </div>
    </div>

    <!-- Lot — curves along the bottom-right -->
    <svg
      class="absolute transform ml-2 rotate-[-60deg] inset-0 w-full h-full"
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="pointer-events: none"
      aria-hidden="true"
    >
      <defs>
        <path
          :id="`arcRight-${label.id}`"
          d="M 96,176 A 80,80 0 0 0 165,136"
          fill="none"
        />
      </defs>
      <text
        font-size="6"
        font-weight="800"
        fill="black"
        font-family="Barlow, Arial, sans-serif"
        letter-spacing="0.4"
        text-anchor="end"
      >
        <textPath
          :href="`#arcRight-${label.id}`"
          :xlink:href="`#arcRight-${label.id}`"
          startOffset="92%"
        >
          Lote: {{ generateLot(label) }}
        </textPath>
      </text>
    </svg>

    <!-- Expiration — curves along the bottom-left -->
    <svg
      class="absolute left-[-8px] transform rotate-[60deg] inset-0 w-full h-full"
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="pointer-events: none"
      aria-hidden="true"
    >
      <defs>
        <path
          :id="`arcLeft-${label.id}`"
          d="M 27,136 A 80,80 0 0 0 96,176"
          fill="none"
        />
      </defs>
      <text
        font-size="6"
        font-weight="800"
        fill="black"
        font-family="Barlow, Arial, sans-serif"
        letter-spacing="0.4"
      >
        <textPath
          :href="`#arcLeft-${label.id}`"
          :xlink:href="`#arcLeft-${label.id}`"
          startOffset="26%"
        >
          Cad: {{ label?.expiration || generateExpiration(label) }}
        </textPath>
      </text>
    </svg>
  </Card>
</template>

<script setup lang="ts">
import { Card } from "@common/components/ui/card";
import { Separator } from "@common/components/ui/separator";
import { AlertTriangle } from "lucide-vue-next";
import {
  generateLot,
  generateExpiration,
} from "~/composables/useNutritionalLabels";
import { internalEan13 } from "~/composables/useBarcode";

defineProps<{
  label: any;
}>();

function sellosSeal(count: number): { lines: string[]; ys: number[] } {
  const word = count === 1 ? "Sello" : "Sellos";
  return {
    lines: [String(count), word],
    ys: [20, 29],
  };
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow:wght@400;600;800&display=swap");

.label-card {
  font-family: "Barlow", Arial, sans-serif;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.label-card .font-black {
  font-family: "Oswald", Impact, sans-serif;
}
</style>
