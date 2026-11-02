import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiDialog from './UiDialog.vue';

describe('UiDialog', () => {
    it('closes on Escape and returns focus to the trigger', async () => {
        const trigger = document.createElement('button');
        document.body.append(trigger);
        trigger.focus();
        const wrapper = mount(UiDialog, { attachTo: document.body, props: { open: true, title: 'Confirm action' }, slots: { default: 'Dialog content' } });
        const dialog = document.body.querySelector('[role="dialog"]');
        dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(wrapper.emitted('update:open')).toEqual([[false]]);
        await wrapper.setProps({ open: false });
        expect(document.activeElement).toBe(trigger);
        wrapper.unmount();
        trigger.remove();
    });
});
