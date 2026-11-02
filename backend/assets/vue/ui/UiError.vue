<script setup>
import UiAlert from './UiAlert.vue';
import UiButton from './UiButton.vue';

defineProps({ retryable: Boolean });
defineEmits(['retry']);
</script>

<template>
  <div class="ui-state ui-error">
    <UiAlert type="danger">
      <slot />
    </UiAlert><UiButton
      v-if="retryable"
      variant="secondary"
      @click="$emit('retry')"
    >
      Retry
    </UiButton>
  </div>
</template>
