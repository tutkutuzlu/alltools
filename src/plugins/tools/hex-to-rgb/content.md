---
title: HEX to RGB
shortDescription: Convert HEX colors to RGB or RGBA values.
seoTitle: HEX to RGB Converter – Free Online Color Tool
seoDescription: Convert 3, 4, 6 or 8 digit HEX colors to accurate RGB and RGBA values locally.
---

## Read a HEX color as channels

HEX stores red, green and blue as hexadecimal byte pairs. `#3366CC` therefore becomes `rgb(51, 102, 204)`: `33`, `66` and `CC` are base-16 versions of those three channel values. This is useful when a design token is supplied in HEX but an API, canvas operation or CSS calculation expects numeric RGB.

The parser accepts 3- and 6-digit colors plus 4- and 8-digit forms with alpha. Short notation is expanded one digit at a time, so `#3AC8` is interpreted as `#33AACC88`. Alpha is reported on a 0–1 scale in RGBA output.

RGB channels are exact for a valid HEX input; only the displayed alpha fraction may be rounded. The conversion does not infer a color profile, and it treats the value as an sRGB-style web color.

Try `#FF7F5080` when translating a half-transparent coral overlay. The result exposes the channel values needed for code while the preview confirms the source color.

For the reverse representation, use [RGB to HEX](../../rgb-to-hex/). To describe the same color through hue and lightness, use [HEX to HSL](../../hex-to-hsl/).
