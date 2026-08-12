import path from "node:path";
import { discoverProject, resetDist, copyDirectory, pathExists, readJson, rootDir, srcDir, writeOutput } from "./lib/project.mjs";
import { readFile } from "node:fs/promises";
import { validateProject } from "./lib/validate-project.mjs";
import { renderCategory, renderHome, renderNotFound, renderPage, renderTool } from "./lib/render.mjs";
import { applyPopularityExport } from "./lib/popularity.mjs";

const project = await discoverProject();
const popularityExport = path.join(rootDir, "analytics", "export", "popularity.json");
project.tools = applyPopularityExport(project.tools, await pathExists(popularityExport) ? await readJson(popularityExport) : null);
const environment = process.env.ANALYTICS_ENV === "development" ? "development" : "production";
project.analytics = { ...project.analytics, ...(project.analytics.environments?.[environment] ?? {}), environment };
project.ads = { ...project.ads, environment };
project.site.analytics = project.analytics;
project.site.ads = project.ads;
const errors = await validateProject(project);
if (errors.length) throw new Error(`Build validation failed:\n- ${errors.join("\n- ")}`);

await resetDist();
await copyDirectory(path.join(srcDir, "static", "styles"), "assets/css");
await copyDirectory(path.join(srcDir, "core"), "assets/js/core");
await copyDirectory(path.join(srcDir, "components"), "assets/js/components");
await copyDirectory(path.join(srcDir, "search"), "assets/js/search");
await writeOutput("assets/js/config/runtime-config.js", `export const analyticsConfig = Object.freeze(${JSON.stringify(project.analytics).replace(/</g, "\\u003c")});\n`);
await writeOutput("assets/js/themes/engine.js", await readFile(path.join(srcDir, "themes", "engine.js"), "utf8"));
await copyDirectory(path.join(srcDir, "plugins", "families"), "assets/js/plugins/families");
for (const tool of project.tools.filter((item) => item.status === "published")) {
  await writeOutput(`assets/js/plugins/tools/${tool.id}/${tool.entry.replace(/^\.\//, "")}`, await readFile(path.resolve(tool.directory, tool.entry), "utf8"));
}

const tokens = await readFile(path.join(srcDir, "themes", "base", "tokens.css"), "utf8");
await writeOutput("assets/css/tokens.css", tokens);
await writeOutput("index.html", renderHome(project));
await writeOutput("404.html", renderNotFound(project.site));
for (const page of project.pages) await writeOutput(path.join(page.slug, "index.html"), renderPage(project, page));

for (const category of project.categories.filter((item) => item.status === "published")) {
  await writeOutput(path.join("categories", category.slug, "index.html"), renderCategory(project, category));
}
for (const tool of project.tools.filter((item) => item.status === "published")) {
  await writeOutput(path.join("tools", tool.slug, "index.html"), renderTool(project, tool));
}

const base = project.site.basePath.replace(/\/$/, "");
const searchIndex = {
  v: 2,
  l: project.site.language,
  c: project.categories.filter((category) => category.status === "published").map((category) => ({ i: category.id, t: category.title })),
  x: project.tools.filter((tool) => tool.status === "published").map((tool) => ({
    i: tool.id,
    t: tool.title,
    d: tool.shortDescription,
    c: tool.category,
    g: tool.tags,
    a: tool.aliases,
    u: `${base}/tools/${tool.slug}/`
  }))
};
await writeOutput("search/index.json", `${JSON.stringify(searchIndex)}\n`);

const urls = [
  { path: "" },
  ...project.pages.map((item) => ({ path: `${item.slug}/`, updatedAt: item.updatedAt })),
  ...project.categories.filter((item) => item.status === "published").map((item) => ({ path: `categories/${item.slug}/` })),
  ...project.tools.filter((item) => item.status === "published").map((item) => ({ path: `tools/${item.slug}/`, updatedAt: item.updatedAt }))
];
const escapeXml = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const sitemapEntries = urls.map((item) => {
  const location = `${project.site.siteUrl.replace(/\/$/, "")}/${item.path}`;
  return ["  <url>", `    <loc>${escapeXml(location)}</loc>`, item.updatedAt ? `    <lastmod>${escapeXml(item.updatedAt)}</lastmod>` : "", "  </url>"].filter(Boolean).join("\n");
});
await writeOutput("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join("\n")}\n</urlset>\n`);
await writeOutput("robots.txt", `User-agent: *\nAllow: /\n\nUser-agent: Mediapartners-Google\nAllow: /\n\nUser-agent: Google-Display-Ads-Bot\nAllow: /\n\nSitemap: ${project.site.siteUrl.replace(/\/$/, "")}/sitemap.xml\n`);
const adsRecord = project.ads.publisherId ? `google.com, ${project.ads.publisherId}, DIRECT, ${project.ads.certificationAuthorityId}\n` : "# Google AdSense publisher ID pending.\n# When approved, set publisherId in src/config/ads.json to generate the authorized seller record.\n";
await writeOutput("ads.txt", adsRecord);
await writeOutput(".nojekyll", "");

console.log(`Built ${project.tools.length} tool(s) and ${project.categories.length} category into dist/.`);
