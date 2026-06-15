// nom051-engine.ts
// Deterministic NOM-051 calculation engine. Pure functions, no side effects,
// no LLM. Given resolved ingredients ({ key, grams }), produces the full
// nutritional aggregate, warning seals, and precautionary legends.
//
// The LLM's ONLY job upstream is to map each freeform recipe line to a table
// key and a gram weight (resolution). All arithmetic lives here.

import {
  TABLE,
  FALLBACK,
  CAFFEINE_SOURCE,
  NONCALORIC_SWEETENER,
  PORTION_MIDPOINTS,
  SEAL_CALORIAS,
  SEAL_AZUCARES,
  SEAL_SATURADAS,
  SEAL_TRANS,
  SEAL_SODIO,
  type Profile,
  type Seal,
} from "./nom051-data";

// What the resolver (LLM or frontend) hands the engine per ingredient.
export interface ResolvedIngredient {
  ing: string; // display name (Spanish), no numbers
  key: string; // a TABLE key, a TABLE synonym, or a FALLBACK category name
  grams: number; // resolved weight
  profileOverride?: Profile; // optional explicit per-100g user values
}

export interface EngineInput {
  ingredients: ResolvedIngredient[];
  portionGrams?: number | null;
  totalGrams?: number | null;
  dishType?: keyof typeof PORTION_MIDPOINTS | null; // for auto portion
}

export interface EngineOutput {
  portion_size: number;
  total_size: number;
  // Unrounded per-100g values. The row transformer is the single rounding site.
  energia_kcal_100g: number;
  energia_kj_100g: number;
  proteina_g_100g: number;
  grasas_totales_g_100g: number;
  grasas_saturadas_g_100g: number;
  grasas_trans_g_100g: number;
  carbohidratos_disponibles_g_100g: number;
  azucares_totales_g_100g: number;
  azucares_anadidos_g_100g: number;
  fibra_g_100g: number;
  sodio_mg_100g: number;
  seals: Seal[];
  leyendas: { text: string }[];
}

// ─── Lookup ─────────────────────────────────────────────────────────────────
// Build a fast index once. Keys and synonyms both map to a profile + the
// canonical key (which drives class membership).
interface Resolved {
  profile: Profile;
  canonicalKey: string;
}

// Normalize a key for tolerant matching: lowercase, strip accents, collapse
// whitespace. The resolver occasionally returns "Estevia", "estevia " or a
// synonym; without this, class-set membership (legends) silently misses.
const norm = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ");

const INDEX: Map<string, Resolved> = (() => {
  const m = new Map<string, Resolved>();
  for (const row of TABLE) {
    m.set(norm(row.key), { profile: row.profile, canonicalKey: row.key });
    for (const s of row.syn) {
      m.set(norm(s), { profile: row.profile, canonicalKey: row.key });
    }
  }
  // Fallback category names resolve to themselves.
  for (const [name, profile] of Object.entries(FALLBACK)) {
    m.set(norm(name), { profile, canonicalKey: name });
  }
  return m;
})();

function resolveKey(key: string, override?: Profile): Resolved {
  if (override) return { profile: override, canonicalKey: key };
  const hit = INDEX.get(norm(key ?? ""));
  if (hit) return hit;
  // Defensive: an unknown key falls back to generic vegetable rather than
  // throwing. In practice the resolver should only emit valid keys.
  return {
    profile: FALLBACK["Vegetable (generic)"],
    canonicalKey: "Vegetable (generic)",
  };
}

// ─── Rounding (half-up) ─────────────────────────────────────────────────────
// Single rounding helper used both to finalize engine output and (inside
// computeSeals) to evaluate thresholds on the same values the label prints.
const roundTo = (n: number, d = 0) => {
  const f = Math.pow(10, d);
  return Math.round((n + Number.EPSILON) * f) / f;
};

// ─── Aggregation ────────────────────────────────────────────────────────────
const NUTRIENT_KEYS: (keyof Profile)[] = [
  "kcal",
  "protein",
  "fat",
  "sat",
  "trans",
  "carb",
  "sugars",
  "added",
  "fiber",
  "sodium",
];

