# Icon Library

The central icon catalogue is `src/components/icons.js`.

```js
iconMarkup("search");
createIcon("copy");
createIcon("shield", "icon", { label: "Private" });
```

Icons use `currentColor`, a shared 24×24 view box and consistent stroke settings. They are `aria-hidden` by default. Passing `label` produces an image role and accessible name.

Available product keys include:

```text
text, image, pdf, calculator, converter, generator, developer,
color, seo, game, search, copy, paste, clear, download,
arrow-right, shield, speed, simplicity, sun, moon, system
```

Additional internal keys support the AllTools mark, Word Counter, checks and chevrons. Tool and category manifests select icons through their `icon` field. Unknown manifest icons fail validation.
