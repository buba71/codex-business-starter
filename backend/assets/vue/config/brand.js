export const DEFAULT_BRAND = Object.freeze({
    name: 'Business Starter',
    logo: '',
    logoAlt: 'Business Starter',
    palette: { light: {}, dark: {} },
});

const paletteKeys = ['primary', 'primaryContrast', 'accent', 'surface', 'surfaceRaised', 'text', 'textMuted', 'border', 'danger', 'success'];

function objectValue(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

/** Normalize trusted, project-level bootstrap data without exposing raw config to components. */
export function resolveBrandConfig(input = {}) {
    const source = objectValue(input);
    const nested = objectValue(source.brand || source.branding || source['app.brand'] || source.application);
    const brand = Object.keys(nested).length ? nested : source;
    const palettes = objectValue(brand.palette || brand.palettes || brand.colors);

    return {
        name: typeof brand.name === 'string' && brand.name.trim() ? brand.name : DEFAULT_BRAND.name,
        logo: typeof brand.logo === 'string' ? brand.logo : DEFAULT_BRAND.logo,
        logoAlt: typeof brand.logoAlt === 'string' && brand.logoAlt.trim() ? brand.logoAlt : DEFAULT_BRAND.logoAlt,
        palette: {
            light: pickPalette(objectValue(palettes.light || brand.light)),
            dark: pickPalette(objectValue(palettes.dark || brand.dark)),
        },
    };
}

function pickPalette(palette) {
    return Object.fromEntries(paletteKeys
        .filter((key) => typeof palette[key] === 'string' && palette[key].trim())
        .map((key) => [key, palette[key].trim()]));
}

export function bootstrapBrandConfig() {
    if (typeof window === 'undefined') return resolveBrandConfig();
    return resolveBrandConfig(window.__APP_BRAND__ || window.__APP_CONFIG__ || {});
}

const cssPaletteKeys = {
    primary: '--color-primary',
    primaryContrast: '--color-primary-contrast',
    accent: '--color-accent',
    surface: '--color-surface',
    surfaceRaised: '--color-surface-raised',
    text: '--color-text',
    textMuted: '--color-text-muted',
    border: '--color-border',
    danger: '--color-danger',
    success: '--color-success',
};

export function applyBrandTokens(config) {
    if (typeof document === 'undefined') return;
    const rules = Object.entries(config.palette).map(([theme, palette]) => {
        const declarations = Object.entries(palette)
            .filter(([key]) => cssPaletteKeys[key])
            .map(([key, value]) => `${cssPaletteKeys[key]}:${value};`)
            .join('');
        const selector = theme === 'dark' ? '[data-theme="dark"]' : ':root';
        return declarations ? `${selector}{${declarations}}` : '';
    }).join('');
    let style = document.getElementById('app-brand-tokens');
    if (!style) {
        style = document.createElement('style');
        style.id = 'app-brand-tokens';
        document.head.append(style);
    }
    style.textContent = rules;
}
