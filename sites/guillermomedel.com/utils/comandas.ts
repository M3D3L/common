/**
 * Constantes, tipos y helpers SIN estado para el módulo de Comandas.
 * Todo lo que viva aquí es puro: no depende de refs ni del store.
 */

import type { OrderMode, Customer } from "~/composables/useWhatsappOrder";

/**
 * Fuente ÚNICA de categorías. Agregar una nueva (p. ej. "taquizas") aquí la
 * propaga sola por el editor, el catálogo, el cliente y los tickets, porque
 * `GroupKey` y `DayDishes` se derivan de esta lista.
 * Orden = orden en que se renderizan en la UI.
 */
export interface ComboPolicy {
  allowSides?: boolean;
  requiredSides?: number;
  allowDrink?: boolean;
  requiredDrink?: boolean;
}

export interface GroupConfig {
  key: string;
  label: string;
  emoji: string;
  heading: string;
  kind: "main" | "side" | "drink";
  subtitle?: string;
  defaultCombo?: ComboPolicy;
  pieceOptions?: {
    tacos: number;
    quesadillas: number;
  };
}

function titleFromKey(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function inferKindFromKey(key: string): GroupConfig["kind"] {
  const k = key.toLowerCase();
  if (k.includes("bebida") || k.includes("drink")) return "drink";
  if (k.includes("side") || k.includes("guarn")) return "side";
  return "main";
}

function inferEmojiFromKind(kind: GroupConfig["kind"]): string {
  if (kind === "drink") return "🥤";
  if (kind === "side") return "🥗";
  return "🍽️";
}

export const groups = [
  {
    key: "guisos",
    label: "Guisos",
    emoji: "🍖",
    heading: "GUISOS DEL DIA",
    kind: "main",
    defaultCombo: {
      allowSides: true,
      requiredSides: 2,
      allowDrink: true,
      requiredDrink: true,
    },
  },
  {
    key: "caldos",
    label: "Caldos",
    emoji: "🍲",
    heading: "CALDOS",
    kind: "main",
    defaultCombo: {
      allowSides: true,
      requiredSides: 2,
      allowDrink: true,
      requiredDrink: true,
    },
  },
  {
    key: "sides",
    label: "Guarniciones / Sides",
    emoji: "🥗",
    heading: "GUARNICIONES / SIDES",
    subtitle: "_Elige hasta 2_",
    kind: "side",
    defaultCombo: {
      allowSides: false,
      requiredSides: 0,
      allowDrink: false,
      requiredDrink: false,
    },
  },
  {
    key: "tortas_burgers_burritos",
    label: "Tortas, Burgers y Burritos",
    emoji: "🥪",
    heading: "TORTAS, BURGERS Y BURRITOS",
    kind: "main",
    defaultCombo: {
      allowSides: false,
      requiredSides: 0,
      allowDrink: true,
      requiredDrink: true,
    },
  },
  {
    key: "taquizas",
    label: "Taquizas",
    emoji: "🌮",
    heading: "TAQUIZAS",
    kind: "main",
    defaultCombo: {
      allowSides: false,
      requiredSides: 0,
      allowDrink: true,
      requiredDrink: true,
    },
    pieceOptions: {
      tacos: 3,
      quesadillas: 2,
    },
  },
  {
    key: "bebidas",
    label: "Bebidas",
    emoji: "🥤",
    heading: "BEBIDAS",
    kind: "drink",
    defaultCombo: {
      allowSides: false,
      requiredSides: 0,
      allowDrink: false,
      requiredDrink: false,
    },
  },
] as const satisfies readonly GroupConfig[];

export type GroupKey = string;
export type GroupKind = (typeof groups)[number]["kind"];
export type FilterType = "all" | OrderMode;

export const groupByKey = Object.fromEntries(
  groups.map((g) => [g.key, g]),
) as Record<string, (typeof groups)[number]>;

export function groupsFromKeys(keys: string[] = []): GroupConfig[] {
  const base = [...groups] as GroupConfig[];
  const known = new Set(base.map((g) => g.key));
  const extras = [...new Set(keys)]
    .filter((key) => key && !known.has(key))
    .map((key) => {
      const kind = inferKindFromKey(key);
      return {
        key,
        label: titleFromKey(key),
        heading: titleFromKey(key).toUpperCase(),
        kind,
        emoji: inferEmojiFromKind(kind),
      } as GroupConfig;
    });
  return [...base, ...extras];
}

export function groupsFromData(
  raw?: Record<string, unknown> | null,
): GroupConfig[] {
  return groupsFromKeys(Object.keys(raw ?? {}));
}

export const MAIN_GROUP_KEYS = groups
  .filter((g) => g.kind === "main")
  .map((g) => g.key) as GroupKey[];

export const SIDE_GROUP_KEYS = groups
  .filter((g) => g.kind === "side")
  .map((g) => g.key) as GroupKey[];

export const DRINK_GROUP_KEYS = groups
  .filter((g) => g.kind === "drink")
  .map((g) => g.key) as GroupKey[];

export interface MenuItem {
  name: string;
  price: number;
  combo?: ComboPolicy;
}

export type DayDishes = Record<string, string[]>;
export type MenuCatalog = Record<string, MenuItem[]>;
export type LegacyOrItemList = Array<string | Partial<MenuItem>>;

/**
 * Objeto vacío con TODAS las categorías, derivado de `groups`.
 * Úsalo en lugar de escribir `{ guisos: [], sides: [], bebidas: [] }` a mano:
 * así, al agregar una categoría nueva, no hay literales que actualizar.
 */
export const emptyDayDishes = (extraKeys: string[] = []): DayDishes =>
  Object.fromEntries(
    groupsFromKeys(extraKeys).map((g) => [g.key, []]),
  ) as DayDishes;

export const emptyMenuCatalog = (extraKeys: string[] = []): MenuCatalog =>
  Object.fromEntries(
    groupsFromKeys(extraKeys).map((g) => [g.key, []]),
  ) as MenuCatalog;

function toDishName(entry: unknown): string {
  if (typeof entry === "string") return entry.trim();
  if (
    entry &&
    typeof entry === "object" &&
    "name" in entry &&
    typeof (entry as { name?: unknown }).name === "string"
  ) {
    return (entry as { name: string }).name.trim();
  }
  return "";
}

function defaultPolicy(group: GroupKey): ComboPolicy {
  const cfg = groupByKey[group];
  if (cfg?.defaultCombo) return cfg.defaultCombo;
  const kind = cfg?.kind ?? inferKindFromKey(group);
  if (kind === "main") {
    return {
      allowSides: true,
      requiredSides: 2,
      allowDrink: true,
      requiredDrink: true,
    };
  }
  return {
    allowSides: false,
    requiredSides: 0,
    allowDrink: false,
    requiredDrink: false,
  };
}

export function comboForItem(
  item: MenuItem | null | undefined,
  group: GroupKey,
): Required<ComboPolicy> {
  const base = defaultPolicy(group);
  const combo = item?.combo ?? {};
  return {
    allowSides: combo.allowSides ?? base.allowSides ?? false,
    requiredSides: Math.max(0, combo.requiredSides ?? base.requiredSides ?? 0),
    allowDrink: combo.allowDrink ?? base.allowDrink ?? false,
    requiredDrink: combo.requiredDrink ?? base.requiredDrink ?? false,
  };
}

function normalizeMenuItem(group: GroupKey, entry: unknown): MenuItem | null {
  const name = toDishName(entry);
  if (!name) return null;

  const rawPrice =
    entry && typeof entry === "object" && "price" in entry
      ? Number((entry as { price?: unknown }).price)
      : NaN;
  const price = Number.isFinite(rawPrice) ? rawPrice : 0;

  const combo =
    entry && typeof entry === "object" && "combo" in entry
      ? (entry as { combo?: ComboPolicy }).combo
      : undefined;

  const normalized: MenuItem = {
    name,
    price,
  };

  if (MAIN_GROUP_KEYS.includes(group)) {
    normalized.combo = {
      ...defaultPolicy(group),
      ...(combo ?? {}),
    };
  } else if (combo) {
    normalized.combo = { ...combo };
  }

  return normalized;
}

export function normalizeDishNames(raw?: Partial<Record<string, unknown>>) {
  const out = emptyDayDishes(Object.keys(raw ?? {}));
  groupsFromData(raw as Record<string, unknown>).forEach((g) => {
    const list = Array.isArray(raw?.[g.key]) ? (raw?.[g.key] as unknown[]) : [];
    const names = list.map(toDishName).filter(Boolean);
    out[g.key] = Array.from(new Set(names));
  });
  return out;
}

export function normalizeMenuCatalog(
  raw?: Partial<Record<string, LegacyOrItemList | unknown>>,
) {
  const out = emptyMenuCatalog(Object.keys(raw ?? {}));
  groupsFromData(raw as Record<string, unknown>).forEach((g) => {
    const list = Array.isArray(raw?.[g.key]) ? (raw?.[g.key] as unknown[]) : [];
    const items = list
      .map((entry) => normalizeMenuItem(g.key, entry))
      .filter((x): x is MenuItem => !!x);

    const unique = new Map<string, MenuItem>();
    items.forEach((item) => {
      if (!unique.has(item.name)) unique.set(item.name, item);
    });
    out[g.key] = [...unique.values()];
  });
  return out;
}

export function catalogToDayDishes(catalog: MenuCatalog): DayDishes {
  const out = emptyDayDishes(Object.keys(catalog ?? {}));
  groupsFromData(catalog as Record<string, unknown>).forEach((g) => {
    out[g.key] = (catalog[g.key] ?? []).map((item) => item.name);
  });
  return out;
}

export function dayDishesToCatalog(dishes: DayDishes): MenuCatalog {
  const out = emptyMenuCatalog(Object.keys(dishes ?? {}));
  groupsFromData(dishes as Record<string, unknown>).forEach((g) => {
    out[g.key] = (dishes[g.key] ?? [])
      .map((name) => normalizeMenuItem(g.key, name))
      .filter((x): x is MenuItem => !!x);
  });
  return out;
}

export function findMenuItemByName(catalog: MenuCatalog, name: string) {
  for (const g of groupsFromData(catalog as Record<string, unknown>)) {
    const item = (catalog[g.key] ?? []).find((x) => x.name === name);
    if (item) return { group: g.key, item };
  }
  return null;
}

export interface PlacedOrder {
  id: string;
  number: number;
  cart: Record<string, number>;
  mode: OrderMode;
  note: string;
  fulfillDate?: string;
  fulfillTime?: string;
  customer?: Customer;
  taquizaOrders?: {
    tacos: number;
    quesadillas: number;
  };
  taquizaByKind?: {
    tacos: Record<string, number>;
    quesadillas: Record<string, number>;
  };
  createdAt: number;
  // Código de socio (si se capturó). La comida se redime al marcar la orden
  // lista (completeOrder), no al crearla, así funciona igual desde /orders
  // y desde /menu público.
  memberCode?: string;
  memberRedeemed?: boolean;
}

/** Registro único de la colección `menu` en PocketBase. */
export interface MenuRecord {
  id: string;
  dishes: MenuCatalog | DayDishes; // catálogo completo (legacy o estructurado)
  active: DayDishes; // selección disponible (lo que ve el cliente)
  sold_out: string[]; // agotados
  whatsapp?: string; // número del negocio (solo dígitos), si existe el campo
  label?: string; // etiqueta opcional
  published?: boolean; // opcional
  day?: string; // opcional
  created: string;
  updated: string;
}

export const MODES = ["llevar", "aqui", "domicilio"] as const;

export const MODE_SHORT: Record<OrderMode, string> = {
  llevar: "Llevar",
  aqui: "Aquí",
  domicilio: "Domicilio",
};

export const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "Todas", value: "all" },
  { label: "Aquí", value: "aqui" },
  { label: "Llevar", value: "llevar" },
  { label: "Domicilio", value: "domicilio" },
];

