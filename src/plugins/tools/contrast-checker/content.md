---
title: Contrast Checker
shortDescription: Calculate WCAG contrast between two colors.
seoTitle: Color Contrast Checker – WCAG AA and AAA
seoDescription: Calculate an accurate WCAG contrast ratio and AA or AAA outcomes for normal and large text.
---

## Check one text and background pair

Use this page for a direct question: does this text color have enough contrast against this background color? Enter the text color first and the solid background second. The result reports their ratio plus AA and AAA pass/fail outcomes for normal and large text.

The calculation converts RGB channels to WCAG relative luminance, orders the lighter and darker values, then evaluates `(lighter + 0.05) / (darker + 0.05)`. Black against white produces the maximum `21:1`. For WCAG thresholds used here, normal text needs 4.5:1 for AA and 7:1 for AAA; large text needs 3:1 and 4.5:1 respectively.

For example, checking `#111827` text on `#FFFFFF` gives a strong ratio suitable for routine body-copy review. Choose this focused tool while adjusting a specific CSS foreground/background pair and copy the concise report into a design review.

The runtime compares the entered RGB colors as solid values. It does not composite alpha, sample gradients or images, determine font size/weight, or inspect an actual page. Contrast also does not cover focus visibility, color-only meaning, typography or interaction accessibility.

For a more accessibility-oriented reading of the same current calculation, use [WCAG Color Accessibility Checker](../../wcag-color-accessibility-checker/). Composite transparency first with [Opacity / Alpha Calculator](../../opacity-alpha-calculator/).
