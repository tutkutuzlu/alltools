---
title: URL Decoder
shortDescription: Decode percent-encoded components or complete URLs.
seoTitle: URL Decoder – Decode Percent-Encoded UTF-8 Text
seoDescription: Decode UTF-8 percent sequences in URL components or full URLs with clear error feedback.
---

## Decode with component-aware rules

Component mode runs `decodeURIComponent` and decodes all valid percent escapes in the supplied value. Full URL mode uses `decodeURI`, which preserves escapes for characters that carry URL structure when decoding them could change the address.

`coffee%20%26%20tea` becomes `coffee & tea` in component mode. This is useful when debugging a captured query value or log entry. A malformed sequence such as `%E0%A4` produces a validation error instead of replacement text because it is not valid encoded UTF-8.

The operation does not treat `+` as a space; that convention belongs to form-style query parsing. Decoding untrusted text can reveal delimiters or markup, and decoding twice can transform deliberately escaped percent sequences, so use one layer that matches the producer.

[URL Encoder](../../url-encoder/) creates percent escapes. [Query String Parser](../../query-string-parser/) applies form-query decoding and preserves repeated keys.
