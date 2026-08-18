---
title: XML Minifier
shortDescription: Remove comments and spacing between validated XML tags.
seoTitle: XML Minifier Online – Compact XML
seoDescription: Minify well-formed XML by removing comments and unnecessary inter-tag whitespace.
---

## Remove comments and gaps between tags

After the same lightweight matching-tag validation used by XML Formatter, this tool deletes XML comments, collapses whitespace occurring strictly between `>` and `<`, and trims the document edges. Text content inside elements is otherwise retained.

For `<root>\n  <item>value</item>\n</root>`, the result is `<root><item>value</item></root>`. This can make a simple fixture or request payload easier to store and compare.

Comment removal is destructive, and the operation is not an XML-aware production optimizer. It does not validate entities, namespaces, attributes or schema rules. CDATA is preserved by the comment regex, but whitespace in mixed-content documents can be meaningful even when it appears near tags; review such documents carefully.

Use [XML Formatter](../../xml-formatter/) before editing or debugging. For HTML, use its dedicated minifier because HTML void elements and conditional comments have different rules.
