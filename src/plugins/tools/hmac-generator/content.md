---
title: HMAC Generator
shortDescription: Create keyed SHA-256, SHA-384 or SHA-512 MACs.
seoTitle: HMAC Generator – SHA-256 SHA-384 SHA-512
seoDescription: Generate HMAC values from a message and local secret key with HEX or Base64 output.
---

## A keyed authenticator, not encryption

HMAC combines the UTF-8 bytes of a message with a required UTF-8 secret key using HMAC-SHA-256, HMAC-SHA-384 or HMAC-SHA-512 through Web Crypto. The resulting MAC is displayed as lowercase HEX or padded Base64. Anyone with the same key, message, algorithm and encoding can reproduce it.

Use it to verify an integration test or reproduce a webhook signature when the external protocol explicitly specifies the same construction. HMAC can establish message integrity and authenticity between parties that already share a suitable secret; it does not conceal the message.

Key generation, distribution, rotation and storage determine the real security boundary. A short, reused or exposed key undermines the result, and copying a MAC is not equivalent to performing a constant-time verification. The page clears the password-type key field on unmount and telemetry excludes its value, but it cannot control extensions or the surrounding device.

[Hash Generator](../../hash-generator/) produces an unkeyed fingerprint and cannot prove who supplied a message. [Checksum Calculator](../../checksum-calculator/) targets accidental changes, while [Secure Token Generator](../../secure-token-generator/) supplies random bytes suitable for a key only when the consuming protocol’s length and handling requirements are followed.
