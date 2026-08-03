import "../../components/definitions.js";
import { components } from "../../components/registry.js";
import { theme } from "../../themes/engine.js";
import { initSearch } from "../../search/search.js";
import { telemetry } from "../telemetry/telemetry.js";
import { setTelemetryAdapter } from "../telemetry/telemetry.js";
import { createGa4Adapter, resolveAnalyticsConfig } from "../telemetry/ga4-adapter.js";
import { initializeConsentBoundary } from "../telemetry/ga4-loader.js";
import { analyticsConfig } from "../../config/runtime-config.js";

const resolvedAnalytics = resolveAnalyticsConfig(analyticsConfig, analyticsConfig.environment);
initializeConsentBoundary(resolvedAnalytics);
setTelemetryAdapter(createGa4Adapter(resolvedAnalytics));
telemetry.trackPageView({ source: "site" });

theme.init();

const themeMenu = document.querySelector("[data-theme-menu]");
if (themeMenu) {
  const options = [...themeMenu.querySelectorAll("[data-theme-option]")];
  const syncThemeMenu = () => {
    const preference = theme.getPreference();
    for (const option of options) option.setAttribute("aria-checked", String(option.dataset.themeOption === preference));
  };
  for (const option of options) option.addEventListener("click", () => {
    theme.set(option.dataset.themeOption);
    syncThemeMenu();
    themeMenu.removeAttribute("open");
  });
  syncThemeMenu();
}

initSearch();

const root = document.querySelector("[data-tool-root]");
if (root?.dataset.toolEntry) {
  import(root.dataset.toolEntry)
    .then((plugin) => plugin.mount(root, {
      components,
      theme,
      locale: document.documentElement.lang || "en",
      clipboard: {
        readText: () => navigator.clipboard.readText(),
        writeText: (value) => navigator.clipboard.writeText(value)
      },
      telemetry,
      analytics: resolvedAnalytics,
      toolId: root.dataset.toolId
    }))
    .catch((error) => {
      console.error(error);
      root.innerHTML = '<p class="notice notice--error">The tool could not be loaded. Please refresh and try again.</p>';
    });
}

if (root?.dataset.toolId) telemetry.trackToolOpen({ toolId: root.dataset.toolId, category: root.dataset.category });
