import { groups, type DayDishes } from "~/utils/comandas";

export type Cart = Record<string, number>;
export type OrderMode = "llevar" | "aqui" | "domicilio";

export interface Customer {
  name: string;
  phone: string;
  address: string;
}

export interface FormatOrderArgs {
  orderNumber: number;
  cart: Cart;
  mode: OrderMode;
  dishes: DayDishes; // menú del día agrupado (antes: guisos/sides/bebidas)
  taquizaByKind?: {
    tacos?: Record<string, number>;
    quesadillas?: Record<string, number>;
  };
  note?: string;
  fulfillDate?: string;
  fulfillTime?: string;
}

export interface FormatMenuArgs {
  dishes: DayDishes; // selección del turno agrupada (antes: guisos/sides/bebidas)
  date?: string;
}

/* ===== Checklists ===== */
export interface ChecklistLine {
  label: string;
  done: boolean;
  detail?: string; // ej. "3°C ✓" o "-10°C ⚠️ fuera de rango"
  required?: boolean;
}
export interface FormatChecklistArgs {
  title: string;
  date?: string;
  by?: string;
  sections: { label: string; lines: ChecklistLine[] }[];
  doneCount: number;
  totalCount: number;
  complete: boolean;
}

export const MODE_LABEL: Record<OrderMode, string> = {
  llevar: "Para llevar",
  aqui: "Para aquí",
  domicilio: "A domicilio",
};

// Configuración del mensaje de menú (ajusta precios, horario, persona aquí).
const MENU_BROADCAST = {
  greeting:
    "¡Hola! ¡Buen día! ☀️🌊\nAquí Breezy 🦭 compartiéndote el *Menú del Día* de *Breezy Market* 🌵🌮",
  price: {
    one: "$120 MXN",
    two: "$180 MXN",
  },
  cta: "🛒 *¡HAZ TU PEDIDO AQUÍ!*",
  orderUrl: "https://breezy-meals.com/menu",
  cutoff: "⏰ _Ordena antes de las 4:00 PM para recibir tu comida calientita._",
  footer: "🌊 ¡Buen provecho desde San Carlos! 🦭",
};

