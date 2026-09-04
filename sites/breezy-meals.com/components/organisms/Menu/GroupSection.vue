<template>
  <button
    type="button"
    class="mb-3 flex w-full items-center gap-3 rounded-xl px-2 py-1 text-left transition-colors hover:bg-muted/50"
    :aria-expanded="isOpen"
    @click="$emit('toggle')"
  >
    <h2 class="text-xl font-bold uppercase tracking-widest text-primary">
      {{ group.label }}
      <span class="ml-1 font-semibold tabular-nums text-foreground/50">{{
        items.length
      }}</span>
    </h2>
    <span
      v-if="cartCount"
      class="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold tabular-nums text-primary"
    >
      {{ cartCount }} en carrito
    </span>
    <Separator class="shrink flex-1" />
    <ClientOnly>
      <ChevronDown
        :size="16"
        class="shrink-0 text-muted-foreground transition-transform duration-200"
        :class="isOpen && 'rotate-180'"
      />
    </ClientOnly>
  </button>

  <div v-show="isOpen">
    <!-- ===== Taquizas: por orden ===== -->
    <div v-if="isTaquiza" class="mb-3 space-y-3">
      <div class="grid grid-cols-2 gap-2">
        <Button
          v-for="kind in taquizaKinds"
          :key="`add-${kind}`"
          variant="outline"
          class="h-auto rounded-xl flex flex-col justify-center border-primary/20 bg-background/90 py-2"
          @click="addTaquizaOrder(kind)"
        >
          <span class="flex items-center gap-1.5 text-xs font-bold uppercase">
            <ClientOnly><Plus :size="14" /></ClientOnly>
            {{ kind === "tacos" ? "Tacos" : "Quesadillas" }}
          </span>
          <span class="text-[11px] font-normal text-background">
            {{ taquizaCap[kind] }} piezas por orden
          </span>
        </Button>
      </div>

      <p v-if="!taquizaOrders.length" class="text-[11px] text-muted-foreground">
        Agrega una orden de tacos o quesadillas para elegir tus guisos.
      </p>

      <OrganismsMenuTaquizaOrderCard
        v-for="(order, idx) in taquizaOrders"
        :key="order.id"
        :order="order"
        :idx="idx"
        :items="items"
        :taquiza-cap="taquizaCap"
        :order-fill-total="orderFillTotal"
        :can-add-to-order="canAddToOrder"
        :set-order-fill="setOrderFill"
        :is-out="isOut"
        @remove="removeTaquizaOrder(order.id)"
      />
    </div>

    <!-- ===== Grupos normales ===== -->
    <div v-if="items.length && !isTaquiza" class="space-y-2">
      <OrganismsMenuItemCard
        v-for="item in items"
        :key="item.name"
        :item="item"
        :qty="cart[item.name] ?? 0"
        :is-out="isOut(item.name)"
        :is-locked="isLocked"
        :can-add="canAddGroupItems"
        :staff-mode="staffMode"
        :is-logged-in="isLoggedIn"
        :money="money"
        @add="setQty(item.name, 1)"
        @remove="setQty(item.name, -1)"
        @toggle-out="toggleOut(item.name)"
      />
    </div>

    <p v-if="isLocked" class="mt-2 text-[11px] text-muted-foreground">
      {{ lockReason }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Separator } from "@common/components/ui/separator";
import { ChevronDown, Plus } from "lucide-vue-next";
import type { GroupKey, MenuItem } from "~/utils/comandas";
import type { TaquizaKind, TaquizaOrder } from "~/composables/useTaquizaOrders";

type ActiveMenuItem = MenuItem & { group: GroupKey };

defineProps<{
  group: { key: GroupKey; label: string };
  isOpen: boolean;
  items: ActiveMenuItem[];
  cartCount: number;
  isTaquiza: boolean;
  taquizaKinds: TaquizaKind[];
  taquizaCap: Record<TaquizaKind, number>;
  taquizaOrders: TaquizaOrder[];
  orderFillTotal: (order: TaquizaOrder) => number;
  canAddToOrder: (order: TaquizaOrder) => boolean;
  setOrderFill: (order: TaquizaOrder, name: string, delta: number) => void;
  addTaquizaOrder: (kind: TaquizaKind) => void;
  removeTaquizaOrder: (id: string) => void;
  cart: Record<string, number>;
  isOut: (name: string) => boolean;
  canAddGroupItems: boolean;
  isLocked: boolean;
  lockReason: string;
  staffMode: boolean;
  isLoggedIn: boolean;
  money: (value: number) => string;
  setQty: (name: string, delta: number) => void;
  toggleOut: (name: string) => void;
}>();
defineEmits<{ toggle: [] }>();
</script>
