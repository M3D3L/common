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
  send: (
    event: PublicAnalyticsEvent,
    payload: Record<string, string | number>,
  ) => void;
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
      const payload: Record<string, string | number> = {
        page_path: path,
        page_location: `https://breezy-meals.com${path}`,
        page_referrer: "",
        page_title: "Breezy Meals",
      };
      for (const key of ["value", "item_count", "quantity", "credits"]) {
        const value = data[key];
        if (typeof value === "number" && Number.isFinite(value) && value >= 0)
          payload[key] = value;
      }
      if (typeof payload.value === "number") payload.currency = "MXN";
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
