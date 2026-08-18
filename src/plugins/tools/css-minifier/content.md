---
title: CSS Minifier
shortDescription: Remove comments and unnecessary CSS whitespace.
seoTitle: CSS Minifier Online – Compress CSS
seoDescription: Minify CSS online by removing comments, extra whitespace and redundant semicolons.
---

## Compact common CSS syntax

The minifier removes `/* ... */` comments, collapses whitespace, removes spaces around braces, colons, separators and combinators, then drops a final semicolon before `}`. A rule such as `.card { color: red; margin: 0; }` becomes `.card{color:red;margin:0}`.

This can reduce a simple snippet for an example, embedded style block or manual comparison. It does not rename identifiers, merge rules, optimize values or produce compression statistics.

The implementation uses regular expressions rather than a CSS parser. Comment markers or punctuation inside strings, URLs and custom properties can be altered, and modern syntax is not semantically validated. Do not assume output equivalence for complex production stylesheets without running project-specific tests.

Use [CSS Formatter](../../css-formatter/) to inspect straightforward compact rules. [HTML Minifier](../../html-minifier/) handles surrounding markup separately and has its own whitespace risks.
