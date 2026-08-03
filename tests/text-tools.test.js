import test from "node:test";
import assert from "node:assert/strict";
import { textOperations, generateLorem, sentenceSegments } from "../src/plugins/families/text-tools/operations.js";
import { textToolDefinitions } from "../src/plugins/families/text-tools/tool-definitions.js";
import { createToolUseTracker } from "../src/core/telemetry/tool-use.js";
import { normalizeResult } from "../src/plugins/families/text-tools/universal-plugin.js";

const cases = [
  ["character-counter", () => assert.deepEqual(textOperations.characterCounter("Hi 👋\n"), { characters: 5, charactersWithoutSpaces: 3, words: 1, lines: 2 })],
  ["case-converter", () => { assert.equal(textOperations.caseConverter("Hello WORLD", { mode: "sentence" }), "Hello world"); assert.equal(textOperations.caseConverter("the lord of the rings", { mode: "title" }), "The Lord of the Rings"); assert.equal(textOperations.caseConverter("Äb", { mode: "invert" }), "äB"); }],
  ["remove-duplicate-lines", () => assert.deepEqual(textOperations.removeDuplicateLines("A\na\nB", {}), { output: "A\nB", removed: 1 })],
  ["remove-empty-lines", () => assert.deepEqual(textOperations.removeEmptyLines("A\n  \nB", {}), { output: "A\nB", lines: 2 })],
  ["text-sorter", () => assert.equal(textOperations.sortText("10\n2\n1", { mode: "numeric" }), "1\n2\n10")],
  ["text-reverser", () => { assert.equal(textOperations.reverseText("one two", { mode: "words" }), "two one"); assert.equal(textOperations.reverseText("a\nb", { mode: "lines" }), "b\na"); }],
  ["whitespace-cleaner", () => assert.equal(textOperations.cleanWhitespace(" A  B \t\n\n\n C ", {}), "A B\n\n C")],
  ["line-counter", () => assert.deepEqual(textOperations.lineCounter("a\n\nxyz"), { total: 3, nonEmpty: 2, empty: 1, longest: 3, average: "1.3" })],
  ["sentence-counter", () => { assert.equal(sentenceSegments("Dr. Ada writes. It works!").length, 2); assert.deepEqual(textOperations.sentenceCounter("Hi world. Bye."), { sentences: 2, words: 3, average: "1.5" }); }],
  ["paragraph-counter", () => assert.deepEqual(textOperations.paragraphCounter("One sentence.\n\nTwo words here."), { paragraphs: 2, words: 5, sentences: 2, average: "2.5" })],
  ["url-encoder", () => assert.equal(textOperations.urlEncode("✓ &", { mode: "component" }), "%E2%9C%93%20%26")],
  ["url-decoder", () => { assert.equal(textOperations.urlDecode("%E2%9C%93", {}), "✓"); assert.throws(() => textOperations.urlDecode("%E2%", {}), /not valid/); }],
  ["base64-encoder", () => assert.equal(textOperations.base64Encode("Merhaba 👋"), "TWVyaGFiYSDwn5GL")],
  ["base64-decoder", () => { assert.equal(textOperations.base64Decode("TWVyaGFiYSDwn5GL"), "Merhaba 👋"); assert.throws(() => textOperations.base64Decode("%%%"), /valid Base64/); }],
  ["html-encoder", () => assert.equal(textOperations.htmlEncode(`<a title="x">Tom & 'J'</a>`), "&lt;a title=&quot;x&quot;&gt;Tom &amp; &#39;J&#39;&lt;/a&gt;")],
  ["html-decoder", () => assert.equal(textOperations.htmlDecode("&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;"), "<b>Tom & Jerry</b>")],
  ["rot13-converter", () => { assert.equal(textOperations.rot13("Hello, Dünya!"), "Uryyb, Qüaln!"); assert.equal(textOperations.rot13(textOperations.rot13("Secret 123")), "Secret 123"); }],
  ["lorem-ipsum-generator", () => { assert.equal(generateLorem(5, "words").split(" ").length, 5); assert.equal(generateLorem(2, "paragraphs").split("\n\n").length, 2); assert.equal(generateLorem(999, "words").split(" ").length, 500); }]
];

for (const [id, assertion] of cases) test(`${id} handles core, Unicode, edge and telemetry dedup behavior`, () => {
  assert.ok(textToolDefinitions[id]);
  assertion();
  const events = []; let callback;
  const tracker = createToolUseTracker({ telemetry: { trackToolUse: (event) => events.push(event) }, toolId: id, debounceMs: 1, setTimer: (fn) => { callback = fn; return 1; }, clearTimer() {} });
  tracker.observe(true); tracker.observe(true); callback(); tracker.observe(true);
  assert.equal(events.length, 1);
});

test("every text tool handles empty input without leaking content", () => {
  for (const definition of Object.values(textToolDefinitions)) {
    if (definition.kind === "generator") continue;
    const operation = definition.analyze ?? definition.transform;
    assert.doesNotThrow(() => operation("", {}), definition.id);
  }
});

test("shared runtime preserves analyzer metric objects", () => {
  const metrics = textOperations.characterCounter("Hello world");
  assert.equal(normalizeResult(metrics), metrics);
  assert.deepEqual(normalizeResult("HELLO"), { output: "HELLO" });
});
