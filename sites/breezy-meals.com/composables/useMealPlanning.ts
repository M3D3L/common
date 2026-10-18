import usePocketBase from "@common/composables/usePocketbase";
import { canonicalIngredientName, ingredientKey } from "~/lib/ingredient-identities";
import type {
  Ingredient, RecipeIngredient, PlanningRecipe, MenuComponent, NutritionProfile,
} from "~/lib/meal-planning";

export interface PlanningIngredient extends Ingredient {
  canonical_key: string;
  aliases?: string[];
  nutrition_description?: string;
  nutrition_retrieved_at?: string;
}
export interface PlanningRecipeRecord extends PlanningRecipe {
  yield_verified: boolean;
  planning_draft: boolean;
  planning_notes: string;
  protein_yield_g?: number;
  protein_yield_verified?: boolean;
}
export interface PlanningMenuItem {
  id: string;
  name: string;
  category: string;
  surface: string;
}
export interface SavedMealPlan {
  id: string;
  week_start: string;
  status: string;
  parameters: Record<string, unknown>;
  lines: unknown;
  snapshot: unknown;
}

export default function useMealPlanning() {
  const pb = usePocketBase();
  async function all<T>(name: string, sort = "created"): Promise<T[]> {
    return pb.collection(name).getFullList<T>({ sort, requestKey: null, cache: "no-store" });
  }
  async function load() {
    const [ingredients, recipes, rows, components, menuItems, memberships, plans] = await Promise.all([
      all<PlanningIngredient>("ingredients", "name"),
      all<PlanningRecipeRecord>("recipes", "title"),
      all<RecipeIngredient>("recipe_ingredients", "sort_order"),
      all<MenuComponent & { id: string }>("menu_item_components"),
      pb.collection("menu_items").getFullList<PlanningMenuItem>({
        filter: 'surface = "dishes"', sort: "name", requestKey: null, cache: "no-store",
      }),
      all<{ id: string; credits_total: number; credits_used: number; status: string }>("memberships"),
      all<SavedMealPlan>("meal_plans", "-created"),
    ]);
    return { ingredients, recipes, rows, components, menuItems, memberships, plans };
  }
  async function loadRecipe(id: string) {
    const [recipe, rows, ingredients] = await Promise.all([
      pb.collection("recipes").getOne<PlanningRecipeRecord>(id, { cache: "no-store" }),
      pb.collection("recipe_ingredients").getFullList<RecipeIngredient>({
        filter: pb.filter("recipe = {:id}", { id }), sort: "sort_order", requestKey: null, cache: "no-store",
      }),
      all<PlanningIngredient>("ingredients", "name"),
    ]);
    return { recipe, rows, ingredients };
  }
  async function saveIngredient(value: PlanningIngredient) {
    if (!value.name.trim()) throw new Error("El ingrediente necesita un nombre.");
    if (!["g", "ml", "piece"].includes(value.base_unit)) throw new Error("Unidad base no válida.");
    if (value.grams_per_unit != null && (!Number.isFinite(value.grams_per_unit) || value.grams_per_unit < 0)) {
      throw new Error("Usa un peso de conversión numérico no negativo (0 si es desconocido).");
    }
    if (value.nutrition) {
      for (const nutrient of ["kcal", "protein", "fat", "carbs", "fiber", "sodium"] as const) {
        if (!Number.isFinite(value.nutrition[nutrient]) || value.nutrition[nutrient] < 0) {
          throw new Error(`Valor nutricional no válido: ${nutrient}`);
        }
      }
    }
    if (value.nutrition_verified && (!value.nutrition || !/^https:\/\//.test(value.nutrition_source || ""))) {
      throw new Error("Para verificar la nutrición, agrega los seis valores y una fuente HTTPS.");
    }
    return pb.collection("ingredients").update<PlanningIngredient>(value.id, {
      name: value.name.trim(), category: value.category ?? "", base_unit: value.base_unit,
      grams_per_unit: value.grams_per_unit ?? 0, nutrition: value.nutrition ?? null,
      nutrition_source: value.nutrition_source ?? "", nutrition_verified: value.nutrition_verified === true,
      nutrition_description: value.nutrition_description ?? "",
      nutrition_retrieved_at: new Date().toISOString().slice(0, 10),
    });
  }
  async function createIngredient(name: string) {
    const canonicalName = canonicalIngredientName(name.trim());
    const canonical = ingredientKey(canonicalName);
    if (!canonical) throw new Error("Escribe el nombre del ingrediente.");
    return pb.collection("ingredients").create<PlanningIngredient>({
      name: canonicalName, canonical_key: canonical, base_unit: "g", nutrition_verified: false,
    });
  }
  async function saveRecipeDetails(recipe: PlanningRecipeRecord, rows: RecipeIngredient[]) {
    if (!Number.isFinite(recipe.yield_portions) || recipe.yield_portions <= 0) {
      throw new Error("Confirma un rendimiento numérico mayor que cero.");
    }
    for (const row of rows) {
      if (!row.review_required && (!row.ingredient || !(row.quantity > 0) || !row.unit)) {
        throw new Error(`Faltan datos de ingrediente: ${row.text}`);
      }
      if (!Number.isFinite(row.quantity) || row.quantity < 0) throw new Error("Cantidad no válida.");
    }
    for (const row of rows) {
      await pb.collection("recipe_ingredients").update(row.id, {
        ingredient: row.ingredient, quantity: row.quantity, unit: row.unit,
        review_required: row.review_required === true, parsed_text: row.text,
      });
    }
    await pb.collection("recipes").update(recipe.id, {
      yield_portions: recipe.yield_portions, yield_verified: recipe.yield_verified,
      planning_notes: recipe.planning_notes,
    });
  }
  async function addComponent(menuItem: string, recipe: string, portions: number) {
    if (!menuItem || !recipe || !Number.isFinite(portions) || portions <= 0) {
      throw new Error("Selecciona un platillo, una receta y porciones mayores que cero.");
    }
    return pb.collection("menu_item_components").create<MenuComponent & { id: string }>({
      menu_item: menuItem, recipe, portions,
    });
  }
  async function removeComponent(id: string) {
    return pb.collection("menu_item_components").delete(id);
  }
  async function saveComponent(id: string, portions: number) {
    if (!Number.isFinite(portions) || portions <= 0) {
      throw new Error("Confirma porciones mayores que cero.");
    }
    return pb.collection("menu_item_components").update(id, {
      portions,
    });
  }
  return {
    load, loadRecipe, loadIngredientCatalog: () => all<PlanningIngredient>("ingredients", "name"),
    saveIngredient, createIngredient, saveRecipeDetails, addComponent, removeComponent, saveComponent,
    savePlan: (data: Omit<SavedMealPlan, "id">) => pb.collection("meal_plans").create<SavedMealPlan>(data),
  };
}
