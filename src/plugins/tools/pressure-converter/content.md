---
title: Pressure Converter
shortDescription: Convert pressure among Pa, bar, atm, psi and torr.
seoTitle: Pressure Converter Online – PSI Bar Pascal ATM
seoDescription: Convert pascals, kilopascals, bar, atmospheres, PSI and torr with standard factors.
---

## Express force per area in common units

Pascals are the reference. One bar is exactly 100,000 Pa; the catalog uses `101,325 Pa` for a standard atmosphere, approximately `6,894.757 Pa` per psi and `133.322368421 Pa` per torr.

A tire reading of `35 psi` converts to about `2.413 bar` or `241.317 kPa`. That helps compare a vehicle label with a gauge using another convention. Millibar and megapascal options cover weather and high-pressure engineering ranges.

Unit conversion does not resolve the pressure reference. Gauge pressure is measured relative to local atmosphere, while absolute pressure is measured relative to vacuum; converting 35 psi gauge to bar still yields a gauge value unless atmospheric pressure is added separately. The runtime performs no such offset.

Temperature, altitude and instrument calibration can affect a real measurement. Use [Force Converter](../../force-converter/) for force alone; pressure also requires an area that this tool does not calculate.
