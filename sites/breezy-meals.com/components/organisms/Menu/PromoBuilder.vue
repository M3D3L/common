<template>
  <section class="js-reveal-item border-y border-primary/20 py-5">
    <div class="mb-4 flex items-start justify-between gap-4">
      <div class="min-w-0">
        <Badge class="mb-2 bg-primary/10 text-primary hover:bg-primary/10">
          Arma tu promoción
        </Badge>
        <h2 class="text-xl font-bold text-primary">{{ promo.label }}</h2>
        <p class="mt-1 text-xs text-muted-foreground">{{ promo.summary }}</p>
      </div>
      <div class="shrink-0 text-right">
        <p class="text-xl font-bold tabular-nums text-primary">
          {{ money(promo.price) }}
        </p>
        <Button
          variant="ghost"
          size="sm"
          class="mt-1 px-2"
          @click="$emit('close')"
        >
          Ver menú completo
        </Button>
      </div>
    </div>

    <div
      v-if="promo.appliedQty > 0"
      class="mb-5 border-y border-border/70 py-3"
    >
      <p class="mb-2 text-xs font-bold text-foreground">
        Selecciona una comida para revisar sus platillos
      </p>
      <div class="flex gap-2 overflow-x-auto pb-1" role="tablist">
        <button
          v-for="(_, index) in promo.applications"
          :key="`meal-${index}`"
          type="button"
          role="tab"
          class="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-bold transition-colors"
          :class="
            activeMealIndex === index
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-foreground hover:border-primary/50'
          "
          :aria-selected="activeMealIndex === index"
          @click="activeMealIndex = index"
        >
          <CircleCheck class="h-4 w-4" />
          Comida {{ index + 1 }}
        </button>
        <button
          type="button"
          role="tab"
          class="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-bold transition-colors"
          :class="
            activeMealIndex === promo.applications.length
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-foreground hover:border-primary/50'
          "
          :aria-selected="activeMealIndex === promo.applications.length"
          @click="activeMealIndex = promo.applications.length"
        >
          <Plus class="h-4 w-4" />
          Agregar otra
        </button>
      </div>
    </div>

    <div class="mb-4" aria-label="Progreso de la promoción">
      <div
        class="mb-1.5 flex items-center justify-between text-xs font-semibold"
      >
        <span>
          {{ activeMealLabel }} · {{ completedCount }} de
          {{ requirements.length }} pasos
        </span>
        <span class="tabular-nums text-primary">
          {{ selectedTotal }}/{{ requiredTotal }} selecciones
        </span>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-muted">
        <div
          class="h-full rounded-full bg-primary transition-[width] duration-300"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
    </div>

    <div
      v-if="activeApplication"
      class="mb-4 flex items-center gap-2 border-y border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800"
    >
      <CircleCheck class="h-5 w-5 shrink-0" />
      Esta comida está completa y se enviará como una comanda independiente.
    </div>

    <Accordion v-model="openRequirementId" type="single" collapsible>
      <AccordionItem
        v-for="(requirement, index) in requirements"
        :key="requirement.id"
        :value="requirement.id"
        class="border-border/70"
      >
        <AccordionTrigger class="gap-3 py-4 text-left hover:no-underline">
          <div class="flex min-w-0 flex-1 items-center gap-3 pr-2">
            <span
              class="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold"
              :class="
                requirement.met
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary text-primary-foreground'
              "
            >
              <CircleCheck v-if="requirement.met" class="h-4 w-4" />
              <template v-else>{{ index + 1 }}</template>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block font-bold"
                >Elige {{ requirement.labelEs }}</span
              >
              <span
                v-if="selectedNames(requirement).length"
                class="mt-0.5 block truncate text-[11px] font-normal text-muted-foreground"
              >
                {{ selectedNames(requirement).join(", ") }}
              </span>
            </span>
            <Badge
              variant="outline"
              class="shrink-0 tabular-nums"
              :class="
                requirement.met
                  ? 'border-emerald-300 text-emerald-700'
                  : 'border-primary/30 text-primary'
              "
            >
              {{ requirement.current }}/{{ requirement.required }}
            </Badge>
          </div>
        </AccordionTrigger>

        <AccordionContent class="pb-4 pl-10">
          <div v-if="requirement.targetType === 'order-unit'" class="space-y-3">
            <Button
              v-if="!activeApplication"
              type="button"
              variant="outline"
              class="w-full border-primary/20"
              :disabled="!canAddRequirement(requirement)"
              @click="addOrderForRequirement(requirement)"
            >
              <Plus class="mr-2 h-4 w-4" />
              Agregar {{ requirement.labelEs }}
            </Button>

            <OrganismsMenuTaquizaOrderCard
              v-for="(order, index) in ordersForRequirement(requirement)"
              :key="order.id"
              :order="order"
              :idx="index"
              :items="taquizaItems"
              :taquiza-cap="taquizaCap"
              :order-fill-total="orderFillTotal"
              :can-add-to-order="canAddToOrder"
              :set-order-fill="setOrderFill"
              :is-out="isOut"
              @remove="removeTaquizaOrder(order.id)"
            />
          </div>

          <div v-else class="space-y-2">
            <p
              v-if="!itemsForRequirement(requirement).length"
              class="rounded-md border border-dashed border-border bg-muted/40 px-3 py-3 text-xs text-muted-foreground"
            >
              No hay opciones disponibles hoy para este paso.
            </p>
            <OrganismsMenuItemCard
              v-for="item in itemsForRequirement(requirement)"
              :key="item.name"
              :item="item"
              :qty="itemQty(item.name)"
              :is-out="isOut(item.name)"
              :is-locked="false"
              :can-add="canAddRequirement(requirement)"
              :staff-mode="false"
              :is-logged-in="false"
              :money="money"
              @add="setRequirementQty(requirement, item.name, 1)"
              @remove="setRequirementQty(requirement, item.name, -1)"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</template>

