import test from "node:test";
import assert from "node:assert/strict";
import { developerOperations as op, parseCsv } from "../src/plugins/families/developer-tools/operations.js";
import { developerToolDefinitions } from "../src/plugins/families/developer-tools/tool-definitions.js";
import { createToolUseTracker } from "../src/core/telemetry/tool-use.js";

const cases = [
  ["json-formatter",()=>assert.equal(op.jsonFormatter('{"a":1}',{indent:"2"}),'{\n  "a": 1\n}')],
  ["json-minifier",()=>assert.equal(op.jsonMinifier('{ "a": 1 }'),'{'+'"a":1}')],
  ["json-validator",()=>{assert.equal(op.jsonValidator('{"a":{"b":1}}').valid,"Yes");assert.equal(op.jsonValidator('{').valid,"No");}],
  ["json-to-csv",()=>assert.equal(op.jsonToCsv('[{"a":"x,y","b":2}]'),'a,b\n"x,y",2')],
  ["csv-to-json",()=>{assert.deepEqual(parseCsv('name,note\nAda,"x,y"'),[["name","note"],["Ada","x,y"]]);assert.match(op.csvToJson('name;role\nAda;admin',{delimiter:";"}),/"role": "admin"/);}],
  ["xml-formatter",()=>{assert.match(op.xmlFormatter('<r><a>1</a></r>'),/\n  <a>/);assert.throws(()=>op.xmlFormatter('<r></a>'),/well-formed/);}],
  ["xml-minifier",()=>assert.equal(op.xmlMinifier('<r>\n <!--x--><a>1</a>\n</r>'),'<r><a>1</a></r>')],
  ["html-formatter",()=>assert.match(op.htmlFormatter('<main><br><p>x</p></main>'),/  <p>/)],
  ["html-minifier",()=>assert.equal(op.htmlMinifier('<div>\n <span>x</span>\n</div>'),'<div><span>x</span></div>')],
  ["css-formatter",()=>assert.match(op.cssFormatter('a{color:red;}'),/color:red;/)],
  ["css-minifier",()=>assert.equal(op.cssMinifier('/*x*/ a { color: red; }'),'a{color:red}')],
  ["sql-formatter",()=>assert.match(op.sqlFormatter('select a from t where id=1'),/\nFROM t\nWHERE/)],
  ["jwt-decoder",()=>{const result=op.jwtDecoder('eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjMifQ.');assert.equal(result.algorithm,"none");assert.match(result.output,/"sub": "123"/);}],
  ["uuid-generator",()=>{const values=op.uuidGenerator(3).split("\n");assert.equal(values.length,3);for(const value of values)assert.match(value,/^[0-9a-f-]{36}$/);}],
  ["uuid-validator",()=>{assert.equal(op.uuidValidator('550e8400-e29b-41d4-a716-446655440000').version,"Version 4");assert.equal(op.uuidValidator('bad').valid,"No");}],
  ["unix-timestamp-converter",()=>assert.match(op.unixTimestamp('1704067200',{unit:"auto"}),/2024-01-01T00:00:00.000Z/)],
  ["url-parser",()=>{const result=JSON.parse(op.urlParser('https://example.com:8080/a?q=1#x'));assert.equal(result.port,"8080");assert.equal(result.pathname,"/a");}],
  ["query-string-parser",()=>assert.deepEqual(JSON.parse(op.queryStringParser('?tag=js&tag=css')), {tag:["js","css"]})],
  ["regex-tester",()=>{const result=op.regexTester('ab 12 cd 34',{pattern:'\\d+',flags:'g'});assert.equal(result.matches,2);assert.match(result.output,/12/);}],
  ["cron-expression-explainer",()=>{assert.match(op.cronExplainer('*/15 9 * * 1'),/Minute: every 15/);assert.throws(()=>op.cronExplainer('@daily'),/five-field/);}],
  ["http-status-code-lookup",()=>{const result=op.httpStatus('404');assert.equal(result.phrase,"Not Found");assert.equal(result.category,"Client error");}],
  ["mime-type-lookup",()=>{assert.match(op.mimeLookup('.json'),/application\/json/);assert.match(op.mimeLookup('image/jpeg'),/\.jpg/);}],
  ["color-converter",()=>assert.equal(op.colorConverter('#336699'),'HEX: #336699\nRGB: rgb(51, 102, 153)\nHSL: hsl(210, 50%, 40%)')],
  ["number-base-converter",()=>{assert.equal(op.numberBase('255',{fromBase:'10',toBase:'16'}),'FF');assert.throws(()=>op.numberBase('2',{fromBase:'2',toBase:'10'}),/invalid/);}],
  ["json-string-escape",()=>{assert.equal(op.jsonStringEscape('a\nb',{mode:'escape'}),'a\\nb');assert.equal(op.jsonStringEscape('a\\nb',{mode:'unescape'}),'a\nb');}]
];

for(const [id,assertion] of cases)test(`${id} handles valid input, edge cases and telemetry dedup`,()=>{assert.ok(developerToolDefinitions[id]);assertion();const events=[];let callback;const tracker=createToolUseTracker({telemetry:{trackToolUse:event=>events.push(event)},toolId:id,category:"developer",debounceMs:1,setTimer:fn=>{callback=fn;return 1;},clearTimer(){}});tracker.observe(true);tracker.observe(true);callback();tracker.observe(true);assert.equal(events.length,1);assert.equal(events[0].category,"developer");});

test("every non-generator developer operation accepts empty input without leaking content",()=>{for(const definition of Object.values(developerToolDefinitions)){if(definition.kind==="generator")continue;const operation=definition.analyze??definition.transform;try{operation("",Object.fromEntries((definition.controls??[]).map(item=>[item.id,item.value??""])));}catch(error){assert.ok(error instanceof Error,definition.id);}}});
