# GA4 events

Tool plugins use `context.telemetry`; they must never call `gtag` directly.

| Event | Meaning | Allowed parameters |
| --- | --- | --- |
| `page_view` | One static document load | `source` |
| `tool_open` | Tool page opened | `tool_id`, `category`, `source`, `placement` |
| `tool_use` | First meaningful use in the page session | `tool_id`, `category`, `source` |
| `search` | Search performed | `category`, `source`, `query_length`, `result_count` |
| `search_result_open` | Search result selected | `tool_id`, `category`, `source`, `placement` |
| `copy`, `paste`, `clear`, `download` | Explicit tool action | `tool_id`, `category`, `source`, `placement` |
| `theme_change` | Theme preference changed | `theme`, `source` |

The adapter converts camelCase internal keys to GA4 snake_case parameters. Unknown events and parameters are discarded. Search text and tool content never enter the adapter.

Word Counter sends `tool_open` once on document load and one debounced `tool_use` after the first non-whitespace input. Copy, paste, and clear remain separate events.
