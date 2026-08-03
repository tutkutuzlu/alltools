const definitions = new Map();

export function registerComponent(id, factory) {
  if (!id || typeof factory !== "function") throw new TypeError("A component id and factory are required.");
  if (definitions.has(id)) throw new Error(`Component already registered: ${id}`);
  definitions.set(id, factory);
}

export function createComponent(id, props = {}) {
  const factory = definitions.get(id);
  if (!factory) throw new Error(`Unknown component: ${id}`);
  return factory(Object.freeze({ ...props }));
}

export const components = Object.freeze({ create: createComponent });
