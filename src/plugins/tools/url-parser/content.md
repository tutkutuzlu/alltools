---
title: URL Parser
shortDescription: Break a complete URL into its standard components.
seoTitle: URL Parser Online – Inspect URL Components
seoDescription: Parse a URL into protocol, host, port, path, query, fragment and origin fields.
---

## Inspect the browser's normalized URL components

The parser requires a complete absolute URL such as `https://example.com:8443/docs?q=test#install`. It uses the browser `URL` class and returns protocol, username, whether a password is present, hostname, port, pathname, search, hash and origin as JSON.

This is useful when debugging whether a port, encoded path or fragment is in the component you expect. The browser may normalize details such as default ports and percent-encoding. Password text itself is deliberately replaced with `(present)` in output.

Relative paths like `/docs`, bare domains and malformed URLs are rejected because no base URL is supplied. Parsing does not fetch the address, test DNS, prove that the destination is safe or decode query parameters into an object.

Use [Query String Parser](../../query-string-parser/) for parameter values, or the Text Tools [URL Encoder](../../url-encoder/) when preparing one component for transport.
