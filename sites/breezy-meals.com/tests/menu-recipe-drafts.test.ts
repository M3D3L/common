import assert from "node:assert/strict";
import test from "node:test";
import { MENU_RECIPE_DRAFTS } from "../lib/menu-recipe-drafts.ts";

const normalize = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "")
  .toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

// Independent in-repository fixture of the unmatched dish names, not a runtime
// dependency on the private snapshot or a list derived from the implementation.
const expectedNames = [
  "Agua de Melón", "Limonada de Limón Amarillo", "Refresco de Sabor", "Agua de Piña",
  "Té de Limón", "Limonada de Fresa", "Lentejas con Tocino",
  "Sopa de tortilla con queso y aguacate", "Agua Mineral de Sabor",
  "Sopa de letras con pollo desmenuzado", "Caldo de Queso", "Caldo de Albóndigas",
  "Huevos Revuéltos con Jamon, frijol, tortilas y bebida",
  "Huevos Revuéltos con Tocino, frijol, tortilas y bebida",
  "Ensalada de Pollo, Pimienta y Limón",
  "Huevos Revuéltos con Salchicha, frijol, tortilas y bebida",
  "Huevos Revuéltos con Chorizo, frijol, tortilas y bebida",
  "Ensalada Primavera", "Ensalada de Atún", "Birria 2", "Ensalada de Frutas Ralladas",
  "Birria", "Pollo en Crema Chipotle", "Pollo en Crema Alfredo con Brocoli",
  "Sandwichon de Ensalada de Pollo", "Pollo en Crema de Rajas",
  "Pollo en Crema de Champiñón y Tocino", "Carne Molida a la Boloñesa",
  "Marlin en Escabeche", "Albóndigas de Chipotle Rellenas de Queso",
  "Carne en su Jugo con Tocino", "Teriyaki de Res", "Pollo Oriental",
  "Discada Norteña (res, cerdo y tocino)", "Milanesa de Cerdo", "Bistec Ranchero",
  "Pastel de sushi", "Ensalada de pollo a la Plancha",
  "Gorditas de Frijol y Queso Gratinado", "Flautas de Pollo y Papa", "Espagueti Rojo",
  "Fettuccine Alfredo", "Rajas en Salsa Soya", "Arroz Naranja", "Puré de Papa",
  "Arroz Blanco", "Machaca", "Burritos de Machaca",
  "Chiles Rellenos c/Crema Champis y Chorizo", "Ensalada Fresca",
  "Galletas de Chispas Rellenas de Nutella", "Marlin", "Discada",
  "Pescado Estilo Baja", "Papas Gajo Con Queso",
  "Torta de Cochinita Pibil (con Guarnición de Papas Gajo)",
  "Hamburguesa de Res con Champiñones, Tocino y Cebolla (con Guarnición de Papas Gajo)",
  "Croissant de Jamón y Queso", "Papas Gajo", "Frijoles Rancheros",
  "Chocolate Brownie", "Frijol", "Burritos de Huevo con Tocino", "Pan de Muerto Chico",
  "Pozole Rojo", "Chilaquiles Rojos o Verdes (con Pollo, Birria o Queso Fresco)",
  "Aderezo Chipotle", "Zanahoria Rallada", "Cebolla Caramelizada",
  "Salsa Soya con cebollin",
  "Pollo V8 (Pechuga con Zanahoria, Calabaza y Papa en Caldito de Tomate",
  "Carne Puerco en Salsa Roja con Nopalitos", "Gallina Pinta", "Barbacoa Sonorense",
  "Enchiladas Suizas", "Sopa Fria", "Burritos de Huevo con Chorizo",
  "Aguacate y Crema", "Totopos y Queso Fresco",
];

const find = (name: string) => {
  const result = MENU_RECIPE_DRAFTS.find((draft) => normalize(draft.menuName) === normalize(name));
  assert.ok(result, `Missing draft: ${name}`);
  return result;
};

test("covers all 79 unmatched unique dish names without duplicate normalized names", () => {
  assert.equal(expectedNames.length, 79);
  assert.equal(MENU_RECIPE_DRAFTS.length, 79);
  const actual = MENU_RECIPE_DRAFTS.map((draft) => normalize(draft.menuName));
  assert.equal(new Set(actual).size, actual.length);
  assert.deepEqual([...actual].sort(), expectedNames.map(normalize).sort());
  assert.equal(find("AGUA DE MELON!!!").menuName, "Agua de Melón");
});

