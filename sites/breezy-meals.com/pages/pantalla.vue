<template>
  <div ref="displayShellElement" class="display-shell">
    <Head>
      <Title>Pantalla de menú | {{ brandName }}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <Link
        href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Roboto:wght@400;500;700;900&display=swap"
        rel="stylesheet"
      />
    </Head>

    <main v-if="pending && !record" class="display-state">
      <LoaderCircle class="h-12 w-12 animate-spin" />
      <p>Cargando el menú de hoy…</p>
    </main>
    <main v-else-if="loadError || !record" class="display-state">
      <WifiOff class="h-12 w-12" />
      <h2>El menú volverá en un momento</h2>
      <p>No pudimos actualizar la pantalla. Reintentaremos automáticamente.</p>
      <Button type="button" @click="loadDisplayData()">Reintentar</Button>
    </main>
    <main
      v-else
      class="display-content"
      :class="{ 'catering-visible': cateringVisible, 'is-reflowing': cateringTransitioning }"
    >
      <section class="menu-board" aria-label="Menú del día">
        <header class="section-heading">
          <div class="title-brand">
            <img :src="logoSrc" :alt="brandName" />
            <div>
              <p class="display-eyebrow">San Carlos, Sonora</p>
              <h1>{{ brandName }}</h1>
            </div>
          </div>
          <h2>Menú del día</h2>
          <div class="board-time">
            <p>{{ clock }}</p>
            <span>{{ dateLabel }}</span>
            <span v-if="datePreview.date" class="preview-date">
              Vista previa · {{ datePreview.date }}
            </span>
            <span v-else-if="datePreview.error" class="preview-error" role="alert">
              {{ datePreview.error }}
            </span>
          </div>
        </header>

        <div
          ref="menuViewportElement"
          class="menu-viewport"
          :tabindex="menuOverflow ? 0 : undefined"
          aria-label="Platillos del menú"
        >
          <div
            v-if="menuSections.length"
            ref="menuTrackElement"
            class="menu-track"
            :class="{ 'is-scrolling': menuOverflow }"
            :style="menuScrollStyle"
          >
            <div
              v-for="copy in menuOverflow ? 2 : 1"
              :key="copy"
              class="menu-columns"
              :aria-hidden="copy === 2"
            >
              <section
                v-for="section in menuSections"
                :key="section.key"
                class="menu-section"
              >
                <h3><span aria-hidden="true">{{ section.emoji }}</span> {{ section.label }}</h3>
                <ul>
                  <li
                    v-for="item in section.items"
                    :key="item.name"
                    :class="{ 'sold-out-item': isOut(item.name) }"
                  >
                    <span class="item-name">
                      {{ item.name }}
                      <span v-if="isOut(item.name)" class="sold-out-badge">Agotado</span>
                    </span>
                    <span class="item-rule" aria-hidden="true" />
                    <span v-if="item.price > 0" class="item-price">{{ money(item.price) }}</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>
          <div v-else class="empty-copy">Estamos preparando el menú de hoy.</div>
        </div>
      </section>

      <aside class="promo-rail" aria-label="Promociones">
        <h2 class="promo-heading">Promociones</h2>
        <div
          ref="promoViewportElement"
          class="promo-viewport"
          :tabindex="promoOverflow ? 0 : undefined"
          aria-label="Promociones"
        >
          <div
            v-if="promoCards.length"
            ref="promoTrackElement"
            class="promo-track"
            :class="{ 'is-scrolling': promoOverflow }"
            :style="promoScrollStyle"
          >
            <div
              v-for="copy in promoOverflow ? 2 : 1"
              :key="copy"
              class="promo-group"
              :aria-hidden="copy === 2"
            >
              <article v-for="promo in promoCards" :key="promo.id" class="promo-card">
                <div class="promo-card-heading">
                  <h2><span aria-hidden="true">{{ promo.emoji || "★" }}</span> {{ promo.label }}</h2>
                  <p v-if="promo.price > 0" class="promo-price">{{ money(promo.price) }}</p>
                </div>
                <p class="promo-summary">
                  {{ promo.summary || "Promoción disponible por tiempo limitado." }}
                </p>
              </article>
            </div>
          </div>
          <div v-else class="rail-empty">
            <img :src="logoSrc" :alt="brandName" />
            <h2>¡Buen provecho!</h2>
            <p>Escanea el código QR para ordenar desde tu teléfono.</p>
          </div>
        </div>
      </aside>

      <aside
        v-if="cateringItems.length"
        class="catering-rail"
        :aria-hidden="!cateringVisible"
        aria-label="Catering por encargo"
      >
        <div class="catering-panel">
          <header class="catering-heading">
            <p class="catering-eyebrow">Para compartir</p>
            <h2>Catering</h2>
            <p>Haz especial tu próxima reunión</p>
          </header>
          <div
            ref="cateringViewportElement"
            class="catering-collection"
            :tabindex="cateringOverflow ? 0 : undefined"
            aria-label="Opciones de catering"
          >
            <div
              :key="cateringRunKey"
              ref="cateringTrackElement"
              class="catering-track"
              :class="{ 'is-scrolling': cateringOverflow }"
              :style="cateringScrollStyle"
              @animationend="onCateringLoopComplete"
            >
              <div class="catering-group">
                <article v-for="item in cateringItems" :key="item.name" class="catering-card">
                  <img
                    :src="item.image || logoSrc"
                    :alt="item.image ? item.name : brandName"
                    class="catering-photo"
                    :class="{ 'is-logo': !item.image }"
                  />
                  <div class="catering-card-copy">
                    <h3>{{ item.name }}</h3>
                    <p v-if="item.price > 0">{{ money(item.price) }}</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
          <footer class="catering-note">
            <span>Por encargo</span>
          </footer>
        </div>
      </aside>
    </main>

    <footer class="display-footer">
      <div class="footer-order">
        <MessageCircle class="h-6 w-6 shrink-0" />
        <div>
          <p>Ordena desde tu teléfono</p>
          <p class="order-url">{{ orderUrl }}</p>
        </div>
      </div>
      <div
        v-if="tickerItems.length"
        class="ticker"
        role="status"
        :aria-label="tickerItems.join('. ')"
      >
        <Megaphone class="ticker-icon" aria-hidden="true" />
        <div class="ticker-viewport">
          <div class="ticker-track" :style="tickerStyle">
            <div
              v-for="copy in 2"
              :key="copy"
              class="ticker-group"
              :aria-hidden="copy === 2"
            >
              <span
                v-for="(item, index) in tickerItems"
                :key="`${copy}-${index}-${item}`"
                class="ticker-item"
              >{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-qr">
        <p>Escanea para ver<br />el menú completo</p>
        <img :src="qrUrl" alt="Código QR para ordenar" />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { LoaderCircle, Megaphone, MessageCircle, WifiOff } from "lucide-vue-next";
import { Button } from "@common/components/ui/button";
import { todayISO } from "~/utils/comandas";
import { parseDisplayDateQuery } from "~/utils/displayDate";
import { useMenuData, type MenuRecordFull } from "~/composables/useMenuData";
import { useMenuPricing } from "~/composables/useMenuPricing";

definePageMeta({ layout: false });

const MENU_SCROLL_SPEED = 32;
const PROMO_SCROLL_SPEED = 24;
const CATERING_HIDDEN_DURATION = 30_000;
const CATERING_SCROLL_SPEED = 96;
const CATERING_STILL_DURATION = 10_000;
const CATERING_TRANSITION_DURATION = 900;
const REFRESH_DURATION = 60_000;
const runtimeConfig = useRuntimeConfig();
const business = (runtimeConfig.public?.business ?? {}) as {
  brandName?: string;
  logoUrl?: string;
  menuUrl?: string;
};
const brandName = business.brandName || "Breezy Meals";
const logoSrc = business.logoUrl || "";
const orderUrl = business.menuUrl || "https://breezy-meals.com/menu";
const qrUrl = computed(
  () => `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(orderUrl)}`,
);
const { fetchCollection } = usePocketBaseCore();
const { record, pending, loadError, load } = useLatestMenuRecord<MenuRecordFull>("menu");
const route = useRoute();
const currentDate = ref(todayISO());
const datePreview = computed(() => parseDisplayDateQuery(route.query.date));
const selectedDate = computed(() => datePreview.value.date ?? currentDate.value);
const menuData = useMenuData({
  record,
  selectedDate,
  dishesField: () => "dishes",
  useDailyMenu: () => true,
});
const cateringData = useMenuData({
  record,
  selectedDate,
  dishesField: () => "catering",
  useDailyMenu: () => false,
});
const soldOut = computed(() => new Set(record.value?.sold_out ?? []));
const isOut = (name: string) => soldOut.value.has(name);
const cateringItems = computed(() =>
  cateringData.menuGroups.value
    .flatMap((group) => cateringData.groupItems(group.key))
    .filter((item) => !isOut(item.name)),
);
const cateringVisible = ref(false);
const cateringTransitioning = ref(false);
const cateringOverflow = ref(false);
const cateringCardHeight = ref(210);
const cateringCycleHeight = ref(0);
const cateringViewportHeight = ref(0);
const cateringPassDuration = computed(() =>
  Math.max(0, cateringCycleHeight.value - cateringViewportHeight.value) / CATERING_SCROLL_SPEED * 1000,
);
const cateringRunKey = ref(0);
const reducedMotion = ref(false);
const cateringScrollStyle = computed(() => ({
  "--catering-card-height": `${cateringCardHeight.value}px`,
  "--catering-duration": `${cateringPassDuration.value / 1000}s`,
  "--catering-viewport-height": `${cateringViewportHeight.value}px`,
}));
const emptyCart = reactive<Record<string, number>>({});
const emptyTaquizaCounts = computed(() => ({ tacos: 0, quesadillas: 0 }));
const { loadRuntimePromos, promoCardsWithAppliedState: promoCards } = useMenuPricing({
  fetchCollection,
  cart: emptyCart,
  menuGroups: menuData.menuGroups,
  groupItems: menuData.groupItems,
  isOut,
  taquizaGroup: menuData.taquizaGroup,
  taquizaOrderCount: emptyTaquizaCounts,
  completedTaquizaOrderCount: emptyTaquizaCounts,
  taquizaTotalForName: () => 0,
  itemCount: computed(() => 0),
  staffMode: () => false,
  useDailyMenu: () => true,
  showPromoStatus: () => true,
});
const menuSections = computed(() =>
  menuData.menuGroups.value
    .map((group) => ({
      key: group.key,
      label: group.label,
      emoji: group.emoji,
      items: menuData.groupItems(group.key),
    }))
    .filter((section) => section.items.length > 0),
);
const tickerItems = computed(() =>
  String(record.value?.news ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
);
const tickerStyle = computed(() => ({
  "--ticker-duration": `${Math.max(24, tickerItems.value.join(" ").length * 0.32)}s`,
}));
const displayShellElement = ref<HTMLElement>();
const menuViewportElement = ref<HTMLElement>();
const menuTrackElement = ref<HTMLElement>();
const promoViewportElement = ref<HTMLElement>();
const promoTrackElement = ref<HTMLElement>();
const cateringViewportElement = ref<HTMLElement>();
const cateringTrackElement = ref<HTMLElement>();
const menuOverflow = ref(false);
const menuCycleWidth = ref(0);
const menuColumnCount = ref(2);
const menuScrollStyle = computed(() => ({
  "--menu-duration": `${menuCycleWidth.value / MENU_SCROLL_SPEED}s`,
  "--menu-cycle-width": `${menuCycleWidth.value}px`,
  "--menu-columns": String(menuColumnCount.value),
  "--menu-group-width": menuColumnCount.value === 1 ? "85%" : "100%",
}));
const promoOverflow = ref(false);
const promoCycleHeight = ref(0);
const promoScrollStyle = computed(() => ({
  "--promo-duration": `${promoCycleHeight.value / PROMO_SCROLL_SPEED}s`,
}));

let clockTimer: number | undefined;
let refreshTimer: number | undefined;
let cateringTimer: number | undefined;
let cateringTransitionTimer: number | undefined;
let layoutFrame: number | undefined;
let resizeObserver: ResizeObserver | undefined;
let motionPreference: MediaQueryList | undefined;
let disposed = false;

function setCateringVisible(visible: boolean) {
  const nextVisible = visible && cateringItems.value.length > 0;
  if (cateringVisible.value === nextVisible) return;
  cateringTransitioning.value = true;
  cateringVisible.value = nextVisible;
  if (cateringTimer) clearTimeout(cateringTimer);
  cateringTimer = undefined;
  if (nextVisible) cateringRunKey.value += 1;
  if (cateringTransitionTimer) clearTimeout(cateringTransitionTimer);
  cateringTransitionTimer = window.setTimeout(() => {
    cateringTransitionTimer = undefined;
    cateringTransitioning.value = false;
    if (!cateringVisible.value) scheduleCateringCycle();
    scheduleDisplayLayout();
  }, CATERING_TRANSITION_DURATION);
}

function scheduleCateringCycle() {
  if (cateringTimer) clearTimeout(cateringTimer);
  cateringTimer = undefined;
  if (disposed || cateringVisible.value || !cateringItems.value.length) return;
  cateringTimer = window.setTimeout(() => {
    cateringTimer = undefined;
    setCateringVisible(true);
  }, CATERING_HIDDEN_DURATION);
}

function onCateringLoopComplete(event: AnimationEvent) {
  if (event.target !== event.currentTarget || !cateringVisible.value) return;
  setCateringVisible(false);
}

function syncCateringPlayback() {
  if (!cateringVisible.value || cateringTransitioning.value) return;
  if (cateringOverflow.value && !reducedMotion.value) {
    if (cateringTimer) clearTimeout(cateringTimer);
    cateringTimer = undefined;
    return;
  }
  if (cateringTimer) return;
  const readingDuration = cateringOverflow.value
    ? Math.max(CATERING_STILL_DURATION, cateringPassDuration.value)
    : CATERING_STILL_DURATION;
  cateringTimer = window.setTimeout(() => {
    cateringTimer = undefined;
    setCateringVisible(false);
  }, readingDuration);
}

function updateMotionPreference(event: MediaQueryListEvent) {
  reducedMotion.value = event.matches;
  if (cateringVisible.value && cateringTimer) {
    clearTimeout(cateringTimer);
    cateringTimer = undefined;
  }
  scheduleDisplayLayout();
}

function measureCateringMarquee() {
  const viewport = cateringViewportElement.value;
  const group = cateringTrackElement.value?.firstElementChild;
  if (!viewport || !group || !viewport.clientHeight) {
    cateringOverflow.value = false;
    cateringCycleHeight.value = 0;
    cateringViewportHeight.value = 0;
    return;
  }
  cateringViewportHeight.value = viewport.getBoundingClientRect().height;
  const gap = Number.parseFloat(getComputedStyle(group).rowGap);
  const visibleCards = Math.max(
    1,
    Math.min(3, cateringItems.value.length, Math.floor(viewport.clientHeight / 210)),
  );
  const cardHeight = visibleCards === 1 && cateringItems.value.length > 1
    ? viewport.clientHeight * 0.82
    : (viewport.clientHeight - gap * (visibleCards - 1)) / visibleCards;
  if (Math.abs(cateringCardHeight.value - cardHeight) > 0.5) {
    cateringCardHeight.value = cardHeight;
    scheduleDisplayLayout();
    return;
  }
  cateringCycleHeight.value = group.getBoundingClientRect().height;
  cateringOverflow.value = cateringCycleHeight.value > viewport.clientHeight + 1;
}

function measureMenuMarquee() {
  const columns = menuTrackElement.value?.firstElementChild;
  if (!columns || !columns.clientWidth || !columns.clientHeight) {
    menuOverflow.value = false;
    menuCycleWidth.value = 0;
    return;
  }
  const nextColumnCount = (menuViewportElement.value?.clientWidth ?? 0) >= 680 ? 2 : 1;
  if (menuColumnCount.value !== nextColumnCount) {
    menuColumnCount.value = nextColumnCount;
    scheduleDisplayLayout();
    return;
  }
  // CSS flows whole rows into equal-height columns, including off-screen pages.
  const style = getComputedStyle(columns);
  const gap = Number.parseFloat(style.columnGap);
  const visibleColumns = Number.parseInt(style.columnCount, 10);
  const width = columns.getBoundingClientRect().width;
  const columnStride = (width + gap) / visibleColumns;
  const totalColumns = Math.max(
    visibleColumns,
    Math.ceil((columns.scrollWidth + gap - 1) / columnStride),
  );
  menuCycleWidth.value = totalColumns * columnStride;
  menuOverflow.value = columns.scrollWidth > width + 1;
}

function measurePromoMarquee() {
  const viewport = promoViewportElement.value;
  const group = promoTrackElement.value?.firstElementChild;
  if (!viewport || !group) {
    promoOverflow.value = false;
    promoCycleHeight.value = 0;
    return;
  }
  const style = getComputedStyle(viewport);
  const availableHeight = viewport.clientHeight
    - Number.parseFloat(style.paddingTop)
    - Number.parseFloat(style.paddingBottom);
  const groupHeight = group.getBoundingClientRect().height;
  const trailingGap = Number.parseFloat(getComputedStyle(group).paddingBottom);
  promoCycleHeight.value = groupHeight;
  promoOverflow.value = groupHeight - trailingGap > availableHeight + 1;
}

function scheduleDisplayLayout() {
  if (disposed) return;
  if (layoutFrame) cancelAnimationFrame(layoutFrame);
  layoutFrame = requestAnimationFrame(() => {
    layoutFrame = undefined;
    measureMenuMarquee();
    measurePromoMarquee();
    measureCateringMarquee();
    syncCateringPlayback();
  });
}

async function loadDisplayData(options?: { silent?: boolean }) {
  await Promise.all([load(options), loadRuntimePromos()]);
}

const menuSignature = computed(() => JSON.stringify({
  sections: menuSections.value,
  soldOut: [...soldOut.value],
}));
watch(menuSignature, scheduleDisplayLayout, { flush: "post" });
watch(menuTrackElement, scheduleDisplayLayout, { flush: "post" });
watch(promoTrackElement, scheduleDisplayLayout, { flush: "post" });
watch(cateringTrackElement, scheduleDisplayLayout, { flush: "post" });
function observeViewport(element: HTMLElement | undefined, previous: HTMLElement | undefined) {
  if (previous) resizeObserver?.unobserve(previous);
  if (element) resizeObserver?.observe(element);
  scheduleDisplayLayout();
}
watch(menuViewportElement, observeViewport, { flush: "post" });
watch(promoViewportElement, observeViewport, { flush: "post" });
watch(cateringViewportElement, observeViewport, { flush: "post" });
watch(() => JSON.stringify(promoCards.value), scheduleDisplayLayout, { flush: "post" });
watch(() => JSON.stringify(cateringItems.value), () => {
  cateringRunKey.value += 1;
  if (!cateringItems.value.length) {
    setCateringVisible(false);
    if (cateringTimer) clearTimeout(cateringTimer);
    cateringTimer = undefined;
  } else if (!cateringTimer) {
    scheduleCateringCycle();
  }
  if (cateringVisible.value && cateringTimer) {
    clearTimeout(cateringTimer);
    cateringTimer = undefined;
  }
  scheduleDisplayLayout();
}, { flush: "post" });

const now = ref(new Date());
const clock = computed(() => now.value.toLocaleTimeString("es-MX", {
  timeZone: "America/Hermosillo",
  hour: "2-digit",
  minute: "2-digit",
}));
const dateLabel = computed(() => new Date(`${selectedDate.value}T12:00:00-07:00`).toLocaleDateString("es-MX", {
  timeZone: "America/Hermosillo",
  weekday: "long",
  day: "numeric",
  month: "long",
}));
const money = (value: number) => new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
}).format(value);

