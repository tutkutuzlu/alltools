---
title: Base64 Encoder
shortDescription: Convert Unicode text to Base64 entirely in your browser.
seoTitle: Base64 Encoder – Encode Unicode Text Online
seoDescription: Encode Unicode and UTF-8 text as Base64 locally without uploading the source content.
---

## Encode UTF-8 bytes as Base64

The runtime first converts the text to UTF-8 with `TextEncoder`, then applies standard Base64 using the `A–Z`, `a–z`, `0–9`, `+` and `/` alphabet with `=` padding. This means non-ASCII text is encoded by its UTF-8 bytes rather than by UTF-16 code units.

`Merhaba 🌍` can therefore be copied into a JSON field, basic protocol fixture or data-interchange test as ASCII Base64. The output is standard Base64, not URL-safe Base64URL; `+`, `/` and padding may need another representation in URL contexts.

Base64 is reversible encoding, not encryption, hashing or compression. It generally increases byte length and offers no confidentiality. The tool accepts text, not arbitrary uploaded binary files.

Use [Base64 Decoder](../../base64-decoder/) to recover UTF-8 text. [URL Encoder](../../url-encoder/) solves percent encoding for URL syntax rather than binary-to-text representation.
