---
title: Color Palette Generator
shortDescription: Build a deterministic six-color palette.
seoTitle: Color Palette Generator – Copyable HEX Scheme
seoDescription: Create a repeatable six-color palette from one base color entirely in your browser.
---

## A six-position hue study

Starting from one supported color, the generator converts it to HSL and rotates hue by 0, 35, 75, 145, 215 and 285 degrees. Saturation and lightness remain tied to the base color, and each result is converted to opaque HEX. `#3366CC`, for example, becomes the anchor for six repeatable swatches rather than a random set.

This broad spread is useful for early chart categories, illustration directions or interface exploration when you want variety but need to regenerate the same values later. Copy the output as a newline-separated list for a token draft.

The sequence is a mathematical starting point, not a complete design system. Equal hue rotations are not perceptually equal, and preserving one HSL saturation/lightness level can make some hues appear much brighter than others. The palette also does not test contrast, color-vision distinguishability or semantic meaning.

Choose [Analogous Color Generator](../../analogous-color-generator/) for a tighter family or [Triadic Color Generator](../../triadic-color-generator/) for exactly three evenly spaced anchors. Review text usage separately with [Contrast Checker](../../contrast-checker/).
