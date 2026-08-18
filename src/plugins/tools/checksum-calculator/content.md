---
title: Checksum Calculator
shortDescription: Calculate CRC32, Adler-32 and Sum-8 checksums.
seoTitle: Checksum Calculator – CRC32 Adler-32 Sum-8
seoDescription: Calculate common non-cryptographic checksums for local text and clearly distinguish them from hashes.
---

## Three non-cryptographic checksums

The input is first encoded as UTF-8. CRC32 uses the reflected `0xEDB88320` polynomial and returns eight lowercase HEX digits; Adler-32 maintains modulo-65521 running sums and also returns eight digits; Sum-8 adds all bytes modulo 256 and returns two digits. For the standard text `123456789`, CRC32 is `cbf43926`.

These compact values are useful for file-format fields, protocol diagnostics, fixtures and detecting likely accidental corruption when both sides agree on the exact algorithm and byte encoding. Sum-8 is especially collision-prone; CRC32 and Adler-32 are stronger error-detection codes but still have many deliberate collisions.

A checksum has no secret and is not designed to resist an attacker who can change both data and checksum. It must not be presented as authentication or used as a password fingerprint. Choose [Hash Generator](../../hash-generator/) when a cryptographic digest is specified, or [HMAC Generator](../../hmac-generator/) when a shared secret must authenticate the data.

This calculator accepts text, not uploaded file bytes. Line-ending changes and Unicode normalization can therefore change the UTF-8 sequence and its checksum even when two renderings look similar.
