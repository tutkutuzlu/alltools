import test from "node:test";
import assert from "node:assert/strict";
import worker, { aggregateStatements } from "../experimental/cloudflare-analytics/worker/src/index.js";
import { validateBatch, validateEvent } from "../experimental/cloudflare-analytics/worker/src/validation.js";
import { buildSummary, buildToolStats } from "../experimental/cloudflare-analytics/worker/src/stats.js";

test("Worker strictly validates event batches", () => {
  const timestamp = "2026-08-03T12:00:00.000Z";
  assert.ok(validateEvent({ eventName: "tool_use", toolId: "word-counter", timestamp }));
  assert.equal(validateEvent({ eventName: "tool_use", text: "private", timestamp }), null);
  assert.equal(validateBatch({ siteId: "wrong", events: [{ eventName: "page_view", timestamp }] }), null);
});

test("D1 aggregate uses one atomic upsert per event", () => {
  const statements = [];
  const db = { prepare(sql) { return { bind(...values) { const statement = { sql, values }; statements.push(statement); return statement; } }; } };
  aggregateStatements(db, [{ eventName: "tool_use", toolId: "word-counter", category: "text" }, { eventName: "search", resultCount: 0 }], "2026-08-03");
  assert.equal(statements.length, 2);
  assert.match(statements[0].sql, /ON CONFLICT.*DO UPDATE SET count = count \+ 1/);
  assert.equal(statements[1].values[3], "search_no_result");
});

test("summary and tool stats calculate aggregate usage", () => {
  const rows = [{ date: "2026-08-03", tool_id: "word-counter", event_name: "tool_open", count: 10 }, { date: "2026-08-03", tool_id: "word-counter", event_name: "tool_use", count: 4 }, { date: "2026-08-03", tool_id: "", event_name: "search_no_result", count: 2 }];
  const summary = buildSummary(rows, "2026-08-03");
  assert.equal(summary.totals.toolUse, 4); assert.equal(summary.events.searchNoResult, 2);
  assert.equal(buildToolStats(rows, "word-counter").usageRate, 0.4);
});

test("Worker rejects disallowed origins before touching D1", async () => {
  const response = await worker.fetch(new Request("https://worker.test/api/events", { method: "POST", headers: { origin: "https://evil.test" }, body: "{}" }), { ALLOWED_ORIGINS: "https://tutkutuzlu.github.io" });
  assert.equal(response.status, 403);
});
