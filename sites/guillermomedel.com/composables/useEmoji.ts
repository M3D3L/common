// ~/composables/useCategoryEmoji.ts
const CATEGORY_EMOJIS: Record<string, string> = {
  // Enhanced & Specific Mappings
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

  // Previous staples
  asada: "🥩",
  pastor: "🌮",
  pollo: "🍗",
  birria: "🍲",
  carnitas: "🍖",
  tacos: "🌮",
  comida: "🍱",
  desayunos: "🍳",
  ensaladas: "🥗",
  salsas: "🌶️",
  extras: "✨",
};

const DEFAULT_EMOJI = "🧺";

export function useCategoryEmoji() {
  function getEmoji(value: string): string {
    if (!value) return DEFAULT_EMOJI;

    const normalized = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    // Direct match check
    if (CATEGORY_EMOJIS[normalized]) {
      return CATEGORY_EMOJIS[normalized];
    }

    // Partial match fallback
    for (const [key, emoji] of Object.entries(CATEGORY_EMOJIS)) {
      if (normalized.includes(key)) {
        return emoji;
      }
    }

    return DEFAULT_EMOJI;
  }

  return { getEmoji };
}
