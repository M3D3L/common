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

    <!-- Loading -->
    <OrganismsMenuLoadingState v-if="pending" />

    <!-- Error / no menu published -->
    <OrganismsMenuUnavailableState
      v-else-if="!record"
      :load-error="!!loadError"
      @retry="load"
    />

    <!-- No service today (weekend / closed week / no menu for today) -->
    <div
      v-else-if="!hasMenu"
      class="grid place-items-center p-6 text-center fixed top-0 left-0 w-full h-full"
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
            :previous-disabled="isPreviousDateDisabled"
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
        <!-- Instructions -->
        <OrganismsMenuInstructions
          v-if="!props.staffMode"
          :whatsapp-number="RESTAURANT_WHATSAPP"
        />

        <section
          v-if="props.useDailyMenu"
          class="js-reveal-item sticky top-2 z-20 flex items-center justify-between rounded-2xl border border-primary/20 bg-background/90 px-3 py-2 shadow-sm backdrop-blur"
          aria-label="Seleccionar día del menú"
        >
          <OrganismsMenuDayPicker
            :label="selectedDateLabel"
            :previous-disabled="isPreviousDateDisabled"
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
          :active-promo-id="activePromoId"
          @select-promo="selectPromo"
        />

        <div v-if="activePromo" ref="promoBuilderEl" class="scroll-mt-40">
          <OrganismsMenuPromoBuilder
            :promo="activePromo"
            :cart="cart"
            :menu-groups="menuGroups"
            :group-items="groupItems"
            :is-out="isOut"
            :can-add-group-items="canAddItem"
            :money="money"
            :set-qty="setQty"
            @close="activePromoId = null"
          />
        </div>

        <template v-else>
          <!-- ===== Category chips: filter at a glance =====
               Each chip opens its section and scrolls to it. "All" expands or
               collapses everything. The badge keeps the cart count even while
               the section is closed, so the user never loses track of their order. -->
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
        </template>

        <OrganismsMenuOrderSummary
          v-if="orderSummaryLines.length"
          :lines="orderSummaryLines"
          :money="money"
          :total-qty="totalQty"
          :total="pricingSummary.total"
        />

        <OrganismsMenuModeTabs v-model:mode="mode" />

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

      <!-- Fixed bar -->
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

    <!-- Order confirmation -->
    <OrganismsMenuThankYouDialog
      v-model:open="showThankYou"
      :thank-you-name="thankYouName"
      :logo-src="LOGO_SRC"
    />
  </div>
</template>

<script lang="ts" setup>
import { Card } from "@common/components/ui/card";
import { todayISO, type GroupKey } from "~/utils/comandas";
import { MODE_LABEL, type OrderMode } from "~/composables/useWhatsappOrder";
import { useTaquizaOrders } from "~/composables/useTaquizaOrders";
import { useMenuScrollReveal } from "~/composables/useMenuScrollReveal";
import { useMenuPricing } from "~/composables/useMenuPricing";
import { useMenuCheckout } from "~/composables/useMenuCheckout";
import { useMenuData, type MenuRecordFull } from "~/composables/useMenuData";
import { useMenuGroupAccordion } from "~/composables/useMenuGroupAccordion";
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

const { formatCustomerOrder, formatCombinedCustomerOrder } = useMenuLink();
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

const RESTAURANT_WHATSAPP = String(
  businessConfig.whatsappNumber || runtimeConfig.public.whatsappNumber || "",
);
// Same logo as the header (layouts/breezy.vue), for branding in the modal.
const LOGO_SRC = businessConfig.logoUrl || "";
// Same collection/field used by the kitchen board (useComandas.ts): one
// record per order in `data`, exists while it's active.
const COMANDAS_COLLECTION = "comandas";
const COMANDAS_FIELD = "data";

// The `menu` record with the rotation fields.
const { record, pending, loadError, load } =
  useLatestMenuRecord<MenuRecordFull>(props.fetchedCollection);

onMounted(load);

const cart = reactive<Record<string, number>>({});

const selectedDate = ref(todayISO());
const isPreviousDateDisabled = computed(() => selectedDate.value <= todayISO());

const selectedDateLabel = computed(() =>
  new Date(`${selectedDate.value}T12:00:00`).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }),
);

function changeMenuDate(days: number) {
  if (days < 0 && isPreviousDateDisabled.value) return;

  const date = new Date(`${selectedDate.value}T12:00:00`);
  date.setDate(date.getDate() + days);
  selectedDate.value = date.toISOString().slice(0, 10);
  activePromoId.value = null;
  clearCart();
}

