# Design system customization

The starter's visual identity is configured in `backend/config/services.yaml` under
the `app.brand` parameter. It is project/deployment configuration, not runtime or
user-provided data. Twig exposes the same trusted configuration as `app_brand`, and
the admin shell receives it through its existing Vue props.

## Brand configuration

`app.brand` contains:

- `name`: application and text-fallback name.
- `logo`: an optional repository/deployment-owned local asset path.
- `logoAlt`: meaningful alternative text for the logo.
- `palette.light` and `palette.dark`: approved hexadecimal values for the semantic
  color roles below.

The base Twig layout emits the configured light and dark colors as CSS custom
properties on every page. Vue components consume the same properties, so a palette
change does not require component changes. Keep palette values as 3-, 4-, 6-, or
8-digit hexadecimal colors; the Twig bridge ignores other values.

## Tokens and themes

Color roles are intentionally semantic:

`primary`, `primaryContrast`, `accent`, `surface`, `surfaceRaised`, `text`,
`textMuted`, `border`, `danger`, and `success` map to the corresponding
`--color-*` variables. Layout and interaction tokens (spacing, radii, elevation,
focus ring, and motion) live in `backend/assets/styles/app.css`.

The theme preference supports `light`, `dark`, and `system`. The preference is a
non-sensitive browser-local setting. Components should use semantic variables and
must not hard-code brand colors. Keep focus indicators and reduced-motion behavior
intact when adjusting the stylesheet.

## Logo and components

Use a local, trusted image or SVG reference for `logo`; there is no upload or
runtime logo editor. If no logo is configured, the admin shell renders a textual
mark and the login page retains the application name.

Use the local Vue primitives in `backend/assets/vue/ui/` for buttons, fields, cards,
alerts, tables, dialogs, and loading/empty/error states. Preserve native semantics,
labels, keyboard focus, and the existing server-generated logout form and CSRF
token. Twig pages should extend `base.html.twig` so they inherit the token bridge.

## Non-goals

This design system does not implement Customer CRUD or listing behavior from #10,
and it does not add dashboard metrics or KPI work from #12. It also does not add
tenant-specific branding, persisted user profiles, uploads, or a runtime theme
editor.
