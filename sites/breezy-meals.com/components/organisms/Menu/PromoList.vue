<template>
  <section
    v-if="buildablePromoCards.length"
    class="js-reveal-item border-y border-primary/15 py-5"
  >
    <div class="mb-4 flex items-end justify-between gap-4">
      <div class="flex min-w-0 items-center gap-3">
        <span
          class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary/20 text-primary"
        >
          <ShoppingBasket class="h-5 w-5" />
        </span>
        <div>
          <p
            class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            Promociones
          </p>
          <h2 class="text-xl font-bold leading-tight text-primary">
            Arma tu combo
          </h2>
        </div>
      </div>
      <NuxtLink
        to="/promos"
        class="shrink-0 text-xs font-semibold text-primary underline-offset-4 hover:underline"
      >
        Ver detalles
      </NuxtLink>
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <Button
        v-for="promo in buildablePromoCards"
        :key="promo.id"
        type="button"
        variant="outline"
        class="js-reveal-item group h-auto min-h-20 w-full justify-start gap-3 rounded-lg border-primary/20 px-3 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
        :class="
          promo.id === activePromoId && 'border-primary ring-1 ring-primary/30'
        "
        style="
          background-color: var(--background) !important;
          color: var(--foreground) !important;
        "
        @click="$emit('select-promo', promo.id)"
      >
        <span
          class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
        >
          <BadgePercent class="h-4 w-4" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block font-bold leading-snug text-foreground">
            {{ promo.label }}
          </span>
          <span class="mt-1 block text-lg font-bold tabular-nums text-primary">
            {{ money(promo.price) }}
          </span>
        </span>
        <ArrowRight
          class="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
        />
      </Button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { ArrowRight, BadgePercent, ShoppingBasket } from "lucide-vue-next";
import type { PromoProgressCard } from "~/composables/useMenuPricing";

const props = defineProps<{
  promoCards: PromoProgressCard[];
  money: (value: number) => string;
  activePromoId?: string | null;
}>();

defineEmits<{ "select-promo": [promoId: string] }>();

function canGuidePromo(promo: PromoProgressCard) {
  return promo.requirements.every(
    (requirement) =>
      requirement.targetType === "group" || requirement.targetType === "item",
  );
}

const buildablePromoCards = computed(() =>
  props.promoCards.filter(canGuidePromo),
);
</script>
