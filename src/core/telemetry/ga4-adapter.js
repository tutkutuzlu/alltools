const EVENT_NAMES = new Set(["page_view", "tool_open", "tool_use", "search", "search_result_open", "copy", "paste", "clear", "download", "theme_change"]);
const PARAMETER_MAP = Object.freeze({
  toolId: "tool_id",
  category: "category",
  source: "source",
  placement: "placement",
  theme: "theme",
  queryLength: "query_length",
  resultCount: "result_count"
});

export function isValidMeasurementId(value) {
  return typeof value === "string" && /^G-[A-Z0-9]{6,20}$/i.test(value);
}

export function mapGa4Event(eventName, payload = {}, debug = false) {
  if (!EVENT_NAMES.has(eventName)) return null;
  const parameters = {};
  for (const [source, target] of Object.entries(PARAMETER_MAP)) {
    const value = payload[source];
    if (["queryLength", "resultCount"].includes(source)) {
      if (Number.isInteger(value) && value >= 0) parameters[target] = value;
    } else if (typeof value === "string" && value) parameters[target] = value.slice(0, 80);
  }
  if (debug) parameters.debug_mode = true;
  return Object.freeze({ eventName, parameters: Object.freeze(parameters) });
}

export function createGa4Adapter(config = {}, transport = globalThis) {
  const enabled = config.enabled === true && config.provider === "ga4" && isValidMeasurementId(config.measurementId);
  if (!enabled) return Object.freeze({ enabled: false, track() {}, flush() {}, destroy() {} });
  const queue = [];
  const queueTtl = 10000;
  const maxQueue = 50;
  let pageViewSent = false;
  const openedTools = new Set();

  const send = (event) => {
    if (typeof transport.gtag !== "function") return false;
    try { transport.gtag("event", event.eventName, event.parameters); return true; } catch { return false; }
  };
  const flush = () => {
    const now = Date.now();
    while (queue.length) {
      const item = queue.shift();
      if (item.expiresAt >= now) send(item.event);
    }
  };
  const track = (eventName, payload) => {
    if (eventName === "page_view" && pageViewSent) return;
    if (eventName === "tool_open" && typeof payload?.toolId === "string" && openedTools.has(payload.toolId)) return;
    const event = mapGa4Event(eventName, payload, config.debug === true);
    if (!event) return;
    if (eventName === "page_view") pageViewSent = true;
    if (eventName === "tool_open" && typeof payload?.toolId === "string") openedTools.add(payload.toolId);
    if (!send(event)) {
      if (queue.length >= maxQueue) queue.shift();
      queue.push({ event, expiresAt: Date.now() + queueTtl });
    }
  };
  const ready = () => flush();
  transport.addEventListener?.("alltools:ga4-ready", ready);
  return Object.freeze({ enabled: true, track, flush, destroy() { transport.removeEventListener?.("alltools:ga4-ready", ready); queue.length = 0; } });
}

export function resolveAnalyticsConfig(config = {}, environment = "production") {
  return Object.freeze({ ...config, ...(config.environments?.[environment] ?? {}) });
}
