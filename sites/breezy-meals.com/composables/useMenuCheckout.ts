import { ref, type ComputedRef, type Ref } from "vue";
import type { DayDishes, PlacedOrder } from "~/utils/comandas";
import type { OrderMode } from "~/composables/useWhatsappOrder";
import type { TaquizaKind } from "~/composables/useTaquizaOrders";
import type { CustomerOrderArgs } from "~/composables/useMenuLink";

interface Customer {
  name: string;
  phone: string;
  address: string;
}

/**
 * Order-send workflow for the menu page: builds the WhatsApp note, creates
 * the kitchen "comanda" record, opens WhatsApp, and resets the form.
 */
export function useMenuCheckout(params: {
  cart: Record<string, number>;
  mode: Ref<OrderMode>;
  note: Ref<string>;
  customer: Customer;
  memberCode: Ref<string>;
  clearTime: () => void;
  clearTaquizaOrders: () => void;
  hasTaquizaOrder: ComputedRef<boolean>;
  taquizaRules: Record<TaquizaKind, number>;
  taquizaOrderCount: ComputedRef<Record<TaquizaKind, number>>;
  taquizaSelectedByKind: ComputedRef<Record<TaquizaKind, number>>;
  taquizaByKind: ComputedRef<Record<TaquizaKind, Record<string, number>>>;
  pickupTime: ComputedRef<string>;
  selectedDate: Ref<string>;
  active: ComputedRef<DayDishes>;
  record: Ref<{ id: string } | null | undefined>;
  canSend: ComputedRef<boolean>;
  fetchCollection: (...args: any[]) => Promise<{ items: unknown[] }>;
  createItem: (
    collection: string,
    data: Record<string, unknown>,
  ) => Promise<unknown>;
  formatCustomerOrder: (args: CustomerOrderArgs) => string;
  waLink: (text: string, phone?: string) => string;
  isAppleDevice: () => boolean;
  restaurantWhatsapp: string;
  comandasCollection: string;
  comandasField: string;
}) {
  const {
    cart,
    mode,
    note,
    customer,
    memberCode,
    clearTime,
    clearTaquizaOrders,
    hasTaquizaOrder,
    taquizaRules,
    taquizaOrderCount,
    taquizaSelectedByKind,
    taquizaByKind,
    pickupTime,
    selectedDate,
    active,
    record,
    canSend,
    fetchCollection,
    createItem,
    formatCustomerOrder,
    waLink,
    isAppleDevice,
    restaurantWhatsapp,
    comandasCollection,
    comandasField,
  } = params;

  const sendingOrder = ref(false);
  const showThankYou = ref(false);
  // Nombre a mostrar en el modal de agradecimiento; se captura antes de
  // limpiar el formulario (resetOrderForm vacía customer.name).
  const thankYouName = ref("");

  function clearCart() {
    for (const k of Object.keys(cart)) cart[k] = 0;
    clearTaquizaOrders();
  }

  // Deja el formulario listo para un pedido nuevo tras confirmar el envío.
  function resetOrderForm() {
    clearCart();
    mode.value = "llevar";
    note.value = "";
    customer.name = "";
    customer.phone = "";
    customer.address = "";
    memberCode.value = "";
    clearTime();
  }

  function buildNote() {
    const pieces: string[] = [];
    // La hora aplica a "aquí" y "para llevar" (no domicilio).
    if (pickupTime.value && mode.value !== "domicilio") {
      const verb = mode.value === "aqui" ? "Llegada" : "Recoger";
      pieces.push(`${verb} a las ${pickupTime.value}`);
    }
    if (hasTaquizaOrder.value) {
      const summary = [
        taquizaOrderCount.value.tacos > 0
          ? `${taquizaOrderCount.value.tacos} orden(es) de tacos (${taquizaRules.tacos} c/u, ${taquizaSelectedByKind.value.tacos} seleccionadas)`
          : "",
        taquizaOrderCount.value.quesadillas > 0
          ? `${taquizaOrderCount.value.quesadillas} orden(es) de quesadillas (${taquizaRules.quesadillas} c/u, ${taquizaSelectedByKind.value.quesadillas} seleccionadas)`
          : "",
      ]
        .filter(Boolean)
        .join(", ");
      pieces.push(`Taquiza: ${summary}`);
    }
    if (note.value.trim()) pieces.push(note.value.trim());
    return pieces.join(" · ");
  }

  // Número consecutivo para el tablero de cocina: máximo existente + 1. Al no
  // haber columna de status, cualquier registro que quede en la colección es
  // una orden activa.
  async function nextComandaNumber(): Promise<number> {
    try {
      const res = await fetchCollection(
        comandasCollection,
        1,
        300,
        "",
        "-created",
        null,
        null,
        true,
      );
      const max = res.items.reduce((acc, rec) => {
        const n = Number((rec as any)[comandasField]?.number) || 0;
        return Math.max(acc, n);
      }, 0);
      return max + 1;
    } catch {
      return Math.floor(Date.now() / 1000) % 100000;
    }
  }

  // Crea la comanda en la BD para que aparezca en el tablero de cocina. Nunca
  // bloquea el envío por WhatsApp: si falla, el pedido igual se manda.
  async function createComanda(
    number: number,
    finalNote: string,
    snapshotTaquizaByKind: Record<TaquizaKind, Record<string, number>>,
    memberCodeValue: string,
  ) {
    const order: PlacedOrder = {
      id: `${number}-${Date.now()}`,
      number,
      cart: { ...cart },
      mode: mode.value,
      note: finalNote,
      fulfillDate: selectedDate.value,
      fulfillTime: mode.value !== "domicilio" ? pickupTime.value : "",
      customer: { ...customer },
      taquizaOrders: { ...taquizaOrderCount.value },
      taquizaByKind: snapshotTaquizaByKind,
      createdAt: Date.now(),
      memberCode: memberCodeValue || undefined,
    };

    try {
      await createItem(comandasCollection, { [comandasField]: order });
    } catch (e) {
      console.error("No se pudo crear la comanda en cocina", e);
    }
  }

  async function sendOrder() {
    if (!record.value || !canSend.value || sendingOrder.value) return;

    sendingOrder.value = true;

    // Abrir la pestaña DENTRO del gesto del click (síncrono): si se abre
    // después de un `await`, el bloqueador de pop-ups la mata y el fallback
    // termina navegando la propia página (se "cierra" el menú de golpe) y,
    // según el navegador, deja dos intentos de apertura visibles.
    const wa =
      typeof window !== "undefined" && !isAppleDevice()
        ? window.open("", "_blank")
        : null;

    const a = active.value; // menú resuelto (rotación o `active` de hoy)

    // Si hay código de socio, se estampa en la nota Y se guarda como campo
    // estructurado; el staff descuenta la comida al marcar la orden lista.
    const code = memberCode.value.replace(/\s+/g, "").toUpperCase();
    const memberTag = code ? `SOCIO ${code}` : "";

    const snapshotTaquizaByKind = {
      tacos: { ...taquizaByKind.value.tacos },
      quesadillas: { ...taquizaByKind.value.quesadillas },
    };
    const finalNote = [buildNote(), memberTag].filter(Boolean).join(" · ");

    const number = await nextComandaNumber();

    const text = formatCustomerOrder({
      orderNumber: number,
      name: customer.name,
      cart: { ...cart },
      mode: mode.value,
      dishes: a,
      taquizaByKind: snapshotTaquizaByKind,
      note: finalNote,
      phone: customer.phone,
      address: customer.address,
      fulfillDate: selectedDate.value,
    });
    await createComanda(number, finalNote, snapshotTaquizaByKind, code);

    const url = waLink(text, restaurantWhatsapp);
    if (typeof window !== "undefined") {
      if (isAppleDevice()) {
        window.location.href = url;
      } else if (wa) {
        wa.location.href = url;
      } else {
        window.open(url, "_blank", "noopener");
      }
    }

    thankYouName.value = customer.name.trim();
    resetOrderForm();
    showThankYou.value = true;

    // Evita doble-tap y mensajes duplicados en móviles.
    window.setTimeout(() => {
      sendingOrder.value = false;
    }, 1200);
  }

  return {
    sendingOrder,
    showThankYou,
    thankYouName,
    clearCart,
    resetOrderForm,
    sendOrder,
  };
}
