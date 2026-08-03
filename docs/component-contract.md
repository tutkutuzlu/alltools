# Component Library Contract

Components are registered in `src/components/registry.js` and implemented as small DOM factories in `src/components/definitions.js`.

```js
const component = context.components.create("action.button", props);
root.append(component.element);
```

Factories return an object with an `element` property and only the additional handles required for interaction. Props are copied and frozen by the registry. Registering the same ID twice or requesting an unknown ID throws.

## Registered V2 components

| Product component | Registry ID | Important returned handles |
|---|---|---|
| Button | `action.button` | `element` |
| IconButton | `action.icon-button` | `element` |
| Badge | `display.badge` | `element` |
| Notice | `feedback.notice` | `element`, `show`, `clear` |
| Input | `field.input` | `element`, `input`, `label` |
| Textarea | `field.textarea` | `element`, `input`, `label` |
| Select | `field.select` | `element`, `input`, `label` |
| Toolbar | `layout.toolbar` | `element`, `items` |
| ResultPanel | `result.panel` | `element`, `metrics`, `update` |
| MetricCard | `result.metric-card` | `element`, `update` |
| ToolCard | `card.tool` | `element` |
| CategoryCard | `card.category` | `element` |
| SearchBar | `search.bar` | `element`, `input`, `results` |
| SectionHeading | `section.heading` | `element` |
| Breadcrumb | `navigation.breadcrumb` | `element` |
| FAQ | `content.faq` | `element` |
| AdSlot | `ad.slot` | `element`, `enabled` |
| ToolShell | `tool.shell` | `element`, `input`, `output`, `actions`, `results`, `notice` |

`result.stats` remains as a compatibility alias for `result.panel`.

`ToolShell` composes the shared toolbar, editor, optional output editor, result panel and accessible notice. A plugin attaches behavior to returned handles instead of writing shared markup.
