function normalize(value) {
  return value.toLocaleLowerCase("en").normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function score(item, query) {
  const title = normalize(item.title);
  const aliases = normalize(item.aliases.join(" "));
  const tags = normalize(item.tags.join(" "));
  const description = normalize(item.description);
  if (title === query) return 100;
  if (title.startsWith(query)) return 80;
  if (title.includes(query)) return 60;
  if (aliases.includes(query)) return 40;
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
    const results = form.querySelector("[data-search-results]");
    const render = async () => {
      const query = normalize(input.value.trim());
      if (!query) {
        results.replaceChildren();
        results.hidden = true;
        return;
      }
      try {
        const index = await loadIndex();
        const matches = index.items
          .map((item) => ({ item, score: score(item, query) }))
          .filter((entry) => entry.score > 0)
          .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
          .slice(0, 8);
        results.replaceChildren();
        const list = document.createElement("ul");
        list.className = "search-results__list";
        if (!matches.length) {
          const empty = document.createElement("li");
          empty.className = "search-results__empty";
          empty.textContent = "No matching tools found.";
          list.append(empty);
        }
        for (const { item } of matches) {
          const row = document.createElement("li");
          const link = document.createElement("a");
          link.href = item.url;
          link.textContent = item.title;
          const description = document.createElement("span");
          description.textContent = item.description;
          link.append(description);
          row.append(link);
          list.append(row);
        }
        results.append(list);
        results.hidden = false;
      } catch {
        results.textContent = "Search is temporarily unavailable.";
        results.hidden = false;
      }
    };
    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    form.addEventListener("submit", (event) => event.preventDefault());
  }
}
