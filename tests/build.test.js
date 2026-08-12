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
  const developerCategory = await readFile(path.join(root, "dist", "categories", "developer-tools", "index.html"), "utf8");
  const unitCategory = await readFile(path.join(root, "dist", "categories", "unit-converters", "index.html"), "utf8");
  const colorCategory = await readFile(path.join(root, "dist", "categories", "color-tools", "index.html"), "utf8");
  const securityCategory = await readFile(path.join(root, "dist", "categories", "security-generators", "index.html"), "utf8");
  const tool = await readFile(path.join(root, "dist", "tools", "word-counter", "index.html"), "utf8");
  const search = JSON.parse(await readFile(path.join(root, "dist", "search", "index.json"), "utf8"));
  const sitemap = await readFile(path.join(root, "dist", "sitemap.xml"), "utf8");
  const runtimeConfig = await readFile(path.join(root, "dist", "assets", "js", "config", "runtime-config.js"), "utf8");
  const robots = await readFile(path.join(root, "dist", "robots.txt"), "utf8");
  const adsText = await readFile(path.join(root, "dist", "ads.txt"), "utf8");
  assert.match(home, /Word Counter/);
  assert.match(home, /The tool you need/);
  assert.match(home, /Featured tools<\/h2>/);
  assert.match(home, /104 free browser tools/);
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
  assert.equal(search.x.length, 104);
  for (const id of ["character-counter","case-converter","remove-duplicate-lines","remove-empty-lines","text-sorter","text-reverser","whitespace-cleaner","line-counter","sentence-counter","paragraph-counter","url-encoder","url-decoder","base64-encoder","base64-decoder","html-encoder","html-decoder","rot13-converter","lorem-ipsum-generator"]) {
    assert.ok(search.x.some((item) => item.i === id), `${id} should be searchable`);
    assert.match(sitemap, new RegExp(`tools/${id}/`));
    const generatedToolPage = await readFile(path.join(root, "dist", "tools", id, "index.html"), "utf8");
    assert.match(generatedToolPage, /application\/ld\+json/);
    assert.match(generatedToolPage, /Your text stays in your browser/);
    assert.match(generatedToolPage, /Frequently asked questions/);
    assert.match(generatedToolPage, /Related text tools/);
  }
  const developerOrder=["JSON Formatter","JSON Minifier","JSON Validator","JSON to CSV Converter","CSV to JSON Converter","XML Formatter","XML Minifier","HTML Formatter","HTML Minifier","CSS Formatter","CSS Minifier","SQL Formatter","JWT Decoder","UUID Generator","UUID Validator","Unix Timestamp Converter","URL Parser","Query String Parser","Regex Tester","Cron Expression Explainer","HTTP Status Code Lookup","MIME Type Lookup","Color Converter","Number Base Converter","JSON String Escape"];
  const developerPositions=developerOrder.map(title=>developerCategory.indexOf(`<strong>${title}</strong>`));
  assert.ok(developerPositions.every(position=>position>=0),"category should contain all Developer Tools");
  assert.deepEqual(developerPositions,[...developerPositions].sort((a,b)=>a-b),"Developer Tools should follow catalog priority");
  for(const id of ["json-formatter","json-minifier","json-validator","json-to-csv","csv-to-json","xml-formatter","xml-minifier","html-formatter","html-minifier","css-formatter","css-minifier","sql-formatter","jwt-decoder","uuid-generator","uuid-validator","unix-timestamp-converter","url-parser","query-string-parser","regex-tester","cron-expression-explainer","http-status-code-lookup","mime-type-lookup","color-converter","number-base-converter","json-string-escape"]){
    const item=search.x.find(entry=>entry.i===id);assert.equal(item?.c,"developer",`${id} should be in Developer Tools search`);assert.match(sitemap,new RegExp(`tools/${id}/`));const page=await readFile(path.join(root,"dist","tools",id,"index.html"),"utf8");assert.match(page,/WebApplication/);assert.match(page,/BreadcrumbList/);assert.match(page,/This tool runs in your browser/);assert.match(page,/Related developer tools/);
  }
  const unitOrder=["Length Converter","Weight Converter","Temperature Converter","Volume Converter","Area Converter","Speed Converter","Time Converter","Data Storage Converter","Pressure Converter","Energy Converter","Power Converter","Force Converter","Torque Converter","Angle Converter","Frequency Converter","Fuel Economy Converter","Data Transfer Rate Converter","Acceleration Converter","Density Converter","Cooking Measurement Converter","Font Size Converter","Flow Rate Converter","Voltage Converter","Electric Current Converter","Illuminance Converter"];
  const unitPositions=unitOrder.map(title=>unitCategory.indexOf(`<strong>${title}</strong>`));
  assert.ok(unitPositions.every(position=>position>=0),"category should contain all Unit Converters");
  assert.deepEqual(unitPositions,[...unitPositions].sort((a,b)=>a-b),"Unit Converters should follow catalog priority");
  for(const id of ["length-converter","weight-converter","temperature-converter","volume-converter","area-converter","speed-converter","time-converter","data-storage-converter","pressure-converter","energy-converter","power-converter","force-converter","torque-converter","angle-converter","frequency-converter","fuel-economy-converter","data-transfer-rate-converter","acceleration-converter","density-converter","cooking-measurement-converter","font-size-converter","flow-rate-converter","voltage-converter","electric-current-converter","illuminance-converter"]){const item=search.x.find(entry=>entry.i===id);assert.equal(item?.c,"unit",`${id} should be in Unit Converter search`);assert.match(sitemap,new RegExp(`tools/${id}/`));const page=await readFile(path.join(root,"dist","tools",id,"index.html"),"utf8");assert.match(page,/WebApplication/);assert.match(page,/BreadcrumbList/);assert.match(page,/This tool runs in your browser/);assert.match(page,/Related unit converters/);}
  const colorIds=["hex-to-rgb","rgb-to-hex","hex-to-hsl","hsl-to-hex","rgb-to-hsl","hsl-to-rgb","hex-to-cmyk","cmyk-to-hex","rgb-to-hsv","hsv-to-rgb","color-picker","random-color-generator","color-palette-generator","complementary-color-generator","analogous-color-generator","triadic-color-generator","tint-shade-generator","color-mixer","gradient-generator","contrast-checker","wcag-color-accessibility-checker","css-color-converter","color-name-lookup","opacity-alpha-calculator","lighten-darken-color"];
  const colorPositions=colorIds.map(id=>colorCategory.indexOf(`href="/alltools/tools/${id}/"`));assert.ok(colorPositions.every(position=>position>=0),"category should contain all Color Tools");assert.deepEqual(colorPositions,[...colorPositions].sort((a,b)=>a-b),"Color Tools should follow catalog priority");
  for(const id of colorIds){const item=search.x.find(entry=>entry.i===id);assert.equal(item?.c,"color",`${id} should be in Color Tools search`);assert.match(sitemap,new RegExp(`tools/${id}/`));const page=await readFile(path.join(root,"dist","tools",id,"index.html"),"utf8");assert.match(page,/WebApplication/);assert.match(page,/BreadcrumbList/);assert.match(page,/This tool runs in your browser/);assert.match(page,/Related color tools/);assert.equal((page.match(/googletagmanager\.com\/gtag\/js/g)??[]).length,1);assert.equal((page.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)??[]).length,1);}
  const securityIds=["password-generator","password-strength-checker","random-string-generator","secure-token-generator","hash-generator","hmac-generator","checksum-calculator","passphrase-generator","pin-generator","uuid-v7-generator"];
  const securityPositions=securityIds.map(id=>securityCategory.indexOf(`href="/alltools/tools/${id}/"`));assert.ok(securityPositions.every(position=>position>=0),"category should contain all Security tools");assert.deepEqual(securityPositions,[...securityPositions].sort((a,b)=>a-b),"Security tools should follow metadata priority");
  for(const id of securityIds){const item=search.x.find(entry=>entry.i===id);assert.equal(item?.c,"security",`${id} should be in Security search`);assert.match(sitemap,new RegExp(`tools/${id}/`));const page=await readFile(path.join(root,"dist","tools",id,"index.html"),"utf8");assert.match(page,/WebApplication/);assert.match(page,/BreadcrumbList/);assert.match(page,/This tool runs in your browser/);assert.match(page,/Related security tools/);assert.equal((page.match(/googletagmanager\.com\/gtag\/js/g)??[]).length,1);assert.equal((page.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)??[]).length,1);}
  assert.match(sitemap, /tools\/word-counter\//);
  assert.ok(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n'));
  assert.equal(sitemap.charCodeAt(0), 60, "sitemap must start with < and contain no UTF-8 BOM");
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 114);
  assert.equal((sitemap.match(/<loc>https:\/\/tutkutuzlu\.github\.io\/alltools\/tools\//g) ?? []).length, 104);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/tutkutuzlu\.github\.io\/(?!alltools\/)/);
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
  const homeSectionIds = [
    ...[...home.matchAll(/<section class="section section--tools" id="([^"]+)"[\s\S]*?<\/section>/g)],
    ...[...home.matchAll(/<section class="discovery-group" id="([^"]+)"[\s\S]*?<\/section>/g)]
  ].map((match) => ({ section: match[1], ids: [...match[0].matchAll(/href="\/alltools\/tools\/([^/]+)\//g)].map((item) => item[1]) }));
  assert.deepEqual(homeSectionIds.map((item) => [item.section, item.ids.length]), [["tools", 6], ["new", 3], ["popular", 3]]);
  const homeToolIds = homeSectionIds.flatMap((item) => item.ids);
  assert.equal(new Set(homeToolIds).size, homeToolIds.length, "home discovery sections must not repeat tools");
  assert.deepEqual(new Set(homeSectionIds.find((item) => item.section === "tools").ids), new Set(["word-counter", "password-generator", "json-formatter", "length-converter", "color-picker", "case-converter"]));
  assert.match(tool, /class="category-identity">Text Tool</);
  assert.match(tool, /class="section related-tools" data-accent="violet"/);
  const relatedBlock = tool.match(/<section class="section related-tools"[\s\S]*?<\/section>/)?.[0] ?? "";
  const relatedIds = [...relatedBlock.matchAll(/href="\/alltools\/tools\/([^/]+)\//g)].map((item) => item[1]);
  assert.ok(relatedIds.length >= 4 && relatedIds.length <= 6);
  assert.equal(relatedIds.includes("word-counter"), false);
  assert.equal(new Set(relatedIds).size, relatedIds.length);
  assert.match(home, /data-accent="violet"/);
  assert.match(home, /data-accent="amber"/);
  assert.match(home, /<h2>Browse all tools<\/h2>/);
  const directlyLinkedTools = [...home.matchAll(/<a\b[^>]*href="\/alltools\/tools\/([^/]+)\/"/g)].map((match) => match[1]);
  assert.equal(new Set(directlyLinkedTools).size, 104, "home HTML must link directly to every published tool");
  const directlyLinkedCategories = [...home.matchAll(/<a\b[^>]*href="\/alltools\/categories\/([^/]+)\/"/g)].map((match) => match[1]);
  assert.equal(new Set(directlyLinkedCategories).size, 5, "home HTML must link to every published category");
  assert.match(tool, /<nav class="breadcrumbs"[\s\S]*?<a href="\/alltools\/">Home<\/a>/);
  assert.match(tool, /<a href="\/alltools\/categories\/text-tools\/">Text Tools<\/a>/);
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
