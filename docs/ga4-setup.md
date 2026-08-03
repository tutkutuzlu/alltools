# Google Analytics 4 setup

GA4 is the V1 production analytics provider. The site remains static and analytics remains disabled until a valid Measurement ID is configured.

## One-time setup

1. In Google Analytics, create an account and a GA4 property for AllTools.
2. Create a Web data stream for `https://tutkutuzlu.github.io/alltools/`.
3. Copy its `G-...` Measurement ID.
4. In `src/config/analytics.json`, set the production environment's `enabled` to `true` and `measurementId` to that ID. Keep development disabled unless DebugView testing is intentional.
5. In the data stream settings, do not enable Google Signals or ads personalization. Review enhanced measurement separately; AllTools sends its own single `page_view`.
6. Run `npm run check`, inspect the generated HTML, then use Tag Assistant and GA4 Realtime/DebugView to verify events before production deployment.
7. Create the custom definitions described in `ga4-custom-dimensions.md`.

`debug: true` adds `debug_mode` to configuration and custom events. Use it only in development. `anonymizedMode` records the product decision that no fingerprinting or identity enrichment may be added; GA4 web collection anonymizes IP data before storage, and AllTools does not send an IP parameter.

## Page views

AllTools uses manual page views. Every Google tag configuration includes `send_page_view: false`; the central telemetry bootstrap emits exactly one `page_view` per static document load. Do not enable another custom page-view tag in Google Tag Manager.

## Consent boundary

Ads consent is always denied: `ad_storage`, `ad_user_data`, and `ad_personalization`. Google Signals and ads-personalization signals are disabled.

When `consentRequired` is `true`, the external Google script is not loaded until an approved consent interface dispatches:

```js
window.dispatchEvent(new CustomEvent("alltools:analytics-consent", {
  detail: { analyticsStorage: "granted" }
}));
```

No cookie banner is added automatically. Before enabling analytics, select a legally appropriate CMP, a custom banner, or another consent approach for the regions served. Record and restore consent before firing the grant event. Advertising consent must remain a separate choice from analytics consent.
