# Telemetry

`src/core/telemetry/telemetry.js` is a no-op by default. V1 installs the GA4 adapter only when analytics is enabled and a valid Measurement ID exists.

Available methods:

```text
trackToolOpen
trackPageView
trackToolUse
trackSearch
trackSearchResultOpen
trackCopy
trackPaste
trackClear
trackDownload
trackThemeChange
```

The GA4 adapter is installed with `setTelemetryAdapter({ track })`. The API only forwards approved fields: tool ID, category, source, theme, placement, query length and result count. User text, search text, file contents and arbitrary payload fields are discarded centrally.

Plugins receive the same API through `context.telemetry` and must never call a provider directly.
