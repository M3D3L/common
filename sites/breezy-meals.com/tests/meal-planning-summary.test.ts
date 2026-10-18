import test from "node:test";
import assert from "node:assert/strict";
import { allocateMealShare, buildShoppingText, formatPurchaseQuantity, rebalanceProductionPlan, summarizeMealShares, summarizePurchases, weekInputValue, weekStartFromInput } from "../lib/meal-planning-summary.ts";

test("week selector resolves ISO weeks across year boundaries and rejects nonexistent weeks", () => {
  assert.equal(weekStartFromInput("2026-W43"), "2026-10-19");
  assert.equal(weekInputValue("2026-10-23"), "2026-W43");
  assert.equal(weekStartFromInput("2026-W01"), "2025-12-29");
  assert.equal(weekInputValue("2027-01-01"), "2026-W53");
  assert.throws(() => weekStartFromInput("2025-W53"), /no existe/);
  assert.throws(() => weekStartFromInput(""), /válida/);
});

test("weekly meal shares combine repeated dishes and sum to 100%", () => {
  const mix = summarizeMealShares([
    { date: "2026-10-19", menu_item: "beef", quantity: 15 },
    { date: "2026-10-20", menu_item: "beef", quantity: 5 },
    { date: "2026-10-20", menu_item: "chicken", quantity: 60 },
  ], [{ id: "beef", name: "Res" }, { id: "chicken", name: "Pollo" }]);
  assert.deepEqual(mix.map(({ name, quantity, percentage }) => ({ name, quantity, percentage })), [
    { name: "Pollo", quantity: 60, percentage: 75 }, { name: "Res", quantity: 20, percentage: 25 },
  ]);
  assert.equal(mix.reduce((sum, row) => sum + row.percentage, 0), 100);
  assert.deepEqual(summarizeMealShares([], []), []);
});

test("daily percentage edits preserve exact integer plate totals including zero shares", () => {
  const items = [{ id: "a", quantity: 8 }, { id: "b", quantity: 4 }, { id: "c", quantity: 4 }];
  assert.deepEqual(allocateMealShare(items, "a", 50), [8, 4, 4]);
  assert.deepEqual(allocateMealShare(items, "a", 25), [4, 6, 6]);
  assert.deepEqual(allocateMealShare(items, "a", 0), [0, 8, 8]);
  assert.deepEqual(allocateMealShare(items, "a", 100), [16, 0, 0]);
  assert.equal(allocateMealShare(items, "a", 33).reduce((sum, q) => sum + q, 0), 16);
  assert.throws(() => allocateMealShare(items, "a", 101), /porcentaje/);
  assert.throws(() => allocateMealShare([{ id: "a", quantity: 16 }], "a", 50), /otro platillo/);
});

test("readable purchasing quantities use metric units without inventing data", () => {
  assert.equal(formatPurchaseQuantity(10000, "g"), "10 kg");
  assert.equal(formatPurchaseQuantity(1250, "g"), "1.25 kg");
  assert.equal(formatPurchaseQuantity(950, "g"), "950 g");
  assert.equal(formatPurchaseQuantity(2500, "ml"), "2.5 L");
  assert.equal(formatPurchaseQuantity(12, "piece"), "12 piezas");
  assert.throws(() => formatPurchaseQuantity(NaN, "g"), /no válida/);
});

test("weekly beef subtotal retains cuts and never classifies strawberries or bouillon as meat", () => {
  const result = summarizePurchases([
    { ingredient: "ground", name: "Carne molida de res", quantity: 6000, unit: "g" },
    { ingredient: "stew", name: "Res para guisar", quantity: 4000, unit: "g" },
    { ingredient: "fruit", name: "Fresas", quantity: 2000, unit: "g" },
    { ingredient: "stock", name: "Concentrado de caldo de res", quantity: 100, unit: "g" },
    { ingredient: "chicken", name: "Pechuga de pollo", quantity: 5000, unit: "g" },
    { ingredient: "milk", name: "Leche", quantity: 2000, unit: "ml" },
  ]);
  assert.equal(result[0].name, "Res");
  assert.deepEqual(result[0].totals, [{ unit: "g", quantity: 10000 }]);
  assert.equal(result[0].items.length, 2);
  assert.equal(result[1].name, "Pollo");
  const other = result.find((group) => group.name === "Otros ingredientes")!;
  assert.equal(other.totals.length, 2);
  assert.ok(other.items.some((item) => item.ingredient === "fruit"));
});

