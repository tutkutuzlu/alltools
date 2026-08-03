import { createComponent, registerComponent } from "./registry.js";
import { createIcon } from "./icons.js";
import { ads } from "../core/ads/ads.js";

function required(props, fields, component) {
  for (const field of fields) if (props[field] === undefined || props[field] === "") throw new TypeError(`${component} requires ${field}.`);
}

function textElement(tag, className, value) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = value ?? "";
  return element;
}

function fieldFactory(tagName) {
  return (props) => {
    required(props, ["id", "label"], `field.${tagName}`);
    const group = document.createElement("div");
    group.className = "field-group";
    const label = textElement("label", "field-label", props.label);
    label.htmlFor = props.id;
    const input = document.createElement(tagName);
    input.className = tagName === "textarea" ? "text-editor" : "form-control";
    input.id = props.id;
    input.name = props.name ?? props.id;
    if (props.placeholder) input.placeholder = props.placeholder;
    if (tagName === "textarea") input.rows = Number(props.rows) || 8;
    if (tagName === "input") input.type = props.type ?? "text";
    if (props.inputmode) input.inputMode = props.inputmode;
    if (props.value !== undefined) input.value = props.value;
    if (props.min !== undefined) input.min = props.min;
    if (props.max !== undefined) input.max = props.max;
    if (props.autofocus) input.autofocus = true;
    if (props.readonly) input.readOnly = true;
    group.append(label, input);
    return { element: group, input, label };
  };
}

registerComponent("action.button", (props) => {
  const button = document.createElement("button");
  button.className = `button button--${props.variant ?? "primary"}`;
  button.type = props.type ?? "button";
  if (props.icon) button.append(createIcon(props.icon, "button__icon"));
  button.append(textElement("span", "button__label", props.label ?? "Button"));
  if (props.title) button.title = props.title;
  if (props.disabled) button.disabled = true;
  return { element: button };
});

registerComponent("action.icon-button", (props) => {
  required(props, ["icon", "label"], "action.icon-button");
  const button = document.createElement("button");
  button.className = `icon-button ${props.className ?? ""}`.trim();
  button.type = props.type ?? "button";
  button.setAttribute("aria-label", props.label);
  button.title = props.label;
  button.append(createIcon(props.icon));
  return { element: button };
});

registerComponent("display.badge", (props) => {
  const element = textElement("span", `card-badge card-badge--${props.variant ?? "default"}`, props.label);
  return { element };
});

registerComponent("feedback.notice", (props) => {
  const element = document.createElement("p");
  element.className = `notice notice--${props.variant ?? "info"}`;
  element.setAttribute("role", props.role ?? "status");
  element.setAttribute("aria-live", props.live ?? "polite");
  element.textContent = props.message ?? "";
  let timer;
  return {
    element,
    show(message, duration = 2200) {
      globalThis.clearTimeout(timer);
      element.textContent = message;
      if (duration > 0) timer = globalThis.setTimeout(() => { element.textContent = ""; }, duration);
    },
    clear() { globalThis.clearTimeout(timer); element.textContent = ""; }
  };
});

registerComponent("field.input", fieldFactory("input"));
registerComponent("field.textarea", fieldFactory("textarea"));

registerComponent("field.checkbox", (props) => {
  required(props, ["id", "label"], "field.checkbox");
  const label = document.createElement("label");
  label.className = "checkbox-field";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = props.id;
  input.checked = props.checked === true;
  label.append(input, textElement("span", "", props.label));
  return { element: label, input, label };
});

registerComponent("field.select", (props) => {
  required(props, ["id", "label"], "field.select");
  const group = document.createElement("div");
  group.className = "field-group";
  const label = textElement("label", "field-label", props.label);
  label.htmlFor = props.id;
  const input = document.createElement("select");
  input.className = "form-control";
  input.id = props.id;
  for (const option of props.options ?? []) {
    const node = document.createElement("option");
    node.value = option.value;
    node.textContent = option.label;
    node.selected = option.value === props.value;
    input.append(node);
  }
  group.append(label, input);
  return { element: group, input, label };
});

registerComponent("layout.toolbar", (props) => {
  const element = document.createElement("div");
  element.className = "tool-actions";
  element.setAttribute("role", "toolbar");
  element.setAttribute("aria-label", props.label ?? "Tool actions");
  const items = new Map();
  for (const definition of props.items ?? []) {
    const item = createComponent(definition.component ?? "action.button", definition);
    element.append(item.element);
    items.set(definition.id, item);
  }
  return { element, items };
});

registerComponent("result.metric-card", (props) => {
  required(props, ["id", "label"], "result.metric-card");
  const element = document.createElement("div");
  element.className = "stat-card";
  element.dataset.stat = props.id;
  const value = textElement("strong", "stat-value", String(props.value ?? 0));
  const label = textElement("span", "stat-label", props.label);
  element.append(value, label);
  return { element, value, update(nextValue) { value.textContent = String(nextValue); } };
});

registerComponent("result.panel", (props) => {
  const element = document.createElement("section");
  element.className = "stats-grid";
  element.setAttribute("aria-label", props.label ?? "Results");
  element.setAttribute("aria-live", "polite");
  const metrics = new Map();
  for (const definition of props.metrics ?? props.items ?? []) {
    const metric = createComponent("result.metric-card", definition);
    element.append(metric.element);
    metrics.set(definition.id, metric);
  }
  return {
    element,
    metrics,
    update(values) { for (const [id, value] of Object.entries(values)) metrics.get(id)?.update(value); }
  };
});

