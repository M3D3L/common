<template>
  <div
    class="relative min-h-screen overflow-x-clip bg-gradient-to-b from-background via-background to-muted/20 text-foreground font-body"
  >
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        class="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        class="absolute bottom-20 -left-20 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl"
      />
      <div
        class="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
      />
    </div>

    <!-- Cargando -->
    <OrganismsMenuLoadingState v-if="pending" />

    <!-- Error / sin menú publicado -->
    <OrganismsMenuUnavailableState
      v-else-if="!record"
      :load-error="!!loadError"
      @retry="load"
    />

    <!-- Sin servicio hoy (fin de semana / semana cerrada / sin menú del día) -->
    <div
      v-else-if="!hasMenu"
      class="grid min-h-screen place-items-center p-6 text-center"
    >
      <div
        class="w-full max-w-md rounded-2xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur"
      >
        <p class="mb-4 text-5xl">🗓️</p>
        <h1 class="text-xl font-bold font-heading">Hoy no hay servicio</h1>

        <Card
          class="mt-3 flex w-full items-center justify-between rounded-xl border-border/70 bg-background/70 px-3 py-2"
          aria-label="Seleccionar día del menú"
        >
          <OrganismsMenuDayPicker
            :label="selectedDateLabel"
            @prev="changeMenuDate(-1)"
            @next="changeMenuDate(1)"
          />
        </Card>
        <p class="mt-4 text-sm text-muted-foreground">
          No hay menú disponible para hoy. ¿Quieres preordenar para los próximos
          días?
        </p>
        <!-- <Button as-child variant="outline" size="sm" class="mt-4">
          <NuxtLink to="/semana">Ver preórdenes</NuxtLink>
        </Button> -->
      </div>
    </div>

    <template v-else>
      <!-- Hero -->
      <main
        ref="menuMainEl"
        class="mx-auto max-w-2xl space-y-8 px-4 pb-48 pt-5 sm:px-6 sm:pt-7"
      >
        <!-- Instrucciones -->
        <OrganismsMenuInstructions v-if="!props.staffMode" />

        <section
          v-if="props.useDailyMenu"
          class="js-reveal-item sticky top-2 z-20 flex items-center justify-between rounded-2xl border border-primary/20 bg-background/90 px-3 py-2 shadow-sm backdrop-blur"
          aria-label="Seleccionar día del menú"
        >
          <OrganismsMenuDayPicker
            :label="selectedDateLabel"
            @prev="changeMenuDate(-1)"
            @next="changeMenuDate(1)"
          />
        </section>

        <OrganismsMenuPromoList
          v-if="
            !props.staffMode &&
            props.useDailyMenu &&
            promoCardsWithAppliedState.length
          "
          :promo-cards="promoCardsWithAppliedState"
          :money="money"
        />

        <!-- ===== Chips de categoría: filtran a golpe de vista =====
             Cada chip abre su cajón y hace scroll hacia él. "Todo" expande o
             colapsa todo. El badge conserva el conteo del carrito aunque el
             cajón esté cerrado, para que el usuario nunca pierda su pedido. -->
        <OrganismsMenuCategoryChips
          :groups="visibleMenuGroups"
          :all-open="allGroupsOpen"
          :is-group-open="isGroupOpen"
          :group-cart-count="groupCartCount"
          @toggle-all="toggleAllGroups"
          @focus-group="focusGroup"
        />

        <section
          v-for="group in menuGroups"
          v-show="showGroupSection(group.key)"
          :key="group.key"
          :ref="(el) => setSectionRef(group.key, el)"
          class="js-reveal-section scroll-mt-20 rounded-2xl border border-border/70 bg-card/70 p-3 shadow-sm backdrop-blur"
        >
          <OrganismsMenuGroupSection
            :group="group"
            :is-open="isGroupOpen(group.key)"
            :items="groupItems(group.key)"
            :cart-count="groupCartCount(group.key)"
            :is-taquiza="!!(taquizaGroup && group.key === taquizaGroup.key)"
            :taquiza-kinds="taquizaKinds"
            :taquiza-cap="TAQUIZA_CAP"
            :taquiza-orders="taquizaOrders"
            :order-fill-total="orderFillTotal"
            :can-add-to-order="canAddToOrder"
            :set-order-fill="setOrderFill"
            :add-taquiza-order="addTaquizaOrder"
            :remove-taquiza-order="removeTaquizaOrder"
            :cart="cart"
            :is-out="isOut"
            :can-add-group-items="canAddItem(group.key)"
            :is-locked="isGroupLocked(group.key)"
            :lock-reason="lockReason(group.key)"
            :staff-mode="props.staffMode"
            :is-logged-in="isLoggedIn"
            :money="money"
            :set-qty="(name, delta) => setQty(group.key, name, delta)"
            :toggle-out="toggleOut"
            @toggle="toggleGroup(group.key)"
          />
        </section>

        <OrganismsMenuModeTabs v-model:mode="mode" />

        <OrganismsMenuOrderSummary
          v-if="orderSummaryLines.length"
          :lines="orderSummaryLines"
          :money="money"
          :total-qty="totalQty"
          :total="pricingSummary.total"
        />

        <OrganismsMenuCustomerForm
          v-model:member-code="memberCode"
          v-model:note="note"
          v-model:sel-hour="selHour"
          v-model:sel-min="selMin"
          v-model:sel-period="selPeriod"
          :customer="customer"
          :item-count="itemCount"
          :name-required="nameRequired"
          :needs-address="needsAddress"
          :show-member-code="props.showMemberCode"
          :staff-mode="props.staffMode"
          :mode="mode"
          :time-label="timeLabel"
          :hours12="hours12"
          :minutes="minutes"
          @clear-time="clearTime"
        />
      </main>

      <!-- Barra fija -->
      <OrganismsMenuCartBar
        :promo-status-banner="promoStatusBanner"
        :total-qty="totalQty"
        :item-count="itemCount"
        :mode-label="MODE_LABEL[mode]"
        :total="pricingSummary.total"
        :show-total="orderSummaryLines.length > 0"
        :money="money"
        :sending-order="sendingOrder"
        :can-try-send="canTrySend"
        :hint="hint"
        @clear-cart="clearCart"
        @send-order="sendOrder"
      />
    </template>

    <!-- Confirmación de pedido -->
    <OrganismsMenuThankYouDialog
      v-model:open="showThankYou"
      :thank-you-name="thankYouName"
      :logo-src="LOGO_SRC"
    />
  </div>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import {
  comboForItem,
  emptyDayDishes,
  findMenuItemByName,
  groups as baseGroups,
  groupsFromData,
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
import { useTaquizaOrders } from "~/composables/useTaquizaOrders";
import { useMenuScrollReveal } from "~/composables/useMenuScrollReveal";
import { useMenuPricing } from "~/composables/useMenuPricing";
import { useMenuCheckout } from "~/composables/useMenuCheckout";
import usePocketBase from "@common/composables/usePocketbase";

definePageMeta({ layout: "breezy" });

const props = withDefaults(
  defineProps<{
    fetchedCollection?: string;
    dishesField?: "dishes" | "store";
    useDailyMenu?: boolean;
    staffMode?: boolean;
    showMemberCode?: boolean;
  }>(),
  {
    fetchedCollection: "menu",
    dishesField: "dishes",
    useDailyMenu: true,
    staffMode: false,
    showMemberCode: true,
  },
);

const { formatCustomerOrder } = useMenuLink();
const { waLink, isAppleDevice, formatSoldOut } = useWhatsappOrder();
const { createItem, fetchCollection, updateItem } = usePocketBaseCore();
const { getMemberByCode } = useMembers();
const pb = usePocketBase();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const businessConfig = (runtimeConfig.public?.business ?? {}) as {
  whatsappNumber?: string;
  logoUrl?: string;
};

const EMPTY_DISHES: DayDishes = emptyDayDishes();
const RESTAURANT_WHATSAPP = String(
  businessConfig.whatsappNumber || runtimeConfig.public.whatsappNumber || "",
);
// Mismo logo que el header (layouts/breezy.vue), para la marca en el modal.
const LOGO_SRC = businessConfig.logoUrl || "";
// Misma colección/campo que usa el tablero de cocina (useComandas.ts): un
// registro por orden en `data`, existe mientras esté activa.
const COMANDAS_COLLECTION = "comandas";
const COMANDAS_FIELD = "data";

// Registro `menu` con los campos de rotación.
type MenuRecordFull = MenuRecord & {
  store?: MenuCatalog | DayDishes;
  week_blocks?: WeekBlock[];
  rotation?: string[];
  rotation_anchor?: string;
  overrides?: Record<string, WeekOverride>;
  active_date?: string;
  [key: string]: unknown;
};

const { record, pending, loadError, load } =
  useLatestMenuRecord<MenuRecordFull>(props.fetchedCollection);

onMounted(load);

const selectedDate = ref(todayISO());

const selectedDateLabel = computed(() =>
  new Date(`${selectedDate.value}T12:00:00`).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }),
);

