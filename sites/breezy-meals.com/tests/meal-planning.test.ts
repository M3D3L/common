import assert from "node:assert/strict";
import test from "node:test";
import {
  aggregateRequirements,
  allocatePlates,
  availableCredits,
  calculateRecipeNutrition,
  forecastDaily,
  forecastWeekly,
  parseIngredientLine,
  parseYield,
  type Ingredient,
  type NutritionProfile,
  type PlanningRecipe,
  type RecipeIngredient,
} from "../lib/meal-planning.ts";

const profile: NutritionProfile = { kcal: 100, protein: 10, fat: 2, carbs: 8, fiber: 1, sodium: 50 };
const ingredients: Ingredient[] = [
  { id: "rice", name: "Arroz", base_unit: "g", nutrition: profile, nutrition_source: "Test fixture", nutrition_verified: true },
  { id: "milk", name: "Leche", base_unit: "ml", grams_per_unit: 1.03, nutrition: profile, nutrition_source: "Test fixture", nutrition_verified: true },
  { id: "egg", name: "Huevo", base_unit: "piece", grams_per_unit: 50, nutrition: profile, nutrition_source: "Test fixture", nutrition_verified: true },
];
const recipe = { id: "dish", title: "Plato", yield_portions: 4 };
const row = (overrides: Partial<RecipeIngredient> = {}): RecipeIngredient => ({
  id: "row", recipe: "dish", ingredient: "rice", quantity: 0.4, unit: "kg", text: "400 g arroz", ...overrides,
});

test("credits carry forward all noncancelled statuses and clamp overspending", () => {
  assert.equal(availableCredits([
    { credits_total: 100, credits_used: 20, status: "active" },
    { credits_total: 30, credits_used: 5, status: "expired" },
    { credits_total: 8, credits_used: 10, status: "exhausted" },
    { credits_total: 500, credits_used: 0, status: "cancelled" },
  ]), 105);
  assert.equal(availableCredits([]), 0);
  for (const invalid of [NaN, Infinity, -1, "10" as unknown as number]) {
    assert.throws(() => availableCredits([{ credits_total: invalid, credits_used: 0, status: "active" }]), RangeError);
    assert.throws(() => availableCredits([{ credits_total: 10, credits_used: invalid, status: "active" }]), RangeError);
  }
});

test("forecast uses adjustable days, utilization, extras, buffer and one ceiling", () => {
  assert.equal(forecastDaily(105, 5, 100, 0, 0), 21);
  assert.equal(forecastDaily(105, 5, 80, 3, 10), 22);
  assert.equal(forecastDaily(105, 3, 60, 4, 20), 30);
  assert.equal(forecastDaily(0, 5, 0, 0, 0), 0);
  for (const args of [[100, 0, 80, 0, 0], [100, 2.5, 80, 0, 0], [100, 5, 101, 0, 0],
    [NaN, 5, 80, 0, 0], [100, 5, 80, -1, 0], [100, 5, 80, 0, Infinity]]) {
    assert.throws(() => forecastDaily(...args as [number, number, number, number, number]), RangeError);
  }
});

test("weekly demand uses the actual credit budget and rounds only the weekly total", () => {
  assert.equal(forecastWeekly(57, 5, 100, 0, 0), 57);
  assert.deepEqual(allocatePlates(forecastWeekly(57, 5, 100, 0, 0), [1, 1, 1, 1, 1]), [12, 12, 11, 11, 11]);
  assert.equal(forecastWeekly(57, 5, 100, 15, 0), 132);
  assert.deepEqual(allocatePlates(forecastWeekly(57, 5, 100, 15, 0), [1, 1, 1, 1, 1]), [27, 27, 26, 26, 26]);
  assert.equal(forecastWeekly(80, 5, 100, 0, 0), 80);
  assert.equal(forecastWeekly(57, 5, 50, 0, 0), 29);
  assert.equal(forecastWeekly(57, 5, 100, 2, 10), 74);
  assert.equal(forecastWeekly(0, 5, 100, 0, 0), 0);
  assert.throws(() => forecastWeekly(57, 0, 100, 0, 0), RangeError);
  assert.throws(() => forecastWeekly(Number.MAX_VALUE, 5, 100, 0, 0), RangeError);
});

