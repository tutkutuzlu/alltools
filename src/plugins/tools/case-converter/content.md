---
title: Case Converter
shortDescription: Switch text between uppercase, lowercase and five other case styles.
seoTitle: Free Case Converter – Uppercase, Lowercase and Title Case
seoDescription: Convert text to uppercase, lowercase, title case, sentence case, capitalized words or inverted case.
---

## Six English-locale case algorithms

Uppercase and lowercase apply the browser's English-locale case mapping. Invert tests each code point against its uppercase form and swaps it; characters without case remain unchanged. Capitalize Each Word finds Unicode letter/number words, including internal apostrophes or hyphens, then uppercases the first code point and lowercases the rest.

Title Case uses the same word pattern but leaves a small list of English minor words lowercase after the first matched word. It is a simple algorithm, not Chicago, APA or another editorial style guide. Sentence case lowercases everything, then capitalizes a letter at the start or after `.`, `!` or `?` followed by whitespace.

`THE RISE AND FALL OF APIs` becomes `The Rise and Fall of Apis` in Title Case, illustrating that acronyms are not preserved. Punctuation and original spacing are otherwise retained.

Choose [Whitespace Cleaner](../../whitespace-cleaner/) separately if copied text also has spacing problems.
