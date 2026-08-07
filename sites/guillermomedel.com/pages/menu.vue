<template>
  <div class="min-h-screen bg-background text-foreground font-body">
    <SeoMeta :follow="false" />

    <!-- Cargando -->
    <div v-if="pending" class="mx-auto max-w-lg px-5 pt-9 pb-40">
      <div class="mt-12 space-y-3">
        <Skeleton class="h-3 w-24" />
        <Skeleton v-for="i in 4" :key="i" class="h-20 w-full rounded-xl" />
      </div>
      <div class="mt-8 space-y-3">
        <Skeleton class="h-3 w-24" />
        <Skeleton v-for="i in 3" :key="i" class="h-20 w-full rounded-xl" />
      </div>
    </div>

    <!-- Error / sin menú publicado -->
    <div
      v-else-if="!record"
      class="grid min-h-screen place-items-center p-6 text-center"
    >
      <div class="max-w-sm">
        <p class="mb-4 text-5xl">🍽️</p>
        <h1 class="text-xl font-bold font-heading">
          {{
            loadError
              ? "No pudimos cargar el menú"
              : "El menú aún no está listo"
          }}
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {{
            loadError
              ? "Revisa tu conexión y vuelve a intentarlo."
              : "El restaurante publica el menú al abrir. Vuelve en un momento."
          }}
        </p>
        <Button variant="outline" size="sm" class="mt-4" @click="load">
          <ClientOnly><RotateCw :size="15" class="mr-2" /></ClientOnly>
          Reintentar
        </Button>
      </div>
    </div>

    <!-- Sin servicio hoy (fin de semana / semana cerrada / sin menú del día) -->
    <div
      v-else-if="!hasMenu"
      class="grid min-h-screen place-items-center p-6 text-center"
    >
      <div class="max-w-sm">
        <p class="mb-4 text-5xl">🗓️</p>
        <h1 class="text-xl font-bold font-heading">Hoy no hay servicio</h1>
        <p class="mt-2 text-sm text-muted-foreground">
          No hay menú disponible para hoy. ¿Quieres preordenar para los próximos
          días?
        </p>
        <Button as-child variant="outline" size="sm" class="mt-4">
          <NuxtLink to="/semana">Ver preórdenes</NuxtLink>
        </Button>
      </div>
    </div>

    <template v-else>
      <!-- Hero -->
      <main class="mx-auto max-w-lg space-y-8 px-5 pb-44 pt-6">
        <!-- Instrucciones -->
        <section class="rounded-lg bg-primary/5 border border-primary/10 p-4">
          <h3 class="font-bold text-sm mb-2 flex items-center gap-2">
            <span>💡</span> How to order / Cómo pedir
          </h3>
          <ol
            class="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside"
          >
            <li>Select your dishes / Selecciona tus platillos.</li>
            <li>Choose delivery/pickup / Elige entrega o recoger.</li>
            <li>
              Fill in your name / <b>Ingresa tu nombre (required/requerido)</b>.
            </li>
            <li>Tap "Send" / Presiona "Enviar".</li>
          </ol>
        </section>

        <section v-if="promoHints.length">
          <div class="mb-2 flex items-center gap-2">
            <nuxt-link
              to="/promos"
              class="flex items-center gap-1 hover:underline"
            >
              <Badge
                variant="outline"
                class="border-primary/30 bg-primary/10 text-[10px] uppercase text-primary"
              >
                Promos
              </Badge>
            </nuxt-link>
            <p class="text-xs font-bold uppercase tracking-wide">
              Promociones disponibles
            </p>
          </div>

          <div class="space-y-2">
            <div
              v-for="promo in promoHints"
              :key="promo.id"
              class="rounded-md border border-primary/10 bg-background/80 p-2"
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
            </div>
          </div>
        </section>

        <section
          v-for="group in menuGroups"
          v-show="showGroupSection(group.key)"
          :key="group.key"
        >
          <div class="mb-3 flex items-baseline gap-3">
            <h2
              class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              {{ group.label }}
              <span
                class="ml-1 font-semibold tabular-nums text-foreground/50"
                >{{ groupItems(group.key).length }}</span
              >
            </h2>
            <Separator class="shrink flex-1" />
          </div>

          <!-- ===== Taquizas: por orden ===== -->
          <div
            v-if="taquizaGroup && group.key === taquizaGroup.key"
            class="mb-3 space-y-3"
          >
            <!-- Crear una orden nueva (tacos o quesadillas). Se pueden agregar
                 tantas como quiera el cliente; cada una tiene su propio límite. -->
            <div class="grid grid-cols-2 gap-2">
              <Button
                v-for="kind in taquizaKinds"
                :key="`add-${kind}`"
                variant="outline"
                class="h-auto flex-col items-start gap-0.5 py-2"
                @click="addTaquizaOrder(kind)"
              >
                <span
                  class="flex items-center gap-1.5 text-xs font-bold uppercase"
                >
                  <ClientOnly><Plus :size="14" /></ClientOnly>
                  {{
                    kind === "tacos" ? "Orden de tacos" : "Orden de quesadillas"
                  }}
                </span>
                <span class="text-[11px] font-normal text-background">
                  {{ TAQUIZA_CAP[kind] }} piezas por orden
                </span>
              </Button>
            </div>

            <p
              v-if="!taquizaOrders.length"
              class="text-[11px] text-muted-foreground"
            >
              Agrega una orden de tacos o quesadillas para elegir tus guisos.
            </p>

            <!-- Órdenes creadas. Cada tarjeta es una orden independiente con su
                 propio tope de piezas y su propia selección de guisos. -->
            <div
              v-for="(order, idx) in taquizaOrders"
              :key="order.id"
              class="rounded-md border p-2"
            >
              <div class="mb-2 flex items-center justify-between gap-2">
                <div>
                  <p class="text-xs font-bold uppercase">
                    Orden {{ idx + 1 }} ·
                    {{ order.kind === "tacos" ? "Tacos" : "Quesadillas" }}
                  </p>
                  <p class="text-[11px] text-muted-foreground">
                    {{ orderFillTotal(order) }}/{{ TAQUIZA_CAP[order.kind] }}
                    pieza(s)
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7 text-background hover:text-destructive"
                  :aria-label="`Quitar orden ${idx + 1}`"
                  @click="removeTaquizaOrder(order.id)"
                >
                  <ClientOnly><Trash2 :size="15" /></ClientOnly>
                </Button>
              </div>

              <div v-if="groupItems(group.key).length" class="space-y-2">
                <Card
                  v-for="item in groupItems(group.key)"
                  :key="`${order.id}-${item.name}`"
                  class="flex items-center gap-3 p-3"
                  :class="[
                    isOut(item.name) && 'opacity-60',
                    (order.fills[item.name] ?? 0) > 0 &&
                      'bg-primary/5 ring-1 ring-primary/40',
                  ]"
                >
                  <div class="flex-1">
                    <p
                      class="font-semibold leading-tight"
                      :class="
                        isOut(item.name) && 'text-muted-foreground line-through'
                      "
                    >
                      {{ item.name }}
                    </p>
                  </div>

                  <div
                    v-if="!isOut(item.name)"
                    class="flex shrink-0 items-center gap-1"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      class="h-8 w-8"
                      :disabled="(order.fills[item.name] ?? 0) <= 0"
                      @click="setOrderFill(order, item.name, -1)"
                    >
                      <ClientOnly><Minus :size="15" /></ClientOnly>
                    </Button>
                    <span class="w-6 text-center font-bold tabular-nums">
                      {{ order.fills[item.name] ?? 0 }}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      class="h-8 w-8"
                      :disabled="!canAddToOrder(order)"
                      @click="setOrderFill(order, item.name, 1)"
                    >
                      <ClientOnly><Plus :size="15" /></ClientOnly>
                    </Button>
                  </div>
                </Card>
              </div>
              <p v-else class="text-[11px] text-muted-foreground">
                No hay guisos disponibles para taquizas hoy.
              </p>

              <p class="mt-2 text-[11px] text-muted-foreground">
                Máximo {{ TAQUIZA_CAP[order.kind] }} pieza(s) en esta orden.
              </p>
            </div>
          </div>

          <!-- ===== Grupos normales ===== -->
          <div
            v-if="
              groupItems(group.key).length &&
              !(taquizaGroup && group.key === taquizaGroup.key)
            "
            class="space-y-2"
          >
            <Card
              v-for="item in groupItems(group.key)"
              :key="item.name"
              class="flex items-center gap-3 p-3 transition-colors"
              :class="[
                isOut(item.name) && 'opacity-60',
                cart[item.name] > 0 && 'bg-primary/5 ring-1 ring-primary/40',
              ]"
            >
              <div class="flex-1">
                <p
                  class="font-semibold leading-tight"
                  :class="
                    isOut(item.name) && 'text-muted-foreground line-through'
                  "
                >
                  {{ item.name }}
                </p>
                <p
                  v-if="item?.price !== 0"
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
                <template v-if="cart[item.name]">
                  <Button
                    variant="outline"
                    size="icon"
                    class="h-8 w-8"
                    :aria-label="`Quitar uno de ${item.name}`"
                    :disabled="isGroupLocked(group.key)"
                    @click="setQty(group.key, item.name, -1)"
                  >
                    <ClientOnly><Minus :size="15" /></ClientOnly>
                  </Button>
                  <span
                    class="w-6 text-center font-bold tabular-nums"
                    aria-live="polite"
                    >{{ cart[item.name] }}</span
                  >
                </template>
                <Button
                  variant="outline"
                  size="icon"
                  class="h-8 w-8"
                  :aria-label="`Agregar ${item.name}`"
                  :disabled="!canAddItem(group.key)"
                  @click="setQty(group.key, item.name, 1)"
                >
                  <ClientOnly><Plus :size="15" /></ClientOnly>
                </Button>
              </div>
            </Card>
          </div>

          <p
            v-if="isGroupLocked(group.key)"
            class="mt-2 text-[11px] text-muted-foreground"
          >
            {{ lockReason(group.key) }}
          </p>
        </section>

        <section>
          <h2
            class="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            ¿Cómo lo quieres? / How do you want it?
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
            Totales / Pricing totals
          </h2>
          <Card class="p-4">
            <div class="space-y-3">
              <div
                v-for="line in orderSummaryLines"
                :key="`${line.kind}-${line.code}`"
                class="flex items-start justify-between gap-3"
              >
                <div class="min-w-0 flex-1">
                  <p class="font-semibold leading-tight">{{ line.label }}</p>
                  <p class="text-[11px] text-muted-foreground">
                    {{ line.qty }} x
                    {{
                      line.unitPrice > 0 ? money(line.unitPrice) : "Incluido"
                    }}
                  </p>
                  <p
                    v-if="line.detail"
                    class="text-[11px] text-muted-foreground"
                  >
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
                  {{ money(pricingSummaryWithDelivery.total) }}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2
            class="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            Tus datos / Your Info
          </h2>
          <Card class="space-y-4 p-4">
            <div class="space-y-1.5">
              <Label for="c-name" class="flex items-center gap-1">
                Tu nombre / Your name <span class="text-destructive">*</span>
              </Label>
              <Input
                id="c-name"
                v-model="customer.name"
                placeholder="Ej. Juan Pérez / e.g. John Doe"
                :class="{
                  'border-destructive focus-visible:ring-destructive':
                    itemCount > 0 && !customer.name.trim(),
                }"
              />
              <p
                v-if="itemCount > 0 && !customer.name.trim()"
                class="text-[11px] text-destructive"
              >
                Required to complete your order / Requerido para completar tu
                pedido.
              </p>
            </div>

            <!-- Código de socio (opcional). Texto plano: se estampa en el
                 mensaje de WhatsApp; el staff valida y redime al servir. -->
            <div class="space-y-1.5">
              <Label for="c-code"
                >Código de socio / Member code (opcional)</Label
              >
              <Input
                id="c-code"
                v-model="memberCode"
                autocomplete="off"
                placeholder="Ej. GM1234"
                class="uppercase tracking-widest"
                @blur="
                  memberCode = memberCode.replace(/\s+/g, '').toUpperCase()
                "
              />
              <p class="text-[11px] text-muted-foreground">
                Si eres socio, ingresa tu código para usar una de tus comidas.
              </p>
            </div>

            <template v-if="mode === 'domicilio'">
              <div class="space-y-1.5">
                <Label for="c-phone">WhatsApp / Phone</Label>
                <Input
                  id="c-phone"
                  v-model="customer.phone"
                  type="tel"
                  placeholder="10 dígitos"
                />
              </div>

              <div class="space-y-1.5">
                <Label for="c-address" class="flex items-center gap-1">
                  Dirección / Address <span class="text-destructive">*</span>
                </Label>
                <Input
                  id="c-address"
                  v-model="customer.address"
                  placeholder="Calle, número, referencias"
                  :class="{
                    'border-destructive focus-visible:ring-destructive':
                      itemCount > 0 && needsAddress,
                  }"
                />
                <p
                  v-if="itemCount > 0 && needsAddress"
                  class="text-[11px] text-destructive"
                >
                  Required for delivery / Requerida para envíos a domicilio.
                </p>
              </div>
            </template>

            <!-- Hora: para "aquí" y "para llevar" (no domicilio). Opcional, sin default -->
            <div v-if="mode !== 'domicilio'" class="space-y-1.5">
              <Label>{{ timeLabel }} (opcional/optional)</Label>
              <div class="flex items-center gap-1.5">
                <Select v-model="selHour">
                  <SelectTrigger class="flex-1">
                    <SelectValue placeholder="Hora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="h in hours12" :key="h" :value="h">
                      {{ h }}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <span class="font-bold text-muted-foreground">:</span>

                <Select v-model="selMin">
                  <SelectTrigger class="flex-1">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="m in minutes" :key="m" :value="m">
                      {{ m }}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div class="flex overflow-hidden border rounded-md">
                  <button
                    type="button"
                    class="px-2.5 py-2 text-xs font-bold uppercase transition-colors"
                    :class="
                      selPeriod === 'am'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    "
                    @click="selPeriod = 'am'"
                  >
                    am
                  </button>
                  <button
                    type="button"
                    class="px-2.5 py-2 text-xs font-bold uppercase transition-colors border-l"
                    :class="
                      selPeriod === 'pm'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    "
                    @click="selPeriod = 'pm'"
                  >
                    pm
                  </button>
                </div>
              </div>
              <button
                v-if="selHour || selMin || selPeriod"
                type="button"
                class="text-[11px] font-bold underline text-muted-foreground hover:text-primary"
                @click="clearTime"
              >
                Lo antes posible / ASAP
              </button>
            </div>

            <div class="space-y-1.5">
              <Label for="c-note">Nota / Note (opcional/optional)</Label>
              <Textarea
                id="c-note"
                v-model="note"
                rows="2"
                placeholder="Sin cebolla, casa roja / No onions, red house…"
              />
            </div>
          </Card>
        </section>
      </main>

      <!-- Barra fija -->
      <div
        class="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-5 py-3 backdrop-blur"
      >
        <div class="mx-auto max-w-lg space-y-2">
          <div
            class="flex items-center justify-between text-xs text-muted-foreground"
          >
            <span class="tabular-nums">
              <template v-if="totalQty">
                {{ totalQty }} platillo{{ totalQty === 1 ? "" : "s" }} ·
                {{ MODE_LABEL[mode] }}
              </template>
              <template v-else>
                Tu pedido / Your order · {{ MODE_LABEL[mode] }}
              </template>
            </span>
            <span
              v-if="orderSummaryLines.length"
              class="font-semibold tabular-nums"
            >
              {{ money(pricingSummaryWithDelivery.total) }}
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
              :disabled="!canTrySend || sendingOrder"
              @click="sendOrder"
            >
              <ClientOnly><Send :size="17" class="mr-2" /></ClientOnly>
              {{ sendingOrder ? "Enviando..." : "Enviar / Send" }}
            </Button>
          </div>

          <p
            v-if="itemCount && !canTrySend"
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@common/components/ui/select";
import {
  Plus,
  Minus,
  Send,
  Trash2,
  ShoppingBag,
  Bike,
  Utensils,
  RotateCw,
} from "lucide-vue-next";
import {
  DRINK_GROUP_KEYS,
  MAIN_GROUP_KEYS,
  SIDE_GROUP_KEYS,
  comboForItem,
  emptyDayDishes,
  findMenuItemByName,
  groupByKey,
  groups as baseGroups,
  groupsFromData,
  MODES,
  MODE_SHORT,
  normalizeDishNames,
  normalizeMenuCatalog,
  todayISO,
  type DayDishes,
  type GroupKey,
  type MenuCatalog,
  type MenuItem,
  type MenuRecord,
} from "~/utils/comandas";
import {
  resolveDay,
  type RotationConfig,
  type WeekBlock,
  type WeekOverride,
} from "~/utils/rotation";
import { MODE_LABEL, type OrderMode } from "~/composables/useWhatsappOrder";
import { menuPricingConfig } from "~/config/menu-pricing";
import { priceMenuOrder } from "~/utils/menuPricing";

