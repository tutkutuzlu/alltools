# Google AdSense readiness

AllTools contains no AdSense tag or ad unit. This document records the remaining one-time steps without enabling advertising.

## Current implementation

- About, Contact, Privacy Policy and Terms of Service are generated from `src/content/pages`.
- Every generated page uses the same header and legal footer.
- `robots.txt` allows Google, Mediapartners-Google and Google-Display-Ads-Bot.
- The four policy pages are included in `sitemap.xml`.
- `src/config/ads.json` is the single source for the future Google publisher ID.
- When `publisherId` is empty, `ads.txt` contains comments only and does not claim a placeholder seller account.

## Before requesting review

1. Use a domain that can be added and verified as a site in AdSense. The current GitHub Pages project URL is a path under `tutkutuzlu.github.io`; AdSense site management and ads.txt discovery operate at the registrable/root-domain level. Prefer a custom domain, or ensure that the root `https://tutkutuzlu.github.io/ads.txt` and verification surface are under the same owner's control.
2. Add the site in AdSense and obtain its 16-digit publisher ID.
3. Set `publisherId` in `src/config/ads.json` using `pub-0000000000000000` format, then rebuild. The generated record will use `google.com, pub-..., DIRECT, f08c47fec0942fa0`.
4. Publish `ads.txt` at the root of the exact domain submitted to AdSense and verify it returns HTTP 200 as plain text.
5. Choose an AdSense ownership verification method. A publisher-specific meta tag can be added without enabling ad units; do not insert a fake publisher ID.
6. Configure a Google-certified CMP or Google's Privacy & messaging solution before sending advertising requests to users in the EEA, UK or Switzerland where required.
7. Recheck the Privacy Policy when advertising is enabled and confirm that the live consent behavior matches the disclosures.

## Official references

- [AdSense eligibility requirements](https://support.google.com/adsense/answer/9724)
- [Add a site and choose a verification method](https://support.google.com/adsense/answer/12169212)
- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938)
- [Ads.txt guide](https://support.google.com/adsense/answer/12171612)
- [Consent management requirements](https://support.google.com/adsense/answer/13554116)
