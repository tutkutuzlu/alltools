import { validateBatch } from "./validation.js";
import { buildSummary, buildToolStats } from "./stats.js";

const MAX_BODY_BYTES = 16384;
const json = (data, status, origin) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": origin, "vary": "Origin", "cache-control": status === 200 ? "public, max-age=300" : "no-store" } });
const origins = (env) => String(env.ALLOWED_ORIGINS ?? "").split(",").map((v) => v.trim()).filter(Boolean);
const sites = (env) => String(env.ALLOWED_SITE_IDS ?? "alltools").split(",").map((v) => v.trim()).filter(Boolean);

export function aggregateStatements(db, events, date = new Date().toISOString().slice(0, 10)) {
  const sql = "INSERT INTO analytics_daily (date, tool_id, category, event_name, count) VALUES (?1, ?2, ?3, ?4, 1) ON CONFLICT(date, tool_id, category, event_name) DO UPDATE SET count = count + 1";
  return events.map((event) => db.prepare(sql).bind(date, event.toolId ?? "", event.category ?? "", event.eventName === "search" && event.resultCount === 0 ? "search_no_result" : event.eventName));
}

async function rows(result) { return result?.results ?? []; }
export default { async fetch(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin") ?? "";
  const allowed = origins(env);
  if (request.method === "OPTIONS") return allowed.includes(origin) ? new Response(null, { status: 204, headers: { "access-control-allow-origin": origin, "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "content-type", "access-control-max-age": "86400" } }) : new Response(null, { status: 403 });
  if (!allowed.includes(origin)) return json({ error: "Origin not allowed" }, 403, "null");
  if (request.method === "POST" && url.pathname === "/api/events") {
    if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413, origin);
    if (env.ANALYTICS_RATE_LIMITER && !(await env.ANALYTICS_RATE_LIMITER.limit({ key: origin })).success) return json({ error: "Too many requests" }, 429, origin);
    let text; try { text = await request.text(); } catch { return json({ error: "Invalid body" }, 400, origin); }
    if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413, origin);
    let body; try { body = JSON.parse(text); } catch { return json({ error: "Invalid JSON" }, 400, origin); }
    const batch = validateBatch(body, sites(env));
    if (!batch) return json({ error: "Invalid event batch" }, 400, origin);
    await env.DB.batch(aggregateStatements(env.DB, batch.events));
    return json({ accepted: batch.events.length }, 202, origin);
  }
  if (request.method === "GET" && url.pathname === "/api/stats/summary") {
    const result = await env.DB.prepare("SELECT date, tool_id, category, event_name, count FROM analytics_daily").all();
    return json(buildSummary(await rows(result)), 200, origin);
  }
  const match = request.method === "GET" && url.pathname.match(/^\/api\/stats\/tools\/([a-z0-9-]{1,80})$/);
  if (match) {
    const result = await env.DB.prepare("SELECT date, tool_id, category, event_name, count FROM analytics_daily WHERE tool_id = ?1 AND date >= date('now', '-59 days') ORDER BY date").bind(match[1]).all();
    return json(buildToolStats(await rows(result), match[1]), 200, origin);
  }
  return json({ error: "Not found" }, 404, origin);
} };
