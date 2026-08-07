export interface PricingItemInput {
  name: string;
  group: string;
  qty: number;
  unitPrice: number;
}

export interface PricingOrderUnitInput {
  code: string;
  label: string;
  qty: number;
  unitPrice: number;
}

export interface PricingPromoRequirement {
  targetType: "group" | "item" | "order-unit";
  target: string;
  qty: number;
}

export interface PricingPromo {
  id: string;
  label: string;
  active?: boolean;
  priority?: number;
  stackable?: boolean;
  maxApplications?: number;
  display?: {
    summary?: string;
  };
  match: {
    requirements: PricingPromoRequirement[];
  };
  pricing: {
    amount: number;
  };
}

export interface PricingConfig {
  promos: PricingPromo[];
  orderUnits?: Record<
    string,
    {
      label: string;
      unitPrice: number;
    }
  >;
}

export interface PricingLine {
  kind: "promo" | "item" | "order-unit";
  code: string;
  label: string;
  qty: number;
  unitPrice: number;
  total: number;
  detail?: string;
}

interface PriceOrderArgs {
  items: PricingItemInput[];
  orderUnits?: PricingOrderUnitInput[];
  config: PricingConfig;
}

interface AvailableUnit {
  id: string;
  kind: "item" | "order-unit";
  code: string;
  label: string;
  group?: string;
  itemName?: string;
  unitPrice: number;
  consumed: boolean;
}

function summarizeLabels(labels: string[]): string | undefined {
  if (!labels.length) return undefined;

  const counts = new Map<string, number>();
  labels.forEach((label) => {
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([label, qty]) => (qty > 1 ? `${qty} x ${label}` : label))
    .join(", ");
}

function toAvailableUnits(
  items: PricingItemInput[],
  orderUnits: PricingOrderUnitInput[],
) {
  const units: AvailableUnit[] = [];
  let seq = 0;

  items.forEach((item) => {
    for (let index = 0; index < item.qty; index += 1) {
      seq += 1;
      units.push({
        id: `item-${seq}`,
        kind: "item",
        code: item.name,
        label: item.name,
        group: item.group,
        itemName: item.name,
        unitPrice: item.unitPrice,
        consumed: false,
      });
    }
  });

  orderUnits.forEach((unit) => {
    for (let index = 0; index < unit.qty; index += 1) {
      seq += 1;
      units.push({
        id: `unit-${seq}`,
        kind: "order-unit",
        code: unit.code,
        label: unit.label,
        unitPrice: unit.unitPrice,
        consumed: false,
      });
    }
  });

  return units;
}

function matchesRequirement(
  unit: AvailableUnit,
  requirement: PricingPromoRequirement,
) {
  if (unit.consumed) return false;

  if (requirement.targetType === "group") {
    return unit.kind === "item" && unit.group === requirement.target;
  }

  if (requirement.targetType === "item") {
    return unit.kind === "item" && unit.itemName === requirement.target;
  }

  return unit.kind === "order-unit" && unit.code === requirement.target;
}

function pickUnits(
  units: AvailableUnit[],
  requirement: PricingPromoRequirement,
) {
  const matches = units
    .filter((unit) => matchesRequirement(unit, requirement))
    .sort((left, right) => right.unitPrice - left.unitPrice);

  if (matches.length < requirement.qty) return null;
  return matches.slice(0, requirement.qty);
}

export function priceMenuOrder({
  items,
  orderUnits = [],
  config,
}: PriceOrderArgs) {
  const units = toAvailableUnits(items, orderUnits);
  const promoApplications = new Map<
    string,
    {
      promo: PricingPromo;
      qty: number;
      labels: string[];
    }
  >();

  const promos = [...config.promos]
    .filter((promo) => promo.active !== false)
    .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0));

  promos.forEach((promo) => {
    const maxApplications =
      promo.maxApplications ??
      (promo.stackable === false ? 1 : Number.POSITIVE_INFINITY);

    let applications = 0;
    while (applications < maxApplications) {
      const picked: AvailableUnit[] = [];
      let matched = true;

      for (const requirement of promo.match.requirements) {
        const chosen = pickUnits(units, requirement);
        if (!chosen) {
          matched = false;
          break;
        }
        picked.push(...chosen);
        chosen.forEach((unit) => {
          unit.consumed = true;
        });
      }

      if (!matched) {
        picked.forEach((unit) => {
          unit.consumed = false;
        });
        break;
      }

      applications += 1;
      const current = promoApplications.get(promo.id) ?? {
        promo,
        qty: 0,
        labels: [],
      };
      current.qty += 1;
      current.labels.push(...picked.map((unit) => unit.label));
      promoApplications.set(promo.id, current);
    }
  });

  const lines: PricingLine[] = [...promoApplications.values()].map(
    ({ promo, qty, labels }) => ({
      kind: "promo",
      code: promo.id,
      label: promo.label,
      qty,
      unitPrice: promo.pricing.amount,
      total: qty * promo.pricing.amount,
      detail: summarizeLabels(labels),
    }),
  );

  const leftovers = units.filter((unit) => !unit.consumed);
  const aggregated = new Map<string, PricingLine>();

  leftovers.forEach((unit) => {
    const key = `${unit.kind}:${unit.code}:${unit.unitPrice}`;
    const existing = aggregated.get(key);
    if (existing) {
      existing.qty += 1;
      existing.total += unit.unitPrice;
      return;
    }

    aggregated.set(key, {
      kind: unit.kind,
      code: unit.code,
      label: unit.label,
      qty: 1,
      unitPrice: unit.unitPrice,
      total: unit.unitPrice,
    });
  });

  const orderedLines = [...lines, ...aggregated.values()];
  const total = orderedLines.reduce((sum, line) => sum + line.total, 0);

  return {
    lines: orderedLines,
    total,
  };
}
