<script setup lang="ts">
const props = defineProps({
  variant: { type: String, default: 'default' },
  ariaLabel: { type: String, default: '' },
})
</script>

<template>
  <div
    class="card"
    :class="`card--${props.variant}`"
    :aria-label="props.ariaLabel"
  >
    <slot />
  </div>
</template>
