---
title: Random String Generator
shortDescription: Generate random strings from selected or custom characters.
seoTitle: Random String Generator – Custom Alphabet
seoDescription: Generate cryptographically random strings with length, character-group and custom-alphabet controls.
---

## Uniform characters from a chosen alphabet

Set a length from 1 to 4096 and combine lowercase, uppercase, digits and optionally symbols. A custom alphabet replaces those groups; duplicate characters are removed and the final alphabet must contain 2–256 unique characters. Each output position is sampled independently with `crypto.getRandomValues`, using rejection sampling so awkward alphabet sizes do not favor some characters.

This is useful for test identifiers, invite codes or fixtures constrained to a particular alphabet—for example, 12 characters drawn only from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`. Collision remains possible, and a small alphabet or short length sharply reduces the number of possible strings.

Unlike [Password Generator](../../password-generator/), this tool does not guarantee one character from every selected class. Unlike [Secure Token Generator](../../secure-token-generator/), its length describes visible characters rather than random bytes and its custom alphabet may have limited security. A UUID has a standardized structure; this output does not.

Decide whether the generated value is merely an identifier or a secret before using it. Authentication tokens also require appropriate length, server-side storage, comparison, expiry and revocation—not just random-looking text.
