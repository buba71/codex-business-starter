<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({ open: Boolean, title: { type: String, required: true }, describedBy: { type: String, default: '' } });
const emit = defineEmits(['update:open', 'close']);
const dialog = ref(null);
let previousFocus;

function close() { emit('update:open', false); emit('close'); }
function onKeydown(event) {
    if (event.key === 'Escape') return close();
    if (event.key !== 'Tab' || !dialog.value) return;
    const focusable = [...dialog.value.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0]; const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

watch(() => props.open, async (open) => {
    if (open) {
        previousFocus = document.activeElement;
        document.body.classList.add('ui-dialog-open');
        await nextTick();
        dialog.value?.querySelector('[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
    } else {
        document.body.classList.remove('ui-dialog-open');
        previousFocus?.focus?.();
    }
}, { immediate: true });
onBeforeUnmount(() => document.body.classList.remove('ui-dialog-open'));
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="ui-dialog-backdrop"
      @click.self="close"
    >
      <section
        ref="dialog"
        class="ui-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-title`"
        :aria-describedby="describedBy || undefined"
        @keydown="onKeydown"
      >
        <header class="ui-dialog__header">
          <h2 :id="`${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-title`">
            {{ title }}
          </h2><button
            type="button"
            class="ui-dialog__close"
            aria-label="Close dialog"
            @click="close"
          >
            ×
          </button>
        </header><div class="ui-dialog__body">
          <slot />
        </div><footer
          v-if="$slots.footer"
          class="ui-dialog__footer"
        >
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </Teleport>
</template>
