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
import type { RecordModel } from "pocketbase";

/* ===== Config ===== */
const STORAGE_KEY = "comandas";

// Colección y campo JSON donde vive el payload completo de cada orden.
const COMANDAS_COLLECTION = "comandas";
// ⚠️ Nombre del campo JSON en tu colección `comandas`.
const COMANDAS_FIELD = "data";

const emptyDishes = (): DayDishes => ({ guisos: [], sides: [], bebidas: [] });

type OrderStatus = "active" | "completed" | "cancelled";

// Orden + metadatos de PocketBase (id de registro y status para el soft-delete).
type StoredOrder = PlacedOrder & {
  recordId?: string;
  status?: OrderStatus;
};

/**
 * Fuente única de verdad de Comandas.
 *  - CATÁLOGO + SELECCIÓN del turno + AGOTADOS -> registro único `menu`.
 *  - ÓRDENES -> colección `comandas` (un registro por orden). NO se borran al
 *    completar: se marcan `completed`/`cancelled` y dejan de mostrarse. El
 *    tablero solo carga las `active`. El historial queda para el reporte EOD.
 *  - Se mantiene EN VIVO con realtime (SSE) de PocketBase, sin polling.
 */
function createComandasStore() {
  const { formatOrder, formatSoldOut, formatReady, formatMenu, waLink } =
    useWhatsappOrder();
  const { fetchCollection, createItem, updateItem, subscribe, unsubscribe } =
    usePocketBaseCore();

  /* ===== Estado ===== */
  const view = ref<"setup" | "order" | "orders">("setup");
  const catalog = ref<DayDishes>(emptyDishes());
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
  const orders = ref<StoredOrder[]>([]); // SOLO órdenes activas
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

  // Estado de conexión / reconciliación
  const isRefreshing = ref(false);
  const live = ref(false); // true cuando las suscripciones están activas
  const sending = ref(false); // evita doble-envío por doble-tap

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

  /* ===== WhatsApp (primero BD, luego WhatsApp) =====
   * Pestaña en blanco abierta DENTRO del gesto del click; se le asigna la URL
   * cuando la BD resuelve, para que el bloqueador de pop-ups no la mate.
   */
  function openBlankTab(): Window | null {
    return import.meta.client ? window.open("", "_blank") : null;
  }
  function sendToTab(tab: Window | null, text: string) {
    const url = waLink(text);
    if (tab) tab.location.href = url;
    else if (import.meta.client) window.open(url, "_blank");
  }

  /* ===== Helpers de órdenes (en memoria) ===== */
  function recordToOrder(rec: RecordModel): StoredOrder {
    return {
      ...((rec as any)[COMANDAS_FIELD] as PlacedOrder),
      recordId: rec.id,
      status: (rec as any).status as OrderStatus,
    };
  }

  function upsertOrder(o: StoredOrder) {
    const i = o.recordId
      ? orders.value.findIndex((x) => x.recordId === o.recordId)
      : orders.value.findIndex((x) => x.id === o.id);
    if (i >= 0) orders.value.splice(i, 1, o);
    else orders.value.push(o);
    // Mantén el contador por delante de lo que llega de otros dispositivos.
    if (o.number) counter.value = Math.max(counter.value, o.number + 1);
  }

  function removeByRecordId(recordId: string) {
    if (!recordId) return;
    orders.value = orders.value.filter((x) => x.recordId !== recordId);
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
      // Offline: se conserva lo que haya quedado en cache local.
    } finally {
      menuLoading.value = false;
    }
  }

  // Solo los agotados (para reconciliar; el resto llega por realtime).
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

  /* ===== PocketBase: órdenes ===== */
  // Tablero: solo órdenes activas (sin importar la fecha de entrega).
  async function loadActiveOrders() {
    try {
      const res = await fetchCollection(
        COMANDAS_COLLECTION,
        1,
        300,
        'status = "active"',
        "created",
        null,
        null,
        true,
      );
      const remote = res.items.map(recordToOrder);
      // Conserva órdenes creadas sin red (aún sin recordId).
      const unsynced = orders.value.filter((o) => !o.recordId);
      orders.value = [...remote, ...unsynced];
      persist();
    } catch {
      // Sin red: se conserva el cache local.
    }
  }

  // Semilla del contador: número más alto del DÍA (cualquier status), para no
  // reciclar números ya usados por órdenes que ya se completaron.
  async function seedCounter() {
    try {
      const res = await fetchCollection(
        COMANDAS_COLLECTION,
        1,
        1,
        `biz_date = "${todayISO()}"`,
        "-number",
        null,
        null,
        true,
      );
      const top = res.items[0] as any;
      const n = top ? Number(top.number) || 0 : 0;
      counter.value = Math.max(counter.value, n + 1);
    } catch {
      /* offline: se usa el contador local */
    }
  }

  /* ===== Realtime (sustituye al polling) ===== */
  let unsubOrders: (() => void) | null = null;
  let unsubMenu: (() => void) | null = null;

  function onComandaEvent(e: { action: string; record: RecordModel }) {
    const rec = e.record;
    const status = (rec as any).status as OrderStatus | undefined;

    if (e.action === "delete" || (status && status !== "active")) {
      removeByRecordId(rec.id);
    } else {
      upsertOrder(recordToOrder(rec));
    }
    persist();
  }

  function onMenuEvent(e: { action: string; record: RecordModel }) {
    if (e.action === "delete") return;
    if (!menuRecordId.value) menuRecordId.value = e.record.id;
    // Solo se refleja "agotados" en vivo; NO se reescribe la vista/selección
    // para no interrumpir a quien esté armando el menú o una orden.
    soldOut.value = ((e.record as any).sold_out as string[]) ?? [];
  }

  async function startLive() {
    if (!import.meta.client) return;
    try {
      unsubOrders = await subscribe(COMANDAS_COLLECTION, onComandaEvent, "*");
      unsubMenu = await subscribe("menu", onMenuEvent, "*");
      live.value = true;
    } catch {
      live.value = false;
    }
  }

  async function stopLive() {
    try {
      if (unsubOrders) unsubOrders();
      else await unsubscribe(COMANDAS_COLLECTION);
    } catch {
      /* noop */
    }
    try {
      if (unsubMenu) unsubMenu();
      else await unsubscribe("menu");
    } catch {
      /* noop */
    }
    unsubOrders = null;
    unsubMenu = null;
    live.value = false;
  }

  // Reconciliación puntual (al recuperar foco / reconexión). No es polling:
  // se dispara por evento, no por temporizador.
  async function resync() {
    if (isRefreshing.value) return;
    isRefreshing.value = true;
    try {
      await Promise.all([loadActiveOrders(), refreshSoldOut(), seedCounter()]);
    } finally {
      isRefreshing.value = false;
    }
  }

  function onVisibility() {
    if (import.meta.client && !document.hidden) resync();
  }

  /* ===== Persistencia local (cache offline de las activas) ===== */
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
    const wa = openBlankTab();

    savingMenu.value = true;
    toast("Guardando menú…");
    try {
      if (menuRecordId.value) {
        await updateItem("menu", menuRecordId.value, {
          active: activeDishes,
          sold_out: soldOut.value,
        });
      } else {
        const created = await createItem("menu", {
          dishes: catalog.value,
          active: activeDishes,
          sold_out: soldOut.value,
        });
        menuRecordId.value = (created as unknown as MenuRecord).id;
      }
      toast("Menú guardado ✅");
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
    const wa = openBlankTab();

    if (menuRecordId.value) {
      try {
        await updateItem("menu", menuRecordId.value, {
          sold_out: soldOut.value,
        });
      } catch {
        /* queda en cache local; se reintenta al siguiente cambio */
      }
    }
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

  async function send() {
    if (!itemCount.value || sending.value) return;
    sending.value = true;

    const order: StoredOrder = {
      id: `${counter.value}-${Date.now()}`,
      number: counter.value,
      cart: { ...cart },
      mode: mode.value,
      note: note.value.trim(),
      fulfillDate: fulfillDate.value,
      customer: mode.value === "domicilio" ? { ...customer } : undefined,
      createdAt: Date.now(),
      status: "active",
    };

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

    const wa = openBlankTab();

    // 1) Primero la BD. Payload completo en `data` + columnas denormalizadas
    //    para el tablero (status) y el reporte EOD.
    try {
      const rec = await createItem(COMANDAS_COLLECTION, {
        [COMANDAS_FIELD]: order,
        status: "active",
        number: order.number,
        mode: order.mode,
        fulfill_date: order.fulfillDate,
        biz_date: todayISO(),
      });
      order.recordId = rec.id;
    } catch {
      toast("No se guardó en el servidor; se envía igual");
    }

    // 2) Reflejar local (realtime hará el eco; upsert por recordId lo dedup.).
    upsertOrder(order);

    // 3) Luego WhatsApp.
    sendToTab(wa, text);
    advanceCounter("Abriendo WhatsApp…");
    sending.value = false;
  }

  // Igual que antes pero SIN borrar órdenes: solo avanza el contador y limpia.
  function advanceCounter(msg: string) {
    counter.value += 1;
    clearCart();
    persist();
    toast(msg);
  }

  async function completeOrder(o: StoredOrder) {
    const text = formatReady(o.number, o.mode, o.customer);
    const wa = openBlankTab();

    // 1) Primero la BD: soft-delete (queda para el reporte EOD).
    try {
      if (o.recordId) {
        await updateItem(COMANDAS_COLLECTION, o.recordId, {
          status: "completed",
        });
      }
    } catch (e) {
      console.error("No se pudo marcar completada en el servidor", e);
    }
    // 2) Fuera del tablero (localmente; realtime lo confirmará).
    orders.value = orders.value.filter((x) => x.id !== o.id);
    persist();
    // 3) WhatsApp.
    sendToTab(wa, text);
    toast(`Orden #${o.number} lista`);
  }

  async function discardOrder(o: StoredOrder) {
    try {
      if (o.recordId) {
        await updateItem(COMANDAS_COLLECTION, o.recordId, {
          status: "cancelled",
        });
      }
    } catch (e) {
      console.error("No se pudo cancelar en el servidor", e);
    }
    orders.value = orders.value.filter((x) => x.id !== o.id);
    persist();
    toast(`Orden #${o.number} descartada`);
  }

  // Reabrir una orden completada/cancelada por error -> vuelve a `active`.
  async function reopenOrder(recordId: string) {
    try {
      const rec = await updateItem(COMANDAS_COLLECTION, recordId, {
        status: "active",
      });
      upsertOrder(recordToOrder(rec));
      persist();
      toast("Orden reabierta");
    } catch (e) {
      console.error("No se pudo reabrir", e);
      toast("No se pudo reabrir");
    }
  }

  onMounted(async () => {
    load(); // cache local (pintado instantáneo)
    await loadMenu(); // catálogo + selección + menuRecordId
    await Promise.all([loadActiveOrders(), seedCounter()]);
    await startLive(); // realtime en vez de polling
    document.addEventListener("visibilitychange", onVisibility);
  });

  onBeforeUnmount(() => {
    if (import.meta.client) {
      document.removeEventListener("visibilitychange", onVisibility);
    }
    stopLive();
  });

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
    live,
    sending,
    minDate: todayISO(),
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
    reopenOrder,
    refreshNow: resync,
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
