import { access, cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseContent } from "./content.mjs";

export const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const srcDir = path.join(rootDir, "src");
export const distDir = path.join(rootDir, "dist");

export async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

export async function pathExists(filePath) {
  try { await access(filePath); return true; } catch { return false; }
}

export async function discoverProject() {
  const site = await readJson(path.join(srcDir, "config", "site.json"));
  const analytics = await readJson(path.join(srcDir, "config", "analytics.json"));
  const ads = await readJson(path.join(srcDir, "config", "ads.json"));
  const categoriesRoot = path.join(srcDir, "content", "categories");
  const pagesRoot = path.join(srcDir, "content", "pages");
  const toolsRoot = path.join(srcDir, "plugins", "tools");
  const categoryFolders = await readdir(categoriesRoot, { withFileTypes: true });
  const toolFolders = await readdir(toolsRoot, { withFileTypes: true });
  const categories = [];
  const pages = [];
  const tools = [];

  for (const fileName of (await readdir(pagesRoot)).filter((name) => name.endsWith(".md")).sort()) {
    const content = parseContent(await readFile(path.join(pagesRoot, fileName), "utf8"), `pages/${fileName}`);
    pages.push({ ...content.frontMatter, markdown: content.markdown, fileName });
  }

  for (const folder of categoryFolders.filter((entry) => entry.isDirectory())) {
    const directory = path.join(categoriesRoot, folder.name);
    const metadata = await readJson(path.join(directory, "category.json"));
    const content = parseContent(await readFile(path.join(directory, "content.md"), "utf8"), `${folder.name}/content.md`);
    categories.push({ ...metadata, ...content.frontMatter, markdown: content.markdown, directory });
  }
  for (const folder of toolFolders.filter((entry) => entry.isDirectory())) {
    const directory = path.join(toolsRoot, folder.name);
    const metadata = await readJson(path.join(directory, "tool.json"));
    const content = parseContent(await readFile(path.join(directory, "content.md"), "utf8"), `${folder.name}/content.md`);
    tools.push({ ...metadata, ...content.frontMatter, markdown: content.markdown, directory });
  }
  return { site, analytics, ads, pages, categories, tools };
}

export async function resetDist() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
}

export async function writeOutput(relativePath, content) {
  const target = path.join(distDir, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

export async function copyDirectory(source, relativeTarget) {
  await cp(source, path.join(distDir, relativeTarget), { recursive: true });
}