test("validation errors are Spanish without changing error types", () => {
  const cases: Array<[() => unknown, string]> = [
    [() => availableCredits([{ credits_total: -1, credits_used: 0, status: "active" }]),
      "Los créditos de la membresía deben ser números finitos mayores o iguales a cero."],
    [() => availableCredits([
      { credits_total: Number.MAX_VALUE, credits_used: 0, status: "active" },
      { credits_total: Number.MAX_VALUE, credits_used: 0, status: "expired" },
    ]), "Los créditos disponibles exceden el límite numérico."],
    [() => forecastDaily(80, 0, 100, 0, 0), "Los datos de la estimación diaria son inválidos."],
    [() => forecastDaily(Number.MAX_VALUE, 1, 100, 0, 0),
      "La estimación diaria excede el rango de enteros seguros."],
    [() => allocatePlates(-1, [1]),
      "El total debe ser un entero seguro mayor o igual a cero; los pesos de distribución deben ser finitos y mayores o iguales a cero."],
    [() => allocatePlates(1, []), "Un total mayor que cero requiere al menos un platillo."],
    [() => allocatePlates(1, [0]),
      "Un total mayor que cero requiere al menos un peso de distribución mayor que cero."],
  ];
  for (const [run, message] of cases) assert.throws(run, { name: "RangeError", message });
});

test("largest remainder allocation is stable, exact and excludes zero-weight dishes", () => {
  assert.deepEqual(allocatePlates(11, [50, 30, 20]), [6, 3, 2]);
  assert.deepEqual(allocatePlates(2, [1, 1, 1]), [1, 1, 0]);
  assert.deepEqual(allocatePlates(7, [0, 1, 0]), [0, 7, 0]);
  assert.deepEqual(allocatePlates(3, [1e308, 1e308]), [2, 1]);
  assert.deepEqual(allocatePlates(0, []), []);
  assert.deepEqual(allocatePlates(0, [0, 0]), [0, 0]);
  for (let total = 0; total < 200; total++) {
    const counts = allocatePlates(total, [0, 0.1, 2, 3.7, 9]);
    assert.equal(counts.reduce((sum, value) => sum + value, 0), total);
    assert.ok(counts.every((value) => Number.isInteger(value) && value >= 0));
    assert.equal(counts[0], 0);
  }
  for (const [total, weights] of [[1, []], [1, [0]], [-1, [1]], [1.1, [1]], [1, [-1]], [1, [NaN]]] as Array<[number, number[]]>)
    assert.throws(() => allocatePlates(total, weights), RangeError);
});

test("requirements scale batches and combine canonical ingredients across days and recipes", () => {
  const result = aggregateRequirements(
    [{ date: "2026-10-19", menu_item: "plate", quantity: 8 },
      { date: "2026-10-20", menu_item: "plate", quantity: 4 }],
    [{ menu_item: "plate", recipe: "dish", portions: 1 },
      { menu_item: "plate", recipe: "side", portions: 0.5 }],
    [recipe, { id: "side", title: "Guarnición", yield_portions: 2 }],
    [row(), row({ id: "side-rice", recipe: "side", quantity: 100, unit: "g" }),
      row({ id: "milk", ingredient: "milk", quantity: 1, unit: "l" }),
      row({ id: "egg", ingredient: "egg", quantity: 4, unit: "piezas" })],
    ingredients,
  );
  assert.deepEqual(result.requirements, [
    { ingredient: "rice", name: "Arroz", unit: "g", quantity: 1500 },
    { ingredient: "milk", name: "Leche", unit: "ml", quantity: 3000 },
    { ingredient: "egg", name: "Huevo", unit: "piece", quantity: 12 },
  ]);
  assert.deepEqual(result.warnings, []);
  assert.deepEqual(result.recipePortions, [
    { date: "2026-10-19", recipe: "dish", portions: 8 },
    { date: "2026-10-19", recipe: "side", portions: 4 },
    { date: "2026-10-20", recipe: "dish", portions: 4 },
    { date: "2026-10-20", recipe: "side", portions: 2 },
  ]);
});

test("duplicate production lines combine recipe portions without mutating inputs", () => {
  const lines = [{ date: "2026-10-19", menu_item: "plate", quantity: 2 }];
  const before = JSON.stringify(lines);
  const result = aggregateRequirements([...lines, ...lines], [{ menu_item: "plate", recipe: "dish", portions: 1 }],
    [recipe], [row()], ingredients);
  assert.deepEqual(result.recipePortions, [{ date: "2026-10-19", recipe: "dish", portions: 4 }]);
  assert.equal(result.requirements[0]!.quantity, 400);
  assert.equal(JSON.stringify(lines), before);
});

