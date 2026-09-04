import { MODE_LABEL, type OrderMode } from "~/composables/useWhatsappOrder";
import { groupsFromData, type DayDishes } from "~/utils/comandas";

/** Menú del día compartido con clientes (viaja dentro del link). */
export interface SharedMenu {
  g: string[]; // guisos
  s: string[]; // guarniciones
  b: string[]; // bebidas
  o?: string[]; // agotados
  d?: string; // etiqueta de fecha (ej. "Lunes 10 de julio")
  p?: string; // WhatsApp del negocio (solo dígitos)
}

export interface CustomerOrderArgs {
  orderNumber?: number;
  name?: string;
  cart: Record<string, number>;
  mode: OrderMode;
  dishes?: DayDishes;
  taquizaByKind?: {
    tacos?: Record<string, number>;
    quesadillas?: Record<string, number>;
  };
  guisos?: string[];
  sides?: string[];
  bebidas?: string[];
  note?: string;
  phone?: string;
  address?: string;
  fulfillDate?: string;
  pricingSubtotal?: number;
  deliveryFee?: number;
  pricingTotal?: number;
}

export interface CustomerOrderSection {
  orderNumber: number;
  label: string;
  cart: Record<string, number>;
  taquizaByKind?: CustomerOrderArgs["taquizaByKind"];
}

export interface CombinedCustomerOrderArgs {
  name?: string;
  mode: OrderMode;
  dishes: DayDishes;
  sections: CustomerOrderSection[];
  note?: string;
  phone?: string;
  address?: string;
  fulfillDate?: string;
  pricingSubtotal?: number;
  deliveryFee?: number;
  pricingTotal?: number;
}

const MENU_PATH = "/menu";