definePageMeta({ layout: "breezy" });

const { fetchCollection } = usePocketBaseCore();
const { formatCustomerOrder } = useMenuLink();
const { openWhatsApp } = useWhatsappOrder();

const EMPTY_DISHES: DayDishes = emptyDayDishes();
const RESTAURANT_WHATSAPP = "6221523259";
const DELIVERY_FEE = 50;
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

// Registro `menu` con los campos de rotación.
type MenuRecordFull = MenuRecord & {
  week_blocks?: WeekBlock[];
  rotation?: string[];
  rotation_anchor?: string;
  overrides?: Record<string, WeekOverride>;
  active_date?: string;
};

const record = ref<MenuRecordFull | null>(null);
const pending = ref(true);
const loadError = ref(false);

async function load() {
  pending.value = true;
  loadError.value = false;
  try {
    const res = await fetchCollection(
      "menu",
      1,
      1,
      "",
      "-created",
      null,
      null,
      true,
    );
    record.value = (res.items[0] as unknown as MenuRecordFull) ?? null;
  } catch {
    loadError.value = true;
    record.value = null;
  } finally {
    pending.value = false;
  }
}

onMounted(load);

/**
 * Menú del día: mismo criterio que la app de comandas.
 *  1) Si hay un `active` fijado HOY (turno iniciado o ajuste manual), ese manda.
 *  2) Si no, se resuelve la fecha de hoy contra la rotación semanal (bloques).
 */
