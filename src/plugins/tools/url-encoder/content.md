---
title: URL Encoder
shortDescription: Percent-encode Unicode text as a component or full URL.
seoTitle: URL Encoder – Encode UTF-8 Components or Full URLs
seoDescription: Percent-encode UTF-8 text safely with separate URL component and full URL modes.
---

## Encode a component or preserve URL separators

Component mode uses `encodeURIComponent`, escaping characters that would otherwise act as query or path syntax. Full URL mode uses `encodeURI`, preserving structural characters such as `:`, `/`, `?`, `#` and `&` while encoding Unicode and unsafe text.

Encode `coffee & tea` as a query-parameter value and component mode produces `coffee%20%26%20tea`, preventing the ampersand from starting another parameter. For an already assembled URL, full mode keeps its separators readable.

Percent encoding represents UTF-8 bytes; it is neither encryption nor access control. Applying the tool twice encodes existing percent signs, so `%20` can become `%2520`. Full mode is not appropriate for an untrusted parameter value because it deliberately leaves delimiters intact.

Use [URL Decoder](../../url-decoder/) for the reverse operation, or [URL Parser](../../url-parser/) to inspect a complete absolute address.
