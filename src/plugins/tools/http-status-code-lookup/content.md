---
title: HTTP Status Code Lookup
shortDescription: Look up common HTTP status meanings and categories.
seoTitle: HTTP Status Code Lookup – Meanings
seoDescription: Look up common HTTP response codes such as 200, 404 and 503 with their category.
---

## Look up a curated set of response codes

Enter a numeric code such as 200, 404 or 503. The tool returns its stored reason phrase and classifies it as informational, success, redirection, client error or server error according to the hundreds range.

For `429`, output is `Too Many Requests` and `Client error`, useful while reading an API log or choosing a response for rate limiting. The built-in table contains 27 common codes from 100 through 504, including 418.

This is not an exhaustive HTTP registry. A legitimate but unlisted status is rejected, and the phrase alone does not explain required headers, caching behavior or whether a particular application is using the code correctly. Servers may also send a different reason phrase because applications should rely on the numeric code.

Choose [MIME Type Lookup](../../mime-type-lookup/) when interpreting a response's media type, or [URL Parser](../../url-parser/) for the request address itself.
