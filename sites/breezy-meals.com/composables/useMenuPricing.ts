import { computed, ref, type ComputedRef } from "vue";
import { groupByKey, type GroupKey } from "~/utils/comandas";
import { menuPricingConfig } from "~/config/menu-pricing";
import {
  priceMenuOrder,
  type PricingConfig,
  type PricingPromo,
  type PricingPromoApplication,
  type PricingPromoRequirement,
} from "~/utils/menuPricing";
import type { TaquizaKind } from "~/composables/useTaquizaOrders";

interface PricedMenuItem {
  name: string;
  price?: number;
}

interface MenuGroupDef {
  key: GroupKey;
  label?: string;
}

export interface PromoProgressRequirement {
  id: string;
  targetType: PricingPromoRequirement["targetType"];
  target: string;
  label: string;
  labelEs: string;
  labelEn: string;
  required: number;
  selected: number;
  current: number;
  missing: number;
  met: boolean;
}

export interface PromoProgressCard {
  id: string;
  label: string;
  summary: string;
  price: number;
  requirements: PromoProgressRequirement[];
  eligible: boolean;
  appliedQty: number;
  applications: PricingPromoApplication[];
  missingTextEs: string;
  missingTextEn: string;
}

function toRuntimePromo(record: Record<string, any>): PricingPromo | null {
  const data =
    record?.data && typeof record.data === "object" ? record.data : undefined;
  const id = String(record.promoId || data?.id || record.id || "").trim();
  const label = String(record.label || data?.label || "").trim();
  const priority = Number(record.priority ?? data?.priority ?? 0) || 0;
  const active = Boolean(record.active ?? data?.active ?? true);

  const match = (record.match ?? data?.match) as
    | { requirements?: PricingPromoRequirement[] }
    | undefined;
  const pricing = (record.pricing ?? data?.pricing) as
    | { amount?: number }
    | undefined;
  const display = (record.display ?? data?.display) as
    | { summary?: string }
    | undefined;

  const requirements = Array.isArray(match?.requirements)
    ? match.requirements.filter(
        (req) =>
          !!req &&
          (req.targetType === "group" ||
            req.targetType === "item" ||
            req.targetType === "order-unit") &&
          typeof req.target === "string" &&
          Number(req.qty) > 0,
      )
    : [];

  if (!id || !label || !requirements.length || !Number(pricing?.amount)) {
    return null;
  }

  return {
    id,
    label,
    active,
    priority,
    match: { requirements },
    pricing: { amount: Number(pricing?.amount || 0) },
    display: { summary: String(display?.summary || "").trim() },
  };
}

