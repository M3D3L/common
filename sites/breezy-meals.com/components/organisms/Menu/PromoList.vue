<template>
  <section
    class="js-reveal-item rounded-2xl border border-border/70 bg-card/70 p-3 shadow-sm backdrop-blur"
  >
    <div class="mb-2 flex items-center gap-2">
      <nuxt-link to="/promos" class="flex items-center gap-1 hover:underline">
        <Badge
          variant="outline"
          class="border-primary/30 bg-primary/10 text-[10px] uppercase tracking-wide text-primary"
        >
          Promos
        </Badge>
      </nuxt-link>
      <p class="text-xs font-bold uppercase tracking-wide">
        Promociones disponibles / Available promos
      </p>
    </div>

    <div class="space-y-2">
      <div
        v-for="promo in promoCards"
        :key="promo.id"
        class="js-reveal-item rounded-xl border border-primary/20 bg-background/90 p-3 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p class="font-semibold leading-tight">
              {{ promo.label }}
            </p>
            <p class="text-[11px] text-muted-foreground">
              {{ promo.summary }}
            </p>
          </div>
          <p
            class="shrink-0 text-right text-sm font-bold tabular-nums text-primary"
          >
            {{ money(promo.price) }}
          </p>
        </div>

        <div class="mt-2 space-y-1">
          <div
            v-for="requirement in promo.requirements"
            :key="requirement.id"
            class="flex items-center justify-between gap-2 text-[11px]"
          >
            <p class="text-muted-foreground">
              {{ requirement.current }}/{{ requirement.required }}
              {{ requirement.label }}
            </p>
            <p
              :class="
                requirement.met
                  ? 'font-semibold text-emerald-700'
                  : 'font-semibold text-amber-700'
              "
            >
              {{
                requirement.met
                  ? "Listo / Ready"
                  : `Falta ${requirement.missing} / Missing ${requirement.missing}`
              }}
            </p>
          </div>
        </div>

        <p
          class="mt-2 text-[11px] font-semibold"
          :class="
            promo.appliedQty > 0
              ? 'text-emerald-700'
              : promo.eligible
                ? 'text-sky-700'
                : 'text-amber-700'
          "
        >
          {{
            promo.appliedQty > 0
              ? `Combo activado / Combo active: ${promo.label}${
                  promo.appliedQty > 1 ? ` x${promo.appliedQty}` : ""
                }`
              : promo.eligible
                ? "Cumple requisitos, pero comparte guarniciones/bebida con otras promos activas. / Meets requirements, but shares sides/drink with other active promos."
                : `Te falta / Missing: ${promo.missingTextEs} / ${promo.missingTextEn}`
          }}
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Badge } from "@common/components/ui/badge";
import type { PromoProgressCard } from "~/composables/useMenuPricing";

defineProps<{
  promoCards: PromoProgressCard[];
  money: (value: number) => string;
}>();
</script>
