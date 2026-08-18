import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export function seedOptions(argv = process.argv.slice(2)) {
  return { force: argv.includes("--force") };
}

export async function seedFile(filePath, content, { force = false } = {}) {
  if (!force) {
    try {
      await access(filePath);
      return { written: false, reason: "exists" };
    } catch {}
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
  return { written: true };
}

export function editorialScaffold({ title, shortDescription, seoTitle, seoDescription }) {
  return `---\ntitle: ${title}\nshortDescription: ${shortDescription}\nseoTitle: ${seoTitle}\nseoDescription: ${seoDescription}\n---\n\n## Editorial draft\n\n${shortDescription}\n\nBefore publication, replace this scaffold with tool-specific guidance based on the implemented runtime, including a real use case and any relevant limitations, edge cases or standards. Add headings and FAQs only when they help the reader.\n`;
}