const active = computed<DayDishes>(() => {
  const rec = record.value;
  if (!rec) return EMPTY_DISHES;

  const a = normalizeDishNames(
    rec.active as Partial<Record<GroupKey, unknown>>,
  );
  const activeFresh =
    rec.active_date === todayISO() &&
    groupsFromData(a as Record<string, unknown>).some(
      (g) => (a[g.key] ?? []).length > 0,
    );
  if (activeFresh) return a;

  const cfg: RotationConfig = {
    blocks: rec.week_blocks ?? [],
    rotation: rec.rotation ?? [],
    anchor: rec.rotation_anchor ?? "",
    overrides: rec.overrides ?? {},
  };
  const resolved = resolveDay(todayISO(), cfg);
  return resolved
    ? normalizeDishNames(resolved.menu as Partial<Record<GroupKey, unknown>>)
    : EMPTY_DISHES;
});

const menuGroups = computed(() => {
  const fromMenu = groupsFromData({
    ...(record.value?.dishes as Record<string, unknown>),
    ...(active.value as Record<string, unknown>),
  });
  const knownKeys = new Set<string>(baseGroups.map((group) => group.key));
  const extraGroups = fromMenu.filter((group) => !knownKeys.has(group.key));

  return [...baseGroups, ...extraGroups];
});

