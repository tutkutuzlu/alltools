---
title: Remove Empty Lines
shortDescription: Strip blank or whitespace-only lines from multiline text.
seoTitle: Remove Empty Lines Online – Clean Blank Rows
seoDescription: Remove empty and whitespace-only lines from text and see the resulting line count instantly.
---

## Remove blank rows without changing populated lines

With the default option, a line is removed when trimming it leaves no characters, so rows containing only spaces or tabs disappear. Disable “Remove whitespace-only lines” to remove only zero-length lines and retain rows that contain whitespace.

Remaining lines are joined with LF in their original order. Their leading spaces, internal spacing and trailing spaces are not edited. A list such as `alpha`, blank row, `beta` becomes two adjacent lines, and the result metric reports two.

This is useful after copying spreadsheet or terminal output that contains unwanted separators. It does not collapse duplicate populated records or reduce multiple spaces inside a line. An empty input produces an empty result and zero result lines.

Choose [Remove Duplicate Lines](../../remove-duplicate-lines/) for repeated values. [Whitespace Cleaner](../../whitespace-cleaner/) performs broader trimming and spacing normalization, so use it only when those additional changes are intended.
