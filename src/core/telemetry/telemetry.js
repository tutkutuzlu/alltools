export const EVENT_NAMES = Object.freeze(["page_view", "tool_open", "tool_use", "search", "search_result_open", "copy", "paste", "clear", "download", "theme_change"]);
export const EVENT_FIELDS = Object.freeze(["eventName", "toolId", "category", "placement", "theme", "queryLength", "resultCount", "source", "timestamp"]);
let adapter = Object.freeze({ track() {} });

export function sanitizeEvent(eventName, payload = {}, now = () => new Date()) {
  if (!EVENT_NAMES.includes(eventName)) return null;
  const safe = { eventName };
  for (const [key, value] of Object.entries(payload)) {
    if (["toolId", "category", "theme", "placement", "source"].includes(key) && typeof value === "string" && value) safe[key] = value.slice(0, 80);
    if (["queryLength", "resultCount"].includes(key) && Number.isInteger(value) && value >= 0) safe[key] = value;
  }
  safe.timestamp = now().toISOString();
  return Object.freeze(safe);
}

function emit(eventName, payload) {
  const event = sanitizeEvent(eventName, payload);
  if (event) adapter.track(eventName, event);
}

export function setTelemetryAdapter(nextAdapter) {
  if (!nextAdapter || typeof nextAdapter.track !== "function") throw new TypeError("Telemetry adapter requires track(event, payload).");
  adapter = nextAdapter;
}

export const telemetry = Object.freeze({
  trackPageView: (payload) => emit("page_view", payload),
  trackToolOpen: (payload) => emit("tool_open", payload),
  trackToolUse: (payload) => emit("tool_use", payload),
  trackSearch: (payload) => emit("search", payload),
  trackSearchResultOpen: (payload) => emit("search_result_open", payload),
  trackCopy: (payload) => emit("copy", payload),
  trackPaste: (payload) => emit("paste", payload),
  trackClear: (payload) => emit("clear", payload),
  trackDownload: (payload) => emit("download", payload),
  trackThemeChange: (payload) => emit("theme_change", payload)
});
