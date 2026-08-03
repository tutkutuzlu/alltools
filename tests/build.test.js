import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = path.resolve(import.meta.dirname, "..");

test("build generates discoverable static pages and indexes", async () => {
  await exec(process.execPath, [path.join(root, "scripts", "build.mjs")], { cwd: root });
  const home = await readFile(path.join(root, "dist", "index.html"), "utf8");
  const category = await readFile(path.join(root, "dist", "categories", "text-tools", "index.html"), "utf8");
  const tool = await readFile(path.join(root, "dist", "tools", "word-counter", "index.html"), "utf8");
  const search = JSON.parse(await readFile(path.join(root, "dist", "search", "index.json"), "utf8"));
  const sitemap = await readFile(path.join(root, "dist", "sitemap.xml"), "utf8");
  assert.match(home, /Word Counter/);
  assert.match(category, /Word Counter/);
  assert.match(tool, /data-tool-entry/);
  assert.match(tool, /application\/ld\+json/);
  assert.equal(search.items[0].id, "word-counter");
  assert.match(sitemap, /tools\/word-counter\//);
});
