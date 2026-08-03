import { escapeHtml, markdownToHtml } from "./content.mjs";

function joinPath(basePath, pathname = "") {
  const base = basePath === "/" ? "" : basePath.replace(/\/$/, "");
  return `${base}/${pathname.replace(/^\//, "")}`.replace(/\/$/, "") || "/";
}

function absolute(site, pathname = "") {
  return `${site.siteUrl.replace(/\/$/, "")}/${pathname.replace(/^\//, "")}`.replace(/\/$/, "");
}

function structuredData(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function searchForm() {
  return `<form class="search" role="search" data-search-form>
    <label class="visually-hidden" for="site-search">Search tools</label>
    <input class="search-input" id="site-search" type="search" autocomplete="off" placeholder="Search tools…" data-search-input>
    <div class="search-results" role="status" data-search-results hidden></div>
  </form>`;
}

function layout({ site, title, description, canonicalPath, body, structured = [] }) {
  const base = site.basePath;
  const canonical = absolute(site, canonicalPath);
  return `<!doctype html>
<html lang="${escapeHtml(site.language)}" data-theme="light" data-theme-preference="system">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}/">
  <link rel="stylesheet" href="${joinPath(base, "assets/css/tokens.css")}">
  <link rel="stylesheet" href="${joinPath(base, "assets/css/site.css")}">
  <script>try{const p=localStorage.getItem("all-tools-theme")||"system";const r=p==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):p;document.documentElement.dataset.themePreference=p;document.documentElement.dataset.theme=r;document.documentElement.style.colorScheme=r}catch{}</script>
  ${structured.map(structuredData).join("\n  ")}
</head>
<body data-search-index="${joinPath(base, "search/index.json")}">
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="${joinPath(base)}/">${escapeHtml(site.name)}</a>
      <div class="header-actions">
        <label class="visually-hidden" for="theme-select">Theme</label>
        <select class="theme-select" id="theme-select" data-theme-select>
          <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
        </select>
      </div>
    </div>
  </header>
  <main>${body}</main>
  <footer class="site-footer"><div class="container">© ${new Date().getUTCFullYear()} ${escapeHtml(site.name)}. Tools run in your browser whenever possible.</div></footer>
  <script type="module" src="${joinPath(base, "assets/js/core/runtime/bootstrap.js")}"></script>
</body>
</html>`;
}

function toolCard(site, tool) {
  return `<a class="card" href="${joinPath(site.basePath, `tools/${tool.slug}`)}/"><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.shortDescription)}</p></a>`;
}

export function renderHome(project) {
  const { site } = project;
  const tools = project.tools.filter((tool) => tool.status === "published").sort((a, b) => (b.discovery?.priority ?? 0) - (a.discovery?.priority ?? 0));
  const categories = project.categories.filter((category) => category.status === "published").sort((a, b) => a.order - b.order);
  const body = `<section class="hero"><div class="container"><p class="eyebrow">Free browser tools</p><h1>Useful tools, without the clutter.</h1><p class="lead">${escapeHtml(site.tagline)}</p>${searchForm()}</div></section>
  <section class="section"><div class="container"><div class="section-heading"><h2>Featured tools</h2></div><div class="card-grid">${tools.map((tool) => toolCard(site, tool)).join("")}</div></div></section>
  <section class="section"><div class="container"><div class="section-heading"><h2>Browse categories</h2></div><div class="card-grid">${categories.map((category) => `<a class="card" href="${joinPath(site.basePath, `categories/${category.slug}`)}/"><h3>${escapeHtml(category.title)}</h3><p>${escapeHtml(category.shortDescription)}</p></a>`).join("")}</div></div></section>`;
  return layout({ site, title: `${site.name} – Free Online Tools`, description: site.description, canonicalPath: "", body, structured: [{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: `${site.siteUrl}/` }] });
}

export function renderCategory(project, category) {
  const { site } = project;
  const tools = project.tools.filter((tool) => tool.status === "published" && tool.category === category.id);
  const canonicalPath = `categories/${category.slug}`;
  const body = `<div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="${joinPath(site.basePath)}/">Home</a></li><li aria-current="page">${escapeHtml(category.title)}</li></ol></nav></div>
  <section class="hero"><div class="container"><p class="eyebrow">Category</p><h1>${escapeHtml(category.title)}</h1><p class="lead">${escapeHtml(category.shortDescription)}</p>${searchForm()}</div></section>
  <section class="section"><div class="container"><div class="card-grid">${tools.map((tool) => toolCard(site, tool)).join("")}</div><div class="content">${markdownToHtml(category.markdown)}</div></div></section>`;
  return layout({ site, title: category.seoTitle, description: category.seoDescription, canonicalPath, body, structured: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: category.title, description: category.shortDescription, url: `${absolute(site, canonicalPath)}/` }] });
}

export function renderTool(project, tool) {
  const { site } = project;
  const category = project.categories.find((item) => item.id === tool.category);
  const canonicalPath = `tools/${tool.slug}`;
  const entryUrl = joinPath(site.basePath, `assets/js/plugins/tools/${tool.id}/${tool.entry.replace(/^\.\//, "")}`);
  const body = `<div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="${joinPath(site.basePath)}/">Home</a></li><li><a href="${joinPath(site.basePath, `categories/${category.slug}`)}/">${escapeHtml(category.title)}</a></li><li aria-current="page">${escapeHtml(tool.title)}</li></ol></nav></div>
  <section class="hero"><div class="container"><p class="eyebrow">${escapeHtml(category.title)}</p><h1>${escapeHtml(tool.title)}</h1><p class="lead">${escapeHtml(tool.shortDescription)}</p></div></section>
  <div class="container tool-layout"><section class="tool-panel" aria-label="${escapeHtml(tool.title)}" data-tool-root data-tool-entry="${entryUrl}"><noscript>This tool requires JavaScript to run.</noscript></section><article class="content">${markdownToHtml(tool.markdown)}</article></div>`;
  return layout({ site, title: tool.seoTitle, description: tool.seoDescription, canonicalPath, body, structured: [
    { "@context": "https://schema.org", "@type": "WebApplication", name: tool.title, description: tool.shortDescription, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", url: `${absolute(site, canonicalPath)}/`, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.siteUrl}/` },
      { "@type": "ListItem", position: 2, name: category.title, item: `${absolute(site, `categories/${category.slug}`)}/` },
      { "@type": "ListItem", position: 3, name: tool.title, item: `${absolute(site, canonicalPath)}/` }
    ] }
  ] });
}

export function renderNotFound(site) {
  return layout({ site, title: `Page not found – ${site.name}`, description: "The requested page could not be found.", canonicalPath: "404", body: `<section class="hero"><div class="container"><p class="eyebrow">404</p><h1>Page not found</h1><p class="lead">The page may have moved or no longer exists.</p><p><a class="button button--secondary" href="${joinPath(site.basePath)}/">Return home</a></p></div></section>` });
}

export { absolute, joinPath };
