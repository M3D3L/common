<template>
  <div
    ref="displayShellElement"
    class="display-shell min-h-screen overflow-hidden bg-background text-foreground"
  >
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
      <LoaderCircle class="h-12 w-12 animate-spin text-primary" />
      <p>Cargando el menú de hoy…</p>
    </main>

    <main v-else-if="loadError || !record" class="display-state">
      <div class="display-watermark" :style="watermarkStyle" />
      <WifiOff class="h-12 w-12 text-primary" />
      <h2>El menú volverá en un momento</h2>
      <p>No pudimos actualizar la pantalla. Reintentaremos automáticamente.</p>
      <Button type="button" class="retry-button" @click="load">
        Reintentar
      </Button>
    </main>

    <main v-else class="display-content">
      <section
        ref="menuBoardElement"
        class="menu-board"
        :data-density="displayDensity"
      >
        <div class="section-heading">
          <div class="title-brand">
            <img :src="logoSrc" :alt="brandName" />
            <div class="min-w-0">
              <Badge variant="secondary" class="display-eyebrow">
                San Carlos, Sonora
              </Badge>
              <h1 class="display-brand">{{ brandName }}</h1>
            </div>
          </div>
          <div class="menu-title">
            <h2>Menú del día</h2>
          </div>
          <div class="board-time">
            <p>{{ clock }}</p>
            <span>{{ dateLabel }}</span>
          </div>
        </div>

        <div
          ref="boardColumnsElement"
          class="board-columns"
          :class="{ 'board-columns-with-promos': promoCards.length }"
        >
          <section v-if="promoCards.length" class="promo-module">
            <div class="promo-module-heading">
              <div>
                <p class="section-kicker">Aprovecha hoy</p>
                <h2>Promociones</h2>
              </div>
              <Badge variant="outline">{{ promoCards.length }}</Badge>
            </div>
            <ul ref="promoListElement" :style="promoGridStyle">
              <li v-for="promo in promoCards" :key="promo.id">
                <div class="promo-module-title">
                  <span aria-hidden="true">{{ promo.emoji || "★" }}</span>
                  <strong>{{ promo.label }}</strong>
                  <span v-if="promo.price > 0" class="promo-module-price">
                    {{ money(promo.price) }}
                  </span>
                </div>
                <p>
                  {{
                    promo.summary || "Promoción disponible por tiempo limitado."
                  }}
                </p>
              </li>
            </ul>
          </section>

          <div v-if="menuSections.length" class="menu-columns">
            <section
              v-for="section in menuSections"
              :key="section.key"
              class="menu-section"
            >
              <h3>
                <span>{{ section.emoji }}</span>
                {{ section.label }}
              </h3>
              <ul>
                <li
                  v-for="item in section.items"
                  :key="item.name"
                  :class="{ 'sold-out-item': isOut(item.name) }"
                >
                  <span class="item-name">{{ item.name }}</span>
                  <Badge
                    v-if="isOut(item.name)"
                    variant="destructive"
                    class="sold-out-badge"
                  >
                    Agotado
                  </Badge>
                  <span class="item-rule" aria-hidden="true" />
                  <span v-if="item.price > 0" class="item-price">
                    {{ money(item.price) }}
                  </span>
                </li>
              </ul>
            </section>
          </div>
          <div v-else class="empty-copy">
            Estamos preparando el menú de hoy.
          </div>
        </div>
      </section>

      <aside class="spotlight" :data-density="cateringDensity">
        <div class="spotlight-heading">
          <span>Recomendación</span>
          <Badge variant="secondary" class="live-dot">Hoy</Badge>
        </div>
        <Transition name="feature" mode="out-in">
          <Card
            v-if="featuredItem"
            :key="featuredItem.key"
            styles=""
            class="feature-slide"
          >
            <img
              v-if="featuredItem.image"
              :src="featuredItem.image"
              :alt="featuredItem.name"
              class="feature-image"
            />
            <div
              v-else
              class="feature-image feature-fallback"
              :style="watermarkStyle"
            />
            <div class="feature-shade" />
            <CardHeader class="feature-copy">
              <div class="min-w-0">
                <p class="feature-kicker">{{ featuredItem.category }}</p>
                <CardTitle class="feature-title">
                  {{ featuredItem.name }}
                </CardTitle>
              </div>
              <CardDescription
                v-if="featuredItem.price > 0"
                class="feature-price"
              >
                {{ money(featuredItem.price) }}
              </CardDescription>
            </CardHeader>
            <div class="feature-progress" aria-hidden="true">
              <span :key="featuredItem.key" />
            </div>
          </Card>
        </Transition>

        <Card ref="cateringListElement" styles="" class="catering-list">
          <CardHeader class="flex-row items-end justify-between gap-3 p-0">
            <div>
              <p class="section-kicker">Para tu evento</p>
              <CardTitle class="catering-title">Catering</CardTitle>
            </div>
            <Badge variant="outline" class="order-badge">Por encargo</Badge>
          </CardHeader>
          <CardContent class="p-0">
            <ul>
              <li
                v-for="item in cateringItems"
                :key="item.name"
                :class="{ 'sold-out-item': isOut(item.name) }"
              >
                <span>
                  {{ item.name }}
                  <Badge
                    v-if="isOut(item.name)"
                    variant="destructive"
                    class="sold-out-label"
                  >
                    Agotado
                  </Badge>
                </span>
                <strong>{{ money(item.price) }}</strong>
              </li>
            </ul>
          </CardContent>
        </Card>
      </aside>
    </main>

    <footer class="display-footer">
      <div class="footer-order flex min-w-0 items-center gap-3">
        <MessageCircle class="h-6 w-6 shrink-0" />
        <div class="min-w-0">
          <p class="font-black">Ordena desde tu teléfono</p>
          <p class="truncate text-sm text-white/75">{{ orderUrl }}</p>
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
              >
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-qr flex items-center gap-3">
        <p class="hidden text-right text-sm font-bold leading-tight sm:block">
          Escanea para ver<br />el menú completo
        </p>
        <img
          :src="qrUrl"
          alt="Código QR para ordenar"
          class="h-16 w-16 rounded bg-white p-1"
        />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  LoaderCircle,
  Megaphone,
  MessageCircle,
  WifiOff,
} from "lucide-vue-next";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@common/components/ui/card";
import { todayISO, type GroupKey, type MenuItem } from "~/utils/comandas";
import { useMenuData, type MenuRecordFull } from "~/composables/useMenuData";
import { useMenuPricing } from "~/composables/useMenuPricing";

