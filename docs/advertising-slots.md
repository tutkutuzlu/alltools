# Advertising Slots

Advertising is disabled in V2. No ad network or third-party script is included.

Configuration lives in `src/config/ads.json`; the runtime boundary is `src/core/ads/ads.js`; and the Component Library exposes `ad.slot`.

Supported placement keys:

```text
top
inline
sidebar
result
```

When advertising or the requested placement is disabled, `ad.slot` returns `element: null`. Callers must only append a non-null element. This prevents empty boxes, reserved whitespace and layout shift while the platform remains ad-free.

A future provider must be connected through the ad adapter/configuration boundary instead of embedding provider code in tool plugins.
