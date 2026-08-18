---
title: RGB to HSL
shortDescription: Convert RGB and RGBA values to HSL.
seoTitle: RGB to HSL Converter – Accurate CSS Colors
seoDescription: Convert RGB channels to HSL while preserving valid alpha values.
---

## Interpret RGB through hue and lightness

RGB records emitted screen channels; HSL describes a position around a hue wheel and how saturated and light that color appears within the HSL model. Choose this tool when numeric RGB from a screenshot, canvas sample or API needs HSL controls for CSS experimentation.

The input accepts three channels from 0 to 255, with optional alpha from 0 to 1 or as a percentage. `rgb(255, 127, 80)` produces an HSL value near `hsl(16, 100%, 66%)`. RGBA input becomes HSLA, retaining opacity separately from the color calculation.

Hue and percentages are rounded in the displayed result. Neutral colors have no meaningful hue, so a gray input is represented with 0% saturation and hue 0. This does not mean the gray is conceptually red; it is simply a stable numeric convention.

HSL lightness is a model coordinate, not a measurement of perceived brightness. Two colors with the same HSL lightness can have very different relative luminance and contrast. Check text combinations with [WCAG Color Accessibility Checker](../../wcag-color-accessibility-checker/) instead of relying on the lightness percentage.

[RGB to HSV](../../rgb-to-hsv/) offers a value-based alternative commonly used in picker workflows.
