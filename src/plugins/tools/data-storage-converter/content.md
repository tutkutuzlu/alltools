---
title: Data Storage Converter
shortDescription: Convert decimal and binary digital storage units.
seoTitle: Data Storage Converter – MB MiB GB GiB
seoDescription: Convert bits, bytes, decimal KB/MB/GB/TB and binary KiB/MiB/GiB/TiB units.
---

## Separate decimal and binary storage units

Bytes are the reference. Eight bits equal one byte. Decimal units use powers of 1,000: `1 MB = 1,000,000 bytes` and `1 GB = 1,000,000,000 bytes`. Binary IEC units use powers of 1,024: `1 MiB = 1,048,576 bytes` and `1 GiB = 1,073,741,824 bytes`.

Consequently, `1 GB` is about `953.674 MiB`, while `1 GiB` is about `1.073742 GB`. This distinction helps explain why an operating system may display a drive or file with a different-looking number from the manufacturer's decimal specification.

The singular `bit` option is supported, but decimal kilobits or binary kibibits are not part of this storage catalog. The tool converts capacity only; it does not estimate compression, filesystem overhead, usable disk space or transfer duration.

Choose [Data Transfer Rate Converter](../../data-transfer-rate-converter/) for per-second network and disk rates. Keep the `B` versus `b` distinction visible: uppercase B denotes bytes in the labels used here.