test("finished meat targets scale whole batches using measured cooked meat-only yield", () => {
  const measured: PlanningRecipe = {
    ...recipe, yield_portions: 8, protein_yield_g: 800, protein_yield_verified: true,
  };
  const result = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 10 }],
    [{ menu_item: "plate", recipe: "dish", portions: 1, protein_target_g: 150 }],
    [measured], [
      row({ quantity: 1, unit: "kg" }),
      row({ id: "sauce", ingredient: "milk", quantity: 400, unit: "ml" }),
    ], ingredients);
  assert.deepEqual(result.recipePortions, [{ date: "2026-10-19", recipe: "dish", portions: 15 }]);
  assert.deepEqual(result.requirements, [
    { ingredient: "rice", name: "Arroz", unit: "g", quantity: 1875 },
    { ingredient: "milk", name: "Leche", unit: "ml", quantity: 750 },
  ]);
  assert.deepEqual(result.warnings, []);
  // Recipe nutrition is still for the original batch and its original eight portions.
  const nutrition = calculateRecipeNutrition(measured, [row({ quantity: 1, unit: "kg" })], ingredients);
  assert.equal(nutrition.total.kcal, 1000);
  assert.equal(nutrition.perPortion!.kcal, 125);
});

test("protein scaling respects component portions and combines date/recipe totals", () => {
  const measured: PlanningRecipe = {
    ...recipe, yield_portions: 8, protein_yield_g: 800, protein_yield_verified: true,
  };
  const result = aggregateRequirements([
    { date: "2026-10-19", menu_item: "plate", quantity: 10 },
    { date: "2026-10-19", menu_item: "half", quantity: 4 },
  ], [
    { menu_item: "plate", recipe: "dish", portions: 1, protein_target_g: 150 },
    { menu_item: "half", recipe: "dish", portions: 0.5, protein_target_g: 100 },
  ], [measured], [row({ quantity: 1, unit: "kg" })], ingredients);
  assert.deepEqual(result.recipePortions, [{ date: "2026-10-19", recipe: "dish", portions: 17 }]);
  assert.equal(result.requirements[0]!.quantity, 2125);
  assert.deepEqual(result.warnings, []);
});

test("protein targets without valid measured finished yield skip totals without raw-meat inference", () => {
  for (const protein_yield_g of [undefined, 0, -1, NaN, Infinity]) {
    const measured: PlanningRecipe = {
      ...recipe, yield_portions: 8, protein_yield_g, protein_yield_verified: true,
    };
    const result = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 10 }],
      [{ menu_item: "plate", recipe: "dish", portions: 1, protein_target_g: 150 }],
      [measured], [row({ quantity: 1500, unit: "g", text: "1500 g carne cruda" })], ingredients);
    assert.deepEqual(result.requirements, []);
    assert.deepEqual(result.recipePortions, []);
    assert.match(result.warnings.join(), /Receta "Plato" \(dish\).*rendimiento medido.*150 g por plato/);
    assert.match(result.warnings.join(), /No se infiere el peso cocido a partir del peso crudo/);
  }
});

test("unverified finished protein yield gives explicitly provisional quantities", () => {
  for (const protein_yield_verified of [undefined, false]) {
    const measured: PlanningRecipe = {
      ...recipe, yield_portions: 8, protein_yield_g: 800, protein_yield_verified,
    };
    const result = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 10 }],
      [{ menu_item: "plate", recipe: "dish", portions: 1, protein_target_g: 150 }],
      [measured], [row({ quantity: 1, unit: "kg" })], ingredients);
    assert.equal(result.recipePortions[0]!.portions, 15);
    assert.equal(result.requirements[0]!.quantity, 1875);
    assert.match(result.warnings.join(), /Plato.*no está verificado.*150 g por plato son provisionales/);
  }
});

test("zero or omitted protein targets preserve legacy scaling; invalid targets/yields warn", () => {
  for (const protein_target_g of [undefined, 0]) {
    const result = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 10 }],
      [{ menu_item: "plate", recipe: "dish", portions: 1, protein_target_g }],
      [recipe], [row()], ingredients);
    assert.equal(result.recipePortions[0]!.portions, 10);
    assert.equal(result.requirements[0]!.quantity, 1000);
    assert.deepEqual(result.warnings, []);
  }
  for (const protein_target_g of [-1, NaN, Infinity]) {
    const result = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 10 }],
      [{ menu_item: "plate", recipe: "dish", portions: 1, protein_target_g }],
      [recipe], [row()], ingredients);
    assert.deepEqual(result.requirements, []);
    assert.deepEqual(result.recipePortions, []);
    assert.match(result.warnings.join(), /Objetivo de carne\/proteína terminada inválido/);
  }
  const invalidYield = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 10 }],
    [{ menu_item: "plate", recipe: "dish", portions: 1, protein_target_g: 150 }],
    [{ ...recipe, yield_portions: 0, protein_yield_g: 800, protein_yield_verified: true }],
    [row()], ingredients);
  assert.deepEqual(invalidYield.requirements, []);
  assert.deepEqual(invalidYield.recipePortions, []);
  assert.match(invalidYield.warnings.join(), /Rendimiento inválido/);
});

