export async function getToolStats(config, toolId, fetchImpl = globalThis.fetch) {
  if (!config?.enabled || !config?.publicCountersEnabled || !config.endpoint) return null;
  try {
    const response = await fetchImpl(`${config.endpoint.replace(/\/$/, "")}/api/stats/tools/${encodeURIComponent(toolId)}`, { credentials: "omit" });
    return response.ok ? response.json() : null;
  } catch { return null; }
}

export function shouldShowUsageCount(count, minimum) {
  return Number.isFinite(count) && count >= Math.max(0, Number(minimum) || 0);
}
