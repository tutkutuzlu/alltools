---
title: WCAG Color Accessibility Checker
shortDescription: Check text contrast against WCAG thresholds.
seoTitle: WCAG Color Accessibility Checker – AA AAA
seoDescription: Evaluate foreground and background colors against WCAG AA and AAA thresholds.
---

## Interpret color contrast in an accessibility review

This checker evaluates a foreground and background with the same ratio calculation currently used by Contrast Checker. It reports AA and AAA outcomes for normal and large text; it does not scan a webpage or test additional WCAG success criteria. Choose this page when the numerical result needs to be considered as one step in a broader accessibility review.

The thresholds are 4.5:1 (AA) and 7:1 (AAA) for normal text, and 3:1 (AA) and 4.5:1 (AAA) for large text. A pair such as `#767676` on white sits near a threshold, illustrating why exact entered values matter. “Large text” depends on rendered size and weight; the tool cannot determine that from colors alone.

A passing ratio does not prove that an interface is accessible. Review focus indicators, disabled and hover states, text over images or gradients, non-text graphical contrast, color-vision needs and whether information relies on color alone. Likewise, a failed pair may require a different color or a change in typography, but this page does not prescribe the design fix.

Alpha colors are parsed, but this ratio calculation does not composite them onto the supplied background before evaluation. Use [Opacity / Alpha Calculator](../../opacity-alpha-calculator/) to find the visible solid result first. For a compact foreground/background report without the wider review context, use [Contrast Checker](../../contrast-checker/).
