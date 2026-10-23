import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CustomerDisplay from './CustomerDisplay.vue';

const customer = {
    id: 42,
    name: 'Grace Hopper',
    email: 'grace@example.com',
    status: 'ACTIVE',
};

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('CustomerDisplay', () => {
    it('displays a loading state while the request is pending', () => {
        vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

        const wrapper = mount(CustomerDisplay, {
            props: { id: customer.id },
        });

        expect(wrapper.text()).toContain('Loading customer...');
    });

    it('displays the customer returned by the API', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValue(customer),
        }));

        const wrapper = mount(CustomerDisplay, {
            props: { id: customer.id },
        });

        await flushPromises();

        expect(globalThis.fetch).toHaveBeenCalledWith('/api/v1/customers/42', {
            credentials: 'same-origin',
            method: 'GET',
        });
        expect(wrapper.text()).toContain('42');
        expect(wrapper.text()).toContain('Grace Hopper');
        expect(wrapper.text()).toContain('grace@example.com');
        expect(wrapper.text()).toContain('ACTIVE');
    });

    it('displays a not-found error for a 404 response', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 404,
        }));

        const wrapper = mount(CustomerDisplay, {
            props: { id: customer.id },
        });

        await flushPromises();

        expect(wrapper.get('[role="alert"]').text()).toBe('Customer not found.');
        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('does not offer a retry for another 4xx response', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 403,
        }));

        const wrapper = mount(CustomerDisplay, {
            props: { id: customer.id },
        });

        await flushPromises();

        expect(wrapper.get('[role="alert"]').text()).toBe('Unable to load the customer.');
        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('offers a retry for a 5xx response', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        }));

        const wrapper = mount(CustomerDisplay, {
            props: { id: customer.id },
        });

        await flushPromises();

        expect(wrapper.get('[role="alert"]').text()).toBe('Unable to load the customer.');
        expect(wrapper.get('button').text()).toBe('Retry');
    });

    it('displays a network error and offers a retry when fetch fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')));

        const wrapper = mount(CustomerDisplay, {
            props: { id: customer.id },
        });

        await flushPromises();

        expect(wrapper.get('[role="alert"]').text()).toBe(
            'Unable to load the customer. Please check your connection and try again.',
        );
        expect(wrapper.get('button').text()).toBe('Retry');
    });

    it('clears the error, restores loading, and issues a fresh request on retry', async () => {
        let resolveRetry;
        const fetchMock = vi.fn()
            .mockRejectedValueOnce(new Error('Network failure'))
            .mockImplementationOnce(() => new Promise((resolve) => {
                resolveRetry = resolve;
            }));
        vi.stubGlobal('fetch', fetchMock);

        const wrapper = mount(CustomerDisplay, {
            props: { id: customer.id },
        });

        await flushPromises();
        await wrapper.get('button').trigger('click');

        expect(wrapper.text()).toContain('Loading customer...');
        expect(wrapper.find('[role="alert"]').exists()).toBe(false);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/v1/customers/42', {
            credentials: 'same-origin',
            method: 'GET',
        });

        resolveRetry({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValue(customer),
        });
        await flushPromises();

        expect(wrapper.text()).toContain('Grace Hopper');
        expect(wrapper.find('button').exists()).toBe(false);
    });
});
