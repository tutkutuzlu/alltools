---
title: Base64 Decoder
shortDescription: Decode valid Base64 back into readable UTF-8 text.
seoTitle: Base64 Decoder – Decode UTF-8 Text Safely
seoDescription: Decode Base64 into Unicode text in your browser with validation and understandable errors.
---

## Require standard Base64 and valid UTF-8

Input is trimmed, checked against the standard Base64 alphabet and required to have a length divisible by four with at most two trailing `=` characters. After `atob`, the bytes are decoded with a fatal UTF-8 decoder, so invalid UTF-8 is rejected rather than replaced.

For example, `SGVsbG8sIHdvcmxkIQ==` becomes `Hello, world!`. This is useful when inspecting a text payload known to have been encoded from UTF-8.

Unpadded Base64, Base64URL using `-` or `_`, embedded whitespace and arbitrary binary that is not UTF-8 are unsupported. Decoding also does not verify the origin or safety of the resulting text; Base64 carries no authenticity or encryption.

Choose [Base64 Encoder](../../base64-encoder/) for the exact inverse format. If the source is a JWT segment, [JWT Decoder](../../jwt-decoder/) understands Base64URL and token structure separately.
