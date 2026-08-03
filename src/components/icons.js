const ICONS = {
  logo: '<path d="M6.5 4.5h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z"/><path d="M8 9h8M8 12h5M8 15h7"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  text: '<path d="M5 6h14M9 6v12m6-12v12M7 18h4m2 0h4"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m5 17 4-4 3 3 2-2 5 3"/>',
  pdf: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M8 16h8M8 12h5"/>',
  calculator: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6h8v3H8zm0 7h1m3 0h1m3 0h1m-9 4h1m3 0h1m3 0h1"/>',
  converter: '<path d="M5 7h13m-4-4 4 4-4 4M19 17H6m4 4-4-4 4-4"/>',
  generator: '<path d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2Z"/><path d="m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"/>',
  developer: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14"/>',
  color: '<path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h5a4 4 0 0 0 4-4c0-3.3-4-6-9-6Z"/><circle cx="7.5" cy="10" r=".7"/><circle cx="9" cy="6.5" r=".7"/><circle cx="14" cy="6.5" r=".7"/>',
  seo: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M8 11l2 2 4-5"/>',
  game: '<path d="M8 8h8a5 5 0 0 1 4.6 7l-1.1 2.6a2 2 0 0 1-3.4.5L14.5 16h-5l-1.6 2.1a2 2 0 0 1-3.4-.5L3.4 15A5 5 0 0 1 8 8Z"/><path d="M7 12h4m-2-2v4m6-2h.01m2 2h.01"/>',
  "word-count": '<path d="M5 5h14M5 9h9M5 13h14M5 17h7"/><path d="M17 16.5h2.5V19"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  "arrow-right": '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  sun: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
  moon: '<path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z"/>',
  system: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  paste: '<path d="M9 5h6l1 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2l1-2Z"/><path d="M9 12h6m-6 4h6"/>',
  clear: '<path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6"/>',
  copy: '<rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  fast: '<path d="M13 2 5 14h7l-1 8 8-12h-7l1-8Z"/>',
  private: '<path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/>',
  simple: '<path d="M5 7h14M5 12h9M5 17h5"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>'
};

ICONS.shield = ICONS.private;
ICONS.speed = ICONS.fast;
ICONS.simplicity = ICONS.simple;
Object.freeze(ICONS);

export function hasIcon(name) {
  return Object.hasOwn(ICONS, name);
}

export function iconMarkup(name, className = "icon", options = {}) {
  const content = ICONS[name] ?? ICONS.text;
  const accessibility = options.label ? `role="img" aria-label="${String(options.label).replace(/"/g, "&quot;")}"` : 'aria-hidden="true"';
  return `<svg class="${className}" ${accessibility} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`;
}

export function createIcon(name, className = "icon", options = {}) {
  const template = document.createElement("template");
  template.innerHTML = iconMarkup(name, className, options);
  return template.content.firstElementChild;
}
