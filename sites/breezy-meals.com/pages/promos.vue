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
              {{ promos.length }} disponibles
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
              <div class="mt-1 flex flex-wrap items-center gap-2">
                <h2 class="text-lg font-semibold leading-tight sm:text-xl">
                  {{ promo.label }}
                </h2>
                <Badge
                  :variant="promo.active !== false ? 'default' : 'secondary'"
                >
                  {{ promo.active !== false ? "Activa" : "Inactiva" }}
                </Badge>
              </div>
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
import type {
  PricingPromo,
  PricingPromoRequirement,
} from "~/utils/menuPricing";

definePageMeta({ layout: "breezy" });

const { fetchCollection } = usePocketBaseCore();
const promos = ref<PricingPromo[]>([...menuPricingConfig.promos]);

function toRuntimePromo(record: Record<string, any>): PricingPromo | null {
  const data =
    record?.data && typeof record.data === "object" ? record.data : undefined;
  const id = String(record.promoId || data?.id || record.id || "").trim();
  const label = String(record.label || data?.label || "").trim();
  const priority = Number(record.priority ?? data?.priority ?? 0) || 0;
  const active = Boolean(record.active ?? data?.active ?? true);
  const match = (record.match ?? data?.match) as
    | { requirements?: PricingPromoRequirement[] }
    | undefined;
  const pricing = (record.pricing ?? data?.pricing) as
    | { amount?: number }
    | undefined;
  const display = (record.display ?? data?.display) as
    | { summary?: string }
    | undefined;

  const requirements = Array.isArray(match?.requirements)
    ? match.requirements.filter(
        (req) =>
          !!req &&
          (req.targetType === "group" ||
            req.targetType === "item" ||
            req.targetType === "order-unit") &&
          typeof req.target === "string" &&
          Number(req.qty) > 0,
      )
    : [];

  const amount = Number(pricing?.amount);

  if (!id || !label || !requirements.length || !Number.isFinite(amount)) {
    return null;
  }

  return {
    id,
    label,
    active,
    priority,
    match: { requirements },
    pricing: { amount },
    display: { summary: String(display?.summary || "").trim() },
  };
}

function mergePromos(runtime: PricingPromo[]) {
  const byId = new Map<string, PricingPromo>();

  menuPricingConfig.promos.forEach((promo) => {
    byId.set(String(promo.id), promo);
  });

  runtime.forEach((promo) => {
    byId.set(String(promo.id), promo);
  });

  return [...byId.values()].sort((a, b) => {
    const pa = Number(a.priority ?? 0);
    const pb = Number(b.priority ?? 0);
    if (pa !== pb) return pa - pb;
    return String(a.label || "").localeCompare(String(b.label || ""), "es");
  });
}

async function loadPromos() {
  try {
    const res = await fetchCollection(
      "promos",
      1,
      200,
      "",
      "priority,-created",
      null,
      null,
      true,
      { requestKey: "promos_page_runtime_promos" },
    );

    const runtime = res.items
      .map((item) => toRuntimePromo(item as Record<string, any>))
      .filter((item): item is PricingPromo => !!item);

    promos.value = mergePromos(runtime);
  } catch {
    promos.value = mergePromos([]);
  }
}

onMounted(() => {
  void loadPromos();
});

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

function promoSummary(promo: PricingPromo) {
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
