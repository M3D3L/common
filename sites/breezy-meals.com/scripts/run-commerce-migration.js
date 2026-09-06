import { readFile } from "node:fs/promises";
import http from "node:http";
import { pathToFileURL } from "node:url";
import PocketBase from "pocketbase";

import { createCommerceMigrationPlan } from "../lib/commerce-normalization.ts";
import {
  stableFingerprint,
  stableStringify,
} from "../lib/legacy-normalization.ts";

const POCKETBASE_URL = "https://api.breezy-meals.com";
const MIGRATION_KEY = "commerce-normalization-v1";

function groupRows(rows) {
  const groups = [];
  for (const row of rows) {
    const current = groups.at(-1);
    if (current?.[0]?.collection === row.collection) current.push(row);
    else groups.push([row]);
  }
  return groups;
}

async function mapLimit(values, limit, callback) {
  const results = new Array(values.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await callback(values[index], index);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, values.length) }, () => worker()),
  );
  return results;
}

function filterForIdentity(pb, identity, data) {
  const params = {};
  const expression = identity
    .map((field, index) => {
      params[`value${index}`] = data[field];
      return `${field} = {:value${index}}`;
    })
    .join(" && ");
  return pb.filter(expression, params);
}

async function findByIdentity(pb, row, data) {
  try {
    return await pb
      .collection(row.collection)
      .getFirstListItem(filterForIdentity(pb, row.identity, data), {
        requestKey: null,
      });
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
}

async function withRetry(operation, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (
        ![429, 500, 502, 503, 504].includes(error?.status) ||
        attempt === attempts
      ) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 250));
    }
  }
  throw lastError;
}

function resolveRowData(row, refToId) {
  const data = { ...row.data };
  for (const [field, ref] of Object.entries(row.relationRefs ?? {})) {
    const id = refToId.get(ref);
    if (!id) throw new Error(`Missing relation ${row.ref}.${field} -> ${ref}`);
    data[field] = id;
  }
  return data;
}

function projectLiveCollection(liveRecords, backupRecords, collection) {
  const liveById = new Map(liveRecords.map((record) => [record.id, record]));
  const backupIds = new Set(backupRecords.map((record) => record.id));
  const addedIds = liveRecords
    .map((record) => record.id)
    .filter((id) => !backupIds.has(id));
  if (addedIds.length || liveRecords.length !== backupRecords.length) {
    throw new Error(
      `${collection} changed after backup: expected ${backupRecords.length}, found ${liveRecords.length}.`,
    );
  }

  return backupRecords.map((backup) => {
    const live = liveById.get(backup.id);
    if (!live)
      throw new Error(`${collection} record disappeared: ${backup.id}`);
    return comparableSourceRecord(live, Object.keys(backup));
  });
}

export function comparableSourceRecord(
  record,
  sourceKeys = Object.keys(record),
) {
  return Object.fromEntries(
    sourceKeys
      .filter((key) => key !== "updated")
      .map((key) => [key, record[key]]),
  );
}

async function verifySource(pb, snapshot, sourceHash) {
  const [menu, comandas] = await Promise.all([
    pb.collection("menu").getFullList({ sort: "created", requestKey: null }),
    pb
      .collection("comandas")
      .getFullList({ sort: "created", requestKey: null }),
  ]);
  const projected = {
    menu: projectLiveCollection(menu, snapshot.collections.menu, "menu"),
    comandas: projectLiveCollection(
      comandas,
      snapshot.collections.comandas,
      "comandas",
    ),
  };
  const expected = {
    menu: snapshot.collections.menu.map((record) =>
      comparableSourceRecord(record),
    ),
    comandas: snapshot.collections.comandas.map((record) =>
      comparableSourceRecord(record),
    ),
  };
  const liveHash = stableFingerprint(projected);
  const expectedHash = stableFingerprint(expected);
  if (liveHash !== expectedHash) {
    throw new Error(
      `Source fields changed after backup: expected ${expectedHash}, found ${liveHash} (backup ${sourceHash}).`,
    );
  }
}

export function migrationValuesEqual(field, actual, expected) {
  if (
    field.endsWith("_at") &&
    typeof actual === "string" &&
    typeof expected === "string"
  ) {
    const actualTime = new Date(actual).getTime();
    const expectedTime = new Date(expected).getTime();
    if (
      !Number.isNaN(actualTime) &&
      !Number.isNaN(expectedTime) &&
      actualTime === expectedTime
    ) {
      return true;
    }
  }
  return stableStringify(actual) === stableStringify(expected);
}

function recordMatches(record, data) {
  return Object.entries(data).every(([field, expected]) =>
    migrationValuesEqual(field, record[field], expected),
  );
}

function assertField(record, field, expected, context) {
  const actual = record[field];
  if (!migrationValuesEqual(field, actual, expected)) {
    throw new Error(
      `${context}.${field} mismatch: expected ${stableStringify(expected)}, found ${stableStringify(actual)}.`,
    );
  }
}

