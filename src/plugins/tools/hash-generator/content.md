---
title: Hash Generator
shortDescription: Calculate SHA hashes from local text.
seoTitle: SHA Hash Generator – SHA-1 SHA-256 SHA-384 SHA-512
seoDescription: Calculate SHA-1, SHA-256, SHA-384 or SHA-512 digests in HEX or Base64 with Web Crypto.
---

## Deterministic SHA digests of UTF-8 text

The tool encodes the entered text as UTF-8 and asks Web Crypto for SHA-1, SHA-256, SHA-384 or SHA-512. The digest can be rendered as lowercase HEX or standard padded Base64. Identical input bytes and algorithm produce the same digest; even a small input change normally produces a different value.

For example, SHA-256 of `hello` begins `2cf24dba`. That makes hashes useful for comparing known text, test vectors and integrity fingerprints when a trusted expected digest already exists. A digest is one-way, not encrypted text, and the output cannot be “decoded” back to the source.

SHA-1 remains available for legacy compatibility and triggers a warning, but collision attacks make it unsuitable for new collision-sensitive security designs. None of these plain fast hashes is a password-storage scheme; password databases need a purpose-built salted, deliberately expensive password-hashing function.

Choose [HMAC Generator](../../hmac-generator/) when integrity must be authenticated with a secret key. Choose [Checksum Calculator](../../checksum-calculator/) for lightweight accidental-corruption checks where resistance to deliberate manipulation is not required.
