const placements = new Set(["top", "inline", "sidebar", "result"]);
let adapter = Object.freeze({ enabled: false, placements: Object.freeze({}) });

export function setAdAdapter(nextAdapter) {
  if (!nextAdapter || typeof nextAdapter !== "object") throw new TypeError("Ad adapter must be an object.");
  adapter = Object.freeze({ enabled: Boolean(nextAdapter.enabled), placements: Object.freeze({ ...(nextAdapter.placements ?? {}) }) });
}

export const ads = Object.freeze({
  isEnabled(placement) {
    if (!placements.has(placement)) throw new Error(`Unsupported ad placement: ${placement}`);
    return adapter.enabled && adapter.placements[placement] === true;
  },
  placements: Object.freeze([...placements])
});
