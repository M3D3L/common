import { getCategoryEmoji } from "~/utils/categoryEmoji";

export function useCategoryEmoji() {
  return { getEmoji: getCategoryEmoji };
}