onMounted(() => {
  void loadDisplayData();
  resizeObserver = new ResizeObserver(scheduleDisplayLayout);
  if (displayShellElement.value) resizeObserver.observe(displayShellElement.value);
  if (menuViewportElement.value) resizeObserver.observe(menuViewportElement.value);
  if (promoViewportElement.value) resizeObserver.observe(promoViewportElement.value);
  if (cateringViewportElement.value) resizeObserver.observe(cateringViewportElement.value);
  window.addEventListener("resize", scheduleDisplayLayout);
  void document.fonts.ready.then(scheduleDisplayLayout);
  document.fonts.addEventListener("loadingdone", scheduleDisplayLayout);
  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotion.value = motionPreference.matches;
  motionPreference.addEventListener("change", updateMotionPreference);
  scheduleCateringCycle();
  clockTimer = window.setInterval(() => {
    now.value = new Date();
    currentDate.value = todayISO();
  }, 1_000);
  refreshTimer = window.setInterval(
    () => void loadDisplayData({ silent: true }),
    REFRESH_DURATION,
  );
});

onBeforeUnmount(() => {
  disposed = true;
  resizeObserver?.disconnect();
  window.removeEventListener("resize", scheduleDisplayLayout);
  document.fonts.removeEventListener("loadingdone", scheduleDisplayLayout);
  motionPreference?.removeEventListener("change", updateMotionPreference);
  if (layoutFrame) cancelAnimationFrame(layoutFrame);
  if (clockTimer) clearInterval(clockTimer);
  if (refreshTimer) clearInterval(refreshTimer);
  if (cateringTimer) clearTimeout(cateringTimer);
  if (cateringTransitionTimer) clearTimeout(cateringTransitionTimer);
});
</script>

