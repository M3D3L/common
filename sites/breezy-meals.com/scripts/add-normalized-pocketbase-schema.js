import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const AUTHENTICATED = '@request.auth.id != ""';
const VERIFIED_OR_SELF_CLOCK =
  "@request.auth.verified = true || @request.body.staff_user = @request.auth.id";
const USERS = "_pb_users_auth_";

const collectionIds = {
  migrationRuns: "brzmigrationrun",
  checklistTemplates: "brzchecktmpl001",
  checklistSections: "brzchecksect001",
  checklistItems: "brzcheckitem001",
  checklistRuns: "brzcheckruns001",
  checklistResults: "brzcheckrslt001",
  clockEntries: "brzclockentry01",
  recipes: "brzrecipes00001",
  recipeIngredients: "brzrecipeing001",
  recipeSteps: "brzrecipestp001",
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

const bool = (id, name, { required = false } = {}) => ({
  system: false,
  id,
  name,
  type: "bool",
  required,
  presentable: false,
  unique: false,
  options: {},
});

const date = (id, name, { required = false } = {}) => ({
  system: false,
  id,
  name,
  type: "date",
  required,
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

export function normalizedCollections() {
  return [
    staffCollection(
      collectionIds.migrationRuns,
      "migration_runs",
      [
        text("migrkey1", "migration_key", { required: true }),
        select("migrstat", "status", ["running", "verified", "failed"], {
          required: true,
        }),
        text("migrhash", "source_hash", { required: true }),
        json("migrcnts", "counts"),
        json("migrerrs", "errors"),
        date("migrstrt", "started_at", { required: true }),
        date("migrdone", "completed_at"),
      ],
      [
        "CREATE UNIQUE INDEX `idx_migration_key` ON `migration_runs` (`migration_key`)",
      ],
    ),
    staffCollection(
      collectionIds.checklistTemplates,
      "checklist_templates",
      [
        text("ctlegacy", "legacy_id"),
        text("cttitle1", "title"),
        text("ctdescr1", "description"),
        text("cticon01", "icon"),
        number("ctsort01", "sort_order", { integer: true }),
        bool("ctactive", "active"),
        json("ctdays01", "days"),
        text("ctsource", "source_record", { required: true }),
        number("ctsrcidx", "source_index", { required: true, integer: true }),
        json("ctpayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_checklist_template_source` ON `checklist_templates` (`source_record`, `source_index`)",
      ],
    ),
    staffCollection(
      collectionIds.checklistSections,
      "checklist_sections",
      [
        relation("cstempl1", "template", collectionIds.checklistTemplates, {
          required: true,
          cascadeDelete: true,
        }),
        text("cslegacy", "legacy_key"),
        text("cslabel1", "label"),
        number("cssort01", "sort_order", { integer: true }),
        number("cssrcidx", "source_index", { required: true, integer: true }),
        json("cspaylod", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_checklist_section_source` ON `checklist_sections` (`template`, `source_index`)",
      ],
    ),
    staffCollection(
      collectionIds.checklistItems,
      "checklist_items",
      [
        relation("cisection", "section", collectionIds.checklistSections, {
          required: true,
          cascadeDelete: true,
        }),
        text("cilegacy", "legacy_id"),
        text("cilabel1", "label"),
        select("cikind01", "kind", ["check", "number", "text"]),
        bool("cirequir", "required"),
        text("ciunit01", "unit"),
        number("cimin001", "minimum"),
        number("cimax001", "maximum"),
        text("cihint01", "hint"),
        json("cidays01", "days"),
        number("cisort01", "sort_order", { integer: true }),
        number("cisrcidx", "source_index", { required: true, integer: true }),
        json("cipaylod", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_checklist_item_source` ON `checklist_items` (`section`, `source_index`)",
      ],
    ),
    staffCollection(
      collectionIds.checklistRuns,
      "checklist_runs",
      [
        relation("crtempl1", "template", collectionIds.checklistTemplates),
        text("crlegacy", "legacy_template_id"),
        text("crbizday", "business_date"),
        date("crstart1", "started_at"),
        date("crdone01", "completed_at"),
        number("crstartm", "started_at_ms", { integer: true }),
        number("crdonems", "completed_at_ms", { integer: true }),
        relation("cruser01", "performed_by", USERS),
        text("crbyname", "performed_by_name"),
        select("crstatus", "status", ["in_progress", "done"]),
        text("crsource", "source_record", { required: true }),
        json("crpayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_checklist_run_day` ON `checklist_runs` (`source_record`, `legacy_template_id`, `business_date`)",
      ],
    ),
    staffCollection(
      collectionIds.checklistResults,
      "checklist_results",
      [
        relation("cresrun1", "run", collectionIds.checklistRuns, {
          required: true,
          cascadeDelete: true,
        }),
        relation("cresitem", "item", collectionIds.checklistItems),
        text("cresleg1", "legacy_item_id"),
        bool("cresdone", "done"),
        number("cresnum1", "number_value"),
        text("crestext", "text_value"),
        date("cresat01", "checked_at"),
        number("cresatms", "checked_at_ms", { integer: true }),
        relation("cresuser", "checked_by", USERS),
        text("cresname", "checked_by_name"),
        json("crespayl", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_checklist_result_item` ON `checklist_results` (`run`, `legacy_item_id`)",
      ],
    ),
    {
      ...staffCollection(
        collectionIds.clockEntries,
        "clock_entries",
        [
          relation("ceuser01", "staff_user", USERS),
          text("celegacy", "legacy_user_id"),
          text("cename01", "staff_name"),
          select("cedirect", "direction", ["in", "out"]),
          date("ceoccur1", "occurred_at"),
          text("ceatraw1", "legacy_occurred_at"),
          text("cesource", "source_record", { required: true }),
          number("ceindex1", "source_index", { required: true, integer: true }),
          text("cehash01", "source_hash", { required: true }),
          json("cepaylod", "legacy_payload", { required: true }),
        ],
        [
          "CREATE UNIQUE INDEX `idx_clock_entry_source` ON `clock_entries` (`source_record`, `source_index`)",
          "CREATE INDEX `idx_clock_entry_user_time` ON `clock_entries` (`legacy_user_id`, `occurred_at`)",
        ],
      ),
      createRule: VERIFIED_OR_SELF_CLOCK,
    },
    staffCollection(
      collectionIds.recipes,
      "recipes",
      [
        text("rclegacy", "legacy_id"),
        text("rctitle1", "title"),
        text("rcurl001", "source_url"),
        text("rcimage1", "image_url"),
        text("rcservng", "servings"),
        text("rcprep01", "prep_time"),
        text("rccook01", "cook_time"),
        text("rctotal1", "total_time"),
        text("rccateg1", "category"),
        text("rccal001", "calories"),
        text("rccarb01", "carbs"),
        text("rcfat001", "fat"),
        text("rcprot01", "protein"),
        bool("rcdetail", "has_detail"),
        text("rcsource", "source_record", { required: true }),
        number("rcsrcidx", "source_index", { required: true, integer: true }),
        json("rcpayload", "legacy_payload", { required: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_recipe_source` ON `recipes` (`source_record`, `source_index`)",
        "CREATE INDEX `idx_recipe_category` ON `recipes` (`category`)",
      ],
    ),
    staffCollection(
      collectionIds.recipeIngredients,
      "recipe_ingredients",
      [
        relation("rirecipe", "recipe", collectionIds.recipes, {
          required: true,
          cascadeDelete: true,
        }),
        text("ritext01", "text", { required: true }),
        number("risort01", "sort_order", { required: true, integer: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_recipe_ingredient_order` ON `recipe_ingredients` (`recipe`, `sort_order`)",
      ],
    ),
    staffCollection(
      collectionIds.recipeSteps,
      "recipe_steps",
      [
        relation("rsrecipe", "recipe", collectionIds.recipes, {
          required: true,
          cascadeDelete: true,
        }),
        text("rstext01", "instruction", { required: true }),
        number("rssort01", "sort_order", { required: true, integer: true }),
      ],
      [
        "CREATE UNIQUE INDEX `idx_recipe_step_order` ON `recipe_steps` (`recipe`, `sort_order`)",
      ],
    ),
  ];
}

export function addNormalizedSchema(schema) {
  if (!Array.isArray(schema)) {
    throw new TypeError("PocketBase schema must be an array of collections.");
  }

  const additions = normalizedCollections();
  const existingNames = new Set(schema.map((collection) => collection?.name));
  const conflicts = additions
    .map((collection) => collection.name)
    .filter((name) => existingNames.has(name));

  if (conflicts.length) {
    throw new Error(
      `Target collections already exist: ${conflicts.join(", ")}`,
    );
  }

  return [...schema, ...additions];
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    throw new Error(
      "Usage: node scripts/add-normalized-pocketbase-schema.js <input.json> <output.json>",
    );
  }

  const source = JSON.parse(await readFile(inputPath, "utf8"));
  const output = addNormalizedSchema(source);
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(
    `Preserved ${source.length} legacy collections and added ${output.length - source.length} normalized collections.`,
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
