import { describe, expect, it } from 'vitest';
import { DEFAULT_BRAND, resolveBrandConfig } from './brand.js';

describe('brand configuration', () => {
    it('normalizes the documented and bootstrap-friendly shapes', () => {
        expect(resolveBrandConfig({ branding: { name: 'Acme', logo: '/logo.svg', logoAlt: 'Acme logo', palette: { light: { primary: '#123456' } } } })).toEqual({
            name: 'Acme', logo: '/logo.svg', logoAlt: 'Acme logo', palette: { light: { primary: '#123456' }, dark: {} },
        });
    });

    it('falls back to safe defaults and ignores unsupported values', () => {
        expect(resolveBrandConfig({ name: '', logo: 42, palette: { light: { unknown: 'red' } } })).toEqual(DEFAULT_BRAND);
    });
});
