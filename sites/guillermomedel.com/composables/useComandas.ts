import {
  ref,
  reactive,
  computed,
  provide,
  inject,
  onMounted,
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

const STORAGE_KEY = "comandas";

const emptyDishes = (): DayDishes => ({ guisos: [], sides: [], bebidas: [] });

/**
 * Fuente única de verdad de Comandas. El CATÁLOGO (dishes) y la SELECCIÓN
 * (active) viven en PocketBase; las órdenes siguen siendo locales/WhatsApp.
 */
function createComandasStore() {
  const { formatOrder, formatSoldOut, formatReady, formatMenu, waLink } =
    useWhatsappOrder();
  const { fetchCollection, createItem, updateItem } = usePocketBaseCore();

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
  const orders = ref<PlacedOrder[]>([]);
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

    // 1) Abrir WhatsApp con el menú del día PRIMERO, dentro del gesto del click
    //    (si se abre después del await, el bloqueador de pop-ups lo descarta).
    window.open(
      waLink(
        formatMenu({
          guisos: activeDishes.guisos,
          sides: activeDishes.sides,
          bebidas: activeDishes.bebidas,
          date: prettyDate.value,
        }),
      ),
      "_blank",
    );

    // 2) Guardar la selección en el único registro de la colección `menu`.
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
    } catch {
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
    notifyStock(n, nowAvailable); // abre WhatsApp dentro del gesto del usuario

    // Sincroniza los agotados con la BD (lo ve el cliente en vivo).
    if (menuRecordId.value) {
      try {
        await updateItem("menu", menuRecordId.value, {
          sold_out: soldOut.value,
        });
      } catch {
        /* queda en cache local; se reintenta al siguiente cambio */
      }
    }
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

  function send() {
    orders.value.push({
      id: `${counter.value}-${Date.now()}`,
      number: counter.value,
      cart: { ...cart },
      mode: mode.value,
      note: note.value.trim(),
      fulfillDate: fulfillDate.value,
      customer: mode.value === "domicilio" ? { ...customer } : undefined,
      createdAt: Date.now(),
    });

    const textToSend = formatOrder({
      orderNumber: counter.value,
      cart,
      mode: mode.value,
      guisos: today.guisos,
      sides: today.sides,
      bebidas: today.bebidas,
      note: note.value,
      fulfillDate: fulfillDate.value,
    });

    window.open(waLink(textToSend), "_blank");
    advance("Abriendo WhatsApp…");
  }

  function completeOrder(o: PlacedOrder) {
    window.open(waLink(formatReady(o.number, o.mode, o.customer)), "_blank");
    removeOrder(o.id);
    toast(`Orden #${o.number} lista`);
  }

  function discardOrder(o: PlacedOrder) {
    removeOrder(o.id);
    toast(`Orden #${o.number} descartada`);
  }

  function removeOrder(id: string) {
    orders.value = orders.value.filter((x) => x.id !== id);
    persist();
  }

  function notifyStock(name: string, available: boolean) {
    window.open(waLink(formatSoldOut(name, available)), "_blank");
    toast(
      available ? `Avisando: ${name} disponible` : `Avisando: se agotó ${name}`,
    );
  }

  onMounted(() => {
    load(); // órdenes locales
    loadMenu(); // catálogo + selección desde PocketBase
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
