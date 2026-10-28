import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyTheme, initializeTheme, THEME_STORAGE_KEY } from './theme.js';

afterEach(() => vi.restoreAllMocks());

describe('theme preference', () => {
    it('applies explicit themes and validates unsupported preferences', () => {
        expect(applyTheme('dark')).toBe('dark');
        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(applyTheme('invalid')).toBe('light');
        expect(document.documentElement.dataset.themePreference).toBe('system');
    });

    it('resolves system preference and does not require storage', () => {
        vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
        expect(applyTheme('system')).toBe('dark');
        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(THEME_STORAGE_KEY).toBe('business-starter-theme');
    });

    it('initializes the system listener only once', () => {
        const addEventListener = vi.fn();
        vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener })));

        initializeTheme();
        initializeTheme();

        expect(addEventListener).toHaveBeenCalledTimes(1);
    });
});
