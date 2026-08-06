<template>
  <div class="min-h-screen bg-background text-foreground font-body">
    <SeoMeta :follow="false" />

    <!-- Cargando -->
    <div v-if="pending" class="mx-auto max-w-lg px-5 pt-9 pb-40">
      <div class="flex flex-col items-center gap-3 text-center">
        <Skeleton class="h-24 w-24 rounded-full" />
        <div class="space-y-2 mt-2 flex flex-col items-center">
          <Skeleton class="h-3 w-24" />
          <Skeleton class="h-8 w-48" />
          <Skeleton class="h-4 w-32" />
        </div>
      </div>
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

        <section
          v-for="group in groups"
          v-show="groupItems(group.key).length"
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

          <div class="space-y-2">
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
                  :disabled="isGroupLocked(group.key)"
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
              :disabled="!canSend"
              @click="sendOrder"
            >
              <ClientOnly><Send :size="17" class="mr-2" /></ClientOnly>
              Enviar / Send
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
  comboForItem,
  emptyDayDishes,
  findMenuItemByName,
  groups,
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

definePageMeta({ layout: "breezy" });

const { fetchCollection } = usePocketBaseCore();
const { formatCustomerOrder } = useMenuLink();
const { openWhatsApp } = useWhatsappOrder();

const EMPTY_DISHES: DayDishes = emptyDayDishes();
const RESTAURANT_WHATSAPP = "6221523259";
const PRICE_FORMAT = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});
const MAIN_GROUPS: GroupKey[] = [
  "guisos",
  "taquizas",
  "tortas_burgers_burritos",
];

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
    groups.some((g) => (a[g.key] ?? []).length > 0);
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

const hasMenu = computed(() => groups.some((g) => active.value[g.key].length));

const catalog = computed<MenuCatalog>(() =>
  normalizeMenuCatalog(
    record.value?.dishes as Partial<Record<GroupKey, unknown>> | undefined,
  ),
);

type ActiveMenuItem = MenuItem & { group: GroupKey };

