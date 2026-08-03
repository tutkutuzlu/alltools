export const EVENT_NAMES = new Set(["page_view", "tool_open", "tool_use", "search", "search_result_open", "copy", "paste", "clear", "download", "theme_change"]);
const FIELDS = new Set(["eventName", "toolId", "category", "placement", "theme", "queryLength", "resultCount", "source", "timestamp"]);
const STRINGS = new Set(["toolId", "category", "placement", "theme", "source"]);

export function validateEvent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || !EVENT_NAMES.has(value.eventName)) return null;
  if (Object.keys(value).some((key) => !FIELDS.has(key))) return null;
  const event = { eventName: value.eventName };
  for (const key of STRINGS) {
    if (value[key] === undefined) continue;
    if (typeof value[key] !== "string" || value[key].length > 80) return null;
    if (value[key]) event[key] = value[key];
  }
  for (const key of ["queryLength", "resultCount"]) {
    if (value[key] === undefined) continue;
    if (!Number.isInteger(value[key]) || value[key] < 0 || value[key] > 1000000) return null;
    event[key] = value[key];
  }
  if (typeof value.timestamp !== "string" || Number.isNaN(Date.parse(value.timestamp))) return null;
  event.timestamp = value.timestamp;
  return event;
}

export function validateBatch(body, allowedSiteIds = ["alltools"]) {
  if (!body || typeof body !== "object" || !allowedSiteIds.includes(body.siteId) || !Array.isArray(body.events) || body.events.length < 1 || body.events.length > 25) return null;
  const events = body.events.map(validateEvent);
  return events.every(Boolean) ? { siteId: body.siteId, events } : null;
}
