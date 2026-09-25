<template>
  <Dialog v-model:open="open" @update:open="handleOpen">
    <DialogTrigger as-child>
      <Button
        variant="outline"
        size="icon"
        class="h-9 w-9 shrink-0"
        :title="`Editar comanda #${order.number}`"
      >
        <ClientOnly><Pencil :size="15" /></ClientOnly>
        <span class="sr-only">Editar comanda #{{ order.number }}</span>
      </Button>
    </DialogTrigger>

    <DialogScrollContent
      class="my-2 max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden sm:my-4 sm:max-h-[calc(100dvh-2rem)]"
    >
      <DialogHeader>
        <DialogTitle>Editar comanda #{{ order.number }}</DialogTitle>
        <DialogDescription>
          Los cambios se mostrarán en las pantallas del staff.
        </DialogDescription>
      </DialogHeader>

      <div class="min-h-0 space-y-6 overflow-y-auto pr-1">
        <section class="space-y-3">
          <h3 class="text-sm font-bold">Artículos</h3>
          <div class="divide-y rounded-md border">
            <div
              v-for="item in items"
              :key="item.name"
              class="flex min-h-12 items-center gap-3 px-3 py-2"
            >
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold">{{ item.name }}</p>
                <p class="text-[11px] text-muted-foreground">
                  {{ item.groupLabel }}
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  class="h-8 w-8"
                  :disabled="quantity(item.name) === 0"
                  :aria-label="`Quitar ${item.name}`"
                  @click="changeQuantity(item.name, -1)"
                >
                  <Minus :size="14" />
                </Button>
                <span class="w-8 text-center text-sm font-bold tabular-nums">
                  {{ quantity(item.name) }}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  class="h-8 w-8"
                  :aria-label="`Agregar ${item.name}`"
                  @click="changeQuantity(item.name, 1)"
                >
                  <Plus :size="14" />
                </Button>
              </div>
            </div>
          </div>
          <p v-if="emptyCart" class="text-xs font-medium text-destructive">
            La comanda debe conservar al menos un artículo.
          </p>
        </section>

        <section class="space-y-3">
          <h3 class="text-sm font-bold">Entrega</h3>
          <div class="grid grid-cols-3 gap-1 rounded-md border p-1">
            <Button
              v-for="option in modeOptions"
              :key="option.value"
              type="button"
              size="sm"
              :variant="draft.mode === option.value ? 'default' : 'ghost'"
              @click="draft.mode = option.value"
            >
              {{ option.label }}
            </Button>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <Label :for="`edit-date-${order.id}`">Fecha</Label>
              <Input
                :id="`edit-date-${order.id}`"
                v-model="draft.fulfillDate"
                type="date"
                :min="todayISO()"
              />
            </div>
            <div class="space-y-1.5">
              <Label :for="`edit-time-${order.id}`">Hora</Label>
              <Input
                :id="`edit-time-${order.id}`"
                v-model="draft.fulfillTime"
                type="time"
              />
            </div>
          </div>
        </section>

        <section class="space-y-3">
          <h3 class="text-sm font-bold">Cliente</h3>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <Label :for="`edit-name-${order.id}`">Nombre</Label>
              <Input
                :id="`edit-name-${order.id}`"
                v-model="draft.customer.name"
              />
            </div>
            <div class="space-y-1.5">
              <Label :for="`edit-phone-${order.id}`">Teléfono</Label>
              <Input
                :id="`edit-phone-${order.id}`"
                v-model="draft.customer.phone"
                type="tel"
              />
            </div>
          </div>
          <div class="space-y-1.5">
            <Label :for="`edit-address-${order.id}`">Dirección</Label>
            <Input
              :id="`edit-address-${order.id}`"
              v-model="draft.customer.address"
            />
          </div>
          <div class="space-y-1.5">
            <Label :for="`edit-member-${order.id}`">Código de socio</Label>
            <Input
              :id="`edit-member-${order.id}`"
              v-model="draft.memberCode"
              class="uppercase tracking-widest"
              @blur="normalizeMemberCode"
            />
          </div>
          <div class="space-y-1.5">
            <Label :for="`edit-note-${order.id}`">Nota</Label>
            <Textarea
              :id="`edit-note-${order.id}`"
              v-model="draft.note"
              rows="3"
            />
          </div>
        </section>

        <section v-if="hasPricing" class="space-y-3">
          <h3 class="text-sm font-bold">Cobro</h3>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <Label :for="`edit-subtotal-${order.id}`">Alimentos</Label>
              <Input
                :id="`edit-subtotal-${order.id}`"
                v-model.number="draft.pricingSubtotal"
                type="number"
                min="0"
                step="1"
              />
            </div>
            <div v-if="draft.mode === 'domicilio'" class="space-y-1.5">
              <Label :for="`edit-delivery-${order.id}`">Envío</Label>
              <Input
                :id="`edit-delivery-${order.id}`"
                v-model.number="draft.deliveryFee"
                type="number"
                min="0"
                step="1"
              />
            </div>
          </div>
          <p class="text-right text-sm font-bold tabular-nums">
            Total: {{ money(editedTotal) }}
          </p>
        </section>
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <Button type="button" variant="outline" :disabled="saving">
            Cancelar
          </Button>
        </DialogClose>
        <Button :disabled="saving || emptyCart" @click="save">
          {{ saving ? "Guardando..." : "Guardar cambios" }}
        </Button>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Textarea } from "@common/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from "@common/components/ui/dialog";
