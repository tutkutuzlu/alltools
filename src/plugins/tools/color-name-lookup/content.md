---
title: Color Name Lookup
shortDescription: Look up common color names and HEX values.
seoTitle: Color Name Lookup – CSS Name to HEX
seoDescription: Find the HEX value for common CSS color names or identify exact matches from a color value.
---

## Resolve a small built-in name table

Type a supported name such as `coral`, `navy`, `teal` or `gold` to retrieve its exact stored HEX value. The lookup is case-insensitive and recognizes a focused list of 25 common entries, including gray/grey aliases and `transparent`.

You can also enter a supported HEX, RGB, HSL, HSV or CMYK value. The tool normalizes it to HEX and returns a name only when that HEX exactly matches an entry in the table; otherwise it labels the result `Custom color`. For example, `rgb(255, 127, 80)` resolves to `coral: #FF7F50`.

This is exact lookup, not nearest-color matching. `#FF8050` will not be called coral even though it looks close. It is also not the complete browser CSS named-color catalog, so an otherwise valid CSS name may be rejected if it is absent from the built-in list. A translucent numeric input is returned as eight-digit HEX and normally remains `Custom color`; the dedicated name `transparent` maps directly to `#00000000`.

Choose this tool for quick recognition of common names. Use [CSS Color Converter](../../css-color-converter/) for broader numeric parsing or [Color Picker](../../color-picker/) to inspect multiple representations visually.
