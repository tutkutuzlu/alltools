---
title: SQL Formatter
shortDescription: Add line breaks around common SQL clauses and lists.
seoTitle: SQL Formatter Online – Format Queries
seoDescription: Format common SQL SELECT, JOIN, WHERE, GROUP BY and ORDER BY clauses for review.
---

## Reflow a limited set of SQL keywords

This formatter first collapses whitespace, then inserts line breaks before a fixed keyword list including `SELECT`, `FROM`, `WHERE`, common joins, `GROUP BY`, `ORDER BY`, `HAVING`, `LIMIT`, `UNION`, `VALUES`, `SET` and `RETURNING`. Commas are moved onto indented continuation lines.

An ordinary `SELECT id,name FROM users WHERE active=1 ORDER BY name` becomes easier to scan during a query review. Keyword matching is case-insensitive and the emitted recognized keyword is uppercase.

The implementation is not a SQL parser and does not choose a database dialect. Keywords or commas inside quoted strings, identifiers, comments and functions may be reformatted incorrectly. It does not validate syntax, indent nested subqueries reliably or understand every statement type.

Choose it for quick visual separation of a conventional query, then rely on your database tooling for authoritative formatting and validation. [JSON Formatter](../../json-formatter/) is parser-backed and therefore has different guarantees.
