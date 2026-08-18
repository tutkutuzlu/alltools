---
title: HEX to CMYK
shortDescription: Convert HEX colors to CMYK percentages.
seoTitle: HEX to CMYK Converter – Screen to Print Values
seoDescription: Estimate CMYK channel percentages from a HEX screen color in your browser.
---

## Estimate process-color percentages from HEX

HEX represents an additive RGB screen color. CMYK describes subtractive cyan, magenta, yellow and black components used in print workflows. This tool mathematically converts the RGB bytes behind a HEX value into four percentages; for `#FF8000`, the estimate is approximately `cmyk(0%, 50%, 100%, 0%)`.

The converter accepts ordinary 3- or 6-digit HEX. Although the shared parser can read alpha-bearing HEX, CMYK output has no alpha channel, so transparency is not represented in the result. Pure black is handled as the special case `0%, 0%, 0%, 100%`.

Choose this tool for an initial discussion with a print workflow or to understand how a screen color decomposes mathematically. It is not a press-ready color separation. Real printed output depends on ink, paper, ICC profiles, rendering intent and the printer's gamut; vivid RGB colors may not be reproducible in CMYK.

Percentages are rounded for display, so [CMYK to HEX](../../cmyk-to-hex/) may return a nearby rather than byte-identical value after a round trip. Always use a managed design application and printer proof for production color decisions.
