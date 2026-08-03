export function createTextTransformerPlugin(definition) {
  if (!definition?.id || typeof definition.transform !== "function") throw new TypeError("Text transformer requires id and transform(text).");
  let cleanup;

  return {
    mount(root, context) {
      const shell = context.components.create("tool.shell", {
        actions: [
          { id: "clear", label: "Clear", icon: "clear", variant: "secondary" },
          { id: "copy", label: "Copy result", icon: "copy", variant: "secondary" }
        ],
        editor: { id: `${definition.id}-input`, label: definition.inputLabel ?? "Input text", placeholder: definition.inputPlaceholder ?? "Enter text…", rows: definition.rows ?? 8 },
        output: { id: `${definition.id}-output`, label: definition.outputLabel ?? "Result", rows: definition.rows ?? 8 }
      });
      root.replaceChildren(shell.element);
      const update = () => { shell.output.value = definition.transform(shell.input.value); };
      const clear = () => { shell.input.value = ""; update(); shell.input.focus(); context.telemetry.trackClear({ toolId: context.toolId }); };
      const copy = async () => {
        if (!shell.output.value) return shell.notice.show("There is no result to copy.");
        try { await context.clipboard.writeText(shell.output.value); shell.notice.show("Result copied."); context.telemetry.trackCopy({ toolId: context.toolId }); }
        catch { shell.notice.show("Copy was not available. Select the result and copy it manually."); }
      };
      shell.input.addEventListener("input", update);
      shell.actions.get("clear").element.addEventListener("click", clear);
      shell.actions.get("copy").element.addEventListener("click", copy);
      update();
      cleanup = () => {
        shell.input.removeEventListener("input", update);
        shell.actions.get("clear").element.removeEventListener("click", clear);
        shell.actions.get("copy").element.removeEventListener("click", copy);
        shell.notice.clear();
      };
    },
    unmount() { cleanup?.(); cleanup = undefined; }
  };
}
