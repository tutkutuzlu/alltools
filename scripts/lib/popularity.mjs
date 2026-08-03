export function applyPopularityExport(tools, data) {
  if (!data || data.version !== 1 || !Array.isArray(data.tools)) return tools;
  const scores = new Map(data.tools.filter((item) => typeof item.id === "string" && Number.isFinite(item.score)).map((item) => [item.id, item.score]));
  return tools.map((tool) => scores.has(tool.id) ? { ...tool, popularity: scores.get(tool.id), popularitySource: "analytics-export" } : tool);
}
