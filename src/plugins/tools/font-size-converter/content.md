---
title: Font Size Converter
shortDescription: Convert CSS and print typography length units.
seoTitle: Font Size Converter – PX REM EM PT
seoDescription: Convert pixels, points, picas, rem, em, inches, centimeters and millimeters using documented assumptions.
---

## Convert typography under fixed assumptions

Pixels are the reference. The runtime assumes 96 px per inch, 72 points per inch, 16 px per pica, a 16 px root for `rem` and a 16 px context for `em`. Under those assumptions, `12 pt` becomes `16 px`, and `24 px` becomes `1.5 rem` or `1.5 em`.

This is useful when translating a print specification into a browser starting point or documenting a design system built on a 16 px root. Physical units such as inches, centimeters and millimeters are derived from the 96-DPI CSS reference relationship.

Relative units are context-dependent in real pages. `1 rem` follows the document root size and `1 em` follows the relevant element context; either can differ from the fixed 16 px assumption used here. CSS physical units also describe reference pixels and may not match a screen's measured physical size.

Choose this tool for numerical comparison, not for previewing rendered typography. [Length Converter](../../length-converter/) handles general physical lengths without typography-specific px, rem or em assumptions.
