import { escapeHtml, markdownToHtml } from "./content.mjs";
import { iconMarkup } from "../../src/components/icons.js";

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

export function renderGoogleTag(analytics = {}) {
  if (!analytics.enabled || analytics.provider !== "ga4" || !/^G-[A-Z0-9]{6,20}$/i.test(analytics.measurementId ?? "") || analytics.consentRequired) return "";
  const id = analytics.measurementId.toUpperCase();
  const debug = analytics.debug ? ",debug_mode:true" : "";
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;const cleanAnalyticsUrl=value=>{try{const url=new URL(value);return url.origin+url.pathname}catch{return""}};gtag("consent","default",{analytics_storage:"granted",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});gtag("js",new Date());gtag("config","${id}",{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:cleanAnalyticsUrl(location.href),page_referrer:cleanAnalyticsUrl(document.referrer)${debug}});</script>`;
}

export function renderAdSenseTag(ads = {}) {
  if (!ads.enabled || ads.provider !== "google" || ads.environment !== "production" || !/^pub-\d{16}$/.test(ads.publisherId ?? "")) return "";
  const client = `ca-${ads.publisherId}`;
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>`;
}

function searchForm(categories = []) {
  return `<form class="search" role="search" data-search-form>
    <label class="visually-hidden" for="site-search">Search tools</label>
    <span class="search__icon">${iconMarkup("search")}</span>
    <input class="search-input" id="site-search" type="search" role="combobox" aria-autocomplete="list" autocomplete="off" placeholder="What do you need to do?" data-search-input>
    <label class="visually-hidden" for="search-category">Filter by category</label>
    <select class="search-category" id="search-category" data-search-category><option value="">All categories</option>${categories.map((category) => `<option value="${escapeHtml(category.id)}">${escapeHtml(category.title)}</option>`).join("")}</select>
    <div class="search-results" id="search-results" role="status" data-search-results hidden></div>
  </form>`;
}

