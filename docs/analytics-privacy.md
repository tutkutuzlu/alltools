# Analytics privacy

AllTools sends only allowlisted operational events to GA4. Allowed parameters are `tool_id`, `category`, `source`, `placement`, `theme`, `query_length`, and `result_count`.

The following are prohibited in telemetry: tool input or output, search strings, clipboard content, file content or names, URL query parameters, e-mail addresses, personal information, arbitrary payloads, user identifiers, and fingerprinting data. The central telemetry facade strips unknown fields before the GA4 adapter applies its own parameter allowlist.

Search sends only query length and result count. The page URL is not passed as a custom event parameter. Do not add user IDs, user properties, advertising IDs, URL passthrough, or cross-domain identity features without a separate privacy review.

Google Signals, ads personalization, `ad_storage`, `ad_user_data`, and `ad_personalization` are disabled by default. Analytics consent and any future AdSense consent are separate product decisions. When `consentRequired` is enabled, no Google network script loads before an explicit `analytics_storage` grant.

GA4 replaces the experimental Cloudflare aggregate service for V1. Its data lifecycle, retention period, deletion procedures, regional consent requirements, and account access must be configured in the Google Analytics property before launch.
