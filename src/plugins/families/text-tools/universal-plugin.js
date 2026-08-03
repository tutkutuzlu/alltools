import { textToolDefinitions } from "./tool-definitions.js";
import { createToolUseTracker } from "../../../core/telemetry/tool-use.js";

let cleanup;
const actionLabels = { paste: ["Paste", "paste"], clear: ["Clear", "clear"], copy: ["Copy result", "copy"], download: ["Download result", "download"], generate: ["Generate", "simple"] };

function controlValues(shell, definition) {
  return Object.fromEntries((definition.controls ?? []).map(({ id, component }) => [id, component === "field.checkbox" ? shell.controls.get(id).input.checked : shell.controls.get(id).input.value]));
}

export function normalizeResult(value) { return typeof value === "object" && value !== null ? value : { output: String(value ?? "") }; }

export function mount(root, context) {
  const definition = textToolDefinitions[context.toolId];
  if (!definition) throw new Error(`Unknown text tool definition: ${context.toolId}`);
  const useTracker = createToolUseTracker({ telemetry: context.telemetry, toolId: context.toolId, category: "text" });
  const isGenerator = definition.kind === "generator";
  const isAnalyzer = definition.kind === "analyzer";
  const shell = context.components.create("tool.shell", {
    toolbarLabel: "Tool actions",
    actions: definition.actions.map((id) => ({ id, label: actionLabels[id][0], icon: actionLabels[id][1], variant: id === "generate" ? "primary" : "secondary" })),
    controls: definition.controls,
    editor: isGenerator ? null : { id: `${definition.id}-input`, label: "Input text", placeholder: "Type or paste text here…", rows: 9, autofocus: true },
    output: isAnalyzer ? null : { id: `${definition.id}-output`, label: isGenerator ? "Generated text" : "Result", rows: 9 },
    resultLabel: "Results",
    metrics: (definition.metrics ?? []).map(([id, label]) => ({ id, label, value: 0 }))
  });
  root.replaceChildren(shell.element);
  let lastResult = "";
  const update = ({ meaningful = false } = {}) => {
    try {
      const options = controlValues(shell, definition);
      const raw = isGenerator ? definition.generate(options.amount, options.unit) : isAnalyzer ? definition.analyze(shell.input.value) : definition.transform(shell.input.value, options);
      const result = normalizeResult(raw);
      lastResult = result.output ?? "";
      if (shell.output) shell.output.value = lastResult;
      if (shell.results) shell.results.update(result);
      shell.notice.clear();
      const hasInput = isGenerator ? meaningful : Boolean(shell.input.value.trim());
      useTracker.observe(hasInput);
    } catch (error) {
      lastResult = "";
      if (shell.output) shell.output.value = "";
      shell.notice.show(error.message || "The input could not be processed.", 0);
    }
  };
  const handlers = [];
  const on = (element, event, handler) => { element.addEventListener(event, handler); handlers.push(() => element.removeEventListener(event, handler)); };
  if (shell.input) on(shell.input, "input", () => update());
  for (const control of shell.controls.values()) on(control.input, "change", () => update({ meaningful: isGenerator }));
  const paste = async () => { try { shell.input.value = await context.clipboard.readText(); update(); shell.input.focus(); context.telemetry.trackPaste({ toolId: context.toolId, category: "text" }); } catch { shell.notice.show("Paste permission was not available."); } };
  const clear = () => { shell.input.value = ""; update(); shell.input.focus(); context.telemetry.trackClear({ toolId: context.toolId, category: "text" }); };
  const copy = async () => { if (!lastResult) return shell.notice.show("There is no result to copy."); try { await context.clipboard.writeText(lastResult); shell.notice.show("Result copied."); context.telemetry.trackCopy({ toolId: context.toolId, category: "text" }); } catch { shell.notice.show("Copy was not available."); } };
  const download = () => { if (!lastResult) return shell.notice.show("There is no result to download."); const url = URL.createObjectURL(new Blob([lastResult], { type: "text/plain;charset=utf-8" })); const link = document.createElement("a"); link.href = url; link.download = `${context.toolId}-result.txt`; link.click(); URL.revokeObjectURL(url); context.telemetry.trackDownload({ toolId: context.toolId, category: "text" }); };
  const actionHandlers = { paste, clear, copy, download, generate: () => update({ meaningful: true }) };
  for (const [id, handler] of Object.entries(actionHandlers)) if (shell.actions.has(id)) on(shell.actions.get(id).element, "click", handler);
  if (isGenerator) update(); else update();
  cleanup = () => { for (const remove of handlers) remove(); useTracker.cancel(); shell.notice.clear(); };
}

export function unmount() { cleanup?.(); cleanup = undefined; }
