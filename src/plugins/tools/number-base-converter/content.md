---
title: Number Base Converter
shortDescription: Convert integers between binary, octal, decimal, hex and base 36.
seoTitle: Number Base Converter Online
seoDescription: Convert large integers between bases 2, 8, 10, 16 and 36 without precision loss.
---

## Convert non-negative integers with BigInt

Select base 2, 8, 10, 16 or 36 for input and output. The runtime reads each digit into a `BigInt`, so values larger than JavaScript's ordinary safe-integer range retain integer precision. Output uses uppercase letters.

Converting hexadecimal `FF` to decimal returns `255`; a large decimal database identifier can be converted to base 36 without floating-point rounding. Every character is checked against the selected source base, so `2` is rejected in binary.

Only unsigned whole numbers are supported. Do not include `0x`, `0b`, a minus sign, decimal point, exponent, whitespace between digits or digit separators. The operation changes representation, not byte order, encoding or bit width, and it does not preserve leading zeroes.

Choose [UUID Validator](../../uuid-validator/) for structured hexadecimal identifiers. Base conversion is not encryption and should not be used to hide sensitive values.
