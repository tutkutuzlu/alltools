import { conversionCatalog } from "./catalog.js";
import { convertValue } from "./engine.js";
import { createToolUseTracker } from "../../../core/telemetry/tool-use.js";

let cleanup;
const optionsFor = (units) => Object.entries(units).map(([value, definition]) => ({ value, label: definition.label }));

export function mount(root, context) {
  const definition = conversionCatalog[context.toolId];
  if (!definition) throw new Error(`Unknown unit converter: ${context.toolId}`);
  const tracker = createToolUseTracker({ telemetry: context.telemetry, toolId: context.toolId, category: "unit" });
  const unitOptions = optionsFor(definition.units);
  const shell = context.components.create("tool.shell", {
    toolbarLabel: "Converter actions",
    actions: [
      { id: "paste", label: "Paste", icon: "paste", variant: "secondary" },
      { id: "clear", label: "Clear", icon: "clear", variant: "secondary" },
      { id: "swap", label: "Swap units", icon: "converter", variant: "secondary" },
      { id: "copy", label: "Copy result", icon: "copy", variant: "secondary" }
    ],
    controls: [
      { id: "from", label: "From", component: "field.select", options: unitOptions, value: definition.defaultFrom },
      { id: "to", label: "To", component: "field.select", options: unitOptions, value: definition.defaultTo },
      { id: "precision", label: "Precision", component: "field.select", options: [{value:"auto",label:"Automatic"},{value:"2",label:"2 decimals"},{value:"4",label:"4 decimals"},{value:"6",label:"6 decimals"}], value: "auto" }
    ],
    editor: { id: `${definition.id}-input`, component: "field.input", type: "text", inputmode: "decimal", label: "Value", placeholder: "Enter a number", autofocus: true },
    output: { id: `${definition.id}-output`, component: "field.input", type: "text", label: "Converted value" }
  });
  root.replaceChildren(shell.element);
  let lastResult = "";
  const handlers = [];
  const on = (element, event, handler) => { element.addEventListener(event, handler); handlers.push(() => element.removeEventListener(event, handler)); };
  const update = () => {
    if (!shell.input.value.trim()) { lastResult = ""; shell.output.value = ""; shell.notice.clear(); tracker.observe(false); return; }
    try {
      const options = Object.fromEntries([...shell.controls].map(([id, control]) => [id, control.input.value]));
      const result = convertValue(definition, shell.input.value, options);
      lastResult = `${result.output} ${definition.units[result.to].label}`;
      shell.output.value = lastResult;
      shell.notice.clear();
      tracker.observe(true);
    } catch (error) {
      lastResult = "";
      shell.output.value = "";
      shell.notice.show(error.message || "The value could not be converted.", 0);
    }
  };
  const paste = async () => { try { shell.input.value = await context.clipboard.readText(); update(); shell.input.focus(); context.telemetry.trackPaste({ toolId: context.toolId, category: "unit" }); } catch { shell.notice.show("Paste permission was not available."); } };
  const clear = () => { shell.input.value = ""; update(); shell.input.focus(); context.telemetry.trackClear({ toolId: context.toolId, category: "unit" }); };
  const swap = () => { const from = shell.controls.get("from").input, to = shell.controls.get("to").input, previous = from.value; from.value = to.value; to.value = previous; update(); };
  const copy = async () => { if (!lastResult) return shell.notice.show("There is no result to copy."); try { await context.clipboard.writeText(lastResult); shell.notice.show("Result copied."); context.telemetry.trackCopy({ toolId: context.toolId, category: "unit" }); } catch { shell.notice.show("Copy was not available."); } };
  on(shell.input, "input", update);
  for (const control of shell.controls.values()) on(control.input, "change", update);
  for (const [id, handler] of Object.entries({ paste, clear, swap, copy })) on(shell.actions.get(id).element, "click", handler);
  update();
  cleanup = () => { for (const remove of handlers) remove(); tracker.cancel(); shell.notice.clear(); };
}

export function unmount() { cleanup?.(); cleanup = undefined; }
