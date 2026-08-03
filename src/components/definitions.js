import { registerComponent } from "./registry.js";

registerComponent("field.textarea", (props) => {
  if (!props.id || !props.label) throw new TypeError("Textarea requires id and label.");
  const group = document.createElement("div");
  group.className = "field-group";
  const label = document.createElement("label");
  label.className = "field-label";
  label.htmlFor = props.id;
  label.textContent = props.label;
  const input = document.createElement("textarea");
  input.className = "text-editor";
  input.id = props.id;
  input.name = props.id;
  input.rows = Number(props.rows) || 8;
  input.placeholder = props.placeholder ?? "";
  input.autofocus = Boolean(props.autofocus);
  group.append(label, input);
  return { element: group, input };
});

registerComponent("result.stats", (props) => {
  const section = document.createElement("section");
  section.className = "stats-grid";
  section.setAttribute("aria-label", props.label ?? "Results");
  section.setAttribute("aria-live", "polite");
  const values = new Map();
  for (const item of props.items ?? []) {
    const card = document.createElement("div");
    card.className = "stat-card";
    const value = document.createElement("strong");
    value.className = "stat-value";
    value.textContent = String(item.value ?? 0);
    const label = document.createElement("span");
    label.className = "stat-label";
    label.textContent = item.label;
    card.append(value, label);
    section.append(card);
    values.set(item.id, value);
  }
  return {
    element: section,
    update(nextValues) {
      for (const [id, value] of Object.entries(nextValues)) {
        if (values.has(id)) values.get(id).textContent = String(value);
      }
    }
  };
});

registerComponent("action.button", (props) => {
  const button = document.createElement("button");
  button.className = `button button--${props.variant ?? "primary"}`;
  button.type = props.type ?? "button";
  button.textContent = props.label ?? "Button";
  return { element: button };
});
