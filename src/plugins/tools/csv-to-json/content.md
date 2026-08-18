---
title: CSV to JSON Converter
shortDescription: Parse CSV with quoted fields and convert rows to JSON.
seoTitle: CSV to JSON Converter Online
seoDescription: Convert comma, semicolon, tab or pipe-delimited CSV into structured JSON.
---

## Use the first row as JSON property names

Select comma, semicolon, tab or pipe as the delimiter. The parser supports quoted fields, embedded delimiters, line breaks inside quotes and doubled quotes. The first row becomes the header; each later non-empty row becomes an object whose values are strings.

For `name,city\n"Ada","London"`, output is a two-space-indented array containing `{ "name": "Ada", "city": "London" }`. Duplicate header names are rejected. Short rows receive empty strings for missing columns, while extra fields beyond the header are ignored.

The implementation is a focused parser rather than a complete CSV dialect detector. It does not infer delimiter, encoding or types, and a quote is recognized as opening syntax only at the start of a field. Blank-only rows are discarded.

Choose [JSON to CSV Converter](../../json-to-csv/) when starting with object records, or [JSON Validator](../../json-validator/) to inspect the generated document afterward.
