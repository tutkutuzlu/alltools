---
title: Fuel Economy Converter
shortDescription: Convert MPG, km/L and L/100 km fuel economy.
seoTitle: Fuel Economy Converter – MPG and L/100km
seoDescription: Convert US MPG, imperial MPG, kilometers per liter and liters per 100 kilometers.
---

## Convert efficiency and consumption scales

Kilometers per liter, US mpg and Imperial mpg express distance per fuel amount: higher is more efficient. Liters per 100 km expresses consumption: lower is better. The runtime converts through km/L, using reciprocal `100 / value` for L/100 km rather than one fixed multiplier.

For example, `8 L/100 km` becomes `12.5 km/L`, about `29.38 mpg US` or `35.31 mpg Imperial`. US and Imperial results differ because the Imperial gallon is larger; both options are explicitly available.

Every accepted value must be greater than zero. Zero consumption would require infinite distance-per-volume efficiency, and zero mpg would create an undefined reciprocal, so the runtime rejects zero and negative input.

This is a unit conversion, not a prediction of real vehicle use. Driving conditions, measurement cycles, rounding and fuel blends affect observed economy. It also does not calculate trip fuel cost or range.

Use [Volume Converter](../../volume-converter/) to compare gallon and liter quantities independently, or [Length Converter](../../length-converter/) for trip distance.
