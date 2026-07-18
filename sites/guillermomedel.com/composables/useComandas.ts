import {
  ref,
  reactive,
  computed,
  provide,
  inject,
  onMounted,
  onBeforeUnmount,
  type InjectionKey,
} from "vue";
import {
  todayISO,
  type GroupKey,
  type FilterType,
  type PlacedOrder,
  type DayDishes,
  type MenuRecord,
} from "~/utils/comandas";
import type { OrderMode, Customer } from "~/composables/useWhatsappOrder";

/* ===== Config ===== */
const STORAGE_KEY = "comandas";

// Colección y campo JSON donde viven las órdenes en PocketBase.
const COMANDAS_COLLECTION = "comandas";
//    (tu mensaje decía "un solo json"; si el campo se llama `field`, ponlo aquí)
const COMANDAS_FIELD = "data";

// Cada cuánto se consulta PocketBase para mantener el tablero en vivo (ms).
const AUTO_REFRESH_MS = 15_000;

const emptyDishes = (): DayDishes => ({ guisos: [], sides: [], bebidas: [] });

// Orden + id del registro de PocketBase (para poder borrarlo al completar/descartar).
type StoredOrder = PlacedOrder & { recordId?: string };

/**
 * Fuente única de verdad de Comandas. El CATÁLOGO (dishes), la SELECCIÓN
 * (active) y ahora también las ÓRDENES viven en PocketBase; localStorage
 * queda como cache para arranque instantáneo y modo offline.
 */
