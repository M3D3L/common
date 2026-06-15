// nom051-data.ts
// Single source of truth for NOM-051 nutrition data.
// Transcribed verbatim from the original NOM051_COMMAND embedded table.
// No logic here — only data. The engine consumes this.

export interface Profile {
  kcal: number;
  protein: number;
  fat: number;
  sat: number;
  trans: number;
  carb: number; // available carbohydrate
  sugars: number; // total sugars
  added: number; // added sugars
  fiber: number;
  sodium: number; // mg per 100 g
}

// Helper so the table below reads like the prompt's columns:
// kcal | protein | fat | sat | trans | carb | sugars | added | fiber | sodium
const P = (
  kcal: number,
  protein: number,
  fat: number,
  sat: number,
  trans: number,
  carb: number,
  sugars: number,
  added: number,
  fiber: number,
  sodium: number,
): Profile => ({
  kcal,
  protein,
  fat,
  sat,
  trans,
  carb,
  sugars,
  added,
  fiber,
  sodium,
});

export interface TableRow {
  key: string;
  syn: string[];
  profile: Profile;
}

// ─── EMBEDDED NUTRITION TABLE (per 100 g) ───────────────────────────────────
export const TABLE: TableRow[] = [
  // MEATS / PROTEIN
  {
    key: "pechuga de pollo",
    syn: ["pollo", "chicken breast"],
    profile: P(120, 22.5, 2.6, 0.6, 0, 0, 0, 0, 0, 65),
  },
  {
    key: "muslo de pollo",
    syn: ["chicken thigh"],
    profile: P(177, 18.0, 11.0, 3.0, 0, 0, 0, 0, 0, 80),
  },
  {
    key: "carne de res molida",
    syn: ["res", "ground beef"],
    profile: P(250, 26.0, 15.0, 6.0, 0.5, 0, 0, 0, 0, 75),
  },
  {
    key: "cerdo",
    syn: ["puerco", "pork"],
    profile: P(242, 27.0, 14.0, 5.0, 0, 0, 0, 0, 0, 62),
  },
  {
    key: "pescado",
    syn: ["filete de pescado", "white fish"],
    profile: P(96, 21.0, 1.2, 0.3, 0, 0, 0, 0, 0, 76),
  },
  {
    key: "camaron",
    syn: ["shrimp"],
    profile: P(99, 24.0, 0.3, 0.1, 0, 0.2, 0, 0, 0, 111),
  },
  {
    key: "huevo",
    syn: ["egg"],
    profile: P(143, 13.0, 9.5, 3.1, 0, 0.7, 0.4, 0, 0, 142),
  },
  {
    key: "tofu",
    syn: [],
    profile: P(76, 8.0, 4.8, 0.7, 0, 1.9, 0.6, 0, 0.3, 7),
  },
  {
    key: "jamon",
    syn: ["ham"],
    profile: P(145, 18.0, 7.0, 2.5, 0, 1.5, 1.0, 0, 0, 1200),
  },

  // VEGETABLES / AROMATICS
  {
    key: "tomate",
    syn: ["jitomate", "tomato"],
    profile: P(18, 0.9, 0.2, 0.0, 0, 2.9, 2.6, 0, 1.2, 5),
  },
  {
    key: "cebolla",
    syn: ["onion"],
    profile: P(40, 1.1, 0.1, 0.0, 0, 7.6, 4.2, 0, 1.7, 4),
  },
  {
    key: "apio",
    syn: ["celery"],
    profile: P(16, 0.7, 0.2, 0.0, 0, 1.4, 1.3, 0, 1.6, 80),
  },
  {
    key: "chile verde",
    syn: ["serrano", "jalapeno", "green chile"],
    profile: P(32, 1.7, 0.4, 0.0, 0, 4.0, 3.5, 0, 3.7, 7),
  },
  {
    key: "chile morron",
    syn: ["pimiento", "bell pepper"],
    profile: P(26, 1.0, 0.3, 0.0, 0, 4.7, 2.4, 0, 1.7, 4),
  },
  {
    key: "ajo",
    syn: ["garlic"],
    profile: P(149, 6.4, 0.5, 0.1, 0, 30.0, 1.0, 0, 2.1, 17),
  },
  {
    key: "cilantro",
    syn: ["coriander"],
    profile: P(23, 2.1, 0.5, 0.0, 0, 0.9, 0.9, 0, 2.8, 46),
  },
  {
    key: "zanahoria",
    syn: ["carrot"],
    profile: P(41, 0.9, 0.2, 0.0, 0, 7.0, 4.7, 0, 2.8, 69),
  },
  {
    key: "papa",
    syn: ["patata", "potato"],
    profile: P(77, 2.0, 0.1, 0.0, 0, 17.0, 0.8, 0, 2.2, 6),
  },
  {
    key: "espinaca",
    syn: ["spinach"],
    profile: P(23, 2.9, 0.4, 0.0, 0, 1.4, 0.4, 0, 2.2, 79),
  },
  {
    key: "brocoli",
    syn: ["broccoli"],
    profile: P(34, 2.8, 0.4, 0.0, 0, 4.0, 1.7, 0, 2.6, 33),
  },

  // GRAINS / STARCHES
  {
    key: "arroz cocido",
    syn: ["arroz", "rice cooked"],
    profile: P(130, 2.7, 0.3, 0.1, 0, 28.0, 0.1, 0, 0.4, 1),
  },
  {
    key: "arroz crudo",
    syn: ["rice raw"],
    profile: P(365, 7.0, 0.7, 0.2, 0, 79.0, 0.1, 0, 1.3, 5),
  },
  {
    key: "frijol cocido",
    syn: ["frijol", "beans cooked"],
    profile: P(127, 8.7, 0.5, 0.1, 0, 18.0, 0.3, 0, 6.4, 1),
  },
  {
    key: "pasta cocida",
    syn: ["pasta", "fideo"],
    profile: P(158, 5.8, 0.9, 0.2, 0, 30.0, 0.6, 0, 1.8, 1),
  },
  {
    key: "tortilla de maiz",
    syn: ["tortilla"],
    profile: P(218, 5.7, 2.9, 0.4, 0, 40.0, 0.8, 0, 4.5, 45),
  },
  {
    key: "harina",
    syn: ["flour", "harina de trigo"],
    profile: P(364, 10.0, 1.0, 0.2, 0, 76.0, 0.3, 0, 2.7, 2),
  },
  {
    key: "maicena",
    syn: ["fecula", "cornstarch", "almidon"],
    profile: P(381, 0.3, 0.1, 0.0, 0, 91.0, 0, 0, 0.9, 9),
  },
  {
    key: "avena",
    syn: ["oats"],
    profile: P(389, 17.0, 7.0, 1.2, 0, 56.0, 1.0, 0, 10.0, 2),
  },
  {
    key: "pan",
    syn: ["bread", "pan de caja"],
    profile: P(265, 9.0, 3.2, 0.7, 0, 49.0, 5.0, 3.0, 2.7, 491),
  },

  // DAIRY
  {
    key: "leche",
    syn: ["milk", "leche entera"],
    profile: P(61, 3.2, 3.3, 1.9, 0.1, 4.8, 5.1, 0, 0, 43),
  },
  {
    key: "queso",
    syn: ["cheese", "queso fresco"],
    profile: P(350, 25.0, 27.0, 17.0, 1.0, 1.3, 0.5, 0, 0, 620),
  },
  {
    key: "yogurt natural",
    syn: ["yogur"],
    profile: P(61, 3.5, 3.3, 2.1, 0, 4.7, 4.7, 0, 0, 46),
  },
  {
    key: "crema",
    syn: ["cream"],
    profile: P(340, 2.8, 36.0, 23.0, 1.0, 3.0, 3.0, 0, 0, 38),
  },

  // FATS / OILS
  {
    key: "aceite",
    syn: ["aceite vegetal", "oil"],
    profile: P(884, 0, 100.0, 14.0, 0, 0, 0, 0, 0, 2),
  },
  {
    key: "aceite de oliva",
    syn: ["olive oil"],
    profile: P(884, 0, 100.0, 14.0, 0, 0, 0, 0, 0, 2),
  },
  {
    key: "aceite de sesamo",
    syn: ["sesame oil"],
    profile: P(884, 0, 100.0, 14.0, 0, 0, 0, 0, 0, 0),
  },
  {
    key: "mantequilla",
    syn: ["butter"],
    profile: P(717, 0.9, 81.0, 51.0, 3.0, 0.1, 0.1, 0, 0, 643),
  },
  {
    key: "margarina",
    syn: ["margarine"],
    profile: P(717, 0.2, 81.0, 16.0, 14.0, 0.7, 0, 0, 0, 751),
  },
  {
    key: "manteca",
    syn: ["lard"],
    profile: P(902, 0, 100.0, 39.0, 0, 0, 0, 0, 0, 0),
  },

  // CONDIMENTS / HIGH-SODIUM / SAUCES
  {
    key: "sal",
    syn: ["sal gruesa", "sal de mesa", "salt"],
    profile: P(0, 0, 0, 0, 0, 0, 0, 0, 0, 38758),
  },
  {
    key: "sal con ajo",
    syn: ["garlic salt", "sal de ajo"],
    profile: P(40, 1.5, 0.3, 0.0, 0, 9.0, 0.5, 0, 0.5, 29000),
  },
  {
    key: "salsa de soya",
    syn: ["soya", "soy sauce"],
    profile: P(53, 8.0, 0.6, 0.1, 0, 4.9, 0.4, 0, 0.8, 5493),
  },
  {
    key: "salsa inglesa",
    syn: ["worcestershire"],
    profile: P(78, 0, 0, 0, 0, 19.0, 10.0, 8.0, 0, 980),
  },
  {
    key: "vinagre",
    syn: ["vinegar"],
    profile: P(18, 0, 0, 0, 0, 0.9, 0.4, 0, 0, 5),
  },
  {
    key: "caldo de pollo",
    syn: ["caldo", "broth"],
    profile: P(7, 0.5, 0.2, 0.1, 0, 0.5, 0.3, 0, 0, 326),
  },
  {
    key: "consome en polvo",
    syn: ["consome", "bouillon"],
    profile: P(200, 13.0, 9.0, 4.0, 0, 17.0, 3.0, 0, 0, 24000),
  },
  {
    key: "pimienta",
    syn: ["pimienta negra", "black pepper"],
    profile: P(251, 10.0, 3.3, 1.4, 0, 39.0, 0.6, 0, 25.0, 20),
  },

  // SWEETENERS — CALORIC
  {
    key: "azucar",
    syn: ["sugar", "azucar blanca"],
    profile: P(387, 0, 0, 0, 0, 100.0, 100.0, 100.0, 0, 1),
  },
  {
    key: "miel",
    syn: ["honey"],
    profile: P(304, 0.3, 0, 0, 0, 82.0, 82.0, 82.0, 0.2, 4),
  },
  {
    key: "agave",
    syn: ["jarabe de agave"],
    profile: P(310, 0, 0, 0, 0, 76.0, 68.0, 68.0, 0, 4),
  },
  {
    key: "maple",
    syn: ["jarabe de maple", "maple syrup"],
    profile: P(260, 0, 0.1, 0, 0, 67.0, 60.0, 60.0, 0, 12),
  },
  {
    key: "piloncillo",
    syn: ["panela"],
    profile: P(380, 0, 0, 0, 0, 98.0, 97.0, 97.0, 0, 30),
  },

  // SWEETENERS — NON-CALORIC
  { key: "estevia", syn: ["stevia"], profile: P(0, 0, 0, 0, 0, 0, 0, 0, 0, 0) },
  {
    key: "sucralosa",
    syn: ["splenda"],
    profile: P(0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
  },
  {
    key: "eritritol",
    syn: ["erythritol"],
    profile: P(0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
  },
  {
    key: "xilitol",
    syn: ["xylitol"],
    profile: P(0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
  },
  {
    key: "monk fruit",
    syn: ["fruto del monje"],
    profile: P(0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
  },

  // FRUITS
  {
    key: "manzana",
    syn: ["apple"],
    profile: P(52, 0.3, 0.2, 0, 0, 12.0, 10.0, 0, 2.4, 1),
  },
  {
    key: "platano",
    syn: ["banana"],
    profile: P(89, 1.1, 0.3, 0.1, 0, 20.0, 12.0, 0, 2.6, 1),
  },
  {
    key: "limon",
    syn: ["jugo de limon", "lime"],
    profile: P(25, 0.4, 0.2, 0, 0, 8.0, 1.7, 0, 0.4, 2),
  },
  {
    key: "naranja",
    syn: ["jugo de naranja", "orange"],
    profile: P(45, 0.7, 0.2, 0, 0, 10.0, 8.0, 0, 0.2, 1),
  },

  // CAFFEINE SOURCES
  {
    key: "cafe",
    syn: ["cafe negro", "coffee brewed"],
    profile: P(2, 0.1, 0, 0, 0, 0, 0, 0, 0, 5),
  },
  { key: "te", syn: ["tea"], profile: P(1, 0, 0, 0, 0, 0.3, 0, 0, 0, 3) },
  {
    key: "cacao",
    syn: ["chocolate", "cocoa"],
    profile: P(228, 19.6, 13.7, 8.0, 0, 13.0, 1.7, 0, 33.0, 21),
  },
  { key: "matcha", syn: [], profile: P(1, 0, 0, 0, 0, 0.3, 0, 0, 0, 3) },

  // NUTS
  {
    key: "nuez",
    syn: ["nueces", "walnut", "nut"],
    profile: P(654, 15.0, 65.0, 6.0, 0, 7.0, 2.6, 0, 6.7, 2),
  },
  {
    key: "cacahuate",
    syn: ["mani", "peanut"],
    profile: P(567, 26.0, 49.0, 7.0, 0, 8.0, 4.0, 0, 8.5, 18),
  },
  {
    key: "almendra",
    syn: ["almond"],
    profile: P(579, 21.0, 50.0, 3.8, 0, 9.0, 4.4, 0, 12.5, 1),
  },

  // WATER / ZERO
  { key: "agua", syn: ["water"], profile: P(0, 0, 0, 0, 0, 0, 0, 0, 0, 0) },
];

// ─── FALLBACK CATEGORY TABLE ────────────────────────────────────────────────
export const FALLBACK: Record<string, Profile> = {
  "Lean meat/poultry/fish": P(120, 22.0, 3.0, 1.0, 0, 0, 0, 0, 0, 70),
  "Fatty meat/processed meat": P(
    250,
    18.0,
    19.0,
    7.0,
    0.3,
    1.0,
    0.5,
    0,
    0,
    900,
  ),
  "Vegetable (generic)": P(25, 1.5, 0.2, 0.0, 0, 5.0, 2.5, 0, 2.0, 30),
  "Fruit (generic)": P(55, 0.6, 0.2, 0.0, 0, 12.0, 9.0, 0, 2.0, 2),
  "Cooked grain/starch": P(130, 3.0, 0.5, 0.1, 0, 28.0, 0.5, 0, 1.5, 5),
  "Raw flour/dry starch": P(360, 9.0, 1.5, 0.3, 0, 75.0, 1.0, 0, 2.5, 5),
  "Oil/pure fat": P(884, 0, 100.0, 15.0, 0, 0, 0, 0, 0, 2),
  "Dairy (liquid)": P(60, 3.3, 3.3, 2.0, 0.1, 5.0, 5.0, 0, 0, 45),
  Cheese: P(350, 24.0, 27.0, 17.0, 1.0, 1.5, 0.5, 0, 0, 650),
  "Nuts/seeds": P(600, 20.0, 50.0, 6.0, 0, 12.0, 4.0, 0, 8.0, 5),
  "Condiment/sauce (savory)": P(100, 2.0, 5.0, 1.0, 0, 10.0, 5.0, 0, 0, 1500),
  "Dried spice/herb": P(250, 10.0, 5.0, 1.0, 0, 40.0, 3.0, 0, 25.0, 30),
  "Fresh herb/aromatic": P(25, 2.0, 0.5, 0.0, 0, 2.0, 1.0, 0, 2.5, 30),
  "Caloric sweetener/syrup": P(350, 0, 0, 0, 0, 90.0, 85.0, 85.0, 0, 10),
  "Non-caloric sweetener": P(0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
};

// ─── INGREDIENT CLASS SETS ──────────────────────────────────────────────────
// Membership is by RESOLVED key / fallback category name — never raw text.
export const CAFFEINE_SOURCE = new Set([
  "cafe",
  "te",
  "cacao",
  "matcha",
  "guarana",
  "mate",
  "nuez de cola",
  "yerba mate",
]);

export const NONCALORIC_SWEETENER = new Set([
  "estevia",
  "sucralosa",
  "eritritol",
  "xilitol",
  "monk fruit",
  "Non-caloric sweetener", // fallback category
]);

export const ADDED_CALORIC_SUGAR = new Set([
  "azucar",
  "miel",
  "agave",
  "maple",
  "piloncillo",
  "salsa inglesa",
  "Caloric sweetener/syrup",
]);

// ─── VDR (2000 kcal reference diet) ─────────────────────────────────────────
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

// ─── PORTION DEFAULTS (midpoint, rounded to nearest 10 g) ───────────────────
export const PORTION_MIDPOINTS: Record<string, number> = {
  main: 200,
  soup: 250,
  side: 110,
  sauce: 20,
  snack: 40,
  baked: 70,
  beverage: 230,
};

// ─── SEAL DEFINITIONS ───────────────────────────────────────────────────────
export interface Seal {
  lines: string[];
  ys: number[];
}
export const SEAL_CALORIAS: Seal = {
  lines: ["EXCESO EN", "CALORÍAS"],
  ys: [17, 30],
};
export const SEAL_AZUCARES: Seal = {
  lines: ["EXCESO EN", "AZÚCARES"],
  ys: [17, 30],
};
export const SEAL_SATURADAS: Seal = {
  lines: ["EXCESO EN", "GRASAS SATURADAS"],
  ys: [17, 28],
};
export const SEAL_TRANS: Seal = {
  lines: ["EXCESO EN", "GRASAS TRANS"],
  ys: [17, 30],
};
export const SEAL_SODIO: Seal = { lines: ["EXCESO EN", "SODIO"], ys: [17, 30] };
