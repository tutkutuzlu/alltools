---
title: Color Mixer
shortDescription: Blend two colors at selectable weights.
seoTitle: Color Mixer – Blend Two HEX or CSS Colors
seoDescription: Mix two valid colors at 25, 50 or 75 percent and copy the resulting value.
---

## Interpolate two colors by channel

Provide any two colors accepted by the shared parser, then choose how much the second color contributes: 25%, 50% or 75%. The runtime takes a weighted average of red, green, blue and alpha channels and returns an eight-digit HEX result. At 25%, the first color supplies 75% of every channel.

Mixing `#3366CC` with `#FFCC00` at 50% gives the midpoint of their encoded RGB bytes, useful for a quick transition color, data visualization blend or comparison against a manually chosen midpoint. The preview shows the first color, mixture and second color together.

This is arithmetic interpolation in encoded RGB, not paint mixing and not perceptually uniform blending. A 50% result may not look like the visual midpoint, particularly between highly saturated colors. Transparency is averaged as a channel; the tool does not composite one color over the other or account for premultiplied alpha.

Choose [Opacity / Alpha Calculator](../../opacity-alpha-calculator/) when foreground-over-background compositing is the real operation. Choose [Gradient Generator](../../gradient-generator/) when you need the browser to render the continuous transition rather than one sampled mixture.
