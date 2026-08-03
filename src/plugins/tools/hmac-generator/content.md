---
title: HMAC Generator
shortDescription: Create keyed SHA-256, SHA-384 or SHA-512 MACs.
seoTitle: HMAC Generator – SHA-256 SHA-384 SHA-512
seoDescription: Generate HMAC values from a message and local secret key with HEX or Base64 output.
---

## HMAC Generator for private browser workflows

Authenticate a message using a key that never leaves the current page. All processing uses local browser capabilities and the result is never sent to an external service.

## How to use HMAC Generator

1. Choose the controls that match your intended format or security requirement.
2. Enter local input when required, then generate or review the calculated result.
3. Copy the output and handle any secret according to the policy of the system where it will be used.

## Practical example

**Input:** Message plus a secret key using SHA-256

**Result:** A keyed authentication code

## Security boundaries

This utility provides a focused primitive, not a complete security guarantee. Review algorithm warnings, protect copied secrets from clipboard history and never reuse credentials across unrelated services.

## Privacy

Passwords, keys, tokens, source text and generated values stay in the active page. They are not stored in localStorage, written to the console or included in telemetry.

## Frequently asked questions

### Is the secret key stored?

No. It remains only in the page control, never enters storage or telemetry, and is cleared on unmount.

### Is HMAC the same as hashing?

No. HMAC authenticates data with a secret key; a plain hash has no shared secret.

## Related security tools

- [Password Generator](../../password-generator/)
- [Secure Token Generator](../../secure-token-generator/)
- [Hash Generator](../../hash-generator/)
