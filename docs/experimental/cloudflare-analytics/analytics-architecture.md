# Analytics architecture

AllTools remains a static GitHub Pages site. The browser telemetry facade sanitizes every event, and the optional first-party adapter batches those events to an independent Cloudflare Worker. The Worker validates the same contract and increments daily aggregates in D1; it never persists raw requests.

Analytics is off by default. An absent endpoint, disabled flag, request failure, or unavailable API results in a no-op. Tool execution, search, build, and rendering never depend on analytics. `sendBeacon` is preferred during page exit with a non-blocking `fetch` fallback.

The hidden `/analytics/` page reads public aggregate endpoints. It is deliberately absent from navigation and sitemap. Public aggregate data can still expose business trends; protect the Worker stats routes with Cloudflare Access before the data becomes commercially sensitive.

Build-time popularity is separate from live telemetry. An optional, reviewed `analytics/export/popularity.json` file can override metadata scores without making a live build request.