test("every draft has complete estimated ten-portion kitchen-review content", () => {
  for (const draft of MENU_RECIPE_DRAFTS) {
    assert.equal(draft.title, draft.menuName);
    assert.equal(typeof draft.description, "string");
    assert.ok(draft.description.trim().length > 0, `Missing description: ${draft.menuName}`);
    assert.ok(Number.isFinite(draft.yieldPortions) && draft.yieldPortions > 0);
    assert.equal(draft.yieldPortions, 10);
    for (const lines of [draft.ingredients, draft.steps, ...Object.values(draft.equipmentMethods)]) {
      assert.ok(lines.length > 0, draft.menuName);
      assert.ok(lines.every((line) => typeof line === "string" && line.trim().length > 0), draft.menuName);
    }
    assert.ok(draft.ingredients.every((line) => /^\d+\s/.test(line)), draft.menuName);
    assert.equal(typeof draft.purchased, "boolean");
    assert.match(draft.notes, /DRAFT/);
    assert.match(draft.notes, /estimados/);
    assert.match(draft.notes, /requiere revisión de cocina/);
    assert.match(draft.notes, /No representa nutrición verificada/);
    assert.match(draft.notes, /manual oficial/);
    assert.match(draft.notes, /modelo y capacidad desconocidos/);
  }
});

test("purchased sodas and mineral waters are portioned packaged products, not invented recipes", () => {
  assert.deepEqual(MENU_RECIPE_DRAFTS.filter((draft) => draft.purchased).map((draft) => draft.menuName).sort(),
    ["Agua Mineral de Sabor", "Refresco de Sabor"]);
  for (const name of ["Agua Mineral de Sabor", "Refresco de Sabor"]) {
    const draft = find(name);
    assert.match(draft.ingredients[0], /^10 envases individuales/);
    assert.match(draft.notes, /volumen pendientes de selección/);
    assert.match(draft.equipmentMethods.thermomix.join(" "), /sin cocción/);
    assert.match(draft.equipmentMethods.ninja.join(" "), /sin cocción/);
  }
  assert.equal(find("Croissant de Jamón y Queso").purchased, false);
  assert.equal(find("Totopos y Queso Fresco").purchased, false);
});

test("prepared ingredients use metric quantities and temperatures use Celsius", () => {
  for (const draft of MENU_RECIPE_DRAFTS) {
    if (!draft.purchased) {
      assert.ok(draft.ingredients.every((line) => /^\d+\s(?:g|kg|ml|l)\b/.test(line)), draft.menuName);
    }
    const instructions = [...draft.ingredients, ...draft.steps, ...Object.values(draft.equipmentMethods).flat()].join(" ");
    assert.doesNotMatch(instructions, /\b(?:cups?|tazas?|ounces?|onzas?|pounds?|libras?|fahrenheit)\b|°\s*F\b/i);
    assert.doesNotMatch(instructions, /°(?!C)/);
  }
});

test("descriptions distinguish actual draft preparations and preserve variant uncertainty", () => {
  assert.match(find("Caldo de Albóndigas").description, /sin relleno/);
  assert.match(find("Albóndigas de Chipotle Rellenas de Queso").description, /rellenas de queso/);
  assert.match(find("Pastel de sushi").description, /surimi cocido/);
  assert.match(find("Refresco de Sabor").description, /Producto comprado/);
  assert.match(find("Agua Mineral de Sabor").description, /sabor y volumen pendientes/);
  assert.match(find("Chilaquiles Rojos o Verdes (con Pollo, Birria o Queso Fresco)").description,
    /Base provisional.*salsa y proteína definitivas pendientes/);
  for (const draft of MENU_RECIPE_DRAFTS) {
    assert.doesNotMatch(draft.description, /\b(?:saludable|nutritiv[oa]|hipocalóric[oa]|vegano|vegetariano)\b|sin (?:gluten|alérgenos|lactosa)/i);
  }
});

