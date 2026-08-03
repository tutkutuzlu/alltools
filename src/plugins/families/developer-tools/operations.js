const fail = (message) => { throw new Error(message); };
const parseJson = (value) => { try { return JSON.parse(String(value)); } catch (error) { return fail(`Invalid JSON: ${error.message}`); } };
const depthOf = (value) => value && typeof value === "object" ? 1 + Math.max(0, ...Object.values(value).map(depthOf)) : 0;
const typeOf = (value) => value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
const csvEscape = (value) => { const text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value); return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; };

export function parseCsv(input, delimiter = ",") {
  const rows = []; let row = []; let field = ""; let quoted = false;
  const text = String(input ?? "");
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"' && field === "") quoted = true;
    else if (char === delimiter) { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += char;
  }
  if (quoted) fail("Invalid CSV: an opening quote is not closed.");
  if (field !== "" || row.length || text.endsWith(delimiter)) { row.push(field); rows.push(row); }
  return rows;
}

const splitMarkup = (text) => String(text ?? "").replace(/>\s*</g, "><").match(/<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<[^>]+>|[^<]+/g) ?? [];
const voidHtml = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
function formatMarkup(text, html = false) {
  let depth = 0; const output = [];
  for (const raw of splitMarkup(text)) {
    const token = raw.trim(); if (!token) continue;
    const closing = /^<\//.test(token);
    if (closing) depth = Math.max(0, depth - 1);
    output.push(`${"  ".repeat(depth)}${token}`);
    const name = token.match(/^<\s*([\w:-]+)/)?.[1]?.toLowerCase();
    const opening = /^<[^!?/]/.test(token) && !/\/\s*>$/.test(token) && !(html && voidHtml.has(name));
    if (opening) depth++;
  }
  return output.join("\n");
}
function validateXml(text) {
  const stack = [];
  for (const token of splitMarkup(text).filter((part) => part.startsWith("<"))) {
    if (/^<\?|^<!/.test(token) || /\/>$/.test(token)) continue;
    const close = token.match(/^<\/\s*([\w:-]+)/);
    if (close) { if (stack.pop() !== close[1]) return false; }
    else { const open = token.match(/^<\s*([\w:-]+)/); if (open) stack.push(open[1]); }
  }
  return stack.length === 0 && /<[^>]+>/.test(text);
}
const base64UrlDecode = (value) => { const normalized = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "="); try { const bytes = Uint8Array.from(atob(normalized), (char) => char.charCodeAt(0)); return new TextDecoder().decode(bytes); } catch { return fail("The JWT contains invalid Base64URL data."); } };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-8])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/i;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
function rgbToHsl(r, g, b) { r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d)h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;h=Math.round(h*60);if(h<0)h+=360;const l=(max+min)/2,s=d?d/(1-Math.abs(2*l-1)):0;return [h,Math.round(s*100),Math.round(l*100)]; }
function parseColor(input) { const text=String(input).trim();let match=text.match(/^#([\da-f]{3}|[\da-f]{6})$/i);if(match){let hex=match[1];if(hex.length===3)hex=[...hex].map(c=>c+c).join("");return [0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));}match=text.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);if(match)return match.slice(1).map(v=>clamp(Number(v),0,255));return fail("Enter a HEX color such as #336699 or an RGB color such as rgb(51, 102, 153)."); }
const cronPart = (value, names = {}) => value === "*" ? "every value" : value.startsWith("*/") ? `every ${value.slice(2)}` : value.split(",").map(item => names[item] ?? item).join(", ");
const statusCodes = {100:"Continue",200:"OK",201:"Created",202:"Accepted",204:"No Content",301:"Moved Permanently",302:"Found",304:"Not Modified",307:"Temporary Redirect",308:"Permanent Redirect",400:"Bad Request",401:"Unauthorized",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",408:"Request Timeout",409:"Conflict",410:"Gone",413:"Content Too Large",415:"Unsupported Media Type",418:"I'm a Teapot",422:"Unprocessable Content",429:"Too Many Requests",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout"};
const mimeTypes = {html:"text/html",htm:"text/html",css:"text/css",js:"text/javascript",mjs:"text/javascript",json:"application/json",xml:"application/xml",csv:"text/csv",txt:"text/plain",md:"text/markdown",pdf:"application/pdf",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",svg:"image/svg+xml",webp:"image/webp",ico:"image/x-icon",mp3:"audio/mpeg",mp4:"video/mp4",webm:"video/webm",zip:"application/zip",wasm:"application/wasm",woff:"font/woff",woff2:"font/woff2"};

export const developerOperations = Object.freeze({
  jsonFormatter(text, { indent = "2" } = {}) { return JSON.stringify(parseJson(text), null, indent === "tab" ? "\t" : Number(indent)); },
  jsonMinifier(text) { return JSON.stringify(parseJson(text)); },
  jsonValidator(text) { try { const value=JSON.parse(text);return {valid:"Yes",type:typeOf(value),entries:value&&typeof value==="object"?Object.keys(value).length:0,depth:depthOf(value)}; } catch { return {valid:"No",type:"—",entries:0,depth:0}; } },
  jsonToCsv(text) { const data=parseJson(text);const rows=Array.isArray(data)?data:[data];if(!rows.length)return "";if(rows.some(row=>!row||typeof row!=="object"||Array.isArray(row)))fail("JSON to CSV requires an object or an array of objects.");const headers=[...new Set(rows.flatMap(Object.keys))];return [headers.map(csvEscape).join(","),...rows.map(row=>headers.map(key=>csvEscape(row[key])).join(","))].join("\n"); },
  csvToJson(text, { delimiter = "," } = {}) { const rows=parseCsv(text,delimiter);if(!rows.length)return "[]";const [headers,...body]=rows;if(new Set(headers).size!==headers.length)fail("CSV header names must be unique.");return JSON.stringify(body.filter(row=>row.some(Boolean)).map(row=>Object.fromEntries(headers.map((key,index)=>[key,row[index]??""]))),null,2); },
  xmlFormatter(text) { if(!validateXml(text))fail("Enter well-formed XML with matching tags.");return formatMarkup(text); },
  xmlMinifier(text) { if(!validateXml(text))fail("Enter well-formed XML with matching tags.");return String(text).replace(/<!--[\s\S]*?-->/g,"").replace(/>\s+</g,"><").trim(); },
  htmlFormatter(text) { return formatMarkup(text,true); },
  htmlMinifier(text) { return String(text).replace(/<!--(?!\[if)[\s\S]*?-->/g,"").replace(/>\s+</g,"><").replace(/\s{2,}/g," ").trim(); },
  cssFormatter(text) { let depth=0,out="";for(const char of String(text)){if(char==="{"){out+=` {\n${"  ".repeat(++depth)}`;}else if(char==="}"){out+=`\n${"  ".repeat(Math.max(0,--depth))}}\n${"  ".repeat(depth)}`;}else if(char===";")out+=`;\n${"  ".repeat(depth)}`;else out+=char;}return out.replace(/[ \t]+/g," ").replace(/\n +\n/g,"\n").trim(); },
  cssMinifier(text) { return String(text).replace(/\/\*[\s\S]*?\*\//g,"").replace(/\s+/g," ").replace(/\s*([{}:;,>+~])\s*/g,"$1").replace(/;}/g,"}").trim(); },
  sqlFormatter(text) { const keywords=["SELECT","FROM","WHERE","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","OUTER JOIN","UNION","VALUES","SET","RETURNING"];let output=String(text).replace(/\s+/g," ").trim();for(const keyword of keywords)output=output.replace(new RegExp(`\\s+${keyword.replace(" ","\\s+")}\\s+`,"gi"),`\n${keyword} `);return output.replace(/^\n/,"").replace(/\s*,\s*/g,",\n  "); },
  jwtDecoder(text) { const parts=String(text).trim().split(".");if(parts.length!==3)fail("A JWT must contain three dot-separated parts.");const header=parseJson(base64UrlDecode(parts[0])),payload=parseJson(base64UrlDecode(parts[1]));return {output:JSON.stringify({header,payload},null,2),algorithm:header.alg??"—",type:header.typ??"—",expires:payload.exp?new Date(payload.exp*1000).toISOString():"Not set"}; },
  uuidGenerator(amount=1) { const count=clamp(Number(amount)||1,1,100);return Array.from({length:count},()=>globalThis.crypto?.randomUUID?.()??"10000000-1000-4000-8000-100000000000".replace(/[018]/g,c=>(Number(c)^crypto.getRandomValues(new Uint8Array(1))[0]&15>>Number(c)/4).toString(16))).join("\n"); },
  uuidValidator(text) { const match=String(text).trim().match(uuidPattern);return {valid:match?"Yes":"No",version:match?`Version ${match[1]}`:"—",variant:match?"RFC 4122":"—",normalized:match?String(text).trim().toLowerCase():"—"}; },
  unixTimestamp(text, { unit = "auto" } = {}) { const raw=String(text).trim();let date;if(/^\d+$/.test(raw)){const number=Number(raw);date=new Date((unit==="seconds"||unit==="auto"&&raw.length<=10)?number*1000:number);}else date=new Date(raw);if(Number.isNaN(date.getTime()))fail("Enter a Unix timestamp or a valid date and time.");return `ISO 8601: ${date.toISOString()}\nUnix seconds: ${Math.floor(date.getTime()/1000)}\nUnix milliseconds: ${date.getTime()}\nUTC: ${date.toUTCString()}`; },
  urlParser(text) { let url;try{url=new URL(String(text).trim());}catch{fail("Enter a complete URL including http:// or https://.");}return JSON.stringify({protocol:url.protocol,username:url.username,password:url.password?"(present)":"",hostname:url.hostname,port:url.port,pathname:url.pathname,search:url.search,hash:url.hash,origin:url.origin},null,2); },
  queryStringParser(text) { const value=String(text).trim().replace(/^[^?]*\?/,"").replace(/^\?/,"").split("#")[0];const params=new URLSearchParams(value),result={};for(const [key,item] of params){if(Object.hasOwn(result,key))result[key]=Array.isArray(result[key])?[...result[key],item]:[result[key],item];else result[key]=item;}return JSON.stringify(result,null,2); },
  regexTester(text, { pattern = "", flags = "g" } = {}) { let regex;try{regex=new RegExp(pattern,flags);}catch(error){fail(`Invalid regular expression: ${error.message}`);}const matches=[...String(text).matchAll(regex.global?regex:new RegExp(regex.source,`${regex.flags}g`))];return {output:matches.map((match,index)=>`${index+1}. ${match[0]} (index ${match.index})`).join("\n"),matches:matches.length,firstIndex:matches[0]?.index??"—",pattern:`/${regex.source}/${regex.flags}`}; },
  cronExplainer(text) { const parts=String(text).trim().split(/\s+/);if(parts.length!==5)fail("Enter a standard five-field cron expression.");const months={1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"},days={0:"Sunday",1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday",7:"Sunday"};return `Minute: ${cronPart(parts[0])}\nHour: ${cronPart(parts[1])}\nDay of month: ${cronPart(parts[2])}\nMonth: ${cronPart(parts[3],months)}\nDay of week: ${cronPart(parts[4],days)}`; },
  httpStatus(text) { const code=Number(String(text).trim());const phrase=statusCodes[code];if(!phrase)fail("Enter a recognized HTTP status code such as 200, 404 or 503.");const category=code<200?"Informational":code<300?"Success":code<400?"Redirection":code<500?"Client error":"Server error";return {output:`${code} ${phrase}\nCategory: ${category}`,code,phrase,category}; },
  mimeLookup(text) { const input=String(text).trim().toLowerCase().replace(/^\./,"");const byMime=Object.entries(mimeTypes).filter(([,mime])=>mime===input).map(([ext])=>`.${ext}`);const mime=mimeTypes[input];if(!mime&&!byMime.length)fail("Enter a common file extension or MIME type.");return mime?`${mime}\nExtension: .${input}`:`${input}\nExtensions: ${byMime.join(", ")}`; },
  colorConverter(text) { const [r,g,b]=parseColor(text),hex=`#${[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("").toUpperCase()}`,[h,s,l]=rgbToHsl(r,g,b);return `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${h}, ${s}%, ${l}%)`; },
  numberBase(text, { fromBase = "10", toBase = "16" } = {}) { const from=Number(fromBase),to=Number(toBase),value=String(text).trim();if(!value) return "";if(from<2||from>36||to<2||to>36)fail("Bases must be between 2 and 36.");const digits="0123456789abcdefghijklmnopqrstuvwxyz";let result=0n;for(const char of value.toLowerCase()){const digit=digits.indexOf(char);if(digit<0||digit>=from)fail(`Digit ${char} is invalid in base ${from}.`);result=result*BigInt(from)+BigInt(digit);}return result.toString(to).toUpperCase(); },
  jsonStringEscape(text, { mode = "escape" } = {}) { if(mode==="escape")return JSON.stringify(String(text)).slice(1,-1);try{return JSON.parse(`"${String(text).replace(/"/g,'\\"')}"`);}catch{fail("Enter a valid JSON-escaped string.");} }
});
