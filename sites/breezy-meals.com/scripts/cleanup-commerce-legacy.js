import { chmod, readFile, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import PocketBase from "pocketbase";

import { createCommerceMigrationPlan } from "../lib/commerce-normalization.ts";
import {
  buildNormalizedMenuRecord,
  legacyMenuCleanupPayload,
} from "../lib/normalized-menu.ts";
import { stableStringify } from "../lib/legacy-normalization.ts";

const POCKETBASE_URL = "https://api.breezy-meals.com";
const MIGRATION_KEY = "commerce-normalization-v1";
const CLEANUP_KEY = "commerce-legacy-cleanup-v1";
const COLLECTIONS = [
  "menu",
  "menu_categories",
  "menu_items",
  "menu_week_blocks",
  "menu_week_days",
  "menu_day_items",
  "menu_schedules",
  "menu_rotation_slots",
  "menu_week_overrides",
  "menu_service_days",
  "menu_service_items",
];
const COLLECTION_SORTS = {
  menu: "created",
  menu_categories: "sort_order",
  menu_items: "source_index",
  menu_week_blocks: "sort_order",
  menu_week_days: "weekday",
  menu_day_items: "sort_order",
  menu_schedules: "created",
  menu_rotation_slots: "sort_order",
  menu_week_overrides: "week_monday",
  menu_service_days: "business_date",
  menu_service_items: "sort_order",
};
const SAFE_FIELDS = [
  "dishes",
  "store",
  "week_blocks",
  "rotation",
  "rotation_anchor",
  "overrides",
];

const recordData = (record) => JSON.parse(JSON.stringify(record));

async function fetchCollections(pb) {
  return Object.fromEntries(
    await Promise.all(
      COLLECTIONS.map(async (collection) => [
        collection,
        (
          await pb.collection(collection).getFullList({
            sort: COLLECTION_SORTS[collection],
            requestKey: null,
          })
        ).map(recordData),
      ]),
    ),
  );
}

function normalizedRows(collections) {
  return {
    categories: collections.menu_categories,
    items: collections.menu_items,
    blocks: collections.menu_week_blocks,
    days: collections.menu_week_days,
    dayItems: collections.menu_day_items,
    schedules: collections.menu_schedules,
    rotationSlots: collections.menu_rotation_slots,
    overrides: collections.menu_week_overrides,
    serviceDays: collections.menu_service_days,
    serviceItems: collections.menu_service_items,
  };
}

function firstDifference(actual, expected, currentPath = "") {
  if (stableStringify(actual) === stableStringify(expected)) return null;
  if (
    !actual ||
    !expected ||
    typeof actual !== "object" ||
    typeof expected !== "object" ||
    Array.isArray(actual) !== Array.isArray(expected)
  ) {
    return { path: currentPath, actual, expected };
  }
  const keys = Array.isArray(actual)
    ? Array.from(
        { length: Math.max(actual.length, expected.length) },
        (_, index) => index,
      )
    : [...new Set([...Object.keys(actual), ...Object.keys(expected)])].sort();
  for (const key of keys) {
    const difference = firstDifference(
      actual[key],
      expected[key],
      currentPath ? `${currentPath}.${key}` : String(key),
    );
    if (difference) return difference;
  }
  return { path: currentPath, actual, expected };
}

function assertReconstructable(menu, reconstructed, fields) {
  for (const field of fields) {
    if (
      stableStringify(menu[field]) !== stableStringify(reconstructed[field])
    ) {
      const difference = firstDifference(menu[field], reconstructed[field]);
      throw new Error(
        `Menu ${menu.id}.${field} does not exactly match normalized data at ${difference?.path || field}: ` +
          `${stableStringify(difference?.actual)} != ${stableStringify(difference?.expected)}.`,
      );
    }
  }
}

async function verifiedMigration(pb, sourceHash) {
  const run = await pb
    .collection("migration_runs")
    .getFirstListItem(
      pb.filter("migration_key = {:key}", { key: MIGRATION_KEY }),
      { requestKey: null },
    );
  if (run.status !== "verified" || run.source_hash !== sourceHash) {
    throw new Error(
      `Migration verification mismatch: expected verified/${sourceHash}.`,
    );
  }
}

async function writeSnapshot(snapshot, backupPath) {
  const stamp = new Date().toISOString().replaceAll(":", "-");
  const outputPath = path.join(
    path.dirname(backupPath),
    `breezy-commerce-pre-cleanup-${stamp}.json`,
  );
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, {
    mode: 0o600,
  });
  await chmod(outputPath, 0o600);
  return outputPath;
}

