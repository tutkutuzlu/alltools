---
title: Regex Tester
shortDescription: Test a JavaScript regular expression against sample text.
seoTitle: Regex Tester Online – Test JavaScript Patterns
seoDescription: Test JavaScript regex patterns and flags, list matches and inspect their positions.
---

## Run JavaScript RegExp against sample text

Enter pattern source without surrounding slashes and any flags accepted by the current JavaScript engine, such as `g`, `i`, `m`, `s`, `u` or `y`. The runtime creates `RegExp` directly. If `g` is absent, it adds global matching for the test so every match can be listed.

With pattern `\b\w{4,}\b`, flags `gi` and text `Test small tools`, output lists `Test`, `small` and `tools` with their zero-based indexes. Metrics show count, first index and normalized `/pattern/flags`.

This is JavaScript regex, not PCRE: unsupported constructs depend on the browser engine. Backslashes often need extra escaping when copied from a programming-language string literal, because the field expects regex source rather than the surrounding string syntax.

Pathological patterns can trigger heavy backtracking and freeze the page on large input; no timeout or worker interruption is implemented. Use focused sample text and review performance before deploying a pattern.
