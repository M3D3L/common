import type { PricingConfig } from "~/utils/menuPricing";

export const menuPricingConfig: PricingConfig = {
  orderUnits: {
    "taquiza:tacos": {
      label: "Orden de tacos",
      unitPrice: 120,
    },
    "taquiza:quesadillas": {
      label: "Orden de quesadillas",
      unitPrice: 120,
    },
  },
  promos: [
    {
      id: "meal-combo-180",
      label: "Combo comida completa + extra",
      priority: 25,
      display: {
        summary: "2 guisos + 2 Guarniciones + 1 bebida = $180",
      },
      match: {
        requirements: [
          { targetType: "group", target: "guisos", qty: 2 },
          { targetType: "group", target: "sides", qty: 2 },
          { targetType: "group", target: "bebidas", qty: 1 },
        ],
      },
      pricing: {
        amount: 180,
      },
    },
    {
      id: "meal-combo-120",
      label: "Combo comida completa",
      priority: 20,
      display: {
        summary: "1 guiso + 2 guarniciones + 1 bebida = $120",
      },
      match: {
        requirements: [
          { targetType: "group", target: "guisos", qty: 1 },
          { targetType: "group", target: "sides", qty: 2 },
          { targetType: "group", target: "bebidas", qty: 1 },
        ],
      },
      pricing: {
        amount: 120,
      },
    },
    {
      id: "caldo-combo-120",
      label: "Combo caldo completo",
      priority: 20,
      display: {
        summary: "1 caldo + 2 guarniciones + 1 bebida = $120",
      },
      match: {
        requirements: [
          { targetType: "group", target: "caldos", qty: 1 },
          { targetType: "group", target: "sides", qty: 2 },
          { targetType: "group", target: "bebidas", qty: 1 },
        ],
      },
      pricing: {
        amount: 120,
      },
    },
    {
      id: "taquiza-tacos-120",
      label: "Promo 3 tacos",
      priority: 30,
      display: {
        summary: "3 tacos = $120",
      },
      match: {
        requirements: [
          { targetType: "order-unit", target: "taquiza:tacos", qty: 1 },
        ],
      },
      pricing: {
        amount: 120,
      },
    },
    {
      id: "taquiza-quesadillas-120",
      label: "Promo 2 quesadillas",
      priority: 30,
      display: {
        summary: "2 quesadillas = $120",
      },
      match: {
        requirements: [
          {
            targetType: "order-unit",
            target: "taquiza:quesadillas",
            qty: 1,
          },
        ],
      },
      pricing: {
        amount: 120,
      },
    },
  ],
};
