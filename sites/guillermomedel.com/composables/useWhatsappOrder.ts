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
  guisos: string[];
  sides: string[];
  bebidas: string[];
  note?: string;
  fulfillDate?: string;
}

export interface FormatMenuArgs {
  guisos: string[];
  sides: string[];
  bebidas: string[];
  date?: string;
}

export const MODE_LABEL: Record<OrderMode, string> = {
  llevar: "Para llevar",
  aqui: "Para aquí",
  domicilio: "A domicilio",
};

export function useWhatsappOrder() {
  // === FORMATO DE COCINA (Limpio de datos personales) ===
  function formatOrder({
    orderNumber,
    cart,
    mode,
    guisos,
    sides,
    bebidas,
    note,
    fulfillDate,
  }: FormatOrderArgs): string {
    const lines: string[] = [
      `🍽️ *Orden #${orderNumber}*`,
      `Tipo: ${MODE_LABEL[mode]}`,
      "",
    ];

    const g = guisos.filter((n) => cart[n] > 0);
    const s = sides.filter((n) => cart[n] > 0);
    const b = bebidas.filter((n) => cart[n] > 0);

    if (g.length) {
      lines.push("🍖 *Guisos*");
      g.forEach((n) => lines.push(`• ${cart[n]}× ${n}`));
    }

    if (s.length) {
      lines.push("", "🥗 *Guarniciones*");
      s.forEach((n) => lines.push(`• ${cart[n]}× ${n}`));
    }

    if (b.length) {
      lines.push("", "🥤 *Bebidas*");
      b.forEach((n) => lines.push(`• ${cart[n]}× ${n}`));
    }

    const clean = note?.trim();
    if (clean) {
      lines.push("", `📝 *Nota:* ${clean}`);
    }

    if (fulfillDate) {
      lines.push("", `📅 *Fecha de entrega:* ${fulfillDate}`);
    }

    return lines.join("\n");
  }

  // === FORMATO DE MENÚ DEL DÍA ===
  function formatMenu({
    guisos,
    sides,
    bebidas,
    date,
  }: FormatMenuArgs): string {
    const lines: string[] = ["📋 *Menú del día*"];
    if (date) lines.push(date);
    lines.push("");

    if (guisos.length) {
      lines.push("🍖 *Guisos*");
      guisos.forEach((n) => lines.push(`• ${n}`));
    }

    if (sides.length) {
      lines.push("", "🥗 *Guarniciones*");
      sides.forEach((n) => lines.push(`• ${n}`));
    }

    if (bebidas.length) {
      lines.push("", "🥤 *Bebidas*");
      bebidas.forEach((n) => lines.push(`• ${n}`));
    }

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
      if (customer.name.trim())
        msg += `\n👤 *Cliente:* ${customer.name.trim()}`;
      if (customer.phone.trim())
        msg += `\n📱 *WhatsApp:* ${customer.phone.trim()}`;
      if (customer.address.trim())
        msg += `\n🏠 *Dirección:* ${customer.address.trim()}`;
    }

    return msg;
  }

  function waLink(text: string, phone?: string): string {
    const encoded = encodeURIComponent(text);
    const cleanPhone = phone?.replace(/\D/g, "");

    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}?text=${encoded}`;
    }
    return `https://api.whatsapp.com/send?text=${encoded}`;
  }

  return {
    formatOrder,
    formatMenu,
    formatSoldOut,
    formatReady,
    waLink,
  };
}
