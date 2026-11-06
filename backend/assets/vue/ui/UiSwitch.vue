<script setup>
import { computed, useId } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    disabled: Boolean,
    loading: Boolean,
    id: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue', 'change']);
const generatedId = useId();
const switchId = computed(() => props.id || `switch-${generatedId}`);

function handleChange(event) {
    const value = event.target.checked;
    emit('update:modelValue', value);
    emit('change', value);
}
</script>

<template>
  <div class="ui-switch">
    <input
      v-bind="$attrs"
      :id="switchId"
      class="ui-switch__control"
      type="checkbox"
      role="switch"
      :checked="modelValue"
      :disabled="disabled || loading"
      :aria-checked="modelValue"
      :aria-busy="loading || undefined"
      @change="handleChange"
    >
    <label
      v-if="label"
      class="ui-switch__label"
      :for="switchId"
    >{{ label }}</label>
    <span
      v-if="loading"
      class="ui-loading__spinner"
      aria-hidden="true"
    />
    <span
      v-if="loading"
      class="ui-visually-hidden"
    >Loading</span>
  </div>
</template>

<style scoped>
.ui-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.ui-switch__control {
  width: 3rem;
  height: 1.75rem;
  margin: var(--space-3) 0 0;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  appearance: none;
  background: var(--color-border);
  cursor: pointer;
  transition: background var(--motion), border-color var(--motion);
}

.ui-switch__control::before {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: var(--color-surface-raised);
  content: '';
  transform: translate(.18rem, .18rem);
  transition: transform var(--motion);
}

.ui-switch__control:checked {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.ui-switch__control:checked::before {
  transform: translate(1.42rem, .18rem);
}

.ui-switch__control:disabled {
  cursor: not-allowed;
  opacity: .6;
}

.ui-switch__label {
  cursor: pointer;
}

.ui-switch__control:disabled + .ui-switch__label {
  cursor: not-allowed;
}
</style>
