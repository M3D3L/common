// useNutritionalLabels.ts
// Display/transform layer. The row builder, lot/expiration helpers, and VDR are
// UNCHANGED — they remain the single rounding site for the label. New: a thin
// bridge that runs the deterministic engine over an LLM resolution result.

import { aggregate, type ResolvedIngredient } from "~/lib/nom051-engine";
import { VDR as ENGINE_VDR } from "~/lib/nom051-data";

export const VDR: Record<string, number | null> = ENGINE_VDR;

// %VDR is computed against the PER-PORTION value:
// round((value_per_portion / VDR) * 100). Kept in lockstep with the engine.
export const pct = (valuePortion: number, vdr: number | null): string => {
  if (vdr === null) return "—";
  return `${Math.round((valuePortion / vdr) * 100)} %`;
};

const roundTo = (num: number, decimals = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
};
const g1 = (num: number): string => roundTo(num, 1).toFixed(1);
const int = (num: number): string => `${Math.round(num)}`;

export function transformNutrientsToNOMRows(record: any) {
  const portionSize = Number(record.portion_size ?? 150);
  const totalSize = Number(record.total_size ?? portionSize);
  const factor = portionSize / 100;
  const totalFactor = totalSize / 100;

  const kcal100g = roundTo(Number(record.energia_kcal_100g ?? 0));
  const kj100g = roundTo(Number(record.energia_kj_100g ?? 0));
  const proteina = roundTo(Number(record.proteina_g_100g ?? 0), 1);
  const grasas = roundTo(Number(record.grasas_totales_g_100g ?? 0), 1);
  const sat = roundTo(Number(record.grasas_saturadas_g_100g ?? 0), 1);
  const trans = roundTo(Number(record.grasas_trans_g_100g ?? 0), 1);
  const carbs = roundTo(
    Number(record.carbohidratos_disponibles_g_100g ?? 0),
    1,
  );
  const azucar = roundTo(Number(record.azucares_totales_g_100g ?? 0), 1);
  const azucarAnadido = roundTo(
    Number(record.azucares_anadidos_g_100g ?? 0),
    1,
  );
  const fibra = roundTo(Number(record.fibra_g_100g ?? 0), 1);
  const sodio = roundTo(Number(record.sodio_mg_100g ?? 0));

  return [
    {
      label: "Contenido Energético",
      val100g: `${int(kcal100g)} kcal`,
      valPortion: `${int(kcal100g * factor)} kcal`,
      valTotal: `${int(kcal100g * totalFactor)} kcal`,
      vdr: pct(kcal100g * factor, VDR.kcal),
      sub: false,
    },
    {
      label: "Contenido Energético kJ",
      val100g: `${int(kj100g)} kJ`,
      valPortion: `${int(kj100g * factor)} kJ`,
      valTotal: `${int(kj100g * totalFactor)} kJ`,
      vdr: "—",
      sub: true,
      indent: 1,
    },
    {
      label: "Proteínas",
      val100g: `${g1(proteina)} g`,
      valPortion: `${g1(proteina * factor)} g`,
      valTotal: `${g1(proteina * totalFactor)} g`,
      vdr: pct(proteina * factor, VDR.proteina),
      sub: false,
    },
    {
      label: "Grasas Totales",
      val100g: `${g1(grasas)} g`,
      valPortion: `${g1(grasas * factor)} g`,
      valTotal: `${g1(grasas * totalFactor)} g`,
      vdr: pct(grasas * factor, VDR.grasas),
      sub: false,
    },
    {
      label: "Grasas Saturadas",
      val100g: `${g1(sat)} g`,
      valPortion: `${g1(sat * factor)} g`,
      valTotal: `${g1(sat * totalFactor)} g`,
      vdr: pct(sat * factor, VDR.sat),
      sub: true,
      indent: 1,
    },
    {
      label: "Grasas Trans",
      val100g: `${g1(trans)} g`,
      valPortion: `${g1(trans * factor)} g`,
      valTotal: `${g1(trans * totalFactor)} g`,
      vdr: "—",
      sub: true,
      indent: 1,
    },
    {
      label: "Hidratos de Carbono Disp.",
      val100g: `${g1(carbs)} g`,
      valPortion: `${g1(carbs * factor)} g`,
      valTotal: `${g1(carbs * totalFactor)} g`,
      vdr: pct(carbs * factor, VDR.carbs),
      sub: false,
    },
    {
      label: "Azúcares Totales",
      val100g: `${g1(azucar)} g`,
      valPortion: `${g1(azucar * factor)} g`,
      valTotal: `${g1(azucar * totalFactor)} g`,
      vdr: "—",
      sub: true,
      indent: 1,
    },
    {
      label: "Azúcares Añadidos",
      val100g: `${g1(azucarAnadido)} g`,
      valPortion: `${g1(azucarAnadido * factor)} g`,
      valTotal: `${g1(azucarAnadido * totalFactor)} g`,
      vdr: "—",
      sub: true,
      indent: 2,
    },
    {
      label: "Fibra Dietética",
      val100g: `${g1(fibra)} g`,
      valPortion: `${g1(fibra * factor)} g`,
      valTotal: `${g1(fibra * totalFactor)} g`,
      vdr: pct(fibra * factor, VDR.fibra),
      sub: false,
    },
    {
      label: "Sodio",
      val100g: `${int(sodio)} mg`,
      valPortion: `${int(sodio * factor)} mg`,
      valTotal: `${int(sodio * totalFactor)} mg`,
      vdr: pct(sodio * factor, VDR.sodio),
      sub: false,
      last: true,
    },
  ];
}

// Takes the resolver JSON ({ name, sub, ing, alg, pair, dishType, resolved })
// plus optional user portion/total overrides, runs the deterministic engine,
// and returns a record in the same shape transformRecord expects.
export interface ResolveResult {
  name: string;
  sub: string;
  ing: string;
  alg: string;
  pair: string;
  dishType?: string | null;
  resolved: ResolvedIngredient[];
}

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

  return {
    id: null,
    name: res.name || opts.fallbackName || "Platillo",
    sub: res.sub,
    ing: res.ing,
    alg: res.alg,
    pair: res.pair,
    portion_size: engine.portion_size,
    total_size: engine.total_size,
    nameSize: "11px",
    seals: engine.seals,
    leyendas: engine.leyendas,
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
}

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

export function generateExpiration(
  label: any,
  monthsValid: number = 12,
): string {
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

export function useNutritionalLabels() {
  function transformRecord(record: any) {
    const portion_size = Number(record.portion_size ?? 150);
    const total_size = Number(record.total_size ?? portion_size);
    const { rows: _savedRows, ...cleanRecord } = record;

    return {
      id: cleanRecord.id,
      name: cleanRecord.name,
      sub: cleanRecord.sub,
      ing: cleanRecord.ing,
      alg: cleanRecord.alg,
      pair: cleanRecord.pair,
      portion_size,
      total_size,
      seals: cleanRecord.seals ?? [],
      leyendas: cleanRecord.leyendas ?? [],
      nameSize: cleanRecord.nameSize ?? "11px",
      rows: transformNutrientsToNOMRows({
        ...cleanRecord,
        portion_size,
        total_size,
      }),
    };
  }

  return {
    transformRecord,
    buildRecordFromResolution,
    generateLot,
    generateExpiration,
    VDR,
    pct,
  };
}