test("missing components, recipes, yields, rows and invalid production quantities warn", () => {
  const run = (components = [{ menu_item: "plate", recipe: "dish", portions: 1 }], recipes = [recipe], rows = [row()]) =>
    aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 4 }], components, recipes, rows, ingredients);
  assert.match(run([]).warnings.join(), /No hay recetas asociadas/);
  assert.match(run(undefined, []).warnings.join(), /No se encontró la receta/);
  assert.match(run(undefined, [{ ...recipe, yield_portions: 0 }]).warnings.join(), /Rendimiento inválido/);
  assert.match(run(undefined, undefined, []).warnings.join(), /No hay filas de ingredientes/);
  assert.match(run([{ menu_item: "plate", recipe: "dish", portions: -1 }]).warnings.join(), /Porciones del componente inválidas/);
  const invalid = aggregateRequirements([{ date: "", menu_item: "plate", quantity: NaN }], [], [], [], []);
  assert.equal(invalid.requirements.length, 0);
  assert.match(invalid.warnings.join(), /Línea de producción inválida/);
});

test("unresolved requirements stay partial while explicit dimensions are retained without conversion", () => {
  const result = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 4 }],
    [{ menu_item: "plate", recipe: "dish", portions: 1 }], [recipe], [
      row({ review_required: true }),
      row({ id: "missing", ingredient: "Arroz" }),
      row({ id: "cup", unit: "taza" }),
      row({ id: "density", ingredient: "milk", unit: "g" }),
      row({ id: "negative", quantity: -1 }),
    ], ingredients);
  assert.deepEqual(result.requirements, [
    { ingredient: "rice", name: "Arroz", unit: "g", quantity: 400 },
    { ingredient: "rice", name: "Arroz", unit: "taza", quantity: 0.4 },
    { ingredient: "milk", name: "Leche", unit: "g", quantity: 0.4 },
  ]);
  assert.match(result.warnings.join(), /requiere revisión/);
  assert.match(result.warnings.join(), /No se encontró el ingrediente/);
  assert.equal(result.warnings.filter((warning) => warning.includes("sin resolver")).length, 1);
  assert.ok(!result.warnings.some((warning) => warning.includes('"cup"')));
});

test("nutrition has exact per-recipe and per-portion totals using explicit grams per unit", () => {
  const result = calculateRecipeNutrition(recipe, [
    row(), row({ id: "milk", ingredient: "milk", quantity: 1, unit: "l" }),
    row({ id: "egg", ingredient: "egg", quantity: 2, unit: "piezas" }),
    row({ recipe: "different", quantity: 999999 }),
  ], ingredients);
  assert.deepEqual(result.total, { kcal: 1530, protein: 153, fat: 30.6, carbs: 122.4, fiber: 15.3, sodium: 765 });
  assert.deepEqual(result.perPortion, { kcal: 382.5, protein: 38.25, fat: 7.65, carbs: 30.6, fiber: 3.825, sodium: 191.25 });
  assert.equal(result.complete, true);
  assert.deepEqual(result.warnings, []);
});

test("missing nutrition, grams conversion, review and unverified profiles are incomplete", () => {
  const run = (ingredient: Ingredient, ingredientRow = row(), currentRecipe = recipe) =>
    calculateRecipeNutrition(currentRecipe, [ingredientRow], [ingredient]);
  const missing = run({ ...ingredients[0]!, nutrition: null });
  assert.equal(missing.complete, false);
  assert.equal(missing.total.kcal, 0);
  assert.match(missing.warnings.join(), /Información nutrimental faltante o inválida/);
  assert.match(run({ ...ingredients[0]!, nutrition_verified: undefined }).warnings.join(), /no está verificada/);
  assert.equal(run(ingredients[0]!, row({ review_required: true })).complete, false);
  assert.match(run({ ...ingredients[1]!, grams_per_unit: undefined },
    row({ ingredient: "milk", unit: "ml" })).warnings.join(), /grams_per_unit/);
  const unknownVolume = run({ ...ingredients[1]!, grams_per_unit: undefined, nutrition: null },
    row({ ingredient: "milk", unit: "ml" }));
  assert.match(unknownVolume.warnings.join(), /grams_per_unit/);
  assert.match(unknownVolume.warnings.join(), /Información nutrimental faltante o inválida/);
  assert.match(run(ingredients[0]!, row({ unit: "l" })).warnings.join(), /grams_per_unit/);
  assert.match(run({ ...ingredients[0]!, nutrition: { ...profile, sodium: NaN } }).warnings.join(), /nutrimental faltante o inválida/);
  const invalidYield = run(ingredients[0]!, row(), { ...recipe, yield_portions: 0 });
  assert.equal(invalidYield.perPortion, null);
  assert.equal(invalidYield.complete, false);
  assert.equal(calculateRecipeNutrition(recipe, [], ingredients).complete, false);
  assert.match(calculateRecipeNutrition(recipe, [row()], []).warnings.join(), /No se encontró el ingrediente/);
});

