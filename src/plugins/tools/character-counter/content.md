---
title: Character Counter
shortDescription: Measure characters, words and lines while you type.
seoTitle: Free Character Counter – Count Letters, Spaces and Lines
seoDescription: Count characters with and without spaces, words and lines instantly in your browser.
---

## What the four measurements include

Characters are counted as JavaScript Unicode code points, so an emoji represented by one code point counts once; a visible grapheme assembled from multiple code points may count more than once. “Characters without spaces” removes every Unicode whitespace match, including spaces, tabs and line breaks—not punctuation.

Words are runs of Unicode letters or numbers with internal apostrophes or hyphens. `don't`, `editor’s` and `well-made` each count as one word. Lines split on LF or CRLF; an empty editor reports zero lines, while a trailing newline creates a final empty line.

Use this tool to check a social post, database field or localization string where raw character length matters. For `Hello, world!`, punctuation contributes to 13 characters but the word metric is two.

The character result is not a byte count and may differ from user-perceived glyphs. [Line Counter](../../line-counter/) adds empty-line and line-length detail; [Word Counter](../../word-counter/) adds sentence and reading-time estimates.
