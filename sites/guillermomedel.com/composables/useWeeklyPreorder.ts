import { ref, reactive, computed, onMounted } from "vue";
import {
  todayISO,
  type DayDishes,
  type PlacedOrder,
  type MenuRecord,
} from "~/utils/comandas";
import {
  mondayOf,
  addDays,
  resolveDay,
  type RotationConfig,
  type WeekBlock,
} from "~/utils/rotation";
import type { OrderMode, Customer } from "~/composables/useWhatsappOrder";

/** Un día del preorden: su menú resuelto (por rotación) + el carrito. */
export interface PreorderDay {
  date: string; // ISO YYYY-MM-DD
  label: string; // "Lunes 21 jul"
  blockName: string; // semana que cubre esa fecha
  color: string;
  menu: DayDishes;
  cart: Record<string, number>;
}

type MenuRecordFull = MenuRecord & {
  week_blocks?: WeekBlock[];
  rotation?: string[];
  rotation_anchor?: string;
  overrides?: RotationConfig["overrides"];
};

type PreorderPayload = PlacedOrder & { preorder: true };

// Cuántas semanas ORDENABLES mostrar (se cuentan semanas válidas, no de
// calendario, para que el número sea estable aunque la semana en curso caiga).
const PREORDER_WEEKS = 1;
// Corte para ordenar una semana, en días antes de su lunes:
//   0 = se puede ordenar hasta el lunes de esa semana (después, pasa a la
//       siguiente). 1 = hasta el domingo previo. 2 = sábado previo, etc.
const ORDER_CUTOFF_LEAD = 0;

function dayLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const s = d.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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

  const itemCount = computed(() =>
    days.value.reduce(
      (s, d) => s + Object.values(d.cart).filter((q) => q > 0).length,
      0,
    ),
  );
  const totalUnits = computed(() =>
    days.value.reduce(
      (s, d) => s + Object.values(d.cart).reduce((a, b) => a + b, 0),
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
      const rec = res.items[0] as unknown as MenuRecordFull | undefined;
      if (!rec) return;

      soldOut.value = rec.sold_out ?? [];
      const cfg: RotationConfig = {
        blocks: rec.week_blocks ?? [],
        rotation: rec.rotation ?? [],
        anchor: rec.rotation_anchor ?? "",
        overrides: rec.overrides ?? {},
      };

      // Ventana: avanza semana por semana desde la actual, incluyendo solo las
      // que aún están dentro del corte, hasta juntar PREORDER_WEEKS ordenables.
      const today = todayISO();
      const out: PreorderDay[] = [];
      let mon = mondayOf(today);
      let weeksAdded = 0;
      let guard = 0;

      while (weeksAdded < PREORDER_WEEKS && guard < 14) {
        guard++;
        const cutoff = addDays(mon, -ORDER_CUTOFF_LEAD); // último día para ordenar esa semana
        if (today <= cutoff) {
          let anyDay = false;
          for (let k = 0; k < 5; k++) {
            const date = addDays(mon, k); // Lun..Vie
            if (date < today) continue; // sin días pasados
            const resolved = resolveDay(date, cfg);
            if (!resolved) continue; // cerrado / vacío / fin de semana
            out.push({
              date,
              label: dayLabel(date),
              blockName: resolved.block.name,
              color: resolved.block.color,
              menu: {
                guisos: resolved.menu.guisos ?? [],
                sides: resolved.menu.sides ?? [],
                bebidas: resolved.menu.bebidas ?? [],
              },
              cart: {},
            });
            anyDay = true;
          }
          if (anyDay) weeksAdded++;
        }
        mon = addDays(mon, 7);
      }
      days.value = out;
    } catch {
      /* offline: sin menú disponible */
    } finally {
      loading.value = false;
    }
  }

  // Número más alto del día objetivo (+1) para no chocar con walk-ins.
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
    const wa = openBlankTab();

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
          data: order,
          status: "active",
          number,
          mode: order.mode,
          fulfill_date: day.date,
          biz_date: day.date,
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

    const head = `🗓️ *Preorden semanal*${
      customer.name ? ` — ${customer.name.trim()}` : ""
    }${customer.phone ? ` (${customer.phone.trim()})` : ""}\n\n`;
    const url = waLink(head + texts.join("\n\n———\n\n"));
    if (wa) wa.location.href = url;
    else if (import.meta.client) window.open(url, "_blank");

    if (ok === targets.length) toast("Preorden enviada ✅");
    else if (ok > 0)
      toast(`Enviadas ${ok}/${targets.length} — revisa conexión`);
    else toast("No se guardó en el servidor; se abrió WhatsApp igual");

    days.value.forEach((d) => {
      Object.keys(d.cart).forEach((k) => (d.cart[k] = 0));
    });
    sending.value = false;
  }

  onMounted(load);

  return {
    loading,
    sending,
    days,
    mode,
    customer,
    note,
    toastMsg,
    itemCount,
    totalUnits,
    daysWithItems,
    isOut,
    onTile,
    setQty,
    submit,
  };
}
