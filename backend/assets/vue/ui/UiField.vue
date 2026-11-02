<script setup>
import { computed, useId } from 'vue';

const props = defineProps({ label: { type: String, required: true }, modelValue: { type: [String, Number], default: '' }, error: { type: String, default: '' }, hint: { type: String, default: '' }, id: { type: String, default: '' } });
const emit = defineEmits(['update:modelValue']);
const generatedId = useId();
const fieldId = computed(() => props.id || `field-${generatedId}`);
const descriptionId = computed(() => `${fieldId.value}-description`);
</script>

<template>
  <div class="ui-field">
    <label
      class="ui-label"
      :for="fieldId"
    ><slot name="label">{{ label }}</slot></label><input
      v-bind="$attrs"
      :id="fieldId"
      class="ui-input"
      :value="modelValue"
      :aria-describedby="(hint || error) ? descriptionId : undefined"
      :aria-invalid="error ? 'true' : undefined"
      @input="emit('update:modelValue', $event.target.value)"
    ><small
      v-if="hint || error"
      :id="descriptionId"
      class="ui-field__message"
      :class="{ 'ui-field__message--error': error }"
    >{{ error || hint }}</small>
  </div>
</template>
