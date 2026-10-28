import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdminShell from './AdminShell.vue';

afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
});

describe('AdminShell', () => {
    it('renders trusted branding, logout contract and navigation', () => {
        const wrapper = mount(AdminShell, { props: { brand: { name: 'Acme', logoAlt: 'Acme logo' }, logoutUrl: '/logout', logoutCsrfToken: 'token', navigation: [{ label: 'Customers', href: '/customers' }] } });
        expect(wrapper.text()).toContain('Acme');
        expect(wrapper.get('form').attributes('action')).toBe('/logout');
        expect(wrapper.get('input[name="_csrf_token"]').attributes('value')).toBe('token');
        expect(wrapper.get('nav').text()).toContain('Customers');
    });

    it('controls mobile navigation with an accessible toggle', async () => {
        vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
        const wrapper = mount(AdminShell, { attachTo: document.body });
        const toggle = wrapper.get('.admin-menu-toggle');
        expect(toggle.attributes('aria-expanded')).toBe('false');
        expect(wrapper.get('#admin-navigation').attributes('aria-hidden')).toBe('true');
        expect(wrapper.get('#admin-navigation').attributes('inert')).toBe('true');
        await toggle.trigger('click');
        expect(toggle.attributes('aria-expanded')).toBe('true');
        expect(wrapper.get('#admin-navigation').classes()).toContain('admin-sidebar--open');
        expect(wrapper.get('#admin-navigation').attributes('aria-hidden')).toBe('false');
        expect(wrapper.get('#admin-navigation').attributes('inert')).toBe('false');
        expect(document.activeElement).toBe(wrapper.get('nav a').element);
        wrapper.unmount();
    });

    it('restores focus and closes the drawer with Escape', async () => {
        vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
        const wrapper = mount(AdminShell, { attachTo: document.body });
        const toggle = wrapper.get('.admin-menu-toggle');

        await toggle.trigger('click');
        await wrapper.get('#admin-navigation').trigger('keydown.esc');

        expect(toggle.attributes('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(toggle.element);
        expect(wrapper.get('#admin-navigation').attributes('aria-hidden')).toBe('true');
        wrapper.unmount();
    });

    it('keeps desktop navigation exposed when the drawer is closed', () => {
        vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
        const wrapper = mount(AdminShell);

        expect(wrapper.get('#admin-navigation').attributes('aria-hidden')).toBe('false');
        expect(wrapper.get('#admin-navigation').attributes('inert')).toBe('false');
    });

    it('provides the main content landmark', () => {
        vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
        expect(mount(AdminShell).get('main#main-content').exists()).toBe(true);
    });
});
