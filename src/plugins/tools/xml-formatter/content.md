---
title: XML Formatter
shortDescription: Validate matching XML tags and add readable indentation.
seoTitle: XML Formatter Online – Beautify XML
seoDescription: Format XML online with tag validation and consistent two-space indentation.
---

## Indent markup after a matching-tag check

The formatter tokenizes tags, comments, CDATA and text, checks opening and closing tag names with a stack, then places each trimmed token on a line with two-space nesting. Self-closing tags, declarations and `<!...>` tokens do not increase depth.

`<catalog><item id="1">Book</item></catalog>` becomes a visibly nested catalog, useful when inspecting a compact service response. A mismatched closing tag or unclosed element is rejected.

This is not a standards-complete XML parser. The check does not validate attributes, namespaces, entity references, document type rules or the requirement for exactly one root element. Text is trimmed and tokenized, so whitespace significant to mixed-content XML may change.

Choose it for quick structural inspection of simple XML. [XML Minifier](../../xml-minifier/) removes inter-tag spacing and comments from similarly checked markup.