export function useWhatsappOrder() {
  // === FORMATO DE COCINA (Limpio de datos personales) ===
  function formatOrder({
    orderNumber,
    cart,
    mode,
    dishes,
    taquizaByKind,
    note,
    fulfillDate,
    fulfillTime,
  }: FormatOrderArgs): string {
    const lines: string[] = [
      `🍽️ Orden #${orderNumber}`,
      `Tipo: ${MODE_LABEL[mode]}`,
      "",
    ];

    // Recorre TODAS las categorías; imprime solo las que tienen algo en el carrito.
    let firstSection = true;
    groups.forEach((g) => {
      if (
        "pieceOptions" in g &&
        taquizaByKind &&
        (taquizaByKind.tacos || taquizaByKind.quesadillas)
      ) {
        const tacos = Object.entries(taquizaByKind.tacos ?? {}).filter(
          ([, qty]) => qty > 0,
        );
        const quesadillas = Object.entries(
          taquizaByKind.quesadillas ?? {},
        ).filter(([, qty]) => qty > 0);

        if (!tacos.length && !quesadillas.length) {
          // Fallback para órdenes viejas o sin detalle de taquiza.
          const chosen = (dishes[g.key] ?? []).filter((n) => cart[n] > 0);
          if (!chosen.length) return;
          if (!firstSection) lines.push("");
          firstSection = false;
          lines.push(`${g.emoji ?? "🍽️"} ${g.label}`);
          chosen.forEach((n) => lines.push(`• ${cart[n]}× ${n}`));
          return;
        }

        if (!firstSection) lines.push("");
        firstSection = false;
        lines.push(`${g.emoji ?? "🍽️"} ${g.label}`);

        if (tacos.length) {
          lines.push("Tacos:");
          tacos.forEach(([name, qty]) => lines.push(`  • ${qty}× ${name}`));
        }

        if (tacos.length && quesadillas.length) lines.push("");

        if (quesadillas.length) {
          lines.push("Quesadillas:");
          quesadillas.forEach(([name, qty]) =>
            lines.push(`  • ${qty}× ${name}`),
          );
        }

        return;
      }

      const chosen = (dishes[g.key] ?? []).filter((n) => cart[n] > 0);
      if (!chosen.length) return;
      if (!firstSection) lines.push("");
      firstSection = false;
      lines.push(`${g.emoji ?? "🍽️"} ${g.label}`);
      chosen.forEach((n) => lines.push(`• ${cart[n]}× ${n}`));
    });

    const clean = note?.trim();
    if (clean) {
      lines.push("", `📝 Nota: ${clean}`);
    }

    // Entrega: la hora es lo importante; la fecha solo aparece si se programó.
    const when: string[] = [];
    if (fulfillDate) when.push(`📅 ${fulfillDate}`);
    if (fulfillTime) when.push(`🕒 ${fulfillTime}`);
    if (when.length) {
      lines.push("", `⏱️ Entregar: ${when.join(" · ")}`);
    }

    return lines.join("\n");
  }

  // === FORMATO DE MENÚ DEL DÍA (broadcast a clientes) ===
  function formatMenu({ dishes, date }: FormatMenuArgs): string {
    const lines: string[] = [];

    // Encabezado
    lines.push(MENU_BROADCAST.greeting, "", "━━━━━━━━━━━━━━━━━━━━");

    if (date) {
      lines.push(`📅 *${date}*`, "");
    }

    // Una sección por categoría con platillos (orden = `groups`).
    groups.forEach((g) => {
      const items = dishes[g.key] ?? [];
      if (!items.length) return;
      const emoji = g.emoji ?? "🍽️";
      const heading = g.heading;
      lines.push(`${emoji} *${heading}*`);
      if ("subtitle" in g && g.subtitle) lines.push(g.subtitle);
      items.forEach((n) => lines.push(`   • ${n}`));
      lines.push("");
    });

    // Precios
    lines.push(
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      "💰 *PRECIOS*",
      "",
      "🍽️ 1 guiso + 2 guarniciones + bebida",
      `*${MENU_BROADCAST.price.one}*`,
      "",
      "🍽️🍽️ 2 guisos + 2 guarniciones + bebida",
      `*${MENU_BROADCAST.price.two}*`,
      "",
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      MENU_BROADCAST.cta,
      MENU_BROADCAST.orderUrl,
      "",
      MENU_BROADCAST.cutoff,
      "",
      MENU_BROADCAST.footer,
    );

    return lines.join("\n");
  }

  function formatSoldOut(name: string, available: boolean): string {
    return available
      ? `✅ ${name} vuelve a estar disponible`
      : `🚫 Se agotó: ${name}`;
  }

  // === FORMATO DE REPARTIDOR (Inyecta datos de entrega completos) ===
  function formatReady(
    orderNumber: number,
    mode: OrderMode,
    customer?: Customer,
  ): string {
    let msg = `✅ *Orden #${orderNumber} lista* (${MODE_LABEL[mode]})`;

    if (mode === "domicilio" && customer) {
      msg += `\n\n🚀 *DATOS PARA EL REPARTIDOR:*`;

      if (customer.name.trim()) {
        msg += `\n👤 *Cliente:* ${customer.name.trim()}`;
      }

      if (customer.phone.trim()) {
        msg += `\n📱 *WhatsApp:* ${customer.phone.trim()}`;
      }

      if (customer.address.trim()) {
        msg += `\n🏠 *Dirección:* ${customer.address.trim()}`;
      }
    }

    return msg;
  }

  // === FORMATO DE CHECKLIST (reporte de turno al completar) ===
  function formatChecklist({
    title,
    date,
    by,
    sections,
    doneCount,
    totalCount,
    complete,
  }: FormatChecklistArgs): string {
    const lines: string[] = [];

    lines.push(
      complete ? "✅ *Checklist completada*" : "📋 *Checklist actualizada*",
    );
    lines.push(`*${title}*`);

    const meta: string[] = [];
    if (date) meta.push(`📅 ${date}`);
    if (by) meta.push(`👤 ${by}`);
    if (meta.length) lines.push(meta.join(" · "));

    lines.push(`Progreso: ${doneCount}/${totalCount}`, "");

    for (const s of sections) {
      lines.push(`*${s.label}*`);
      for (const ln of s.lines) {
        const box = ln.done ? "✅" : "⬜";
        let row = `${box} ${ln.label}`;
        if (ln.detail) row += ` (${ln.detail})`;
        if (!ln.done && ln.required) row += " — _obligatorio_";
        lines.push(row);
      }
      lines.push("");
    }

    return lines.join("\n").trimEnd();
  }

  // Aviso corto al reabrir una checklist.
  function formatChecklistReopen(title: string, by?: string): string {
    return `♻️ *Checklist reabierta:* ${title}${by ? `\n👤 ${by}` : ""}`;
  }

  // Aviso de un solo ítem (por si quieres notificar cada cambio).
  function formatChecklistItem(
    title: string,
    itemLabel: string,
    done: boolean,
    detail?: string,
  ): string {
    const box = done ? "✅" : "⬜";
    return `📋 *${title}*\n${box} ${itemLabel}${detail ? ` (${detail})` : ""}`;
  }

  function waLink(text: string, phone?: string): string {
    const encoded = encodeURIComponent(text.normalize("NFC"));
    const cleanPhone = phone?.replace(/\D/g, "");

    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}?text=${encoded}`;
    }

    return `https://api.whatsapp.com/send?text=${encoded}`;
  }

  function isAppleDevice(): boolean {
    if (typeof navigator === "undefined") return false;

    const ua = navigator.userAgent || "";

    if (/iP(hone|ad|od)/.test(ua)) return true;

    if (/Mac/.test(ua) && (navigator.maxTouchPoints || 0) > 1) {
      return true;
    }

    return false;
  }

  function openWhatsApp(text: string, phone?: string): void {
    if (typeof window === "undefined") return;

    const url = waLink(text, phone);

    if (isAppleDevice()) {
      window.location.href = url;
      return;
    }

    const win = window.open(url, "_blank", "noopener");

    if (!win) {
      window.location.href = url;
    }
  }

  return {
    formatOrder,
    formatMenu,
    formatSoldOut,
    formatReady,
    formatChecklist,
    formatChecklistReopen,
    formatChecklistItem,
    waLink,
    isAppleDevice,
    openWhatsApp,
  };
}