function createComandasStore() {
  const { formatOrder, formatSoldOut, formatReady, formatMenu, waLink } =
    useWhatsappOrder();
  const { fetchCollection, createItem, updateItem, deleteItem } =
    usePocketBaseCore();

  /* ===== Estado ===== */
  const view = ref<"setup" | "order" | "orders">("setup");
  const catalog = ref<DayDishes>(emptyDishes()); // platillos disponibles (de la BD)
  const today = reactive<Record<GroupKey, string[]>>({
    guisos: [],
    sides: [],
    bebidas: [],
  });
  const soldOut = ref<string[]>([]);
  const counter = ref(1);
  const cart = reactive<Record<string, number>>({});
  const mode = ref<OrderMode>("llevar");
  const note = ref("");
  const fulfillDate = ref<string>(todayISO());
  const filter = ref<FilterType>("all");
  const customer = reactive<Customer>({ name: "", phone: "", address: "" });
  const orders = ref<StoredOrder[]>([]);
  const pick = reactive<Record<GroupKey, Set<string>>>({
    guisos: new Set(),
    sides: new Set(),
    bebidas: new Set(),
  });
  const toastMsg = ref("");

  // Menú en la BD
  const menuLoading = ref(true);
  const savingMenu = ref(false);
  const menuRecordId = ref<string | null>(null);

  // Auto-refresh en vivo
  const isRefreshing = ref(false);

  /* ===== Computed ===== */
  const stats = computed(() => {
    const current = orders.value;
    return {
      total: current.length,
      aqui: current.filter((o) => o.mode === "aqui").length,
      llevar: current.filter((o) => o.mode === "llevar").length,
      domicilio: current.filter((o) => o.mode === "domicilio").length,
    };
  });

  const statCards = computed(() => [
    { label: "Total Activas", value: stats.value.total, color: "text-primary" },
    { label: "Aquí", value: stats.value.aqui, color: "text-blue-600" },
    {
      label: "Para Llevar",
      value: stats.value.llevar,
      color: "text-orange-600",
    },
    {
      label: "Domicilios",
      value: stats.value.domicilio,
      color: "text-purple-600",
    },
  ]);

  const prettyDate = computed(() => {
    const d = new Date().toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return d.charAt(0).toUpperCase() + d.slice(1);
  });

  const catalogEmpty = computed(
    () =>
      !catalog.value.guisos.length &&
      !catalog.value.sides.length &&
      !catalog.value.bebidas.length,
  );

  const itemCount = computed(
    () => Object.values(cart).filter((q) => q > 0).length,
  );

  // Se agrupa el carrito por la selección del turno (today), no por catálogo.
  const orderText = computed(() =>
    formatOrder({
      orderNumber: counter.value,
      cart,
      mode: mode.value,
      guisos: today.guisos,
      sides: today.sides,
      bebidas: today.bebidas,
      note: note.value,
      fulfillDate: fulfillDate.value,
    }),
  );

  const sortedOrders = computed(() =>
    [...orders.value].sort((a, b) => {
      const dateA = a.fulfillDate || todayISO();
      const dateB = b.fulfillDate || todayISO();
      return dateA.localeCompare(dateB) || a.number - b.number;
    }),
  );

  const filteredOrders = computed(() =>
    filter.value === "all"
      ? sortedOrders.value
      : sortedOrders.value.filter((o) => o.mode === filter.value),
  );

  /* ===== Evaluadores con estado ===== */
  const isOut = (n: string) => soldOut.value.includes(n);
  const cartGroup = (k: GroupKey) => today[k].filter((n) => cart[n] > 0);

  /* ===== WhatsApp (respetando "primero BD, luego WhatsApp") =====
   * Se abre una pestaña en blanco DENTRO del gesto del click y se le asigna la
   * URL cuando la BD termina. Si se abriera después del await, el bloqueador de
   * pop-ups la descartaría.
   */
  function openBlankTab(): Window | null {
    return import.meta.client ? window.open("", "_blank") : null;
  }
  function sendToTab(tab: Window | null, text: string) {
    const url = waLink(text);
    if (tab) tab.location.href = url;
    else if (import.meta.client) window.open(url, "_blank");
  }

  /* ===== PocketBase: menú ===== */
  function applyRecord(r: MenuRecord) {
    menuRecordId.value = r.id;
    catalog.value = {
      guisos: r.dishes?.guisos ?? [],
      sides: r.dishes?.sides ?? [],
      bebidas: r.dishes?.bebidas ?? [],
    };
    const a = r.active ?? emptyDishes();
    today.guisos = a.guisos ?? [];
    today.sides = a.sides ?? [];
    today.bebidas = a.bebidas ?? [];
    pick.guisos = new Set(today.guisos);
    pick.sides = new Set(today.sides);
    pick.bebidas = new Set(today.bebidas);
    soldOut.value = r.sold_out ?? [];
    const hasActive =
      today.guisos.length || today.sides.length || today.bebidas.length;
    view.value = hasActive ? "order" : "setup";
  }

  async function loadMenu() {
    menuLoading.value = true;
    try {
      // Un solo registro en la colección: se trae directo, sin filtros.
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
      const rec = res.items[0] as unknown as MenuRecord | undefined;
      if (rec) applyRecord(rec);
      else {
        menuRecordId.value = null;
        view.value = "setup";
      }
    } catch {
      // Offline: se conserva lo que haya quedado en el cache local.
    } finally {
      menuLoading.value = false;
    }
  }

  /* ===== PocketBase: órdenes ===== */
  // Trae todas las órdenes activas del servidor y las fusiona con las locales
  // que aún no se hayan sincronizado (creadas offline).
  async function loadOrders() {
    try {
      const res = await fetchCollection(
        COMANDAS_COLLECTION,
        1,
        200,
        "",
        "created",
        null,
        null,
        true, // ignoreCache: en vivo siempre pega a la red
      );

      const remote: StoredOrder[] = res.items.map((rec) => ({
        ...((rec as any)[COMANDAS_FIELD] as PlacedOrder),
        recordId: rec.id,
      }));

      // Conserva órdenes creadas sin red (todavía sin recordId).
      const unsynced = orders.value.filter((o) => !o.recordId);
      orders.value = [...remote, ...unsynced];

      // Mantén el contador por delante de lo que ya existe en el servidor.
      const maxN = orders.value.reduce((m, o) => Math.max(m, o.number || 0), 0);
      if (maxN + 1 > counter.value) counter.value = maxN + 1;

      persist();
    } catch {
      // Sin red: se conserva el cache local.
    }
  }

  // Refresca solo los "agotados" del menú (barato, no toca la vista actual).
  async function refreshSoldOut() {
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
      const rec = res.items[0] as unknown as MenuRecord | undefined;
      if (rec) {
        if (!menuRecordId.value) menuRecordId.value = rec.id;
        soldOut.value = rec.sold_out ?? [];
      }
    } catch {
      /* offline */
    }
  }

  /* ===== Auto-refresh (mantiene el tablero en vivo) ===== */
  async function refreshLive() {
    if (isRefreshing.value) return;
    isRefreshing.value = true;
    try {
      await Promise.all([loadOrders(), refreshSoldOut()]);
    } finally {
      isRefreshing.value = false;
    }
  }

  let refreshTimer: ReturnType<typeof setInterval> | undefined;
  function onVisibility() {
    if (import.meta.client && !document.hidden) refreshLive();
  }
  function startAutoRefresh() {
    if (!import.meta.client) return;
    stopAutoRefresh();
    refreshTimer = setInterval(() => {
      if (document.hidden) return; // no gastes red en segundo plano
      refreshLive();
    }, AUTO_REFRESH_MS);
    document.addEventListener("visibilitychange", onVisibility);
  }
  function stopAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = undefined;
    }
    if (import.meta.client) {
      document.removeEventListener("visibilitychange", onVisibility);
    }
  }

  /* ===== Persistencia local (órdenes + cache offline) ===== */
  function persist() {
    if (import.meta.server) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        date: todayISO(),
        guisos: today.guisos,
        sides: today.sides,
        bebidas: today.bebidas,
        soldOut: soldOut.value,
        counter: counter.value,
        orders: orders.value,
      }),
    );
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s?.date !== todayISO()) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      // Solo se restauran las órdenes locales; el menú lo manda la BD.
      counter.value = s.counter || 1;
      orders.value = s.orders || [];
    } catch {
      /* Fail-safe cache reset */
    }
  }

  /* ===== Toast ===== */
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  function toast(msg: string) {
    toastMsg.value = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMsg.value = "";
    }, 1800);
  }

  /* ===== Acciones del turno ===== */
  function togglePick(k: GroupKey, name: string) {
    if (pick[k].has(name)) pick[k].delete(name);
    else pick[k].add(name);
  }

  async function startShift() {
    const activeDishes: DayDishes = {
      guisos: [...pick.guisos],
      sides: [...pick.sides],
      bebidas: [...pick.bebidas],
    };
    today.guisos = activeDishes.guisos;
    today.sides = activeDishes.sides;
    today.bebidas = activeDishes.bebidas;
    soldOut.value = soldOut.value.filter(
      (n) => pick.guisos.has(n) || pick.sides.has(n) || pick.bebidas.has(n),
    );
    clearCart();
    view.value = "order";
    persist();

    const text = formatMenu({
      guisos: activeDishes.guisos,
      sides: activeDishes.sides,
      bebidas: activeDishes.bebidas,
      date: prettyDate.value,
    });
    const wa = openBlankTab(); // dentro del gesto del click

    // 1) Primero la BD: guarda la selección en el único registro de `menu`.
    savingMenu.value = true;
    toast("Guardando menú…");
    try {
      if (menuRecordId.value) {
        await updateItem("menu", menuRecordId.value, {
          active: activeDishes,
          sold_out: soldOut.value,
        });
      } else {
        // Solo por si la colección estuviera vacía; normalmente ya existe.
        const created = await createItem("menu", {
          dishes: catalog.value,
          active: activeDishes,
          sold_out: soldOut.value,
        });
        menuRecordId.value = (created as unknown as MenuRecord).id;
      }
      toast("Menú guardado ✅");
      // 2) Luego WhatsApp con el menú del día.
      sendToTab(wa, text);
    } catch {
      wa?.close();
      toast("No se pudo guardar en el servidor");
    } finally {
      savingMenu.value = false;
    }
  }

  function editMenu() {
    pick.guisos = new Set(today.guisos);
    pick.sides = new Set(today.sides);
    pick.bebidas = new Set(today.bebidas);
    view.value = "setup";
  }

  /* ===== Flujo de órdenes ===== */
  function onTile(n: string) {
    if (!isOut(n)) addToCart(n);
  }

  function addToCart(n: string) {
    cart[n] = (cart[n] || 0) + 1;
  }

  function setQty(n: string, d: number) {
    const q = (cart[n] || 0) + d;
    cart[n] = q <= 0 ? 0 : q;
  }

  async function toggleOut(n: string) {
    const i = soldOut.value.indexOf(n);
    const nowAvailable = i >= 0;
    if (i >= 0) soldOut.value.splice(i, 1);
    else {
      soldOut.value.push(n);
      cart[n] = 0;
    }
    persist();

    const text = formatSoldOut(n, nowAvailable);
    const wa = openBlankTab(); // dentro del gesto del click

    // 1) Primero la BD (lo ve el cliente en vivo).
    if (menuRecordId.value) {
      try {
        await updateItem("menu", menuRecordId.value, {
          sold_out: soldOut.value,
        });
      } catch {
        /* queda en cache local; se reintenta al siguiente cambio */
      }
    }
    // 2) Luego WhatsApp.
    sendToTab(wa, text);
    toast(
      nowAvailable ? `Avisando: ${n} disponible` : `Avisando: se agotó ${n}`,
    );
  }

  function clearCart() {
    Object.keys(cart).forEach((k) => {
      cart[k] = 0;
    });
    mode.value = "llevar";
    note.value = "";
    fulfillDate.value = todayISO();
    customer.name = "";
    customer.phone = "";
    customer.address = "";
  }

  function advance(msg: string) {
    counter.value += 1;
    clearCart();
    persist();
    toast(msg);
  }

  async function send() {
    if (!itemCount.value) return;

    const order: StoredOrder = {
      id: `${counter.value}-${Date.now()}`,
      number: counter.value,
      cart: { ...cart },
      mode: mode.value,
      note: note.value.trim(),
      fulfillDate: fulfillDate.value,
      customer: mode.value === "domicilio" ? { ...customer } : undefined,
      createdAt: Date.now(),
    };

    // El texto se arma ANTES de vaciar el carrito.
    const text = formatOrder({
      orderNumber: order.number,
      cart: order.cart,
      mode: order.mode,
      guisos: today.guisos,
      sides: today.sides,
      bebidas: today.bebidas,
      note: order.note,
      fulfillDate: order.fulfillDate,
    });

    const wa = openBlankTab(); // dentro del gesto del click

    // 1) Primero la BD.
    try {
      const rec = await createItem(COMANDAS_COLLECTION, {
        [COMANDAS_FIELD]: order,
      });
      order.recordId = rec.id;
    } catch {
      toast("No se guardó en el servidor; se envía igual");
    }

    // 2) Reflejar local + cache.
    orders.value.push(order);
    persist();

    // 3) Luego WhatsApp.
    sendToTab(wa, text);
    advance("Abriendo WhatsApp…");
  }

  async function completeOrder(o: StoredOrder) {
    const text = formatReady(o.number, o.mode, o.customer);
    const wa = openBlankTab();

    // 1) Primero la BD.
    try {
      if (o.recordId) await deleteItem(COMANDAS_COLLECTION, o.recordId);
    } catch (e) {
      console.error("No se pudo borrar la orden en el servidor", e);
    }
    // 2) Local.
    removeOrder(o.id);
    // 3) WhatsApp.
    sendToTab(wa, text);
    toast(`Orden #${o.number} lista`);
  }

  async function discardOrder(o: StoredOrder) {
    // 1) Primero la BD.
    try {
      if (o.recordId) await deleteItem(COMANDAS_COLLECTION, o.recordId);
    } catch (e) {
      console.error("No se pudo borrar la orden en el servidor", e);
    }
    // 2) Local.
    removeOrder(o.id);
    toast(`Orden #${o.number} descartada`);
  }

  function removeOrder(id: string) {
    orders.value = orders.value.filter((x) => x.id !== id);
    persist();
  }

  onMounted(() => {
    load(); // órdenes locales (pintado instantáneo)
    loadMenu(); // catálogo + selección desde PocketBase
    loadOrders(); // órdenes desde PocketBase
    startAutoRefresh(); // polling en vivo
  });

  onBeforeUnmount(stopAutoRefresh);

  return {
    // estado
    view,
    catalog,
    today,
    counter,
    cart,
    mode,
    note,
    fulfillDate,
    filter,
    customer,
    orders,
    pick,
    toastMsg,
    menuLoading,
    savingMenu,
    isRefreshing,
    minDate: todayISO(),
    autoRefreshMs: AUTO_REFRESH_MS,
    // computed
    stats,
    statCards,
    prettyDate,
    catalogEmpty,
    itemCount,
    orderText,
    filteredOrders,
    // evaluadores
    isOut,
    cartGroup,
    // acciones
    togglePick,
    startShift,
    editMenu,
    onTile,
    setQty,
    toggleOut,
    clearCart,
    send,
    completeOrder,
    discardOrder,
    refreshNow: refreshLive,
  };
}

export type ComandasStore = ReturnType<typeof createComandasStore>;

const COMANDAS_KEY: InjectionKey<ComandasStore> = Symbol("comandas");

/** Se llama UNA vez, en la página. Crea el store y lo comparte con las vistas. */
export function provideComandas() {
  const store = createComandasStore();
  provide(COMANDAS_KEY, store);
  return store;
}

/** Lo usan las vistas hijas para leer el mismo store. */
export function useComandas() {
  const store = inject(COMANDAS_KEY);
  if (!store) {
    throw new Error(
      "useComandas() debe usarse dentro de la página que llama a provideComandas().",
    );
  }
  return store;
}
