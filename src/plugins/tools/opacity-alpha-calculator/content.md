---
title: Opacity / Alpha Calculator
shortDescription: Composite a translucent color over a background.
seoTitle: Opacity and Alpha Calculator – Composite Colors
seoDescription: Calculate the visible HEX result when an alpha color is placed over a solid background.
---

## Calculate the visible foreground-over-background color

This tool performs alpha compositing, not simple color mixing. For each RGB channel it applies `foreground × alpha + background × (1 − alpha)`, rounds the visible channels to bytes and returns an opaque HEX result. The foreground must carry alpha for the background to influence the result.

For example, `#3366CC80` over `#FFFFFF` produces the approximate solid color a half-transparent blue overlay displays on white. This is useful before checking contrast or translating an overlay state into a fallback solid token.

The background is treated as solid even if its input contains alpha; nested transparency is not calculated. The arithmetic is performed directly on encoded RGB channels rather than linear-light values, matching a simple utility calculation but not every color-managed rendering pipeline. Rounding and the 8-bit alpha representation can produce one-byte differences near boundaries.

Choose [Color Mixer](../../color-mixer/) when the goal is a weighted blend independent of foreground/background order. After compositing, paste the visible HEX into [Contrast Checker](../../contrast-checker/) to evaluate text readability. Opacity changes transparency; it is not the same operation as making a color lighter.