definePageMeta({ layout: false });

type DisplayItem = MenuItem & {
  key: string;
  category: string;
  surface: "menu" | "catering";
};

const FEATURE_DURATION = 8_000;
const REFRESH_DURATION = 60_000;
const MIN_PROMO_CARD_WIDTH = 220;
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
  () =>
    `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(orderUrl)}`,
);
const watermarkStyle = computed(() => ({ backgroundImage: `url(${logoSrc})` }));
const { fetchCollection } = usePocketBaseCore();
const { record, pending, loadError, load } =
  useLatestMenuRecord<MenuRecordFull>("menu");
const selectedDate = ref(todayISO());
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
const emptyCart = reactive<Record<string, number>>({});
const emptyTaquizaCounts = computed(() => ({ tacos: 0, quesadillas: 0 }));
const { loadRuntimePromos, promoCardsWithAppliedState: promoCards } =
  useMenuPricing({
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
const cateringItems = computed(() =>
  cateringData.groupItems("catering" as GroupKey),
);
const newsTickerItems = computed(() =>
  String(record.value?.news ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean),
);
const tickerItems = newsTickerItems;
const tickerStyle = computed(() => ({
  "--ticker-duration": `${Math.max(24, tickerItems.value.join(" ").length * 0.32)}s`,
}));
const menuBoardElement = ref<HTMLElement>();
const boardColumnsElement = ref<HTMLElement>();
const promoListElement = ref<HTMLElement>();
const displayShellElement = ref<HTMLElement>();
const cateringListElement = ref<HTMLElement>();
const promoColumnCount = ref(1);
const displayDensity = ref<"comfortable" | "compact" | "tight">("comfortable");
const cateringDensity = ref<"comfortable" | "compact" | "tight">("comfortable");
const promoGridStyle = computed(() => ({
  "--promo-columns": String(promoColumnCount.value),
}));

function nextPaint() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function isOverflowing(element: HTMLElement) {
  return (
    element.scrollWidth > element.clientWidth + 1 ||
    element.scrollHeight > element.clientHeight + 1
  );
}

async function setPromoColumns() {
  const promoList = promoListElement.value;
  if (!promoList || !promoCards.value.length) return;

  const gap = Number.parseFloat(getComputedStyle(promoList).columnGap) || 0;
  promoColumnCount.value = Math.max(
    1,
    Math.min(
      promoCards.value.length,
      Math.floor((promoList.clientWidth + gap) / (MIN_PROMO_CARD_WIDTH + gap)),
    ),
  );
  await nextPaint();
}

let fitInProgress = false;

async function fitDisplay() {
  const board = boardColumnsElement.value;
  if (!board || fitInProgress) return;

  fitInProgress = true;
  displayDensity.value = "comfortable";
  cateringDensity.value = "comfortable";
  await nextTick();
  await nextPaint();

  try {
    await setPromoColumns();

    while (
      isOverflowing(board) &&
      promoColumnCount.value < promoCards.value.length
    ) {
      promoColumnCount.value += 1;
      await nextPaint();
    }

    if (isOverflowing(board)) {
      displayDensity.value = "compact";
      await nextPaint();
    }
    if (isOverflowing(board)) {
      displayDensity.value = "tight";
      await nextPaint();
    }

    const catering = cateringListElement.value;
    if (catering && isOverflowing(catering)) {
      cateringDensity.value = "compact";
      await nextPaint();
    }
    if (catering && isOverflowing(catering)) {
      cateringDensity.value = "tight";
    }
  } finally {
    fitInProgress = false;
  }
}

let fitFrame: number | undefined;
let boardResizeObserver: ResizeObserver | undefined;

function scheduleDisplayFit() {
  if (fitInProgress) return;
  if (fitFrame) cancelAnimationFrame(fitFrame);
  fitFrame = requestAnimationFrame(() => {
    fitFrame = undefined;
    void fitDisplay();
  });
}

async function loadDisplayData(options?: { silent?: boolean }) {
  await Promise.allSettled([load(options), loadRuntimePromos()]);
}

const featurePool = computed<DisplayItem[]>(() => {
  const menuItems = menuSections.value.flatMap((section) =>
    section.items
      .filter((item) => !isOut(item.name))
      .map((item) => ({
        ...item,
        key: `menu:${section.key}:${item.name}`,
        category: section.label,
        surface: "menu" as const,
      })),
  );
  const catering = cateringItems.value
    .filter((item) => !isOut(item.name))
    .map((item) => ({
      ...item,
      key: `catering:${item.name}`,
      category: "Catering",
      surface: "catering" as const,
    }));
  const pool = [...menuItems, ...catering];
  const withImages = pool.filter((item) => item.image);
  return withImages.length ? withImages : pool;
});

const shuffledFeatures = ref<DisplayItem[]>([]);
const featureIndex = ref(0);
const featuredItem = computed(
  () => shuffledFeatures.value[featureIndex.value] ?? featurePool.value[0],
);

function shuffleFeatures() {
  shuffledFeatures.value = [...featurePool.value].sort(
    () => Math.random() - 0.5,
  );
  featureIndex.value = 0;
}

const featurePoolSignature = computed(() =>
  JSON.stringify(
    featurePool.value.map(({ key, name, price, image, category, surface }) => ({
      key,
      name,
      price,
      image,
      category,
      surface,
    })),
  ),
);
const displayLayoutSignature = computed(() =>
  JSON.stringify({
    sections: menuSections.value,
    promos: promoCards.value,
    catering: cateringItems.value,
  }),
);

watch(featurePoolSignature, shuffleFeatures, { immediate: true });
watch(displayLayoutSignature, scheduleDisplayFit, { flush: "post" });

const now = ref(new Date());
const clock = computed(() =>
  now.value.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  }),
);
const dateLabel = computed(() =>
  now.value.toLocaleDateString("es-MX", {
    timeZone: "America/Hermosillo",
    weekday: "long",
    day: "numeric",
    month: "long",
  }),
);
const money = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);

