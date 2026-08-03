---
title: Hash Generator
shortDescription: Calculate SHA hashes from local text.
seoTitle: SHA Hash Generator – SHA-1 SHA-256 SHA-384 SHA-512
seoDescription: Calculate SHA-1, SHA-256, SHA-384 or SHA-512 digests in HEX or Base64 with Web Crypto.
---

## Hash Generator for private browser workflows

Compare text digests for development and integrity workflows without confusing hashing with encryption. All processing uses local browser capabilities and the result is never sent to an external service.

## How to use Hash Generator

1. Choose the controls that match your intended format or security requirement.
2. Enter local input when required, then generate or review the calculated result.
3. Copy the output and handle any secret according to the policy of the system where it will be used.

## Practical example

**Input:** hello with SHA-256

**Result:** 2cf24dba… digest

## Security boundaries

This utility provides a focused primitive, not a complete security guarantee. Review algorithm warnings, protect copied secrets from clipboard history and never reuse credentials across unrelated services.

## Privacy

Passwords, keys, tokens, source text and generated values stay in the active page. They are not stored in localStorage, written to the console or included in telemetry.

## Frequently asked questions

### Is hashing encryption?

No. A cryptographic hash is one-way and cannot be decrypted to recover the original text.

### Why is SHA-1 available?

It supports compatibility checks but is marked legacy and should not protect new security-sensitive data.

## Related security tools

- [Password Generator](../../password-generator/)
- [Secure Token Generator](../../secure-token-generator/)
- [UUID v7 Generator](../../uuid-v7-generator/)
