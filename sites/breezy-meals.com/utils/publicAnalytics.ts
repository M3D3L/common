import type { PricingLine } from "./menuPricing.ts";

export const PUBLIC_ANALYTICS_PATHS = [
  "/",
  "/menu",
  "/tienda",
  "/catering",
  "/promos",
  "/membresia",
  "/menu-semanal",
] as const;

export const PUBLIC_ANALYTICS_EVENTS = [
  "page_view",
  "select_promotion",
  "add_to_cart",
  "begin_checkout",
  "whatsapp_handoff",
  "membership_submit",
] as const;

export type PublicAnalyticsEvent = (typeof PUBLIC_ANALYTICS_EVENTS)[number];

export interface PublicAnalyticsItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity: number;
}

export type PublicAnalyticsPayload = Record<
  string,
  string | number | PublicAnalyticsItem[]
>;

export interface AnalyticsCatalogItem {
  name: string;
  group: string;
  category: string;
  price: number;
  surface: string;
}

function catalogItem(
  item: AnalyticsCatalogItem,
  quantity: number,
): PublicAnalyticsItem {
  return {
    item_id: `${item.surface}:${item.group}:${item.name}`,
    item_name: item.name,
    item_category: item.category,
    price: item.price,
    quantity,
  };
}

export function selectedAnalyticsItems(
  catalog: AnalyticsCatalogItem[],
  quantities: Record<string, number>,
  previous: Record<string, number> = {},
): PublicAnalyticsItem[] {
  const seen = new Set<string>();
  return catalog.flatMap((item) => {
    const quantity = Math.max(
      0,
      (quantities[item.name] || 0) - (previous[item.name] || 0),
    );
    if (!quantity || seen.has(item.name)) return [];
    seen.add(item.name);
    return [catalogItem(item, quantity)];
  });
}

export function checkoutAnalyticsItems(
  catalog: AnalyticsCatalogItem[],
  lines: PricingLine[],
): PublicAnalyticsItem[] {
  return lines.flatMap((line) => {
    if (line.kind === "item") {
      const item = catalog.find((entry) => entry.name === line.code);
      return item
        ? [{ ...catalogItem(item, line.qty), price: line.unitPrice }]
        : [];
    }
    if (line.kind === "order-unit") {
      return [
        {
          item_id: line.code,
          item_name: line.label,
          item_category: "Taquizas",
          price: line.unitPrice,
          quantity: line.qty,
        },
      ];
    }
    const components = (line.promoApplications || []).flatMap((application) => [
      ...application.items.flatMap((entry) => {
        const item = catalog.find(
          (item) => item.name === entry.name && item.group === entry.group,
        );
        return item ? [catalogItem(item, entry.qty)] : [];
      }),
      ...application.orderUnits.map((unit) => ({
        item_id: unit.code,
        item_name: unit.label,
        item_category: "Taquizas",
        price: 0,
        quantity: unit.qty,
      })),
    ]);
    const weight = components.reduce((sum, item) => sum + item.quantity, 0);
    if (!weight) return [];
    return components.map((item) => ({ ...item, price: line.total / weight }));
  });
}

function sanitizeItems(value: unknown): PublicAnalyticsItem[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 200).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    if (
      typeof item.item_id !== "string" ||
      !item.item_id.trim() ||
      typeof item.item_name !== "string" ||
      !item.item_name.trim() ||
      typeof item.price !== "number" ||
      !Number.isFinite(item.price) ||
      item.price < 0 ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity <= 0
    )
      return [];
    return [
      {
        item_id: item.item_id.trim().slice(0, 100),
        item_name: item.item_name.trim().slice(0, 100),
        ...(typeof item.item_category === "string" && item.item_category.trim()
          ? { item_category: item.item_category.trim().slice(0, 100) }
          : {}),
        price: item.price,
        quantity: item.quantity,
      },
    ];
  });
}

export function publicAnalyticsPath(path: string): string | null {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return (PUBLIC_ANALYTICS_PATHS as readonly string[]).includes(clean)
    ? clean
    : null;
}

export function validMeasurementId(value: unknown): value is string {
  return typeof value === "string" && /^G-[A-Z0-9]+$/.test(value);
}

export function createPublicAnalytics(options: {
  enabled: () => boolean;
  path: () => string;
  send: (event: PublicAnalyticsEvent, payload: PublicAnalyticsPayload) => void;
}) {
  return (
    event: PublicAnalyticsEvent,
    data: Record<string, unknown> = {},
  ): boolean => {
    try {
      if (!options.enabled() || !PUBLIC_ANALYTICS_EVENTS.includes(event))
        return false;
      const path = publicAnalyticsPath(options.path());
      if (!path) return false;
      const payload: PublicAnalyticsPayload = {
        page_path: path,
        page_location: `https://breezy-meals.com${path}`,
        page_referrer: "",
        page_title: "Breezy Meals",
      };
      for (const key of [
        "value",
        "shipping",
        "item_count",
        "quantity",
        "credits",
      ]) {
        const value = data[key];
        if (typeof value === "number" && Number.isFinite(value) && value >= 0)
          payload[key] = value;
      }
      if (typeof payload.value === "number") payload.currency = "MXN";
      if (event === "select_promotion") {
        for (const key of ["promotion_id", "promotion_name"]) {
          if (typeof data[key] === "string" && data[key].trim())
            payload[key] = data[key].trim().slice(0, 100);
        }
      }
      if (
        ["add_to_cart", "begin_checkout", "whatsapp_handoff"].includes(event)
      ) {
        const items = sanitizeItems(data.items);
        if (items.length) payload.items = items;
      }
      if (["llevar", "aqui", "domicilio"].includes(String(data.order_mode))) {
        payload.order_mode = String(data.order_mode);
      }
      if (["transfer", "in_store"].includes(String(data.payment_method))) {
        payload.payment_method = String(data.payment_method);
      }
      options.send(event, payload);
      return true;
    } catch {
      return false;
    }
  };
}