<style scoped>
.display-shell {
  --display-blue: hsl(198 76% 27%);
  --display-green: hsl(158 67% 29%);
  --display-ink: hsl(205 25% 13%);
  --display-paper: hsl(48 35% 97%);
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: var(--display-paper);
  color: var(--display-ink);
  font-family: "Roboto", sans-serif;
}
.display-content {
  --catering-width: 26vw;
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 3fr) 0px;
  min-height: 0;
  overflow: hidden;
  transition: grid-template-columns 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}
.display-content.catering-visible {
  grid-template-columns: minmax(0, 7fr) minmax(0, 3fr) var(--catering-width);
}
.display-content.is-reflowing .menu-track,
.display-content.is-reflowing .promo-track {
  animation-play-state: paused;
}
.menu-board {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  padding: clamp(0.75rem, 1.5vw, 2rem);
}
.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 1rem;
  padding-bottom: clamp(0.75rem, 2vh, 1.5rem);
}
.title-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}
.title-brand img {
  width: clamp(2.5rem, 4vw, 4rem);
  height: clamp(2.5rem, 4vw, 4rem);
  border-radius: 50%;
  object-fit: contain;
}
.title-brand h1 {
  font-family: "Alfa Slab One", serif;
  font-size: clamp(1rem, 1.6vw, 2rem);
  line-height: 1.1;
  color: hsl(197 82% 38%);
}
.display-eyebrow {
  margin-bottom: 0.3rem;
  font-size: clamp(0.55rem, 0.65vw, 0.85rem);
  font-weight: 900;
  text-transform: uppercase;
  color: var(--display-green);
}
.section-heading > h2 {
  font-family: "Alfa Slab One", serif;
  font-size: clamp(1.5rem, 2.3vw, 3rem);
  line-height: 1.1;
}
.board-time { text-align: right; }
.board-time p {
  font-size: clamp(1.15rem, 1.6vw, 2rem);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}
