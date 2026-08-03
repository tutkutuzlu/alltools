import test from "node:test";
import assert from "node:assert/strict";
import { discoverProject } from "../scripts/lib/project.mjs";

test("published tools have unique SEO fields and intent-specific content", async () => {
  const project = await discoverProject();
  const tools = project.tools.filter((tool) => tool.status === "published");
  assert.equal(tools.length, 104);
  for (const field of ["title", "shortDescription", "seoTitle", "seoDescription"]) {
    assert.equal(new Set(tools.map((tool) => tool[field])).size, tools.length, `${field} should be unique`);
  }
  for (const tool of tools) {
    assert.match(tool.markdown, /## How to use/);
    assert.match(tool.markdown, /## Practical example|## What does it count/);
    assert.match(tool.markdown, /## Privacy/);
    assert.match(tool.markdown, /## Frequently asked questions/);
    if (tool.id !== "word-counter") assert.match(tool.markdown, /## Related (?:text tools|developer tools|unit converters|color tools|security tools)/);
  }
});
