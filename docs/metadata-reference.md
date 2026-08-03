# Metadata Reference

## Tool manifest

Required operational fields remain defined by `schemas/tool.schema.json`. The V2 fields used by discovery and UI are:

| Field | Required | Purpose |
|---|---:|---|
| `icon` | No | Central icon key |
| `publishedAt` | No | ISO date used to derive New status |
| `updatedAt` | No | Last meaningful update date |
| `featured` | No | Editorial Featured eligibility |
| `popularity` | No | Non-negative Popular ranking signal |
| `aliases` | Yes | Search synonyms |
| `estimatedTime` | No | Human-readable completion estimate |
| `capabilities.offline` | Yes | Can work without a server after load |
| `capabilities.networkAccess` | Yes | Tool intentionally accesses a network |
| `capabilities.fileAccess` | Yes | Tool reads user-selected local files |

`discovery.priority` remains the editorial ordering signal. It is not duplicated. New status is never stored; the build derives it from `publishedAt` using a 45-day window.

Draft tools may omit publication dates and do not enter the site catalogue.

## Category manifest

Categories support `icon`, numeric `order`, boolean `featured` and a semantic `accent` key. Empty categories are not rendered on the home page.

All fields are described by the JSON Schema files and the build validator performs cross-record checks such as slug uniqueness, category existence, entry existence and icon validity.
