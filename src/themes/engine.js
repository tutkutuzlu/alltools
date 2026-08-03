const STORAGE_KEY = "all-tools-theme";
const supportedThemes = new Set(["light", "dark", "system"]);
const listeners = new Set();
const media = window.matchMedia("(prefers-color-scheme: dark)");

function resolveTheme(preference) {
  return preference === "system" ? (media.matches ? "dark" : "light") : preference;
}

function apply(preference) {
  const safePreference = supportedThemes.has(preference) ? preference : "system";
  document.documentElement.dataset.themePreference = safePreference;
  document.documentElement.dataset.theme = resolveTheme(safePreference);
  document.documentElement.style.colorScheme = resolveTheme(safePreference);
  for (const listener of listeners) listener(resolveTheme(safePreference));
}

export const theme = {
  init() {
    apply(localStorage.getItem(STORAGE_KEY) ?? "system");
    media.addEventListener("change", () => {
      if (this.getPreference() === "system") apply("system");
    });
  },
  set(preference) {
    if (!supportedThemes.has(preference)) throw new Error(`Unsupported theme: ${preference}`);
    localStorage.setItem(STORAGE_KEY, preference);
    apply(preference);
  },
  getPreference() {
    return document.documentElement.dataset.themePreference ?? "system";
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