const hasMenu = computed(() =>
  menuGroups.value.some((g) => active.value[g.key]?.length),
);

const catalog = computed<MenuCatalog>(() =>
  normalizeMenuCatalog(
    record.value?.dishes as Partial<Record<GroupKey, unknown>> | undefined,
  ),
);

type ActiveMenuItem = MenuItem & { group: GroupKey };

const activeItems = computed<Record<GroupKey, ActiveMenuItem[]>>(() => {
  const out = {} as Record<GroupKey, ActiveMenuItem[]>;

  menuGroups.value.forEach((g) => {
    const names = active.value[g.key] ?? [];

    out[g.key] = names.map((name) => {
      const found = findMenuItemByName(catalog.value, name);
      if (found?.item) {
        return { ...found.item, group: found.group };
      }
      return {
        name,
        price: 0,
        combo: comboForItem(null, g.key),
        group: g.key,
      };
    });
  });
  return out;
});

const groupItems = (k: GroupKey) => activeItems.value[k] ?? [];
const taquizaGroup = baseGroups.find((g) => "pieceOptions" in g) as
  | ((typeof baseGroups)[number] & {
      pieceOptions: { tacos: number; quesadillas: number };
    })
  | undefined;

function showGroupSection(key: GroupKey) {
  return groupItems(key).length > 0;
}

