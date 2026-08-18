---
title: Cron Expression Explainer
shortDescription: Explain each field in a standard five-part cron expression.
seoTitle: Cron Expression Explainer Online
seoDescription: Explain minute, hour, day, month and weekday fields in standard cron expressions.
---

## Label a five-field cron expression

The explainer requires exactly five whitespace-separated fields in minute, hour, day-of-month, month and day-of-week order. `*/15 9 * * 1` is described as every 15 minutes, hour 9, every day of month, every month and Monday.

It recognizes `*`, leading `*/step`, and comma-separated values. Numeric months 1–12 and weekdays 0–7 receive names, with both 0 and 7 labeled Sunday. Other text is echoed rather than deeply interpreted.

This is an explainer, not a validator or scheduler. It does not check numeric ranges, calculate next run times, choose a timezone or fully explain ranges, names and advanced dialect syntax. Six- or seven-field formats, macros such as `@daily`, Quartz modifiers and seconds fields are rejected by the field-count rule.

Use it for a quick field-order check, then confirm behavior in the actual cron implementation that will execute the job. [Unix Timestamp Converter](../../unix-timestamp-converter/) handles instants, not recurring schedules.
