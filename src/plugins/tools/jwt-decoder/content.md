---
title: JWT Decoder
shortDescription: Decode JWT header and payload claims without verification.
seoTitle: JWT Decoder Online – Inspect Token Claims
seoDescription: Decode JWT header and payload JSON locally and inspect algorithm, type and expiration.
---

## Inspect two JSON segments without trusting the token

The decoder requires exactly three dot-separated parts. It Base64URL-decodes the header and payload as UTF-8, parses both as JSON and prints them together. Metrics show `alg`, `typ` and an ISO date derived from numeric `exp` seconds when present.

Use it to inspect why an API token contains an unexpected audience or expiry claim. A malformed Base64URL segment or invalid JSON is rejected. The third signature segment must exist but is not decoded or verified.

Decoding is not authentication. Anyone can construct header and payload text, so never treat the displayed claims as trustworthy without verifying the signature, allowed algorithm, issuer, audience and time rules in a security library. Encrypted JWE tokens and non-JSON segment content are unsupported.

Token input is processed by the browser runtime, but clipboard history and the surrounding device still matter for sensitive credentials. [Unix Timestamp Converter](../../unix-timestamp-converter/) can examine an `exp` value independently.
