import test from "node:test";
import assert from "node:assert/strict";
import { createGa4Adapter, mapGa4Event } from "../src/core/telemetry/ga4-adapter.js";
import { initializeConsentBoundary, startGoogleTag } from "../src/core/telemetry/ga4-loader.js";
import { createToolUseTracker } from "../src/core/telemetry/tool-use.js";

const config = { enabled: true, provider: "ga4", measurementId: "G-ABC1234567", debug: false };

test("disabled analytics and missing measurement ID are no-ops", () => {
  const calls = [];
  createGa4Adapter({ ...config, enabled: false }, { gtag: (...args) => calls.push(args) }).track("page_view", {});
  createGa4Adapter({ ...config, measurementId: "" }, { gtag: (...args) => calls.push(args) }).track("page_view", {});
  assert.deepEqual(calls, []);
});

test("GA4 mapping uses only approved snake_case parameters", () => {
  const event = mapGa4Event("search", { queryLength: 6, resultCount: 0, query: "secret", text: "private", toolId: "word-counter" });
  assert.deepEqual(event, { eventName: "search", parameters: { tool_id: "word-counter", query_length: 6, result_count: 0 } });
  assert.equal(mapGa4Event("unknown", {}), null);
});

test("adapter queues while gtag is unavailable and flushes safely", () => {
  const listeners = new Map(), calls = [];
  const transport = { addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener() {} };
  const adapter = createGa4Adapter(config, transport);
  adapter.track("copy", { toolId: "word-counter", text: "never send" });
  transport.gtag = (...args) => calls.push(args);
  listeners.get("alltools:ga4-ready")();
  assert.deepEqual(calls, [["event", "copy", { tool_id: "word-counter" }]]);
});

test("manual page_view is emitted at most once", () => {
  const calls = [], adapter = createGa4Adapter(config, { gtag: (...args) => calls.push(args), addEventListener() {}, removeEventListener() {} });
  adapter.track("page_view", { source: "site" });
  adapter.track("page_view", { source: "site" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "event");
  assert.equal(calls[0][1], "page_view");
});

test("tool_open is emitted once per tool page session", () => {
  const calls = [], adapter = createGa4Adapter(config, { gtag: (...args) => calls.push(args), addEventListener() {}, removeEventListener() {} });
  adapter.track("tool_open", { toolId: "word-counter" });
  adapter.track("tool_open", { toolId: "word-counter" });
  assert.equal(calls.length, 1);
});

test("consentRequired does not load Google tag before an explicit grant", () => {
  const listeners = new Map(), appended = [];
  const transport = { addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener() {}, document: { createElement: () => ({ addEventListener() {}, set async(value) {}, set src(value) { this.url = value; } }), head: { append: (node) => appended.push(node) } }, dispatchEvent() {} };
  initializeConsentBoundary({ ...config, consentRequired: true }, transport);
  assert.equal(appended.length, 0);
  listeners.get("alltools:analytics-consent")({ detail: { analyticsStorage: "granted" } });
  assert.equal(appended.length, 1);
});

test("Google tag startup disables automatic page views and advertising signals", () => {
  const calls = [], appended = [];
  const script = { addEventListener() {} };
  const transport = { dataLayer: [], document: { createElement: () => script, head: { append: (node) => appended.push(node) } }, dispatchEvent() {} };
  assert.equal(startGoogleTag(config, transport), true);
  for (const args of transport.dataLayer) calls.push([...args]);
  const configCall = calls.find((args) => args[0] === "config");
  assert.equal(configCall[2].send_page_view, false);
  assert.equal(configCall[2].allow_google_signals, false);
  assert.equal(configCall[2].allow_ad_personalization_signals, false);
});

test("Word Counter meaningful use is debounced and deduplicated", () => {
  const events = []; let callback;
  const tracker = createToolUseTracker({ telemetry: { trackToolUse: (event) => events.push(event) }, toolId: "word-counter", debounceMs: 1, setTimer: (fn) => { callback = fn; return 1; }, clearTimer() {} });
  tracker.observe(false); tracker.observe(true); tracker.observe(true); callback(); tracker.observe(true);
  assert.equal(events.length, 1);
});
