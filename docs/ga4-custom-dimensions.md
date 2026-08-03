# GA4 custom definitions and reports

In **Admin → Data display → Custom definitions**, create event-scoped custom dimensions whose event parameter names exactly match:

| Display name | Event parameter |
| --- | --- |
| Tool ID | `tool_id` |
| Tool category | `category` |
| Event source | `source` |
| Placement | `placement` |
| Theme | `theme` |

If numerical analysis is needed, create event-scoped custom metrics for `query_length` and `result_count` with the Standard unit. Do not register them as dimensions unless bucketed categorical reporting is specifically required.

## Explorations

Create a **Free form** exploration and import Event name, Tool ID, Tool category, Date, and the Event count metric.

1. **Tool views:** filter Event name to `tool_open`; rows Tool ID; values Event count.
2. **Real tool uses:** filter to `tool_use`; rows Tool ID; values Event count.
3. **Usage rate:** create two filtered tabs or segments for `tool_use` and `tool_open`, then calculate uses divided by opens in an exported report or a GA4 calculated metric when available for the property.
4. **Most-used tools:** filter to `tool_use`; sort Tool ID by Event count descending.
5. **Action distribution:** filter Event name to `copy`, `paste`, `clear`, and `download`; rows Event name; optionally break down by Tool ID.
6. **No-result searches:** filter Event name to `search` and `result_count` equal to `0`; values Event count.
7. **7/30-day trend:** use Date as rows and Event count as values, filter to `tool_use`, then compare Last 7 days and Last 30 days date ranges.

GA4 custom definitions apply prospectively; create them before production traffic whenever possible. Realtime and DebugView can confirm receipt before standard reports finish processing.