// Menu record + rotation resolution. See composables/useMenuData.ts.
const {
  active,
  menuGroups,
  hasMenu,
  groupItems,
  taquizaGroup,
  showGroupSection,
} = useMenuData({
  record,
  selectedDate,
  dishesField: () => props.dishesField,
  staffMode: () => props.staffMode,
  useDailyMenu: () => props.useDailyMenu,
});

// Accordion/chip navigation. See composables/useMenuGroupAccordion.ts.
const {
  openGroups,
  visibleMenuGroups,
  isGroupOpen,
  toggleGroup,
  allGroupsOpen,
  toggleAllGroups,
  groupCartCount,
  setSectionRef,
  focusGroup,
} = useMenuGroupAccordion({
  menuGroups,
  groupItems,
  cart,
  dishesField: () => props.dishesField,
});

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

const mode = ref<OrderMode>("llevar");
const note = ref("");
const customer = reactive({ name: "", phone: "", address: "" });

// Member code (optional, plain text). Not validated here: it's stamped in
// the WhatsApp message so staff can see it and redeem it when serving.
const memberCode = ref("");

async function loadMemberFromCode(code: string) {
  const normalized = code.replace(/\s+/g, "").toUpperCase();
  if (!normalized) return;
  const member = await getMemberByCode(normalized);
  if (member) {
    customer.name = member.name ?? "";
    customer.phone = member.phone ?? "";
    customer.address = member.address ?? "";
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

/* ===== Taquizas: per-order model =====
 * Each order is an independent unit (tacos = 3 pieces, quesadillas = 2).
 * The customer creates as many orders as they want; within each one they pick
 * their fillings up to that order's cap. The `cart` follows the invariant
 * the kitchen expects: cart[name] = regular portion + sum of that item across
 * all taquiza orders (that's why we always use deltas, never reassignment).
 * See composables/useTaquizaOrders.ts for the details of this logic.
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

/* ===== Time (for "dine-in" and "takeout"; optional, no default) ===== */
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
const activePromoId = ref<string | null>(null);

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
  activePromoId: () => activePromoId.value,
});

const activePromo = computed(() =>
  promoCardsWithAppliedState.value.find(
    (promo) => promo.id === activePromoId.value,
  ),
);
const promoBuilderEl = ref<HTMLElement | null>(null);

async function selectPromo(promoId: string) {
  activePromoId.value = promoId;
  await nextTick();
  promoBuilderEl.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const totalQty = computed(() =>
  cartItems.value.reduce((sum, it) => sum + it.qty, 0),
);

const needsAddress = computed(
  () => mode.value === "domicilio" && !customer.address.trim(),
);

// Name is optional for takeout/dine-in; delivery always requires it
// to identify the customer receiving the order.
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
  // Taquizas aren't added from the normal block, only per order.
  if (taquizaGroup && k === taquizaGroup.key) return false;
  return true;
}

function setQty(k: GroupKey, n: string, d: number) {
  // The taquiza group is handled per order (setOrderFill), never here.
  if (taquizaGroup && k === taquizaGroup.key) return;
  if (d > 0 && !canAddItem(k)) return;
  applyTaquizaDelta(n, d); // relative add/subtract: preserves the taquiza portion
}

// Order-send workflow (build note, create comanda, open WhatsApp, reset
// form). See composables/useMenuCheckout.ts.
const { sendingOrder, showThankYou, thankYouName, clearCart, sendOrder } =
  useMenuCheckout({
    cart,
    mode,
    note,
    customer,
    memberCode,
    resetCustomerAfterSend: () => props.staffMode,
    clearTime,
    clearTaquizaOrders,
    hasTaquizaOrder,
    taquizaRules,
    taquizaOrderCount,
    taquizaSelectedByKind,
    taquizaByKind,
    taquizaOrders,
    pricingLines: orderSummaryLines,
    pickupTime,
    selectedDate,
    active,
    record,
    canSend,
    fetchCollection,
    createItem,
    formatCustomerOrder,
    formatCombinedCustomerOrder,
    waLink,
    isAppleDevice,
    restaurantWhatsapp: RESTAURANT_WHATSAPP,
    comandasCollection: COMANDAS_COLLECTION,
    comandasField: COMANDAS_FIELD,
  });
</script>