function footer(site) {
  const links = [["About", "about"], ["Contact", "contact"], ["Privacy Policy", "privacy"], ["Terms of Service", "terms"]];
  return `<footer class="site-footer"><div class="container footer-inner"><div class="footer-brand"><a class="brand brand--footer" href="${joinPath(site.basePath)}/"><span class="brand__mark">${iconMarkup("logo")}</span><span>${escapeHtml(site.name)}</span></a><p>© ${new Date().getUTCFullYear()} ${escapeHtml(site.name)}. Fast, free tools that respect your time.</p></div><nav class="footer-nav" aria-label="Legal and company">${links.map(([label, slug]) => `<a href="${joinPath(site.basePath, slug)}/">${label}</a>`).join("")}</nav></div></footer>`;
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
  ${renderGoogleTag(site.analytics)}
  ${renderAdSenseTag(site.ads)}
</head>
<body data-search-index="${joinPath(base, "search/index.json")}">
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="${joinPath(base)}/"><span class="brand__mark">${iconMarkup("logo")}</span><span>${escapeHtml(site.name)}</span></a>
      <div class="header-actions">
        <nav class="site-nav" aria-label="Primary"><a href="${joinPath(base)}/#tools">Tools</a><a href="${joinPath(base)}/#categories">Categories</a></nav>
        <details class="theme-menu" data-theme-menu>
          <summary class="icon-button" aria-label="Choose theme" title="Choose theme">${iconMarkup("sun")}<span class="theme-menu__chevron">${iconMarkup("chevron")}</span></summary>
          <div class="theme-menu__panel" role="radiogroup" aria-label="Theme">
            <button type="button" role="radio" data-theme-option="system">${iconMarkup("system")}<span>System</span></button>
            <button type="button" role="radio" data-theme-option="light">${iconMarkup("sun")}<span>Light</span></button>
            <button type="button" role="radio" data-theme-option="dark">${iconMarkup("moon")}<span>Dark</span></button>
          </div>
        </details>
      </div>
    </div>
  </header>
  <main>${body}</main>
  ${footer(site)}
  <script type="module" src="${joinPath(base, "assets/js/core/runtime/bootstrap.js")}"></script>
</body>
</html>`;
}

export function renderToolCard(site, tool, category) {
  const badges = [tool.featured ? '<span class="card-badge">Featured</span>' : "", isNewTool(tool) ? '<span class="card-badge card-badge--new">New</span>' : ""].join("");
  return `<a class="tool-card" data-accent="${escapeHtml(category?.accent ?? "default")}" href="${joinPath(site.basePath, `tools/${tool.slug}`)}/">
    <span class="card-icon">${iconMarkup(tool.icon ?? category.icon)}</span>
    <span class="tool-card__body"><span class="tool-card__meta"><span class="category-label">${escapeHtml(category.title)}</span>${badges}${tool.estimatedTime ? `<span class="estimated-time">${escapeHtml(tool.estimatedTime)}</span>` : ""}</span><strong>${escapeHtml(tool.title)}</strong><span class="tool-card__description">${escapeHtml(tool.shortDescription)}</span></span>
    <span class="card-arrow">${iconMarkup("arrow")}</span>
  </a>`;
}

export function isNewTool(tool, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tool.publishedAt ?? "")) return false;
  const published = new Date(`${tool.publishedAt}T00:00:00Z`);
  if (Number.isNaN(published.getTime()) || published.toISOString().slice(0, 10) !== tool.publishedAt) return false;
  const age = today.getTime() - published.getTime();
  return age >= 0 && age < 10 * 24 * 60 * 60 * 1000;
}

export function selectHomeSections(tools, today = new Date()) {
  const published = tools.filter((tool) => tool.status === "published");
  const used = new Set();
  const take = (candidates, limit = 6) => candidates.filter((tool) => !used.has(tool.id)).slice(0, limit).map((tool) => { used.add(tool.id); return tool; });
  const featured = take(published.filter((tool) => tool.featured).sort((a, b) => (b.discovery?.priority ?? 0) - (a.discovery?.priority ?? 0)));
  const newest = take(published.filter((tool) => isNewTool(tool, today)).sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)) || (b.discovery?.priority ?? 0) - (a.discovery?.priority ?? 0)), 3);
  const popular = take(published.filter((tool) => (tool.popularity ?? 0) > 0).sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0) || (b.discovery?.priority ?? 0) - (a.discovery?.priority ?? 0)), 3);
  if (!featured.length && published.length) featured.push(...take([...published].sort((a, b) => (b.discovery?.priority ?? 0) - (a.discovery?.priority ?? 0))));
  return [
    { id: "featured", kicker: "Get things done", singular: "Featured tool", plural: "Featured tools", description: "Focused utilities, ready when you are.", tools: featured },
    { id: "new", kicker: "Just added", singular: "New tool", plural: "New tools", description: "The latest additions to AllTools.", tools: newest },
    { id: "popular", kicker: "Most used", singular: "Popular tool", plural: "Popular tools", description: "Frequently chosen utilities.", tools: popular }
  ].filter((section) => section.tools.length);
}

function renderToolSection(site, section, categories) {
  const heading = section.tools.length === 1 ? section.singular : section.plural;
  return `<section class="section section--tools" id="${section.id === "featured" ? "tools" : section.id}"><div class="container"><div class="section-heading"><div><p class="section-kicker">${section.kicker}</p><h2>${heading}</h2></div><p>${section.description}</p></div><div class="tool-grid">${section.tools.map((tool) => renderToolCard(site, tool, categories.find((category) => category.id === tool.category))).join("")}</div></div></section>`;
}

function renderCompactToolSection(site, section, categories) {
  const heading = section.tools.length === 1 ? section.singular : section.plural;
  return `<section class="discovery-group" id="${section.id}"><div class="discovery-group__heading"><div><p class="section-kicker">${section.kicker}</p><h2>${heading}</h2></div><p>${section.description}</p></div><div class="tool-grid tool-grid--compact">${section.tools.map((tool) => renderToolCard(site, tool, categories.find((category) => category.id === tool.category))).join("")}</div></section>`;
}

function renderAllToolsDirectory(site, categories, tools) {
  const groups = categories.map((category) => {
    const categoryTools = tools
      .filter((tool) => tool.category === category.id)
      .sort((a, b) => (b.discovery?.priority ?? 0) - (a.discovery?.priority ?? 0) || a.title.localeCompare(b.title));
    if (!categoryTools.length) return "";
    return `<section class="tool-directory__group" data-accent="${escapeHtml(category.accent ?? "default")}" aria-labelledby="directory-${escapeHtml(category.id)}">
      <h3 id="directory-${escapeHtml(category.id)}"><a href="${joinPath(site.basePath, `categories/${category.slug}`)}/">${escapeHtml(category.title)}</a></h3>
      <ul>${categoryTools.map((tool) => `<li><a href="${joinPath(site.basePath, `tools/${tool.slug}`)}/">${escapeHtml(tool.title)}</a></li>`).join("")}</ul>
    </section>`;
  }).join("");
  return `<section class="section section--tool-directory" id="all-tools"><div class="container"><div class="section-heading"><div><p class="section-kicker">Complete directory</p><h2>Browse all tools</h2></div><p>Every AllTools utility, organized by category.</p></div><div class="tool-directory">${groups}</div></div></section>`;
}

const normalizedTerms = (values = []) => new Set(values.flatMap((value) => String(value).toLowerCase().split(/[^a-z0-9]+/)).filter((value) => value.length > 2));

export function selectRelatedTools(tool, tools, limit = 6) {
  const sourceTerms = normalizedTerms([...(tool.tags ?? []), ...(tool.aliases ?? [])]);
  const candidates = tools.filter((candidate) => candidate.status === "published" && candidate.id !== tool.id).map((candidate) => {
    const candidateTerms = normalizedTerms([...(candidate.tags ?? []), ...(candidate.aliases ?? [])]);
    const sharedTerms = [...sourceTerms].filter((term) => candidateTerms.has(term)).length;
    const sameCategory = Number(candidate.category === tool.category);
    const sameFamily = Number(candidate.family === tool.family);
    const sameIntent = Number(candidate.type === tool.type) + Number(Boolean(tool.variant) && candidate.variant === tool.variant);
    return { candidate, rank: [sameCategory, sameFamily, sharedTerms, sameIntent, candidate.discovery?.priority ?? 0] };
  }).filter(({ rank }) => rank.slice(0, 4).some(Boolean));
  candidates.sort((a, b) => {
    for (let index = 0; index < a.rank.length; index += 1) if (a.rank[index] !== b.rank[index]) return b.rank[index] - a.rank[index];
    return a.candidate.title.localeCompare(b.candidate.title);
  });
  return candidates.slice(0, Math.max(0, Math.min(6, limit))).map(({ candidate }) => candidate);
}

export function renderCategoryCard(site, category, toolCount) {
  const label = toolCount === 1 ? "1 tool" : `${toolCount} tools`;
  return `<a class="category-card" data-accent="${escapeHtml(category.accent ?? "default")}" href="${joinPath(site.basePath, `categories/${category.slug}`)}/">
    <span class="card-icon card-icon--category">${iconMarkup(category.icon)}</span>
    <span class="category-card__body"><strong>${escapeHtml(category.title)}</strong><span>${escapeHtml(category.shortDescription)}</span><small>${label}</small></span>
    <span class="card-arrow">${iconMarkup("arrow")}</span>
  </a>`;
}

function renderEditorialContent(markdown, site) {
  const html = markdownToHtml(markdown).replace(/href="\.\.\/\.\.\/([a-z0-9-]+)\/"/g, (_, slug) => `href="${joinPath(site.basePath, `tools/${slug}`)}/"`);
  const faqHeading = "<h2>Frequently asked questions</h2>";
  if (!html.includes(faqHeading)) return html;
  return html.replace(faqHeading, `<section class="faq-section">${faqHeading}`) + "</section>";
}

export function renderHome(project) {
  const { site } = project;
  const tools = project.tools.filter((tool) => tool.status === "published").sort((a, b) => (b.discovery?.priority ?? 0) - (a.discovery?.priority ?? 0));
  const categories = project.categories.filter((category) => category.status === "published" && tools.some((tool) => tool.category === category.id)).sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
  const homeSections = selectHomeSections(tools);
  const featuredSection = homeSections.find((section) => section.id === "featured");
  const compactSections = homeSections.filter((section) => section.id !== "featured");
  const body = `<section class="hero hero--home"><div class="container hero__inner"><p class="eyebrow">${tools.length} free browser ${tools.length === 1 ? "tool" : "tools"}</p><h1>The tool you need.<br><span>Right when you need it.</span></h1><p class="lead">Fast, free browser tools for images, text, files, calculations and more.</p>${searchForm(categories)}<ul class="trust-list" aria-label="AllTools benefits"><li>${iconMarkup("check")}Free to use</li><li>${iconMarkup("check")}No sign-up</li><li>${iconMarkup("check")}Runs in your browser</li></ul></div></section>
  ${featuredSection ? renderToolSection(site, featuredSection, categories) : ""}
  ${compactSections.length ? `<section class="section section--discovery-compact"><div class="container discovery-compact-grid">${compactSections.map((section) => renderCompactToolSection(site, section, categories)).join("")}</div></section>` : ""}
  <section class="section section--categories" id="categories"><div class="container"><div class="section-heading"><div><p class="section-kicker">Explore</p><h2>Browse categories</h2></div><p>Find the right set of tools for your task.</p></div><div class="category-grid">${categories.map((category) => renderCategoryCard(site, category, tools.filter((tool) => tool.category === category.id).length)).join("")}</div></div></section>
  ${renderAllToolsDirectory(site, categories, tools)}
  <section class="section section--why"><div class="container"><div class="why-panel"><div class="why-panel__intro"><p class="section-kicker">Why AllTools?</p><h2>Useful by design.</h2><p>No accounts, complicated menus or unnecessary steps. Open a tool and get to work.</p></div><div class="why-grid"><article>${iconMarkup("fast")}<h3>Fast</h3><p>Lightweight pages and focused interactions.</p></article><article>${iconMarkup("private")}<h3>Private</h3><p>Your content stays in your browser whenever possible.</p></article><article>${iconMarkup("simple")}<h3>Simple</h3><p>Clear tools that do one job well.</p></article></div></div></div></section>`;
  return layout({ site, title: `${site.name} – Free Online Tools`, description: site.description, canonicalPath: "", body, structured: [{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: `${site.siteUrl}/` }] });
}

export function renderCategory(project, category) {
  const { site } = project;
  const tools = project.tools
    .filter((tool) => tool.status === "published" && tool.category === category.id)
    .sort((a, b) => (b.discovery?.priority ?? 0) - (a.discovery?.priority ?? 0));
  const canonicalPath = `categories/${category.slug}`;
  const body = `<div class="container"><nav class="breadcrumbs" data-accent="${escapeHtml(category.accent ?? "default")}" aria-label="Breadcrumb"><ol><li><a href="${joinPath(site.basePath)}/">Home</a></li><li aria-current="page">${escapeHtml(category.title)}</li></ol></nav></div>
  <section class="hero hero--compact" data-accent="${escapeHtml(category.accent ?? "default")}"><div class="container"><span class="hero-category-icon">${iconMarkup(category.icon)}</span><p class="eyebrow">${tools.length} ${tools.length === 1 ? "tool" : "tools"}</p><h1>${escapeHtml(category.title)}</h1><p class="lead">${escapeHtml(category.shortDescription)}</p>${searchForm(project.categories.filter((item) => item.status === "published"))}</div></section>
  <section class="section"><div class="container"><div class="tool-grid">${tools.map((tool) => renderToolCard(site, tool, category)).join("")}</div><div class="content content--category">${markdownToHtml(category.markdown)}</div></div></section>`;
  return layout({ site, title: category.seoTitle, description: category.seoDescription, canonicalPath, body, structured: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: category.title, description: category.shortDescription, url: `${absolute(site, canonicalPath)}/` }] });
}

export function renderTool(project, tool) {
  const { site } = project;
  const category = project.categories.find((item) => item.id === tool.category);
  const canonicalPath = `tools/${tool.slug}`;
  const entryUrl = joinPath(site.basePath, `assets/js/plugins/tools/${tool.id}/${tool.entry.replace(/^\.\//, "")}`);
  const privacyMessage = tool.capabilities?.networkAccess === false ? (tool.family === "text-tools" ? "Your text stays in your browser." : "This tool runs in your browser.") : "";
  const relatedTools = selectRelatedTools(tool, project.tools);
  const related = relatedTools.length ? `<section class="section related-tools" data-accent="${escapeHtml(category.accent ?? "default")}" aria-labelledby="related-tools-heading"><div class="container"><div class="section-heading"><div><p class="section-kicker">Keep working</p><h2 id="related-tools-heading">Related Tools</h2></div><p>Useful next steps based on this tool.</p></div><div class="tool-grid related-tools__grid">${relatedTools.map((relatedTool) => renderToolCard(site, relatedTool, project.categories.find((item) => item.id === relatedTool.category))).join("")}</div></div></section>` : "";
  const categoryLabel = category.toolLabel ?? category.title.replace(/s$/, "");
  const body = `<div class="container"><nav class="breadcrumbs" data-accent="${escapeHtml(category.accent ?? "default")}" aria-label="Breadcrumb"><ol><li><a href="${joinPath(site.basePath)}/">Home</a></li><li class="breadcrumbs__category"><a href="${joinPath(site.basePath, `categories/${category.slug}`)}/">${escapeHtml(category.title)}</a></li><li aria-current="page">${escapeHtml(tool.title)}</li></ol></nav></div>
  <section class="hero hero--tool" data-accent="${escapeHtml(category.accent ?? "default")}"><div class="container"><span class="hero-tool-icon">${iconMarkup(tool.icon ?? category.icon)}</span><p class="category-identity">${escapeHtml(categoryLabel)}</p><h1>${escapeHtml(tool.title)}</h1><p class="lead">${escapeHtml(tool.shortDescription)}</p>${privacyMessage ? `<p class="privacy-note">${iconMarkup("shield")}${escapeHtml(privacyMessage)}</p>` : ""}</div></section>
  <div class="container tool-layout" data-accent="${escapeHtml(category.accent ?? "default")}"><section class="tool-panel" aria-label="${escapeHtml(tool.title)}" data-tool-root data-tool-id="${escapeHtml(tool.id)}" data-category="${escapeHtml(tool.category)}" data-tool-entry="${entryUrl}"><noscript>This tool requires JavaScript to run.</noscript></section><article class="content">${renderEditorialContent(tool.markdown, site)}</article></div>${related}`;
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

export function renderPage(project, page) {
  const { site } = project;
  const body = `<div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="${joinPath(site.basePath)}/">Home</a></li><li aria-current="page">${escapeHtml(page.title)}</li></ol></nav></div>
  <section class="hero hero--compact hero--page"><div class="container"><p class="eyebrow">AllTools</p><h1>${escapeHtml(page.title)}</h1><p class="lead">${escapeHtml(page.seoDescription)}</p></div></section>
  <section class="section section--page"><div class="container"><article class="content content--page">${markdownToHtml(page.markdown)}</article></div></section>`;
  return layout({ site, title: page.seoTitle, description: page.seoDescription, canonicalPath: page.slug, body, structured: [{ "@context": "https://schema.org", "@type": "WebPage", name: page.title, description: page.seoDescription, url: `${absolute(site, page.slug)}/`, dateModified: page.updatedAt }] });
}


export { absolute, joinPath };
