import { telemetry } from "../core/telemetry/telemetry.js";

function normalize(value) {
  return String(value ?? "").toLocaleLowerCase("en").normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

export function scoreSearchItem(item, query) {
  const title = normalize(item.t);
  const aliases = normalize((item.a ?? []).join(" "));
  const tags = normalize((item.g ?? []).join(" "));
  const description = normalize(item.d);
  if (title === query) return 120;
  if (title.startsWith(query)) return 95;
  if (title.split(/\s+/).some((word) => word.startsWith(query))) return 80;
  if (title.includes(query)) return 65;
  if (aliases.split(/\s+/).some((word) => word.startsWith(query))) return 50;
  if (aliases.includes(query)) return 42;
  if (tags.includes(query)) return 30;
  if (description.includes(query)) return 10;
  return 0;
}

export function initSearch() {
  const forms = document.querySelectorAll("[data-search-form]");
  if (!forms.length) return;
  let indexPromise;
  const loadIndex = () => indexPromise ??= fetch(document.body.dataset.searchIndex).then((response) => {
    if (!response.ok) throw new Error("Search index could not be loaded.");
    return response.json();
  });

  for (const form of forms) {
    const input = form.querySelector("[data-search-input]");
    const category = form.querySelector("[data-search-category]");
    const results = form.querySelector("[data-search-results]");
    let activeIndex = -1;

    const close = () => {
      activeIndex = -1;
      results.replaceChildren();
      results.hidden = true;
      input.setAttribute("aria-expanded", "false");
    };

    const render = async () => {
      const query = normalize(input.value.trim());
      if (!query) { close(); return; }
      try {
        const index = await loadIndex();
        const matches = index.x
          .filter((item) => !category?.value || item.c === category.value)
          .map((item) => ({ item, score: scoreSearchItem(item, query) }))
          .filter((entry) => entry.score > 0)
          .sort((a, b) => b.score - a.score || a.item.t.localeCompare(b.item.t))
          .slice(0, 8);
        results.replaceChildren();
        const list = document.createElement("ul");
        list.className = "search-results__list";
        if (!matches.length) {
          const empty = document.createElement("li");
          empty.className = "search-results__empty";
          empty.innerHTML = "<strong>No matching tools yet.</strong><span>Try a shorter search or browse the categories below.</span>";
          list.append(empty);
        }
        for (const { item } of matches) {
          const row = document.createElement("li");
          const link = document.createElement("a");
          link.href = item.u;
          link.addEventListener("click", () => telemetry.trackSearchResultOpen({ toolId: item.i, category: item.c, source: "site_search" }));
          link.textContent = item.t;
          const description = document.createElement("span");
          description.textContent = item.d;
          link.append(description);
          row.append(link);
          list.append(row);
        }
        results.append(list);
        results.hidden = false;
        input.setAttribute("aria-expanded", "true");
        activeIndex = -1;
        telemetry.trackSearch({ queryLength: query.length, resultCount: matches.length, category: category?.value ?? "", source: "site_search" });
      } catch {
        results.textContent = "Search is temporarily unavailable.";
        results.hidden = false;
      }
    };

    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", results.id || "search-results");
    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    category?.addEventListener("change", render);
    form.addEventListener("keydown", (event) => {
      const links = [...results.querySelectorAll("a")];
      if (event.key === "Escape") { close(); input.focus(); return; }
      if (!links.length || !["ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      activeIndex = event.key === "ArrowDown" ? (activeIndex + 1) % links.length : (activeIndex - 1 + links.length) % links.length;
      links[activeIndex].focus();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const links = [...results.querySelectorAll("a")];
      if (links.length) links[Math.max(activeIndex, 0)].click();
    });
  }
}
