---
title: Lighten and Darken Color
shortDescription: Create controlled lightness variations.
seoTitle: Lighten and Darken Color – Generate UI Variants
seoDescription: Generate seven deterministic lighter and darker HEX variants from one base color.
---

## Compare three darker and three lighter steps

The runtime converts the base color to HSL and applies lightness offsets of −30, −20, −10, 0, +10, +20 and +30 percentage points. It clamps lightness between 0% and 100%, converts each result back to RGB bytes and prints seven opaque HEX values.

Use this narrower sequence to explore hover, pressed, border or surface candidates around an existing token. With `#3366CC`, the center entry is the original color and the surrounding entries show controlled HSL variants without rotating hue.

“Lighter” here means a higher HSL lightness coordinate. It is not an overlay of white, a change in opacity or a perceptually uniform adjustment. Equal ten-point steps can look uneven across hues, and colors already near black or white may hit the clamp and produce repeated or compressed-looking extremes. Alpha from the input is not included in the returned HEX sequence.

Choose [Tint and Shade Generator](../../tint-shade-generator/) for a wider, uneven seven-step scale reaching ±40 points. Choose [Opacity / Alpha Calculator](../../opacity-alpha-calculator/) when the design actually places a translucent layer over a background. Any state used for text still needs an independent contrast check.
