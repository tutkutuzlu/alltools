---
title: HTML Formatter
shortDescription: Indent HTML markup for easier inspection and editing.
seoTitle: HTML Formatter Online – Beautify Markup
seoDescription: Format HTML markup online with readable nesting and support for void elements.
---

## Apply heuristic indentation to HTML tokens

The formatter splits comments, tags and text, then adds two spaces per open element. Known HTML void elements such as `img`, `meta`, `input` and `br` do not increase nesting. It does not require valid HTML before producing output.

A compact card like `<article><h2>Title</h2><p>Copy</p></article>` becomes one trimmed token per indented line, making tag nesting easier to scan during debugging.

This is not a browser HTML parser or DOM serializer. It does not repair malformed markup, understand optional closing tags, preserve original text-node whitespace or protect formatting inside `pre`, `textarea`, `script` and `style`. Inline phrasing content may therefore become visually awkward or semantically whitespace-sensitive.

Use it for quick inspection of straightforward snippets, not as an authoritative rewrite of a production template. [HTML Minifier](../../html-minifier/) performs the opposite heuristic compaction.
