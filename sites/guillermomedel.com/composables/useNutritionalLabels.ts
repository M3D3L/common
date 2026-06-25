// Composable for nutritional label transformation and helpers.
//
// KEY DESIGN DECISION:
//   seals and leyendas are NEVER stored in the database.
//   They are fully derivable from the nutrient values (seals) and the `ing`
//   string (leyendas). Computing them at render time means:
//     • NOM-051 threshold changes are reflected on all existing records instantly.
//     • The DB schema stays lean (no JSON columns for seals/leyendas).
//     • There is no risk of stale seal data diverging from nutrient values.

import {
  aggregate,
  computeSeals,
  computeLeyendasFromKeys,
  computeLeyendasFromIng,
  type ResolvedIngredient,
} from "~/lib/nom051-engine";
import { VDR as ENGINE_VDR } from "~/lib/nom051-data";

export { computeSeals, computeLeyendasFromIng };

// ─── VDR ─────────────────────────────────────────────────────────────────────

export const VDR: Record<string, number | null> = ENGINE_VDR;

export const pct = (valuePortion: number, vdr: number | null): string => {
  if (vdr === null) return "—";
  return `${Math.round((valuePortion / vdr) * 100)} %`;
};

// ─── Rounding helpers ─────────────────────────────────────────────────────────

