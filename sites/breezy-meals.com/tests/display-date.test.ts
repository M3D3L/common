import assert from "node:assert/strict";
import test from "node:test";
import { parseDisplayDateQuery } from "../utils/displayDate.ts";

test("no date query leaves the display on today's menu", () => {
  assert.deepEqual(parseDisplayDateQuery(undefined), { date: null, error: null });
});

test("accepts calendar dates, including leap days", () => {
  for (const date of ["2026-10-19", "2028-02-29", "2026-12-31"]) {
    assert.deepEqual(parseDisplayDateQuery(date), { date, error: null });
  }
});

test("rejects malformed, repeated, and impossible dates with a visible error message", () => {
  for (const value of [
    null,
    "",
    "monday",
    "2026-1-19",
    "2026-10-19T12:00:00Z",
    "2026-02-29",
    "2026-04-31",
    "2026-00-19",
    "2026-13-19",
    "2026-10-00",
    "2026-10-32",
    ["2026-10-19"],
    ["2026-10-19", "2026-10-20"],
  ]) {
    const result = parseDisplayDateQuery(value);
    assert.equal(result.date, null);
    assert.match(result.error!, /YYYY-MM-DD/);
    assert.match(result.error!, /Mostrando el menú de hoy/);
  }
});
