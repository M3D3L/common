// composables/useComandas.ts
import {
  ref,
  reactive,
  computed,
  watch,
  provide,
  inject,
  onMounted,
  onBeforeUnmount,
  type InjectionKey,
} from "vue";
import {
  catalogToDayDishes,
  dayDishesToCatalog,
  todayISO,
  groups,
  emptyDayDishes,
  normalizeMenuCatalog,
  type GroupKey,
  type FilterType,
  type PlacedOrder,
  type DayDishes,
  type MenuRecord,
} from "~/utils/comandas";
import {
  resolveDay,
  type RotationConfig,
  type WeekBlock,
  type WeekOverride,
} from "~/utils/rotation";
import type { OrderMode, Customer } from "~/composables/useWhatsappOrder";
import type { RecordModel } from "pocketbase";

/* ===== Config ===== */
const STORAGE_KEY = "comandas";

// Colección y campo JSON donde vive el payload completo de cada orden.
const COMANDAS_COLLECTION = "comandas";
// ⚠️ Nombre del campo JSON en tu colección `comandas`.
const COMANDAS_FIELD = "data";

// Autoseleccionar el menú del día desde la rotación semanal cuando no hay
// un `active` fresco (de hoy) guardado.
const AUTO_MENU_FROM_ROTATION = true;
// Además fijarlo en la BD (`active` + `active_date`) como menú oficial del día.
const AUTO_PERSIST_ACTIVE = true;

// Objeto vacío con TODAS las categorías (derivado de `groups`).
const emptyDishes = emptyDayDishes;

// Copia plana de un DayDishes reactivo -> objeto normal con todas las llaves.
function cloneDishes(src: DayDishes): DayDishes {
  return Object.fromEntries(
    groups.map((g) => [g.key, [...(src[g.key] ?? [])]]),
  ) as DayDishes;
}

// Sets de selección vacíos, uno por categoría.
function emptyPick(): Record<GroupKey, Set<string>> {
  return Object.fromEntries(
    groups.map((g) => [g.key, new Set<string>()]),
  ) as Record<GroupKey, Set<string>>;
}

// Comparación de menús como conjuntos (ignora el orden).
function sameSet(a: string[] = [], b: string[] = []): boolean {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((x) => s.has(x));
}
function sameMenu(a: DayDishes, b: DayDishes): boolean {
  // Iguales solo si TODAS las categorías coinciden como conjunto.
  return groups.every((g) => sameSet(a[g.key], b[g.key]));
}

type OrderStatus = "active" | "completed" | "cancelled";

// De dónde salió el menú del día que se está mostrando.
type MenuSource = "auto" | "manual" | "none";

// Orden + metadatos de PocketBase (id de registro y status para el soft-delete).
type StoredOrder = PlacedOrder & {
  recordId?: string;
  status?: OrderStatus;
};

// Registro `menu` extendido con la rotación semanal y el sello del día.
type MenuRecordFull = MenuRecord & {
  week_blocks?: WeekBlock[];
  rotation?: string[];
  rotation_anchor?: string;
  overrides?: Record<string, WeekOverride>;
  active_date?: string;
};

/**
 * Fuente única de verdad de Comandas.
 *  - CATÁLOGO + SELECCIÓN del turno + AGOTADOS -> registro único `menu`.
 *  - ÓRDENES -> colección `comandas` (un registro por orden). NO se borran al
 *    completar: se marcan `completed`/`cancelled` y dejan de mostrarse. El
 *    tablero solo carga las `active`. El historial queda para el reporte EOD.
 *  - Se mantiene EN VIVO con realtime (SSE) de PocketBase, sin polling.
 *  - SOCIOS: al enviar una orden con código de socio, se descuenta UNA comida
 *    del mes en curso (única superficie de redención; /socios ya no redime).
 *
 *  NOTA sobre categorías: todo el estado de platillos (catálogo, selección,
 *  menú del día, carrito) se deriva de `groups` en utils/comandas.ts. Para
 *  agregar una categoría nueva NO se toca este archivo: basta con añadirla a
 *  `groups`. Las llaves fijas guisos/sides/bebidas ya no viven aquí.
 */
