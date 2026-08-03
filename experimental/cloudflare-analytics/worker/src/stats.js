const value = (row) => Number(row.count) || 0;
const isoDate = (date) => date.toISOString().slice(0, 10);
const after = (today, days) => { const date = new Date(`${today}T00:00:00Z`); date.setUTCDate(date.getUTCDate() - days + 1); return isoDate(date); };

export function buildSummary(rows, today = isoDate(new Date())) {
  const sum = (predicate) => rows.filter(predicate).reduce((total, row) => total + value(row), 0);
  const totals = { pageView: sum((r) => r.event_name === "page_view"), toolOpen: sum((r) => r.event_name === "tool_open"), toolUse: sum((r) => r.event_name === "tool_use") };
  const period = (days) => ({ pageView: sum((r) => r.date >= after(today, days) && r.event_name === "page_view"), toolOpen: sum((r) => r.date >= after(today, days) && r.event_name === "tool_open"), toolUse: sum((r) => r.date >= after(today, days) && r.event_name === "tool_use") });
  const byTool = new Map();
  for (const row of rows.filter((r) => r.tool_id && r.event_name === "tool_use" && r.date >= after(today, 30))) byTool.set(row.tool_id, (byTool.get(row.tool_id) ?? 0) + value(row));
  const topTools = [...byTool].map(([toolId, toolUse]) => ({ toolId, toolUse })).sort((a, b) => b.toolUse - a.toolUse).slice(0, 10);
  const recent = new Map(), prior = new Map();
  for (const row of rows.filter((r) => r.tool_id && r.event_name === "tool_use")) {
    if (row.date >= after(today, 7)) recent.set(row.tool_id, (recent.get(row.tool_id) ?? 0) + value(row));
    else if (row.date >= after(today, 14)) prior.set(row.tool_id, (prior.get(row.tool_id) ?? 0) + value(row));
  }
  const risingTools = [...recent].map(([toolId, current]) => ({ toolId, score: current - (prior.get(toolId) ?? 0), toolUse: current })).sort((a, b) => b.score - a.score).slice(0, 10);
  const events = Object.fromEntries([...new Set(rows.map((r) => r.event_name))].map((name) => [name, sum((r) => r.event_name === name)]));
  events.searchNoResult = sum((r) => r.event_name === "search_no_result");
  return { totals, periods: { today: period(1), days7: period(7), days30: period(30) }, topTools, risingTools, events };
}

export function buildToolStats(rows, toolId) {
  const totals = Object.fromEntries(["tool_open", "tool_use", "copy", "paste", "clear", "download"].map((event) => [event, rows.filter((r) => r.event_name === event).reduce((n, r) => n + value(r), 0)]));
  return { toolId, totals: { toolOpen: totals.tool_open, toolUse: totals.tool_use, copy: totals.copy, paste: totals.paste, clear: totals.clear, download: totals.download }, usageRate: totals.tool_open ? totals.tool_use / totals.tool_open : 0, daily: rows };
}
