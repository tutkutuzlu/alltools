---
title: RGB to HEX
shortDescription: Convert RGB and RGBA colors to HEX.
seoTitle: RGB to HEX Converter – Accurate Color Values
seoDescription: Convert RGB or RGBA channels to six or eight digit HEX colors with validation.
---

## Package RGB channels into HEX

Use this converter when numeric red, green and blue channels need to become a compact web color. It accepts forms such as `rgb(51, 102, 204)`, `51, 102, 204`, or an RGBA value with alpha after a comma or slash. Each color channel must be between 0 and 255; alpha must be between 0 and 1 or written as a percentage.

For `rgba(255, 127, 80, 0.5)`, the output is `#FF7F5080`. The first six digits encode RGB bytes and the final pair encodes opacity. Opaque input produces six digits, while a value below full opacity produces eight.

Fractional RGB channels are rounded to the nearest byte because HEX channel pairs cannot store sub-byte precision. Alpha is likewise quantized to one of 256 byte values, so converting an arbitrary alpha to HEX and back can introduce a small difference.

This representation is convenient for CSS variables, design tokens and compact configuration files. It does not perform color-management conversion; the numbers are interpreted directly as web RGB channels.

[HEX to RGB](../../hex-to-rgb/) reverses the byte representation. [CSS Color Converter](../../css-color-converter/) is a better choice when you need several normalized formats at once.