registerComponent("result.stats", (props) => createComponent("result.panel", props));

registerComponent("card.tool", (props) => {
  required(props, ["href", "title", "description"], "card.tool");
  const element = document.createElement("a");
  element.className = "tool-card";
  element.href = props.href;
  const icon = document.createElement("span");
  icon.className = "card-icon";
  icon.append(createIcon(props.icon ?? "text"));
  const body = document.createElement("span");
  body.className = "tool-card__body";
  body.append(textElement("span", "category-label", props.category), textElement("strong", "", props.title), textElement("span", "tool-card__description", props.description));
  const arrow = document.createElement("span");
  arrow.className = "card-arrow";
  arrow.append(createIcon("arrow-right"));
  element.append(icon, body, arrow);
  return { element };
});

registerComponent("card.category", (props) => {
  required(props, ["href", "title", "description"], "card.category");
  const element = document.createElement("a");
  element.className = "category-card";
  element.href = props.href;
  const icon = document.createElement("span");
  icon.className = "card-icon card-icon--category";
  icon.append(createIcon(props.icon ?? "text"));
  const body = document.createElement("span");
  body.className = "category-card__body";
  body.append(textElement("strong", "", props.title), textElement("span", "", props.description), textElement("small", "", props.countLabel));
  const arrow = document.createElement("span");
  arrow.className = "card-arrow";
  arrow.append(createIcon("arrow-right"));
  element.append(icon, body, arrow);
  return { element };
});

registerComponent("search.bar", (props) => {
  const element = document.createElement("form");
  element.className = "search";
  element.setAttribute("role", "search");
  element.dataset.searchForm = "";
  const input = document.createElement("input");
  input.className = "search-input";
  input.type = "search";
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.placeholder = props.placeholder ?? "What do you need to do?";
  input.setAttribute("aria-label", props.label ?? "Search tools");
  input.dataset.searchInput = "";
  const results = document.createElement("div");
  results.className = "search-results";
  results.dataset.searchResults = "";
  results.hidden = true;
  element.append(input, results);
  return { element, input, results };
});

registerComponent("section.heading", (props) => {
  const element = document.createElement("div");
  element.className = "section-heading";
  const group = document.createElement("div");
  if (props.kicker) group.append(textElement("p", "section-kicker", props.kicker));
  group.append(textElement(props.level ?? "h2", "", props.title));
  element.append(group);
  if (props.description) element.append(textElement("p", "", props.description));
  return { element };
});

registerComponent("navigation.breadcrumb", (props) => {
  const element = document.createElement("nav");
  element.className = "breadcrumbs";
  element.setAttribute("aria-label", "Breadcrumb");
  const list = document.createElement("ol");
  for (const [index, item] of (props.items ?? []).entries()) {
    const row = document.createElement("li");
    if (item.href) { const link = textElement("a", "", item.label); link.href = item.href; row.append(link); }
    else { row.textContent = item.label; row.setAttribute("aria-current", "page"); }
    list.append(row);
  }
  element.append(list);
  return { element };
});

registerComponent("content.faq", (props) => {
  const element = document.createElement("section");
  element.className = "faq-section";
  element.append(textElement("h2", "", props.title ?? "Frequently asked questions"));
  for (const item of props.items ?? []) element.append(textElement("h3", "", item.question), textElement("p", "", item.answer));
  return { element };
});

registerComponent("ad.slot", (props) => {
  const placements = new Set(["top", "inline", "sidebar", "result"]);
  if (!placements.has(props.placement)) throw new Error(`Unsupported ad placement: ${props.placement}`);
  const enabled = props.enabled ?? ads.isEnabled(props.placement);
  if (!enabled) return { element: null, enabled: false };
  const element = document.createElement("aside");
  element.className = `ad-slot ad-slot--${props.placement}`;
  element.dataset.adSlot = props.placement;
  element.setAttribute("aria-label", "Advertisement");
  return { element, enabled: true };
});

registerComponent("tool.shell", (props) => {
  const element = document.createElement("div");
  element.className = "tool-shell";
  const toolbar = createComponent("layout.toolbar", { label: props.toolbarLabel, items: props.actions });
  const controls = new Map();
  const controlsElement = document.createElement("div");
  controlsElement.className = "tool-controls";
  for (const definition of props.controls ?? []) {
    const control = createComponent(definition.component ?? "field.input", definition);
    controlsElement.append(control.element);
    controls.set(definition.id, control);
  }
  const editor = props.editor ? createComponent(props.editor.component ?? "field.textarea", props.editor) : null;
  const output = props.output ? createComponent(props.output.component ?? "field.textarea", { ...props.output, readonly: props.output.readonly ?? true }) : null;
  const results = props.metrics?.length ? createComponent("result.panel", { label: props.resultLabel, metrics: props.metrics }) : null;
  const notice = createComponent("feedback.notice", {});
  element.append(toolbar.element);
  if (controls.size) element.append(controlsElement);
  if (editor?.element) element.append(editor.element);
  if (output) element.append(output.element);
  if (results) element.append(results.element);
  element.append(notice.element);
  return { element, input: editor?.input, output: output?.input, actions: toolbar.items, controls, results, notice };
});
