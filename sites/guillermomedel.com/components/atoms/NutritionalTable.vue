<template>
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
            >Cont. neto: <strong>{{ totalSize }} g</strong></span
          >
          <span>
            Porciones por envase:
            <strong>{{ portionCount }}</strong>
            <strong class="ml-1">({{ portionSize }} g)</strong>
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
        v-for="row in rows"
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
          :class="row.sub ? 'text-[6px] font-bold' : 'text-[6.5px] font-black'"
          :style="{
            paddingLeft:
              row.indent === 2 ? '10px' : row.indent === 1 ? '6px' : '2px',
          }"
        >
          <strong v-if="!row.sub">{{ row.label }}</strong>
          <span v-else>{{ row.label }}</span>
        </TableCell>
        <TableCell class="text-right font-bold px-1 leading-tight text-black">
          {{ row.val100g }}
        </TableCell>
        <TableCell class="text-right font-black px-1 leading-tight text-black">
          {{ row.valPortion }}
        </TableCell>
        <TableCell class="text-right font-bold px-1 leading-tight text-black">
          {{ row.vdr }}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@common/components/ui/table";

const props = defineProps<{
  rows: any[];
  totalSize: number;
  portionSize: number;
}>();

const portionCount = computed(() =>
  props.totalSize && props.portionSize
    ? Math.round(props.totalSize / props.portionSize)
    : 1,
);
</script>
