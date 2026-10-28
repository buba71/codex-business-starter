<template>
  <div class="ui-state ui-empty">
    <strong v-if="$slots.title"><slot name="title" /></strong><slot />
  </div>
</template>
