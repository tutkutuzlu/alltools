---
title: Unix Timestamp Converter
shortDescription: Convert Unix seconds, milliseconds and date strings.
seoTitle: Unix Timestamp Converter Online
seoDescription: Convert Unix timestamps to ISO and UTC dates or turn a date into seconds and milliseconds.
---

## Normalize a date to UTC and Unix counts

Digit-only input is treated as seconds when Seconds is selected, as milliseconds when Milliseconds is selected, or automatically as seconds at ten digits or fewer. Other text is passed to the browser's date parser. Output includes ISO 8601, Unix seconds, Unix milliseconds and a UTC display.

`1704067200` in seconds becomes `2024-01-01T00:00:00.000Z`. Millisecond timestamps preserve their millisecond component, while Unix seconds are floored from the resulting time.

All displayed date forms are UTC. Date strings without an explicit offset can be interpreted according to browser date-parsing rules and local context before conversion, so include `Z` or an offset when the instant must be unambiguous. Auto detection is based on digit length, not plausibility; early millisecond timestamps may need the explicit unit selector.

The tool does not convert named timezones or calendar schedules. [JWT Decoder](../../jwt-decoder/) displays an `exp` claim using the same Unix-seconds convention.
