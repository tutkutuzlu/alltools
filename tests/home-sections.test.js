import test from "node:test";
import assert from "node:assert/strict";
import { isNewTool, renderHome, renderToolCard, selectHomeSections, selectRelatedTools } from "../scripts/lib/render.mjs";

const today = new Date("2026-08-03T00:00:00Z");

test("NEW is derived safely from the first ten UTC days after publishedAt", () => {
  assert.equal(isNewTool({ publishedAt: "2026-08-03" }, today), true);
  assert.equal(isNewTool({ publishedAt: "2026-07-25" }, today), true);
  assert.equal(isNewTool({ publishedAt: "2026-07-24" }, today), false);
  assert.equal(isNewTool({ publishedAt: "2026-02-30" }, today), false);
  assert.equal(isNewTool({ publishedAt: "not-a-date" }, today), false);
  assert.equal(isNewTool({}, today), false);
});

test("home discovery is metadata-driven, bounded and duplicate-free", () => {
  const tools = Array.from({ length: 16 }, (_, index) => ({
    id: `tool-${index}`,
    status: "published",
    featured: index < 7,
    popularity: 100 - index,
    publishedAt: index < 12 ? "2026-08-01" : "2025-01-01",
    discovery: { priority: 100 - index }
  }));
  const sections = selectHomeSections(tools, today);
  const byId = Object.fromEntries(sections.map((section) => [section.id, section.tools]));
  assert.equal(byId.featured.length, 6);
  assert.equal(byId.new.length, 3);
  assert.equal(byId.popular.length, 3);
  assert.ok(byId.featured.every((tool) => tool.featured));
  const ids = sections.flatMap((section) => section.tools.map((tool) => tool.id));
  assert.equal(new Set(ids).size, ids.length);
});

test("related tools exclude the source, stay unique and prioritize its category", () => {
  const source = { id: "source", status: "published", category: "text", family: "text-tools", type: "tool", variant: "analyzer", tags: ["text", "count"], aliases: ["word count"] };
  const tools = [source,
    ...Array.from({ length: 7 }, (_, index) => ({ id: `text-${index}`, title: `Text ${index}`, status: "published", category: "text", family: "text-tools", type: "tool", variant: "transformer", tags: ["text"], aliases: [], discovery: { priority: 20 - index } })),
    { id: "other", title: "Other", status: "published", category: "developer", family: "developer-tools", type: "formatter", tags: ["json"], aliases: [], discovery: { priority: 999 } }
  ];
  const related = selectRelatedTools(source, tools);
  assert.ok(related.length >= 4 && related.length <= 6);
  assert.equal(related.some((tool) => tool.id === source.id), false);
  assert.equal(new Set(related.map((tool) => tool.id)).size, related.length);
  assert.ok(related.every((tool) => tool.category === source.category));
});

test("tool count and category accent are rendered from catalog metadata", () => {
  const category = { id: "text", slug: "text-tools", title: "Text Tools", shortDescription: "Text utilities", icon: "text", accent: "violet", status: "published", featured: true, order: 1 };
  const makeTool = (id, priority) => ({ id, slug: id, title: id, shortDescription: "Description", status: "published", category: "text", family: "text-tools", type: "tool", tags: ["text"], aliases: [], discovery: { priority }, publishedAt: "2025-01-01" });
  const site = { name: "AllTools", description: "Tools", language: "en", siteUrl: "https://example.com/alltools", basePath: "/alltools", analytics: {}, ads: {} };
  const home = renderHome({ site, categories: [category], tools: [makeTool("one", 2), makeTool("two", 1)] });
  assert.match(home, /2 free browser tools/);
  assert.match(renderToolCard(site, makeTool("one", 1), category), /data-accent="violet"/);
  assert.match(renderToolCard(site, makeTool("one", 1), {}), /data-accent="default"/);
});
