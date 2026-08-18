---
title: Text Sorter
shortDescription: Sort lines alphabetically, numerically or by length.
seoTitle: Text Sorter Online – Sort Lines A–Z, Numeric or by Length
seoDescription: Sort text lines A–Z, Z–A, numerically or by length with optional case sensitivity.
---

## Reorder complete lines with an English collator

A–Z and Z–A use `Intl.Collator("en")`; comparison is case-insensitive by default and variant-sensitive when selected. Numeric mode uses the same collator with numeric comparison, so `item2` sorts before `item10`. Length modes compare JavaScript string length in UTF-16 code units.

Every line participates, including empty lines, and duplicates are retained. Sorting `10`, `2`, `1` numerically yields `1`, `2`, `10`; ordinary A–Z lexical ordering may differ. The implementation relies on the JavaScript engine's stable sort for ties.

This is not dictionary or natural-language ordering for arbitrary locales. Accents and punctuation follow the English collator, and length can differ from visible grapheme count for emoji or combined characters.

Use [Remove Duplicate Lines](../../remove-duplicate-lines/) when uniqueness is also required. [Line Counter](../../line-counter/) can inspect the resulting list without reordering it.