const soldOut = computed<string[]>(() => record.value?.sold_out ?? []);
const isOut = (n: string) => soldOut.value.includes(n);

const cart = reactive<Record<string, number>>({});
const mode = ref<OrderMode>("llevar");
const note = ref("");
const customer = reactive({ name: "", phone: "", address: "" });

// Código de socio (opcional, texto plano). No se valida aquí: se estampa en el
// mensaje de WhatsApp para que el staff lo vea y redima al servir.
const memberCode = ref("");

const sendingOrder = ref(false);

/* ===== Taquizas: modelo por orden =====
 * Cada orden es una unidad independiente (tacos = 3 piezas, quesadillas = 2).
 * El cliente crea tantas órdenes como quiera; dentro de cada una elige sus
 * guisos hasta el tope de esa orden. El `cart` sigue el invariante que espera
 * la cocina: cart[nombre] = porción normal + suma de esa pieza en todas las
 * órdenes de taquiza (por eso siempre usamos deltas, nunca reasignación).
 */
type TaquizaKind = "tacos" | "quesadillas";
const taquizaKinds: TaquizaKind[] = ["tacos", "quesadillas"];

const taquizaRules = {
  tacos: taquizaGroup?.pieceOptions?.tacos ?? 3,
  quesadillas: taquizaGroup?.pieceOptions?.quesadillas ?? 2,
};

