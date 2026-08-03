import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { discoverProject, rootDir, pathExists } from "./lib/project.mjs";
import { hasIcon } from "../src/components/icons.js";

function parseArgs(values) {
  const result = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) continue;
    const next = values[index + 1];
    if (!next || next.startsWith("--")) throw new Error(`Missing value for ${value}`);
    result[value.slice(2)] = next;
    index += 1;
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
if (!args.name || !args.slug || !args.category) {
  console.error('Usage: npm run tool:new -- --name "Tool Name" --slug tool-name --category text [--icon text] [--family text-tools]');
  process.exit(1);
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.slug)) throw new Error("Slug must use lowercase letters, numbers and hyphens.");

const project = await discoverProject();
if (!project.categories.some((category) => category.id === args.category)) throw new Error(`Category does not exist: ${args.category}`);
const icon = args.icon ?? "text";
if (!hasIcon(icon)) throw new Error(`Unknown icon: ${icon}`);
const family = args.family ?? "text-tools";
if (family !== "text-tools") throw new Error(`Unsupported V1 family: ${family}`);
const directory = path.join(rootDir, "src", "plugins", "tools", args.slug);
if (await pathExists(directory) || project.tools.some((tool) => tool.slug === args.slug || tool.id === args.slug)) throw new Error(`Tool already exists: ${args.slug}`);

await mkdir(path.join(directory, "tests"), { recursive: true });
await writeFile(path.join(directory, "tool.json"), `${JSON.stringify({
  schemaVersion: 1,
  id: args.slug,
  version: "0.1.0",
  type: "tool",
  family,
  variant: "transformer",
  slug: args.slug,
  icon,
  status: "draft",
  entry: "./index.js",
  category: args.category,
  tags: ["text"],
  aliases: [],
  featured: false,
  popularity: 0,
  estimatedTime: "instant",
  components: ["tool.shell"],
  capabilities: { offline: true, fileAccess: false, networkAccess: false, webWorker: false },
  discovery: { priority: 0 }
}, null, 2)}\n`);
await writeFile(path.join(directory, "content.md"), `---\ntitle: ${args.name}\nshortDescription: TODO\nseoTitle: ${args.name} – Free Online Tool\nseoDescription: TODO\n---\n\n## About ${args.name}\n\nTODO\n`);
await writeFile(path.join(directory, "index.js"), `import { createTextTransformerPlugin } from "../../families/text-tools/transformer.js";\n\nconst plugin = createTextTransformerPlugin({\n  id: "${args.slug}",\n  inputLabel: "Input text",\n  outputLabel: "Result",\n  transform(text) {\n    return text; // TODO: implement the transformation.\n  }\n});\n\nexport const mount = plugin.mount;\nexport const unmount = plugin.unmount;\n`);
await writeFile(path.join(directory, "tests", "plugin.test.js"), `import test from "node:test";\nimport assert from "node:assert/strict";\nimport { mount, unmount } from "../index.js";\n\ntest("${args.name} exposes the plugin contract", () => {\n  assert.equal(typeof mount, "function");\n  assert.equal(typeof unmount, "function");\n});\n`);
console.log(`Created draft tool plugin: src/plugins/tools/${args.slug}`);
