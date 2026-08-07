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
      label: "Combo comida completa",
      priority: 25,
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