function joinWithConjunction(parts: string[]) {
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} y ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`;
}

function joinWithConjunctionEn(parts: string[]) {
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

const PRICE_FORMAT = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

/**
 * Pricing + promo-progress domain for the menu page: runtime promo loading,
 * cart pricing (priceMenuOrder), and the "how close am I to a promo" UI cards.
 */
export function useMenuPricing(params: {
  fetchCollection: (...args: any[]) => Promise<{ items: unknown[] }>;
  cart: Record<string, number>;
  menuGroups: ComputedRef<MenuGroupDef[]>;
  groupItems: (key: GroupKey) => PricedMenuItem[];
  isOut: (name: string) => boolean;
  taquizaGroup: MenuGroupDef | undefined;
  taquizaOrderCount: ComputedRef<Record<TaquizaKind, number>>;
  taquizaTotalForName: (name: string) => number;
  itemCount: ComputedRef<number>;
  staffMode: () => boolean;
  useDailyMenu: () => boolean;
  activePromoId?: () => string | null;
}) {
  const {
    fetchCollection,
    cart,
    menuGroups,
    groupItems,
    isOut,
    taquizaGroup,
    taquizaOrderCount,
    taquizaTotalForName,
    itemCount,
    staffMode,
    useDailyMenu,
    activePromoId,
  } = params;

  function money(value: number) {
    return PRICE_FORMAT.format(value || 0);
  }

  const runtimePromos = ref<PricingPromo[]>([]);

  async function loadRuntimePromos() {
    try {
      const res = await fetchCollection(
        "promos",
        1,
        200,
        "active = true",
        "priority",
        null,
        null,
        true,
        { requestKey: "menu_runtime_promos" },
      );

      const promos = res.items
        .map((item) => toRuntimePromo(item as Record<string, any>))
        .filter((item): item is PricingPromo => !!item);

      runtimePromos.value = promos;
    } catch {
      runtimePromos.value = [];
    }
  }

  const effectivePricingConfig = computed<PricingConfig>(() => {
    const promos =
      runtimePromos.value.length > 0
        ? runtimePromos.value
        : menuPricingConfig.promos;
    const preferredId = activePromoId?.();
    const orderedPromos = preferredId
      ? [...promos].sort(
          (left, right) =>
            Number(right.id === preferredId) - Number(left.id === preferredId),
        )
      : promos;

    return { ...menuPricingConfig, promos: orderedPromos };
  });

  function promoRequirementLabel(requirement: PricingPromoRequirement) {
    const groupLabels: Record<string, { es: string; en: string }> = {
      guisos: { es: "Guisos", en: "Stews" },
      caldos: { es: "Caldos", en: "Soups" },
      sides: { es: "Guarniciones", en: "Sides" },
      bebidas: { es: "Bebidas", en: "Drinks" },
    };

    if (requirement.targetType === "group") {
      const mapped = groupLabels[requirement.target];
      if (mapped) return `${mapped.es} / ${mapped.en}`;
      return (
        menuGroups.value.find((group) => group.key === requirement.target)
          ?.label ??
        groupByKey[requirement.target]?.label ??
        requirement.target
      );
    }

    if (requirement.targetType === "order-unit") {
      return (
        effectivePricingConfig.value.orderUnits?.[requirement.target]?.label ??
        requirement.target
      );
    }

    return requirement.target;
  }

  function promoRequirementNoun(
    requirement: PricingPromoRequirement,
    qty: number,
    lang: "es" | "en",
  ) {
    if (requirement.targetType === "group") {
      const nouns: Record<
        string,
        { esSing: string; esPlur: string; enSing: string; enPlur: string }
      > = {
        guisos: {
          esSing: "guiso",
          esPlur: "guisos",
          enSing: "stew",
          enPlur: "stews",
        },
        caldos: {
          esSing: "caldo",
          esPlur: "caldos",
          enSing: "soup",
          enPlur: "soups",
        },
        sides: {
          esSing: "guarnicion",
          esPlur: "guarniciones",
          enSing: "side",
          enPlur: "sides",
        },
        bebidas: {
          esSing: "bebida",
          esPlur: "bebidas",
          enSing: "drink",
          enPlur: "drinks",
        },
      };

      const noun = nouns[requirement.target];
      if (noun) {
        if (lang === "es") return qty === 1 ? noun.esSing : noun.esPlur;
        return qty === 1 ? noun.enSing : noun.enPlur;
      }
    }

    return (
      promoRequirementLabel(requirement)
        .split("/")
        .map((part) => part.trim())[lang === "es" ? 0 : 1] ||
      promoRequirementLabel(requirement)
    );
  }

  function promoSummaryLang(promo: PricingPromo, lang: "es" | "en") {
    return promo.match.requirements
      .map((requirement) => {
        const qty = requirement.qty;
        const noun = promoRequirementNoun(requirement, qty, lang);
        return `${qty} ${noun}`;
      })
      .join(" + ");
  }

  function promoRequirementCurrentQty(requirement: PricingPromoRequirement) {
    if (requirement.targetType === "group") {
      const group = menuGroups.value.find(
        (entry) => entry.key === requirement.target,
      );
      if (!group) return 0;

      return groupItems(group.key).reduce(
        (sum, item) =>
          sum +
          Math.max(0, (cart[item.name] ?? 0) - taquizaTotalForName(item.name)),
        0,
      );
    }

    if (requirement.targetType === "order-unit") {
      if (requirement.target === "taquiza:tacos")
        return taquizaOrderCount.value.tacos;
      if (requirement.target === "taquiza:quesadillas") {
        return taquizaOrderCount.value.quesadillas;
      }
      return 0;
    }

    return Math.max(
      0,
      (cart[requirement.target] ?? 0) - taquizaTotalForName(requirement.target),
    );
  }

  function promoIsAvailableToday(promo: PricingPromo) {
    return promo.match.requirements.every((requirement) => {
      if (requirement.targetType === "group") {
        const group = menuGroups.value.find(
          (entry) => entry.key === requirement.target,
        );
        if (!group) return false;
        const availableCount = groupItems(group.key).filter(
          (item) => !isOut(item.name),
        ).length;
        return availableCount >= requirement.qty;
      }

      if (requirement.targetType === "item") {
        const found = menuGroups.value
          .flatMap((group) => groupItems(group.key))
          .find(
            (item) => item.name === requirement.target && !isOut(item.name),
          );
        return !!found;
      }

      if (!taquizaGroup) return false;
      const taquizaAvailable = groupItems(taquizaGroup.key).filter(
        (item) => !isOut(item.name),
      ).length;
      return taquizaAvailable > 0;
    });
  }

  function promoSummary(promo: PricingPromo) {
    return promoSummaryLang(promo, "es");
  }

  const promoProgressCards = computed<PromoProgressCard[]>(() =>
    effectivePricingConfig.value.promos
      .filter((promo) => promo.active !== false)
      .filter((promo) => promoIsAvailableToday(promo))
      .map((promo) => {
        const requirements: PromoProgressRequirement[] =
          promo.match.requirements.map((requirement) => {
            const current = promoRequirementCurrentQty(requirement);
            const required = requirement.qty;
            const missing = Math.max(0, required - current);
            return {
              id: `${promo.id}-${requirement.targetType}-${requirement.target}`,
              targetType: requirement.targetType,
              target: requirement.target,
              label: promoRequirementLabel(requirement),
              labelEs: promoRequirementNoun(requirement, required, "es"),
              labelEn: promoRequirementNoun(requirement, required, "en"),
              required,
              selected: current,
              current: Math.min(current, required),
              missing,
              met: missing === 0,
            };
          });

        const missingPartsEs = requirements
          .filter((requirement) => requirement.missing > 0)
          .map(
            (requirement) => `${requirement.missing} ${requirement.labelEs}`,
          );

        const missingPartsEn = requirements
          .filter((requirement) => requirement.missing > 0)
          .map(
            (requirement) => `${requirement.missing} ${requirement.labelEn}`,
          );

        const summaryEs =
          promo.display?.summary ?? promoSummaryLang(promo, "es");
        const summaryEn = promoSummaryLang(promo, "en");

        return {
          id: promo.id,
          label: promo.label,
          summary: `${summaryEs} / ${summaryEn}`,
          price: promo.pricing.amount,
          requirements,
          eligible: missingPartsEs.length === 0,
          appliedQty: 0,
          applications: [],
          missingTextEs: joinWithConjunction(missingPartsEs),
          missingTextEn: joinWithConjunctionEn(missingPartsEn),
        };
      }),
  );

  const pricingSummary = computed(() => {
    const standardItems = menuGroups.value.flatMap((group) => {
      if (taquizaGroup && group.key === taquizaGroup.key) return [];

      return groupItems(group.key)
        .map((item) => ({
          name: item.name,
          group: group.key,
          // Resta la porción de taquiza cuando el nombre se comparte, para no
          // cobrar dos veces un guiso que también es relleno de taquiza.
          qty: Math.max(
            0,
            (cart[item.name] ?? 0) - taquizaTotalForName(item.name),
          ),
          unitPrice: item.price ?? 0,
        }))
        .filter((entry) => entry.qty > 0);
    });

    const taquizaUnits = [
      { code: "taquiza:tacos", qty: taquizaOrderCount.value.tacos },
      {
        code: "taquiza:quesadillas",
        qty: taquizaOrderCount.value.quesadillas,
      },
    ]
      .filter((unit) => unit.qty > 0)
      .map((unit) => ({
        code: unit.code,
        qty: unit.qty,
        label: menuPricingConfig.orderUnits?.[unit.code]?.label ?? unit.code,
        unitPrice:
          effectivePricingConfig.value.orderUnits?.[unit.code]?.unitPrice ?? 0,
      }));

    return priceMenuOrder({
      items: standardItems,
      orderUnits: taquizaUnits,
      config: effectivePricingConfig.value,
    });
  });

  const orderSummaryLines = computed(() => pricingSummary.value.lines);

  const promoCardsWithAppliedState = computed(() =>
    promoProgressCards.value.map((promo) => {
      const applications = pricingSummary.value.lines
        .filter((line) => line.kind === "promo" && line.code === promo.id)
        .flatMap((line) => line.promoApplications ?? []);
      const appliedQty = applications.length;
      return {
        ...promo,
        appliedQty,
        applications,
        requirements: promo.requirements.map((requirement) => {
          const current = Math.min(
            requirement.required,
            Math.max(
              0,
              requirement.selected - appliedQty * requirement.required,
            ),
          );
          return {
            ...requirement,
            current,
            missing: requirement.required - current,
            met: current >= requirement.required,
          };
        }),
      };
    }),
  );

  const promoStatusBanner = computed(() => {
    if (staffMode() || !useDailyMenu() || itemCount.value <= 0) return null;

    const appliedPromos = promoCardsWithAppliedState.value.filter(
      (promo) => promo.appliedQty > 0,
    );
    if (appliedPromos.length) {
      const labels = appliedPromos.map((promo) =>
        promo.appliedQty > 1
          ? `${promo.label} x${promo.appliedQty}`
          : promo.label,
      );
      return {
        met: true,
        title: "Promos aplicadas / Applied promos",
        message: labels.join(" · "),
      };
    }

    const nextPromo =
      promoCardsWithAppliedState.value.find(
        (promo) => promo.id === activePromoId?.(),
      ) ?? promoCardsWithAppliedState.value[0];
    if (!nextPromo) return null;

    return {
      met: false,
      title: `Vas en camino a ${nextPromo.label} / You're on track for ${nextPromo.label}`,
      message: `Te falta ${nextPromo.missingTextEs} para activar ${money(nextPromo.price)}. / Missing ${nextPromo.missingTextEn} to activate ${money(nextPromo.price)}.`,
    };
  });

  return {
    money,
    loadRuntimePromos,
    effectivePricingConfig,
    pricingSummary,
    orderSummaryLines,
    promoProgressCards,
    promoCardsWithAppliedState,
    promoStatusBanner,
    promoIsAvailableToday,
    promoSummary,
  };
}