<script lang="ts" setup>
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@common/components/ui/accordion";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { CircleCheck, Plus } from "lucide-vue-next";
import type {
  PromoProgressCard,
  PromoProgressRequirement,
} from "~/composables/useMenuPricing";
import type { TaquizaKind, TaquizaOrder } from "~/composables/useTaquizaOrders";
import type { GroupKey, MenuItem } from "~/utils/comandas";

type ActiveMenuItem = MenuItem & { group: GroupKey };
type BuildableRequirement = PromoProgressRequirement;

const props = defineProps<{
  promo: PromoProgressCard;
  cart: Record<string, number>;
  menuGroups: { key: GroupKey }[];
  groupItems: (key: GroupKey) => ActiveMenuItem[];
  taquizaGroup?: { key: GroupKey };
  taquizaCap: Record<TaquizaKind, number>;
  taquizaOrders: TaquizaOrder[];
  orderFillTotal: (order: TaquizaOrder) => number;
  canAddToOrder: (order: TaquizaOrder) => boolean;
  setOrderFill: (order: TaquizaOrder, name: string, delta: number) => void;
  addTaquizaOrder: (kind: TaquizaKind) => void;
  removeTaquizaOrder: (id: string) => void;
  isOut: (name: string) => boolean;
  canAddGroupItems: (key: GroupKey) => boolean;
  money: (value: number) => string;
  setQty: (key: GroupKey, name: string, delta: number) => void;
}>();

defineEmits<{ close: [] }>();

const activeMealIndex = ref(0);
const activeApplication = computed(
  () => props.promo.applications[activeMealIndex.value],
);
const activeMealLabel = computed(() =>
  activeApplication.value
    ? `Comida ${activeMealIndex.value + 1}`
    : props.promo.appliedQty > 0
      ? "Nueva comida"
      : "Tu comida",
);

function applicationRequirementQty(requirement: BuildableRequirement) {
  const application = activeApplication.value;
  if (requirement.targetType === "order-unit") {
    if (application) {
      return application.orderUnits
        .filter((unit) => unit.code === requirement.target)
        .reduce((sum, unit) => sum + unit.qty, 0);
    }

    const kind = requirementTaquizaKind(requirement);
    if (!kind) return 0;
    return ordersForRequirement(requirement).filter(
      (order) => props.orderFillTotal(order) === props.taquizaCap[order.kind],
    ).length;
  }

  if (!application) {
    return itemsForRequirement(requirement).reduce(
      (sum, item) => sum + unappliedItemQty(item.name),
      0,
    );
  }

  return application.items.reduce((sum, item) => {
    const matches =
      requirement.targetType === "group"
        ? item.group === requirement.target
        : item.name === requirement.target;
    return sum + (matches ? item.qty : 0);
  }, 0);
}

const requirements = computed(() =>
  props.promo.requirements.map((requirement) => {
    const current = Math.min(
      requirement.required,
      applicationRequirementQty(requirement),
    );
    return {
      ...requirement,
      current,
      missing: requirement.required - current,
      met: current >= requirement.required,
    };
  }),
);

const completedCount = computed(
  () => requirements.value.filter((requirement) => requirement.met).length,
);
const requiredTotal = computed(() =>
  requirements.value.reduce(
    (sum, requirement) => sum + requirement.required,
    0,
  ),
);
const selectedTotal = computed(() =>
  requirements.value.reduce((sum, requirement) => sum + requirement.current, 0),
);
const progressPercent = computed(() =>
  requiredTotal.value
    ? Math.round((selectedTotal.value / requiredTotal.value) * 100)
    : 0,
);

const openRequirementId = ref<string>();

