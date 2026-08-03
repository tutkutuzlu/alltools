import { sanitizeEvent } from "./telemetry.js";

export function resolveAnalyticsConfig(config = {}, environment = "production") {
  return Object.freeze({ ...config, ...(config.environments?.[environment] ?? {}) });
}

export function createFirstPartyAnalyticsAdapter(config = {}, transport = globalThis) {
  const enabled = config.enabled === true && typeof config.endpoint === "string" && config.endpoint.length > 0;
  if (!enabled) return Object.freeze({ enabled: false, track() {}, flush: async () => false, destroy() {} });
  const queue = [];
  const batchSize = Math.max(1, Math.min(25, Number(config.batchSize) || 10));
  const endpoint = `${config.endpoint.replace(/\/$/, "")}/api/events`;
  let timer;

  const flush = async ({ beacon = false } = {}) => {
    if (!queue.length) return true;
    const events = queue.splice(0, batchSize);
    const body = JSON.stringify({ siteId: String(config.siteId ?? "alltools").slice(0, 80), events });
    try {
      if (beacon && typeof transport.navigator?.sendBeacon === "function") {
        if (transport.navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }))) return true;
      }
      const response = await transport.fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true, credentials: "omit" });
      return Boolean(response?.ok);
    } catch { return false; }
  };
  const schedule = () => {
    if (timer || !queue.length) return;
    timer = transport.setTimeout?.(async () => { timer = undefined; await flush(); if (queue.length) schedule(); }, Math.max(1000, Number(config.flushInterval) || 10000));
  };
  const track = (eventName, payload) => {
    const event = sanitizeEvent(eventName, payload);
    if (!event) return;
    queue.push(event);
    if (queue.length >= batchSize) void flush(); else schedule();
  };
  const onPageHide = () => { void flush({ beacon: true }); };
  transport.addEventListener?.("pagehide", onPageHide);
  transport.document?.addEventListener?.("visibilitychange", () => { if (transport.document.visibilityState === "hidden") onPageHide(); });
  return Object.freeze({ enabled: true, track, flush, destroy() { if (timer) transport.clearTimeout?.(timer); transport.removeEventListener?.("pagehide", onPageHide); } });
}
