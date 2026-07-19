import { ref, reactive, computed, onMounted } from "vue";
import {
  todayISO,
  type DayDishes,
  type PlacedOrder,
  type MenuRecord,
} from "~/utils/comandas";
import type { OrderMode, Customer } from "~/composables/useWhatsappOrder";

/** Un día del preorden: su menú disponible + el carrito del cliente. */
export interface PreorderDay {
  date: string; // ISO YYYY-MM-DD
  label: string; // "Lunes 21 jul"
  menu: DayDishes; // lo disponible ese día
  cart: Record<string, number>;
}

// El menú semanal vive en el registro singleton `menu`, bajo `weekly`,
// indexado por fecha ISO -> platillos disponibles ese día.
type WeeklyMenu = Record<string, DayDishes>;
type MenuRecordWithWeekly = MenuRecord & { weekly?: WeeklyMenu };

// Igual que PlacedOrder pero marcando que fue un preorden (queda dentro de `data`).
type PreorderPayload = PlacedOrder & { preorder: true };

function dayLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const s = d.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Flujo de preórdenes semanales para el cliente.
 *  - Lee `menu.weekly` (fechas de hoy en adelante) para saber qué se puede pedir.
 *  - Al enviar crea UNA comanda por día con carrito, reutilizando el mismo
 *    formato que el flujo normal. `biz_date = fulfill_date` (la fecha del día),
 *    para que el numerado y el reporte EOD queden por día de servicio real.
 */
export function useWeeklyPreorder() {
  const { fetchCollection, createItem } = usePocketBaseCore();
  const { formatOrder, waLink } = useWhatsappOrder();

  const loading = ref(true);
  const sending = ref(false);
  const soldOut = ref<string[]>([]);
  const days = ref<PreorderDay[]>([]);

  const mode = ref<OrderMode>("llevar");
  const customer = reactive<Customer>({ name: "", phone: "", address: "" });
  const note = ref("");
  const toastMsg = ref("");

  const isOut = (n: string) => soldOut.value.includes(n);

  // Cuántos platillos distintos con cantidad > 0 en toda la semana.
  const itemCount = computed(() =>
    days.value.reduce(
      (sum, d) => sum + Object.values(d.cart).filter((q) => q > 0).length,
      0,
    ),
  );

  // Total de unidades (suma de cantidades) en toda la semana.
  const totalUnits = computed(() =>
    days.value.reduce(
      (sum, d) => sum + Object.values(d.cart).reduce((a, b) => a + b, 0),
      0,
    ),
  );

  const daysWithItems = computed(() =>
    days.value.filter((d) => Object.values(d.cart).some((q) => q > 0)),
  );

  function onTile(date: string, name: string) {
    if (isOut(name)) return;
    const day = days.value.find((d) => d.date === date);
    if (!day) return;
    day.cart[name] = (day.cart[name] || 0) + 1;
  }

  function setQty(date: string, name: string, delta: number) {
    const day = days.value.find((d) => d.date === date);
    if (!day) return;
    const q = (day.cart[name] || 0) + delta;
    day.cart[name] = q <= 0 ? 0 : q;
  }

  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  function toast(m: string) {
    toastMsg.value = m;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toastMsg.value = ""), 2000);
  }

  async function load() {
    loading.value = true;
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
      const rec = res.items[0] as unknown as MenuRecordWithWeekly | undefined;
      if (rec) {
        soldOut.value = rec.sold_out ?? [];
        const weekly = rec.weekly ?? {};
        const today = todayISO();
        days.value = Object.keys(weekly)
          .filter((iso) => iso >= today) // solo hoy y futuro
          .sort()
          .map((iso) => ({
            date: iso,
            label: dayLabel(iso),
            menu: {
              guisos: weekly[iso]?.guisos ?? [],
              sides: weekly[iso]?.sides ?? [],
              bebidas: weekly[iso]?.bebidas ?? [],
            },
            cart: {},
          }));
      }
    } catch {
      /* offline: sin menú semanal disponible */
    } finally {
      loading.value = false;
    }
  }

  // Número más alto del día objetivo (cualquier status) + 1, para no chocar
  // con walk-ins que se levanten ese mismo día.
  async function nextNumber(bizDate: string): Promise<number> {
    try {
      const res = await fetchCollection(
        "comandas",
        1,
        1,
        `biz_date = "${bizDate}"`,
        "-number",
        null,
        null,
        true,
      );
      const top = res.items[0] as any;
      return (top ? Number(top.number) || 0 : 0) + 1;
    } catch {
      return 1;
    }
  }

  function openBlankTab(): Window | null {
    return import.meta.client ? window.open("", "_blank") : null;
  }

  async function submit() {
    if (!itemCount.value || sending.value) return;
    if (mode.value === "domicilio" && !customer.name.trim()) {
      toast("Falta el nombre para el domicilio");
      return;
    }

    sending.value = true;
    const wa = openBlankTab(); // dentro del gesto del click (anti pop-up)

    const targets = daysWithItems.value;
    const texts: string[] = [];
    let ok = 0;

    for (const day of targets) {
      const number = await nextNumber(day.date);

      const cart: Record<string, number> = {};
      for (const [k, v] of Object.entries(day.cart)) if (v > 0) cart[k] = v;

      const order: PreorderPayload = {
        id: `${day.date}-${number}-${Date.now()}`,
        number,
        cart,
        mode: mode.value,
        note: note.value.trim(),
        fulfillDate: day.date,
        customer: mode.value === "domicilio" ? { ...customer } : undefined,
        createdAt: Date.now(),
        preorder: true,
      };

      try {
        await createItem("comandas", {
          data: order, // payload completo (incluye preorder:true)
          status: "active",
          number,
          mode: order.mode,
          fulfill_date: day.date,
          biz_date: day.date, // fecha de negocio = el día del pedido
        });
        ok++;
      } catch {
        /* seguimos; se reporta al final */
      }

      texts.push(
        formatOrder({
          orderNumber: number,
          cart,
          mode: mode.value,
          guisos: day.menu.guisos,
          sides: day.menu.sides,
          bebidas: day.menu.bebidas,
          note: note.value.trim(),
          fulfillDate: day.date,
        }),
      );
    }

    // Un solo mensaje de WhatsApp con toda la semana.
    const head = `🗓️ *Preorden semanal*${
      customer.name ? ` — ${customer.name.trim()}` : ""
    }${customer.phone ? ` (${customer.phone.trim()})` : ""}\n\n`;
    const url = waLink(head + texts.join("\n\n———\n\n"));
    if (wa) wa.location.href = url;
    else if (import.meta.client) window.open(url, "_blank");

    if (ok === targets.length) toast("Preorden enviada ✅");
    else if (ok > 0)
      toast(`Enviadas ${ok}/${targets.length} — revisa la conexión`);
    else toast("No se guardó en el servidor; se abrió WhatsApp igual");

    // Limpia carritos (deja cliente/modo por si quiere repetir).
    days.value.forEach((d) => {
      Object.keys(d.cart).forEach((k) => (d.cart[k] = 0));
    });
    sending.value = false;
  }

  onMounted(load);

  return {
    // estado
    loading,
    sending,
    days,
    mode,
    customer,
    note,
    toastMsg,
    // computed
    itemCount,
    totalUnits,
    daysWithItems,
    // acciones
    isOut,
    onTile,
    setQty,
    submit,
  };
}
