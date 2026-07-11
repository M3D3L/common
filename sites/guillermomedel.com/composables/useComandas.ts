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
  MENU,
  todayISO,
  type GroupKey,
  type FilterType,
  type PlacedOrder,
} from "~/utils/comandas";
import type { OrderMode, Customer } from "~/composables/useWhatsappOrder";

const STORAGE_KEY = "comandas";

/**
 * Fuente única de verdad de Comandas: estado, computeds, acciones y
 * persistencia. Se crea una sola vez en la página (provideComandas) y las
 * vistas hijas la consumen con useComandas().
 */
function createComandasStore() {
  const { formatOrder, formatSoldOut, formatReady, formatMenu, waLink } =
    useWhatsappOrder();

  /* ===== Estado ===== */
  const view = ref<"setup" | "order" | "orders">("setup");
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

  const itemCount = computed(
    () => Object.values(cart).filter((q) => q > 0).length,
  );

  // El texto de la previsualización va limpio (solo cocina).
  const orderText = computed(() =>
    formatOrder({
      orderNumber: counter.value,
      cart,
      mode: mode.value,
      guisos: MENU.guisos,
      sides: MENU.sides,
      bebidas: MENU.bebidas,
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
  const cartGroup = (k: GroupKey) => MENU[k].filter((n) => cart[n] > 0);

  /* ===== Persistencia ===== */
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
      today.guisos = s.guisos || [];
      today.sides = s.sides || [];
      today.bebidas = s.bebidas || [];
      soldOut.value = s.soldOut || [];
      counter.value = s.counter || 1;
      orders.value = s.orders || [];
      if (today.guisos.length) view.value = "order";
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

  function startShift() {
    const menuGuisos = [...pick.guisos];
    const menuSides = [...pick.sides];
    const menuBebidas = [...pick.bebidas];

    // Abrimos WhatsApp primero, mientras seguimos dentro del gesto del usuario
    // (evita que el bloqueador de pop-ups descarte la pestaña).
    window.open(
      waLink(
        formatMenu({
          guisos: menuGuisos,
          sides: menuSides,
          bebidas: menuBebidas,
          date: prettyDate.value,
        }),
      ),
      "_blank",
    );

    today.guisos = menuGuisos;
    today.sides = menuSides;
    today.bebidas = menuBebidas;
    soldOut.value = soldOut.value.filter(
      (n) => pick.guisos.has(n) || pick.sides.has(n) || pick.bebidas.has(n),
    );
    clearCart();
    view.value = "order";
    persist();

    toast("Enviando menú del día…");
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

  function toggleOut(n: string) {
    const i = soldOut.value.indexOf(n);
    const nowAvailable = i >= 0;
    if (i >= 0) soldOut.value.splice(i, 1);
    else {
      soldOut.value.push(n);
      cart[n] = 0;
    }
    persist();
    notifyStock(n, nowAvailable);
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
    // Guardamos cliente y dirección completos de forma interna.
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

    // Texto para WhatsApp COCINA (sin datos del cliente).
    const textToSend = formatOrder({
      orderNumber: counter.value,
      cart,
      mode: mode.value,
      guisos: MENU.guisos,
      sides: MENU.sides,
      bebidas: MENU.bebidas,
      note: note.value,
      fulfillDate: fulfillDate.value,
    });

    window.open(waLink(textToSend), "_blank");
    advance("Abriendo WhatsApp…");
  }

  function completeOrder(o: PlacedOrder) {
    // El repartidor sí se lleva los datos de envío guardados.
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

  onMounted(load);

  return {
    // estado
    view,
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
    minDate: todayISO(),
    // computed
    stats,
    statCards,
    prettyDate,
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
