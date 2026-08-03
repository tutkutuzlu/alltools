import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeEvent, setTelemetryAdapter, telemetry } from "../src/core/telemetry/telemetry.js";

test("telemetry only forwards approved non-sensitive fields", () => {
  const events = [];
  setTelemetryAdapter({ track: (event, payload) => events.push({ event, payload }) });
  telemetry.trackCopy({ toolId: "word-counter", text: "private user text", query: "secret" });
  assert.equal(events[0].event, "copy");
  assert.equal(events[0].payload.toolId, "word-counter");
  assert.equal("text" in events[0].payload, false);
  assert.equal("query" in events[0].payload, false);
  assert.match(events[0].payload.timestamp, /^\d{4}-/);
});

test("event allowlist rejects unknown events and strips all free-form payload", () => {
  assert.equal(sanitizeEvent("unknown", {}), null);
  const event = sanitizeEvent("search", { queryLength: 6, resultCount: 0, query: "secret", url: "?email=x", content: "private" }, () => new Date("2026-08-03T00:00:00Z"));
  assert.deepEqual(event, { eventName: "search", queryLength: 6, resultCount: 0, timestamp: "2026-08-03T00:00:00.000Z" });
});
