# Analytics event contract

Allowed event names are `page_view`, `tool_open`, `tool_use`, `search`, `search_result_open`, `copy`, `paste`, `clear`, `download`, and `theme_change`.

Allowed fields are `eventName`, `toolId`, `category`, `placement`, `theme`, `queryLength`, `resultCount`, `source`, and `timestamp`. String values are bounded to 80 characters; counts must be non-negative integers. Client and Worker both enforce the allowlist.

User text, search strings, clipboard values, file data and names, e-mail addresses, URL parameters, IP addresses, fingerprints, and arbitrary payload properties are forbidden. Search sends only query length and result count. Word Counter emits one debounced `tool_use` after the first non-whitespace input per page lifetime, not on each keystroke.
