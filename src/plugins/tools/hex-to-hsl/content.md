---
title: HEX to HSL
shortDescription: Convert HEX colors to HSL values.
seoTitle: HEX to HSL Converter – Hue Saturation Lightness
seoDescription: Translate HEX colors into readable HSL values with optional alpha support.
---

## Move from channel bytes to HSL controls

HEX describes a color through red, green and blue bytes. HSL reorganizes the same web color into hue angle, saturation and lightness, which can be easier to adjust for themes and component states. Hue runs around a 0–360 degree circle; saturation and lightness are percentages.

Enter a 3-, 4-, 6- or 8-digit HEX value. `#3366CC` converts to approximately `hsl(220, 60%, 50%)`. If the HEX value includes alpha, the result uses HSLA and preserves that opacity value, rounded for display.

The RGB-to-HSL formula is deterministic, but the printed HSL components are rounded. A later HSL-to-HEX conversion can therefore differ by a channel value at rounding boundaries. Hue is also undefined for neutral gray; the tool reports zero degrees in that case because changing hue cannot affect a fully desaturated color.

Choose this converter when a fixed brand HEX color needs tunable HSL parameters for hover, focus or theme experiments. It does not judge whether a changed color remains accessible—use [Contrast Checker](../../contrast-checker/) after adjusting it.

Use [HSL to HEX](../../hsl-to-hex/) to return to a token-friendly representation.
