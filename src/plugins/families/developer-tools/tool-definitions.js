import { developerOperations as op } from "./operations.js";

const modes = (values) => values.map(([value, label]) => ({ value, label }));
const select = (id, label, values, value) => ({ id, label, component: "field.select", options: modes(values), value });
const input = (id, label, value = "", type = "text") => ({ id, label, component: "field.input", value, type });
const transformer = (id, transform, controls = [], extras = {}) => ({ id, kind: "transformer", transform, controls, actions: ["paste","clear","copy",...(extras.download?["download"]:[])], ...extras });
const analyzer = (id, analyze, metrics) => ({ id, kind: "analyzer", analyze, metrics, controls: [], actions: ["paste","clear"] });

export const developerToolDefinitions = Object.freeze({
  "json-formatter": transformer("json-formatter", op.jsonFormatter, [select("indent","Indentation",[["2","2 spaces"],["4","4 spaces"],["tab","Tab"]],"2")], { download:true }),
  "json-minifier": transformer("json-minifier", op.jsonMinifier, [], { download:true }),
  "json-validator": analyzer("json-validator", op.jsonValidator, [["valid","Valid JSON"],["type","Root type"],["entries","Root entries"],["depth","Depth"]]),
  "json-to-csv": transformer("json-to-csv", op.jsonToCsv, [], { download:true }),
  "csv-to-json": transformer("csv-to-json", op.csvToJson, [select("delimiter","Delimiter",[[",","Comma"],[";","Semicolon"],["\t","Tab"],["|","Pipe"]],",")], { download:true }),
  "xml-formatter": transformer("xml-formatter", op.xmlFormatter, [], { download:true }),
  "xml-minifier": transformer("xml-minifier", op.xmlMinifier, [], { download:true }),
  "html-formatter": transformer("html-formatter", op.htmlFormatter, [], { download:true }),
  "html-minifier": transformer("html-minifier", op.htmlMinifier, [], { download:true }),
  "css-formatter": transformer("css-formatter", op.cssFormatter, [], { download:true }),
  "css-minifier": transformer("css-minifier", op.cssMinifier, [], { download:true }),
  "sql-formatter": transformer("sql-formatter", op.sqlFormatter, [], { download:true }),
  "jwt-decoder": transformer("jwt-decoder", op.jwtDecoder, [], { metrics:[["algorithm","Algorithm"],["type","Token type"],["expires","Expires"]] }),
  "uuid-generator": { id:"uuid-generator", kind:"generator", generate:op.uuidGenerator, controls:[{...input("amount","Number of UUIDs","1","number"),min:1,max:100}], actions:["generate","copy","download"] },
  "uuid-validator": analyzer("uuid-validator", op.uuidValidator, [["valid","Valid UUID"],["version","Version"],["variant","Variant"],["normalized","Normalized"]]),
  "unix-timestamp-converter": transformer("unix-timestamp-converter", op.unixTimestamp, [select("unit","Numeric input unit",[["auto","Detect automatically"],["seconds","Seconds"],["milliseconds","Milliseconds"]],"auto")]),
  "url-parser": transformer("url-parser", op.urlParser),
  "query-string-parser": transformer("query-string-parser", op.queryStringParser),
  "regex-tester": transformer("regex-tester", op.regexTester, [input("pattern","Regular expression","\\b\\w{4,}\\b"),input("flags","Flags","gi")], { metrics:[["matches","Matches"],["firstIndex","First index"],["pattern","Pattern"]] }),
  "cron-expression-explainer": transformer("cron-expression-explainer", op.cronExplainer),
  "http-status-code-lookup": transformer("http-status-code-lookup", op.httpStatus, [], { metrics:[["code","Code"],["phrase","Meaning"],["category","Category"]] }),
  "mime-type-lookup": transformer("mime-type-lookup", op.mimeLookup),
  "color-converter": transformer("color-converter", op.colorConverter),
  "number-base-converter": transformer("number-base-converter", op.numberBase, [select("fromBase","From base",[["2","Binary (2)"],["8","Octal (8)"],["10","Decimal (10)"],["16","Hexadecimal (16)"],["36","Base 36"]],"10"),select("toBase","To base",[["2","Binary (2)"],["8","Octal (8)"],["10","Decimal (10)"],["16","Hexadecimal (16)"],["36","Base 36"]],"16")]),
  "json-string-escape": transformer("json-string-escape", op.jsonStringEscape, [select("mode","Operation",[["escape","Escape string"],["unescape","Unescape string"]],"escape")])
});
