import { analyzeText } from "../../families/text-tools/metrics.js";
import { createToolUseTracker } from "../../../core/telemetry/tool-use.js";

let cleanup;

export function mount(root, context) {
  const useTracker = createToolUseTracker({ telemetry: context.telemetry, toolId: context.toolId, category: "text" });
  const shell = context.components.create("tool.shell", {
    toolbarLabel: "Word Counter actions",
    actions: [
      { id: "paste", label: "Paste", icon: "paste", variant: "secondary" },
      { id: "clear", label: "Clear", icon: "clear", variant: "secondary" },
      { id: "copy", label: "Copy text", icon: "copy", variant: "secondary" }
    ],
    editor: {
      id: "word-counter-input",
      label: "Enter your text",
      placeholder: "Type or paste your text here…",
      rows: 10,
      autofocus: true
    },
    resultLabel: "Text statistics",
    metrics: [
      { id: "words", label: "Words", value: 0 },
      { id: "characters", label: "Characters", value: 0 },
      { id: "charactersWithoutSpaces", label: "Characters without spaces", value: 0 },
      { id: "sentences", label: "Sentences", value: 0 },
      { id: "readingTimeMinutes", label: "Reading time", value: "0 min" }
    ]
  });
  root.replaceChildren(shell.element);

  const update = () => {
    const result = analyzeText(shell.input.value);
    shell.results.update({ ...result, readingTimeMinutes: `${result.readingTimeMinutes} min` });
    useTracker.observe(result.charactersWithoutSpaces > 0);
  };
  const clear = () => {
    shell.input.value = "";
    update();
    shell.input.focus();
    context.telemetry.trackClear({ toolId: context.toolId });
  };
  const paste = async () => {
    try {
      shell.input.value = await context.clipboard.readText();
      update();
      shell.input.focus();
      shell.notice.show("Text pasted.");
      context.telemetry.trackPaste({ toolId: context.toolId });
    } catch {
      shell.notice.show("Paste permission was not available. Use your browser's paste command.");
    }
  };
  const copy = async () => {
    if (!shell.input.value) return shell.notice.show("There is no text to copy.");
    try {
      await context.clipboard.writeText(shell.input.value);
      shell.notice.show("Text copied.");
      context.telemetry.trackCopy({ toolId: context.toolId });
    } catch {
      shell.notice.show("Copy was not available. Select the text and copy it manually.");
    }
  };

  const pasteButton = shell.actions.get("paste").element;
  const clearButton = shell.actions.get("clear").element;
  const copyButton = shell.actions.get("copy").element;
  shell.input.addEventListener("input", update);
  pasteButton.addEventListener("click", paste);
  clearButton.addEventListener("click", clear);
  copyButton.addEventListener("click", copy);
  update();

  cleanup = () => {
    shell.input.removeEventListener("input", update);
    pasteButton.removeEventListener("click", paste);
    clearButton.removeEventListener("click", clear);
    copyButton.removeEventListener("click", copy);
    shell.notice.clear();
    useTracker.cancel();
  };
}

export function unmount() {
  cleanup?.();
  cleanup = undefined;
}
