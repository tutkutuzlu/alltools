---
title: Whitespace Cleaner
shortDescription: Normalize repeated spaces, tabs and blank lines.
seoTitle: Whitespace Cleaner – Remove Extra Spaces and Tabs
seoDescription: Clean extra spaces, trailing whitespace, tabs and repeated blank lines with an instant preview.
---

## Normalize several kinds of whitespace at once

Trailing spaces and tabs are removed from every line. Tabs optionally become one space, then every run of two or more ordinary spaces becomes one. When blank-line reduction is enabled, three or more newline-separated blank rows are reduced so only one blank line remains. Finally, whitespace at the beginning and end of the whole text is trimmed.

This helps clean prose copied from a PDF or CMS where spacing is inconsistent. A tab-indented code sample, however, loses indentation when tab conversion is enabled, and repeated spaces used for alignment are always collapsed even if the Tabs option is off.

Single line breaks are preserved, and a normal paragraph separator remains. The algorithm does not normalize non-breaking spaces or every Unicode spacing character because its internal collapse targets ordinary spaces and tabs.

Choose [Remove Empty Lines](../../remove-empty-lines/) when all blank rows should disappear while populated-line spacing remains untouched. Use [Case Converter](../../case-converter/) only after cleanup if letter case also needs changing.