function createComandasStore() {
  const { formatOrder, formatSoldOut, formatReady, formatMenu, waLink } =
    useWhatsappOrder();
  const { fetchCollection, createItem, updateItem, subscribe, unsubscribe } =
    usePocketBaseCore();

  // Socios: composables de membresía (mismas que usa /socios).
  const members = useMembers();
  const memberships = useMemberships();
  const redemptions = useRedemptions();
  const { user } = usePocketBaseCore();

  /* ===== Estado ===== */
  const view = ref<"setup" | "order" | "orders">("setup");
  const catalog = ref<DayDishes>(emptyDishes());
  const today = reactive<DayDishes>(emptyDishes());
  const soldOut = ref<string[]>([]);
  const counter = ref(1);
  const cart = reactive<Record<string, number>>({});
  const mode = ref<OrderMode>("llevar");
  const note = ref("");
  const fulfillDate = ref<string>(""); // vacío = hoy
  const fulfillTime = ref<string>(""); // vacío = lo antes posible
  const filter = ref<FilterType>("all");
  const customer = reactive<Customer>({ name: "", phone: "", address: "" });
  const orders = ref<StoredOrder[]>([]); // SOLO órdenes activas
  const pick = reactive<Record<GroupKey, Set<string>>>(emptyPick());
  const toastMsg = ref("");
  const taquizaOrders = reactive({ tacos: 0, quesadillas: 0 });
  const taquizaByKind = reactive<
    Record<"tacos" | "quesadillas", Record<string, number>>
  >({
    tacos: {},
    quesadillas: {},
  });

  // Socio (PIN opcional capturado por el staff en la orden).
  const memberCode = ref("");
  // Cache del socio resuelto por código (para prellenar domicilio desde la BD).
  const memberInfo = ref<{
    code: string;
    name: string;
    phone: string;
    address: string;
  } | null>(null);

  // Menú en la BD
  const menuLoading = ref(true);
  const savingMenu = ref(false);
  const menuRecordId = ref<string | null>(null);

  // Origen del menú del día (para el indicador en la pantalla de orden).
  const menuSource = ref<MenuSource>("none");
  const activeBlockName = ref<string>("");

  // true cuando el menú del día se tomó de la rotación (para persistirlo).
  let autoMenuApplied = false;
  // Menú que la rotación propone para HOY (para comparar tras editar).
  let rotationToday: { menu: DayDishes; blockName: string } | null = null;

  const taquizaGroup = groups.find((g) => "pieceOptions" in g) as
    | ((typeof groups)[number] & {
        pieceOptions: { tacos: number; quesadillas: number };
      })
    | undefined;
  const taquizaKinds: Array<"tacos" | "quesadillas"> = ["tacos", "quesadillas"];

  // Estado de conexión / reconciliación
  const isRefreshing = ref(false);
  const live = ref(false); // true cuando las suscripciones están activas
  const sending = ref(false); // evita doble-envío por doble-tap

  /* ===== Helpers de estado (derivados de `groups`) ===== */
  // Reemplaza el contenido de `today` con otro DayDishes (reactivo).
  function setToday(src: Partial<DayDishes>) {
    groups.forEach((g) => {
      today[g.key] = src[g.key] ? [...src[g.key]!] : [];
    });
  }
  // Rehidrata `pick` desde `today`.
  function pickFromToday() {
    groups.forEach((g) => {
      pick[g.key] = new Set(today[g.key]);
    });
  }
  // ¿El menú tiene al menos un platillo en cualquier categoría?
  function menuHasItems(d: Partial<DayDishes>): boolean {
    return groups.some((g) => (d[g.key]?.length ?? 0) > 0);
  }

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
    () => !groups.some((g) => catalog.value[g.key]?.length),
  );

  const itemCount = computed(
    () => Object.values(cart).filter((q) => q > 0).length,
  );

  const taquizaRules = {
    tacos: taquizaGroup?.pieceOptions?.tacos ?? 3,
    quesadillas: taquizaGroup?.pieceOptions?.quesadillas ?? 2,
  };

  const hasTaquizaOrder = computed(
    () => taquizaOrders.tacos + taquizaOrders.quesadillas > 0,
  );

  const taquizaTargetByKind = computed(() => ({
    tacos: taquizaOrders.tacos * taquizaRules.tacos,
    quesadillas: taquizaOrders.quesadillas * taquizaRules.quesadillas,
  }));

  const taquizaQtyByKind = computed(() => {
    const sum = (kind: "tacos" | "quesadillas") =>
      Object.values(taquizaByKind[kind]).reduce((acc, qty) => acc + qty, 0);
    return {
      tacos: sum("tacos"),
      quesadillas: sum("quesadillas"),
    };
  });

  const taquizaRemainingByKind = computed(() => ({
    tacos: Math.max(
      0,
      taquizaTargetByKind.value.tacos - taquizaQtyByKind.value.tacos,
    ),
    quesadillas: Math.max(
      0,
      taquizaTargetByKind.value.quesadillas -
        taquizaQtyByKind.value.quesadillas,
    ),
  }));

  const orderText = computed(() =>
    formatOrder({
      orderNumber: counter.value,
      cart,
      mode: mode.value,
      dishes: cloneDishes(today),
      taquizaByKind: {
        tacos: { ...taquizaByKind.tacos },
        quesadillas: { ...taquizaByKind.quesadillas },
      },
      note: note.value,
      fulfillDate: fulfillDate.value,
      fulfillTime: fulfillTime.value,
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

  function isTaquizaItem(name: string): boolean {
    if (!taquizaGroup) return false;
    return today[taquizaGroup.key]?.includes(name) ?? false;
  }

  function syncTaquizaCart() {
    if (!taquizaGroup) return;
    today[taquizaGroup.key].forEach((name) => {
      cart[name] =
        (taquizaByKind.tacos[name] ?? 0) +
        (taquizaByKind.quesadillas[name] ?? 0);
    });
  }

  function canAddTaquizaFill(kind: "tacos" | "quesadillas") {
    return taquizaOrders[kind] > 0 && taquizaRemainingByKind.value[kind] > 0;
  }

  function taquizaItemQtyByKind(kind: "tacos" | "quesadillas", name: string) {
    return taquizaByKind[kind][name] ?? 0;
  }

  function setTaquizaFillQty(
    kind: "tacos" | "quesadillas",
    name: string,
    delta: number,
  ) {
    if (delta > 0) {
      if (!canAddTaquizaFill(kind)) return;
      taquizaByKind[kind][name] = (taquizaByKind[kind][name] ?? 0) + 1;
    } else {
      const cur = taquizaByKind[kind][name] ?? 0;
      if (cur <= 0) return;
      taquizaByKind[kind][name] = cur - 1;
    }
    syncTaquizaCart();
  }

  function setTaquizaOrderQty(kind: "tacos" | "quesadillas", delta: number) {
    const next = (taquizaOrders[kind] ?? 0) + delta;
    taquizaOrders[kind] = next <= 0 ? 0 : next;
    if (taquizaOrders[kind] <= 0) {
      taquizaByKind[kind] = {};
    }
    syncTaquizaCart();
  }

  watch(
    taquizaTargetByKind,
    (target) => {
      if (!taquizaGroup) return;

      const trimKind = (kind: "tacos" | "quesadillas") => {
        let over = taquizaQtyByKind.value[kind] - target[kind];
        if (over <= 0) return;
        today[taquizaGroup.key].forEach((name) => {
          if (over <= 0) return;
          const q = taquizaByKind[kind][name] ?? 0;
          if (!q) return;
          const drop = Math.min(q, over);
          taquizaByKind[kind][name] = q - drop;
          over -= drop;
        });
      };

      trimKind("tacos");
      trimKind("quesadillas");
      syncTaquizaCart();
    },
    { deep: true },
  );

  /* ===== Socio: prellenar domicilio desde la BD =====
   * Perezoso: solo se busca al socio cuando el modo es "domicilio" y hay un
   * código. Se llenan SOLO los campos vacíos (nunca pisa lo que el staff
   * escribió). Se re-busca si cambia el código.
   */
  async function loadMemberForOrder() {
    const code = memberCode.value.replace(/\s+/g, "").toUpperCase();
    if (!code) {
      memberInfo.value = null;
      return;
    }
    // ya cacheado para este código
    if (memberInfo.value?.code === code) return;
    try {
      const m = await members.getMemberByCode(code);
      memberInfo.value = m
        ? {
            code,
            name: m.name ?? "",
            phone: m.phone ?? "",
            address: m.address ?? "",
          }
        : null;
    } catch {
      memberInfo.value = null;
    }
  }

  function fillDomicilioFromMember() {
    const info = memberInfo.value;
    if (!info) return;
    // solo campos vacíos
    if (!customer.name.trim() && info.name) customer.name = info.name;
    if (!customer.phone.trim() && info.phone) customer.phone = info.phone;
    if (!customer.address.trim() && info.address)
      customer.address = info.address;
  }

  // Disparador perezoso: al mostrar domicilio con un código, buscar y llenar.
  watch(
    () => [mode.value, memberCode.value] as const,
    async ([m]) => {
      if (m !== "domicilio") return;
      await loadMemberForOrder();
      fillDomicilioFromMember();
    },
  );

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
    autoMenuApplied = false;
    const rec = r as MenuRecordFull;
    menuRecordId.value = r.id;
    catalog.value = catalogToDayDishes(
      normalizeMenuCatalog(r.dishes as Partial<Record<GroupKey, unknown>>),
    );
    soldOut.value = r.sold_out ?? [];

    // Resolver la rotación para HOY (independiente de `active`).
    const cfg: RotationConfig = {
      blocks: rec.week_blocks ?? [],
      rotation: rec.rotation ?? [],
      anchor: rec.rotation_anchor ?? "",
      overrides: rec.overrides ?? {},
    };
    const resolved = AUTO_MENU_FROM_ROTATION
      ? resolveDay(todayISO(), cfg)
      : null;
    rotationToday = resolved
      ? { menu: resolved.menu, blockName: resolved.block.name }
      : null;

    // ¿Hay un menú del día ya fijado HOY?
    const a = r.active ?? emptyDishes();
    const activeFresh = rec.active_date === todayISO() && menuHasItems(a);

    if (activeFresh) {
      setToday(a);
      // Coincide con la rotación -> automático; si no, alguien lo personalizó.
      if (resolved && sameMenu(a, resolved.menu)) {
        menuSource.value = "auto";
        activeBlockName.value = resolved.block.name;
      } else {
        menuSource.value = "manual";
        activeBlockName.value = "";
      }
    } else if (resolved) {
      // Tómalo de la rotación semanal (bloque que cubre hoy).
      setToday(resolved.menu);
      autoMenuApplied = true;
      menuSource.value = "auto";
      activeBlockName.value = resolved.block.name;
    } else {
      setToday({});
      menuSource.value = "none";
      activeBlockName.value = "";
    }

    pickFromToday();

    view.value = menuHasItems(today) ? "order" : "setup";
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
      if (rec) {
        applyRecord(rec);
        // Si el menú del día se tomó de la rotación, déjalo fijo en la BD.
        if (autoMenuApplied && AUTO_PERSIST_ACTIVE && menuRecordId.value) {
          try {
            await updateItem("menu", menuRecordId.value, {
              active: cloneDishes(today),
              active_date: todayISO(),
            });
          } catch {
            /* queda en memoria; se fijará al iniciar turno */
          }
        }
      } else {
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
        today: cloneDishes(today),
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
    const activeDishes: DayDishes = Object.fromEntries(
      groups.map((g) => [g.key, [...pick[g.key]]]),
    ) as DayDishes;
    setToday(activeDishes);
    soldOut.value = soldOut.value.filter((n) =>
      groups.some((g) => pick[g.key].has(n)),
    );

    // El indicador refleja si lo que se inicia coincide con la rotación de hoy.
    if (rotationToday && sameMenu(activeDishes, rotationToday.menu)) {
      menuSource.value = "auto";
      activeBlockName.value = rotationToday.blockName;
    } else {
      menuSource.value = "manual";
      activeBlockName.value = "";
    }

    clearCart();
    view.value = "order";
    persist();

    const text = formatMenu({
      dishes: activeDishes,
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
          active_date: todayISO(),
        });
      } else {
        const created = await createItem("menu", {
          dishes: dayDishesToCatalog(catalog.value),
          active: activeDishes,
          sold_out: soldOut.value,
          active_date: todayISO(),
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
    pickFromToday();
    view.value = "setup";
  }

  /* ===== Flujo de órdenes ===== */
  function onTile(n: string) {
    if (!isOut(n)) addToCart(n);
  }

  function addToCart(n: string) {
    if (isTaquizaItem(n)) {
      // En /orders, taquizas se selecciona desde sus paneles dedicados.
      return;
    }
    cart[n] = (cart[n] || 0) + 1;
  }

  function setQty(n: string, d: number) {
    if (isTaquizaItem(n)) {
      if (d > 0) {
        if (canAddTaquizaFill("tacos")) {
          setTaquizaFillQty("tacos", n, 1);
          return;
        }
        if (canAddTaquizaFill("quesadillas")) {
          setTaquizaFillQty("quesadillas", n, 1);
        }
        return;
      }

      if ((taquizaByKind.quesadillas[n] ?? 0) > 0) {
        setTaquizaFillQty("quesadillas", n, -1);
        return;
      }
      if ((taquizaByKind.tacos[n] ?? 0) > 0) {
        setTaquizaFillQty("tacos", n, -1);
      }
      return;
    }

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
      if (taquizaByKind.tacos[n]) taquizaByKind.tacos[n] = 0;
      if (taquizaByKind.quesadillas[n]) taquizaByKind.quesadillas[n] = 0;
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
    fulfillDate.value = "";
    fulfillTime.value = "";
    customer.name = "";
    customer.phone = "";
    customer.address = "";
    memberCode.value = "";
    memberInfo.value = null;
    taquizaByKind.tacos = {};
    taquizaByKind.quesadillas = {};
    taquizaOrders.tacos = 0;
    taquizaOrders.quesadillas = 0;
  }

  /**
   * Enviar orden.
   *  1) Si hay código de socio, intentar redimir UNA comida del mes en curso.
   *     - Éxito -> se etiqueta con "SOCIO XXXX · N restantes" y baja el crédito.
   *     - Sin crédito / vencida / no encontrado -> la orden IGUAL se envía,
   *       etiquetada con el motivo, y se avisa al staff para cobrar normal.
   *     Un problema de crédito NUNCA bloquea la orden (la cocina debe recibirla).
   *  2) Guardar la comanda (payload + columnas denormalizadas + member_code).
   *  3) WhatsApp.
   */
  async function send() {
    if (!itemCount.value || sending.value) return;
    sending.value = true;

    // Congela el estado de la orden al momento del click para evitar
    // desfaces si hay trabajo async (socio/BD) mientras el usuario toca UI.
    const snapshot = {
      cart: { ...cart },
      mode: mode.value,
      note: note.value.trim(),
      fulfillDate: fulfillDate.value,
      fulfillTime: fulfillTime.value,
      customer: mode.value === "domicilio" ? { ...customer } : undefined,
      taquizaOrders: {
        tacos: taquizaOrders.tacos,
        quesadillas: taquizaOrders.quesadillas,
      },
      taquizaQtyByKind: {
        tacos: taquizaQtyByKind.value.tacos,
        quesadillas: taquizaQtyByKind.value.quesadillas,
      },
      taquizaByKind: {
        tacos: { ...taquizaByKind.tacos },
        quesadillas: { ...taquizaByKind.quesadillas },
      },
    };

    // --- Socio: intentar redimir una comida si se capturó un PIN ---
    const code = memberCode.value.replace(/\s+/g, "").toUpperCase();
    let memberTag = "";

    if (code) {
      try {
        const member = await members.getMemberByCode(code);
        if (!member) {
          memberTag = `SOCIO ${code} · NO ENCONTRADO`;
          toast(`Código ${code}: socio no encontrado`);
        } else {
          const ms = await memberships.getActiveMembership(member.id);
          if (ms && memberships.isUsable(ms)) {
            const { remaining } = await redemptions.redeem(ms, {
              staffId: user?.id,
            });
            memberTag = `SOCIO ${code} · ${remaining} restantes`;
            toast(
              `Socio ${member.name}: comida registrada (${remaining} restantes)`,
            );
          } else {
            const why = !ms
              ? "sin membresía"
              : memberships.isExpired(ms)
                ? "vencida"
                : "sin crédito";
            memberTag = `SOCIO ${code} · ${why.toUpperCase()}`;
            toast(`Socio ${member.name}: ${why} — cobra normal`);
          }
        }
      } catch (e: any) {
        // Nunca bloquear la orden por un problema de crédito.
        console.error("socio redeem failed:", e);
        memberTag = `SOCIO ${code} · ERROR`;
        toast("No se pudo verificar al socio; la orden sigue");
      }
    }

    // --- Orden (igual que antes, + nota con etiqueta de socio) ---
    const noteWithTag = [snapshot.note, memberTag].filter(Boolean).join(" · ");

    const hasTaquizaSnapshotOrder =
      snapshot.taquizaOrders.tacos + snapshot.taquizaOrders.quesadillas > 0;

    const taquizaMeta = hasTaquizaSnapshotOrder
      ? [
          snapshot.taquizaOrders.tacos > 0
            ? `${snapshot.taquizaOrders.tacos} orden(es) tacos (${taquizaRules.tacos} c/u, ${snapshot.taquizaQtyByKind.tacos} sel.)`
            : "",
          snapshot.taquizaOrders.quesadillas > 0
            ? `${snapshot.taquizaOrders.quesadillas} orden(es) quesadillas (${taquizaRules.quesadillas} c/u, ${snapshot.taquizaQtyByKind.quesadillas} sel.)`
            : "",
        ]
          .filter(Boolean)
          .join(", ")
      : "";

    const finalNote = [
      noteWithTag,
      taquizaMeta ? `Taquiza: ${taquizaMeta}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    const order: StoredOrder = {
      id: `${counter.value}-${Date.now()}`,
      number: counter.value,
      cart: snapshot.cart,
      mode: snapshot.mode,
      note: finalNote,
      fulfillDate: snapshot.fulfillDate,
      fulfillTime: snapshot.fulfillTime,
      customer: snapshot.customer,
      createdAt: Date.now(),
      status: "active",
    };

    const text = formatOrder({
      orderNumber: order.number,
      cart: order.cart,
      mode: order.mode,
      dishes: cloneDishes(today),
      taquizaByKind: snapshot.taquizaByKind,
      note: order.note,
      fulfillDate: order.fulfillDate,
      fulfillTime: order.fulfillTime,
    });

    const wa = openBlankTab();

    // 1) Primero la BD. Payload completo en `data` + columnas denormalizadas
    //    para el tablero (status) y el reporte EOD. `member_code` para historial.
    try {
      const rec = await createItem(COMANDAS_COLLECTION, {
        [COMANDAS_FIELD]: order,
        status: "active",
        number: order.number,
        mode: order.mode,
        fulfill_date: order.fulfillDate || todayISO(), // columna siempre con fecha usable
        fulfill_time: order.fulfillTime || "",
        biz_date: todayISO(),
        member_code: code || "", // requiere columna `member_code` (text) en `comandas`
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

    // limpiar el PIN para la siguiente orden
    memberCode.value = "";
    memberInfo.value = null;
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
    await loadMenu(); // catálogo + selección (auto desde rotación) + menuRecordId
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
    fulfillTime,
    memberCode,
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
    menuSource,
    activeBlockName,
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
    taquizaGroup,
    taquizaKinds,
    taquizaRules,
    taquizaOrders,
    taquizaTargetByKind,
    taquizaQtyByKind,
    hasTaquizaOrder,
    canAddTaquizaFill,
    taquizaItemQtyByKind,
    setTaquizaFillQty,
    setTaquizaOrderQty,
    isTaquizaItem,
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