export async function cleanupCommerceLegacy({
  backup,
  backupPath,
  token,
  apply = false,
  logger = console,
}) {
  const sourceHash = createCommerceMigrationPlan(backup).sourceHash;
  const pb = new PocketBase(POCKETBASE_URL);
  pb.autoCancellation(false);
  pb.authStore.save(token);
  if (!pb.authStore.isValid) throw new Error("Invalid staff token.");

  await verifiedMigration(pb, sourceHash);
  const collections = await fetchCollections(pb);
  const rows = normalizedRows(collections);
  const audits = collections.menu.map((menu) => {
    const reconstructed = buildNormalizedMenuRecord(menu, rows);
    assertReconstructable(menu, reconstructed, SAFE_FIELDS);
    const schedule = rows.schedules.find(
      (item) => item.source_record === menu.id || item.menu === menu.id,
    );
    const hasDatedService = Boolean(
      schedule && rows.serviceDays.some((day) => day.schedule === schedule.id),
    );
    const fields = hasDatedService
      ? [...SAFE_FIELDS, "active", "active_date", "sold_out"]
      : SAFE_FIELDS;
    assertReconstructable(menu, reconstructed, fields);
    return { menu, reconstructed, fields, hasDatedService };
  });

  logger.log(
    `Verified ${audits.length} menu record(s); cleanup fields: ${[
      ...new Set(audits.flatMap((audit) => audit.fields)),
    ].join(", ")}`,
  );
  if (!apply) return { sourceHash, records: audits.length, applied: false };

  const snapshotPath = await writeSnapshot(
    { exportedAt: new Date().toISOString(), collections },
    backupPath,
  );
  logger.log(`Pre-cleanup snapshot: ${snapshotPath}`);

  for (const audit of audits) {
    await pb
      .collection("menu")
      .update(audit.menu.id, legacyMenuCleanupPayload(audit.hasDatedService), {
        requestKey: null,
      });
  }

  const cleaned = await fetchCollections(pb);
  const cleanedRows = normalizedRows(cleaned);
  for (const audit of audits) {
    const menu = cleaned.menu.find((record) => record.id === audit.menu.id);
    if (!menu) throw new Error(`Cleaned menu disappeared: ${audit.menu.id}`);
    const reconstructed = buildNormalizedMenuRecord(menu, cleanedRows);
    assertReconstructable(audit.reconstructed, reconstructed, audit.fields);
  }

  await pb.collection("migration_runs").create(
    {
      migration_key: CLEANUP_KEY,
      status: "verified",
      source_hash: sourceHash,
      counts: { menu_records: audits.length, cleared_fields: SAFE_FIELDS },
      errors: [],
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    },
    { requestKey: null },
  );
  return { sourceHash, records: audits.length, applied: true, snapshotPath };
}

async function receiveToken(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      let token = "";
      request.setEncoding("utf8");
      request.on("data", (chunk) => {
        token += chunk;
      });
      request.on("end", () => {
        response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
        response.end("accepted");
        server.close();
        if (!token.trim()) reject(new Error("Received an empty staff token."));
        else resolve(token.trim());
      });
    });
    server.listen(port, "127.0.0.1", () => {
      console.log(
        `Waiting for the authenticated staff session on port ${port}.`,
      );
    });
  });
}

async function main() {
  const [, , backupPath, command = "--audit", portArg = "43125"] = process.argv;
  if (!backupPath || !["--audit", "--apply"].includes(command)) {
    throw new Error(
      "Usage: node scripts/cleanup-commerce-legacy.js <backup.json> [--audit|--apply] [port]",
    );
  }
  const backup = JSON.parse(await readFile(backupPath, "utf8"));
  const token = await receiveToken(Number(portArg));
  const result = await cleanupCommerceLegacy({
    backup,
    backupPath,
    token,
    apply: command === "--apply",
  });
  console.log(JSON.stringify(result, null, 2));
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(error?.response?.data ?? error.message);
    process.exitCode = 1;
  });
}
