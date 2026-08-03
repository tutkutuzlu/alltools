const words = (text) => String(text ?? "").trim().match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? [];
const lines = (text) => String(text ?? "").split(/\r?\n/);
const titleWord = (word) => word ? word[0].toLocaleUpperCase("en") + word.slice(1).toLocaleLowerCase("en") : word;

export function sentenceSegments(value) {
  const protectedText = String(value ?? "").replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc)\./gi, (match) => match.replace(".", "∯")).replace(/\b(e\.g|i\.e)\./gi, (match) => match.replaceAll(".", "∯"));
  return (protectedText.match(/[^.!?…]+(?:[.!?…]+|$)/gu) ?? []).map((item) => item.replaceAll("∯", ".").trim()).filter(Boolean);
}

export const textOperations = Object.freeze({
  characterCounter(text) { return { characters: [...text].length, charactersWithoutSpaces: [...text].filter((c) => !/\s/u.test(c)).length, words: words(text).length, lines: text === "" ? 0 : lines(text).length }; },
  caseConverter(text, { mode = "upper" } = {}) {
    if (mode === "upper") return text.toLocaleUpperCase("en");
    if (mode === "lower") return text.toLocaleLowerCase("en");
    if (mode === "invert") return [...text].map((c) => c === c.toLocaleUpperCase("en") ? c.toLocaleLowerCase("en") : c.toLocaleUpperCase("en")).join("");
    if (mode === "sentence") return text.toLocaleLowerCase("en").replace(/(^|[.!?]\s+)(\p{L})/gu, (_, prefix, letter) => prefix + letter.toLocaleUpperCase("en"));
    if (mode === "title") { const minor = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to"]); let index = 0; return text.replace(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu, (word) => { const lower = word.toLocaleLowerCase("en"); return index++ > 0 && minor.has(lower) ? lower : titleWord(word); }); }
    return text.replace(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu, (word) => titleWord(word));
  },
  removeDuplicateLines(text, { caseSensitive = false, preserveEmpty = true } = {}) { const seen = new Set(); let removed = 0; const output = lines(text).filter((line) => { if (!preserveEmpty && !line.trim()) return false; const key = caseSensitive ? line : line.toLocaleLowerCase("en"); if (seen.has(key) && line.trim()) { removed++; return false; } if (line.trim()) seen.add(key); return true; }); return { output: output.join("\n"), removed }; },
  removeEmptyLines(text, { whitespaceOnly = true } = {}) { const output = lines(text).filter((line) => whitespaceOnly ? line.trim().length > 0 : line.length > 0); return { output: output.join("\n"), lines: text ? output.length : 0 }; },
  sortText(text, { mode = "az", caseSensitive = false } = {}) { const collator = new Intl.Collator("en", { sensitivity: caseSensitive ? "variant" : "base", numeric: mode === "numeric" }); return lines(text).sort((a, b) => mode === "length-asc" ? a.length - b.length : mode === "length-desc" ? b.length - a.length : mode === "za" ? collator.compare(b, a) : collator.compare(a, b)).join("\n"); },
  reverseText(text, { mode = "all" } = {}) { const reverse = (value) => [...value].reverse().join(""); if (mode === "lines") return lines(text).reverse().join("\n"); if (mode === "line-characters") return lines(text).map(reverse).join("\n"); if (mode === "words") return text.trim().split(/\s+/u).reverse().join(" "); return reverse(text); },
  cleanWhitespace(text, { tabs = true, blankLines = true } = {}) { let output = text.replace(/[ \t]+$/gm, ""); if (tabs) output = output.replace(/\t/g, " "); output = output.replace(/ {2,}/g, " "); if (blankLines) output = output.replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, "\n\n"); return output.trim(); },
  lineCounter(text) { const all = text === "" ? [] : lines(text); const lengths = all.map((line) => [...line].length); return { total: all.length, nonEmpty: all.filter((line) => line.trim()).length, empty: all.filter((line) => !line.trim()).length, longest: lengths.length ? Math.max(...lengths) : 0, average: lengths.length ? (lengths.reduce((a, b) => a + b, 0) / lengths.length).toFixed(1) : "0.0" }; },
  sentenceCounter(text) { const segments = sentenceSegments(text); const count = segments.length; const wordCount = words(text).length; return { sentences: count, words: wordCount, average: count ? (wordCount / count).toFixed(1) : "0.0" }; },
  paragraphCounter(text) { const paragraphs = String(text ?? "").trim() ? String(text).trim().split(/\n\s*\n+/u).filter((p) => p.trim()) : []; const wordCount = words(text).length; return { paragraphs: paragraphs.length, words: wordCount, sentences: sentenceSegments(text).length, average: paragraphs.length ? (wordCount / paragraphs.length).toFixed(1) : "0.0" }; },
  urlEncode(text, { mode = "component" } = {}) { return mode === "full" ? encodeURI(text) : encodeURIComponent(text); },
  urlDecode(text, { mode = "component" } = {}) { try { return mode === "full" ? decodeURI(text) : decodeURIComponent(text); } catch { throw new Error("This value is not valid percent-encoded text."); } },
  base64Encode(text) { const bytes = new TextEncoder().encode(text); let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary); },
  base64Decode(text) { try { if (text && (!/^[A-Za-z0-9+/]*={0,2}$/.test(text.trim()) || text.trim().length % 4 !== 0)) throw new Error(); const binary = atob(text.trim()); return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, (c) => c.charCodeAt(0))); } catch { throw new Error("Enter valid Base64 encoded UTF-8 text."); } },
  htmlEncode(text) { return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]); },
  htmlDecode(text) { const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'" }; return text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|#39);/gi, (_, entity) => entity[0] === "#" ? String.fromCodePoint(entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10)) : named[entity.toLowerCase()]); },
  rot13(text) { return text.replace(/[A-Za-z]/g, (c) => String.fromCharCode((c <= "Z" ? 65 : 97) + (c.charCodeAt(0) - (c <= "Z" ? 65 : 97) + 13) % 26)); }
});

const loremWords = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat".split(" ");
const makeWords = (count, offset = 0) => Array.from({ length: count }, (_, index) => loremWords[(index + offset) % loremWords.length]);
const makeSentence = (count, offset = 0) => { const value = makeWords(count, offset).join(" "); return titleWord(value) + "."; };
export function generateLorem(amount, unit = "paragraphs") { const safe = Math.max(1, Math.min(unit === "words" ? 500 : 50, Number(amount) || 1)); if (unit === "words") return makeWords(safe).join(" "); if (unit === "sentences") return Array.from({ length: safe }, (_, i) => makeSentence(10, i * 7)).join(" "); return Array.from({ length: safe }, (_, i) => Array.from({ length: 4 }, (_, j) => makeSentence(12, i * 11 + j * 5)).join(" ")).join("\n\n"); }