test("duplicate canonical ids and overflow cannot silently produce complete totals", () => {
  const duplicate = calculateRecipeNutrition(recipe, [row()], [ingredients[0]!, ingredients[0]!]);
  assert.equal(duplicate.complete, false);
  assert.equal(duplicate.total.kcal, 0);
  assert.match(duplicate.warnings.join(), /duplicado/);
  const overflow = calculateRecipeNutrition(recipe, [row({ quantity: Number.MAX_VALUE, unit: "g" })],
    [{ ...ingredients[0]!, nutrition: { ...profile, kcal: Number.MAX_VALUE } }]);
  assert.equal(overflow.complete, false);
  assert.ok(Number.isFinite(overflow.total.kcal));
});

test("migrated unresolved defaults warn despite review_required false", () => {
  for (const migrated of [
    row({ ingredient: "", quantity: 0, unit: "", review_required: false }),
    row({ ingredient: "rice", quantity: 0, unit: "g", review_required: false }),
  ]) {
    const requirements = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 4 }],
      [{ menu_item: "plate", recipe: "dish", portions: 1 }], [recipe], [migrated], ingredients);
    assert.deepEqual(requirements.requirements, []);
    assert.ok(requirements.warnings.length > 0);
    assert.match(requirements.warnings.join(), /Plato/);
    const nutrition = calculateRecipeNutrition(recipe, [migrated], ingredients);
    assert.equal(nutrition.complete, false);
    assert.equal(nutrition.total.kcal, 0);
    assert.match(nutrition.warnings.join(), /Plato/);
  }
});

test("volume purchasing stays in ml while nutrition uses only supplied grams per ml", () => {
  const volumeRow = row({ ingredient: "milk", quantity: 0.5, unit: "l" });
  const requirements = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 4 }],
    [{ menu_item: "plate", recipe: "dish", portions: 1 }], [recipe], [volumeRow], ingredients);
  assert.deepEqual(requirements.requirements, [{ ingredient: "milk", name: "Leche", unit: "ml", quantity: 500 }]);
  assert.equal(calculateRecipeNutrition(recipe, [volumeRow], ingredients).total.kcal, 515);
  for (const grams_per_unit of [undefined, 0, -1, NaN, Infinity]) {
    const nutrition = calculateRecipeNutrition(recipe, [volumeRow],
      [{ ...ingredients[1]!, grams_per_unit }]);
    assert.equal(nutrition.complete, false);
    assert.equal(nutrition.total.kcal, 0);
    assert.match(nutrition.warnings.join(), /grams_per_unit/);
  }
});

test("review status and invalid yields remain visible with recipe titles", () => {
  const reviewedRow = row({ review_required: true });
  const reviewed = calculateRecipeNutrition(recipe, [reviewedRow], ingredients);
  assert.equal(reviewed.total.kcal, 400);
  assert.equal(reviewed.complete, false);
  assert.match(reviewed.warnings.join(), /Plato.*requiere revisión/);
  for (const yield_portions of [0, -1, NaN, Infinity]) {
    const invalid = { ...recipe, yield_portions };
    const nutrition = calculateRecipeNutrition(invalid, [row()], ingredients);
    assert.equal(nutrition.complete, false);
    assert.equal(nutrition.perPortion, null);
    assert.match(nutrition.warnings.join(), /Plato.*Rendimiento inválido/);
    const requirements = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 4 }],
      [{ menu_item: "plate", recipe: "dish", portions: 1 }], [invalid], [row()], ingredients);
    assert.deepEqual(requirements.requirements, []);
    assert.match(requirements.warnings.join(), /Plato.*Rendimiento inválido/);
  }
});

