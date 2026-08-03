import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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
  const runtimeConfig = await readFile(path.join(root, "dist", "assets", "js", "config", "runtime-config.js"), "utf8");
  assert.match(home, /Word Counter/);
  assert.match(home, /The tool you need/);
  assert.match(home, /Featured tool<\/h2>/);
  assert.match(home, /1 tool and growing/);
  assert.match(home, /category-card/);
  assert.match(home, /tool-card/);
  assert.match(category, /Word Counter/);
  assert.match(tool, /data-tool-entry/);
  assert.match(tool, /Your text stays in your browser/);
  assert.match(tool, /faq-section/);
  assert.match(tool, /application\/ld\+json/);
  assert.equal(search.v, 2);
  assert.equal(search.x[0].i, "word-counter");
  assert.equal(search.x[0].c, "text");
  assert.match(sitemap, /tools\/word-counter\//);
  assert.match(runtimeConfig, /"enabled":true/);
  assert.match(runtimeConfig, /G-JLNSC16GEQ/);
  assert.match(home, /googletagmanager\.com\/gtag\/js\?id=G-JLNSC16GEQ/);
  assert.match(home, /send_page_view:false/);
  await assert.rejects(access(path.join(root, "dist", "analytics", "index.html")));
  assert.doesNotMatch(sitemap, /\/analytics\//);
  assert.match(home, /href="\/alltools\//);
});

test("development build never renders the production Google tag", async () => {
  await exec(process.execPath, [path.join(root, "scripts", "build.mjs")], { cwd: root, env: { ...process.env, ANALYTICS_ENV: "development" } });
  const developmentHome = await readFile(path.join(root, "dist", "index.html"), "utf8");
  const developmentConfig = await readFile(path.join(root, "dist", "assets", "js", "config", "runtime-config.js"), "utf8");
  assert.doesNotMatch(developmentHome, /googletagmanager/);
  assert.match(developmentConfig, /"environment":"development"/);
  assert.match(developmentConfig, /"enabled":false/);
});

test("Google tag renders only for valid enabled GA4 configuration", async () => {
  const { renderGoogleTag } = await import("../scripts/lib/render.mjs");
  assert.equal(renderGoogleTag({ enabled: true, provider: "ga4", measurementId: "" }), "");
  const markup = renderGoogleTag({ enabled: true, provider: "ga4", measurementId: "G-ABC1234567", consentRequired: false });
  assert.match(markup, /googletagmanager/);
  assert.match(markup, /send_page_view:false/);
  assert.equal(renderGoogleTag({ enabled: true, provider: "ga4", measurementId: "G-ABC1234567", consentRequired: true }), "");
});
