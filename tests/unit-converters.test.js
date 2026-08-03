import test from "node:test";
import assert from "node:assert/strict";
import { conversionCatalog, converterIds } from "../src/plugins/families/unit-converters/catalog.js";
import { convertValue, formatNumber, parseNumber } from "../src/plugins/families/unit-converters/engine.js";
import { createToolUseTracker } from "../src/core/telemetry/tool-use.js";

const close=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<=tolerance*Math.max(1,Math.abs(expected)),`${actual} should be close to ${expected}`);
const cases=[
  ["length-converter",1,"m","ft",3.28083989501312],
  ["weight-converter",10,"kg","lb",22.0462262184878],
  ["temperature-converter",100,"c","f",212],
  ["volume-converter",1,"gal","l",3.785411784],
  ["area-converter",1,"acre","m2",4046.8564224],
  ["speed-converter",100,"kmh","mph",62.1371192237334],
  ["time-converter",90,"min","h",1.5],
  ["data-storage-converter",1,"MiB","B",1048576],
  ["pressure-converter",1,"atm","psi",14.6959487755134],
  ["energy-converter",1,"kwh","j",3600000],
  ["power-converter",1,"hp","w",745.699871582],
  ["force-converter",1,"lbf","n",4.4482216152605],
  ["torque-converter",100,"nm","lbfft",73.7562149277266],
  ["angle-converter",180,"deg","rad",Math.PI],
  ["frequency-converter",60,"rpm","hz",1],
  ["fuel-economy-converter",8,"l-100km","mpg-us",29.4018229166667],
  ["data-transfer-rate-converter",100,"mbps","MBs",12.5],
  ["acceleration-converter",1,"g0","ms2",9.80665],
  ["density-converter",1000,"kgm3","gcm3",1],
  ["cooking-measurement-converter",1,"cup","ml",236.5882365],
  ["font-size-converter",16,"px","rem",1],
  ["flow-rate-converter",10,"lmin","gpm",2.64172052358148],
  ["voltage-converter",5,"v","mv",5000],
  ["electric-current-converter",2,"a","ma",2000],
  ["illuminance-converter",100,"lux","fc",9.290304]
];

for(const [id,value,from,to,expected] of cases)test(`${id} converts accurately and deduplicates tool_use telemetry`,()=>{const definition=conversionCatalog[id];assert.ok(definition);const result=convertValue(definition,String(value),{from,to,precision:"auto"});close(result.numeric,expected);assert.ok(result.output);const events=[];let callback;const tracker=createToolUseTracker({telemetry:{trackToolUse:event=>events.push(event)},toolId:id,category:"unit",debounceMs:1,setTimer:fn=>{callback=fn;return 1;},clearTimer(){}});tracker.observe(true);tracker.observe(true);callback();tracker.observe(true);assert.deepEqual(events,[{toolId:id,category:"unit",source:"meaningful_input"}]);});

test("catalog contains exactly 25 converters with valid defaults",()=>{assert.equal(converterIds.length,25);for(const definition of Object.values(conversionCatalog)){assert.ok(definition.units[definition.defaultFrom]);assert.ok(definition.units[definition.defaultTo]);assert.notEqual(definition.defaultFrom,definition.defaultTo);}});
test("number parsing, precision and invalid values are handled safely",()=>{assert.equal(parseNumber("1,234.5"),1234.5);assert.equal(parseNumber(""),null);assert.throws(()=>parseNumber("Infinity"),/finite/);assert.equal(formatNumber(1/3,"4"),"0.3333");assert.throws(()=>formatNumber(Infinity),/range/);});
test("temperature and reciprocal fuel conversions enforce physical input limits",()=>{assert.throws(()=>convertValue(conversionCatalog["temperature-converter"],"-300",{from:"c",to:"f"}),/absolute zero/);assert.throws(()=>convertValue(conversionCatalog["fuel-economy-converter"],"0",{from:"l-100km",to:"mpg-us"}),/greater than zero/);const mpg=convertValue(conversionCatalog["fuel-economy-converter"],"8",{from:"l-100km",to:"mpg-us"}).numeric;close(convertValue(conversionCatalog["fuel-economy-converter"],String(mpg),{from:"mpg-us",to:"l-100km"}).numeric,8);});
