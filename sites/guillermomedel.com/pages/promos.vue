<template>
  <main class="mx-auto max-w-3xl space-y-6 px-5 pb-16 pt-6 sm:px-6 lg:py-8">
    <SeoMeta :follow="false" />

    <section class="overflow-hidden rounded-3xl border bg-card shadow-sm">
      <div class="relative p-6 sm:p-8">
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-400/10"
        />
        <div class="relative space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" class="uppercase tracking-widest">
              Promos
            </Badge>
            <Badge variant="outline" class="uppercase tracking-widest">
              {{ menuPricingConfig.promos.length }} disponibles
            </Badge>
          </div>

          <div class="space-y-2">
            <h1 class="font-heading text-3xl leading-tight sm:text-4xl">
              Promociones
            </h1>
            <p class="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Todas las promociones configuradas para Breezy Meals, listas para
              consultarse desde una sola página.
            </p>
          </div>

          <Button as-child class="w-full sm:w-auto">
            <NuxtLink to="/menu">Ir al menú</NuxtLink>
          </Button>
        </div>
      </div>
    </section>

    <section class="grid gap-4">
      <Card
        v-for="promo in promos"
        :key="promo.id"
        class="overflow-hidden border-border/70 shadow-sm"
      >
        <CardContent class="space-y-4 p-5 sm:p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <p
                class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                Promoción
              </p>
              <h2 class="mt-1 text-lg font-semibold leading-tight sm:text-xl">
                {{ promo.label }}
              </h2>
            </div>

            <div class="shrink-0 text-right">
              <p
                class="text-xs uppercase tracking-widest text-muted-foreground"
              >
                Precio
              </p>
              <p class="font-heading text-2xl leading-none text-primary">
                {{ money(promo.pricing.amount) }}
              </p>
            </div>
          </div>

          <p class="text-sm text-muted-foreground">
            {{ promo.display?.summary ?? promoSummary(promo) }}
          </p>

          <Separator />

          <div class="space-y-2">
            <p
              class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Requiere
            </p>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="requirement in promo.match.requirements"
                :key="`${promo.id}-${requirement.targetType}-${requirement.target}`"
                variant="secondary"
                class="rounded-full px-3 py-1"
              >
                {{ requirement.qty }} x {{ requirementLabel(requirement) }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { Card, CardContent } from "@common/components/ui/card";
import { Separator } from "@common/components/ui/separator";
import { menuPricingConfig } from "~/config/menu-pricing";
import { groupByKey } from "~/utils/comandas";
import type { PricingPromoRequirement } from "~/utils/menuPricing";

definePageMeta({ layout: "breezy" });

const promos = menuPricingConfig.promos;

function money(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function requirementLabel(requirement: PricingPromoRequirement) {
  if (requirement.targetType === "group") {
    return groupByKey[requirement.target]?.label ?? requirement.target;
  }

  if (requirement.targetType === "order-unit") {
    return (
      menuPricingConfig.orderUnits?.[requirement.target]?.label ??
      requirement.target
    );
  }

  return requirement.target;
}

function promoSummary(promo: (typeof menuPricingConfig.promos)[number]) {
  return (
    promo.display?.summary ??
    promo.match.requirements
      .map(
        (requirement) =>
          `${requirement.qty} x ${requirementLabel(requirement)}`,
      )
      .join(" + ")
  );
}
</script>
