---
title: Temperature Converter
shortDescription: Convert Celsius, Fahrenheit and Kelvin temperatures.
seoTitle: Temperature Converter – Celsius Fahrenheit Kelvin
seoDescription: Convert temperatures among Celsius, Fahrenheit and Kelvin with absolute-zero validation.
---

## Temperature uses scale and offset

Temperature conversion is affine, not a simple factor. The runtime first converts to Celsius: `(°F − 32) × 5/9` or `K − 273.15`; it then applies the target offset and scale. Thus `20°C` becomes `68°F` and `293.15 K`.

Absolute zero is `−273.15°C`, `−459.67°F` or `0 K`. Inputs below that physical boundary are rejected. Kelvin is labeled without a degree symbol.

The offsets matter for temperature values but not in the same way for intervals. A change of 10 Celsius degrees equals a change of 18 Fahrenheit degrees, yet entering `10°C` as a temperature produces `50°F` because the runtime converts absolute scale values, not temperature differences.

Use this tool for weather, cooking equipment or scientific values after confirming whether the source is a temperature or an interval. It does not convert thermal energy, account for measurement uncertainty or interpret mixed text such as “room temperature.”

[Energy Converter](../../energy-converter/) handles energy units, which cannot be inferred from temperature alone.
