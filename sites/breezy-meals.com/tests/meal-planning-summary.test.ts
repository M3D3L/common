import test from "node:test";
import assert from "node:assert/strict";
import { allocateMealShare, formatPurchaseQuantity, summarizeMealShares, summarizePurchases, weekInputValue, weekStartFromInput } from "../lib/meal-planning-summary.ts";

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
