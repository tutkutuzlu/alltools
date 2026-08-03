import "../../components/definitions.js";
import { components } from "../../components/registry.js";
import { theme } from "../../themes/engine.js";
import { initSearch } from "../../search/search.js";

theme.init();

const themeSelect = document.querySelector("[data-theme-select]");
if (themeSelect) {
  themeSelect.value = theme.getPreference();
  themeSelect.addEventListener("change", () => theme.set(themeSelect.value));
}

initSearch();

const root = document.querySelector("[data-tool-root]");
if (root?.dataset.toolEntry) {
  import(root.dataset.toolEntry)
    .then((plugin) => plugin.mount(root, {
      components,
      theme,
      locale: document.documentElement.lang || "en"
    }))
    .catch((error) => {
      console.error(error);
      root.innerHTML = '<p class="notice notice--error">The tool could not be loaded. Please refresh and try again.</p>';
    });
}