function changeMenuDate(days: number) {
  const date = new Date(`${selectedDate.value}T12:00:00`);
  date.setDate(date.getDate() + days);
  selectedDate.value = date.toISOString().slice(0, 10);
  clearCart();
}

/**
 * Menú del día: mismo criterio que la app de comandas.
 *  1) Si hay un `active` fijado HOY (turno iniciado o ajuste manual), ese manda.
 *  2) Si no, se resuelve la fecha de hoy contra la rotación semanal (bloques).
 */
const active = computed<DayDishes>(() => {
  const rec = record.value;
  if (!rec) return EMPTY_DISHES;

  const selectedDishes = rec[props.dishesField];
  if (props.staffMode) {
    return normalizeDishNames(rec.active as Partial<Record<GroupKey, unknown>>);
  }
  if (!props.useDailyMenu || props.dishesField !== "dishes") {
    return normalizeDishNames(
      selectedDishes as Partial<Record<GroupKey, unknown>>,
    );
  }

  const a = normalizeDishNames(
    rec.active as Partial<Record<GroupKey, unknown>>,
  );
  const activeFresh =
    rec.active_date === selectedDate.value &&
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
  const resolved = resolveDay(selectedDate.value, cfg);
  return resolved
    ? normalizeDishNames(resolved.menu as Partial<Record<GroupKey, unknown>>)
    : EMPTY_DISHES;
});

