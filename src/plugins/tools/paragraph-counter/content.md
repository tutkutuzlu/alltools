---
title: Paragraph Counter
shortDescription: Measure paragraphs, sentences and words in prose.
seoTitle: Paragraph Counter – Count Paragraphs, Words and Sentences
seoDescription: Count paragraphs, words and sentences and see average words per paragraph instantly.
---

## Paragraphs are separated by blank lines

After trimming the document edges, the runtime splits paragraphs where a newline is followed by optional whitespace and another newline. Wrapped lines without an intervening blank row remain in the same paragraph. Whitespace-only blocks are ignored.

The page also reports words, punctuation-based sentence segments and average words per paragraph. A draft with two prose blocks separated by one blank line reports two paragraphs even if each block wraps across several editor lines.

This definition fits plain-text prose but not every publishing format. Indented paragraphs without blank separators count as one, while list items separated by blank lines count as separate paragraphs. Sentence totals inherit the heuristic limitations of Sentence Counter.

Choose [Line Counter](../../line-counter/) when every newline matters as a record boundary. [Sentence Counter](../../sentence-counter/) explains the abbreviation-aware sentence estimate in more detail.