const TAQUIZA_CAP: Record<TaquizaKind, number> = {
  tacos: taquizaRules.tacos,
  quesadillas: taquizaRules.quesadillas,
};

interface TaquizaOrder {
  id: string;
  kind: TaquizaKind;
  fills: Record<string, number>; // guiso -> cantidad en esta orden
}

const taquizaOrders = ref<TaquizaOrder[]>([]);

let taquizaSeq = 0;
function nextTaquizaId() {
  taquizaSeq += 1;
  return `tq_${Date.now().toString(36)}_${taquizaSeq}`;
}

function orderFillTotal(order: TaquizaOrder) {
  return Object.values(order.fills).reduce((sum, q) => sum + q, 0);
}

function canAddToOrder(order: TaquizaOrder) {
  return orderFillTotal(order) < TAQUIZA_CAP[order.kind];
}

/**
 * Ajuste RELATIVO del cart para piezas de taquiza. Nunca reasigna el total: un
 * guiso puede vivir a la vez en `guisos` y en `taquizas` (p. ej. "Birria"), y
 * ambas porciones comparten la misma llave del cart.
 */
function applyTaquizaDelta(name: string, delta: number) {
  const next = (cart[name] ?? 0) + delta;
  cart[name] = next <= 0 ? 0 : next;
}

function addTaquizaOrder(kind: TaquizaKind) {
  taquizaOrders.value.push({ id: nextTaquizaId(), kind, fills: {} });
}

function removeTaquizaOrder(id: string) {
  const idx = taquizaOrders.value.findIndex((o) => o.id === id);
  if (idx === -1) return;
  const [removed] = taquizaOrders.value.splice(idx, 1);
  Object.entries(removed.fills).forEach(([name, qty]) => {
    if (qty > 0) applyTaquizaDelta(name, -qty);
  });
}

function setOrderFill(order: TaquizaOrder, name: string, delta: number) {
  if (delta > 0) {
    if (!canAddToOrder(order)) return;
    order.fills[name] = (order.fills[name] ?? 0) + 1;
    applyTaquizaDelta(name, 1);
  } else {
    const cur = order.fills[name] ?? 0;
    if (cur <= 0) return;
    const next = cur - 1;
    if (next <= 0) delete order.fills[name];
    else order.fills[name] = next;
    applyTaquizaDelta(name, -1);
  }
}

// Vista "por tipo" que espera la cocina (formatCustomerOrder / comandas.ts):
// aplanamos todas las órdenes a un mapa nombre -> cantidad por tipo.
const taquizaByKind = computed<Record<TaquizaKind, Record<string, number>>>(
  () => {
    const out: Record<TaquizaKind, Record<string, number>> = {
      tacos: {},
      quesadillas: {},
    };
    taquizaOrders.value.forEach((order) => {
      Object.entries(order.fills).forEach(([name, qty]) => {
        if (qty > 0) {
          out[order.kind][name] = (out[order.kind][name] ?? 0) + qty;
        }
      });
    });
    return out;
  },
);

const taquizaOrderCount = computed<Record<TaquizaKind, number>>(() => ({
  tacos: taquizaOrders.value.filter((o) => o.kind === "tacos").length,
  quesadillas: taquizaOrders.value.filter((o) => o.kind === "quesadillas")
    .length,
}));

const taquizaSelectedByKind = computed<Record<TaquizaKind, number>>(() => {
  const sum = (k: TaquizaKind) =>
    Object.values(taquizaByKind.value[k]).reduce((s, q) => s + q, 0);
  return { tacos: sum("tacos"), quesadillas: sum("quesadillas") };
});

const hasTaquizaOrder = computed(() => taquizaOrders.value.length > 0);

/** Piezas de taquiza (todas las órdenes) de un mismo guiso, para no doblar
 *  su conteo en los totales del guiso normal cuando el nombre se comparte. */
