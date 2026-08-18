---
title: HSL to RGB
shortDescription: Convert HSL and HSLA values to RGB.
seoTitle: HSL to RGB Converter – CSS Color Conversion
seoDescription: Convert hue, saturation and lightness to validated RGB or RGBA output.
---

## Resolve HSL into display channels

This converter turns hue, saturation and lightness into red, green and blue byte values. It is the appropriate direction when a color was designed with HSL controls but a canvas routine, image operation or hardware-oriented interface expects RGB channels.

Hue is normalized around 360 degrees. Saturation and lightness must be percentages from 0 to 100, and optional alpha must be from 0 to 1 or a percentage. `hsl(120, 100%, 25%)` resolves to `rgb(0, 128, 0)`. With an alpha below one, the result is written as RGBA.

The final channels are rounded and clamped to whole bytes. This means highly precise HSL decimals cannot always survive an HSL→RGB→HSL round trip unchanged. The visible sRGB-style color should remain close, subject to that 8-bit quantization.

Remember that HSL is not perceptually uniform: increasing lightness by ten percentage points does not produce an equally noticeable change for every hue. For a prepared sequence of HSL lightness steps, see [Lighten and Darken Color](../../lighten-darken-color/). For a compact token, use [HSL to HEX](../../hsl-to-hex/).