function money(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

/* ===== base64url seguro con acentos/emoji ===== */
function toB64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(b64: string): string {
  const s = b64.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(s);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function useMenuLink() {
  /** Serializa el menú del día a un string apto para la URL. */
  function encodeMenu(menu: SharedMenu): string {
    return toB64Url(JSON.stringify(menu));
  }

  /** Reconstruye el menú desde el parámetro de la URL. Devuelve null si es inválido. */
  function decodeMenu(raw?: string | null): SharedMenu | null {
    if (!raw) return null;
    try {
      const data = JSON.parse(fromB64Url(raw));
      if (!data || !Array.isArray(data.g)) return null;
      return {
        g: data.g ?? [],
        s: data.s ?? [],
        b: data.b ?? [],
        o: data.o ?? [],
        d: data.d,
        p: data.p,
      };
    } catch {
      return null;
    }
  }

  /** URL absoluta que el negocio comparte con sus clientes. */
  function buildMenuUrl(menu: SharedMenu, origin?: string): string {
    const base = origin ?? (import.meta.client ? window.location.origin : "");
    return `${base}${MENU_PATH}?m=${encodeMenu(menu)}`;
  }

  /** Mensaje que el cliente envía al negocio (sí incluye sus datos de contacto). */
  function formatCustomerOrder({
    orderNumber,
    name,
    cart,
    mode,
    dishes,
    taquizaByKind,
    guisos = [],
    sides = [],
    bebidas = [],
    note,
    phone,
    address,
    fulfillDate,
    pricingSubtotal,
    deliveryFee,
    pricingTotal,
  }: CustomerOrderArgs): string {
    const lines: string[] = [
      `🧾 Nuevo pedido${orderNumber ? ` #${orderNumber}` : ""}`,
    ];
    if (name?.trim()) lines.push(`👤 ${name.trim()}`);
    lines.push(`Tipo: ${MODE_LABEL[mode]}`, "");
    if (fulfillDate) lines.push(`📅 Fecha: ${fulfillDate}`, "");

    if (dishes) {
      let firstSection = true;
      groupsFromData(dishes as Record<string, unknown>).forEach((g) => {
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
            const selected = (dishes[g.key] ?? []).filter((n) => cart[n] > 0);
            if (!selected.length) return;
            if (!firstSection) lines.push("");
            firstSection = false;
            lines.push(`${g.emoji ?? "🍽"} ${g.label}`);
            selected.forEach((n) => lines.push(`• ${cart[n]}× ${n}`));
            return;
          }

          if (!firstSection) lines.push("");
          firstSection = false;
          lines.push(`${g.emoji ?? "🍽"} ${g.label}`);

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

        const selected = (dishes[g.key] ?? []).filter((n) => cart[n] > 0);
        if (!selected.length) return;
        if (!firstSection) lines.push("");
        firstSection = false;
        lines.push(`${g.emoji ?? "🍽"} ${g.label}`);
        selected.forEach((n) => lines.push(`• ${cart[n]}× ${n}`));
      });
    } else {
      const g = guisos.filter((n) => cart[n] > 0);
      const s = sides.filter((n) => cart[n] > 0);
      const b = bebidas.filter((n) => cart[n] > 0);

      if (g.length) {
        lines.push("🍖 Guisos");
        g.forEach((n) => lines.push(`• ${cart[n]}× ${n}`));
      }
      if (s.length) {
        lines.push("", "🥗 Guarniciones");
        s.forEach((n) => lines.push(`• ${cart[n]}× ${n}`));
      }
      if (b.length) {
        lines.push("", "🥤 Bebidas");
        b.forEach((n) => lines.push(`• ${cart[n]}× ${n}`));
      }
    }

    const clean = note?.trim();
    if (clean) lines.push("", `📝 Nota: ${clean}`);

    if (mode === "domicilio" && address?.trim()) {
      lines.push("", `🏠 Dirección: ${address.trim()}`);
    }
    if (phone?.trim()) {
      lines.push(`📱 Tel: ${phone.trim()}`);
    }

    if (pricingTotal !== undefined) {
      lines.push("", "💰 Total");
      if (deliveryFee && deliveryFee > 0) {
        lines.push(`• Alimentos: ${money(pricingSubtotal ?? 0)}`);
        lines.push(`• Envío: ${money(deliveryFee)}`);
      }
      lines.push(`*Total: ${money(pricingTotal)}*`);
    }

    return lines.join("\n");
  }

  function formatCombinedCustomerOrder({
    name,
    mode,
    dishes,
    sections,
    note,
    phone,
    address,
    fulfillDate,
    pricingSubtotal,
    deliveryFee,
    pricingTotal,
  }: CombinedCustomerOrderArgs): string {
    const numbers = sections.map((section) => section.orderNumber);
    const numberLabel =
      numbers.length > 1
        ? ` #${numbers[0]}-${numbers.at(-1)}`
        : ` #${numbers[0]}`;
    const lines = [`🧾 Nuevo pedido${numberLabel}`];

    if (name?.trim()) lines.push(`👤 ${name.trim()}`);
    lines.push(`Tipo: ${MODE_LABEL[mode]}`);
    if (fulfillDate) lines.push(`📅 Fecha: ${fulfillDate}`);

    sections.forEach((section, index) => {
      const sectionLines = formatCustomerOrder({
        cart: section.cart,
        mode,
        dishes,
        taquizaByKind: section.taquizaByKind,
      })
        .split("\n")
        .slice(3);
      lines.push(
        "",
        `${index + 1}. ${section.label} · Comanda #${section.orderNumber}`,
        ...sectionLines,
      );
    });

    const clean = note?.trim();
    if (clean) lines.push("", `📝 Nota: ${clean}`);
    if (mode === "domicilio" && address?.trim()) {
      lines.push("", `🏠 Dirección: ${address.trim()}`);
    }
    if (phone?.trim()) lines.push(`📱 Tel: ${phone.trim()}`);

    if (pricingTotal !== undefined) {
      lines.push("", "💰 Total");
      if (deliveryFee && deliveryFee > 0) {
        lines.push(`• Alimentos: ${money(pricingSubtotal ?? 0)}`);
        lines.push(`• Envío: ${money(deliveryFee)}`);
      }
      lines.push(`*Total: ${money(pricingTotal)}*`);
    }

    return lines.join("\n");
  }

  return {
    encodeMenu,
    decodeMenu,
    buildMenuUrl,
    formatCustomerOrder,
    formatCombinedCustomerOrder,
  };
}
