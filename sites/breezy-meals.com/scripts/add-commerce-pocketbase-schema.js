import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const AUTHENTICATED = '@request.auth.id != ""';
const MENU_COLLECTION = "eyo86eymxgiyifl";
const COMANDAS_COLLECTION = "7pnmvktzc496xgu";

const collectionIds = {
  categories: "brzmenucateg001",
  items: "brzmenuitems001",
  weekBlocks: "brzweekblock001",
  weekDays: "brzweekdays0001",
  dayItems: "brzdayitems0001",
  schedules: "brzschedules001",
  rotationSlots: "brzrotations001",
  weekOverrides: "brzweekoverrd01",
  serviceDays: "brzserviceday01",
  serviceItems: "brzserviceitm01",
  orderLines: "brzorderlines01",
};

const text = (id, name, { required = false, unique = false } = {}) => ({
  system: false,
  id,
  name,
  type: "text",
  required,
  presentable: false,
  unique,
  options: { min: null, max: null, pattern: "" },
});

const number = (id, name, { required = false, integer = false } = {}) => ({
  system: false,
  id,
  name,
  type: "number",
  required,
  presentable: false,
  unique: false,
  options: { min: null, max: null, noDecimal: integer },
});

const bool = (id, name) => ({
  system: false,
  id,
  name,
  type: "bool",
  required: false,
  presentable: false,
  unique: false,
  options: {},
});

const date = (id, name) => ({
  system: false,
  id,
  name,
  type: "date",
  required: false,
  presentable: false,
  unique: false,
  options: { min: "", max: "" },
});

const json = (id, name, { required = false } = {}) => ({
  system: false,
  id,
  name,
  type: "json",
  required,
  presentable: false,
  unique: false,
  options: { maxSize: 2000000 },
});

const select = (id, name, values, { required = false } = {}) => ({
  system: false,
  id,
  name,
  type: "select",
  required,
  presentable: false,
  unique: false,
  options: { maxSelect: 1, values },
});

const relation = (
  id,
  name,
  collectionId,
  { required = false, cascadeDelete = false } = {},
) => ({
  system: false,
  id,
  name,
  type: "relation",
  required,
  presentable: false,
  unique: false,
  options: {
    collectionId,
    cascadeDelete,
    minSelect: null,
    maxSelect: 1,
    displayFields: null,
  },
});

const staffCollection = (id, name, schema, indexes = []) => ({
  id,
  name,
  type: "base",
  system: false,
  schema,
  indexes,
  listRule: AUTHENTICATED,
  viewRule: AUTHENTICATED,
  createRule: AUTHENTICATED,
  updateRule: AUTHENTICATED,
  deleteRule: AUTHENTICATED,
  options: {},
});

const publicReadCollection = (id, name, schema, indexes = []) => ({
  ...staffCollection(id, name, schema, indexes),
  listRule: "",
  viewRule: "",
});

export function comandaTypedFields() {
  return [
    text("coorderuid", "order_uid"),
    number("conumber01", "order_number", { integer: true }),
    select("costatus01", "status", ["active", "ready", "discarded"]),
    select("comode0001", "mode", ["llevar", "aqui", "domicilio"]),
    date("coplacedat", "placed_at"),
    text("cofulfildt", "fulfill_date"),
    text("cofulfiltm", "fulfill_time"),
    text("cocustname", "customer_name"),
    text("cocustphon", "customer_phone"),
    text("cocustaddr", "customer_address"),
    text("comembercd", "member_code"),
    number("cosubtotal", "subtotal"),
    number("codelivfee", "delivery_fee"),
    number("cototal001", "total"),
    text("copromoid1", "promo_id"),
    text("copromolbl", "promo_label"),
    text("cosnaphash", "snapshot_hash"),
  ];
}

