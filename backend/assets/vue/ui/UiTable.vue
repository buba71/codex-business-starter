<script setup>
defineProps({ caption: { type: String, default: '' } });
</script>

<template>
  <div class="ui-table-wrap">
    <table class="ui-table">
      <caption v-if="caption">
        {{ caption }}
      </caption><thead v-if="$slots.head">
        <slot name="head" />
      </thead><tbody><slot /></tbody>
    </table>
  </div>
</template>
