import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { editorialScaffold, seedFile, seedOptions } from "../scripts/lib/seed-files.mjs";

test("seed files do not overwrite existing content without force", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "alltools-seed-"));
  const file = path.join(directory, "content.md");
  try {
    await seedFile(file, "manual editorial content");
    const skipped = await seedFile(file, "generated replacement");
    assert.deepEqual(skipped, { written: false, reason: "exists" });
    assert.equal(await readFile(file, "utf8"), "manual editorial content");
    await seedFile(file, "deliberate replacement", { force: true });
    assert.equal(await readFile(file, "utf8"), "deliberate replacement");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("seed options require an explicit force flag and editorial output is a draft scaffold", () => {
  assert.deepEqual(seedOptions([]), { force: false });
  assert.deepEqual(seedOptions(["--force"]), { force: true });
  const scaffold = editorialScaffold({ title: "Example", shortDescription: "A focused draft.", seoTitle: "Example Tool", seoDescription: "Example description." });
  assert.match(scaffold, /## Editorial draft/);
  assert.match(scaffold, /replace this scaffold with tool-specific guidance/);
  assert.doesNotMatch(scaffold, /## Frequently asked questions|## Privacy|## Related tools/);
});
