---
title: MIME Type Lookup
shortDescription: Find a common MIME type from an extension or vice versa.
seoTitle: MIME Type Lookup Online
seoDescription: Look up common file extensions and Internet media types directly in your browser.
---

## Map common extensions and media types

Enter an extension with or without its leading dot to receive the stored MIME type, or enter an exact MIME type to list matching extensions. `json` returns `application/json`; `image/jpeg` returns both `.jpg` and `.jpeg`.

The lookup is case-insensitive and covers a curated table of 30 common web, document, image, audio, video, archive, font and WebAssembly extensions. It does not inspect file bytes, names with multiple suffixes or server response headers.

MIME mappings are conventions rather than proof of content. A server can configure another type, some formats have aliases, and an extension can be misleading. The list is not the complete IANA registry and does not include MIME parameters such as `charset=utf-8`.

Use this reference when setting a familiar `Content-Type` or reviewing a static asset configuration. [HTTP Status Code Lookup](../../http-status-code-lookup/) covers response status rather than representation metadata.
