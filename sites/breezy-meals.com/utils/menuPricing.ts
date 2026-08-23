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

function stateKey(consumed: boolean[]) {
  return consumed.map((flag) => (flag ? "1" : "0")).join("");
}

function cloneConsumed(consumed: boolean[]) {
  return [...consumed];
}

function sumRemainingUnits(units: AvailableUnit[], consumed: boolean[]) {
  return units.reduce(
    (sum, unit, index) => sum + (consumed[index] ? 0 : unit.unitPrice),
    0,
  );
}

function buildRemainingLines(
  units: AvailableUnit[],
  consumed: boolean[],
): PricingLine[] {
  const aggregated = new Map<string, PricingLine>();

  units.forEach((unit, index) => {
    if (consumed[index]) return;
    const key = `${unit.kind}:${unit.code}:${unit.unitPrice}:${unit.label}`;
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

  return [...aggregated.values()];
}

function mergePricingLines(lines: PricingLine[]) {
  const merged = new Map<string, PricingLine>();

  lines.forEach((line) => {
    const key = `${line.kind}:${line.code}:${line.unitPrice}:${line.label}`;
    const existing = merged.get(key);
    if (existing) {
      existing.qty += line.qty;
      existing.total += line.total;
      if (line.detail) {
        const nextDetails = new Set(
          [existing.detail, line.detail].filter(Boolean) as string[],
        );
        existing.detail = [...nextDetails].join(" · ");
      }
      return;
    }

    merged.set(key, { ...line });
  });

  return [...merged.values()];
}

function applyPromoOnce(
  units: AvailableUnit[],
  consumed: boolean[],
  promo: PricingPromo,
) {
  const nextConsumed = cloneConsumed(consumed);
  const pickedLabels: string[] = [];

  for (const requirement of promo.match.requirements) {
    const matches = units
      .map((unit, index) => ({ unit, index }))
      .filter(
        ({ index, unit }) =>
          !nextConsumed[index] && matchesRequirement(unit, requirement),
      )
      .sort((left, right) => {
        if (right.unit.unitPrice !== left.unit.unitPrice) {
          return right.unit.unitPrice - left.unit.unitPrice;
        }
        return left.index - right.index;
      });

    if (matches.length < requirement.qty) return null;

    matches.slice(0, requirement.qty).forEach(({ index, unit }) => {
      nextConsumed[index] = true;
      pickedLabels.push(unit.label);
    });
  }

  return {
    consumed: nextConsumed,
    line: {
      kind: "promo" as const,
      code: promo.id,
      label: promo.label,
      qty: 1,
      unitPrice: promo.pricing.amount,
      total: promo.pricing.amount,
      detail: summarizeLabels(pickedLabels),
    },
  };
}

interface SolveResult {
  total: number;
  lines: PricingLine[];
}

function resolveBestPricing(
  units: AvailableUnit[],
  promos: PricingPromo[],
  consumed: boolean[],
  memo: Map<string, SolveResult>,
): SolveResult {
  const key = stateKey(consumed);
  const cached = memo.get(key);
  if (cached) return cached;

  const leftoverTotal = sumRemainingUnits(units, consumed);
  let best: SolveResult = {
    total: leftoverTotal,
    lines: buildRemainingLines(units, consumed),
  };

  for (const promo of promos) {
    const applied = applyPromoOnce(units, consumed, promo);
    if (!applied) continue;

    const next = resolveBestPricing(units, promos, applied.consumed, memo);
    const candidate: SolveResult = {
      total: applied.line.total + next.total,
      lines: mergePricingLines([applied.line, ...next.lines]),
    };

    if (candidate.total < best.total) {
      best = candidate;
    }
  }

  memo.set(key, best);
  return best;
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
    .sort((left, right) => {
      const leftAmount = left.pricing.amount;
      const rightAmount = right.pricing.amount;
      if (leftAmount !== rightAmount) return leftAmount - rightAmount;
      return (right.priority ?? 0) - (left.priority ?? 0);
    });

  const memo = new Map<string, SolveResult>();
  const solved = resolveBestPricing(
    units,
    promos,
    units.map(() => false),
    memo,
  );

  const total = solved.total;
  const lines = solved.lines;

  return {
    lines,
    total,
  };
}
