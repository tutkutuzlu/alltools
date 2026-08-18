---
title: Password Strength Checker
shortDescription: Analyze password length, diversity and common patterns locally.
seoTitle: Password Strength Checker – Local and Private
seoDescription: Check password length, character diversity, repetition and common patterns without transmitting or storing it.
---

## What the score actually tests

The checker awards up to five points for reaching 12 and 16 characters, using at least three broad character classes, avoiding triples of the same character, and avoiding a short built-in list of strings such as `password`, `qwerty` and `1234`. It reports the corresponding label and specific suggestions for failed checks.

“Estimated search space” multiplies the password length by the logarithm of a presumed character pool. That is a coarse upper-bound-style estimate, not measured entropy: it does not model dictionary words, substitutions, leaked-password databases, keyboard patterns beyond the small list, or how a person chose the password. A strong label therefore cannot establish that a credential is safe or unique.

The entered value is evaluated in the page and cleared when the tool unmounts, but browser extensions, screen capture and clipboard actions are separate risks. Avoid testing a live high-value credential on a device you do not trust.

Use this checker for quick feedback while drafting a policy-compatible secret. Prefer [Password Generator](../../password-generator/) for unbiased character selection or [Passphrase Generator](../../passphrase-generator/) for independently sampled words; neither replaces breach checking, secure storage or MFA.
