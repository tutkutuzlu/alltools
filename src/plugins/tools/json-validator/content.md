---
title: JSON Validator
shortDescription: Check JSON syntax and inspect its root structure.
seoTitle: JSON Validator Online – Check JSON Syntax
seoDescription: Validate JSON syntax online and inspect root type, entry count and nesting depth.
---

## Syntax status plus four structural metrics

The validator attempts `JSON.parse` and reports Valid JSON, root type, root entry count and maximum nesting depth. An array root is labeled `array`, `null` is distinguished from objects, and entry count is the number of top-level keys or array positions.

For `{"user":{"id":7},"roles":["editor"]}`, the root is an object with two entries and nested depth. A malformed comma or quote returns “No” with neutral metrics; the current analyzer does not expose the parser's error position or message.

This is syntax validation only. It does not apply JSON Schema, verify required properties, constrain formats or detect domain errors. Valid JSON can still be invalid for the application receiving it, and duplicate keys may parse with only the last value retained.

Choose [JSON Formatter](../../json-formatter/) when you also need readable output, or use [JSON to CSV Converter](../../json-to-csv/) after confirming that the root has the object structure that converter expects.
