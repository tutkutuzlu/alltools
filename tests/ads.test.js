import test from "node:test";
import assert from "node:assert/strict";
import { ads, setAdAdapter } from "../src/core/ads/ads.js";

test("advertising is disabled by default and placement-aware", () => {
  assert.equal(ads.isEnabled("top"), false);
  setAdAdapter({ enabled: true, placements: { result: true } });
  assert.equal(ads.isEnabled("top"), false);
  assert.equal(ads.isEnabled("result"), true);
});
