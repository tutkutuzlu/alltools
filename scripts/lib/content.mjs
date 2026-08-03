export function parseContent(source, fileName = "content.md") {
  const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) throw new Error(`${fileName}: front matter is required.`);
  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) throw new Error(`${fileName}: front matter is not closed.`);
  const frontMatter = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    frontMatter[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return { frontMatter, markdown: normalized.slice(end + 5).trim() };
}

function inline(value) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

export function markdownToHtml(markdown) {
  const lines = markdown.split("\n");
  const html = [];
  let listType = null;
  let paragraph = [];

  const closeParagraph = () => {
    if (paragraph.length) html.push(`<p>${inline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (listType) html.push(`</${listType}>`);
    listType = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    const ordered = /^\d+\.\s+(.+)$/.exec(line);
    const unordered = /^-\s+(.+)$/.exec(line);
    if (!line) {
      closeParagraph();
      closeList();
    } else if (heading) {
      closeParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
    } else if (ordered || unordered) {
      closeParagraph();
      const nextType = ordered ? "ol" : "ul";
      if (listType !== nextType) {
        closeList();
        html.push(`<${nextType}>`);
        listType = nextType;
      }
      html.push(`<li>${inline((ordered || unordered)[1])}</li>`);
    } else {
      closeList();
      paragraph.push(line);
    }
  }
  closeParagraph();
  closeList();
  return html.join("\n");
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