function taquizaTotalForName(name: string) {
  return (
    (taquizaByKind.value.tacos[name] ?? 0) +
    (taquizaByKind.value.quesadillas[name] ?? 0)
  );
}

/* ===== Hora (para "aquí" y "para llevar"; opcional, sin default) ===== */
const hours12 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const minutes = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

const selHour = ref<string>();
const selMin = ref<string>();
const selPeriod = ref<"am" | "pm">();

const pickupTime = computed(() => {
  if (!selHour.value || !selPeriod.value) return "";
  const mm = selMin.value || "00";
  let h = Number(selHour.value) % 12;
  if (selPeriod.value === "pm") h += 12;
  return `${String(h).padStart(2, "0")}:${mm}`;
});

const timeLabel = computed(() =>
  mode.value === "aqui"
    ? "Hora de llegada / Arrival time"
    : "Hora de recolección / Pickup time",
);

function clearTime() {
  selHour.value = undefined;
  selMin.value = undefined;
  selPeriod.value = undefined;
}

const cartItems = computed(() =>
  Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([name, qty]) => ({ name, qty })),
);

const promoHints = computed(() =>
  menuPricingConfig.promos
    .filter((promo) => promo.active !== false)
    .filter((promo) => promoIsAvailableToday(promo))
    .map((promo) => ({
      id: promo.id,
      label: promo.label,
      summary: promoSummary(promo),
      price: promo.pricing.amount,
    })),
);

interface PromoHint {
  id: string;
  label: string;
  summary: string;
  price: number;
}

function promoRequirementLabel(
  requirement: (typeof menuPricingConfig.promos)[number]["match"]["requirements"][number],
) {
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
      .map((requirement) => {
        const label = promoRequirementLabel(requirement);
        return `${requirement.qty} ${label}`;
      })
      .join(" + ")
  );
}

function promoIsAvailableToday(
  promo: (typeof menuPricingConfig.promos)[number],
) {
  return promo.match.requirements.every((requirement) => {
    if (requirement.targetType === "group") {
      const group = menuGroups.value.find(
        (entry) => entry.key === requirement.target,
      );
      if (!group) return false;
      const availableCount = groupItems(group.key).filter(
        (item) => !isOut(item.name),
      ).length;
      return availableCount >= requirement.qty;
    }

    if (requirement.targetType === "item") {
      const found = menuGroups.value
        .flatMap((group) => groupItems(group.key))
        .find((item) => item.name === requirement.target && !isOut(item.name));
      return !!found;
    }

    if (!taquizaGroup) return false;
    const taquizaAvailable = groupItems(taquizaGroup.key).filter(
      (item) => !isOut(item.name),
    ).length;
    return taquizaAvailable > 0;
  });
}

const pricingSummary = computed(() => {
  const standardItems = menuGroups.value.flatMap((group) => {
    if (taquizaGroup && group.key === taquizaGroup.key) return [];

    return groupItems(group.key)
      .map((item) => ({
        name: item.name,
        group: group.key,
        // Resta la porción de taquiza cuando el nombre se comparte, para no
        // cobrar dos veces un guiso que también es relleno de taquiza.
        qty: Math.max(
          0,
          (cart[item.name] ?? 0) - taquizaTotalForName(item.name),
        ),
        unitPrice: item.price ?? 0,
      }))
      .filter((entry) => entry.qty > 0);
  });

  const taquizaUnits = [
    { code: "taquiza:tacos", qty: taquizaOrderCount.value.tacos },
    { code: "taquiza:quesadillas", qty: taquizaOrderCount.value.quesadillas },
  ]
    .filter((unit) => unit.qty > 0)
    .map((unit) => ({
      code: unit.code,
      qty: unit.qty,
      label: menuPricingConfig.orderUnits?.[unit.code]?.label ?? unit.code,
      unitPrice: menuPricingConfig.orderUnits?.[unit.code]?.unitPrice ?? 0,
    }));

  return priceMenuOrder({
    items: standardItems,
    orderUnits: taquizaUnits,
    config: menuPricingConfig,
  });
});

const pricingSummaryWithDelivery = computed(() => {
  const base = pricingSummary.value;
  const shouldAddDelivery = mode.value === "domicilio" && itemCount.value > 0;
  if (!shouldAddDelivery) return base;

  return {
    lines: [
      ...base.lines,
      {
        kind: "item" as const,
        code: "delivery-fee",
        label: "Cargo por domicilio",
        qty: 1,
        unitPrice: DELIVERY_FEE,
        total: DELIVERY_FEE,
      },
    ],
    total: base.total + DELIVERY_FEE,
  };
});

