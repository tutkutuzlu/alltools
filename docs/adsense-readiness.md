# Google AdSense readiness

AllTools includes the production AdSense verification script and a configured publisher record. It does not currently render first-party ad placements. This document records the implemented state and the remaining operational checks.

## Current implementation

- About, Contact, Privacy Policy and Terms of Service are generated from `src/content/pages`.
- Every generated page uses the same header and legal footer.
- `robots.txt` allows Google, Mediapartners-Google and Google-Display-Ads-Bot.
- The four policy pages are included in `sitemap.xml`.
- `src/config/ads.json` is the source for publisher ID `pub-8757964996370629`; the production build renders the AdSense script once per page.
- Development builds do not load the production AdSense script.
- The generated project `ads.txt` record is `google.com, pub-8757964996370629, DIRECT, f08c47fec0942fa0`. Because AllTools is hosted below `/alltools/`, the root-domain `https://tutkutuzlu.github.io/ads.txt` is managed by the separate portal repository and must remain consistent.
- No ad-slot component is currently rendered, so pages do not reserve empty advertising space.

## Operational review checklist

1. Verify that the site registered in AdSense matches the GitHub Pages host and that ownership verification remains successful.
2. Confirm `https://tutkutuzlu.github.io/ads.txt` returns HTTP 200 as plain text and contains the configured publisher record exactly once.
3. Confirm production pages load the publisher script once and development pages do not load it.
4. Configure a Google-certified CMP or Google's Privacy & messaging solution before serving ads where consent is required, including applicable EEA, UK or Swiss traffic.
5. Recheck the Privacy Policy and consent behavior before enabling ad placements or personalized advertising.
6. Re-run content, navigation, accessibility and policy-page checks before a new AdSense review request.

## Official references

- [AdSense eligibility requirements](https://support.google.com/adsense/answer/9724)
- [Add a site and choose a verification method](https://support.google.com/adsense/answer/12169212)
- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938)
- [Ads.txt guide](https://support.google.com/adsense/answer/12171612)
- [Consent management requirements](https://support.google.com/adsense/answer/13554116)
