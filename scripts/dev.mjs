import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const node = process.execPath;
const build = spawn(node, [path.join(root, "scripts", "build.mjs")], { stdio: "inherit" });
const code = await new Promise((resolve) => build.on("close", resolve));
if (code !== 0) process.exit(code);

const port = Number(process.env.PORT) || 4173;
const basePath = JSON.parse(await readFile(path.join(root, "src", "config", "site.json"), "utf8")).basePath.replace(/\/$/, "");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".xml": "application/xml; charset=utf-8" };

const server = http.createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    if (basePath && pathname.startsWith(basePath)) pathname = pathname.slice(basePath.length) || "/";
    let target = path.join(root, "dist", pathname.replace(/^\//, ""));
    if ((await stat(target).catch(() => null))?.isDirectory()) target = path.join(target, "index.html");
    const data = await readFile(target);
    response.writeHead(200, { "content-type": types[path.extname(target)] ?? "application/octet-stream", "cache-control": "no-store" });
    response.end(data);
  } catch {
    response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    response.end(await readFile(path.join(root, "dist", "404.html")));
  }
});
server.listen(port, () => console.log(`Local preview: http://localhost:${port}${basePath}/`));
