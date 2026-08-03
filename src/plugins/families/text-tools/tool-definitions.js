import { textOperations, generateLorem } from "./operations.js";

const select = (id, label, options, value) => ({ id, label, component: "field.select", options, value });
const checkbox = (id, label, checked = false) => ({ id, label, component: "field.checkbox", checked });
const modes = (values) => values.map(([value, label]) => ({ value, label }));
const transformer = (id, transform, controls = [], extras = {}) => ({ id, kind: "transformer", transform, controls, actions: ["paste", "clear", "copy", ...(extras.download ? ["download"] : [])], ...extras });
const analyzer = (id, analyze, metrics) => ({ id, kind: "analyzer", analyze, metrics, actions: ["paste", "clear"] });

export const textToolDefinitions = Object.freeze({
  "character-counter": analyzer("character-counter", textOperations.characterCounter, [["characters", "Characters"], ["charactersWithoutSpaces", "Characters without spaces"], ["words", "Words"], ["lines", "Lines"]]),
  "case-converter": transformer("case-converter", textOperations.caseConverter, [select("mode", "Case style", modes([["upper", "UPPERCASE"], ["lower", "lowercase"], ["title", "Title Case"], ["sentence", "Sentence case"], ["capitalize", "Capitalize Each Word"], ["invert", "Invert Case"]]), "upper")], { download: true }),
  "remove-duplicate-lines": { ...transformer("remove-duplicate-lines", textOperations.removeDuplicateLines, [checkbox("caseSensitive", "Case-sensitive comparison"), checkbox("preserveEmpty", "Preserve empty lines", true)]), metrics: [["removed", "Duplicates removed"]] },
  "remove-empty-lines": { ...transformer("remove-empty-lines", textOperations.removeEmptyLines, [checkbox("whitespaceOnly", "Remove whitespace-only lines", true)]), metrics: [["lines", "Result lines"]] },
  "text-sorter": transformer("text-sorter", textOperations.sortText, [select("mode", "Sort order", modes([["az", "A–Z"], ["za", "Z–A"], ["length-asc", "Length ascending"], ["length-desc", "Length descending"], ["numeric", "Numeric sort"]]), "az"), checkbox("caseSensitive", "Case-sensitive sorting")]),
  "text-reverser": transformer("text-reverser", textOperations.reverseText, [select("mode", "Reverse mode", modes([["all", "Reverse all characters"], ["line-characters", "Reverse characters in each line"], ["lines", "Reverse line order"], ["words", "Reverse word order"]]), "all")]),
  "whitespace-cleaner": transformer("whitespace-cleaner", textOperations.cleanWhitespace, [checkbox("tabs", "Convert tabs to spaces", true), checkbox("blankLines", "Reduce consecutive blank lines", true)]),
  "line-counter": analyzer("line-counter", textOperations.lineCounter, [["total", "Total lines"], ["nonEmpty", "Non-empty lines"], ["empty", "Empty lines"], ["longest", "Longest line"], ["average", "Average line length"]]),
  "sentence-counter": analyzer("sentence-counter", textOperations.sentenceCounter, [["sentences", "Sentences"], ["words", "Words"], ["average", "Average words per sentence"]]),
  "paragraph-counter": analyzer("paragraph-counter", textOperations.paragraphCounter, [["paragraphs", "Paragraphs"], ["words", "Words"], ["sentences", "Sentences"], ["average", "Average words per paragraph"]]),
  "url-encoder": transformer("url-encoder", textOperations.urlEncode, [select("mode", "Encoding mode", modes([["component", "URL component"], ["full", "Full URL"]]), "component")]),
  "url-decoder": transformer("url-decoder", textOperations.urlDecode, [select("mode", "Decoding mode", modes([["component", "URL component"], ["full", "Full URL"]]), "component")]),
  "base64-encoder": transformer("base64-encoder", textOperations.base64Encode),
  "base64-decoder": transformer("base64-decoder", textOperations.base64Decode),
  "html-encoder": transformer("html-encoder", textOperations.htmlEncode),
  "html-decoder": transformer("html-decoder", textOperations.htmlDecode),
  "rot13-converter": transformer("rot13-converter", textOperations.rot13),
  "lorem-ipsum-generator": { id: "lorem-ipsum-generator", kind: "generator", generate: generateLorem, controls: [select("unit", "Generate", modes([["paragraphs", "Paragraphs"], ["sentences", "Sentences"], ["words", "Words"]]), "paragraphs"), { id: "amount", label: "Amount", component: "field.input", type: "number", value: "3", min: 1, max: 50 }], actions: ["generate", "copy", "download"] }
});
