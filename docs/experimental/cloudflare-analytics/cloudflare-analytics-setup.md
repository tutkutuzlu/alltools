# Cloudflare analytics setup

Analytics is optional and disabled until these one-time steps are complete.

1. Create or sign in to a Cloudflare account.
2. Install Wrangler 4.36 or newer, then run `npx wrangler login` inside `analytics/worker`.
3. Create D1: `npx wrangler d1 create alltools-analytics`.
4. Copy `analytics/worker/wrangler.toml.example` to `wrangler.toml`, insert the returned database ID, and verify the `DB` binding and allowed origins.
5. Apply migrations: `npx wrangler d1 migrations apply alltools-analytics --remote`.
6. Deploy: `npx wrangler deploy`.
7. Put the Worker origin (without `/api/events`) in `src/config/analytics.json`, set the production override and top-level `enabled` to `true`, then run `npm run check`.
8. If deployment is later automated in GitHub Actions, add a scoped `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets. The current static-site workflow does not require them.

Optionally configure a Rate Limiting binding after assigning an account-unique namespace ID. Local Wrangler limits are not authoritative; verify the deployed rule. Cloudflare Web Analytics is independent: add its token under `webAnalytics` and enable it. No token means no beacon script is rendered.

Use Cloudflare Access in front of `/api/stats/*` when the dashboard must become private. Keep `/api/events` CORS-limited to the production site and approved local origins.
