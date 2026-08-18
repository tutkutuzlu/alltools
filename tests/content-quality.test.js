import test from "node:test";
import assert from "node:assert/strict";
import { discoverProject } from "../scripts/lib/project.mjs";
import { createRepetitionReport, createSimilarityReport, enforceRepetition, enforceSimilarity } from "../scripts/lib/content-quality.mjs";

test("published tools have unique catalog and SEO fields", async () => {
  const project = await discoverProject();
  const tools = project.tools.filter((tool) => tool.status === "published");
  assert.equal(tools.length, 104);
  for (const field of ["title", "shortDescription", "seoTitle", "seoDescription"]) {
    assert.equal(new Set(tools.map((tool) => tool[field])).size, tools.length, `${field} should be unique`);
  }
});

test("site-wide editorial duplication stays below the post-remediation guardrails", async (context) => {
  const project = await discoverProject();
  const tools = project.tools.filter((tool) => tool.status === "published");
  const report = createSimilarityReport(tools);
  assert.equal(report.toolCount, 104);
  assert.equal(report.pairCount, (104 * 103) / 2);
  assert.ok(report.pairs[0].similarity >= report.pairs.at(-1).similarity);
  assert.doesNotThrow(() => enforceSimilarity(report, { maximum: 0.12 }));
  const repetitions = createRepetitionReport(tools);
  assert.deepEqual(repetitions.sentences, []);
  assert.deepEqual(repetitions.paragraphs, []);
  assert.doesNotThrow(() => enforceRepetition(repetitions));
  if (process.env.CONTENT_SIMILARITY_REPORT === "1") {
    context.diagnostic(`Highest editorial similarities: ${report.pairs.slice(0, 10).map((pair) => `${pair.left}/${pair.right}=${pair.similarity.toFixed(3)}`).join(", ")}`);
  }
});

test("similarity and repetition exceptions are narrow and explicit", () => {
  const report = { pairs: [{ left: "one", right: "two", similarity: 0.8 }] };
  assert.throws(() => enforceSimilarity(report, { maximum: 0.7 }), /one\/two/);
  assert.doesNotThrow(() => enforceSimilarity(report, { maximum: 0.7, exceptions: ["one/two"] }));
  const repetitions = { sentences: [{ text: "documented shared sentence", ids: ["one", "two"] }], paragraphs: [] };
  assert.throws(() => enforceRepetition(repetitions), /documented shared sentence/);
  assert.doesNotThrow(() => enforceRepetition(repetitions, { sentenceExceptions: ["documented shared sentence"] }));
});

test("published editorial bodies are present and local tool links resolve", async () => {
  const project = await discoverProject();
  const tools = project.tools.filter((tool) => tool.status === "published");
  const ids = new Set(tools.map((tool) => tool.id));
  for (const tool of tools) {
    const body = tool.markdown.replace(/^---\s*[\s\S]*?\s---\s*/, "").trim();
    assert.ok(body.length >= 300, `${tool.id} has obviously missing editorial content`);
    for (const match of body.matchAll(/\[[^\]]+\]\(\.\.\/\.\.\/([^/)]+)\/\)/g)) {
      assert.ok(ids.has(match[1]), `${tool.id} links to missing tool ${match[1]}`);
    }
  }
});