.board-time span {
  display: block;
  font-size: clamp(0.6rem, 0.7vw, 0.9rem);
  font-weight: 700;
  text-transform: uppercase;
}
.board-time .preview-date {
  margin-top: 0.25rem;
  color: var(--display-green);
}
.board-time .preview-error {
  margin-top: 0.25rem;
  color: hsl(6 72% 44%);
}
.menu-viewport {
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  border-top: 0.3rem solid var(--display-green);
  padding-top: 0.75rem;
}
.menu-track {
  position: relative;
  width: 100%;
  height: 100%;
}
.menu-track.is-scrolling {
  animation: menu-scroll var(--menu-duration) linear infinite;
}
.menu-columns[aria-hidden="true"] {
  position: absolute;
  top: 0;
  left: var(--menu-cycle-width);
}
.menu-viewport:focus-visible {
  outline: 3px solid var(--display-blue);
  outline-offset: -3px;
}
.menu-viewport:focus .menu-track {
  animation-play-state: paused;
}
.menu-columns {
  width: var(--menu-group-width, 100%);
  height: 100%;
  column-count: var(--menu-columns, 2);
  column-gap: clamp(1.25rem, 2.5vw, 3rem);
  column-fill: auto;
}
.menu-section {
  margin-bottom: 1.5rem;
}
.menu-section h3 {
  break-after: avoid;
  margin-bottom: 0.8rem;
  color: var(--display-blue);
  font-size: clamp(1.1rem, 1.35vw, 1.8rem);
  font-weight: 900;
  line-height: 1.2;
}
.menu-section li {
  display: flex;
  break-inside: avoid;
  align-items: baseline;
  gap: 0.5rem;
  padding-bottom: clamp(0.7rem, 1.3vh, 1.1rem);
  color: var(--display-ink);
  font-size: clamp(1.2rem, 1.6vw, 2.1rem);
  font-weight: 900;
  line-height: 1.2;
}
.item-name { min-width: 0; overflow-wrap: anywhere; }
.item-rule {
  flex: 1;
  min-width: 0.5rem;
  border-bottom: 2px dotted hsl(205 25% 13% / 0.2);
}
.item-price { flex-shrink: 0; color: var(--display-green); }
.sold-out-item .item-name,
.sold-out-item .item-price { color: hsl(218 8% 48%); text-decoration: line-through; }
.sold-out-badge {
  display: inline-block;
  border-radius: 0.25rem;
  padding: 0.2rem 0.4rem;
  background: hsl(6 85% 55% / 0.12);
  color: hsl(6 72% 44%);
  font-size: 0.65em;
  text-decoration: none;
  text-transform: uppercase;
}
button { border-radius: 0.25rem; padding: 0.15rem 0.6rem; font-size: 1.3em; }
button:focus-visible { outline: 3px solid currentColor; outline-offset: 2px; }
.promo-rail {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 0;
  min-width: 0;
  border-left: 0.4rem solid var(--display-green);
  background: var(--display-blue);
  color: white;
}
.promo-heading {
  padding: 0.65rem clamp(0.75rem, 1.3vw, 1.5rem);
  border-bottom: 1px solid rgb(255 255 255 / 0.18);
  color: white;
  font-size: clamp(1rem, 1.25vw, 1.6rem);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.promo-viewport {
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  padding: clamp(0.75rem, 1.3vw, 1.5rem);
  background: radial-gradient(ellipse at top right, hsl(158 67% 29% / 0.5), transparent 75%);
}
.promo-track {
  width: 100%;
}
.promo-track.is-scrolling {
  animation: promo-scroll var(--promo-duration) linear infinite;
}
.promo-viewport:focus-visible {
  outline: 3px solid white;
  outline-offset: -3px;
}
.promo-viewport:focus .promo-track {
  animation-play-state: paused;
}
.promo-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
}
.promo-card {
  flex-shrink: 0;
  padding: clamp(0.75rem, 1.2vw, 1.5rem);
  border: 1px solid rgb(255 255 255 / 0.2);
  border-left: 0.25rem solid hsl(151 75% 76%);
  border-radius: 0.5rem;
  background: rgb(255 255 255 / 0.07);
  overflow-wrap: anywhere;
}
.promo-card-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.6rem;
}
.promo-card h2 {
  min-width: 0;
  color: white;
  font-size: clamp(1.1rem, 1.4vw, 1.9rem);
  font-weight: 900;
  line-height: 1.2;
}
.promo-summary {
  margin-top: 0.6rem;
  color: rgb(255 255 255 / 0.85);
  font-size: clamp(0.95rem, 1vw, 1.4rem);
  line-height: 1.4;
}
.promo-price {
  flex-shrink: 0;
  color: hsl(48 85% 76%);
  font-size: clamp(1.2rem, 1.65vw, 2.2rem);
  font-weight: 900;
  line-height: 1.2;
}
.rail-empty {
  display: grid;
  height: 100%;
  align-content: center;
  padding: 1.5rem;
  text-align: center;
  font-size: clamp(1rem, 1.4vw, 1.75rem);
}
.rail-empty img { width: 40%; margin: 0 auto 1.5rem; }
.rail-empty h2 { margin-bottom: 1rem; font-weight: 900; }
.catering-rail {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: hsl(42 40% 94%);
}
.catering-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: var(--catering-width);
  height: 100%;
  padding: clamp(0.85rem, 1.4vw, 2rem);
  border-left: 0.25rem solid hsl(39 45% 58%);
  color: hsl(190 30% 17%);
  transform: translateX(100%);
  opacity: 0;
  transition:
    transform 0.85s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.5s ease;
}
.catering-visible .catering-panel {
  transform: translateX(0);
  opacity: 1;
}
.catering-heading {
  padding-bottom: clamp(0.75rem, 1.5vh, 1.25rem);
}
.catering-eyebrow {
  margin: 0 0 0.3rem;
  color: hsl(35 43% 36%);
  font-size: clamp(0.65rem, 0.8vw, 1rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.catering-heading h2 {
  color: hsl(190 30% 17%);
  font-size: clamp(2rem, 3vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
}
.catering-heading > p:last-child {
  margin: 0.4rem 0 0;
  font-size: clamp(0.8rem, 0.95vw, 1.2rem);
}
.catering-collection {
  min-height: 0;
  overflow: hidden;
}
.catering-track.is-scrolling {
  animation: catering-scroll var(--catering-duration) linear 1 both;
  animation-play-state: paused;
}
.catering-visible:not(.is-reflowing) .catering-track {
  animation-play-state: running;
}
.catering-collection:focus-visible {
  outline: 3px solid hsl(35 43% 36%);
  outline-offset: -3px;
}
.catering-visible .catering-collection:focus .catering-track {
  animation-play-state: paused;
}
.catering-group {
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.5vh, 1.25rem);
}
.catering-card {
  display: grid;
  grid-template-rows: minmax(3rem, 1fr) auto;
  flex-shrink: 0;
  height: var(--catering-card-height);
  min-height: 0;
  overflow: hidden;
  border: 1px solid hsl(39 32% 81%);
  border-radius: 0.4rem;
  background: hsl(48 45% 98%);
}
.catering-photo {
  width: 100%;
  height: 100%;
  min-height: 0;
  margin: 0;
  object-fit: cover;
}
.catering-photo.is-logo {
  object-fit: contain;
  padding: 1rem;
}
.catering-card-copy {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 0.6rem;
  padding: clamp(0.65rem, 1vw, 1.2rem);
}
.catering-card h3 {
  font-size: clamp(1rem, 1.25vw, 1.65rem);
  font-weight: 700;
  line-height: 1.15;
  overflow-wrap: anywhere;
}
.catering-card-copy > p {
  margin: 0;
  color: hsl(35 43% 36%);
  font-size: clamp(1rem, 1.4vw, 1.85rem);
  font-weight: 900;
  line-height: 1.15;
}
.catering-note {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.75rem;
  color: hsl(35 43% 36%);
  font-size: clamp(0.7rem, 0.85vw, 1.1rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.display-footer {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem clamp(0.75rem, 1.5vw, 2rem);
  background: hsl(205 60% 20%);
  color: white;
  font-size: clamp(0.75rem, 0.95vw, 1.2rem);
  font-weight: 700;
}
.footer-order, .footer-qr { display: flex; align-items: center; gap: 0.65rem; min-width: 0; }
.footer-order { max-width: clamp(10rem, 25vw, 24rem); }
.footer-order > div { min-width: 0; }
.order-url { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: 0.75; font-size: 0.85em; }
.footer-qr { grid-column: 3; text-align: right; font-size: 0.85em; line-height: 1.2; }
.footer-qr img { width: clamp(3rem, 5vw, 5.5rem); height: clamp(3rem, 5vw, 5.5rem); border-radius: 0.25rem; padding: 0.2rem; background: white; }
.ticker { display: flex; grid-column: 2; min-width: 0; overflow: hidden; align-items: center; }
.ticker-icon { width: 2rem; height: 1.25rem; flex-shrink: 0; }
.ticker-viewport { flex: 1; min-width: 0; overflow: hidden; }
.ticker-track { display: flex; width: max-content; animation: ticker-scroll var(--ticker-duration) linear infinite; }
.ticker-group { display: flex; flex-shrink: 0; }
.ticker-item { white-space: nowrap; }
.ticker-item::after { content: "•"; margin: 0 1.5rem; color: hsl(48 85% 76%); }
.display-state, .empty-copy { display: grid; min-height: 0; place-content: center; justify-items: center; gap: 1rem; text-align: center; padding: 1rem; }
.empty-copy { height: 100%; }
@keyframes ticker-scroll { to { transform: translateX(-50%); } }
@keyframes promo-scroll { to { transform: translateY(-50%); } }
@keyframes menu-scroll { to { transform: translateX(calc(-1 * var(--menu-cycle-width))); } }
@keyframes catering-scroll {
  from { transform: translateY(calc(var(--catering-viewport-height) - 100%)); }
  to { transform: translateY(0); }
}
@media (max-width: 1100px) {
  .section-heading { grid-template-columns: minmax(0, 1fr) auto; }
  .section-heading > h2 { grid-row: 2; grid-column: 1 / -1; }
  .footer-qr p { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .display-content, .catering-panel { transition: none; }
  .ticker-track { animation: none; }
  .promo-track.is-scrolling { animation: none; }
  .menu-track.is-scrolling { animation: none; }
  .catering-track.is-scrolling { animation: none; }
  .promo-group[aria-hidden="true"] { display: none; }
  .menu-columns[aria-hidden="true"] { display: none; }
  .promo-viewport { overflow-y: auto; }
  .menu-viewport { overflow-x: auto; }
  .catering-collection { overflow-y: auto; }
}
</style>