/* ===== Fecha ===== */

/**
 * Zona horaria del negocio. Sonora (San Carlos, Hermosillo, Bahía de Kino)
 * usa UTC−7 todo el año y NO aplica horario de verano (corre igual que Arizona).
 * Fijarla aquí evita que la fecha "de hoy" se adelante al día siguiente por la
 * tarde —cuando UTC ya cambió de fecha pero localmente sigue siendo hoy—, tanto
 * en el navegador del cliente como en el servidor.
 */
export const RESTAURANT_TZ = "America/Hermosillo";

/**
 * Fecha local del negocio como etiqueta YYYY-MM-DD (NO UTC).
 * Usa formatToParts para no depender del orden de formato del locale.
 */
export const todayISO = (): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: RESTAURANT_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
};

/* ===== Helpers presentacionales (sin estado) ===== */
export function orderTime(o: PlacedOrder) {
  return new Date(o.createdAt).toLocaleTimeString("es-MX", {
    timeZone: RESTAURANT_TZ, // hora del negocio, no la del dispositivo
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function modeBorderClass(m: OrderMode) {
  if (m === "aqui") return "border-t-blue-500";
  if (m === "domicilio") return "border-t-purple-500";
  return "border-t-orange-500";
}

export function modeBadgeClass(m: OrderMode) {
  if (m === "aqui")
    return "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200/40";
  if (m === "domicilio")
    return "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200/40";
  return "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 border-orange-200/40";
}

export function hasGroupItems(
  o: PlacedOrder,
  groupKey: GroupKey,
  catalog: DayDishes,
) {
  const taquizaGroup = groups.find((g) => "pieceOptions" in g);
  const taquizaKey = taquizaGroup?.key;
  const taquizaByKind = o.taquizaByKind;

  // Con breakdown de taquiza: este grupo se determina por sus propios datos.
  if (taquizaKey && groupKey === taquizaKey && taquizaByKind) {
    const hasTacos = Object.values(taquizaByKind.tacos ?? {}).some(
      (q) => q > 0,
    );
    const hasQuesadillas = Object.values(taquizaByKind.quesadillas ?? {}).some(
      (q) => q > 0,
    );
    return hasTacos || hasQuesadillas;
  }

  const hasTaquizaNote = /taquiza\s*:/i.test(o.note || "");
  const taquizaNames = new Set(
    taquizaKey ? (catalog[taquizaKey] ?? []) : ([] as string[]),
  );

  return (catalog[groupKey] ?? []).some((n) => {
    const total = o.cart?.[n] ?? 0;
    if (total <= 0) return false;

    // Evita duplicar en guisos lo que ya pertenece a taquiza.
    if (taquizaByKind && taquizaKey && groupKey !== taquizaKey) {
      const taquizaQty =
        (taquizaByKind.tacos?.[n] ?? 0) + (taquizaByKind.quesadillas?.[n] ?? 0);
      return total - taquizaQty > 0;
    }

    // Compatibilidad con órdenes viejas: si la nota indica taquiza y el item
    // vive en el catálogo de taquizas, no repetirlo en otros grupos.
    if (
      !taquizaByKind &&
      taquizaKey &&
      groupKey !== taquizaKey &&
      hasTaquizaNote
    ) {
      return !taquizaNames.has(n);
    }

    return true;
  });
}

export function getGroupLines(
  o: PlacedOrder,
  groupKey: GroupKey,
  catalog: DayDishes,
) {
  const taquizaGroup = groups.find((g) => "pieceOptions" in g);
  const taquizaKey = taquizaGroup?.key;
  const taquizaByKind = o.taquizaByKind;

  if (taquizaKey && groupKey === taquizaKey && taquizaByKind) {
    const merged = new Map<string, number>();
    Object.entries(taquizaByKind.tacos ?? {}).forEach(([name, qty]) => {
      if (qty > 0) merged.set(name, (merged.get(name) ?? 0) + qty);
    });
    Object.entries(taquizaByKind.quesadillas ?? {}).forEach(([name, qty]) => {
      if (qty > 0) merged.set(name, (merged.get(name) ?? 0) + qty);
    });
    return [...merged.entries()].map(([name, qty]) => ({ name, qty }));
  }

  const hasTaquizaNote = /taquiza\s*:/i.test(o.note || "");
  const taquizaNames = new Set(
    taquizaKey ? (catalog[taquizaKey] ?? []) : ([] as string[]),
  );

  return (catalog[groupKey] ?? [])
    .map((n) => {
      const total = o.cart?.[n] ?? 0;
      if (total <= 0) return null;

      if (taquizaByKind && taquizaKey && groupKey !== taquizaKey) {
        const taquizaQty =
          (taquizaByKind.tacos?.[n] ?? 0) +
          (taquizaByKind.quesadillas?.[n] ?? 0);
        const qty = total - taquizaQty;
        return qty > 0 ? { name: n, qty } : null;
      }

      if (
        !taquizaByKind &&
        taquizaKey &&
        groupKey !== taquizaKey &&
        hasTaquizaNote
      ) {
        if (taquizaNames.has(n)) return null;
      }

      return { name: n, qty: total };
    })
    .filter((line): line is { name: string; qty: number } => !!line);
}
