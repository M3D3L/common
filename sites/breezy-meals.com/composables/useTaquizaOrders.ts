import { computed, ref } from "vue";

export type TaquizaKind = "tacos" | "quesadillas";

export interface TaquizaOrder {
  id: string;
  kind: TaquizaKind;
  fills: Record<string, number>;
}

interface TaquizaPieceOptions {
  tacos?: number;
  quesadillas?: number;
}

/**
 * Manages taquiza order units while keeping cart totals consistent.
 *
 * Invariant:
 * cart[item] = regular servings + taquiza servings for that item.
 */
export function useTaquizaOrders(
  cart: Record<string, number>,
  pieceOptions?: TaquizaPieceOptions,
) {
  const taquizaKinds: TaquizaKind[] = ["tacos", "quesadillas"];
  const taquizaRules = {
    tacos: pieceOptions?.tacos ?? 3,
    quesadillas: pieceOptions?.quesadillas ?? 2,
  };

  const TAQUIZA_CAP: Record<TaquizaKind, number> = {
    tacos: taquizaRules.tacos,
    quesadillas: taquizaRules.quesadillas,
  };

  const taquizaOrders = ref<TaquizaOrder[]>([]);

  let taquizaSeq = 0;
  function nextTaquizaId() {
    taquizaSeq += 1;
    return `tq_${Date.now().toString(36)}_${taquizaSeq}`;
  }

  function orderFillTotal(order: TaquizaOrder) {
    return Object.values(order.fills).reduce((sum, q) => sum + q, 0);
  }

  function canAddToOrder(order: TaquizaOrder) {
    return orderFillTotal(order) < TAQUIZA_CAP[order.kind];
  }

  function applyTaquizaDelta(name: string, delta: number) {
    const next = (cart[name] ?? 0) + delta;
    cart[name] = next <= 0 ? 0 : next;
  }

  function addTaquizaOrder(kind: TaquizaKind) {
    taquizaOrders.value.push({ id: nextTaquizaId(), kind, fills: {} });
  }

  function removeTaquizaOrder(id: string) {
    const idx = taquizaOrders.value.findIndex((o) => o.id === id);
    if (idx === -1) return;
    const [removed] = taquizaOrders.value.splice(idx, 1);
    Object.entries(removed.fills).forEach(([name, qty]) => {
      if (qty > 0) applyTaquizaDelta(name, -qty);
    });
  }

  function setOrderFill(order: TaquizaOrder, name: string, delta: number) {
    if (delta > 0) {
      if (!canAddToOrder(order)) return;
      order.fills[name] = (order.fills[name] ?? 0) + 1;
      applyTaquizaDelta(name, 1);
    } else {
      const cur = order.fills[name] ?? 0;
      if (cur <= 0) return;
      const next = cur - 1;
      if (next <= 0) delete order.fills[name];
      else order.fills[name] = next;
      applyTaquizaDelta(name, -1);
    }
  }

  const taquizaByKind = computed<Record<TaquizaKind, Record<string, number>>>(
    () => {
      const out: Record<TaquizaKind, Record<string, number>> = {
        tacos: {},
        quesadillas: {},
      };

      taquizaOrders.value.forEach((order) => {
        Object.entries(order.fills).forEach(([name, qty]) => {
          if (qty > 0) {
            out[order.kind][name] = (out[order.kind][name] ?? 0) + qty;
          }
        });
      });

      return out;
    },
  );

  const taquizaOrderCount = computed<Record<TaquizaKind, number>>(() => ({
    tacos: taquizaOrders.value.filter((o) => o.kind === "tacos").length,
    quesadillas: taquizaOrders.value.filter((o) => o.kind === "quesadillas")
      .length,
  }));

  const taquizaSelectedByKind = computed<Record<TaquizaKind, number>>(() => {
    const sum = (k: TaquizaKind) =>
      Object.values(taquizaByKind.value[k]).reduce((s, q) => s + q, 0);
    return { tacos: sum("tacos"), quesadillas: sum("quesadillas") };
  });

  const hasTaquizaOrder = computed(() => taquizaOrders.value.length > 0);

  function taquizaTotalForName(name: string) {
    return (
      (taquizaByKind.value.tacos[name] ?? 0) +
      (taquizaByKind.value.quesadillas[name] ?? 0)
    );
  }

  function clearTaquizaOrders() {
    taquizaOrders.value = [];
  }

  return {
    taquizaKinds,
    taquizaRules,
    TAQUIZA_CAP,
    taquizaOrders,
    orderFillTotal,
    canAddToOrder,
    applyTaquizaDelta,
    addTaquizaOrder,
    removeTaquizaOrder,
    setOrderFill,
    taquizaByKind,
    taquizaOrderCount,
    taquizaSelectedByKind,
    hasTaquizaOrder,
    taquizaTotalForName,
    clearTaquizaOrders,
  };
}
