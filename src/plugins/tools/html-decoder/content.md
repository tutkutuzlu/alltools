---
title: HTML Decoder
shortDescription: Convert known HTML entities back to plain text safely.
seoTitle: HTML Decoder – Convert Entities to Plain Text
seoDescription: Decode named and numeric HTML entities without executing or injecting the resulting markup.
---

## Decode a focused entity set as text

The decoder recognizes `amp`, `lt`, `gt`, `quot`, `apos`, `#39`, decimal numeric references and hexadecimal numeric references, all terminated by semicolons. It replaces them directly in the result textarea; it does not insert the result into the page as HTML.

`&lt;p&gt;Tom &amp; Ada&lt;/p&gt;` becomes `<p>Tom & Ada</p>`, useful when reading escaped API or CMS output. Unknown named entities such as `&nbsp;` remain unchanged because the tool is not backed by the browser's full named-entity table.

Numeric code points are passed to `String.fromCodePoint`. Out-of-range numeric entities can raise a runtime error rather than a customized validation message. Decoding twice may expose a second encoded layer, so confirm how many layers the source intentionally uses.

[HTML Encoder](../../html-encoder/) produces the supported core entities. Decoded markup is still untrusted text and should not be rendered as HTML without appropriate sanitization.
