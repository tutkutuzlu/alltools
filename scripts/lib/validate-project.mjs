import path from "node:path";
import { pathExists } from "./project.mjs";
import { hasIcon } from "../../src/components/icons.js";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const allowedTypes = new Set(["tool", "calculator", "converter", "generator", "formatter", "visualizer", "game", "reference"]);

function required(object, fields, label, errors) {
  for (const field of fields) if (object[field] === undefined || object[field] === "") errors.push(`${label}: missing ${field}`);
}

export async function validateProject(project) {
  const errors = [];
  required(project.site, ["name", "description", "language", "siteUrl", "basePath"], "site.json", errors);
  if (!/^https:\/\//.test(project.site.siteUrl)) errors.push("site.json: siteUrl must use https://");
  if (project.site.basePath !== "" && !/^\/[a-z0-9/_-]*$/.test(project.site.basePath)) errors.push("site.json: basePath is invalid");
  if (project.ads.provider !== "google") errors.push("ads.json: provider must be google");
  if (project.ads.publisherId && !/^pub-\d{16}$/.test(project.ads.publisherId)) errors.push("ads.json: publisherId must use pub- followed by 16 digits");

  const pageSlugs = new Set();
  for (const page of project.pages) {
    required(page, ["slug", "title", "seoTitle", "seoDescription", "updatedAt"], `page:${page.slug ?? "unknown"}`, errors);
    if (!slugPattern.test(page.slug ?? "")) errors.push(`page:${page.slug}: invalid slug`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(page.updatedAt ?? "")) errors.push(`page:${page.slug}: updatedAt must use YYYY-MM-DD`);
    if (pageSlugs.has(page.slug)) errors.push(`page:${page.slug}: duplicate slug`);
    pageSlugs.add(page.slug);
  }

  const categoryIds = new Set();
  const categorySlugs = new Set();
  for (const category of project.categories) {
    required(category, ["schemaVersion", "id", "slug", "title", "shortDescription", "seoTitle", "seoDescription", "status"], `category:${category.id ?? "unknown"}`, errors);
    if (!slugPattern.test(category.slug ?? "")) errors.push(`category:${category.id}: invalid slug`);
    if (category.icon && !hasIcon(category.icon)) errors.push(`category:${category.id}: unknown icon ${category.icon}`);
    if (category.featured !== undefined && typeof category.featured !== "boolean") errors.push(`category:${category.id}: featured must be boolean`);
    if (categoryIds.has(category.id)) errors.push(`category:${category.id}: duplicate id`);
    if (categorySlugs.has(category.slug)) errors.push(`category:${category.id}: duplicate slug`);
    categoryIds.add(category.id);
    categorySlugs.add(category.slug);
  }

  const toolIds = new Set();
  const toolSlugs = new Set();
  for (const tool of project.tools) {
    const label = `tool:${tool.id ?? "unknown"}`;
    required(tool, ["schemaVersion", "id", "version", "type", "family", "slug", "status", "entry", "category", "title", "shortDescription", "seoTitle", "seoDescription", "components", "capabilities"], label, errors);
    if (!slugPattern.test(tool.slug ?? "")) errors.push(`${label}: invalid slug`);
    if (tool.icon && !hasIcon(tool.icon)) errors.push(`${label}: unknown icon ${tool.icon}`);
    if (tool.featured !== undefined && typeof tool.featured !== "boolean") errors.push(`${label}: featured must be boolean`);
    if (tool.popularity !== undefined && (!Number.isInteger(tool.popularity) || tool.popularity < 0)) errors.push(`${label}: popularity must be a non-negative integer`);
    for (const field of ["publishedAt", "updatedAt"]) if (tool[field] && !/^\d{4}-\d{2}-\d{2}$/.test(tool[field])) errors.push(`${label}: ${field} must use YYYY-MM-DD`);
    if (!allowedTypes.has(tool.type)) errors.push(`${label}: unsupported type ${tool.type}`);
    if (!categoryIds.has(tool.category)) errors.push(`${label}: category ${tool.category} does not exist`);
    if (toolIds.has(tool.id)) errors.push(`${label}: duplicate id`);
    if (toolSlugs.has(tool.slug)) errors.push(`${label}: duplicate slug`);
    if (!Array.isArray(tool.tags) || !tool.tags.length) errors.push(`${label}: at least one tag is required`);
    if (!Array.isArray(tool.aliases)) errors.push(`${label}: aliases must be an array`);
    if (!await pathExists(path.resolve(tool.directory, tool.entry ?? ""))) errors.push(`${label}: entry file does not exist`);
    toolIds.add(tool.id);
    toolSlugs.add(tool.slug);
  }
  return errors;
}