test("complete nutrition requires explicit verification and a nonblank source", () => {
  for (const nutrition_source of [undefined, "", "  "]) {
    const nutrition = calculateRecipeNutrition(recipe, [row()],
      [{ ...ingredients[0]!, nutrition_source, nutrition_verified: true }]);
    assert.equal(nutrition.complete, false);
    assert.equal(nutrition.total.kcal, 400);
    assert.match(nutrition.warnings.join(), /Falta la fuente de información nutrimental/);
  }
  for (const nutrition_verified of [false, undefined]) {
    const nutrition = calculateRecipeNutrition(recipe, [row()],
      [{ ...ingredients[0]!, nutrition_verified }]);
    assert.equal(nutrition.complete, false);
    assert.match(nutrition.warnings.join(), /no está verificada/);
  }
  assert.equal(calculateRecipeNutrition(recipe, [row()], ingredients).complete, true);
});

test("raw and cooked ingredient records never share nutrition or aggregate by name", () => {
  const raw: Ingredient = { ...ingredients[0]!, id: "rice-raw", name: "Arroz crudo" };
  const cooked: Ingredient = {
    ...ingredients[0]!, id: "rice-cooked", name: "Arroz cocido",
    nutrition: { ...profile, kcal: 50 },
  };
  const rows = [
    row({ id: "raw", ingredient: raw.id, quantity: 100, unit: "g", text: "100 g de arroz crudo" }),
    row({ id: "cooked", ingredient: cooked.id, quantity: 100, unit: "g", text: "100 g de arroz cocido" }),
  ];
  assert.equal(calculateRecipeNutrition(recipe, rows, [raw, cooked]).total.kcal, 150);
  const missingCooked = calculateRecipeNutrition(recipe, rows, [raw]);
  assert.equal(missingCooked.complete, false);
  assert.equal(missingCooked.total.kcal, 100);
  assert.match(missingCooked.warnings.join(), /rice-cooked/);
  const requirements = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 4 }],
    [{ menu_item: "plate", recipe: "dish", portions: 1 }], [recipe], rows, [raw, cooked]);
  assert.deepEqual(requirements.requirements.map(({ ingredient, quantity }) => ({ ingredient, quantity })), [
    { ingredient: "rice-raw", quantity: 100 }, { ingredient: "rice-cooked", quantity: 100 },
  ]);
  assert.equal(parseIngredientLine("100 g de arroz cocido").name, "arroz cocido");
});

test("Spanish parser handles explicit decimals, fractions, Unicode fractions and metric units", () => {
  for (const [text, name, quantity, unit] of [
    ["1,5 kg de pollo", "pollo", 1.5, "kg"],
    ["250 g arroz", "arroz", 250, "g"],
    ["1/2 l de leche", "leche", 0.5, "l"],
    ["1 1/2 litros de agua", "agua", 1.5, "l"],
    ["½ kg de papa", "papa", 0.5, "kg"],
    ["1½ kg de papa", "papa", 1.5, "kg"],
    ["2 piezas de huevo", "huevo", 2, "piece"],
    ["100ml de leche", "leche", 100, "ml"],
    ["200 gramos de pechuga marca X", "pechuga marca X", 200, "g"],
  ] as const) {
    assert.deepEqual(parseIngredientLine(text), { name, quantity, unit, review_required: false });
  }
});

test("parser uses metric spoons and preserves cups as their own dimension without assuming their volume", () => {
  assert.deepEqual(parseIngredientLine("1/2 taza de harina"), {
    name: "harina", quantity: 0.5, unit: "taza", review_required: false,
  });
  assert.deepEqual(parseIngredientLine("2 cucharadas de aceite"), {
    name: "aceite", quantity: 2, unit: "cucharada", review_required: false,
  });
  for (const [unit, normalizedUnit] of [["cdita", "cucharadita"], ["cucharada", "cucharada"], ["taza", "taza"]]) {
    assert.deepEqual(parseIngredientLine(`1 ${unit} de sal`), {
      name: "sal", quantity: 1, unit: normalizedUnit, review_required: false,
    });
  }
  for (const unit of ["piece", "pieza", "piezas", "pza", "pzas"]) {
    assert.deepEqual(parseIngredientLine(`2 ${unit} de huevo`), {
      name: "huevo", quantity: 2, unit: "piece", review_required: false,
    });
  }
  assert.deepEqual(parseIngredientLine("2 huevos"), {
    name: "huevos", quantity: 2, unit: "piece", review_required: false,
  });
  assert.deepEqual(parseIngredientLine("1 paquete de queso"), {
    name: "queso (en paquete)", quantity: 1, unit: "paquete", review_required: false,
  });
  for (const text of ["sal al gusto", "", "1-2 kg de pollo", "1 a 2 kg de pollo", "1/0 kg de arroz", "-2 g de sal", "0 g de sal", "1.000,5 g de arroz"])
    assert.deepEqual(parseIngredientLine(text), { name: text, quantity: null, unit: null, review_required: true });
  assert.equal(parseIngredientLine("2 kg").review_required, true);
});