let clockTimer: number | undefined;
let featureTimer: number | undefined;
let refreshTimer: number | undefined;

onMounted(() => {
  void loadDisplayData();
  boardResizeObserver = new ResizeObserver(scheduleDisplayFit);
  if (displayShellElement.value) {
    boardResizeObserver.observe(displayShellElement.value);
  }
  void document.fonts.ready.then(scheduleDisplayFit);
  clockTimer = window.setInterval(() => {
    now.value = new Date();
    const nextDate = todayISO();
    if (nextDate !== selectedDate.value) selectedDate.value = nextDate;
  }, 1_000);
  featureTimer = window.setInterval(() => {
    const count = shuffledFeatures.value.length;
    if (!count) return;
    featureIndex.value = (featureIndex.value + 1) % count;
    if (featureIndex.value === 0) shuffleFeatures();
  }, FEATURE_DURATION);
  refreshTimer = window.setInterval(
    () => void loadDisplayData({ silent: true }),
    REFRESH_DURATION,
  );
});

onBeforeUnmount(() => {
  boardResizeObserver?.disconnect();
  if (fitFrame) cancelAnimationFrame(fitFrame);
  if (clockTimer) clearInterval(clockTimer);
  if (featureTimer) clearInterval(featureTimer);
  if (refreshTimer) clearInterval(refreshTimer);
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
  font-family: "Roboto", sans-serif;
  height: 100svh;
  background: var(--display-paper);
}

.display-footer {
  display: grid;
  grid-template-columns: minmax(12rem, 20rem) minmax(0, 1fr) auto;
  min-height: 5.5rem;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 2rem;
  color: white;
  background: var(--display-blue);
}
.footer-order {
  overflow: hidden;
}
.footer-qr {
  grid-column: 3;
  justify-self: end;
}
.ticker {
  display: flex;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  height: 2.5rem;
  align-items: center;
  overflow: hidden;
  border-inline: 1px solid rgb(255 255 255 / 0.22);
}
.ticker-icon {
  width: 2.75rem;
  height: 2.5rem;
  flex-shrink: 0;
  padding: 0.7rem;
}
.ticker-viewport {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  flex: 1;
  overflow: hidden;
}
.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-scroll var(--ticker-duration) linear infinite;
}
.ticker-group {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding-inline-start: clamp(2rem, 4vw, 4rem);
}
.ticker-item {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  font-size: 0.95rem;
  font-weight: 900;
}
.ticker-item::after {
  margin: 0 1.5rem;
  color: hsl(48 85% 72%);
  content: "•";
}
.display-eyebrow,
.section-kicker,
.feature-kicker {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.display-eyebrow {
  width: fit-content;
  margin-bottom: 0.2rem;
  border-radius: 999px;
  background: hsl(158 67% 29% / 0.1);
  padding: 0.2rem 0.55rem;
  font-size: 0.72rem;
  color: var(--display-green);
}
.display-brand {
  font-family: "Alfa Slab One", cursive !important;
  font-size: 2rem;
  line-height: 1.05;
  font-weight: 300 !important;
  color: hsl(197 82% 38%);
  letter-spacing: 0;
}
.display-content {
  display: grid;
  height: 100%;
  grid-template-columns: minmax(0, 1fr) clamp(20rem, 25vw, 28rem);
  min-height: 0;
}
.board-columns {
  min-height: 0;
}
.board-columns-with-promos {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: clamp(0.75rem, 1.5vh, 1.25rem);
  overflow: hidden;
}
.board-columns-with-promos .menu-columns {
  column-gap: clamp(1.5rem, 2.5vw, 2.5rem);
}
.promo-module {
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(0.55rem, 1vh, 0.8rem);
  border-top: 0.3rem solid var(--display-green);
  padding-top: clamp(0.6rem, 1.2vh, 0.9rem);
}
.promo-module-heading {
  display: flex;
  min-width: 0;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
}
.promo-module-heading h2 {
  font-family: "Alfa Slab One", serif;
  color: var(--display-ink);
  font-size: clamp(1.8rem, 2.2vw, 2.4rem);
  font-weight: 400;
  line-height: 1;
  overflow-wrap: anywhere;
}
.promo-module ul {
  display: grid;
  grid-template-columns: repeat(var(--promo-columns, 1), minmax(0, 1fr));
  gap: clamp(0.45rem, 0.8vw, 0.75rem);
}
.promo-module li {
  min-width: 0;
  border-left: 0.25rem solid hsl(158 67% 29% / 0.35);
  background: hsl(158 67% 29% / 0.055);
  padding: clamp(0.55rem, 1vh, 0.8rem);
}
.promo-module-title {
  display: grid;
  min-width: 0;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 0.4rem;
  color: var(--display-blue);
  font-size: clamp(1.15rem, 1.45vw, 1.5rem);
  line-height: 1.15;
}
.promo-module-title strong {
  overflow-wrap: anywhere;
}
.promo-module-price {
  flex-shrink: 0;
  color: var(--display-green);
  font-weight: 900;
}
.promo-module li > p {
  display: -webkit-box;
  margin-top: 0.4rem;
  overflow: hidden;
  color: hsl(218 12% 35%);
  font-size: clamp(0.78rem, 0.85vw, 0.95rem);
  font-weight: 700;
  line-height: 1.3;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.menu-board {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  padding: 1rem 2.5rem 1.5rem;
  overflow: hidden;
}
.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.title-brand {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.8rem;
}
.title-brand img {
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  border: 2px solid hsl(197 82% 38% / 0.2);
  border-radius: 999px;
  background: white;
  object-fit: cover;
}
.menu-title {
  text-align: center;
}
.board-time {
  text-align: right;
}
.board-time p {
  color: var(--display-ink);
  font-size: 1.65rem;
  font-weight: 900;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.board-time span {
  color: hsl(218 12% 35%);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}
.section-heading h2,
.catering-title {
  font-family: "Alfa Slab One", serif;
  font-size: 2.75rem;
  line-height: 1.05;
  font-weight: 400;
  color: var(--display-ink);
}
.section-kicker {
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
  color: var(--display-green);
}
.availability-note {
  margin-top: 0.2rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: hsl(218 12% 35%);
}
.menu-columns {
  columns: 2;
  column-gap: 2.5rem;
}
.menu-section {
  min-width: 0;
  break-inside: avoid;
  border-top: 0.3rem solid var(--display-blue);
  margin-bottom: 1rem;
  padding-top: 0.9rem;
}
.menu-section h3 {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.75rem;
  font-size: 1.35rem;
  color: var(--display-blue);
}
.menu-section ul {
  display: grid;
  gap: 0.65rem;
}
.menu-section li {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 0.65rem;
  font-size: clamp(1.45rem, 1.55vw, 1.9rem);
  font-weight: 900;
  line-height: 1.1;
  color: var(--display-ink);
}
.menu-board[data-density="compact"] .section-heading {
  margin-bottom: 0.65rem;
}
.menu-board[data-density="compact"] .menu-section {
  margin-bottom: 0.7rem;
  padding-top: 0.65rem;
}
.menu-board[data-density="compact"] .menu-section h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}
.menu-board[data-density="compact"] .menu-section ul {
  gap: 0.45rem;
}
.menu-board[data-density="compact"] .menu-section li {
  font-size: clamp(1.2rem, 1.35vw, 1.65rem);
}
.menu-board[data-density="tight"] .section-heading {
  margin-bottom: 0.45rem;
}
.menu-board[data-density="tight"] .menu-section {
  margin-bottom: 0.5rem;
  padding-top: 0.5rem;
}
.menu-board[data-density="tight"] .menu-section h3 {
  margin-bottom: 0.4rem;
  font-size: 1.05rem;
}
.menu-board[data-density="tight"] .menu-section ul {
  gap: 0.3rem;
}
.menu-board[data-density="tight"] .menu-section li {
  font-size: clamp(1.05rem, 1.15vw, 1.4rem);
}
.item-name {
  min-width: 0;
  overflow-wrap: anywhere;
}
.item-rule {
  min-width: 0.75rem;
  flex: 1;
  border-bottom: 2px dotted hsl(205 25% 13% / 0.2);
}
.item-price {
  flex-shrink: 0;
  color: var(--display-green);
  font-weight: 900;
}
.sold-out-item .item-name,
.sold-out-item .item-price,
.catering-list .sold-out-item strong {
  color: hsl(218 8% 48%);
  text-decoration: line-through;
}
.sold-out-badge,
.sold-out-label {
  flex-shrink: 0;
  border-radius: 0.25rem;
  background: hsl(6 85% 55% / 0.12);
  padding: 0.2rem 0.4rem;
  color: hsl(6 72% 44%);
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
}
.sold-out-label {
  display: inline-block;
  margin-left: 0.25rem;
  font-size: 0.65rem;
}

.spotlight {
  display: grid;
  min-width: 0;
  grid-template-rows: auto minmax(0, 0.9fr) minmax(17rem, 1.1fr);
  border-left: 0.5rem solid var(--display-green);
  background: var(--display-ink);
  color: white;
}
.spotlight-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.14);
  font-size: 0.85rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.live-dot {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: hsl(151 75% 66%);
}
.live-dot::before {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: currentColor;
  content: "";
}
.feature-slide {
  position: relative;
  min-height: 0;
  overflow: hidden;
  isolation: isolate;
}
.feature-image {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  opacity: 0.76;
}
.feature-fallback,
.image-fallback {
  background-position: center;
  background-repeat: no-repeat;
  background-size: 55%;
}
.feature-fallback {
  opacity: 0.2;
}
.feature-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgb(8 24 30 / 0.98),
    rgb(8 24 30 / 0.2) 74%
  );
}
.feature-copy {
  position: absolute;
  inset: auto 0 0;
  padding: 1.5rem;
}
.feature-kicker {
  color: hsl(151 75% 66%);
  font-size: 0.78rem;
}
.feature-title {
  margin-top: 0.35rem;
  max-width: 13ch;
  font-size: 2.35rem;
  line-height: 1.05;
  color: white;
  overflow-wrap: anywhere;
}
.feature-price {
  margin-top: 0.6rem;
  color: white;
  font-size: 1.6rem;
  font-weight: 900;
}
.feature-progress {
  position: absolute;
  inset: auto 1.5rem 0.65rem;
  height: 3px;
  overflow: hidden;
  background: rgb(255 255 255 / 0.25);
}
.feature-progress span {
  display: block;
  height: 100%;
  background: white;
  animation: feature-timer 8s linear;
}
.catering-list {
  min-height: 0;
  overflow: hidden;
  padding: 1.5rem;
  background: var(--display-paper);
  color: var(--display-ink);
}
.order-badge {
  font-size: 0.85rem;
  color: hsl(218 12% 35%);
}
.catering-list ul {
  margin-top: 1rem;
  columns: 1;
}
.catering-list li {
  display: flex;
  break-inside: avoid;
  justify-content: space-between;
  gap: 0.5rem;
  border-bottom: 1px solid hsl(44 70% 85%);
  padding: 0.55rem 0;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.15;
}
.spotlight[data-density="compact"] .catering-list {
  padding: 1.1rem;
}
.spotlight[data-density="compact"] .catering-list ul {
  margin-top: 0.65rem;
}
.spotlight[data-density="compact"] .catering-list li {
  padding: 0.4rem 0;
  font-size: 1.05rem;
}
.spotlight[data-density="tight"] .catering-list {
  padding: 0.85rem 1rem;
}
.spotlight[data-density="tight"] .catering-list ul {
  margin-top: 0.45rem;
}
.spotlight[data-density="tight"] .catering-list li {
  padding: 0.3rem 0;
  font-size: 0.95rem;
}
.catering-list li span {
  overflow-wrap: anywhere;
}
.catering-list strong {
  flex-shrink: 0;
  color: var(--display-green);
}