test("choice variants and composite breakfasts preserve unresolved choices", () => {
  const chilaquiles = find("Chilaquiles Rojos o Verdes (con Pollo, Birria o Queso Fresco)");
  assert.match(chilaquiles.notes, /SELECCIÓN OBLIGATORIA/);
  assert.match(chilaquiles.notes, /salsa roja o verde y pollo, birria o queso fresco/);
  assert.match(chilaquiles.notes, /sustituir ingredientes y cantidades/);
  assert.match(chilaquiles.notes, /no sumar las tres proteínas/);
  const breakfasts = MENU_RECIPE_DRAFTS.filter((draft) => draft.menuName.startsWith("Huevos Revuéltos"));
  assert.equal(breakfasts.length, 4);
  for (const draft of breakfasts) {
    assert.ok(draft.ingredients.some((line) => line.includes("frijoles")));
    assert.ok(draft.ingredients.some((line) => line.includes("tortillas")));
    assert.ok(draft.ingredients.some((line) => line.includes("agua potable para acompañar")));
    assert.match(draft.notes, /no especifica bebida/);
    assert.match(draft.notes, /Elegir bebida y guarniciones/);
    assert.match(draft.notes, /no una selección aprobada/);
  }
});

test("unequal names remain independent drafts rather than silent aliases", () => {
  const stuffed = find("Albóndigas de Chipotle Rellenas de Queso");
  assert.ok(stuffed.ingredients.some((line) => /queso/.test(line)));
  assert.ok(stuffed.steps.some((line) => /cubo de queso/.test(line)));
  assert.ok(find("Caldo de Albóndigas").steps.some((line) => /sin relleno/.test(line)));
  assert.match(find("Birria 2").notes, /no un alias de Birria/);
  assert.match(find("Marlin").notes, /no es un alias/);
  assert.match(find("Discada").notes, /sin alias automático/);
  assert.match(find("Pastel de sushi").notes, /no alias automático/);
  assert.ok(!MENU_RECIPE_DRAFTS.some((draft) => normalize(draft.menuName) === normalize("Pastel Sushi")));
  assert.ok(!MENU_RECIPE_DRAFTS.some((draft) => normalize(draft.menuName) === normalize("Albóndigas con jitomate al chipotle")));
});

test("appliance guidance requires model validation and conventional cooking where needed", () => {
  for (const draft of MENU_RECIPE_DRAFTS.filter((draft) => !draft.purchased)) {
    for (const methods of [draft.equipmentMethods.thermomix, draft.equipmentMethods.ninja]) {
      assert.match(methods.join(" "), /manual|modelo/);
      assert.match(methods.join(" "), /convencional necesario/);
      assert.match(methods.join(" "), /cocción lenta/);
      assert.doesNotMatch(methods.join(" "), /\d+\s*(?:minutos|min|°C|litros|litro|l)\b/i);
    }
  }
  for (const [name, required] of [
    ["Milanesa de Cerdo", /sartén para freír/],
    ["Galletas de Chispas Rellenas de Nutella", /horno/],
    ["Pan de Muerto Chico", /horno/],
    ["Hamburguesa de Res con Champiñones, Tocino y Cebolla (con Guarnición de Papas Gajo)", /plancha/],
  ] as const) {
    const draft = find(name);
    assert.match(draft.equipmentMethods.thermomix.join(" "), required);
    assert.match(draft.equipmentMethods.ninja.join(" "), required);
  }
});

test("rice cooker guidance is component-specific, conditional on model manual, and never assumes capacity", () => {
  const applicable = ["Arroz Blanco", "Arroz Naranja", "Pastel de sushi", "Caldo de Albóndigas"];
  for (const name of applicable) {
    const guidance = find(name).equipmentMethods.riceCooker.join(" ");
    assert.match(guidance, /manual oficial del modelo/);
    assert.match(guidance, /No se asumen programa, tiempo ni capacidad/);
  }
  assert.match(find("Arroz Naranja").equipmentMethods.riceCooker.join(" "), /no sustituir silenciosamente el jugo/);
  assert.match(find("Pastel de sushi").equipmentMethods.riceCooker.join(" "), /enfriar rápidamente/i);
  assert.match(find("Caldo de Albóndigas").equipmentMethods.riceCooker.join(" "), /únicamente el arroz/);
  for (const draft of MENU_RECIPE_DRAFTS.filter((draft) => !applicable.includes(draft.menuName))) {
    assert.match(draft.equipmentMethods.riceCooker.join(" "), /No aplica/);
  }
});
