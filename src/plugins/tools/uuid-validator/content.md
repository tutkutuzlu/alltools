---
title: UUID Validator
shortDescription: Validate UUID syntax and identify version and variant.
seoTitle: UUID Validator Online – Check UUID Version
seoDescription: Validate a UUID and identify its RFC variant, version and normalized value.
---

## Check layout, version nibble and RFC variant

The analyzer accepts the canonical hyphenated 8-4-4-4-12 hexadecimal layout. Its pattern recognizes version nibbles 1 through 8 and requires the variant nibble to begin with 8, 9, A or B. A matching value is normalized to lowercase and reported with its version.

For `550e8400-e29b-41d4-a716-446655440000`, the result is valid, Version 4, RFC 4122. Braces, a `urn:uuid:` prefix, missing hyphens or non-hex characters are rejected rather than normalized.

Pattern validity does not prove that an identifier was generated correctly, exists in a database or is unique. The label “RFC 4122” describes the recognized variant in the current output; newer UUID specifications may use updated terminology while retaining the bit layout.

Choose [UUID Generator](../../uuid-generator/) for new random v4 values or [UUID v7 Generator](../../uuid-v7-generator/) for chronological generation.