const roundTo = (num: number, decimals = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

const formatG1 = (num: number): string => roundTo(num, 1).toFixed(1);
const formatInt = (num: number): string => `${Math.round(num)}`;

// ─── Row builder ──────────────────────────────────────────────────────────────
//
// Converts a stored (or freshly computed) nutrient record into the rows array
// that LabelGenerator.vue renders. This is the single rounding site for display.

export function transformNutrientsToNOMRows(record: any) {
  const portionSize = Number(record.portion_size ?? 150);
  const totalSize = Number(record.total_size ?? portionSize);
  const factor = portionSize / 100;
  const totalFactor = totalSize / 100;

  const kcalRaw = Number(record.energia_kcal_100g ?? 0);
  const kjRaw = Number(record.energia_kj_100g ?? 0);
  const protRaw = Number(record.proteina_g_100g ?? 0);
  const grasasRaw = Number(record.grasas_totales_g_100g ?? 0);
  const satRaw = Number(record.grasas_saturadas_g_100g ?? 0);
  const transRaw = Number(record.grasas_trans_g_100g ?? 0);
  const carbsRaw = Number(record.carbohidratos_disponibles_g_100g ?? 0);
  const azucarRaw = Number(record.azucares_totales_g_100g ?? 0);
  const azucarAnadidoRaw = Number(record.azucares_anadidos_g_100g ?? 0);
  const fibraRaw = Number(record.fibra_g_100g ?? 0);
  const sodioRaw = Number(record.sodio_mg_100g ?? 0);

  return [
    {
      label: "Contenido Energético",
      val100g: `${formatInt(kcalRaw)} kcal`,
      valPortion: `${formatInt(kcalRaw * factor)} kcal`,
      valTotal: `${formatInt(kcalRaw * totalFactor)} kcal`,
      vdr: pct(kcalRaw * factor, VDR.kcal),
      sub: false,
    },
    {
      label: "Contenido Energético kJ",
      val100g: `${formatInt(kjRaw)} kJ`,
      valPortion: `${formatInt(kjRaw * factor)} kJ`,
      valTotal: `${formatInt(kjRaw * totalFactor)} kJ`,
      vdr: "—",
      sub: true,
      indent: 1,
    },
    {
      label: "Proteínas",
      val100g: `${formatG1(protRaw)} g`,
      valPortion: `${formatG1(protRaw * factor)} g`,
      valTotal: `${formatG1(protRaw * totalFactor)} g`,
      vdr: pct(protRaw * factor, VDR.proteina),
      sub: false,
    },
    {
      label: "Grasas Totales",
      val100g: `${formatG1(grasasRaw)} g`,
      valPortion: `${formatG1(grasasRaw * factor)} g`,
      valTotal: `${formatG1(grasasRaw * totalFactor)} g`,
      vdr: pct(grasasRaw * factor, VDR.grasas),
      sub: false,
    },
    {
      label: "Grasas Saturadas",
      val100g: `${formatG1(satRaw)} g`,
      valPortion: `${formatG1(satRaw * factor)} g`,
      valTotal: `${formatG1(satRaw * totalFactor)} g`,
      vdr: pct(satRaw * factor, VDR.sat),
      sub: true,
      indent: 1,
    },
    {
      label: "Grasas Trans",
      val100g: `${formatG1(transRaw)} g`,
      valPortion: `${formatG1(transRaw * factor)} g`,
      valTotal: `${formatG1(transRaw * totalFactor)} g`,
      vdr: "—",
      sub: true,
      indent: 1,
    },
    {
      label: "Hidratos de Carbono Disp.",
      val100g: `${formatG1(carbsRaw)} g`,
      valPortion: `${formatG1(carbsRaw * factor)} g`,
      valTotal: `${formatG1(carbsRaw * totalFactor)} g`,
      vdr: pct(carbsRaw * factor, VDR.carbs),
      sub: false,
    },
    {
      label: "Azúcares Totales",
      val100g: `${formatG1(azucarRaw)} g`,
      valPortion: `${formatG1(azucarRaw * factor)} g`,
      valTotal: `${formatG1(azucarRaw * totalFactor)} g`,
      vdr: "—",
      sub: true,
      indent: 1,
    },
    {
      label: "Azúcares Añadidos",
      val100g: `${formatG1(azucarAnadidoRaw)} g`,
      valPortion: `${formatG1(azucarAnadidoRaw * factor)} g`,
      valTotal: `${formatG1(azucarAnadidoRaw * totalFactor)} g`,
      vdr: "—",
      sub: true,
      indent: 2,
    },
    {
      label: "Fibra Dietética",
      val100g: `${formatG1(fibraRaw)} g`,
      valPortion: `${formatG1(fibraRaw * factor)} g`,
      valTotal: `${formatG1(fibraRaw * totalFactor)} g`,
      vdr: pct(fibraRaw * factor, VDR.fibra),
      sub: false,
    },
    {
      label: "Sodio",
      val100g: `${formatInt(sodioRaw)} mg`,
      valPortion: `${formatInt(sodioRaw * factor)} mg`,
      valTotal: `${formatInt(sodioRaw * totalFactor)} mg`,
      vdr: pct(sodioRaw * factor, VDR.sodio),
      sub: false,
      last: true,
    },
  ];
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NutritionOverride {
  energia_kcal_100g?: number | null;
  energia_kj_100g?: number | null;
  proteina_g_100g?: number | null;
  grasas_totales_g_100g?: number | null;
  grasas_saturadas_g_100g?: number | null;
  grasas_trans_g_100g?: number | null;
  carbohidratos_disponibles_g_100g?: number | null;
  azucares_totales_g_100g?: number | null;
  azucares_anadidos_g_100g?: number | null;
  fibra_g_100g?: number | null;
  sodio_mg_100g?: number | null;
}

export interface ResolveResult {
  name: string;
  sub: string;
  ing: string;
  alg: string;
  pair: string;
  dishType?: string | null;
  resolved: ResolvedIngredient[];
  nutrition_override?: NutritionOverride | null;
}

// ─── buildRecordFromResolution ────────────────────────────────────────────────
//
// Runs the deterministic engine and returns a record ready for the DB save
// (no seals/leyendas) and for immediate display (seals/leyendas attached but
// not persisted).
//
// If the resolver found explicit nutritional values in the user's text
// (res.nutrition_override), those values replace the engine-computed ones
// before seals are evaluated — so seals always reflect the final numbers.

export function buildRecordFromResolution(
  res: ResolveResult,
  opts: {
    portionGrams?: number | null;
    totalGrams?: number | null;
    fallbackName?: string;
  },
) {
  const engine = aggregate({
    ingredients: res.resolved ?? [],
    portionGrams: opts.portionGrams ?? null,
    totalGrams: opts.totalGrams ?? null,
    dishType: (res.dishType as any) ?? "main",
  });

  // Start from engine output, then apply any user-supplied overrides.
  const nutrients = {
    energia_kcal_100g: engine.energia_kcal_100g,
    energia_kj_100g: engine.energia_kj_100g,
    proteina_g_100g: engine.proteina_g_100g,
    grasas_totales_g_100g: engine.grasas_totales_g_100g,
    grasas_saturadas_g_100g: engine.grasas_saturadas_g_100g,
    grasas_trans_g_100g: engine.grasas_trans_g_100g,
    carbohidratos_disponibles_g_100g: engine.carbohidratos_disponibles_g_100g,
    azucares_totales_g_100g: engine.azucares_totales_g_100g,
    azucares_anadidos_g_100g: engine.azucares_anadidos_g_100g,
    fibra_g_100g: engine.fibra_g_100g,
    sodio_mg_100g: engine.sodio_mg_100g,
  };

  const ov = res.nutrition_override;
  if (ov) {
    for (const key of Object.keys(nutrients) as (keyof typeof nutrients)[]) {
      const val = ov[key];
      if (val != null && !isNaN(val)) {
        nutrients[key] = val;
      }
    }
    // Auto-derive kJ when the user only provided kcal
    if (ov.energia_kcal_100g != null && ov.energia_kj_100g == null) {
      nutrients.energia_kj_100g = nutrients.energia_kcal_100g * 4.184;
    }
  }

  // Seals and leyendas computed from final (possibly overridden) nutrients.
  const canonicalKeys = (res.resolved ?? []).map((r) => r.key);
  const seals = computeSeals(nutrients);
  const leyendas = computeLeyendasFromKeys(canonicalKeys);

  return {
    id: null,
    name: res.name || opts.fallbackName || "Platillo",
    sub: res.sub,
    ing: res.ing,
    alg: res.alg,
    pair: res.pair,
    nameSize: "11px",
    portion_size: engine.portion_size,
    total_size: engine.total_size,
    // ── Nutrient values (stored in DB) ──
    ...nutrients,
    // ── Derived at runtime, NOT stored ──
    seals,
    leyendas,
  };
}

// ─── transformRecord ──────────────────────────────────────────────────────────
//
// Converts a raw DB record into a full display record.
// Seals and leyendas are (re)computed here from stored nutrient values and the
// `ing` string — never read from the database.

export function transformRecord(record: any) {
  const portion_size = Number(record.portion_size ?? 150);
  const total_size = Number(record.total_size ?? portion_size);
  const {
    rows: _savedRows,
    seals: _storedSeals,
    leyendas: _storedLeyendas,
    ...cleanRecord
  } = record;

  // Recompute from nutrient values (no ing scan needed for seals).
  const seals = computeSeals({
    energia_kcal_100g: Number(cleanRecord.energia_kcal_100g ?? 0),
    grasas_saturadas_g_100g: Number(cleanRecord.grasas_saturadas_g_100g ?? 0),
    grasas_trans_g_100g: Number(cleanRecord.grasas_trans_g_100g ?? 0),
    azucares_anadidos_g_100g: Number(cleanRecord.azucares_anadidos_g_100g ?? 0),
    sodio_mg_100g: Number(cleanRecord.sodio_mg_100g ?? 0),
  });

  // Leyendas need the ingredient identity — derive from the stored `ing` string.
  const leyendas = computeLeyendasFromIng(cleanRecord.ing ?? "");

  return {
    ...cleanRecord,
    portion_size,
    total_size,
    seals,
    leyendas,
    nameSize: cleanRecord.nameSize ?? "11px",
    rows: transformNutrientsToNOMRows({
      ...cleanRecord,
      portion_size,
      total_size,
    }),
    expiration: record?.expiration || generateExpiration(record),
  };
}

// ─── Lot / expiration helpers ─────────────────────────────────────────────────

export function generateLot(label: any): string {
  const now = new Date();
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const initials = (label.name as string)
    .split(/\s+/)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 4);
  const raw = label.name + datePart;
  let crc = 0;
  for (let i = 0; i < raw.length; i++) {
    crc = ((crc << 1) ^ (raw.charCodeAt(i) & 0xff)) & 0xff;
  }
  const checksum = crc.toString(16).toUpperCase().padStart(2, "0");
  return `${initials}-${datePart}-${checksum}`;
}

export function generateExpiration(label: any, monthsValid = 12): string {
  const now = new Date();
  const expDate = new Date(
    now.getFullYear(),
    now.getMonth() + monthsValid,
    now.getDate(),
  );
  const day = String(expDate.getDate()).padStart(2, "0");
  const month = String(expDate.getMonth() + 1).padStart(2, "0");
  const year = expDate.getFullYear();
  const datePart = `${day}/${month}/${year}`;
  const rawData = label.name + day + month + year;
  let crc = 0;
  for (let i = 0; i < rawData.length; i++) {
    crc = ((crc << 1) ^ (rawData.charCodeAt(i) & 0xff)) & 0xff;
  }
  const checksum = crc.toString(16).toUpperCase().padStart(2, "0");
  return `${datePart}-${checksum}`;
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useNutritionalLabels() {
  return {
    transformRecord,
    buildRecordFromResolution,
    generateLot,
    generateExpiration,
    VDR,
    pct,
  };
}