test("shopping text exports readable metric totals, separate cuts and rounded quantities", () => {
  const text = buildShoppingText([
    { ingredient: "beef", name: "Res para guisar", quantity: 10000, unit: "g" },
    { ingredient: "ground", name: "Carne molida de res", quantity: 2500, unit: "g" },
    { ingredient: "onion", name: "Cebolla", quantity: 1116.6666666666667, unit: "g" },
    { ingredient: "salt", name: "Sal", quantity: 45.599999999999994, unit: "g" },
    { ingredient: "rice", name: "Arroz seco", quantity: 425, unit: "g" },
    { ingredient: "cooked", name: "Arroz cocido", quantity: 500, unit: "ml" },
  ], "Semana: 2026-10-19 al 2026-10-25", []);
  assert.ok(text.startsWith("BREEZY MEALS - LISTA DE COMPRAS\r\nSemana: 2026-10-19 al 2026-10-25\r\n"));
  assert.ok(text.includes("Res: 12.5 kg\r\n"));
  assert.ok(text.includes("Arroz: 425 g + 500 ml\r\n"));
  assert.ok(text.includes("- Res para guisar: 10 kg\r\n"));
  assert.ok(text.includes("- Carne molida de res: 2.5 kg\r\n"));
  assert.ok(text.includes("- Cebolla: 1.12 kg\r\n"));
  assert.ok(text.includes("- Sal: 45.6 g\r\n"));
  assert.ok(!text.includes("666666"));
  assert.ok(!text.includes("DATOS POR REVISAR"));
  assert.ok(!text.includes("PROVISIONALES"));
});

test("Knorr and chicken-flavored seasonings never contribute to chicken meat totals", () => {
  const requirements = [
    { ingredient: "meat", name: "Pechuga de pollo cruda", quantity: 1200, unit: "g" },
    ...["knorr pollo", "Knorr tomate", "Consomé de pollo", "Condimento de pollo", "Chicken bouillon"]
      .map((name, index) => ({ ingredient: `seasoning-${index}`, name, quantity: 2, unit: "piece" })),
  ];
  const groups = summarizePurchases(requirements);
  const chicken = groups.find((group) => group.name === "Pollo")!;
  assert.deepEqual(chicken.totals, [{ quantity: 1200, unit: "g" }]);
  assert.deepEqual(chicken.items.map((item) => item.ingredient), ["meat"]);
  assert.equal(groups.find((group) => group.name === "Otros ingredientes")?.items.length, 5);
  const text = buildShoppingText(requirements, "Semana", []);
  assert.ok(text.includes("Pollo: 1.2 kg\r\n"));
  assert.ok(!text.includes("Pollo: 1.2 kg +"));
  assert.ok(text.includes("- sazonador Knorr de pollo: 2 piezas\r\n"));
});

test("shopping text labels incomplete totals and keeps review details outside the shopping list", () => {
  const warning = 'Receta "Sopa": cantidad de aceite pendiente.';
  const text = buildShoppingText([
    { ingredient: "chicken", name: "Pollo", quantity: 1080, unit: "g" },
  ], "Día: 2026-10-19", [warning, warning]);
  assert.ok(text.includes("Día: 2026-10-19\r\n"));
  assert.ok(text.includes("TOTALES PROVISIONALES - 1 datos por revisar."));
  assert.ok(text.includes("Solo incluye cantidades calculables"));
  const [shopping, review] = text.split("DATOS POR REVISAR (NO SON INGREDIENTES)");
  assert.ok(shopping);
  assert.ok(review);
  assert.ok(shopping.includes("- Pollo: 1.08 kg\r\n"));
  assert.ok(!shopping.includes(warning));
  assert.equal(review.split(warning).length - 1, 1);
});

