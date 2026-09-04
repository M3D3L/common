<template>
  <Card
    class="flex flex-col p-4 border-t-4"
    :class="modeBorderClass(order.mode)"
  >
    <!-- Header remains the same -->
    <div class="flex items-center gap-2 mb-3">
      <Badge
        class="px-2.5 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/10 tabular-nums"
      >
        #{{ order.number }}
      </Badge>
      <Badge
        variant="outline"
        class="px-2 py-0.5 text-[10px] uppercase tracking-wider"
        :class="modeBadgeClass(order.mode)"
      >
        <template v-if="order.mode === 'llevar'">Para llevar</template>
        <template v-else-if="order.mode === 'aqui'">Para aquí</template>
        <template v-else-if="order.mode === 'domicilio'">A domicilio</template>
        <template v-else>{{ order.mode }}</template>
      </Badge>
      <span class="ml-auto text-xs text-muted-foreground tabular-nums">
        {{ orderTime(order) }}
      </span>
    </div>

    <!-- Items List -->
    <div class="flex-1 space-y-3">
      <div
        v-for="g in ticketGroups"
        v-show="hasGroupItems(order, g.key, catalog)"
        :key="g.key"
      >
        <p
          class="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-0.5"
        >
          {{ g.label }}
        </p>
        <template v-if="isTaquizaGroup(g.key) && hasTaquizaBreakdown(order)">
          <div v-if="taquizaLines(order, 'tacos').length" class="space-y-0.5">
            <p
              class="text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
            >
              Tacos
            </p>
            <div
              v-for="line in taquizaLines(order, 'tacos')"
              :key="`tacos-${line.name}`"
              class="flex items-baseline gap-2 text-sm"
            >
              <span class="font-bold text-primary shrink-0 tabular-nums"
                >{{ line.qty }}×</span
              >
              <span class="font-semibold text-card-foreground">{{
                line.name
              }}</span>
            </div>
          </div>

          <div
            v-if="taquizaLines(order, 'quesadillas').length"
            class="space-y-0.5"
            :class="taquizaLines(order, 'tacos').length ? 'mt-1' : ''"
          >
            <p
              class="text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
            >
              Quesadillas
            </p>
            <div
              v-for="line in taquizaLines(order, 'quesadillas')"
              :key="`quesadillas-${line.name}`"
              class="flex items-baseline gap-2 text-sm"
            >
              <span class="font-bold text-primary shrink-0 tabular-nums"
                >{{ line.qty }}×</span
              >
              <span class="font-semibold text-card-foreground">{{
                line.name
              }}</span>
            </div>
          </div>
        </template>

        <div v-else class="space-y-0.5">
          <div
            v-for="line in getGroupLines(order, g.key, catalog)"
            :key="line.name"
            class="flex items-baseline gap-2 text-sm"
          >
            <span class="font-bold text-primary shrink-0 tabular-nums"
              >{{ line.qty }}×</span
            >
            <span class="font-semibold text-card-foreground">{{
              line.name
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery Date: Using neutral gray/slate for clarity -->
    <div
      class="mt-3 pt-2 border-t border-dashed border-border flex items-center justify-between text-xs"
    >
      <span class="text-muted-foreground">Entrega programada:</span>
      <span
        class="font-bold tabular-nums"
        :class="
          order.fulfillDate !== todayISO()
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-foreground'
        "
      >
        {{ order.fulfillDate === todayISO() ? "Hoy mismo" : order.fulfillDate }}
      </span>
    </div>

    <!-- Hora de salida: define el orden de la cola de cocina. -->
    <div
      v-if="order.fulfillTime"
      class="flex items-center justify-between text-xs"
    >
      <span class="text-muted-foreground">Hora:</span>
      <span class="font-bold tabular-nums">{{
        fulfillTimeLabel(order.fulfillTime)
      }}</span>
    </div>

    <!-- Cliente / Dirección: el nombre es opcional en llevar/aquí, así que
         solo se muestra cuando el cliente lo capturó. -->
    <div
      v-if="
        order.customer?.name ||
        memberData?.name ||
        memberPhone ||
        (order.mode === 'domicilio' &&
          (order.customer?.address || memberData?.address))
      "
      class="p-2 mt-2 text-xs rounded bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-medium border border-slate-100 dark:border-slate-800"
    >
      <p
        v-if="order.customer?.name || memberData?.name"
        class="font-bold text-slate-900 dark:text-slate-100"
      >
        👤 {{ order.customer?.name || memberData?.name }}
      </p>
      <a
        v-if="memberPhone"
        :href="`https://wa.me/${memberPhone}`"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1 mt-1 text-green-700 hover:underline dark:text-green-400"
      >
        <span>📱</span> {{ memberData?.phone }}
      </a>
      <p
        v-if="
          order.mode === 'domicilio' &&
          (order.customer?.address || memberData?.address)
        "
        class="flex items-start gap-1 mt-1"
      >
        <span class="mt-0.5">📍</span>
        {{ order.customer?.address || memberData?.address }}
      </p>
    </div>

    <p
      v-if="order.note"
      class="p-2 mt-2 text-xs rounded-lg bg-muted/60 border border-muted text-muted-foreground font-medium italic"
    >
      Nota: {{ order.note }}
    </p>

    <div
      v-if="order.pricingTotal !== undefined"
      class="mt-2 space-y-1 rounded-lg border border-border bg-muted/40 p-2 text-xs"
    >
      <div class="flex justify-between">
        <span class="text-muted-foreground">Alimentos</span>
        <span class="font-semibold tabular-nums">{{
          money(order.pricingSubtotal ?? 0)
        }}</span>
      </div>
      <div v-if="order.deliveryFee" class="flex justify-between">
        <span class="text-muted-foreground">Envío</span>
        <span class="font-semibold tabular-nums">{{
          money(order.deliveryFee)
        }}</span>
      </div>
      <div class="flex justify-between border-t border-border pt-1 font-bold">
        <span>Total</span>
        <span class="tabular-nums">{{ money(order.pricingTotal) }}</span>
      </div>
    </div>

    <!-- Footer buttons -->
    <div class="flex items-center gap-2 mt-4">
      <Button size="sm" class="flex-1" @click="completeOrder(order)">
        <ClientOnly><Check :size="15" class="mr-1.5" /></ClientOnly>
        Marcar lista
      </Button>
      <Button
        variant="outline"
        size="icon"
        title="Descartar sin avisar"
        class="h-9 w-9 shrink-0 text-background hover:border-destructive hover:text-destructive"
        @click="discardOrder(order)"
      >
        <ClientOnly><Trash2 :size="15" /></ClientOnly>
      </Button>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Badge } from "@common/components/ui/badge";
import { Check, Trash2 } from "lucide-vue-next";
import {
  groups,
  groupsFromData,
  todayISO,
  orderTime,
  modeBorderClass,
  modeBadgeClass,
  hasGroupItems,
  getGroupLines,
  type PlacedOrder,
} from "~/utils/comandas";

const props = defineProps<{ order: PlacedOrder }>();

const { completeOrder, discardOrder, catalog } = useComandas();
const { fetchCollection } = usePocketBaseCore();

function money(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

const ticketGroups = computed(() =>
  groupsFromData(catalog.value as Record<string, unknown>),
);

// "HH:MM" (24h) -> "H:MM AM/PM", para que el staff lea la hora de salida.
function fulfillTimeLabel(t: string) {
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${period}`;
}

const taquizaGroup = groups.find((g) => "pieceOptions" in g);

function isTaquizaGroup(key: string) {
  return !!taquizaGroup && key === taquizaGroup.key;
}

function hasTaquizaBreakdown(order: PlacedOrder) {
  const tacos = Object.values(order.taquizaByKind?.tacos ?? {}).some(
    (q) => q > 0,
  );
  const quesadillas = Object.values(
    order.taquizaByKind?.quesadillas ?? {},
  ).some((q) => q > 0);
  return tacos || quesadillas;
}

function taquizaLines(order: PlacedOrder, kind: "tacos" | "quesadillas") {
  return Object.entries(order.taquizaByKind?.[kind] ?? {})
    .filter(([, qty]) => qty > 0)
    .map(([name, qty]) => ({ name, qty }));
}

const memberData = ref<Record<string, unknown> | null>(null);
const memberPhone = computed(() =>
  String(memberData.value?.phone ?? "").replace(/\D/g, ""),
);

watch(
  () => props.order?.memberCode,
  async (memberCode, _, onCleanup) => {
    memberData.value = null;
    if (!memberCode) return;

    let cancelled = false;
    onCleanup(() => {
      cancelled = true;
    });

    try {
      const result = await fetchCollection(
        "members",
        1,
        1,
        `member_code = "${memberCode}"`,
        "",
        null,
        null,
        true,
      );

      if (!cancelled) {
        memberData.value = (result.items[0] as Record<string, unknown>) ?? null;
      }
    } catch {
      if (!cancelled) memberData.value = null;
    }
  },
  { immediate: true },
);
</script>
