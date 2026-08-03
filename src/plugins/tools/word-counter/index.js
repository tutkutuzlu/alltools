import { analyzeText } from "../../families/text-tools/metrics.js";

let cleanup = null;

export function mount(root, context) {
  const editor = context.components.create("field.textarea", {
    id: "word-counter-input",
    label: "Enter your text",
    placeholder: "Type or paste your text here…",
    rows: 10,
    autofocus: true
  });
  const stats = context.components.create("result.stats", {
    label: "Text statistics",
    items: [
      { id: "words", label: "Words", value: 0 },
      { id: "characters", label: "Characters", value: 0 },
      { id: "charactersWithoutSpaces", label: "Without spaces", value: 0 },
      { id: "sentences", label: "Sentences", value: 0 },
      { id: "readingTimeMinutes", label: "Reading time", value: "0 min" }
    ]
  });
  const clearButton = context.components.create("action.button", {
    label: "Clear text",
    variant: "secondary",
    type: "button"
  });

  const actions = document.createElement("div");
  actions.className = "tool-actions";
  actions.append(clearButton.element);
  root.replaceChildren(editor.element, actions, stats.element);

  const update = () => {
    const result = analyzeText(editor.input.value);
    stats.update({
      ...result,
      readingTimeMinutes: `${result.readingTimeMinutes} min`
    });
  };
  const clear = () => {
    editor.input.value = "";
    update();
    editor.input.focus();
  };

  editor.input.addEventListener("input", update);
  clearButton.element.addEventListener("click", clear);
  update();

  cleanup = () => {
    editor.input.removeEventListener("input", update);
    clearButton.element.removeEventListener("click", clear);
  };
}

export function unmount() {
  cleanup?.();
  cleanup = null;
}
