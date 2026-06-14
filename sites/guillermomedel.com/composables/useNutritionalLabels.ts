export const VDR: Record<string, number | null> = {
  kcal: 2000,
  proteina: 50,
  grasas: 65,
  sat: 20,
  trans: null,
  carbs: 300,
  azucar: null,
  azucarAnadido: null,
  fibra: 25,
  sodio: 2000,
};

// NOM-051 requires VDR to be based strictly on the 100g baseline values
export const pct = (value100g: number, vdr: number | null): string => {
  if (vdr === null) return "—";
  return `${Math.round((value100g / vdr) * 100)} %`;
};

// Standardized rounding helper to match deterministic rules safely
const roundHalfUp = (num: number, decimals: number = 0): string => {
  const factor = Math.pow(10, decimals);
  return (Math.round(num * factor) / factor).toFixed(decimals);
};

export function transformNutrientsToNOMRows(record: any) {
  const portionSize = Number(record.portion_size ?? 150);
  const totalSize = Number(record.total_size ?? portionSize);
  const factor = portionSize / 100;
  const totalFactor = totalSize / 100;

  const kcal100g = Number(record.energia_kcal_100g ?? 0);
  const kj100g = Number(record.energia_kj_100g ?? 0);
  const proteina = Number(record.proteina_g_100g ?? 0);
  const grasas = Number(record.grasas_totales_g_100g ?? 0);
  const sat = Number(record.grasas_saturadas_g_100g ?? 0);
  const trans = Number(record.grasas_trans_g_100g ?? 0);
  const carbs = Number(record.carbohidratos_disponibles_g_100g ?? 0);
  const azucar = Number(record.azucares_totales_g_100g ?? 0);
  const azucarAnadido = Number(record.azucares_anadidos_g_100g ?? 0);
  const fibra = Number(record.fibra_g_100g ?? 0);
  const sodio = Number(record.sodio_mg_100g ?? 0);

  return [
    {
      label: "Contenido Energético",
      val100g: `${kcal100g} kcal`,
      valPortion: `${Math.round(kcal100g * factor)} kcal`,
      valTotal: `${Math.round(kcal100g * totalFactor)} kcal`,
      vdr: pct(kcal100g, VDR.kcal),
      sub: false,
    },
    {
      label: "Contenido Energético kJ",
      val100g: `${kj100g} kJ`,
      valPortion: `${Math.round(kj100g * factor)} kJ`,
      valTotal: `${Math.round(kj100g * totalFactor)} kJ`,
      vdr: "—",
      sub: true,
      indent: 1,
    },
    {
      label: "Proteínas",
      val100g: `${proteina} g`,
      valPortion: `${roundHalfUp(proteina * factor, 1)} g`,
      vdr: pct(proteina, VDR.proteina),
      sub: false,
    },
    {
      label: "Grasas Totales",
      val100g: `${grasas} g`,
      valPortion: `${roundHalfUp(grasas * factor, 1)} g`,
      vdr: pct(grasas, VDR.grasas),
      sub: false,
    },
    {
      label: "Grasas Saturadas",
      val100g: `${sat} g`,
      valPortion: `${roundHalfUp(sat * factor, 1)} g`,
      vdr: pct(sat, VDR.sat),
      sub: true,
      indent: 1,
    },
    {
      label: "Grasas Trans",
      val100g: `${trans} g`,
      valPortion: `${roundHalfUp(trans * factor, 1)} g`,
      vdr: "—",
      sub: true,
      indent: 1,
    },
    {
      label: "Hidratos de Carbono Disp.",
      val100g: `${carbs} g`,
      valPortion: `${roundHalfUp(carbs * factor, 1)} g`,
      vdr: pct(carbs, VDR.carbs),
      sub: false,
    },
    {
      label: "Azúcares Totales",
      val100g: `${azucar} g`,
      valPortion: `${roundHalfUp(azucar * factor, 1)} g`,
      vdr: "—",
      sub: true,
      indent: 1,
    },
    {
      label: "Azúcares Añadidos",
      val100g: `${azucarAnadido} g`,
      valPortion: `${roundHalfUp(azucarAnadido * factor, 1)} g`,
      vdr: "—",
      sub: true,
      indent: 2,
    },
    {
      label: "Fibra Dietética",
      val100g: `${fibra} g`,
      valPortion: `${roundHalfUp(fibra * factor, 1)} g`,
      vdr: pct(fibra, VDR.fibra),
      sub: false,
    },
    {
      label: "Sodio",
      val100g: `${sodio} mg`,
      valPortion: `${Math.round(sodio * factor)} mg`,
      vdr: pct(sodio, VDR.sodio),
      sub: false,
      last: true,
    },
  ];
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

// Transforms a raw PocketBase record into the shape BreezyLabels expects.
// Use this on every page that feeds BreezyLabels so the mapping stays in one place.
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

  return { transformRecord, generateLot, generateExpiration, VDR, pct };
}
