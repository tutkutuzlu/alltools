---
title: JSON String Escape
shortDescription: Escape or unescape text for use inside a JSON string.
seoTitle: JSON String Escape and Unescape Online
seoDescription: Escape quotes, control characters and backslashes or decode a JSON-escaped string.
---

## Prepare string contents, not a complete JSON document

Escape mode applies JSON string serialization and removes the surrounding quotes. A line break becomes `\n`, a quote becomes `\"`, and backslashes are escaped. For text `She said "yes"`, the result can be inserted between JSON quotes without terminating the string.

Unescape mode wraps the supplied escape sequence as a JSON string and parses it, recovering control characters and Unicode escapes accepted by `JSON.parse`. Invalid escape syntax is rejected.

The tool operates on the contents of one string. It does not format or validate an object, add the outer quotation marks, or URL/HTML-encode the value. Repeated escape operations add another layer, so double-escaping can produce visible backslashes in the receiving application. Unescape behavior around already quoted input can also differ from parsing a complete JSON document.

Use [JSON Formatter](../../json-formatter/) for whole documents, or the Text Tools [HTML Encoder](../../html-encoder/) when the destination is HTML rather than JSON syntax.
