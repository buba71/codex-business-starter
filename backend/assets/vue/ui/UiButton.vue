<script setup>
defineOptions({ inheritAttrs: false });
defineProps({ variant: { type: String, default: 'primary' }, loading: Boolean, disabled: Boolean, type: { type: String, default: 'button' } });
</script>

<template>
  <button
    v-bind="$attrs"
    class="ui-button"
    :class="`ui-button--${variant}`"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span
      v-if="loading"
      class="ui-button__spinner"
      aria-hidden="true"
    /><span :class="{ 'ui-visually-hidden': loading }"><slot /></span><span
      v-if="loading"
      class="ui-visually-hidden"
    >Loading</span>
  </button>
</template>
