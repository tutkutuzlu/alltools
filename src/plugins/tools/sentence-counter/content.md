---
title: Sentence Counter
shortDescription: Count sentences and calculate average sentence length.
seoTitle: Sentence Counter – Count Sentences and Average Length
seoDescription: Count sentences and words, then calculate average words per sentence with abbreviation awareness.
---

## A punctuation-based sentence estimate

Segments end at one or more `.`, `!`, `?` or ellipsis characters, or at the remaining end of text. The runtime temporarily protects a small abbreviation list including Mr., Dr., Prof., etc., e.g. and i.e. to avoid some obvious false splits.

Words use the Text Tools Unicode letter/number pattern, with internal apostrophes and hyphens allowed. Average words per sentence is shown to one decimal. `Dr. Lee arrived. Did she stay?` is counted as two sentences rather than three.

This is an approximation, not linguistic parsing. Initials, decimal numbers, unfamiliar abbreviations, headings and punctuation-free fragments can produce surprising results. A final fragment without terminal punctuation still counts as a sentence when it contains text.

Use [Paragraph Counter](../../paragraph-counter/) for blank-line-separated blocks or [Word Counter](../../word-counter/) for reading-time context.
