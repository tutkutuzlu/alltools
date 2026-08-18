---
title: JSON to CSV Converter
shortDescription: Convert an object or array of objects into CSV.
seoTitle: JSON to CSV Converter Online
seoDescription: Convert JSON arrays and objects to properly escaped CSV directly in your browser.
---

## Flatten top-level object rows into columns

The converter accepts one JSON object or an array of objects. It builds headers from the union of top-level keys in first-seen order, then writes one comma-delimited row per object. Missing values become empty fields; strings containing commas, quotes or line breaks are quoted and internal quotes are doubled.

An array such as `[{'name':'Ada'}]` is not valid JSON because of single quotes; use `[{"name":"Ada","team":"Core"},{"name":"Lin"}]`. The CSV has `name,team` headers and leaves Lin's missing team cell empty.

Nested objects and arrays are not expanded into multiple columns: they are serialized as JSON text inside a cell. Primitive rows and nested arrays as rows are rejected. CSV has no native type information, so numbers, booleans and null-like empty cells may not round-trip with their original types.

Use [CSV to JSON Converter](../../csv-to-json/) for the opposite direction, noting its rows become strings.
