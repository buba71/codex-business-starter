import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiSwitch from './UiSwitch.vue';

describe('UiSwitch', () => {
    it('exposes an accessible controlled switch and emits its new value', async () => {
        const wrapper = mount(UiSwitch, {
            props: {
                modelValue: false,
                label: 'Enable notifications',
            },
        });

        const input = wrapper.get('[role="switch"]');

        expect(input.attributes('type')).toBe('checkbox');
        expect(input.attributes('aria-checked')).toBe('false');
        expect(input.attributes('id')).toBeTruthy();
        expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'));

        await input.setValue(true);

        expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
        expect(wrapper.emitted('change')).toEqual([[true]]);
    });

    it('forwards aria-label and disables the switch while loading', () => {
        const wrapper = mount(UiSwitch, {
            attrs: { 'aria-label': 'Enable customer' },
            props: { loading: true },
        });

        const input = wrapper.get('[role="switch"]');

        expect(input.attributes('aria-label')).toBe('Enable customer');
        expect(input.attributes('aria-busy')).toBe('true');
        expect(input.attributes('disabled')).toBeDefined();
        expect(wrapper.find('.ui-visually-hidden').text()).toBe('Loading');
    });
});
