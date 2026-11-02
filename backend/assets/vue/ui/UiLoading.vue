<template>
  <div
    class="ui-state ui-loading"
    role="status"
    aria-live="polite"
  >
    <span
      class="ui-loading__spinner"
      aria-hidden="true"
    /><slot>Loading...</slot>
  </div>
</template>