export function aggregate(input: EngineInput): EngineOutput {
  const { ingredients } = input;

  // Batch totals: sum of (per100g / 100 * grams) for each nutrient.
  const batch: Record<string, number> = Object.fromEntries(
    NUTRIENT_KEYS.map((k) => [k, 0]),
  );
  let totalWeight = 0;
  const canonicalKeys: string[] = [];

  for (const item of ingredients) {
    const { profile, canonicalKey } = resolveKey(
      item.key,
      item.profileOverride,
    );
    canonicalKeys.push(canonicalKey);
    const g = Number(item.grams) || 0;
    totalWeight += g;
    for (const k of NUTRIENT_KEYS) {
      batch[k] += (profile[k] / 100) * g;
    }
  }

  // Per-100g = batch / totalWeight * 100. Guard against empty recipe.
  const per100 = (v: number) => (totalWeight > 0 ? (v / totalWeight) * 100 : 0);

  const kcal = per100(batch.kcal);
  const out: EngineOutput = {
    portion_size: 0, // filled below
    total_size: 0,
    energia_kcal_100g: kcal,
    energia_kj_100g: kcal * 4.184,
    proteina_g_100g: per100(batch.protein),
    grasas_totales_g_100g: per100(batch.fat),
    grasas_saturadas_g_100g: per100(batch.sat),
    grasas_trans_g_100g: per100(batch.trans),
    carbohidratos_disponibles_g_100g: per100(batch.carb),
    azucares_totales_g_100g: per100(batch.sugars),
    azucares_anadidos_g_100g: per100(batch.added),
    fibra_g_100g: per100(batch.fiber),
    sodio_mg_100g: per100(batch.sodium),
    seals: [],
    leyendas: [],
  };

  // ── Portion / total resolution ──
  const total =
    input.totalGrams != null && input.totalGrams > 0
      ? input.totalGrams
      : totalWeight;
  let portion: number;
  if (input.portionGrams != null && input.portionGrams > 0) {
    portion = input.portionGrams;
  } else {
    const mid = input.dishType ? PORTION_MIDPOINTS[input.dishType] : 200;
    portion = Math.min(mid ?? 200, total > 0 ? total : (mid ?? 200));
  }
  out.total_size = total;
  out.portion_size = portion;

  // ── Seals + legends, computed on the UNROUNDED values via computeSeals,
  //    which rounds internally to match the printed label. Order matters:
  //    evaluate seals BEFORE we overwrite out.* with rounded numbers, so the
  //    threshold math uses the same rounded values computeSeals derives.
  out.seals = computeSeals(out);
  out.leyendas = computeLegends(canonicalKeys);

  // ── Round every per-100g field so no raw float ever reaches the label or
  //    the database. The row transformer rounds again (harmlessly) on display;
  //    this guarantees correctness even if a raw engine record is rendered
  //    directly without going through transformNutrientsToNOMRows.
  out.energia_kcal_100g = roundTo(out.energia_kcal_100g);
  out.energia_kj_100g = roundTo(out.energia_kj_100g);
  out.proteina_g_100g = roundTo(out.proteina_g_100g, 1);
  out.grasas_totales_g_100g = roundTo(out.grasas_totales_g_100g, 1);
  out.grasas_saturadas_g_100g = roundTo(out.grasas_saturadas_g_100g, 1);
  out.grasas_trans_g_100g = roundTo(out.grasas_trans_g_100g, 1);
  out.carbohidratos_disponibles_g_100g = roundTo(
    out.carbohidratos_disponibles_g_100g,
    1,
  );
  out.azucares_totales_g_100g = roundTo(out.azucares_totales_g_100g, 1);
  out.azucares_anadidos_g_100g = roundTo(out.azucares_anadidos_g_100g, 1);
  out.fibra_g_100g = roundTo(out.fibra_g_100g, 1);
  out.sodio_mg_100g = roundTo(out.sodio_mg_100g);

  return out;
}

// ─── Seal logic ─────────────────────────────────────────────────────────────
export function computeSeals(o: EngineOutput): Seal[] {
  const kcal = roundTo(o.energia_kcal_100g);
  const sat = roundTo(o.grasas_saturadas_g_100g, 1);
  const trans = roundTo(o.grasas_trans_g_100g, 1);
  const added = roundTo(o.azucares_anadidos_g_100g, 1);
  const sodium = roundTo(o.sodio_mg_100g);

  const seals: Seal[] = [];

  // 1. Calorías
  if (kcal >= 275) seals.push(SEAL_CALORIAS);

  // 2. Azúcares: (added*4 / kcal) * 100 >= 10
  if (kcal > 0 && ((added * 4) / kcal) * 100 >= 10) seals.push(SEAL_AZUCARES);

  // 3. Grasas saturadas: (sat*9 / kcal) * 100 >= 10
  if (kcal > 0 && ((sat * 9) / kcal) * 100 >= 10) seals.push(SEAL_SATURADAS);

  // 4. Grasas trans: (trans*9 / kcal) * 100 >= 1
  if (kcal > 0 && ((trans * 9) / kcal) * 100 >= 1) seals.push(SEAL_TRANS);

  // 5. Sodio: sodium >= 300 OR (sodium / kcal) >= 1
  if (sodium >= 300 || (kcal > 0 && sodium / kcal >= 1)) seals.push(SEAL_SODIO);

  return seals; // already in canonical order
}

// ─── Legend logic ───────────────────────────────────────────────────────────
// Pre-normalized class sets so membership tests are immune to case/accents.
const NONCALORIC_NORM = new Set([...NONCALORIC_SWEETENER].map(norm));
const CAFFEINE_NORM = new Set([...CAFFEINE_SOURCE].map(norm));

export function computeLegends(canonicalKeys: string[]): { text: string }[] {
  const out: { text: string }[] = [];
  const keys = canonicalKeys.map(norm);
  const hasNoncaloric = keys.some((k) => NONCALORIC_NORM.has(k));
  const hasCaffeine = keys.some((k) => CAFFEINE_NORM.has(k));
  if (hasNoncaloric)
    out.push({ text: "Contiene edulcorantes, no recomendable en niños" });
  if (hasCaffeine) out.push({ text: "Contiene cafeína, evitar en niños" });
  return out;
}
