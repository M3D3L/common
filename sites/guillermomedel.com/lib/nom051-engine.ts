// nom051-engine.ts
// Deterministic NOM-051 calculation engine. Pure functions, no side effects,
// no LLM. Given resolved ingredients ({ key, grams }), produces the full
// nutritional aggregate. Seals and legends are also exported as standalone
// functions so the label renderer can recompute them at render time from
// stored nutrient values — they are never persisted to the database.

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

// ─── Types ───────────────────────────────────────────────────────────────────

/** What the resolver (LLM or frontend) hands the engine per ingredient. */
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
  dishType?: keyof typeof PORTION_MIDPOINTS | null;
}

/**
 * The engine output intentionally OMITS seals and leyendas — those are
 * computed at render time via computeSeals() / computeLeyendas() and are
 * never stored in the database.
 */
export interface EngineOutput {
  portion_size: number;
  total_size: number;
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
}

// ─── Lookup index ────────────────────────────────────────────────────────────

interface Resolved {
  profile: Profile;
  canonicalKey: string;
}

/** Normalize for tolerant matching: lowercase, strip accents, collapse spaces. */
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
  for (const [name, profile] of Object.entries(FALLBACK)) {
    m.set(norm(name), { profile, canonicalKey: name });
  }
  return m;
})();

function resolveKey(key: string, override?: Profile): Resolved {
  if (override) return { profile: override, canonicalKey: key };
  const hit = INDEX.get(norm(key ?? ""));
  if (hit) return hit;
  return {
    profile: FALLBACK["Vegetable (generic)"],
    canonicalKey: "Vegetable (generic)",
  };
}

// ─── Rounding ────────────────────────────────────────────────────────────────

export const roundTo = (n: number, d = 0): number => {
  const f = Math.pow(10, d);
  return Math.round((n + Number.EPSILON) * f) / f;
};

// ─── Aggregation ─────────────────────────────────────────────────────────────

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

  const batch: Record<string, number> = Object.fromEntries(
    NUTRIENT_KEYS.map((k) => [k, 0]),
  );
  let totalWeight = 0;

  for (const item of ingredients) {
    const { profile } = resolveKey(item.key, item.profileOverride);
    const g = Number(item.grams) || 0;
    totalWeight += g;
    for (const k of NUTRIENT_KEYS) {
      batch[k] += (profile[k] / 100) * g;
    }
  }

  const per100 = (v: number) => (totalWeight > 0 ? (v / totalWeight) * 100 : 0);

  const kcal = per100(batch.kcal);

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

  return {
    portion_size: portion,
    total_size: total,
    // Round every per-100g field once here so the database receives clean values.
    energia_kcal_100g: roundTo(kcal),
    energia_kj_100g: roundTo(kcal * 4.184),
    proteina_g_100g: roundTo(per100(batch.protein), 1),
    grasas_totales_g_100g: roundTo(per100(batch.fat), 1),
    grasas_saturadas_g_100g: roundTo(per100(batch.sat), 1),
    grasas_trans_g_100g: roundTo(per100(batch.trans), 1),
    carbohidratos_disponibles_g_100g: roundTo(per100(batch.carb), 1),
    azucares_totales_g_100g: roundTo(per100(batch.sugars), 1),
    azucares_anadidos_g_100g: roundTo(per100(batch.added), 1),
    fibra_g_100g: roundTo(per100(batch.fiber), 1),
    sodio_mg_100g: roundTo(per100(batch.sodium)),
  };
}

// ─── Seal logic (client-side, computed at render time) ───────────────────────
//
// Call this with the stored per-100g values when rendering a label.
// Do NOT persist the result to the database.

export interface SealInput {
  energia_kcal_100g: number;
  grasas_saturadas_g_100g: number;
  grasas_trans_g_100g: number;
  azucares_anadidos_g_100g: number;
  sodio_mg_100g: number;
}

export function computeSeals(o: SealInput): Seal[] {
  const kcal = roundTo(o.energia_kcal_100g);
  const sat = roundTo(o.grasas_saturadas_g_100g, 1);
  const trans = roundTo(o.grasas_trans_g_100g, 1);
  const added = roundTo(o.azucares_anadidos_g_100g, 1);
  const sodium = roundTo(o.sodio_mg_100g);

  const seals: Seal[] = [];

  if (kcal >= 275) seals.push(SEAL_CALORIAS);

  if (kcal > 0 && ((added * 4) / kcal) * 100 >= 10) seals.push(SEAL_AZUCARES);

  if (kcal > 0 && ((sat * 9) / kcal) * 100 >= 10) seals.push(SEAL_SATURADAS);

  if (kcal > 0 && ((trans * 9) / kcal) * 100 >= 1) seals.push(SEAL_TRANS);

  if (sodium >= 300 || (kcal > 0 && sodium / kcal >= 1)) seals.push(SEAL_SODIO);

  return seals;
}

// ─── Legend logic (client-side, computed at render time) ─────────────────────
//
// Two variants:
//   computeLeyendasFromKeys  — preferred when canonical keys are available
//                              (new labels, coming straight from aggregate()).
//   computeLeyendasFromIng   — fallback for records loaded from the database
//                              where only the comma-separated `ing` string is stored.
//
// Neither result should be persisted.

const NONCALORIC_NORM = new Set([...NONCALORIC_SWEETENER].map(norm));
const CAFFEINE_NORM = new Set([...CAFFEINE_SOURCE].map(norm));

/** Use when you have the array of canonical keys from the resolver. */
export function computeLeyendasFromKeys(
  canonicalKeys: string[],
): { text: string }[] {
  const keys = canonicalKeys.map(norm);
  const out: { text: string }[] = [];
  if (keys.some((k) => NONCALORIC_NORM.has(k)))
    out.push({ text: "Contiene edulcorantes, no recomendable en niños" });
  if (keys.some((k) => CAFFEINE_NORM.has(k)))
    out.push({ text: "Contiene cafeína, evitar en niños" });
  return out;
}

/**
 * Use when only the stored `ing` string is available (e.g. loading from DB).
 * Splits on commas and checks each token against the full index so it matches
 * the same keys as the resolver — no ad-hoc substring scanning.
 */
export function computeLeyendasFromIng(ing: string): { text: string }[] {
  const tokens = ing.split(",").map((t) => norm(t.trim()));
  const keys: string[] = [];
  for (const token of tokens) {
    const hit = INDEX.get(token);
    if (hit) keys.push(hit.canonicalKey);
    else keys.push(token); // keep as-is; set membership will simply miss
  }
  return computeLeyendasFromKeys(keys);
}

/** @deprecated Use computeLeyendasFromKeys. Kept for backwards compat. */
export function computeLegends(canonicalKeys: string[]): { text: string }[] {
  return computeLeyendasFromKeys(canonicalKeys);
}
