import test from "node:test";
import assert from "node:assert/strict";
import { scoreSearchItem } from "../src/search/search.js";

const item = { t: "Word Counter", d: "Count text", a: ["text counter"], g: ["writing"] };

test("search prioritizes exact and prefix title matches", () => {
  assert.ok(scoreSearchItem(item, "word counter") > scoreSearchItem(item, "word"));
  assert.ok(scoreSearchItem(item, "word") > scoreSearchItem(item, "counter"));
  assert.ok(scoreSearchItem(item, "counter") > scoreSearchItem(item, "writing"));
});

test("search supports aliases", () => {
  assert.ok(scoreSearchItem(item, "text") > 0);
});
