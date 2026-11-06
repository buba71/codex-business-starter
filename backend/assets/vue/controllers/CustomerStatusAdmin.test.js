import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CustomerStatusAdmin from './CustomerStatusAdmin.vue';
import UiSwitch from '../ui/UiSwitch.vue';

const customer = {
    id: 42,
    name: 'Grace Hopper',
    email: 'grace@example.com',
    status: 'INACTIVE',
};

function response(status, body) {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: vi.fn().mockResolvedValue(body),
        clone: () => response(status, body),
    };
}

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('CustomerStatusAdmin', () => {
    it('displays loading and then the customer with an activate action', async () => {
        const fetchMock = vi.fn().mockResolvedValue(response(200, customer));
        vi.stubGlobal('fetch', fetchMock);

        const wrapper = mount(CustomerStatusAdmin, { props: { id: customer.id } });

        expect(wrapper.text()).toContain('Loading customer...');
        await flushPromises();

        expect(wrapper.text()).toContain('Grace Hopper');
        expect(wrapper.text()).toContain('INACTIVE');
        expect(wrapper.findComponent(UiSwitch).exists()).toBe(true);
        const statusSwitch = wrapper.get('[role="switch"]');
        expect(statusSwitch.attributes('aria-label')).toBe('Activate customer');
        expect(statusSwitch.attributes('aria-checked')).toBe('false');
        expect(statusSwitch.attributes('type')).toBe('checkbox');
        expect(fetchMock).toHaveBeenCalledWith('/api/v1/customers/42', {
            credentials: 'same-origin',
            headers: { Accept: 'application/json' },
            method: 'GET',
        });
    });

    it('updates status from the successful PATCH response', async () => {
        const updatedCustomer = { ...customer, status: 'ACTIVE' };
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response(200, customer))
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockResolvedValueOnce(response(200, updatedCustomer));
        vi.stubGlobal('fetch', fetchMock);

        const wrapper = mount(CustomerStatusAdmin, { props: { id: customer.id } });
        await flushPromises();
        await wrapper.get('[role="switch"]').setValue(true);
        await flushPromises();

        expect(fetchMock.mock.calls[2][0]).toBe('/api/v1/customers/42');
        const patchOptions = fetchMock.mock.calls[2][1];
        expect(patchOptions.method).toBe('PATCH');
        expect(patchOptions.body).toBe(JSON.stringify({ status: 'ACTIVE' }));
        expect(patchOptions.headers.get('Accept')).toBe('application/json');
        expect(patchOptions.headers.get('Content-Type')).toBe('application/json');
        expect(patchOptions.headers.get('X-CSRF-Token')).toBe('csrf-token');
        expect(wrapper.text()).toContain('ACTIVE');
        const statusSwitch = wrapper.get('[role="switch"]');
        expect(statusSwitch.attributes('aria-label')).toBe('Deactivate customer');
        expect(statusSwitch.attributes('aria-checked')).toBe('true');
    });

    it('prevents duplicate submissions while the PATCH is pending', async () => {
        let resolvePatch;
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response(200, customer))
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockImplementationOnce(() => new Promise((resolve) => { resolvePatch = resolve; }));
        vi.stubGlobal('fetch', fetchMock);

        const wrapper = mount(CustomerStatusAdmin, { props: { id: customer.id } });
        await flushPromises();
        const statusSwitch = wrapper.get('[role="switch"]');
        await statusSwitch.setValue(true);
        await statusSwitch.setValue(false);

        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(statusSwitch.attributes('disabled')).toBeDefined();
        expect(statusSwitch.attributes('aria-busy')).toBe('true');
        expect(statusSwitch.attributes('aria-checked')).toBe('true');
        expect(wrapper.text()).toContain('INACTIVE');

        resolvePatch(response(200, { ...customer, status: 'ACTIVE' }));
        await flushPromises();

        expect(statusSwitch.attributes('disabled')).toBeUndefined();
        expect(statusSwitch.attributes('aria-checked')).toBe('true');
    });

    it('keeps the current status and displays an error when PATCH fails', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response(200, customer))
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockResolvedValueOnce(response(500));
        vi.stubGlobal('fetch', fetchMock);

        const wrapper = mount(CustomerStatusAdmin, { props: { id: customer.id } });
        await flushPromises();
        await wrapper.get('[role="switch"]').setValue(true);
        await flushPromises();

        expect(wrapper.text()).toContain('INACTIVE');
        expect(wrapper.text()).toContain('Unable to update the customer.');
        const statusSwitch = wrapper.get('[role="switch"]');
        expect(statusSwitch.attributes('aria-label')).toBe('Activate customer');
        expect(statusSwitch.attributes('aria-checked')).toBe('false');
    });

    it('keeps the current status when the PATCH is rejected for CSRF', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response(200, customer))
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockResolvedValueOnce(response(403, { error: { code: 'csrf_token_invalid' } }));
        vi.stubGlobal('fetch', fetchMock);

        const wrapper = mount(CustomerStatusAdmin, { props: { id: customer.id } });
        await flushPromises();
        await wrapper.get('[role="switch"]').setValue(true);
        await flushPromises();

        expect(wrapper.text()).toContain('INACTIVE');
        expect(wrapper.text()).toContain('security token could not be verified');
    });

    it('displays a not-found error for a 404 response', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(404)));

        const wrapper = mount(CustomerStatusAdmin, { props: { id: customer.id } });
        await flushPromises();

        expect(wrapper.get('[role="alert"]').text()).toBe('Customer not found.');
        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('handles a network error during the initial load', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

        const wrapper = mount(CustomerStatusAdmin, { props: { id: customer.id } });
        await flushPromises();

        expect(wrapper.get('[role="alert"]').text()).toContain('Please check your connection');
        expect(wrapper.get('button').text()).toBe('Retry');
    });
});