const orderSummaryLines = computed(
  () => pricingSummaryWithDelivery.value.lines,
);

const itemCount = computed(() => cartItems.value.length);
const totalQty = computed(() =>
  cartItems.value.reduce((sum, it) => sum + it.qty, 0),
);

const needsAddress = computed(
  () => mode.value === "domicilio" && !customer.address.trim(),
);

const canSend = computed(
  () => itemCount.value > 0 && !!customer.name.trim() && !needsAddress.value,
);

const canTrySend = canSend;

const hint = computed(() =>
  !customer.name.trim()
    ? "Please enter your name to proceed / Ingresa tu nombre para continuar."
    : needsAddress.value
      ? "Address is required for delivery / Se requiere dirección para el envío."
      : "",
);

function money(value: number) {
  return PRICE_FORMAT.format(value || 0);
}

function isGroupLocked(k: GroupKey) {
  return false;
}

function lockReason(k: GroupKey) {
  return "";
}

function canAddItem(k: GroupKey) {
  if (isGroupLocked(k)) return false;
  // Las taquizas no se agregan desde el bloque normal, sino por orden.
  if (taquizaGroup && k === taquizaGroup.key) return false;
  return true;
}

function setQty(k: GroupKey, n: string, d: number) {
  // El grupo de taquizas se maneja por orden (setOrderFill), nunca aquí.
  if (taquizaGroup && k === taquizaGroup.key) return;
  if (d > 0 && !canAddItem(k)) return;
  applyTaquizaDelta(n, d); // suma/resta relativa: preserva la porción de taquiza
}

function clearCart() {
  for (const k of Object.keys(cart)) cart[k] = 0;
  taquizaOrders.value = [];
}

function buildNote() {
  const pieces: string[] = [];
  // La hora aplica a "aquí" y "para llevar" (no domicilio).
  if (pickupTime.value && mode.value !== "domicilio") {
    const verb = mode.value === "aqui" ? "Llegada" : "Recoger";
    pieces.push(`${verb} a las ${pickupTime.value}`);
  }
  if (hasTaquizaOrder.value) {
    const summary = [
      taquizaOrderCount.value.tacos > 0
        ? `${taquizaOrderCount.value.tacos} orden(es) de tacos (${taquizaRules.tacos} c/u, ${taquizaSelectedByKind.value.tacos} seleccionadas)`
        : "",
      taquizaOrderCount.value.quesadillas > 0
        ? `${taquizaOrderCount.value.quesadillas} orden(es) de quesadillas (${taquizaRules.quesadillas} c/u, ${taquizaSelectedByKind.value.quesadillas} seleccionadas)`
        : "",
    ]
      .filter(Boolean)
      .join(", ");
    pieces.push(`Taquiza: ${summary}`);
  }
  if (mode.value === "domicilio" && itemCount.value > 0) {
    pieces.push(`Cargo por domicilio: ${money(DELIVERY_FEE)}`);
  }
  if (note.value.trim()) pieces.push(note.value.trim());
  return pieces.join(" · ");
}

function sendOrder() {
  if (!record.value || !canTrySend.value || sendingOrder.value) return;

  if (!canSend.value) return;
  sendingOrder.value = true;
  const a = active.value; // menú resuelto (rotación o `active` de hoy)

  // Si hay código de socio, se estampa en la nota (texto plano). El staff lo
  // valida y descuenta la comida del lado autenticado al servir.
  const code = memberCode.value.replace(/\s+/g, "").toUpperCase();
  const memberTag = code ? `SOCIO ${code}` : "";

  const snapshotTaquizaByKind = {
    tacos: { ...taquizaByKind.value.tacos },
    quesadillas: { ...taquizaByKind.value.quesadillas },
  };

  const text = formatCustomerOrder({
    name: customer.name,
    cart: { ...cart },
    mode: mode.value,
    dishes: a,
    taquizaByKind: snapshotTaquizaByKind,
    note: [buildNote(), memberTag].filter(Boolean).join(" · "),
    phone: customer.phone,
    address: customer.address,
  });
  openWhatsApp(text, RESTAURANT_WHATSAPP);

  // Evita doble-tap y mensajes duplicados en móviles.
  window.setTimeout(() => {
    sendingOrder.value = false;
  }, 1200);
}
</script>
