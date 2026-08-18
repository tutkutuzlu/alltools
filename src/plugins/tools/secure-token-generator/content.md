---
title: Secure Token Generator
shortDescription: Generate random HEX, Base64 or Base64URL tokens.
seoTitle: Secure Token Generator – HEX Base64 Base64URL
seoDescription: Generate 16–64 random bytes and encode them as HEX, Base64 or URL-safe Base64 locally.
---

## Random bytes first, text encoding second

The generator obtains exactly 16, 24, 32, 48 or 64 bytes from `crypto.getRandomValues`. HEX represents every byte with two characters; standard Base64 may include `+`, `/` and `=` padding; Base64URL replaces the two punctuation characters and removes trailing padding. Changing the encoding changes transport syntax, not the underlying random bytes.

A 32-byte Base64URL selection produces 43 unpadded characters and is convenient when a system specification calls for an opaque URL-safe value. HEX is longer but easy to inspect, while standard Base64 fits protocols that explicitly expect it.

Random generation alone does not create a complete session, reset-token or API-key system. The receiving service must define sufficient byte length, transmit the secret safely, store or derive it appropriately, compare it safely, expire it and support revocation. Copying also exposes the value to clipboard facilities outside the page.

Use [Random String Generator](../../random-string-generator/) when a fixed visible alphabet is the real requirement. Use [UUID v7 Generator](../../uuid-v7-generator/) for a standardized time-bearing identifier; UUIDs should not be treated as interchangeable with bearer secrets.
