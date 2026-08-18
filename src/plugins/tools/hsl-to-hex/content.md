---
title: HSL to HEX
shortDescription: Convert HSL and HSLA colors to HEX.
seoTitle: HSL to HEX Converter – Free Browser Tool
seoDescription: Convert HSL or HSLA colors into normalized HEX values without external services.
---

## Turn an HSL choice into a web token

HSL uses a hue angle plus saturation and lightness percentages. This tool resolves those cylindrical controls into RGB bytes and writes the bytes as uppercase HEX. It is useful after exploring a color in HSL when the destination design system stores tokens as HEX.

Supply syntax such as `hsl(220, 60%, 50%)` or `hsla(220, 60%, 50%, 0.5)`. Saturation and lightness must stay within 0–100%. Hue may be negative or exceed 360; the runtime wraps it around the color wheel, so `hsl(380, 100%, 50%)` is treated like 20 degrees. Alpha accepts 0–1 or a percentage.

For example, `hsl(30, 100%, 50%)` becomes `#FF8000`. The RGB calculation rounds channels to whole bytes. Because HSL values can express intermediate results more precisely than 8-bit HEX, a round trip may not reproduce every typed decimal exactly.

At 0% saturation, hue has no visible effect. At 0% or 100% lightness, all hues collapse to black or white. Those are properties of HSL rather than input errors.

Compare the output with [HSL to RGB](../../hsl-to-rgb/) when an API needs channels rather than HEX.
