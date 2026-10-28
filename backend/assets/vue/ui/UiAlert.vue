<script setup>
defineProps({ type: { type: String, default: 'info' }, title: { type: String, default: '' } });
</script>

<template>
  <div
    class="ui-alert"
    :class="`ui-alert--${type}`"
    role="alert"
  >
    <strong v-if="title">{{ title }}</strong><slot />
  </div>
</template>
