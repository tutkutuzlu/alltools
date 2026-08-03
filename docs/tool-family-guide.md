# Tool Family Guide

## Text Tools

Text Tools share a primary text input, browser-local processing, common toolbar actions, accessible notices and theme-aware results.

Word Counter is the analyzer reference plugin. Its pure `analyzeText` function is separate from its Component Library integration.

## Text transformer boundary

`src/plugins/families/text-tools/transformer.js` exports `createTextTransformerPlugin(definition)`. It provides the common input/output editors, Clear and Copy result actions, telemetry hooks and cleanup lifecycle.

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