import { Minus, Pencil, Plus } from "lucide-vue-next";
import {
  groupsFromData,
  todayISO,
  type DayDishes,
  type PlacedOrder,
} from "~/utils/comandas";
import type { Customer, OrderMode } from "~/composables/useWhatsappOrder";

type EditableOrder = PlacedOrder & { customer: Customer };

const props = defineProps<{ order: PlacedOrder; menu: DayDishes }>();
const { updateOrder } = useComandas();
const open = ref(false);
const saving = ref(false);
const hasPricing = computed(() => props.order.pricingTotal !== undefined);
const modeOptions: Array<{ value: OrderMode; label: string }> = [
  { value: "aqui", label: "Aquí" },
  { value: "llevar", label: "Llevar" },
  { value: "domicilio", label: "Domicilio" },
];

function freshDraft(): EditableOrder {
  return {
    ...props.order,
    cart: { ...props.order.cart },
    customer: {
      name: props.order.customer?.name ?? "",
      phone: props.order.customer?.phone ?? "",
      address: props.order.customer?.address ?? "",
    },
    fulfillDate: props.order.fulfillDate || todayISO(),
    fulfillTime: props.order.fulfillTime ?? "",
    memberCode: props.order.memberCode ?? "",
    pricingSubtotal: props.order.pricingSubtotal ?? 0,
    deliveryFee: props.order.deliveryFee ?? 0,
  };
}

const draft = reactive<EditableOrder>(freshDraft());
const items = computed(() => {
  const rows = groupsFromData(props.menu).flatMap((group) =>
    (props.menu[group.key] ?? []).map((name) => ({
      name,
      groupLabel: group.label,
    })),
  );
  const known = new Set(rows.map((item) => item.name));
  Object.keys(props.order.cart).forEach((name) => {
    if (!known.has(name)) rows.push({ name, groupLabel: "Otros" });
  });
  return rows;
});
const emptyCart = computed(
  () => !Object.values(draft.cart).some((quantity) => quantity > 0),
);
const editedTotal = computed(
  () =>
    Math.max(0, Number(draft.pricingSubtotal) || 0) +
    (draft.mode === "domicilio"
      ? Math.max(0, Number(draft.deliveryFee) || 0)
      : 0),
);

function quantity(name: string) {
  return Math.max(0, Number(draft.cart[name]) || 0);
}

function changeQuantity(name: string, delta: number) {
  draft.cart[name] = Math.max(0, quantity(name) + delta);
}

function normalizeMemberCode() {
  draft.memberCode = (draft.memberCode ?? "").replace(/\s+/g, "").toUpperCase();
}

function handleOpen(nextOpen: boolean) {
  if (nextOpen) Object.assign(draft, freshDraft());
}

async function save() {
  if (emptyCart.value) return;
  saving.value = true;
  normalizeMemberCode();
  const cart = Object.fromEntries(
    Object.entries(draft.cart).filter(([, quantity]) => quantity > 0),
  );
  const taquizaChanged = (props.menu.taquizas ?? []).some(
    (name) => Number(cart[name] ?? 0) !== Number(props.order.cart[name] ?? 0),
  );
  const saved = await updateOrder(props.order, {
    cart,
    mode: draft.mode,
    note: draft.note.trim(),
    fulfillDate: draft.fulfillDate,
    fulfillTime: draft.fulfillTime,
    customer: { ...draft.customer },
    memberCode: draft.memberCode,
    pricingSubtotal: hasPricing.value
      ? Math.max(0, Number(draft.pricingSubtotal) || 0)
      : undefined,
    deliveryFee: hasPricing.value
      ? draft.mode === "domicilio"
        ? Math.max(0, Number(draft.deliveryFee) || 0)
        : 0
      : undefined,
    pricingTotal: hasPricing.value ? editedTotal.value : undefined,
    taquizaOrders: taquizaChanged ? undefined : draft.taquizaOrders,
    taquizaByKind: taquizaChanged ? undefined : draft.taquizaByKind,
  });
  saving.value = false;
  if (saved) open.value = false;
}

function money(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}
</script>
