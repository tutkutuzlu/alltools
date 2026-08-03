# Tool Family Guide

## Text Tools

Text Tools share a primary text input, browser-local processing, common toolbar actions, accessible notices and theme-aware results.

Word Counter is the analyzer reference plugin. Its pure `analyzeText` function is separate from its Component Library integration.

## Text transformer boundary

`src/plugins/families/text-tools/transformer.js` exports `createTextTransformerPlugin(definition)`. It provides the common input/output editors, Clear and Copy result actions, telemetry hooks and cleanup lifecycle.

## Developer Tools

Developer Tools share `src/plugins/families/developer-tools/universal-plugin.js`. Tool-specific pure operations live in `operations.js`, while controls, result metrics and action profiles are declared in `tool-definitions.js`. The runtime owns paste, clear, copy, download, validation notices and deduplicated `tool_use` telemetry with the `developer` category. Inputs and results remain browser-local.

## Unit Converters

Unit Converters use `src/plugins/families/unit-converters/catalog.js` for declarative factors and labels, `engine.js` for validated conversion strategies and `universal-plugin.js` for the shared UI lifecycle. The runtime provides source/target selectors, precision choices, unit swapping, clipboard actions and deduplicated `tool_use` telemetry with the `unit` category. Temperature and fuel economy use dedicated non-linear strategies; other domains use a documented base-unit factor.

## Color Tools

Color Tools share `src/plugins/families/color-tools/engine.js` for safe HEX, RGB, HSL, HSV, CMYK and alpha parsing, conversion, WCAG contrast, deterministic palettes, gradients and compositing. `definitions.js` declares the 25 operations, while `universal-plugin.js` owns accessible inputs, live bordered previews, clipboard and optional CSS download actions, validation and deduplicated telemetry with the `color` category. User-entered colors and generated values never enter telemetry.

## Security & Generators

Security tools use `src/plugins/families/security-generators/engine.js` for Web Crypto hashing and HMAC, cryptographically secure random sampling, checksums, password analysis and UUID v7 generation. `definitions.js` declares tool controls and async operations; `universal-plugin.js` owns generation, sensitive input cleanup, copy/download actions and deduplicated telemetry with the `security` category. Passwords, HMAC keys, tokens and source values are never stored or included in telemetry.

```js
const plugin = createTextTransformerPlugin({
  id: "example-transformer",
  inputLabel: "Input text",
  outputLabel: "Result",
  transform(text) {
    return text.trim();
  }
});
```

This boundary is intended for small deterministic transformations such as case conversion and whitespace cleanup. It is not used for file tools, network tools or complex editors.
