---
title: HTML Encoder
shortDescription: Escape HTML-sensitive characters as safe entities.
seoTitle: HTML Encoder – Escape HTML Characters Safely
seoDescription: Encode ampersands, brackets, quotes and apostrophes as HTML entities without rendering markup.
---

## Escape five HTML-sensitive characters

The operation replaces `&`, `<`, `>`, double quote and apostrophe with `&amp;`, `&lt;`, `&gt;`, `&quot;` and `&#39;`. Every other character, including Unicode text and line breaks, is left unchanged.

Encoding `<strong title="note">Ada & Lin</strong>` makes the markup visible as text rather than interpretable tags. This is useful for documentation examples or for inspecting the exact characters a template needs to escape.

Running the encoder twice also escapes the ampersands in existing entities, producing values such as `&amp;lt;`. The result is not a complete security policy: safe HTML output depends on context, and JavaScript, URL and CSS contexts require different escaping. The tool does not sanitize or selectively allow markup.

Use [HTML Decoder](../../html-decoder/) to reverse supported entities. [JSON String Escape](../../json-string-escape/) targets JSON string syntax instead.