test("yield parser accepts a single explicit yield and rejects prose, ranges and multiple counts", () => {
  for (const text of ["4", "4 porciones", "Rinde 4 porciones", "Rendimiento: 4 personas", "4 raciones"])
    assert.equal(parseYield(text), 4);
  assert.equal(parseYield("2,5 porciones"), 2.5);
  for (const text of ["", "0", "-1", "4-6 porciones", "4 a 6", "4 porciones de 200 g", "4 personas / 2 días", "unas 4 porciones", "Infinity", "1/2 porción", "Rinde 4", "rinde4 porciones", "4porciones"])
    assert.equal(parseYield(text), null);
});

test("purchasing combines confirmed aliases but preserves cuts, cooking states and mixed meats", () => {
  const names = ["res", "carne de res", "carne molida", "carne molida de res", "bistec de res",
    "calabaza", "calabacitas", "calabacita", "carne molida mixta", "res cocida"];
  const catalog: Ingredient[] = names.map((name, index) => ({ id: String(index), name, base_unit: "g" }));
  const rows = catalog.map((ingredient) => row({ id: ingredient.id, ingredient: ingredient.id, quantity: 100, unit: "g" }));
  const result = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 4 }],
    [{ menu_item: "plate", recipe: "dish", portions: 1 }], [recipe], rows, catalog);
  assert.deepEqual(result.requirements.map(({ name, quantity }) => ({ name, quantity })), [
    { name: "carne de res", quantity: 200 },
    { name: "carne molida de res", quantity: 200 },
    { name: "bistec de res", quantity: 100 },
    { name: "calabacita", quantity: 300 },
    { name: "carne molida mixta", quantity: 100 },
    { name: "res cocida", quantity: 100 },
  ]);
  assert.deepEqual(result.warnings, []);
});

test("purchasing retains grams, millilitres and count measures without invented conversions", () => {
  const result = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 4 }],
    [{ menu_item: "plate", recipe: "dish", portions: 1 }], [recipe], [
      row({ quantity: 30, unit: "ml" }), row({ id: "mass", quantity: 13, unit: "g" }),
      row({ id: "count", quantity: 2, unit: "diente" }), row({ id: "can", quantity: 0.5, unit: "lata" }),
    ], [{ id: "rice", name: "Ajo", base_unit: "g" }]);
  assert.deepEqual(result.requirements.map(({ quantity, unit }) => ({ quantity, unit })), [
    { quantity: 30, unit: "ml" }, { quantity: 13, unit: "g" },
    { quantity: 2, unit: "diente" }, { quantity: 0.5, unit: "lata" },
  ]);
  assert.deepEqual(result.warnings, []);
});

test("nutrition uses explicit gram quantities even when the preferred purchasing unit is ml", () => {
  const result = calculateRecipeNutrition(recipe, [row({ ingredient: "milk", quantity: 100, unit: "g" })],
    [{ ...ingredients[1]!, grams_per_unit: undefined }]);
  assert.deepEqual(result.total, profile);
  assert.equal(result.complete, true);
});

test("source counts are parsed without assuming item weights or package sizes", () => {
  const cases: Array<[string, string, number, string]> = [
    ["2 dientes de ajo", "ajo", 2, "diente"],
    ["1 rama de cilantro fresco", "cilantro fresco", 1, "rama"],
    ["6 hojas de hierbabuena fresca", "hierbabuena fresca", 6, "hoja"],
    ["4 latas atun", "atun (en lata)", 4, "lata"],
    ["1/2 lata elotes", "elotes (en lata)", 0.5, "lata"],
    ["1 paquete de achiote", "achiote (en paquete)", 1, "paquete"],
    ["1 Barra Pan Bimbo", "Pan Bimbo (en barra)", 1, "barra"],
    ["4 rebanadas queso amarillo", "queso amarillo", 4, "rebanada"],
    ["½ papa", "papa", 0.5, "piece"],
    ["2 zanahorias", "zanahorias", 2, "piece"],
    ["10 Tamales de Elote", "Tamales de Elote", 10, "piece"],
    ["El jugo de 4 naranjas", "naranja para jugo", 4, "piece"],
    ["1 knorr pollo", "knorr pollo", 1, "piece"],
    ["1 knorr tomate", "knorr tomate", 1, "piece"],
    ["2 media crema", "media crema", 2, "envase"],
    ["4 quesos amarillos", "queso amarillo", 4, "rebanada"],
  ];
  for (const [text, name, quantity, unit] of cases) {
    assert.deepEqual(parseIngredientLine(text), { name, quantity, unit, review_required: false });
  }
  for (const text of ["1 ajo en polvo", "queso al gusto", "un paquete de achiote"]) {
    assert.equal(parseIngredientLine(text).review_required, true, text);
  }
});

