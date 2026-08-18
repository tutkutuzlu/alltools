const normalize = (value) => String(value)
  .toLowerCase()
  .replace(/`[^`]*`/g, " ")
  .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

export function shingles(value, size = 5) {
  const words = normalize(value).split(/\s+/).filter(Boolean);
  if (words.length < size) return new Set(words.length ? [words.join(" ")] : []);
  return new Set(Array.from({ length: words.length - size + 1 }, (_, index) => words.slice(index, index + size).join(" ")));
}

export function jaccard(left, right) {
  if (!left.size && !right.size) return 1;
  let intersection = 0;
  for (const value of left) if (right.has(value)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

export function createSimilarityReport(tools, { shingleSize = 5 } = {}) {
  const prepared = tools.map((tool) => ({ id: tool.id, category: tool.category, values: shingles(tool.markdown, shingleSize) }));
  const pairs = [];
  for (let left = 0; left < prepared.length; left += 1) {
    for (let right = left + 1; right < prepared.length; right += 1) {
      pairs.push({
        left: prepared[left].id,
        right: prepared[right].id,
        sameCategory: prepared[left].category === prepared[right].category,
        similarity: jaccard(prepared[left].values, prepared[right].values)
      });
    }
  }
  pairs.sort((a, b) => b.similarity - a.similarity || a.left.localeCompare(b.left) || a.right.localeCompare(b.right));
  return { toolCount: prepared.length, pairCount: pairs.length, pairs };
}

export function enforceSimilarity(report, { maximum = null, exceptions = [] } = {}) {
  if (maximum === null) return;
  const allowedPairs = new Set(exceptions);
  const violations = report.pairs.filter((pair) => pair.similarity > maximum && !allowedPairs.has([pair.left, pair.right].sort().join("/")));
  if (violations.length) {
    const examples = violations.slice(0, 5).map((pair) => `${pair.left}/${pair.right}: ${pair.similarity.toFixed(3)}`).join(", ");
    throw new Error(`Editorial similarity exceeds ${maximum}: ${examples}`);
  }
}

const stripFrontmatter = (value) => String(value).replace(/^---\s*[\s\S]*?\s---\s*/, "");
const normalizedBlock = (value) => normalize(value);
const wordCount = (value) => normalizedBlock(value).split(/\s+/).filter(Boolean).length;

function repeatedBlocks(tools, split, minimumWords) {
  const occurrences = new Map();
  for (const tool of tools) {
    const blocks = stripFrontmatter(tool.markdown).split(split).map((value) => value.trim()).filter((value) => wordCount(value) >= minimumWords);
    for (const block of blocks) {
      const text = normalizedBlock(block);
      if (!text) continue;
      if (!occurrences.has(text)) occurrences.set(text, new Set());
      occurrences.get(text).add(tool.id);
    }
  }
  return [...occurrences.entries()]
    .filter(([, ids]) => ids.size > 1)
    .map(([text, ids]) => ({ text, ids: [...ids].sort() }))
    .sort((left, right) => right.ids.length - left.ids.length || left.text.localeCompare(right.text));
}

export function createRepetitionReport(tools, { sentenceMinimumWords = 6, paragraphMinimumWords = 20 } = {}) {
  return {
    sentences: repeatedBlocks(tools, /(?<=[.!?])\s+|\n+/g, sentenceMinimumWords),
    paragraphs: repeatedBlocks(tools, /\n{2,}/g, paragraphMinimumWords)
  };
}

export function enforceRepetition(report, { sentenceExceptions = [], paragraphExceptions = [] } = {}) {
  const allowedSentences = new Set(sentenceExceptions);
  const allowedParagraphs = new Set(paragraphExceptions);
  const sentences = report.sentences.filter(({ text }) => !allowedSentences.has(text));
  const paragraphs = report.paragraphs.filter(({ text }) => !allowedParagraphs.has(text));
  if (sentences.length || paragraphs.length) {
    const examples = [...sentences.map(({ text, ids }) => `sentence in ${ids.join(", ")}: “${text}”`), ...paragraphs.map(({ text, ids }) => `paragraph in ${ids.join(", ")}: “${text}”`)].slice(0, 5);
    throw new Error(`Repeated editorial content detected: ${examples.join("; ")}`);
  }
}
