---
title: Passphrase Generator
shortDescription: Generate memorable phrases from an embedded word list.
seoTitle: Secure Passphrase Generator – Local Word List
seoDescription: Generate 4–8 word passphrases with separators, capitalization and an optional number using secure randomness.
---

## Independently sampled words from a small list

Select 4–8 words and a hyphen, underscore, space or period separator. Every word is independently chosen with `crypto.getRandomValues` and unbiased rejection sampling from an embedded list of 72 lowercase English words. Capitalization changes the presentation of every chosen word; “Append number” adds one independently selected digit after another separator.

A passphrase is a sequence of words intended to be easier to remember or transcribe than a dense character password. For example, five hyphen-separated words can suit an account that permits long credentials. A conventional password instead samples characters and is usually more compact for a comparable output-space target.

The 72-word list is much smaller than specialist diceware lists, repeated words are allowed, and capitalization or one appended digit should not be treated as a substitute for selecting more random words. This page deliberately makes no entropy promise; service rate limits, uniqueness, storage and the list’s public nature all matter.

Use [Password Generator](../../password-generator/) where a site favors mixed characters, or [PIN Generator](../../pin-generator/) only for numeric fields. Store a chosen passphrase with the same care as any other credential.
