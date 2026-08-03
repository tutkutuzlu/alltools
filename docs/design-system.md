# AllTools Design System V2

## Direction

AllTools uses a mobile-first utility dashboard language: direct, calm and task-focused. It avoids application chrome that does not help the current task. System fonts, small SVG icons, restrained shadows and semantic color tokens keep pages fast and recognizable.

## Layers

1. Primitive tokens define spacing, radii and type scales.
2. Semantic tokens define page, surface, text, accent, status, header and card behavior.
3. Component styles consume semantic tokens; component CSS does not contain fixed hex colors.
4. Page renderers compose cards and sections from metadata.
5. Tool plugins use the Component Registry and contain only tool-specific behavior.

The required V2 semantic tokens include `--color-accent-soft`, `--color-success`, `--color-header`, `--color-card-hover`, `--shadow-card` and `--shadow-card-hover`.

## Responsive rules

- The base layout targets small screens.
- Tool and category grids use one column on mobile.
- Word Counter metrics use two columns, with the final metric spanning both columns.
- At the desktop breakpoint metrics use five columns and the tool/content layout becomes a balanced split view.
- Primary header links are hidden on narrow screens while the brand and theme control remain available.
- Reduced-motion preferences disable meaningful transitions and smooth scrolling.

## Accessibility

Interactive elements keep visible focus rings. Icons are decorative by default and may receive an accessible label when they carry meaning without adjacent text. Form controls have labels, tool notices use polite live regions and search supports keyboard navigation.
