import { ref } from 'vue';

export const THEME_PREFERENCES = ['light', 'dark', 'system'];
export const THEME_STORAGE_KEY = 'business-starter-theme';

const preference = ref('system');
let initialized = false;
let mediaQuery;

function validPreference(value) {
    return THEME_PREFERENCES.includes(value) ? value : 'system';
}

function readPreference(storage = globalThis.localStorage) {
    try { return validPreference(storage?.getItem(THEME_STORAGE_KEY)); } catch { return 'system'; }
}

function systemTheme() {
    try { return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } catch { return 'light'; }
}

export function applyTheme(preference) {
    const selected = validPreference(preference);
    const resolved = selected === 'system' ? systemTheme() : selected;
    if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = resolved;
        document.documentElement.dataset.themePreference = selected;
    }
    return resolved;
}

function updateTheme() {
    applyTheme(preference.value);
}

export function initializeTheme() {
    if (initialized) {
        updateTheme();
        return preference.value;
    }

    initialized = true;
    preference.value = readPreference();
    updateTheme();
    mediaQuery = globalThis.matchMedia?.('(prefers-color-scheme: dark)');
    mediaQuery?.addEventListener?.('change', updateTheme);

    return preference.value;
}

export function useTheme() {
    initializeTheme();

    function setPreference(value) {
        preference.value = validPreference(value);
        try { globalThis.localStorage?.setItem(THEME_STORAGE_KEY, preference.value); } catch { /* blocked storage is non-fatal */ }
        updateTheme();
    }

    return { preference, setPreference, resolvedTheme: updateTheme };
}