const activeItems = computed<Record<GroupKey, ActiveMenuItem[]>>(() => {
  const out = {} as Record<GroupKey, ActiveMenuItem[]>;

  groups.forEach((g) => {
    out[g.key] = [];
    out[g.key] = (active.value[g.key] ?? []).map((name) => {
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

const soldOut = computed<string[]>(() => record.value?.sold_out ?? []);
const isOut = (n: string) => soldOut.value.includes(n);

const cart = reactive<Record<string, number>>({});
const mode = ref<OrderMode>("llevar");
const note = ref("");
const customer = reactive({ name: "", phone: "", address: "" });

// Código de socio (opcional, texto plano). No se valida aquí: se estampa en el
// mensaje de WhatsApp para que el staff lo vea y redima al servir.
const memberCode = ref("");

/* ===== Hora (para "aquí" y "para llevar"; opcional, sin default) =====
 * Tres selecciones independientes que arrancan vacías. `pickupTime` solo se
 * arma cuando hay hora + am/pm (los minutos, si faltan, caen a :00). Mientras
 * no se elija nada, queda "" y la orden se envía sin hora (lo antes posible).
 * No aplica a domicilio.
 */
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

const itemCount = computed(() => cartItems.value.length);
const totalQty = computed(() =>
  cartItems.value.reduce((sum, it) => sum + it.qty, 0),
);

const selectedMain = computed(() =>
  MAIN_GROUPS.flatMap((k) =>
    groupItems(k)
      .filter((item) => (cart[item.name] ?? 0) > 0)
      .map((item) => ({
        ...item,
        qty: cart[item.name] ?? 0,
        rules: comboForItem(item, k),
      })),
  ),
);

const selectedMainQty = computed(() =>
  selectedMain.value.reduce((sum, x) => sum + x.qty, 0),
);

const sidesQty = computed(() =>
  groupItems("sides").reduce((sum, i) => sum + (cart[i.name] ?? 0), 0),
);

const drinksQty = computed(() =>
  groupItems("bebidas").reduce((sum, i) => sum + (cart[i.name] ?? 0), 0),
);

const sidesLocked = computed(() =>
  selectedMain.value.some((x) => !x.rules.allowSides),
);

const drinksLocked = computed(() =>
  selectedMain.value.some((x) => !x.rules.allowDrink),
);

const requiredSides = computed(() =>
  selectedMain.value.reduce((max, x) => {
    if (!x.rules.allowSides) return max;
    return Math.max(max, x.rules.requiredSides);
  }, 0),
);

const requiresDrink = computed(() =>
  selectedMain.value.some((x) => x.rules.allowDrink && x.rules.requiredDrink),
);

const missingMain = computed(() => selectedMainQty.value <= 0);
const missingSides = computed(
  () =>
    !missingMain.value &&
    !sidesLocked.value &&
    sidesQty.value < requiredSides.value,
);
const missingDrink = computed(
  () =>
    !missingMain.value &&
    !drinksLocked.value &&
    requiresDrink.value &&
    drinksQty.value < 1,
);

const needsAddress = computed(
  () => mode.value === "domicilio" && !customer.address.trim(),
);

const canSend = computed(
  () =>
    itemCount.value > 0 &&
    !missingMain.value &&
    !missingSides.value &&
    !missingDrink.value &&
    !!customer.name.trim() &&
    !needsAddress.value,
);

const hint = computed(() =>
  !customer.name.trim()
    ? "Please enter your name to proceed / Ingresa tu nombre para continuar."
    : missingMain.value
      ? "Choose at least one main dish / Elige al menos un platillo principal."
      : missingSides.value
        ? `This combo needs ${requiredSides.value} side(s) / Este combo requiere ${requiredSides.value} guarnición(es).`
        : missingDrink.value
          ? "This combo needs one drink / Este combo requiere una bebida."
          : needsAddress.value
            ? "Address is required for delivery / Se requiere dirección para el envío."
            : "",
);

function money(value: number) {
  return PRICE_FORMAT.format(value || 0);
}

function clearGroup(k: GroupKey) {
  groupItems(k).forEach((item) => {
    cart[item.name] = 0;
  });
}

watch(sidesLocked, (locked) => {
  if (locked) clearGroup("sides");
});

watch(drinksLocked, (locked) => {
  if (locked) clearGroup("bebidas");
});

function isGroupLocked(k: GroupKey) {
  if (k === "sides") return sidesLocked.value;
  if (k === "bebidas") return drinksLocked.value;
  return false;
}

function lockReason(k: GroupKey) {
  if (k === "sides" && sidesLocked.value) {
    return "Un platillo seleccionado no incluye guarniciones.";
  }
  if (k === "bebidas" && drinksLocked.value) {
    return "Un platillo seleccionado no incluye bebida.";
  }
  return "";
}

function setQty(k: GroupKey, n: string, d: number) {
  if (d > 0 && isGroupLocked(k)) return;
  const q = (cart[n] || 0) + d;
  cart[n] = q <= 0 ? 0 : q;
}

function clearCart() {
  for (const k of Object.keys(cart)) cart[k] = 0;
}

function buildNote() {
  const pieces: string[] = [];
  // La hora aplica a "aquí" y "para llevar" (no domicilio).
  if (pickupTime.value && mode.value !== "domicilio") {
    const verb = mode.value === "aqui" ? "Llegada" : "Recoger";
    pieces.push(`${verb} a las ${pickupTime.value}`);
  }
  if (note.value.trim()) pieces.push(note.value.trim());
  return pieces.join(" · ");
}

function sendOrder() {
  if (!record.value || !canSend.value) return;
  const a = active.value; // menú resuelto (rotación o `active` de hoy)

  // Si hay código de socio, se estampa en la nota (texto plano). El staff lo
  // valida y descuenta la comida del lado autenticado al servir.
  const code = memberCode.value.replace(/\s+/g, "").toUpperCase();
  const memberTag = code ? `SOCIO ${code}` : "";

  const text = formatCustomerOrder({
    name: customer.name,
    cart,
    mode: mode.value,
    dishes: a,
    note: [buildNote(), memberTag].filter(Boolean).join(" · "),
    phone: customer.phone,
    address: customer.address,
  });
  openWhatsApp(text, RESTAURANT_WHATSAPP);
}
</script>
