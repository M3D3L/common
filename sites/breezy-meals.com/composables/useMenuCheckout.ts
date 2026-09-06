import { ref, type ComputedRef, type Ref } from "vue";
import type { DayDishes, PlacedOrder } from "~/utils/comandas";
import type { OrderMode } from "~/composables/useWhatsappOrder";
import type { TaquizaKind, TaquizaOrder } from "~/composables/useTaquizaOrders";
import type {
  CombinedCustomerOrderArgs,
  CustomerOrderArgs,
} from "~/composables/useMenuLink";
import type { PricingLine } from "~/utils/menuPricing";
import { comandaCreatePayload } from "~/lib/comanda-record";
import {
  buildComandaDrafts,
  promoRedeemsMembershipMeal,
  type ComandaDraft,
} from "~/utils/comandaDrafts";

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
  resetCustomerAfterSend: () => boolean;
  clearTime: () => void;
  clearTaquizaOrders: () => void;
  hasTaquizaOrder: ComputedRef<boolean>;
  taquizaRules: Record<TaquizaKind, number>;
  taquizaOrderCount: ComputedRef<Record<TaquizaKind, number>>;
  taquizaSelectedByKind: ComputedRef<Record<TaquizaKind, number>>;
  taquizaByKind: ComputedRef<Record<TaquizaKind, Record<string, number>>>;
  taquizaOrders: Ref<TaquizaOrder[]>;
  pricingLines: ComputedRef<PricingLine[]>;
  pricingSubtotal: ComputedRef<number>;
  deliveryFee: Ref<number>;
  appliedDeliveryFee: ComputedRef<number>;
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
  formatCombinedCustomerOrder: (args: CombinedCustomerOrderArgs) => string;
  whatsappAppLink: (text: string, phone?: string) => string;
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
    resetCustomerAfterSend,
    clearTime,
    clearTaquizaOrders,
    hasTaquizaOrder,
    taquizaRules,
    taquizaOrderCount,
    taquizaSelectedByKind,
    taquizaByKind,
    taquizaOrders,
    pricingLines,
    pricingSubtotal,
    deliveryFee,
    appliedDeliveryFee,
    pickupTime,
    selectedDate,
    active,
    record,
    canSend,
    fetchCollection,
    createItem,
    formatCustomerOrder,
    formatCombinedCustomerOrder,
    whatsappAppLink,
    restaurantWhatsapp,
    comandasCollection,
    comandasField,
  } = params;

  const sendingOrder = ref(false);
  const showThankYou = ref(false);
  // Nombre a mostrar en el modal de agradecimiento.
  const thankYouName = ref("");

  function clearCart() {
    for (const k of Object.keys(cart)) cart[k] = 0;
    clearTaquizaOrders();
  }

  // Limpia lo propio del pedido. En el menú público conserva los datos de la
  // sesión para que una segunda orden solo requiera elegir comida.
  function resetOrderForm() {
    clearCart();
    note.value = "";
    clearTime();
    deliveryFee.value = 60;

    if (resetCustomerAfterSend()) {
      mode.value = "llevar";
      customer.name = "";
      customer.phone = "";
      customer.address = "";
      memberCode.value = "";
    }
  }

  function buildNote() {
    const pieces: string[] = [];
    // La hora aplica a "aquí" y "para llevar" (no domicilio).
    if (pickupTime.value && mode.value !== "domicilio") {
      const verb = mode.value === "aqui" ? "Llegada" : "Recoger";
      pieces.push(`${verb} a las ${pickupTime.value}`);
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
    draft: ComandaDraft,
    memberCodeValue: string,
    includeOrderPricing: boolean,
  ) {
    const orderDeliveryFee = appliedDeliveryFee.value;
    const order: PlacedOrder = {
      id: `${number}-${Date.now()}`,
      number,
      cart: draft.cart,
      mode: mode.value,
      note: finalNote,
      fulfillDate: selectedDate.value,
      fulfillTime: mode.value !== "domicilio" ? pickupTime.value : "",
      customer: { ...customer },
      taquizaOrders: draft.taquizaOrders,
      taquizaByKind: draft.taquizaByKind,
      createdAt: Date.now(),
      memberCode: memberCodeValue || undefined,
      pricingSubtotal: includeOrderPricing ? pricingSubtotal.value : undefined,
      deliveryFee: includeOrderPricing ? orderDeliveryFee : undefined,
      pricingTotal: includeOrderPricing
        ? pricingSubtotal.value + orderDeliveryFee
        : undefined,
      redeemMemberMeal: promoRedeemsMembershipMeal(draft.promo),
      promo: draft.promo,
    };

    try {
      await createItem(
        comandasCollection,
        comandaCreatePayload(order, comandasField),
      );
    } catch (e) {
      console.error("No se pudo crear la comanda en cocina", e);
    }
  }

  async function sendOrder() {
    if (!record.value || !canSend.value || sendingOrder.value) return;

    sendingOrder.value = true;

    const a = active.value; // menú resuelto (rotación o `active` de hoy)

    // Si hay código de socio, se estampa en la nota Y se guarda como campo
    // estructurado; el staff descuenta la comida al marcar la orden lista.
    const code = memberCode.value.replace(/\s+/g, "").toUpperCase();
    const memberTag = code ? `SOCIO ${code}` : "";

    const finalNote = [buildNote(), memberTag].filter(Boolean).join(" · ");
    const orderDeliveryFee = appliedDeliveryFee.value;
    const pricingTotal = pricingSubtotal.value + orderDeliveryFee;
    const drafts = buildComandaDrafts({
      cart,
      taquizaOrders: taquizaOrders.value,
      pricingLines: pricingLines.value,
    });
    const firstNumber = await nextComandaNumber();
    const numberedDrafts = drafts.map((draft, index) => ({
      ...draft,
      number: firstNumber + index,
    }));

    const text = numberedDrafts.some((draft) => draft.promo)
      ? formatCombinedCustomerOrder({
          name: customer.name,
          mode: mode.value,
          dishes: a,
          sections: numberedDrafts.map((draft) => ({
            orderNumber: draft.number,
            label: draft.label,
            cart: draft.cart,
            taquizaByKind: draft.taquizaByKind,
          })),
          note: finalNote,
          phone: customer.phone,
          address: customer.address,
          fulfillDate: selectedDate.value,
          pricingSubtotal: pricingSubtotal.value,
          deliveryFee: orderDeliveryFee,
          pricingTotal,
        })
      : formatCustomerOrder({
          orderNumber: firstNumber,
          name: customer.name,
          cart: { ...cart },
          mode: mode.value,
          dishes: a,
          taquizaByKind: {
            tacos: { ...taquizaByKind.value.tacos },
            quesadillas: { ...taquizaByKind.value.quesadillas },
          },
          note: finalNote,
          phone: customer.phone,
          address: customer.address,
          fulfillDate: selectedDate.value,
          pricingSubtotal: pricingSubtotal.value,
          deliveryFee: orderDeliveryFee,
          pricingTotal,
        });
    for (const [index, draft] of numberedDrafts.entries()) {
      await createComanda(draft.number, finalNote, draft, code, index === 0);
    }

    thankYouName.value = customer.name.trim();
    resetOrderForm();
    showThankYou.value = true;

    if (typeof window !== "undefined") {
      window.location.href = whatsappAppLink(text, restaurantWhatsapp);
    }

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
