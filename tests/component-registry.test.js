import test from "node:test";
import assert from "node:assert/strict";
import "../src/components/definitions.js";
import { listComponents } from "../src/components/registry.js";

test("V2 component contract is registered", () => {
  const ids = listComponents();
  for (const id of ["action.button", "action.icon-button", "display.badge", "feedback.notice", "field.input", "field.textarea", "field.select", "layout.toolbar", "result.panel", "result.metric-card", "card.tool", "card.category", "search.bar", "section.heading", "navigation.breadcrumb", "content.faq", "ad.slot", "tool.shell"]) {
    assert.ok(ids.includes(id), `${id} should be registered`);
  }
});
