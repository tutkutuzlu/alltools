import { isValidMeasurementId } from "./ga4-adapter.js";

export function startGoogleTag(config, transport = globalThis) {
  if (!config?.enabled || config.provider !== "ga4" || !isValidMeasurementId(config.measurementId) || !transport.document || typeof transport.gtag === "function") return false;
  transport.dataLayer = transport.dataLayer || [];
  transport.gtag = function gtag() { transport.dataLayer.push(arguments); };
  transport.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  const cleanUrl = (value) => { try { const url = new URL(value); return `${url.origin}${url.pathname}`; } catch { return ""; } };
  const options = {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: cleanUrl(transport.location?.href),
    page_referrer: cleanUrl(transport.document.referrer)
  };
  if (config.debug === true) options.debug_mode = true;
  transport.gtag("js", new Date());
  transport.gtag("config", config.measurementId, options);
  const script = transport.document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.measurementId)}`;
  script.addEventListener("load", () => transport.dispatchEvent?.(new Event("alltools:ga4-ready")), { once: true });
  script.addEventListener("error", () => {}, { once: true });
  transport.document.head.append(script);
  return true;
}

export function initializeConsentBoundary(config, transport = globalThis) {
  if (!config?.enabled || !isValidMeasurementId(config.measurementId)) return Object.freeze({ grant() { return false; }, destroy() {} });
  const grant = () => startGoogleTag({ ...config, consentRequired: false }, transport);
  if (!config.consentRequired) grant();
  const listener = (event) => { if (event?.detail?.analyticsStorage === "granted") grant(); };
  transport.addEventListener?.("alltools:analytics-consent", listener);
  return Object.freeze({ grant, destroy() { transport.removeEventListener?.("alltools:analytics-consent", listener); } });
}
