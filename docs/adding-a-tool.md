# Adding a Tool

Create a draft Text Tool with:

```bash
npm run tool:new -- --name "Tool Name" --slug tool-name --category text --icon text --family text-tools
```

The command validates:

- required arguments;
- slug format and collisions;
- category existence;
- icon existence;
- supported V1 family.

It creates:

```text
src/plugins/tools/tool-name/
├─ tool.json
├─ content.md
├─ index.js
└─ tests/
   └─ plugin.test.js
```

The generated manifest uses `status: draft`, so it is excluded from home pages, categories, search, sitemap and production assets. The generated plugin uses the Text Transformer family and contains a clearly marked identity transformation to replace.

Before publishing, implement the transformation, replace all TODO content, add behavior tests, set `publishedAt` and `updatedAt`, change status to `published`, then run `npm run check`. No home, navigation, category, search or sitemap file should be edited manually.
