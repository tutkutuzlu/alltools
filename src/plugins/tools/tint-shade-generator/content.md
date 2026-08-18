---
title: Tint and Shade Generator
shortDescription: Generate lighter and darker variants.
seoTitle: Tint and Shade Generator – Color Scale Builder
seoDescription: Create seven consistent lightness steps around a base color for UI design.
---

## Build a lightness scale around one color

The generator converts the base color to HSL and changes its lightness by −40, −25, −10, 0, +10, +25 and +40 percentage points. Values are clamped to the 0–100% HSL lightness range, then converted to opaque HEX. Hue and HSL saturation are held constant.

This seven-step sequence can help draft button states, surfaces or a tonal illustration family. For `#3366CC`, the center swatch remains the base while the preceding and following entries provide darker and lighter candidates.

In traditional pigment terminology, a tint mixes with white and a shade mixes with black. This tool approximates that design intent by changing HSL lightness; it does not perform physical pigment mixing or linear-light compositing. HSL is not perceptually uniform, so equal numeric steps may look uneven, and extreme bases can cause multiple clamped results near black or white.

Use [Lighten and Darken Color](../../lighten-darken-color/) when you want the narrower ±10, ±20 and ±30 sequence. Test any selected text/background state with [WCAG Color Accessibility Checker](../../wcag-color-accessibility-checker/).