export function commerceCollections() {
  return [
    publicReadCollection(
      collectionIds.categories,
      "menu_categories",
      [
        text("mckey0001", "key", { required: true }),
        text("mclabel01", "label", { required: true }),
        select("mckind001", "kind", ["main", "side", "drink"]),
        number("mcsort001", "sort_order", { integer: true }),
        text("mcsource1", "source_record", { required: true }),
        json("mcpayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_menu_category_key` ON `menu_categories` (`source_record`, `key`)",
      ],
    ),
    publicReadCollection(
      collectionIds.items,
      "menu_items",
      [
        relation("micategor", "category", collectionIds.categories, {
          required: true,
        }),
        select("misurface", "surface", ["dishes", "store"], {
          required: true,
        }),
        text("miname001", "name"),
        number("miprice01", "price"),
        text("miimage01", "image_url"),
        json("micombo01", "combo"),
        text("misource1", "source_record", { required: true }),
        number("misrcidx1", "source_index", { required: true, integer: true }),
        json("mipayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_menu_item_source` ON `menu_items` (`source_record`, `surface`, `category`, `source_index`)",
        "CREATE INDEX `idx_menu_item_name` ON `menu_items` (`name`)",
      ],
    ),
    publicReadCollection(
      collectionIds.weekBlocks,
      "menu_week_blocks",
      [
        text("mblegacy1", "legacy_id"),
        text("mbname001", "name"),
        text("mbcolor01", "color"),
        number("mbsort001", "sort_order", { integer: true }),
        text("mbsource1", "source_record", { required: true }),
        number("mbsrcidx1", "source_index", { required: true, integer: true }),
        json("mbpayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_menu_block_source` ON `menu_week_blocks` (`source_record`, `source_index`)",
      ],
    ),
    publicReadCollection(
      collectionIds.weekDays,
      "menu_week_days",
      [
        relation("mdblock01", "block", collectionIds.weekBlocks, {
          required: true,
          cascadeDelete: true,
        }),
        number("mdweekday", "weekday", { required: true, integer: true }),
        number("mdsrcidx1", "source_index", { required: true, integer: true }),
        json("mdpayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_menu_block_day` ON `menu_week_days` (`block`, `weekday`)",
      ],
    ),
    publicReadCollection(
      collectionIds.dayItems,
      "menu_day_items",
      [
        relation("mdiday001", "day", collectionIds.weekDays, {
          required: true,
          cascadeDelete: true,
        }),
        relation("mdiitem01", "item", collectionIds.items),
        relation("mdicateg1", "category", collectionIds.categories, {
          required: true,
        }),
        text("mdiname01", "legacy_name"),
        number("mdisort01", "sort_order", { required: true, integer: true }),
        json("mdipayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_menu_day_item_order` ON `menu_day_items` (`day`, `category`, `sort_order`)",
      ],
    ),
    publicReadCollection(
      collectionIds.schedules,
      "menu_schedules",
      [
        relation("msmenu001", "menu", MENU_COLLECTION, { required: true }),
        text("msanchor1", "rotation_anchor"),
        text("mssource1", "source_record", { required: true }),
        json("mspayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_menu_schedule_source` ON `menu_schedules` (`source_record`)",
      ],
    ),
    publicReadCollection(
      collectionIds.rotationSlots,
      "menu_rotation_slots",
      [
        relation("mrssched1", "schedule", collectionIds.schedules, {
          required: true,
          cascadeDelete: true,
        }),
        relation("mrsblock1", "block", collectionIds.weekBlocks),
        text("mrslegid1", "legacy_block_id"),
        number("mrssort01", "sort_order", { required: true, integer: true }),
        json("mrspayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_menu_rotation_order` ON `menu_rotation_slots` (`schedule`, `sort_order`)",
      ],
    ),
    publicReadCollection(
      collectionIds.weekOverrides,
      "menu_week_overrides",
      [
        relation("mwosched1", "schedule", collectionIds.schedules, {
          required: true,
          cascadeDelete: true,
        }),
        text("mwomonday", "week_monday", { required: true }),
        select("mwokind01", "kind", ["block", "closed"], { required: true }),
        relation("mwoblock1", "block", collectionIds.weekBlocks),
        text("mwolegid1", "legacy_block_id"),
        json("mwopayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_menu_override_week` ON `menu_week_overrides` (`schedule`, `week_monday`)",
      ],
    ),
    publicReadCollection(
      collectionIds.serviceDays,
      "menu_service_days",
      [
        relation("msdsched1", "schedule", collectionIds.schedules, {
          required: true,
        }),
        text("msdbizday", "business_date", { required: true }),
        select("msdsource", "source_kind", ["auto", "manual", "legacy"]),
        relation("msdblock1", "block", collectionIds.weekBlocks),
        bool("msdclosed1", "closed"),
        json("msdpayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_menu_service_day` ON `menu_service_days` (`schedule`, `business_date`)",
      ],
    ),
    publicReadCollection(
      collectionIds.serviceItems,
      "menu_service_items",
      [
        relation("msiservic", "service_day", collectionIds.serviceDays, {
          required: true,
          cascadeDelete: true,
        }),
        relation("msiitem01", "item", collectionIds.items),
        relation("msicateg1", "category", collectionIds.categories, {
          required: true,
        }),
        text("msiname01", "legacy_name"),
        number("msisort01", "sort_order", { required: true, integer: true }),
        bool("msisold01", "sold_out"),
        json("msipayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_menu_service_item` ON `menu_service_items` (`service_day`, `category`, `sort_order`)",
      ],
    ),
    staffCollection(
      collectionIds.orderLines,
      "comanda_lines",
      [
        relation("clcomanda", "comanda", COMANDAS_COLLECTION, {
          required: true,
          cascadeDelete: true,
        }),
        relation("clitem001", "menu_item", collectionIds.items),
        text("clname001", "item_name"),
        number("clqty0001", "quantity", { required: true, integer: true }),
        number("clunitprc", "unit_price"),
        number("cltotal01", "line_total"),
        number("clsort001", "sort_order", { required: true, integer: true }),
        json("clpayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_comanda_line_order` ON `comanda_lines` (`comanda`, `sort_order`)",
      ],
    ),
  ];
}

export function addCommerceSchema(schema) {
  if (!Array.isArray(schema)) {
    throw new TypeError("PocketBase schema must be an array of collections.");
  }

  const additions = commerceCollections();
  const existingNames = new Set(schema.map((collection) => collection?.name));
  const conflicts = additions
    .map((collection) => collection.name)
    .filter((name) => existingNames.has(name));
  if (conflicts.length) {
    throw new Error(
      `Target collections already exist: ${conflicts.join(", ")}`,
    );
  }

  const comandas = schema.find(
    (collection) =>
      collection?.id === COMANDAS_COLLECTION || collection?.name === "comandas",
  );
  if (!comandas) throw new Error("Required collection not found: comandas");

  const existingFields = new Set(comandas.schema?.map((field) => field.name));
  const fieldConflicts = comandaTypedFields()
    .map((field) => field.name)
    .filter((name) => existingFields.has(name));
  if (fieldConflicts.length) {
    throw new Error(
      `Target comandas fields already exist: ${fieldConflicts.join(", ")}`,
    );
  }

  const output = schema.map((collection) => {
    if (collection !== comandas) return collection;
    return {
      ...collection,
      schema: [...(collection.schema ?? []), ...comandaTypedFields()],
    };
  });
  return [...output, ...additions];
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    throw new Error(
      "Usage: node scripts/add-commerce-pocketbase-schema.js <input.json> <output.json>",
    );
  }

  const source = JSON.parse(await readFile(inputPath, "utf8"));
  const output = addCommerceSchema(source);
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(
    `Preserved ${source.length} collections, added ${commerceCollections().length} collections, and appended ${comandaTypedFields().length} optional comandas fields.`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
