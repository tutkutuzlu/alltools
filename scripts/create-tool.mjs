import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { rootDir, pathExists } from "./lib/project.mjs";

const args = Object.fromEntries(process.argv.slice(2).map((item, index, all) => item.startsWith("--") ? [item.slice(2), all[index + 1]] : null).filter(Boolean));
if (!args.name || !args.slug || !args.category) {
  console.error('Usage: npm run tool:new -- --name "Tool Name" --slug tool-name --category text');
  process.exit(1);
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.slug)) throw new Error("Slug must use lowercase letters, numbers and hyphens.");
const directory = path.join(rootDir, "src", "plugins", "tools", args.slug);
if (await pathExists(directory)) throw new Error(`Tool already exists: ${args.slug}`);
await mkdir(directory, { recursive: true });
await writeFile(path.join(directory, "tool.json"), `${JSON.stringify({ schemaVersion: 1, id: args.slug, version: "0.1.0", type: "tool", family: "text-tools", variant: "transformer", slug: args.slug, status: "draft", entry: "./index.js", category: args.category, tags: ["text"], aliases: [], components: ["field.textarea", "action.button"], capabilities: { offline: true, fileAccess: false, networkAccess: false, webWorker: false }, discovery: { featured: false, priority: 0 } }, null, 2)}\n`);
await writeFile(path.join(directory, "content.md"), `---\ntitle: ${args.name}\nshortDescription: TODO\nseoTitle: ${args.name} – Free Online Tool\nseoDescription: TODO\n---\n\n## About ${args.name}\n\nTODO\n`);
await writeFile(path.join(directory, "index.js"), `export function mount(root, context) {\n  root.textContent = "${args.name} is not implemented yet.";\n}\n\nexport function unmount() {}\n`);
console.log(`Created draft tool plugin: src/plugins/tools/${args.slug}`);
