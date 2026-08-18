---
title: RGB to HSV
shortDescription: Convert RGB colors to HSV values.
seoTitle: RGB to HSV Converter – Hue Saturation Value
seoDescription: Convert RGB or RGBA channels to HSV while preserving alpha where supplied.
---

## Express RGB as hue, saturation and value

HSV describes color with a hue angle, saturation and value. Unlike HSL lightness, HSV value is the largest normalized RGB channel. That makes HSV convenient for picker interfaces where moving toward zero value should reliably approach black.

Input channels must be between 0 and 255. Optional alpha accepts 0–1 or a percentage and is carried into the formatted HSV result. `rgb(51, 102, 204)` converts to approximately `hsv(220, 75%, 80%)`: blue is the strongest channel, so value is 80%.

Displayed hue, saturation and value are rounded. For black, saturation is reported as zero because hue cannot be recovered when all channels are zero. Grays likewise have no meaningful hue. A later conversion back to RGB can differ by one byte because the displayed HSV numbers and RGB output are quantized.

Choose HSV when implementing a conventional saturation/value picker or comparing a color by its maximum channel. Choose [RGB to HSL](../../rgb-to-hsl/) instead when CSS-style lightness adjustments are the intended workflow.

Neither HSV value nor HSL lightness predicts readable text contrast; [Contrast Checker](../../contrast-checker/) uses relative luminance for that purpose.
