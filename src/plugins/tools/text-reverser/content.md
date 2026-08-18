---
title: Text Reverser
shortDescription: Reverse characters, words or line order in several ways.
seoTitle: Text Reverser Online – Reverse Words, Lines or Characters
seoDescription: Reverse an entire text, each line, line order or word order without uploading your content.
---

## Choose what “reverse” applies to

Reverse all characters iterates Unicode code points across the entire text, so line breaks move too. “Characters in each line” preserves line order and separators but reverses each line independently. “Line order” moves complete lines, while “word order” trims the input, splits on any whitespace and rejoins tokens with single spaces.

For a three-line checklist, line-order mode puts the last item first without changing its characters. Word mode turns `one   two\nthree` into `three two one`, deliberately discarding the original spacing and line break.

Code-point reversal is safer than reversing UTF-16 units but can still separate combining marks or multi-code-point emoji sequences, so visible graphemes are not guaranteed to stay intact. None of the modes understands sentence grammar or right-to-left text layout.

Use [Text Sorter](../../text-sorter/) for ordered rather than reversed lines, or [ROT13 Converter](../../rot13-converter/) for reversible ASCII-letter substitution.
