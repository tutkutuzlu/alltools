function format(value) { return new Intl.NumberFormat("en").format(Number(value) || 0); }
function rate(uses, opens) { return opens > 0 ? `${((uses / opens) * 100).toFixed(1)}%` : "0%"; }

export async function loadDashboard(root, fetchImpl = globalThis.fetch) {
  const status = root.querySelector("[data-analytics-status]");
  const content = root.querySelector("[data-analytics-content]");
  if (root.dataset.enabled !== "true" || !root.dataset.endpoint) return false;
  status.textContent = "Loading aggregate usage data…";
  try {
    const response = await fetchImpl(`${root.dataset.endpoint.replace(/\/$/, "")}/api/stats/summary`, { credentials: "omit" });
    if (!response.ok) throw new Error("Unavailable");
    const data = await response.json();
    root.querySelector("[data-analytics-range]").innerHTML = `<span>Today <strong>${format(data.periods?.today?.toolUse)}</strong></span><span>7 days <strong>${format(data.periods?.days7?.toolUse)}</strong></span><span>30 days <strong>${format(data.periods?.days30?.toolUse)}</strong></span>`;
    root.querySelector("[data-analytics-kpis]").innerHTML = `<article><strong>${format(data.totals?.toolOpen)}</strong><span>Tool opens</span></article><article><strong>${format(data.totals?.toolUse)}</strong><span>Real uses</span></article><article><strong>${rate(data.totals?.toolUse, data.totals?.toolOpen)}</strong><span>Usage conversion</span></article><article><strong>${format(data.events?.searchNoResult)}</strong><span>No-result searches</span></article>`;
    const rows = (items) => items?.length ? `<ol>${items.map((item) => `<li><span>${item.toolId}</span><strong>${format(item.toolUse ?? item.score)}</strong></li>`).join("")}</ol>` : "<p>No aggregate data yet.</p>";
    root.querySelector("[data-top-tools]").innerHTML = rows(data.topTools);
    root.querySelector("[data-rising-tools]").innerHTML = rows(data.risingTools);
    root.querySelector("[data-event-breakdown]").innerHTML = rows(Object.entries(data.events ?? {}).map(([toolId, toolUse]) => ({ toolId, toolUse })));
    status.hidden = true;
    content.hidden = false;
    return true;
  } catch {
    status.textContent = "Analytics is temporarily unavailable. The rest of AllTools continues to work normally.";
    return false;
  }
}

const root = document.querySelector("[data-analytics-dashboard]");
if (root) void loadDashboard(root);
