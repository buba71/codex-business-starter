# Design system customization

The starter's visual identity is configured in `backend/config/services.yaml` under
the `app.brand` parameter. It is project/deployment configuration, not runtime or
user-provided data. The static stylesheet entry at `backend/assets/styles/app.css`
is the single source for presentation shared by Twig and Vue. It imports
`tokens.css`, `themes.css`, and `components.css`. Twig exposes `app.brand` to the
admin shell for metadata only.

## Brand configuration

`app.brand` contains the functional metadata consumed by Vue:

- `name`: application and text-fallback name.
- `logo`: an optional repository/deployment-owned local asset path.
- `logoAlt`: meaningful alternative text for the logo.

The semantic color tokens in `themes.css` are the single source of truth for the
approved light and dark values. Symfony does not define palettes, and Vue does
not normalize palettes or inject presentation styles at runtime.

## Tokens and themes

Color roles are intentionally semantic:

`primary`, `primaryContrast`, `accent`, `surface`, `surfaceRaised`, `text`,
`textMuted`, `border`, `danger`, and `success` map to the corresponding
`--color-*` variables in `backend/assets/styles/themes.css`. Layout and interaction
tokens (spacing, radii, elevation, focus ring, and motion) live in
`backend/assets/styles/tokens.css`.

The theme preference supports `light`, `dark`, and `system`. The preference is a
non-sensitive browser-local setting. Components should use semantic variables and
must not hard-code brand colors. Keep focus indicators and reduced-motion behavior
intact when adjusting the stylesheet.

## Logo and components

Use a local, trusted image or SVG reference for `logo`; there is no upload or
runtime logo editor. If no logo is configured, the admin shell renders a textual
mark and the login page retains the application name. `app.brand` is limited to
`name`, `logo`, and `logoAlt` for Vue; it is not a runtime theme or palette API.

Use the local Vue primitives in `backend/assets/vue/ui/` for buttons, fields, cards,
alerts, tables, dialogs, and loading/empty/error states. Preserve native semantics,
labels, keyboard focus, and the existing server-generated logout form and CSRF
token. Twig pages should extend `base.html.twig` so they load the same compiled
`app.css` entry as Vue.

## Non-goals

This design system does not implement Customer CRUD or listing behavior from #10,
and it does not add dashboard metrics or KPI work from #12. It also does not add
tenant-specific branding, persisted user profiles, uploads, or a runtime theme
editor.
