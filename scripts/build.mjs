import path from "node:path";
import { discoverProject, resetDist, copyDirectory, srcDir, writeOutput } from "./lib/project.mjs";
import { readFile } from "node:fs/promises";
import { validateProject } from "./lib/validate-project.mjs";
import { renderCategory, renderHome, renderNotFound, renderTool } from "./lib/render.mjs";

const project = await discoverProject();
const errors = await validateProject(project);
if (errors.length) throw new Error(`Build validation failed:\n- ${errors.join("\n- ")}`);

await resetDist();
await copyDirectory(path.join(srcDir, "static", "styles"), "assets/css");
await copyDirectory(path.join(srcDir, "core"), "assets/js/core");
await copyDirectory(path.join(srcDir, "components"), "assets/js/components");
await copyDirectory(path.join(srcDir, "search"), "assets/js/search");
await writeOutput("assets/js/themes/engine.js", await readFile(path.join(srcDir, "themes", "engine.js"), "utf8"));
await writeOutput("assets/js/plugins/families/text-tools/metrics.js", await readFile(path.join(srcDir, "plugins", "families", "text-tools", "metrics.js"), "utf8"));
await writeOutput("assets/js/plugins/tools/word-counter/index.js", await readFile(path.join(srcDir, "plugins", "tools", "word-counter", "index.js"), "utf8"));

const tokens = await readFile(path.join(srcDir, "themes", "base", "tokens.css"), "utf8");
await writeOutput("assets/css/tokens.css", tokens);
await writeOutput("index.html", renderHome(project));
await writeOutput("404.html", renderNotFound(project.site));

for (const category of project.categories.filter((item) => item.status === "published")) {
  await writeOutput(path.join("categories", category.slug, "index.html"), renderCategory(project, category));
}
for (const tool of project.tools.filter((item) => item.status === "published")) {
  await writeOutput(path.join("tools", tool.slug, "index.html"), renderTool(project, tool));
}

const base = project.site.basePath.replace(/\/$/, "");
const searchIndex = {
  version: 1,
  language: project.site.language,
  items: project.tools.filter((tool) => tool.status === "published").map((tool) => ({
    id: tool.id,
    title: tool.title,
    description: tool.shortDescription,
    category: tool.category,
    tags: tool.tags,
    aliases: tool.aliases,
    url: `${base}/tools/${tool.slug}/`
  }))
};
await writeOutput("search/index.json", `${JSON.stringify(searchIndex)}\n`);

const urls = ["", ...project.categories.filter((item) => item.status === "published").map((item) => `categories/${item.slug}/`), ...project.tools.filter((item) => item.status === "published").map((item) => `tools/${item.slug}/`)];
await writeOutput("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((item) => `  <url><loc>${project.site.siteUrl.replace(/\/$/, "")}/${item}</loc></url>`).join("\n")}\n</urlset>\n`);
await writeOutput("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${project.site.siteUrl.replace(/\/$/, "")}/sitemap.xml\n`);
await writeOutput(".nojekyll", "");

console.log(`Built ${project.tools.length} tool(s) and ${project.categories.length} category into dist/.`);
