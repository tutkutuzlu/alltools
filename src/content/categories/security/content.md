---
seoTitle: Security & Generators – Private Browser Crypto Tools
seoDescription: Generate passwords, tokens, passphrases, PINs and UUID v7 values or calculate hashes, HMACs and checksums locally.
---

## Choose the correct security primitive

Use a **password or passphrase generator** for a new human credential and a **token or random-string generator** for machine-oriented values. Secure generators use browser cryptographic randomness where the runtime requires it. **Hashing** creates an unkeyed digest and is not encryption; **HMAC** combines a secret key with a message for authentication; **checksums** are intended to detect accidental changes and are not a substitute for a cryptographic integrity check.

## Use security primitives carefully

Secrets, source text and generated values remain in the active page and are excluded from telemetry. These utilities provide individual operations, not complete account or system security; follow the receiving system's requirements and protect copied secrets from clipboard history.
