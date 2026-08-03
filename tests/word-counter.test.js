import test from "node:test";
import assert from "node:assert/strict";
import { analyzeText } from "../src/plugins/families/text-tools/metrics.js";

test("analyzes empty text", () => {
  assert.deepEqual(analyzeText(""), { words: 0, characters: 0, charactersWithoutSpaces: 0, sentences: 0, readingTimeMinutes: 0 });
});

test("counts words, characters and sentences", () => {
  const result = analyzeText("Hello world. This is Codex!");
  assert.equal(result.words, 5);
  assert.equal(result.characters, 27);
  assert.equal(result.charactersWithoutSpaces, 23);
  assert.equal(result.sentences, 2);
  assert.equal(result.readingTimeMinutes, 1);
});

test("supports Unicode words and contractions", () => {
  const result = analyzeText("Café isn't kötü.");
  assert.equal(result.words, 3);
  assert.equal(result.sentences, 1);
});