.display-state {
  position: relative;
  display: grid;
  min-height: 0;
  place-content: center;
  justify-items: center;
  gap: 1rem;
  overflow: hidden;
  padding: 2rem;
  text-align: center;
}
.display-state h2 {
  font-size: 2rem;
  color: var(--display-blue);
}
.display-state p {
  color: hsl(218 12% 35%);
}
.display-watermark {
  position: absolute;
  inset: 10%;
  z-index: -1;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.06;
}
.retry-button {
  min-height: 2.75rem;
  border-radius: 0.4rem;
  background: var(--display-blue);
  padding: 0 1.25rem;
  color: white;
  font-weight: 900;
}
.empty-copy {
  display: grid;
  min-height: 18rem;
  place-content: center;
  border: 1px dashed hsl(197 82% 38% / 0.25);
  color: hsl(218 12% 35%);
  font-weight: 700;
}
.feature-enter-active,
.feature-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.8s ease;
}
.feature-enter-from {
  opacity: 0;
  transform: scale(1.025);
}
.feature-leave-to {
  opacity: 0;
  transform: scale(0.99);
}
@keyframes feature-timer {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
@keyframes ticker-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 900px) {
  .display-shell {
    display: block;
    height: auto;
    min-height: 100svh;
    overflow: auto;
  }
  .display-brand {
    font-size: 1.4rem;
  }
  .display-content {
    height: auto;
    grid-template-columns: 1fr;
  }
  .board-columns-with-promos {
    grid-template-rows: auto auto;
    overflow: visible;
  }
  .promo-module {
    grid-template-columns: 1fr;
  }
  .promo-module-heading {
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
  }
  .menu-board {
    padding: 1.25rem 1rem;
  }
  .section-heading {
    grid-template-columns: 1fr auto;
  }
  .menu-title {
    grid-column: 1 / -1;
    grid-row: 2;
    text-align: left;
  }
  .spotlight {
    min-height: 42rem;
    border-left: 0;
    grid-template-rows: 26rem auto;
  }
  .display-footer {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }
  .footer-order {
    display: none;
  }
  .footer-qr {
    grid-column: 2;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feature-enter-active,
  .feature-leave-active {
    transition: none;
  }
  .feature-progress span {
    animation: none;
    width: 100%;
  }
  .ticker-track {
    animation: none;
  }
}
</style>