export async function runCommerceMigration({
  snapshot,
  token,
  logger = console,
}) {
  const plan = createCommerceMigrationPlan(snapshot);
  const pb = new PocketBase(POCKETBASE_URL);
  pb.autoCancellation(false);
  pb.authStore.save(token);

  if (!pb.authStore.isValid)
    throw new Error("The supplied staff token is invalid.");
  await verifySource(pb, snapshot, plan.sourceHash);
  logger.log(`Source verified: ${plan.sourceHash}`);

  const refToId = new Map();
  let completedRows = 0;
  for (const rows of groupRows(plan.rows)) {
    await mapLimit(rows, 6, async (row) => {
      const data = resolveRowData(row, refToId);
      const existing = await withRetry(() => findByIdentity(pb, row, data));
      const record = existing
        ? recordMatches(existing, data)
          ? existing
          : await withRetry(() =>
              pb.collection(row.collection).update(existing.id, data, {
                requestKey: null,
              }),
            )
        : await withRetry(() =>
            pb.collection(row.collection).create(data, { requestKey: null }),
          );
      refToId.set(row.ref, record.id);
      completedRows += 1;
    });
    logger.log(`${rows[0].collection}: ${rows.length} rows copied`);
  }

  for (const update of plan.updates) {
    const backup = snapshot.collections.comandas.find(
      (record) => record.id === update.recordId,
    );
    const current = await pb.collection("comandas").getOne(update.recordId, {
      requestKey: null,
    });
    if (stableFingerprint(current.data) !== stableFingerprint(backup?.data)) {
      throw new Error(
        `Comanda snapshot changed before update: ${update.recordId}`,
      );
    }
    await withRetry(() =>
      pb.collection("comandas").update(update.recordId, update.data, {
        requestKey: null,
      }),
    );
  }
  logger.log(`comandas: ${plan.updates.length} typed updates copied`);

  for (const rows of groupRows(plan.rows)) {
    await mapLimit(rows, 6, async (row) => {
      const data = resolveRowData(row, refToId);
      const record = await findByIdentity(pb, row, data);
      if (!record) throw new Error(`Verification row missing: ${row.ref}`);
      for (const [field, expected] of Object.entries(data)) {
        assertField(record, field, expected, row.ref);
      }
    });
  }

  for (const update of plan.updates) {
    const record = await pb.collection("comandas").getOne(update.recordId, {
      requestKey: null,
    });
    const backup = snapshot.collections.comandas.find(
      (source) => source.id === update.recordId,
    );
    if (stableFingerprint(record.data) !== stableFingerprint(backup?.data)) {
      throw new Error(
        `Comanda data changed during migration: ${update.recordId}`,
      );
    }
    for (const [field, expected] of Object.entries(update.data)) {
      assertField(record, field, expected, `comandas:${update.recordId}`);
    }
  }

  await verifySource(pb, snapshot, plan.sourceHash);
  const now = new Date().toISOString();
  let migrationRun;
  try {
    migrationRun = await pb
      .collection("migration_runs")
      .getFirstListItem(
        pb.filter("migration_key = {:key}", { key: MIGRATION_KEY }),
        {
          requestKey: null,
        },
      );
  } catch (error) {
    if (error?.status !== 404) throw error;
  }
  const audit = {
    migration_key: MIGRATION_KEY,
    status: "verified",
    source_hash: plan.sourceHash,
    counts: plan.counts,
    errors: plan.warnings,
    started_at: now,
    completed_at: now,
  };
  if (migrationRun) {
    await pb.collection("migration_runs").update(migrationRun.id, audit, {
      requestKey: null,
    });
  } else {
    await pb.collection("migration_runs").create(audit, { requestKey: null });
  }

  return {
    sourceHash: plan.sourceHash,
    rows: completedRows,
    updates: plan.updates.length,
    counts: plan.counts,
    warnings: plan.warnings,
  };
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
  const [, , backupPath, command = "--dry-run", portArg = "43124"] =
    process.argv;
  if (!backupPath) {
    throw new Error(
      "Usage: node scripts/run-commerce-migration.js <backup.json> [--dry-run|--listen-token] [port]",
    );
  }
  const snapshot = JSON.parse(await readFile(backupPath, "utf8"));
  const plan = createCommerceMigrationPlan(snapshot);
  if (command === "--dry-run") {
    console.log(
      JSON.stringify(
        {
          sourceHash: plan.sourceHash,
          rows: plan.rows.length,
          updates: plan.updates.length,
          counts: plan.counts,
          warnings: plan.warnings,
        },
        null,
        2,
      ),
    );
    return;
  }
  if (command !== "--listen-token")
    throw new Error(`Unknown command: ${command}`);
  const token = await receiveToken(Number(portArg));
  const result = await runCommerceMigration({ snapshot, token });
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
