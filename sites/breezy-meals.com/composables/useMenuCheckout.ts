import { ref, type ComputedRef, type Ref } from "vue";
import type { DayDishes, PlacedOrder } from "~/utils/comandas";
import type { OrderMode } from "~/composables/useWhatsappOrder";
import type { TaquizaKind, TaquizaOrder } from "~/composables/useTaquizaOrders";
import type {
  CombinedCustomerOrderArgs,
  CustomerOrderArgs,
} from "~/composables/useMenuLink";
import type { PricingLine } from "~/utils/menuPricing";

interface Customer {
  name: string;
  phone: string;
  address: string;
}

interface ComandaDraft {
  label: string;
  cart: Record<string, number>;
  taquizaOrders: Record<TaquizaKind, number>;
  taquizaByKind: Record<TaquizaKind, Record<string, number>>;
  promo?: PlacedOrder["promo"];
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
    pickupTime,
    selectedDate,
    active,
    record,
    canSend,
    fetchCollection,
    createItem,
    formatCustomerOrder,
    formatCombinedCustomerOrder,
    waLink,
    isAppleDevice,
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

  function emptyTaquizaByKind() {
    return { tacos: {}, quesadillas: {} } as Record<
      TaquizaKind,
      Record<string, number>
    >;
  }

  function addQty(target: Record<string, number>, name: string, qty: number) {
    target[name] = (target[name] ?? 0) + qty;
  }

  function buildComandaDrafts(): ComandaDraft[] {
    const remainingCart = Object.fromEntries(
      Object.entries(cart).filter(([, qty]) => qty > 0),
    );
    const remainingTaquizaOrders = taquizaOrders.value.map((order) => ({
      ...order,
      fills: { ...order.fills },
    }));
    const drafts: ComandaDraft[] = [];
    const applicationByPromo = new Map<string, number>();

    pricingLines.value
      .filter((line) => line.kind === "promo")
      .forEach((line) => {
        line.promoApplications?.forEach((application) => {
          const cartForMeal: Record<string, number> = {};
          const taquizaForMeal = emptyTaquizaByKind();
          const taquizaCounts = { tacos: 0, quesadillas: 0 };

          application.items.forEach((item) => {
            addQty(cartForMeal, item.name, item.qty);
            remainingCart[item.name] = Math.max(
              0,
              (remainingCart[item.name] ?? 0) - item.qty,
            );
          });

          application.orderUnits.forEach((unit) => {
            const kind = unit.code.split(":").at(-1) as TaquizaKind;
            if (kind !== "tacos" && kind !== "quesadillas") return;

            for (let index = 0; index < unit.qty; index += 1) {
              const orderIndex = remainingTaquizaOrders.findIndex(
                (order) => order.kind === kind,
              );
              if (orderIndex < 0) break;
              const [order] = remainingTaquizaOrders.splice(orderIndex, 1);
              taquizaCounts[kind] += 1;
              Object.entries(order.fills).forEach(([name, qty]) => {
                addQty(cartForMeal, name, qty);
                addQty(taquizaForMeal[kind], name, qty);
                remainingCart[name] = Math.max(
                  0,
                  (remainingCart[name] ?? 0) - qty,
                );
              });
            }
          });

          const applicationNumber =
            (applicationByPromo.get(line.code) ?? 0) + 1;
          applicationByPromo.set(line.code, applicationNumber);
          drafts.push({
            label: line.label,
            cart: cartForMeal,
            taquizaOrders: taquizaCounts,
            taquizaByKind: taquizaForMeal,
            promo: {
              id: line.code,
              label: line.label,
              application: applicationNumber,
            },
          });
        });
      });

    const extrasCart = Object.fromEntries(
      Object.entries(remainingCart).filter(([, qty]) => qty > 0),
    );
    if (Object.keys(extrasCart).length) {
      const extrasTaquiza = emptyTaquizaByKind();
      remainingTaquizaOrders.forEach((order) => {
        Object.entries(order.fills).forEach(([name, qty]) => {
          addQty(extrasTaquiza[order.kind], name, qty);
        });
      });
      drafts.push({
        label: drafts.length ? "Extras" : "Pedido",
        cart: extrasCart,
        taquizaOrders: {
          tacos: remainingTaquizaOrders.filter(
            (order) => order.kind === "tacos",
          ).length,
          quesadillas: remainingTaquizaOrders.filter(
            (order) => order.kind === "quesadillas",
          ).length,
        },
        taquizaByKind: extrasTaquiza,
      });
    }

    return drafts;
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
    const appliedDeliveryFee =
      mode.value === "domicilio"
        ? Math.max(0, Number(deliveryFee.value) || 0)
        : 0;
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
      deliveryFee: includeOrderPricing ? appliedDeliveryFee : undefined,
      pricingTotal: includeOrderPricing
        ? pricingSubtotal.value + appliedDeliveryFee
        : undefined,
      redeemMemberMeal: !!draft.promo,
      promo: draft.promo,
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

    const finalNote = [buildNote(), memberTag].filter(Boolean).join(" · ");
    const appliedDeliveryFee =
      mode.value === "domicilio"
        ? Math.max(0, Number(deliveryFee.value) || 0)
        : 0;
    const pricingTotal = pricingSubtotal.value + appliedDeliveryFee;
    const drafts = buildComandaDrafts();
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
          deliveryFee: appliedDeliveryFee,
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
          deliveryFee: appliedDeliveryFee,
          pricingTotal,
        });
    for (const [index, draft] of numberedDrafts.entries()) {
      await createComanda(draft.number, finalNote, draft, code, index === 0);
    }

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