test("shopping groups equivalent names on one line while retaining separate dimensions", () => {
  const requirements = [
    { ingredient: "water", name: "agua", quantity: 1750, unit: "g" },
    { ingredient: "water-potable", name: "agua potable (ajustar según arroz)", quantity: 500, unit: "ml" },
    { ingredient: "water-potable2", name: "agua potable", quantity: 4520, unit: "ml" },
    { ingredient: "rice", name: "arroz seco", quantity: 425, unit: "g" },
    { ingredient: "beef", name: "carne molida", quantity: 750, unit: "g" },
    { ingredient: "ground", name: "carne molida de res", quantity: 600, unit: "g" },
  ];
  const groups = summarizePurchases(requirements);
  assert.deepEqual(groups.find((group) => group.name === "Res")?.totals, [{ unit: "g", quantity: 1350 }]);
  assert.deepEqual(groups.find((group) => group.name === "Arroz")?.totals, [{ unit: "g", quantity: 425 }]);
  const text = buildShoppingText(requirements, "Semana", []);
  assert.equal(text.split("- agua:").length - 1, 1);
  assert.ok(text.includes("- agua: 1.75 kg + 5.02 L\r\n"));
  assert.ok(text.includes("- carne molida de res: 1.35 kg\r\n"));
  assert.equal(formatPurchaseQuantity(2, "diente"), "2 dientes");
  assert.equal(formatPurchaseQuantity(1, "lata"), "1 lata");
});

test("shopping export distinguishes saved plate quantities from the current credit balance", () => {
  const text = buildShoppingText([{ ingredient: "beef", name: "res", quantity: 10000, unit: "g" }], "Semana", [], {
    plannedPlates: 80, availableCredits: 57, forecastCredits: 80,
  });

  test("rebasing an 80-plate draft to 57 preserves meal weights and exact daily targets", () => {
    const dates = ["2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23"];
    const lines = dates.flatMap((date) => [
      { date, menu_item: "beef", quantity: 12, weight: 3 },
      { date, menu_item: "chicken", quantity: 4, weight: 1 },
    ]);
    const targets = Object.fromEntries(dates.map((date, index) => [date, index < 2 ? 12 : 11]));
    const rebased = rebalanceProductionPlan(lines, targets);
    assert.equal(rebased.reduce((sum, line) => sum + line.quantity, 0), 57);
    for (const [date, total] of Object.entries(targets)) {
      assert.equal(rebased.filter((line) => line.date === date).reduce((sum, line) => sum + line.quantity, 0), total);
    }
    assert.deepEqual(rebased.map((line) => line.weight), lines.map((line) => line.weight));
    assert.equal(lines.reduce((sum, line) => sum + line.quantity, 0), 80);
    assert.deepEqual(rebalanceProductionPlan(rebased, targets), rebased);
    assert.throws(() => rebalanceProductionPlan(lines, { "2026-10-24": 12 }), /requiere al menos un platillo/);
  });
  assert.ok(text.includes("Platos planeados: 80."));
  assert.ok(text.includes("Créditos disponibles al descargar: 57."));
  assert.ok(text.includes("Base de la previsión guardada: 80 créditos."));
  assert.ok(text.includes("El saldo cambió."));
  assert.ok(text.includes("- carne de res: 10 kg"));
  const current = buildShoppingText([], "Semana", [], { plannedPlates: 60, availableCredits: 57, forecastCredits: 57 });
  assert.ok(!current.includes("El saldo cambió."));
  assert.ok(buildShoppingText([], "Semana", [], { plannedPlates: 80, availableCredits: 57, forecastCredits: null }).includes("Base de créditos del plan no registrada."));
  assert.throws(() => buildShoppingText([], "Semana", [], { plannedPlates: 80, availableCredits: NaN, forecastCredits: null }), /no válida/);
});
