const CATEGORY_EMOJIS: Record<string, string> = {
  bebidas: "🥤",
  frutas: "🍎",
  verduras: "🥦",
  "frutas y verduras": "🥗",
  despensa: "🥫",
  abarrotes: "🛒",
  "despensa y abarrotes": "🧺",
  panaderia: "🍞",
  pasteleria: "🍰",
  "panaderia y pasteleria": "🥐",
  snacks: "🍿",
  botanas: "🥜",
  "snacks y botanas": "🥨",
  dulces: "🍬",
  chocolates: "🍫",
  "dulces y chocolates": "🍫",
  "frutos secos": "🌰",
  semillas: "🌻",
  "frutos secos y semillas": "🥜",
  mascotas: "🐾",
  hogar: "🏠",
  "articulos personales": "🧴",
  "articulos personales y hogar": "🛍️",
  asada: "🥩",
  pastor: "🌮",
  pollo: "🍗",
  birria: "🍲",
  carnitas: "🍖",
  tacos: "🌮",
  comida: "🍱",
  desayunos: "🍳",
  breakfast: "🍳",
  ensaladas: "🥗",
  salads: "🥗",
  sweets: "🧁",
  postres: "🧁",
  desserts: "🧁",
  salsas: "🌶️",
  extras: "✨",
};

export function getCategoryEmoji(value: string, fallback = "🧺"): string {
  if (!value) return fallback;

  const normalized = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (CATEGORY_EMOJIS[normalized]) return CATEGORY_EMOJIS[normalized];

  const matchedKey = Object.keys(CATEGORY_EMOJIS)
    .sort((left, right) => right.length - left.length)
    .find((key) => normalized.includes(key));

  return matchedKey ? CATEGORY_EMOJIS[matchedKey] : fallback;
}
