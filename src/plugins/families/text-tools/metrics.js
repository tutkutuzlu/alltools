const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu;
const SENTENCE_PATTERN = /[^.!?…]+(?:[.!?…]+|$)/gu;

export function analyzeText(value) {
  const text = String(value ?? "");
  const trimmed = text.trim();
  const words = trimmed.match(WORD_PATTERN) ?? [];
  const sentences = trimmed
    ? (trimmed.match(SENTENCE_PATTERN) ?? []).filter((item) => item.trim()).length
    : 0;

  return {
    words: words.length,
    characters: [...text].length,
    charactersWithoutSpaces: [...text].filter((character) => !/\s/u.test(character)).length,
    sentences,
    readingTimeMinutes: words.length === 0 ? 0 : Math.max(1, Math.ceil(words.length / 200))
  };
}
