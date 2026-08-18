---
title: Password Generator
shortDescription: Create strong passwords with secure browser randomness.
seoTitle: Secure Password Generator – Private Browser Tool
seoDescription: Generate strong passwords with configurable length, character groups and ambiguous-character exclusion.
---

## How the password is assembled

Choose a length from 4 to 256 and enable lowercase letters, uppercase letters, digits or symbols. The generator first draws one character from every selected group, fills the remaining positions from the combined alphabet, then shuffles the result. Browser `crypto.getRandomValues` supplies the bytes; rejection sampling prevents modulo bias. “Exclude ambiguous” removes characters such as `I`, `l`, `1`, `O`, `0`, quotes and the vertical bar before selection.

The selected groups and exclusions determine the possible output space. The required-group rule means positions are not simply independent draws from one alphabet, so this page does not present a simplistic entropy number. A 20-character result using all four groups is appropriate for creating a new account password, provided the site accepts those symbols.

Generation does not store, synchronize or protect the result after it is copied. Save each password in a reputable password manager, do not reuse it, and follow the account’s MFA and recovery practices. Clipboard history and extensions remain outside this tool’s security boundary.

Choose [Passphrase Generator](../../passphrase-generator/) when memorability matters, [PIN Generator](../../pin-generator/) for a numeric-only field, or [Secure Token Generator](../../secure-token-generator/) when a protocol specifies random bytes and an encoding.