watch(
  () => props.promo.applications.length,
  (next, previous) => {
    if (next > previous && activeMealIndex.value === previous) {
      activeMealIndex.value = next;
      openRequirementId.value = requirements.value[0]?.id;
    } else if (activeMealIndex.value > next) {
      activeMealIndex.value = next;
    }
  },
);

watch(
  () => [
    props.promo.id,
    ...requirements.value.map(
      (requirement) => `${requirement.id}:${requirement.current}`,
    ),
  ],
  () => {
    const openRequirement = requirements.value.find(
      (requirement) => requirement.id === openRequirementId.value,
    );
    if (
      !openRequirement ||
      (openRequirement.met && openRequirement.targetType !== "order-unit")
    ) {
      openRequirementId.value = requirements.value.find(
        (requirement) => !requirement.met,
      )?.id;
    }
  },
  { immediate: true },
);

function requirementGroupKey(requirement: BuildableRequirement) {
  if (requirement.targetType === "order-unit") return undefined;
  if (requirement.targetType === "group") return requirement.target;

  return props.menuGroups.find((group) =>
    props
      .groupItems(group.key)
      .some((item) => item.name === requirement.target),
  )?.key;
}

function itemsForRequirement(requirement: BuildableRequirement) {
  const groupKey = requirementGroupKey(requirement);
  if (!groupKey) return [];

  const items = props.groupItems(groupKey);
  return requirement.targetType === "item"
    ? items.filter((item) => item.name === requirement.target)
    : items;
}

function canAddRequirement(requirement: BuildableRequirement) {
  if (requirement.targetType === "order-unit") {
    return (
      !activeApplication.value &&
      ordersForRequirement(requirement).length < requirement.required &&
      !!requirementTaquizaKind(requirement)
    );
  }

  const groupKey = requirementGroupKey(requirement);
  return (
    requirement.current < requirement.required &&
    !!groupKey &&
    props.canAddGroupItems(groupKey)
  );
}

function setRequirementQty(
  requirement: BuildableRequirement,
  name: string,
  delta: number,
) {
  const groupKey = requirementGroupKey(requirement);
  if (!groupKey) return;

  props.setQty(groupKey, name, delta);
}

function selectedNames(requirement: BuildableRequirement) {
  if (requirement.targetType === "order-unit") {
    return ordersForRequirement(requirement).flatMap((order) =>
      Object.entries(order.fills)
        .filter(([, qty]) => qty > 0)
        .map(([name, qty]) => (qty > 1 ? `${qty} x ${name}` : name)),
    );
  }

  return itemsForRequirement(requirement)
    .filter((item) => itemQty(item.name) > 0)
    .map((item) => item.name);
}

function itemQty(name: string) {
  const application = activeApplication.value;
  if (application) {
    return application.items
      .filter((item) => item.name === name)
      .reduce((sum, item) => sum + item.qty, 0);
  }

  return unappliedItemQty(name);
}

function unappliedItemQty(name: string) {
  const appliedQty = props.promo.applications.reduce(
    (sum, application) =>
      sum +
      application.items
        .filter((item) => item.name === name)
        .reduce((itemSum, item) => itemSum + item.qty, 0),
    0,
  );

  return Math.max(0, (props.cart[name] ?? 0) - appliedQty);
}

const taquizaItems = computed(() =>
  props.taquizaGroup ? props.groupItems(props.taquizaGroup.key) : [],
);

function requirementTaquizaKind(
  requirement: BuildableRequirement,
): TaquizaKind | undefined {
  if (
    requirement.target !== "taquiza:tacos" &&
    requirement.target !== "taquiza:quesadillas"
  ) {
    return undefined;
  }
  return requirement.target.split(":").at(-1) as TaquizaKind;
}

function appliedOrderUnitQty(code: string, applicationLimit?: number) {
  const applications =
    applicationLimit === undefined
      ? props.promo.applications
      : props.promo.applications.slice(0, applicationLimit);
  return applications.reduce(
    (sum, application) =>
      sum +
      application.orderUnits
        .filter((unit) => unit.code === code)
        .reduce((unitSum, unit) => unitSum + unit.qty, 0),
    0,
  );
}

function ordersForRequirement(requirement: BuildableRequirement) {
  const kind = requirementTaquizaKind(requirement);
  if (!kind) return [];

  const orders = props.taquizaOrders.filter((order) => order.kind === kind);
  const offset = activeApplication.value
    ? appliedOrderUnitQty(requirement.target, activeMealIndex.value)
    : appliedOrderUnitQty(requirement.target);
  const count = activeApplication.value
    ? applicationRequirementQty(requirement)
    : requirement.required;
  return orders.slice(offset, offset + count);
}

function addOrderForRequirement(requirement: BuildableRequirement) {
  const kind = requirementTaquizaKind(requirement);
  if (kind && canAddRequirement(requirement)) props.addTaquizaOrder(kind);
}
</script>
