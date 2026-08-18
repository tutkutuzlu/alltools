---
title: Query String Parser
shortDescription: Decode URL query parameters into structured JSON.
seoTitle: Query String Parser Online
seoDescription: Parse query strings and full URLs into JSON while preserving repeated parameter values.
---

## Turn parameters into a JSON object

Input may be a raw query, a leading `?` query or a full URL. Text before the first question mark and any fragment after `#` are removed, then `URLSearchParams` decodes the pairs. Repeated keys become arrays in encounter order.

`?tag=web&tag=tools&empty=` produces a `tag` array and an empty string for `empty`. Percent escapes are decoded and `+` follows form-query behavior by becoming a space.

All values remain strings; numbers, booleans and nested bracket conventions are not inferred. A key without `=` receives an empty value. When duplicate keys occur, the shape changes from a string to an array, which consuming code must handle.

Choose this parser when diagnosing a link or form submission. [URL Parser](../../url-parser/) exposes the untouched `search` component alongside the rest of an absolute URL, while [JSON String Escape](../../json-string-escape/) solves a different embedding problem.
