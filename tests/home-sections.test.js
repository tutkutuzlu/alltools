import test from "node:test";
import assert from "node:assert/strict";
import { isNewTool, selectHomeSections } from "../scripts/lib/render.mjs";

const today = new Date("2026-08-03T00:00:00Z");

test("derives new state from publishedAt", () => {
  assert.equal(isNewTool({ publishedAt: "2026-08-01" }, today), true);
  assert.equal(isNewTool({ publishedAt: "2025-01-01" }, today), false);
  assert.equal(isNewTool({}, today), false);
});

test("home sections do not repeat tools", () => {
  const tools = [
    { id: "featured", status: "published", featured: true, popularity: 100, publishedAt: "2026-08-01", discovery: { priority: 10 } },
    { id: "new", status: "published", popularity: 50, publishedAt: "2026-08-02", discovery: { priority: 5 } },
    { id: "popular", status: "published", popularity: 90, publishedAt: "2025-01-01", discovery: { priority: 1 } }
  ];
  const sections = selectHomeSections(tools, today);
  const ids = sections.flatMap((section) => section.tools.map((tool) => tool.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(ids, ["featured", "new", "popular"]);
});