test("an unresolved source measure gives one actionable warning rather than two ID-only messages", () => {
  const result = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 4 }],
    [{ menu_item: "plate", recipe: "dish", portions: 1 }], [recipe],
    [row({ unit: "cucharón", review_required: true, text: "1 cucharón de sal" })], ingredients);
  assert.deepEqual(result.requirements, []);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0]!, /1 cucharón de sal/);
});

test("sourced weights apply to exact explicit units independently of purchasing preferences", () => {
  const result = calculateRecipeNutrition(recipe, [
    row({ quantity: 40, unit: "ml" }), row({ id: "clove", quantity: 2, unit: "diente" }),
    row({ id: "cup", quantity: 0.5, unit: "taza" }),
  ], [{ ...ingredients[0]!, unit_weights: { ml: 1.03, diente: 3, taza: 220 } }]);
  assert.equal(result.complete, true);
  assert.ok(Math.abs(result.total.kcal - 157.2) < 1e-9);
  const wrongUnit = calculateRecipeNutrition(recipe, [row({ quantity: 1, unit: "envase" })],
    [{ ...ingredients[0]!, unit_weights: { ml: 1.03, piece: 50 } }]);
  assert.equal(wrongUnit.complete, false);
  assert.ok(!wrongUnit.warnings.some((warning) => warning.includes("Cantidad o conversión")));
});

test("accented single foods and fractional fruit counts retain their explicit count", () => {
  for (const text of ["1 limón", "1 limón amarillo", "½ manzana, tipo Gala", "1 clavo de olor"]) {
    const parsed = parseIngredientLine(text);
    assert.equal(parsed.review_required, false, text);
    assert.equal(parsed.unit, "piece", text);
  }
});

test("individual packaged drinks can be purchased without invented package weights or zero-calorie nutrition", () => {
  const drink = { id: "drink", name: "Agua mineral de sabor", base_unit: "piece" as const };
  const drinkRow = row({ ingredient: drink.id, quantity: 10, unit: "envase", text: "10 envases individuales" });
  const requirements = aggregateRequirements([{ date: "2026-10-19", menu_item: "menu", quantity: 10 }],
    [{ menu_item: "menu", recipe: recipe.id, portions: 1 }], [{ ...recipe, yield_portions: 10 }], [drinkRow], [drink]);
  assert.deepEqual(requirements.warnings, []);
  assert.equal(requirements.requirements[0]?.quantity, 10);
  const nutrition = calculateRecipeNutrition(recipe, [drinkRow], [drink]);
  assert.equal(nutrition.complete, false);
  assert.equal(nutrition.includedIngredients, 0);
  assert.ok(!nutrition.warnings.some((warning) => warning.includes("Cantidad o conversión")));
});

test("metric spoons convert to ml without inventing salt density or splitting mixed seasonings", () => {
  const salt = { id: "salt", name: "sal", base_unit: "g" as const };
  const blend = { id: "blend", name: "sal, pimienta y ajo en polvo", base_unit: "g" as const };
  const result = aggregateRequirements([{ date: "2026-10-19", menu_item: "plate", quantity: 4 }],
    [{ menu_item: "plate", recipe: "dish", portions: 1 }], [recipe], [
      row({ ingredient: "salt", quantity: 1.5, unit: "cucharada" }),
      row({ id: "spice", ingredient: "blend", quantity: 1, unit: "cucharadita" }),
    ], [salt, blend]);
  assert.deepEqual(result.requirements.map(({ name, quantity, unit }) => ({ name, quantity, unit })), [
    { name: "sal", quantity: 22.5, unit: "ml" },
    { name: "sal, pimienta y ajo en polvo", quantity: 5, unit: "ml" },
  ]);
  assert.deepEqual(result.warnings, []);
  assert.equal(calculateRecipeNutrition(recipe, [row({ ingredient: "salt", quantity: 1.5, unit: "cucharada" })], [salt]).complete, false);
});
