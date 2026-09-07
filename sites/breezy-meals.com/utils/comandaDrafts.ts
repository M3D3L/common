import type { PlacedOrder } from "./comandas.ts";
import type { PricingLine } from "./menuPricing.ts";

type TaquizaKind = "tacos" | "quesadillas";

interface TaquizaDraftOrder {
  kind: TaquizaKind;
  fills: Record<string, number>;
}

export interface ComandaDraft {
  label: string;
  cart: Record<string, number>;
  taquizaOrders: Record<TaquizaKind, number>;
  taquizaByKind: Record<TaquizaKind, Record<string, number>>;
  pricingSubtotal: number;
  promo?: PlacedOrder["promo"];
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

export function buildComandaDrafts(args: {
  cart: Record<string, number>;
  taquizaOrders: TaquizaDraftOrder[];
  pricingLines: PricingLine[];
  splitPromoApplications: boolean;
}): ComandaDraft[] {
  if (!args.splitPromoApplications) {
    const cart = Object.fromEntries(
      Object.entries(args.cart).filter(([, qty]) => qty > 0),
    );
    const taquizaByKind = emptyTaquizaByKind();
    args.taquizaOrders.forEach((order) => {
      Object.entries(order.fills).forEach(([name, qty]) => {
        addQty(taquizaByKind[order.kind], name, qty);
      });
    });

    return Object.keys(cart).length
      ? [
          {
            label: "Pedido",
            cart,
            taquizaOrders: {
              tacos: args.taquizaOrders.filter(
                (order) => order.kind === "tacos",
              ).length,
              quesadillas: args.taquizaOrders.filter(
                (order) => order.kind === "quesadillas",
              ).length,
            },
            taquizaByKind,
            pricingSubtotal: args.pricingLines.reduce(
              (sum, line) => sum + line.total,
              0,
            ),
          },
        ]
      : [];
  }

  const remainingCart = Object.fromEntries(
    Object.entries(args.cart).filter(([, qty]) => qty > 0),
  );
  const remainingTaquizaOrders = args.taquizaOrders.map((order) => ({
    ...order,
    fills: { ...order.fills },
  }));
  const drafts: ComandaDraft[] = [];
  const applicationByPromo = new Map<string, number>();

  args.pricingLines
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

        const applicationNumber = (applicationByPromo.get(line.code) ?? 0) + 1;
        applicationByPromo.set(line.code, applicationNumber);
        drafts.push({
          label: line.label,
          cart: cartForMeal,
          taquizaOrders: taquizaCounts,
          taquizaByKind: taquizaForMeal,
          pricingSubtotal: line.unitPrice,
          promo: {
            id: line.code,
            label: line.label,
            application: applicationNumber,
            redemption: line.redemption,
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
        tacos: remainingTaquizaOrders.filter((order) => order.kind === "tacos")
          .length,
        quesadillas: remainingTaquizaOrders.filter(
          (order) => order.kind === "quesadillas",
        ).length,
      },
      taquizaByKind: extrasTaquiza,
      pricingSubtotal: args.pricingLines
        .filter((line) => line.kind !== "promo")
        .reduce((sum, line) => sum + line.total, 0),
    });
  }

  return drafts;
}

export function promoRedeemsMembershipMeal(
  promo: PlacedOrder["promo"],
): boolean {
  return (
    promo?.redemption?.kind === "membership_meal" &&
    promo.redemption.credits > 0
  );
}
