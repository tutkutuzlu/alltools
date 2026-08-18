---
title: Line Counter
shortDescription: Count total, empty and non-empty lines plus line length.
seoTitle: Free Line Counter – Count Empty and Non-Empty Lines
seoDescription: Count lines, empty rows, longest line and average line length locally in your browser.
---

## Inspect row structure and length

The counter splits on LF or CRLF. A completely empty editor has zero lines; otherwise a trailing newline creates a final empty line. A line is considered empty when trimming leaves nothing, so spaces and tabs alone count as an empty row.

Longest and average line length count Unicode code points, including whitespace and punctuation. Average includes empty lines and is displayed with one decimal place. In `alpha\n\nbeta`, there are three total lines, two non-empty lines, one empty line and a longest length of five.

Use this for generated lists, configuration snippets or data exports where record count and unusually long rows matter. It does not detect visual wrapping: a long line shown across several screen rows remains one logical line.

[Character Counter](../../character-counter/) provides aggregate characters and words. [Remove Empty Lines](../../remove-empty-lines/) changes the text rather than only measuring it.
