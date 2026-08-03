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
  const robots = await readFile(path.join(root, "dist", "robots.txt"), "utf8");
  const adsText = await readFile(path.join(root, "dist", "ads.txt"), "utf8");
  assert.match(home, /Word Counter/);
  assert.match(home, /The tool you need/);
  assert.match(home, /Featured tools<\/h2>/);
  assert.match(home, /19 tools and growing/);
  assert.match(home, /category-card/);
  assert.match(home, /tool-card/);
  assert.match(category, /Word Counter/);
  const expectedCategoryOrder = ["Word Counter", "Character Counter", "Case Converter", "Line Counter", "Sentence Counter", "Paragraph Counter", "Remove Duplicate Lines", "Remove Empty Lines", "Whitespace Cleaner", "Text Sorter", "Text Reverser", "URL Encoder", "URL Decoder", "Base64 Encoder", "Base64 Decoder", "HTML Encoder", "HTML Decoder", "ROT13 Converter", "Lorem Ipsum Generator"];
  const categoryPositions = expectedCategoryOrder.map((title) => category.indexOf(`<strong>${title}</strong>`));
  assert.ok(categoryPositions.every((position) => position >= 0), "category should contain every Text Tool");
  assert.deepEqual(categoryPositions, [...categoryPositions].sort((a, b) => a - b), "category should follow user-intent order");
  assert.match(tool, /data-tool-entry/);
  assert.match(tool, /Your text stays in your browser/);
  assert.match(tool, /faq-section/);
  assert.match(tool, /application\/ld\+json/);
  assert.equal(search.v, 2);
  assert.equal(search.x.find((item) => item.i === "word-counter").c, "text");
  assert.equal(search.x.length, 19);
  for (const id of ["character-counter","case-converter","remove-duplicate-lines","remove-empty-lines","text-sorter","text-reverser","whitespace-cleaner","line-counter","sentence-counter","paragraph-counter","url-encoder","url-decoder","base64-encoder","base64-decoder","html-encoder","html-decoder","rot13-converter","lorem-ipsum-generator"]) {
    assert.ok(search.x.some((item) => item.i === id), `${id} should be searchable`);
    assert.match(sitemap, new RegExp(`tools/${id}/`));
    const generatedToolPage = await readFile(path.join(root, "dist", "tools", id, "index.html"), "utf8");
    assert.match(generatedToolPage, /application\/ld\+json/);
    assert.match(generatedToolPage, /Your text stays in your browser/);
    assert.match(generatedToolPage, /Frequently asked questions/);
    assert.match(generatedToolPage, /Related text tools/);
  }
  assert.match(sitemap, /tools\/word-counter\//);
  assert.match(runtimeConfig, /"enabled":true/);
  assert.match(runtimeConfig, /G-JLNSC16GEQ/);
  assert.match(home, /googletagmanager\.com\/gtag\/js\?id=G-JLNSC16GEQ/);
  assert.match(home, /send_page_view:false/);
  assert.match(home, /page_location:cleanAnalyticsUrl\(location\.href\)/);
  assert.match(home, /page_referrer:cleanAnalyticsUrl\(document\.referrer\)/);
  await assert.rejects(access(path.join(root, "dist", "analytics", "index.html")));
  assert.doesNotMatch(sitemap, /\/analytics\//);
  assert.match(home, /href="\/alltools\//);
  for (const slug of ["about", "contact", "privacy", "terms"]) {
    const page = await readFile(path.join(root, "dist", slug, "index.html"), "utf8");
    assert.match(page, new RegExp(`href="/alltools/${slug}/"`));
    assert.match(page, /aria-label="Legal and company"/);
    assert.match(page, /application\/ld\+json/);
    assert.match(sitemap, new RegExp(`/${slug}/`));
  }
  assert.match(robots, /User-agent: Mediapartners-Google\nAllow: \//);
  assert.match(robots, /User-agent: Google-Display-Ads-Bot\nAllow: \//);
  assert.match(robots, /\/alltools\/sitemap\.xml/);
  assert.equal(adsText, "google.com, pub-8757964996370629, DIRECT, f08c47fec0942fa0\n");
  for (const html of [home, category, tool]) {
    assert.equal((html.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-8757964996370629/g) ?? []).length, 1);
    assert.match(html, /crossorigin="anonymous"><\/script>\s*<\/head>/);
  }
  const homeSectionIds = [...home.matchAll(/<section class="section section--tools" id="([^"]+)"[\s\S]*?<\/section>/g)]
    .map((match) => ({ section: match[1], ids: [...match[0].matchAll(/href="\/alltools\/tools\/([^/]+)\//g)].map((item) => item[1]) }));
  assert.deepEqual(homeSectionIds.map((item) => [item.section, item.ids.length]), [["tools", 6], ["new", 6], ["popular", 6]]);
  const homeToolIds = homeSectionIds.flatMap((item) => item.ids);
  assert.equal(new Set(homeToolIds).size, homeToolIds.length, "home discovery sections must not repeat tools");
});

test("development build never renders the production Google tag", async () => {
  await exec(process.execPath, [path.join(root, "scripts", "build.mjs")], { cwd: root, env: { ...process.env, ANALYTICS_ENV: "development" } });
  const developmentHome = await readFile(path.join(root, "dist", "index.html"), "utf8");
  const developmentConfig = await readFile(path.join(root, "dist", "assets", "js", "config", "runtime-config.js"), "utf8");
  assert.doesNotMatch(developmentHome, /googletagmanager/);
  assert.doesNotMatch(developmentHome, /adsbygoogle|pagead2\.googlesyndication/);
  assert.match(developmentConfig, /"environment":"development"/);
  assert.match(developmentConfig, /"enabled":false/);
});

test("AdSense tag renders only for valid production configuration", async () => {
  const { renderAdSenseTag } = await import("../scripts/lib/render.mjs");
  const valid = { enabled: true, provider: "google", publisherId: "pub-8757964996370629", environment: "production" };
  assert.match(renderAdSenseTag(valid), /client=ca-pub-8757964996370629/);
  assert.equal(renderAdSenseTag({ ...valid, environment: "development" }), "");
  assert.equal(renderAdSenseTag({ ...valid, publisherId: "" }), "");
  assert.equal(renderAdSenseTag({ ...valid, enabled: false }), "");
});

test("Google tag renders only for valid enabled GA4 configuration", async () => {
  const { renderGoogleTag } = await import("../scripts/lib/render.mjs");
  assert.equal(renderGoogleTag({ enabled: true, provider: "ga4", measurementId: "" }), "");
  const markup = renderGoogleTag({ enabled: true, provider: "ga4", measurementId: "G-ABC1234567", consentRequired: false });
  assert.match(markup, /googletagmanager/);
  assert.match(markup, /send_page_view:false/);
  assert.equal(renderGoogleTag({ enabled: true, provider: "ga4", measurementId: "G-ABC1234567", consentRequired: true }), "");
});
