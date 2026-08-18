---
title: Remove Duplicate Lines
shortDescription: Delete repeated lines while preserving their original order.
seoTitle: Remove Duplicate Lines Online – Preserve Line Order
seoDescription: Remove repeated text lines, choose case sensitivity and keep or discard empty lines privately.
---

## Keep the first exact line occurrence

Lines are split on LF or CRLF and processed from top to bottom. The first nonblank occurrence stays in place; later matches are removed. By default comparison lowercases with the English locale, so `Alpha` and `alpha` collide. Case-sensitive mode keeps them separate.

No trimming or whitespace normalization is applied to nonblank lines. `item` and `item ` are different keys, which is useful when exact records matter but can surprise users cleaning messy pasted data. Blank or whitespace-only lines are never deduplicated; Preserve empty lines keeps every one, while disabling it removes all of them.

Use the tool to clean a keyword export while retaining the original priority order. The “Duplicates removed” metric counts repeated nonblank lines, not discarded empty rows.

Run [Whitespace Cleaner](../../whitespace-cleaner/) first if insignificant spacing should be normalized, or [Text Sorter](../../text-sorter/) afterward when order should change.
