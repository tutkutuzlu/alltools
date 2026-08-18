---
title: HTML Minifier
shortDescription: Compact HTML by removing comments and layout whitespace.
seoTitle: HTML Minifier Online – Compact Markup
seoDescription: Minify HTML online while retaining conditional comments and element content.
---

## Regex-based compaction for simple markup

The operation removes ordinary HTML comments while retaining comments that begin with `[if`, deletes whitespace between adjacent tags, collapses every run of two or more whitespace characters to one space, and trims the result.

For a small static fragment with indentation between elements, the output becomes a compact single line. Conditional-comment preservation is intended for legacy markup that uses `<!--[if ...]>` syntax.

Because this is not DOM-aware, it can change meaningful whitespace in text and in `pre`, `textarea`, `script` or `style` content. Comment-like text inside scripts may also be unsafe. Treat the result as a preview for simple snippets, not a substitute for a production minifier with parser-level language awareness and tests.

[HTML Formatter](../../html-formatter/) makes uncomplicated nesting readable again. Use [CSS Minifier](../../css-minifier/) separately for standalone stylesheets.
