<template>
  <div class="min-h-screen bg-background text-foreground font-body">
    <SeoMeta :follow="false" />

    <div v-if="pending" class="mx-auto max-w-lg px-5 pt-9 pb-40">
      <div class="mt-12 space-y-3">
        <Skeleton class="h-3 w-24" />
        <Skeleton v-for="i in 4" :key="i" class="h-14 w-full rounded-xl" />
      </div>
    </div>

    <div
      v-else-if="!record"
      class="grid min-h-screen place-items-center p-6 text-center"
    >
      <div class="max-w-sm">
        <p class="mb-4 text-5xl">🛍️</p>
        <h1 class="text-xl font-bold font-heading">
          {{
            loadError
              ? "No pudimos cargar la tienda"
              : "La tienda aun no esta lista"
          }}
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {{
            loadError
              ? "Revisa tu conexion y vuelve a intentarlo."
              : "Vuelve en un momento para ver los productos disponibles."
          }}
        </p>
        <Button variant="outline" size="sm" class="mt-4" @click="load">
          <ClientOnly><RotateCw :size="15" class="mr-2" /></ClientOnly>
          Reintentar
        </Button>
      </div>
    </div>

    <div
      v-else-if="!hasStore"
      class="grid min-h-screen place-items-center p-6 text-center"
    >
      <div class="max-w-sm">
        <p class="mb-4 text-5xl">📦</p>
        <h1 class="text-xl font-bold font-heading">No hay productos hoy</h1>
        <p class="mt-2 text-sm text-muted-foreground">
          Todavia no hay categorias o productos publicados en la tienda.
        </p>
      </div>
    </div>

    <template v-else>
      <main class="mx-auto max-w-lg space-y-8 px-5 pb-44 pt-6">
        <section class="rounded-lg bg-primary/5 border border-primary/10 p-4">
          <h3 class="font-bold text-sm mb-2 flex items-center gap-2">
            <span>🧺</span> Store / Tienda
          </h3>
          <ol
            class="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside"
          >
            <li>Toca una categoria para ver sus productos.</li>
            <li>Elige tus productos y la cantidad.</li>
            <li>Selecciona entrega, para llevar o aqui.</li>
            <li>Ingresa tu nombre para enviar el pedido.</li>
          </ol>
        </section>

        <!-- Categorias (click para desplegar) -->
        <section>
          <div class="mb-3 flex items-center justify-between gap-3">
            <h2
              class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Categorias
              <span class="ml-1 font-semibold tabular-nums text-foreground/50">
                {{ visibleGroups.length }}
              </span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 gap-1.5 text-xs text-background"
              @click="toggleAll"
            >
              <ClientOnly>
                <component
                  :is="allExpanded ? ChevronsDownUp : ChevronsUpDown"
                  :size="14"
                />
              </ClientOnly>
              {{ allExpanded ? "Contraer todo" : "Expandir todo" }}
            </Button>
          </div>

          <Accordion v-model="openGroups" type="multiple" class="space-y-2">
            <AccordionItem
              v-for="group in visibleGroups"
              :key="group.key"
              :value="group.key"
              class="rounded-lg border border-border bg-card px-0"
            >
              <AccordionTrigger
                class="rounded-lg px-4 py-3 text-left hover:no-underline data-[state=open]:rounded-b-none"
              >
                <span class="flex flex-1 items-center gap-2 pr-2">
                  <span class="text-base leading-none">
                    {{ getEmoji(group.label.toLowerCase()) ?? "🧺" }}
                  </span>
                  <span class="font-bold text-sm leading-tight">
                    {{ group.label }}
                  </span>
                  <Badge
                    variant="outline"
                    class="tabular-nums text-[10px] font-semibold text-muted-foreground"
                  >
                    {{ groupItems(group.key).length }}
                  </Badge>
                </span>
                <Badge
                  v-if="groupCartCount(group.key)"
                  class="mr-2 tabular-nums"
                  aria-label="Productos en el pedido"
                >
                  {{ groupCartCount(group.key) }}
                </Badge>
              </AccordionTrigger>

              <!-- Los items solo se montan cuando la categoria esta abierta -->
              <AccordionContent class="px-3 pb-3 pt-0">
                <div class="grid grid-cols-2 gap-2">
                  <Card
                    v-for="item in groupItems(group.key)"
                    :key="item.code"
                    class="flex items-center gap-3 p-3 transition-colors"
                    :class="[
                      isOut(item.name) && 'opacity-60',
                      cart[item.code] > 0 &&
                        'bg-primary/5 ring-1 ring-primary/40',
                    ]"
                  >
                    <div class="flex-1 min-w-0">
                      <p
                        class="font-semibold leading-tight"
                        :class="
                          isOut(item.name) &&
                          'text-muted-foreground line-through'
                        "
                      >
                        {{ item.name }}
                      </p>
                      <p
                        v-if="item.price > 0"
                        class="mt-0.5 text-[11px] font-semibold text-muted-foreground"
                      >
                        {{ money(item.price) }}
                      </p>
                      <Badge
                        v-if="isOut(item.name)"
                        variant="outline"
                        class="mt-1 border-destructive/30 bg-destructive/10 text-[10px] uppercase text-destructive"
                      >
                        Agotado
                      </Badge>
                    </div>

                    <div
                      v-if="!isOut(item.name)"
                      class="flex shrink-0 items-center gap-1"
                    >
                      <template v-if="cart[item.code]">
                        <Button
                          variant="outline"
                          size="icon"
                          class="h-8 w-8"
                          :aria-label="`Quitar uno de ${item.name}`"
                          @click="setQty(item.code, -1)"
                        >
                          <ClientOnly><Minus :size="15" /></ClientOnly>
                        </Button>
                        <span
                          class="w-6 text-center font-bold tabular-nums"
                          aria-live="polite"
                        >
                          {{ cart[item.code] }}
                        </span>
                      </template>
                      <Button
                        variant="outline"
                        size="icon"
                        class="h-8 w-8"
                        :aria-label="`Agregar ${item.name}`"
                        @click="setQty(item.code, 1)"
                      >
                        <ClientOnly><Plus :size="15" /></ClientOnly>
                      </Button>
                    </div>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2
            class="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            Como lo quieres
          </h2>
          <Tabs v-model="mode">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger
                v-for="m in MODES"
                :key="m"
                :value="m"
                class="gap-1.5"
              >
                <ClientOnly>
                  <component
                    class="mx-auto"
                    :is="MODE_ICON[m] ?? Utensils"
                    :size="14"
                  />
                </ClientOnly>
                {{ MODE_SHORT[m] }}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        <section v-if="orderSummaryLines.length">
          <h2
            class="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            Totales
          </h2>
          <Card class="p-4">
            <div class="space-y-3">
              <div
                v-for="line in orderSummaryLines"
                :key="line.code"
                class="flex items-start justify-between gap-3"
              >
                <div class="min-w-0 flex-1">
                  <p class="font-semibold leading-tight">{{ line.name }}</p>
                  <p class="text-[11px] text-muted-foreground">
                    {{ line.qty }} x {{ money(line.unitPrice) }}
                  </p>
                </div>
                <p class="shrink-0 text-right font-semibold tabular-nums">
                  {{ money(line.total) }}
                </p>
              </div>

              <Separator />

              <div
                class="flex items-center justify-between text-sm text-muted-foreground"
              >
                <span>Total de piezas</span>
                <span class="font-semibold tabular-nums">{{ totalQty }}</span>
              </div>

              <div class="flex items-center justify-between gap-3">
                <p class="font-bold uppercase tracking-wide">Total</p>
                <p class="text-lg font-bold tabular-nums">
                  {{ money(totalAmount) }}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2
            class="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            Tus datos
          </h2>
          <Card class="space-y-4 p-4">
            <div class="space-y-1.5">
              <Label for="c-name" class="flex items-center gap-1">
                Tu nombre <span class="text-destructive">*</span>
              </Label>
              <Input
                id="c-name"
                v-model="customer.name"
                placeholder="Ej. Juan Perez"
                :class="{
                  'border-destructive focus-visible:ring-destructive':
                    itemCount > 0 && !customer.name.trim(),
                }"
              />
              <p
                v-if="itemCount > 0 && !customer.name.trim()"
                class="text-[11px] text-destructive"
              >
                Tu nombre es requerido para enviar el pedido.
              </p>
            </div>

            <div class="space-y-1.5">
              <Label for="c-phone">WhatsApp / Telefono (opcional)</Label>
              <Input
                id="c-phone"
                v-model="customer.phone"
                type="tel"
                placeholder="10 digitos"
              />
            </div>

            <template v-if="mode === 'domicilio'">
              <div class="space-y-1.5">
                <Label for="c-address" class="flex items-center gap-1">
                  Direccion <span class="text-destructive">*</span>
                </Label>
                <Input
                  id="c-address"
                  v-model="customer.address"
                  placeholder="Calle, numero, referencias"
                  :class="{
                    'border-destructive focus-visible:ring-destructive':
                      itemCount > 0 && needsAddress,
                  }"
                />
                <p
                  v-if="itemCount > 0 && needsAddress"
                  class="text-[11px] text-destructive"
                >
                  La direccion es requerida para entrega a domicilio.
                </p>
              </div>
            </template>

            <div class="space-y-1.5">
              <Label for="c-note">Nota (opcional)</Label>
              <Textarea
                id="c-note"
                v-model="note"
                rows="2"
                placeholder="Indicaciones adicionales"
              />
            </div>
          </Card>
        </section>
      </main>

      <div
        class="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-5 py-3 backdrop-blur"
      >
        <div class="mx-auto max-w-lg space-y-2">
          <div
            class="flex items-center justify-between text-xs text-muted-foreground"
          >
            <span class="tabular-nums">
              <template v-if="totalQty">
                {{ totalQty }} producto{{ totalQty === 1 ? "" : "s" }} ·
                {{ MODE_LABEL[mode] }}
              </template>
              <template v-else> Tu pedido · {{ MODE_LABEL[mode] }} </template>
            </span>
            <span
              v-if="orderSummaryLines.length"
              class="font-semibold tabular-nums"
            >
              {{ money(totalAmount) }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <Button
              v-if="totalQty"
              variant="outline"
              size="lg"
              class="shrink-0"
              @click="clearCart"
            >
              <ClientOnly><Trash2 :size="16" class="mr-2" /></ClientOnly>
              Vaciar
            </Button>
            <Button
              size="lg"
              class="flex-1"
              :disabled="!canSend || sendingOrder"
              @click="sendOrder"
            >
              <ClientOnly><Send :size="17" class="mr-2" /></ClientOnly>
              {{ sendingOrder ? "Enviando..." : "Enviar" }}
            </Button>
          </div>

          <p
            v-if="itemCount && !canSend"
            class="text-[11px] text-muted-foreground text-center"
          >
            {{ hint }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Badge } from "@common/components/ui/badge";
import { Separator } from "@common/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@common/components/ui/tabs";
import { Textarea } from "@common/components/ui/textarea";
import { Skeleton } from "@common/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@common/components/ui/accordion";
import {
  Plus,
  Minus,
  Send,
  Trash2,
  ShoppingBag,
  Bike,
  Utensils,
  RotateCw,
  ChevronsUpDown,
  ChevronsDownUp,
} from "lucide-vue-next";
import {
  MODES,
  MODE_SHORT,
  groupsFromData,
  normalizeMenuCatalog,
  type GroupKey,
  type MenuCatalog,
  type MenuItem,
  type MenuRecord,
} from "~/utils/comandas";
import { MODE_LABEL, type OrderMode } from "~/composables/useWhatsappOrder";
import { useCategoryEmoji } from "~/composables/useEmoji";

definePageMeta({ layout: "breezy" });

const { openWhatsApp } = useWhatsappOrder();
const { getEmoji } = useCategoryEmoji();

const DEFAULT_WHATSAPP = "6221523259";
const PRICE_FORMAT = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const MODE_ICON: Record<string, any> = {
  llevar: ShoppingBag,
  domicilio: Bike,
  comer: Utensils,
  aqui: Utensils,
  local: Utensils,
};

type StoreRecord = MenuRecord & {
  store?: MenuCatalog | Partial<Record<GroupKey, unknown>>;
};

const { record, pending, loadError, load } = useLatestMenuRecord<StoreRecord>();

onMounted(load);

const catalog = computed<MenuCatalog>(() =>
  normalizeMenuCatalog(
    (record.value?.store ?? {}) as Partial<Record<GroupKey, unknown>>,
  ),
);

const menuGroups = computed(() =>
  groupsFromData(catalog.value as Record<string, unknown>),
);

const hasStore = computed(() =>
  menuGroups.value.some((group) => (catalog.value[group.key] ?? []).length > 0),
);

const soldOut = computed<string[]>(() => record.value?.sold_out ?? []);
const isOut = (name: string) => soldOut.value.includes(name);

const itemCode = (groupKey: string, name: string) => `${groupKey}::${name}`;

type StoreItem = MenuItem & {
  group: string;
  code: string;
};

const storeItems = computed<Record<string, StoreItem[]>>(() => {
  const out: Record<string, StoreItem[]> = {};
  menuGroups.value.forEach((group) => {
    const items = catalog.value[group.key] ?? [];
    out[group.key] = items.map((item) => ({
      ...item,
      group: group.key,
      code: itemCode(group.key, item.name),
    }));
  });
  return out;
});

const groupItems = (groupKey: string) => storeItems.value[groupKey] ?? [];

// Solo categorias con al menos un producto
const visibleGroups = computed(() =>
  menuGroups.value.filter((group) => groupItems(group.key).length > 0),
);

const cart = reactive<Record<string, number>>({});
const mode = ref<OrderMode>("llevar");
const note = ref("");
const customer = reactive({ name: "", phone: "", address: "" });
const sendingOrder = ref(false);

// Categorias abiertas. Vacio por defecto => hay que tocar para ver los items.
const openGroups = ref<string[]>([]);

function groupCartCount(groupKey: string) {
  return groupItems(groupKey).reduce(
    (sum, item) => sum + (cart[item.code] ?? 0),
    0,
  );
}

const allExpanded = computed(
  () =>
    visibleGroups.value.length > 0 &&
    openGroups.value.length === visibleGroups.value.length,
);

function toggleAll() {
  openGroups.value = allExpanded.value
    ? []
    : visibleGroups.value.map((group) => group.key);
}

function setQty(code: string, delta: number) {
  const next = (cart[code] ?? 0) + delta;
  cart[code] = next <= 0 ? 0 : next;
}

function clearCart() {
  Object.keys(cart).forEach((key) => {
    cart[key] = 0;
  });
}

const orderSummaryLines = computed(() =>
  menuGroups.value.flatMap((group) =>
    groupItems(group.key)
      .map((item) => {
        const qty = cart[item.code] ?? 0;
        return {
          code: item.code,
          name: item.name,
          group: group.label,
          qty,
          unitPrice: item.price ?? 0,
          total: qty * (item.price ?? 0),
        };
      })
      .filter((line) => line.qty > 0),
  ),
);

const itemCount = computed(() => orderSummaryLines.value.length);
const totalQty = computed(() =>
  orderSummaryLines.value.reduce((sum, line) => sum + line.qty, 0),
);
const totalAmount = computed(() =>
  orderSummaryLines.value.reduce((sum, line) => sum + line.total, 0),
);

const needsAddress = computed(
  () => mode.value === "domicilio" && !customer.address.trim(),
);

const canSend = computed(
  () => itemCount.value > 0 && !!customer.name.trim() && !needsAddress.value,
);

const hint = computed(() => {
  if (!customer.name.trim()) {
    return "Ingresa tu nombre para continuar.";
  }
  if (needsAddress.value) {
    return "Se requiere direccion para envio a domicilio.";
  }
  return "";
});

function money(value: number) {
  return PRICE_FORMAT.format(value || 0);
}

function buildOrderMessage() {
  const lines: string[] = ["🛍️ Pedido de tienda"];

  lines.push(`👤 ${customer.name.trim()}`);
  lines.push(`Tipo: ${MODE_LABEL[mode.value]}`);

  menuGroups.value.forEach((group) => {
    const selected = groupItems(group.key).filter(
      (item) => (cart[item.code] ?? 0) > 0,
    );
    if (!selected.length) return;

    lines.push("", `${group.emoji ?? "🧺"} ${group.label}`);
    selected.forEach((item) => {
      const qty = cart[item.code] ?? 0;
      const total = qty * (item.price ?? 0);
      lines.push(
        `• ${qty}x ${item.name} (${money(item.price ?? 0)}) = ${money(total)}`,
      );
    });
  });

  lines.push("", `Total: ${money(totalAmount.value)}`);

  if (note.value.trim()) {
    lines.push(`📝 Nota: ${note.value.trim()}`);
  }

  if (customer.phone.trim()) {
    lines.push(`📱 Tel: ${customer.phone.trim()}`);
  }

  if (mode.value === "domicilio" && customer.address.trim()) {
    lines.push(`🏠 Direccion: ${customer.address.trim()}`);
  }

  return lines.join("\n");
}

function sendOrder() {
  if (!record.value || !canSend.value || sendingOrder.value) return;

  sendingOrder.value = true;
  const text = buildOrderMessage();
  const phone = record.value.whatsapp?.replace(/\D/g, "") || DEFAULT_WHATSAPP;
  openWhatsApp(text, phone);

  window.setTimeout(() => {
    sendingOrder.value = false;
  }, 1200);
}
</script>