const menuSourceCatalog = computed<Partial<Record<GroupKey, unknown>>>(
  () =>
    (record.value?.[props.dishesField] ?? {}) as Partial<
      Record<GroupKey, unknown>
    >,
);

const menuGroups = computed(() => {
  const fromMenu = groupsFromData({
    ...(menuSourceCatalog.value as Record<string, unknown>),
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
  normalizeMenuCatalog(menuSourceCatalog.value),
);

type ActiveMenuItem = MenuItem & { group: GroupKey };

const activeItems = computed<Record<GroupKey, ActiveMenuItem[]>>(() => {
  const out = {} as Record<GroupKey, ActiveMenuItem[]>;

  menuGroups.value.forEach((g) => {
    const names = active.value[g.key] ?? [];

    out[g.key] = names.map((name) => {
      const found = findMenuItemByName(catalog.value, name, g.key);
      if (found?.item) {
        return { ...found.item, group: g.key };
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

/* ===== Chips + cajones (acordeón) =====
 * `openGroups` = conjunto de grupos abiertos. Los chips y el encabezado de cada
 * sección comparten este estado, así que un chip "activo" siempre corresponde a
 * un cajón abierto. Al arrancar abrimos solo el primer grupo con platillos para
 * no abrumar con toda la lista desplegada. */
const openGroups = ref<Set<string>>(new Set());

// Grupos que realmente tienen platillos hoy (los que muestran chip).
const visibleMenuGroups = computed(() =>
  menuGroups.value.filter((g) => groupItems(g.key).length > 0),
);

const isGroupOpen = (key: GroupKey) => openGroups.value.has(key);

function toggleGroup(key: GroupKey) {
  const next = new Set(openGroups.value);
  next.has(key) ? next.delete(key) : next.add(key);
  openGroups.value = next;
}

const allGroupsOpen = computed(
  () =>
    visibleMenuGroups.value.length > 0 &&
    visibleMenuGroups.value.every((g) => openGroups.value.has(g.key)),
);

function toggleAllGroups() {
  openGroups.value = allGroupsOpen.value
    ? new Set()
    : new Set(visibleMenuGroups.value.map((g) => g.key));
}

// Conteo del carrito por grupo (badge del chip y del encabezado). Conserva la
// referencia del pedido aunque el cajón esté cerrado.
function groupCartCount(key: GroupKey) {
  return groupItems(key).reduce((sum, item) => sum + (cart[item.name] ?? 0), 0);
}

// Refs de cada <section> para poder hacer scroll hacia ellas desde el chip.
const sectionEls: Record<string, HTMLElement> = {};
function setSectionRef(key: string, el: unknown) {
  if (el instanceof HTMLElement) sectionEls[key] = el;
}

function getHeaderStackOffsetPx(): number {
  if (typeof window === "undefined") return 0;

  let offset = 0;
  const stackEls = document.querySelectorAll<HTMLElement>("[data-top-stack]");

  stackEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    // Count only visible top-stack elements currently attached near the top.
    if (rect.height <= 0) return;
    if (rect.bottom <= 0) return;
    if (rect.top >= 220) return;
    offset = Math.max(offset, rect.bottom);
  });

  return Math.ceil(offset);
}

function scrollGroupIntoView(key: GroupKey, behavior: ScrollBehavior) {
  if (typeof window === "undefined") return;
  const section = sectionEls[key];
  if (!section) return;

  const offset = getHeaderStackOffsetPx() + 20;
  const targetY = Math.max(
    0,
    window.scrollY + section.getBoundingClientRect().top - offset,
  );

  window.scrollTo({ top: targetY, behavior });
}

// Chip: abre el cajón (si estaba cerrado) y hace scroll suave hacia él.
async function focusGroup(key: GroupKey) {
  if (!openGroups.value.has(key)) {
    const next = new Set(openGroups.value);
    next.add(key);
    openGroups.value = next;
  }

  await nextTick();
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

  scrollGroupIntoView(key, "smooth");

  // Correct once more after layout settles to avoid the "second click" effect.
  window.setTimeout(() => {
    scrollGroupIntoView(key, "smooth");
  }, 140);
}

// Abre el primer grupo con platillos la primera vez que carga el menú.
const didInitOpen = ref(false);
watch(
  visibleMenuGroups,
  (groups) => {
    if (!didInitOpen.value && groups.length) {
      openGroups.value = new Set(
        props.dishesField === "dishes"
          ? groups.map((group) => group.key)
          : [groups[0].key],
      );
      didInitOpen.value = true;
    }
  },
  { immediate: true },
);

const soldOut = computed<string[]>(() => record.value?.sold_out ?? []);
const isOut = (n: string) => soldOut.value.includes(n);
const isLoggedIn = ref(false);
const menuMainEl = ref<HTMLElement | null>(null);

const { scheduleRevealRefresh } = useMenuScrollReveal(menuMainEl);

async function toggleOut(name: string) {
  if (!props.staffMode || !record.value) return;

  const wa =
    typeof window !== "undefined" && !isAppleDevice()
      ? window.open("", "_blank")
      : null;

  const next = new Set(soldOut.value);
  const nowAvailable = next.has(name);
  if (nowAvailable) next.delete(name);
  else {
    next.add(name);
    cart[name] = 0;
  }

  try {
    await updateItem(props.fetchedCollection, record.value.id, {
      sold_out: [...next],
    });
    record.value.sold_out = [...next];
  } catch {
    wa?.close();
    return;
  }

  const text = formatSoldOut(name, nowAvailable);
  const url = waLink(text);

  if (typeof window !== "undefined") {
    if (isAppleDevice()) {
      window.location.href = url;
    } else if (wa) {
      wa.location.href = url;
    } else {
      window.open(url, "_blank", "noopener");
    }
  }
}

const cart = reactive<Record<string, number>>({});
const mode = ref<OrderMode>("llevar");
const note = ref("");
const customer = reactive({ name: "", phone: "", address: "" });

// Código de socio (opcional, texto plano). No se valida aquí: se estampa en el
// mensaje de WhatsApp para que el staff lo vea y redima al servir.
const memberCode = ref("");
const memberLoading = ref(false);

async function loadMemberFromCode(code: string) {
  const normalized = code.replace(/\s+/g, "").toUpperCase();
  if (!normalized) return;
  memberLoading.value = true;
  try {
    const member = await getMemberByCode(normalized);
    if (member) {
      customer.name = member.name ?? "";
      customer.phone = member.phone ?? "";
      customer.address = member.address ?? "";
    }
  } finally {
    memberLoading.value = false;
  }
}

watch(memberCode, (code) => {
  if (props.staffMode) loadMemberFromCode(code);
});

onMounted(() => {
  isLoggedIn.value = pb.authStore.isValid;
  void loadRuntimePromos();
  if (props.staffMode) {
    const code = route.query.code;
    if (typeof code === "string" && code.trim()) {
      memberCode.value = code.replace(/\s+/g, "").toUpperCase();
    }
  }

  scheduleRevealRefresh();
});

watch(
  () => [
    selectedDate.value,
    visibleMenuGroups.value.length,
    openGroups.value.size,
  ],
  async () => {
    await nextTick();
    scheduleRevealRefresh();
  },
  { flush: "post" },
);

/* ===== Taquizas: modelo por orden =====
 * Cada orden es una unidad independiente (tacos = 3 piezas, quesadillas = 2).
 * El cliente crea tantas órdenes como quiera; dentro de cada una elige sus
 * guisos hasta el tope de esa orden. El `cart` sigue el invariante que espera
 * la cocina: cart[nombre] = porción normal + suma de esa pieza en todas las
 * órdenes de taquiza (por eso siempre usamos deltas, nunca reasignación).
 * Ver composables/useTaquizaOrders.ts para el detalle de esta lógica.
 */
const {
  taquizaKinds,
  taquizaRules,
  TAQUIZA_CAP,
  taquizaOrders,
  orderFillTotal,
  canAddToOrder,
  applyTaquizaDelta,
  addTaquizaOrder,
  removeTaquizaOrder,
  setOrderFill,
  taquizaByKind,
  taquizaOrderCount,
  taquizaSelectedByKind,
  hasTaquizaOrder,
  taquizaTotalForName,
  clearTaquizaOrders,
} = useTaquizaOrders(cart, taquizaGroup?.pieceOptions);

watch(
  () => taquizaOrders.value.length,
  async () => {
    await nextTick();
    scheduleRevealRefresh();
  },
  { flush: "post" },
);

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

const itemCount = computed(() => cartItems.value.length);

// Pricing, promo progress cards, and runtime-promo loading for this order.
// See composables/useMenuPricing.ts.
const {
  money,
  loadRuntimePromos,
  pricingSummary,
  orderSummaryLines,
  promoCardsWithAppliedState,
  promoStatusBanner,
} = useMenuPricing({
  fetchCollection,
  cart,
  menuGroups,
  groupItems,
  isOut,
  taquizaGroup,
  taquizaOrderCount,
  taquizaTotalForName,
  itemCount,
  staffMode: () => props.staffMode,
  useDailyMenu: () => props.useDailyMenu,
});

const totalQty = computed(() =>
  cartItems.value.reduce((sum, it) => sum + it.qty, 0),
);

const needsAddress = computed(
  () => mode.value === "domicilio" && !customer.address.trim(),
);

// El nombre es opcional para llevar/aquí; a domicilio siempre se requiere
// para identificar al cliente que recibe.
const nameRequired = computed(() => mode.value === "domicilio");

const needsName = computed(() => nameRequired.value && !customer.name.trim());

const canSend = computed(
  () => itemCount.value > 0 && !needsName.value && !needsAddress.value,
);

const canTrySend = canSend;

const hint = computed(() =>
  needsName.value
    ? "Please enter your name to proceed / Ingresa tu nombre para continuar."
    : needsAddress.value
      ? "Address is required for delivery / Se requiere dirección para el envío."
      : "",
);

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

// Order-send workflow (build note, create comanda, open WhatsApp, reset
// form). See composables/useMenuCheckout.ts.
const {
  sendingOrder,
  showThankYou,
  thankYouName,
  clearCart,
  resetOrderForm,
  sendOrder,
} = useMenuCheckout({
  cart,
  mode,
  note,
  customer,
  memberCode,
  clearTime,
  clearTaquizaOrders,
  hasTaquizaOrder,
  taquizaRules,
  taquizaOrderCount,
  taquizaSelectedByKind,
  taquizaByKind,
  pickupTime,
  selectedDate,
  active,
  record,
  canSend,
  fetchCollection,
  createItem,
  formatCustomerOrder,
  waLink,
  isAppleDevice,
  restaurantWhatsapp: RESTAURANT_WHATSAPP,
  comandasCollection: COMANDAS_COLLECTION,
  comandasField: COMANDAS_FIELD,
});
</script>
