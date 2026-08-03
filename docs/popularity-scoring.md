# Popularity scoring

V1 uses tool metadata as the deterministic fallback. A later offline export can provide a reviewed score without live page reordering or a build-time API dependency.

Suggested normalized score:

- 40% last 7-day `tool_use`
- 25% last 30-day `tool_use`
- 20% `tool_use / tool_open` conversion
- 15% meaningful actions such as copy or download

Apply minimum sample sizes, cap repeated bursts, discount impossible conversion rates, and penalize bot-like or anomalous traffic. Recompute on a scheduled export, review large changes, and keep the previous export available for rollback. The adapter accepts versioned `{ "version": 1, "tools": [{ "id": "word-counter", "score": 80 }] }` data at `analytics/export/popularity.json`.
