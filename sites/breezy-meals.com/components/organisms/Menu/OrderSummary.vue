<template>
  <section>
    <h2
      class="mb-2 inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/80"
    >
      Totales / Pricing totals
    </h2>
    <Card class="rounded-2xl border-border/70 bg-card/85 p-4 shadow-sm">
      <div class="space-y-3">
        <div
          v-for="line in lines"
          :key="`${line.kind}-${line.code}`"
          class="flex items-start justify-between gap-3"
        >
          <div class="min-w-0 flex-1">
            <p class="font-semibold leading-tight">{{ line.label }}</p>
            <p class="text-[11px] text-muted-foreground">
              {{ line.qty }} x
              {{ line.unitPrice > 0 ? money(line.unitPrice) : "Incluido" }}
            </p>
            <p v-if="line.detail" class="text-[11px] text-muted-foreground">
              Incluye: {{ line.detail }}
            </p>
          </div>
          <p class="shrink-0 text-right font-semibold tabular-nums">
            {{ line.total > 0 ? money(line.total) : "Incluido" }}
          </p>
        </div>

        <Separator />

        <div
          class="flex items-center justify-between text-sm text-muted-foreground"
        >
          <span>Total de piezas / Items</span>
          <span class="font-semibold tabular-nums">{{ totalQty }}</span>
        </div>

        <div class="flex items-center justify-between gap-3">
          <p class="font-bold uppercase tracking-wide">Total</p>
          <p class="text-lg font-bold tabular-nums">
            {{ money(total) }}
          </p>
        </div>
      </div>
    </Card>
  </section>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Separator } from "@common/components/ui/separator";
import type { PricingLine } from "~/utils/menuPricing";

defineProps<{
  lines: PricingLine[];
  money: (value: number) => string;
  totalQty: number;
  total: number;
}>();
</script>
